#!/usr/bin/env python3
"""Verify PXWORD font metadata, artifacts, checksums, and exact archive trees."""

from __future__ import annotations

import hashlib
import json
import zipfile
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public/fonts"
VERSION = "1.0.0"
FILE_STEM = "PXWORD3x5-Regular"
COPYRIGHT = 'Copyright (c) 2026, Gwendall Esnault (https://gwendall.com), with Reserved Font Name "PXWORD".'

SIGNATURES = {
    f"v{VERSION}/{FILE_STEM}.ttf": b"\x00\x01\x00\x00",
    f"v{VERSION}/{FILE_STEM}.otf": b"OTTO",
    f"v{VERSION}/{FILE_STEM}.woff": b"wOFF",
    f"v{VERSION}/{FILE_STEM}.woff2": b"wOF2",
}

EXPECTED_ARCHIVES = {
    f"PXWORD3x5-TTF-v{VERSION}.zip": {
        "OFL.txt", "README.txt", f"{FILE_STEM}.ttf",
    },
    f"PXWORD3x5-OTF-v{VERSION}.zip": {
        "OFL.txt", "README.txt", f"{FILE_STEM}.otf",
    },
    f"PXWORD3x5-Web-v{VERSION}.zip": {
        "OFL.txt", "README.txt", f"{FILE_STEM}.woff", f"{FILE_STEM}.woff2", "pxword-3x5.css",
    },
    f"PXWORD3x5-v{VERSION}.zip": {
        "OFL.txt", "OFL-FAQ.txt", "FONTLOG.md", "README.txt", "SHA256SUMS.txt", "manifest.json",
        f"desktop/otf/{FILE_STEM}.otf", f"desktop/ttf/{FILE_STEM}.ttf",
        f"web/{FILE_STEM}.woff", f"web/{FILE_STEM}.woff2", "web/pxword-3x5.css",
    },
}


def archive_tree(path: Path) -> set[str]:
    with zipfile.ZipFile(path) as archive:
        assert archive.testzip() is None, f"Corrupt archive: {path.name}"
        entries = [name for name in archive.namelist() if not name.endswith("/")]
    roots = {entry.split("/", 1)[0] for entry in entries}
    assert len(roots) == 1, f"Archive needs one root directory: {path.name}"
    return {entry.split("/", 1)[1] for entry in entries}


def verify_font_metadata(relative_path: str):
    font = TTFont(FONTS / relative_path)
    names = font["name"]
    assert names.getDebugName(0) == COPYRIGHT, f"Missing copyright metadata: {relative_path}"
    assert names.getDebugName(1) == "PXWORD 3x5", f"Wrong family name: {relative_path}"
    assert names.getDebugName(2) == "Regular", f"Wrong style name: {relative_path}"
    assert names.getDebugName(5) == f"Version {VERSION}", f"Wrong version: {relative_path}"
    assert "SIL Open Font License" in (names.getDebugName(13) or ""), f"Missing OFL metadata: {relative_path}"
    cmap = font.getBestCmap()
    assert all(codepoint in cmap for codepoint in range(32, 127)), f"Incomplete printable ASCII cmap: {relative_path}"


def main():
    manifest = json.loads((FONTS / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"] == VERSION
    assert manifest["style"] == "Regular 400"
    assert manifest["reservedFontName"] == "PXWORD"

    for relative_path, signature in SIGNATURES.items():
        assert (FONTS / relative_path).read_bytes()[:4] == signature, f"Invalid signature: {relative_path}"
    for relative_path in (f"v{VERSION}/{FILE_STEM}.ttf", f"v{VERSION}/{FILE_STEM}.otf"):
        verify_font_metadata(relative_path)

    for name, expected_tree in EXPECTED_ARCHIVES.items():
        actual_tree = archive_tree(FONTS / name)
        assert actual_tree == expected_tree, f"Wrong archive tree in {name}: {actual_tree ^ expected_tree}"
    with zipfile.ZipFile(FONTS / f"PXWORD3x5-Web-v{VERSION}.zip") as archive:
        css_name = f"PXWORD3x5-Web-v{VERSION}/pxword-3x5.css"
        css = archive.read(css_name).decode("utf-8")
        assert 'url("./PXWORD3x5-Regular.woff2")' in css, "Web kit CSS must use portable relative URLs"
        assert f"v{VERSION}" not in css, "Web kit CSS must not depend on pxword.com paths"

    assert set(manifest["artifacts"]) == set(SIGNATURES) | set(EXPECTED_ARCHIVES)
    for relative_path, metadata in manifest["artifacts"].items():
        path = FONTS / relative_path
        assert metadata["url"] == f"/fonts/{relative_path}", f"Wrong URL: {relative_path}"
        assert path.stat().st_size == metadata["bytes"], f"Wrong size: {relative_path}"
        assert hashlib.sha256(path.read_bytes()).hexdigest() == metadata["sha256"], f"Wrong checksum: {relative_path}"

    print(f"Verified {len(manifest['artifacts'])} font artifacts, metadata, and {len(EXPECTED_ARCHIVES)} exact archive trees")


if __name__ == "__main__":
    main()
