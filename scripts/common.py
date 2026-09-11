#!/usr/bin/env python3
"""
Shared utilities for REDasm download tracking scripts.
Reads releases.json to derive versions, release dates, and platform info.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

RELEASES_JSON = Path("releases.json")
EXCLUDE_TAGS = {"nightly"}
TRACKED_PREFIX = "v4.0.0"
MAX_VERSIONS = 3
SKIP_EXTENSIONS = {".sha256", ".asc", ".sig"}

WINDOWS_PATTERNS = ["-windows-", "_windows_"]
LINUX_PATTERNS = ["-linux-", "_linux_", "_amd64"]
MACOS_PATTERNS = ["-macos-", "-darwin-", "_macos_", "_darwin_"]

PLATFORM_LABELS = {
    "windows": "Windows",
    "linux": "Linux",
    "macos": "macOS",
}

PLATFORM_ORDER = ["windows", "linux", "macos"]


def classify_asset(name: str) -> str | None:
    lower = name.lower()
    for ext in SKIP_EXTENSIONS:
        if lower.endswith(ext):
            return None
    for p in WINDOWS_PATTERNS:
        if p in lower:
            return "windows"
    for p in LINUX_PATTERNS:
        if p in lower:
            return "linux"
    for p in MACOS_PATTERNS:
        if p in lower:
            return "macos"
    return None


def load_tracked_releases(releases_path: Path = RELEASES_JSON) -> list[dict]:
    """
    Returns last MAX_VERSIONS non-nightly tracked releases, oldest first.
    Each dict: {tag, date, platforms: {platform: total_count}}
    """
    raw = json.loads(releases_path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        return []

    tracked = []
    for release in raw:
        if not isinstance(release, dict):
            continue
        tag = release.get("tag_name", "")
        if tag in EXCLUDE_TAGS or not tag.startswith(TRACKED_PREFIX):
            continue

        published = release.get("published_at", "")
        try:
            date = datetime.strptime(published, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        except ValueError:
            continue

        platforms = {}
        for asset in release.get("assets", []):
            kind = classify_asset(asset.get("name", ""))
            count = asset.get("download_count", 0)
            if kind:
                platforms[kind] = platforms.get(kind, 0) + count

        tracked.append({"tag": tag, "date": date, "platforms": platforms})

    # Sort by date, take last MAX_VERSIONS
    tracked.sort(key=lambda r: r["date"])
    return tracked[-MAX_VERSIONS:]


def version_color(tag: str) -> str:
    """Deterministic, visually distinct color from tag name via MD5 + golden ratio hue."""
    import hashlib
    import colorsys
    val = int.from_bytes(hashlib.md5(tag.encode()).digest()[:4], "big")
    hue = (val * 0.618033988) % 1.0
    r, g, b = colorsys.hls_to_rgb(hue, 0.45, 0.65)
    return f"#{int(r * 255):02X}{int(g * 255):02X}{int(b * 255):02X}"


def version_colors(ordered_versions: list[str]) -> dict[str, str]:
    """Returns {tag: hex_color} for all versions."""
    return {v: version_color(v) for v in ordered_versions}
