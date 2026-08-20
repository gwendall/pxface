#!/usr/bin/env python3
"""Build deterministic PXFACE font binaries from the canonical TypeScript glyph map."""

from __future__ import annotations

import ast
import hashlib
import json
import re
import zipfile
from pathlib import Path

try:
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.t2CharStringPen import T2CharStringPen
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    from fontTools.ttLib import TTFont
except ModuleNotFoundError as error:
    raise SystemExit("Install fonttools with WOFF support: python3 -m pip install 'fonttools[woff]'") from error


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "packages/pxface/src/pixel-font-data.ts"
OUTPUT = ROOT / "public/fonts"
LICENSE = ROOT / "LICENSES/OFL-1.1.txt"
FONTLOG = ROOT / "FONTLOG.md"
UNITS_PER_EM = 1000
PIXEL = 160
ASCENDER = 800
DESCENDER = -200
FONT_NAME = "PXFACE 3x5"
PS_NAME = "PXFACE-3x5"
VERSION = "2.0.0"
FILE_STEM = "PXFACE3x5-Regular"
RELEASE_STEM = "PXFACE3x5"
COPYRIGHT = 'Copyright (c) 2026, Gwendall Esnault (https://gwendall.com), with Reserved Font Name "PXFACE".'
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
        "copyright": COPYRIGHT,
        "familyName": FONT_NAME,
        "styleName": "Regular",
        "uniqueFontIdentifier": f"{FONT_NAME} Regular {VERSION}",
        "fullName": f"{FONT_NAME} Regular",
        "psName": PS_NAME,
        "version": f"Version {VERSION}",
        "manufacturer": "Gwendall Esnault",
        "designer": "Gwendall Esnault",
        "description": "A proportional 3x5 pixel display font generated from the PXFACE CC0 glyph set.",
        "licenseDescription": "Licensed under the SIL Open Font License, Version 1.1, with Reserved Font Name PXFACE.",
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
        achVendID="PXFC",
    )
    font.setupPost(italicAngle=0, underlinePosition=-120, underlineThickness=80)
    font.setupHead(created=MAC_EPOCH_TIMESTAMP, modified=MAC_EPOCH_TIMESTAMP)


def save_variants(ttf_path: Path):
    for flavor, suffix in (("woff", ".woff"), ("woff2", ".woff2")):
        font = TTFont(ttf_path, recalcTimestamp=False)
        font.flavor = flavor
        font.recalcTimestamp = False
        font.save(OUTPUT / f"{PS_NAME}{suffix}")


def package_readme(package: str, recommendation: str) -> bytes:
    return f"""PXFACE 3x5 — Version {VERSION}

A proportional five-pixel-high display font generated from the same glyphs as pxface.com.

PACKAGE
{package}

RECOMMENDED USE
{recommendation}

Do not install both the TTF and OTF versions. They represent the same family and
style, so installing both can create duplicate-family warnings.

WEB
Copy the web font files and pxface-3x5.css into the same directory, then link the
stylesheet or copy its @font-face rule. WOFF2 is the recommended browser format;
WOFF is included only as a legacy fallback.

DESKTOP
macOS: open PXFACE3x5-Regular.ttf, then choose Install Font in Font Book.
Windows: right-click PXFACE3x5-Regular.ttf, then choose Install or Install for all users.
Linux: copy the TTF or OTF to ~/.local/share/fonts and run fc-cache -f.

LICENSE
Font software is OFL-1.1 with Reserved Font Name PXFACE. Documents and graphics made with the font are not placed under the OFL. See OFL.txt.

The font contains glyph outlines and metrics. Use https://pxface.com for pixel
gap, depth, random colors, padding, canvas ratios, and editable per-pixel SVG.

Documentation: https://pxface.com/font
""".encode("utf-8")


def write_zip(path: Path, entries: dict[str, bytes]):
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(entries):
            info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, entries[name], compresslevel=9)


def build_packages():
    version_dir = OUTPUT / f"v{VERSION}"
    version_dir.mkdir(parents=True, exist_ok=True)
    license_text = LICENSE.read_bytes()
    css = (OUTPUT / "pxface-3x5.css").read_bytes().replace(f"./v{VERSION}/".encode(), b"./")
    binaries = {suffix: (OUTPUT / f"{PS_NAME}.{suffix}").read_bytes() for suffix in ("ttf", "otf", "woff", "woff2")}
    canonical_paths: dict[str, Path] = {}
    for suffix, data in binaries.items():
        path = version_dir / f"{FILE_STEM}.{suffix}"
        path.write_bytes(data)
        canonical_paths[suffix] = path

    package_names = {
        "ttf": f"{RELEASE_STEM}-TTF-v{VERSION}.zip",
        "otf": f"{RELEASE_STEM}-OTF-v{VERSION}.zip",
        "web": f"{RELEASE_STEM}-Web-v{VERSION}.zip",
        "all": f"{RELEASE_STEM}-v{VERSION}.zip",
    }
    for stale_name in (
        f"{PS_NAME}-v{VERSION}.zip",
        f"{PS_NAME}-desktop-v{VERSION}.zip",
        f"{PS_NAME}-web-v{VERSION}.zip",
    ):
        (OUTPUT / stale_name).unlink(missing_ok=True)

    ttf_root = f"{RELEASE_STEM}-TTF-v{VERSION}"
    write_zip(OUTPUT / package_names["ttf"], {
        f"{ttf_root}/OFL.txt": license_text,
        f"{ttf_root}/README.txt": package_readme(
            "TTF desktop font.",
            "Install PXFACE3x5-Regular.ttf. TTF is the default choice for desktop apps, Windows, macOS, Linux, Office, Figma, and most design tools.",
        ),
        f"{ttf_root}/{FILE_STEM}.ttf": binaries["ttf"],
    })

    otf_root = f"{RELEASE_STEM}-OTF-v{VERSION}"
    write_zip(OUTPUT / package_names["otf"], {
        f"{otf_root}/OFL.txt": license_text,
        f"{otf_root}/README.txt": package_readme(
            "OTF desktop font.",
            "Install PXFACE3x5-Regular.otf only when your workflow specifically prefers OTF. It contains the same family, style, and character set as the TTF.",
        ),
        f"{otf_root}/{FILE_STEM}.otf": binaries["otf"],
    })

    web_root = f"{RELEASE_STEM}-Web-v{VERSION}"
    write_zip(OUTPUT / package_names["web"], {
        f"{web_root}/OFL.txt": license_text,
        f"{web_root}/README.txt": package_readme(
            "Self-hosted web fonts and CSS.",
            "Serve PXFACE3x5-Regular.woff2 with pxface-3x5.css. Keep WOFF only if you need a legacy fallback.",
        ),
        f"{web_root}/{FILE_STEM}.woff": binaries["woff"],
        f"{web_root}/{FILE_STEM}.woff2": binaries["woff2"],
        f"{web_root}/pxface-3x5.css": css,
    })

    binary_manifest = {
        f"{FILE_STEM}.{suffix}": {
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
        }
        for suffix, data in binaries.items()
    }
    sha256sums = "".join(
        f"{metadata['sha256']}  {name}\n" for name, metadata in sorted(binary_manifest.items())
    ).encode("utf-8")
    faq = (
        "PXFACE uses the SIL Open Font License 1.1.\n\n"
        "Read the official OFL FAQ at https://openfontlicense.org/ofl-faq/\n"
        "The license itself is included as OFL.txt.\n"
    ).encode("utf-8")
    all_root = f"{RELEASE_STEM}-v{VERSION}"
    write_zip(OUTPUT / package_names["all"], {
        f"{all_root}/OFL.txt": license_text,
        f"{all_root}/OFL-FAQ.txt": faq,
        f"{all_root}/FONTLOG.md": FONTLOG.read_bytes(),
        f"{all_root}/README.txt": package_readme(
            "Complete release: TTF, OTF, WOFF2, WOFF, CSS, checksums, manifest, and license documentation.",
            "For desktop, install only desktop/ttf/PXFACE3x5-Regular.ttf. For web, use web/PXFACE3x5-Regular.woff2 and web/pxface-3x5.css.",
        ),
        f"{all_root}/SHA256SUMS.txt": sha256sums,
        f"{all_root}/manifest.json": (json.dumps(binary_manifest, indent=2) + "\n").encode("utf-8"),
        f"{all_root}/desktop/otf/{FILE_STEM}.otf": binaries["otf"],
        f"{all_root}/desktop/ttf/{FILE_STEM}.ttf": binaries["ttf"],
        f"{all_root}/web/{FILE_STEM}.woff": binaries["woff"],
        f"{all_root}/web/{FILE_STEM}.woff2": binaries["woff2"],
        f"{all_root}/web/pxface-3x5.css": css,
    })

    artifacts = list(canonical_paths.values()) + [OUTPUT / name for name in package_names.values()]
    purposes = {
        f"{FILE_STEM}.ttf": "Recommended desktop font",
        f"{FILE_STEM}.otf": "Alternative desktop font",
        f"{FILE_STEM}.woff2": "Recommended web font",
        f"{FILE_STEM}.woff": "Legacy web fallback",
        package_names["ttf"]: "Recommended desktop package",
        package_names["otf"]: "Alternative OTF desktop package",
        package_names["web"]: "Self-hosted web kit",
        package_names["all"]: "Complete release package",
    }
    manifest = {
        "family": FONT_NAME,
        "style": "Regular 400",
        "version": VERSION,
        "license": "OFL-1.1",
        "reservedFontName": "PXFACE",
        "artifacts": {
            (f"v{VERSION}/{artifact.name}" if artifact.parent == version_dir else artifact.name): {
                "bytes": artifact.stat().st_size,
                "sha256": hashlib.sha256(artifact.read_bytes()).hexdigest(),
                "url": f"/fonts/{f'v{VERSION}/' if artifact.parent == version_dir else ''}{artifact.name}",
                "purpose": purposes[artifact.name],
            }
            for artifact in artifacts
        },
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


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

    build_packages()

    print(f"Built {FONT_NAME} {VERSION}: TTF, OTF, WOFF, WOFF2, 4 ZIP packages ({len(cmap)} cmap entries)")


if __name__ == "__main__":
    main()
