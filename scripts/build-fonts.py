#!/usr/bin/env python3
"""Build deterministic PXWORD font binaries from the canonical TypeScript glyph map."""

from __future__ import annotations

import ast
import re
from pathlib import Path

try:
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.t2CharStringPen import T2CharStringPen
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    from fontTools.ttLib import TTFont
except ModuleNotFoundError as error:
    raise SystemExit("Install fonttools with WOFF support: python3 -m pip install 'fonttools[woff]'") from error


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/lib/pixel-font-data.ts"
OUTPUT = ROOT / "public/fonts"
UNITS_PER_EM = 1000
PIXEL = 160
ASCENDER = 800
DESCENDER = -200
FONT_NAME = "PXWORD 3x5"
PS_NAME = "PXWORD-3x5"
VERSION = "1.0.0"
MAC_EPOCH_TIMESTAMP = 3849984000  # 2026-01-01, deterministic.


def read_glyphs() -> dict[str, list[str]]:
    source = SOURCE.read_text(encoding="utf-8")
    entry = re.compile(
        r"^\s*(?:(?P<bare>[A-Z_])|(?P<quote>['\"])(?P<quoted>.*?)(?P=quote)):\s*\[(?P<rows>[^\]]+)\],",
        re.MULTILINE,
    )
    glyphs: dict[str, list[str]] = {}
    for match in entry.finditer(source):
        if match.group("bare"):
            character = match.group("bare")
        else:
            character = ast.literal_eval(f"{match.group('quote')}{match.group('quoted')}{match.group('quote')}")
        rows = re.findall(r'"([01]+)"', match.group("rows"))
        if len(rows) != 5:
            raise ValueError(f"{character!r} must have exactly five rows")
        glyphs[character] = rows
    if len(glyphs) != 68:
        raise ValueError(f"Expected 68 source glyphs, found {len(glyphs)}")
    return glyphs


def glyph_name(character: str) -> str:
    return f"uni{ord(character):04X}"


def rectangles(rows: list[str]):
    for row_index, row in enumerate(rows):
        for column, value in enumerate(row):
            if value == "1":
                x = column * PIXEL
                y = (4 - row_index) * PIXEL
                yield x, y, x + PIXEL, y + PIXEL


def draw_ttf(rows: list[str]):
    pen = TTGlyphPen(None)
    for x0, y0, x1, y1 in rectangles(rows):
        pen.moveTo((x0, y0))
        pen.lineTo((x1, y0))
        pen.lineTo((x1, y1))
        pen.lineTo((x0, y1))
        pen.closePath()
    return pen.glyph()


def draw_otf(rows: list[str], width: int):
    pen = T2CharStringPen(width, None)
    for x0, y0, x1, y1 in rectangles(rows):
        pen.moveTo((x0, y0))
        pen.lineTo((x1, y0))
        pen.lineTo((x1, y1))
        pen.lineTo((x0, y1))
        pen.closePath()
    return pen.getCharString(private=None, globalSubrs=None)


def setup_common(font: FontBuilder, glyph_order: list[str], cmap: dict[int, str], metrics: dict[str, tuple[int, int]]):
    font.setupGlyphOrder(glyph_order)
    font.setupCharacterMap(cmap)
    font.setupHorizontalMetrics(metrics)
    font.setupHorizontalHeader(ascent=ASCENDER, descent=DESCENDER, lineGap=0)
    font.setupNameTable({
        "familyName": FONT_NAME,
        "styleName": "Regular",
        "uniqueFontIdentifier": f"{FONT_NAME} Regular {VERSION}",
        "fullName": f"{FONT_NAME} Regular",
        "psName": PS_NAME,
        "version": f"Version {VERSION}",
        "manufacturer": "Gwendall Esnault",
        "designer": "Gwendall Esnault",
        "description": "A proportional 3x5 pixel display font generated from the PXWORD CC0 glyph set.",
        "licenseDescription": "Licensed under the SIL Open Font License, Version 1.1, with Reserved Font Name PXWORD.",
        "licenseInfoURL": "https://openfontlicense.org",
    })
    font.setupOS2(
        sTypoAscender=ASCENDER,
        sTypoDescender=DESCENDER,
        sTypoLineGap=0,
        usWinAscent=ASCENDER,
        usWinDescent=abs(DESCENDER),
        sxHeight=ASCENDER,
        sCapHeight=ASCENDER,
        fsType=0,
        achVendID="PXWD",
    )
    font.setupPost(italicAngle=0, underlinePosition=-120, underlineThickness=80)
    font.setupHead(created=MAC_EPOCH_TIMESTAMP, modified=MAC_EPOCH_TIMESTAMP)


def save_variants(ttf_path: Path):
    for flavor, suffix in (("woff", ".woff"), ("woff2", ".woff2")):
        font = TTFont(ttf_path, recalcTimestamp=False)
        font.flavor = flavor
        font.recalcTimestamp = False
        font.save(OUTPUT / f"{PS_NAME}{suffix}")


def main():
    glyphs = read_glyphs()
    characters = sorted(glyphs, key=ord)
    glyph_order = [".notdef", "space", *[glyph_name(character) for character in characters]]
    cmap = {32: "space"}
    cmap.update({ord(character): glyph_name(character) for character in characters})
    cmap.update({ord(character.lower()): glyph_name(character) for character in characters if "A" <= character <= "Z"})
    metrics = {".notdef": (4 * PIXEL, 0), "space": (4 * PIXEL, 0)}
    metrics.update({glyph_name(character): ((len(glyphs[character][0]) + 1) * PIXEL, 0) for character in characters})

    notdef_rows = ["111", "101", "101", "101", "111"]
    ttf_glyphs = {".notdef": draw_ttf(notdef_rows), "space": draw_ttf(["0"] * 5)}
    ttf_glyphs.update({glyph_name(character): draw_ttf(glyphs[character]) for character in characters})
    ttf = FontBuilder(UNITS_PER_EM, isTTF=True)
    setup_common(ttf, glyph_order, cmap, metrics)
    ttf.setupGlyf(ttf_glyphs)
    ttf.setupMaxp()
    ttf.font.recalcTimestamp = False

    OUTPUT.mkdir(parents=True, exist_ok=True)
    ttf_path = OUTPUT / f"{PS_NAME}.ttf"
    ttf.save(ttf_path)
    save_variants(ttf_path)

    char_strings = {
        ".notdef": draw_otf(notdef_rows, metrics[".notdef"][0]),
        "space": draw_otf(["0"] * 5, metrics["space"][0]),
    }
    char_strings.update({
        glyph_name(character): draw_otf(glyphs[character], metrics[glyph_name(character)][0])
        for character in characters
    })
    otf = FontBuilder(UNITS_PER_EM, isTTF=False)
    setup_common(otf, glyph_order, cmap, metrics)
    otf.setupCFF(PS_NAME, {"FullName": FONT_NAME, "FamilyName": FONT_NAME, "Weight": "Regular"}, char_strings, {})
    otf.setupMaxp()
    otf.font.recalcTimestamp = False
    otf.save(OUTPUT / f"{PS_NAME}.otf")

    print(f"Built {FONT_NAME} {VERSION}: TTF, OTF, WOFF, WOFF2 ({len(cmap)} cmap entries)")


if __name__ == "__main__":
    main()
