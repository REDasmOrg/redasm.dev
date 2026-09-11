#!/usr/bin/env python3
"""
REDasm Download Append Script
Reads releases.json, extracts download counts for the last 3 tracked versions,
appends a new row to downloads.csv if today's date is not already present.

Run from the root of the data branch:
    python3 scripts/append_downloads.py
"""

import csv
from datetime import datetime, timezone
from pathlib import Path
from common import load_tracked_releases, PLATFORM_ORDER

DOWNLOADS_CSV = Path("downloads.csv")


def load_existing_dates(csv_path: Path) -> set:
    if not csv_path.exists():
        return set()
    with csv_path.open(newline="", encoding="utf-8") as f:
        return {row["date"] for row in csv.DictReader(f)}


def load_fieldnames(csv_path: Path) -> list | None:
    if not csv_path.exists():
        return None
    with csv_path.open(newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames


def build_fieldnames(releases: list, existing: list | None) -> list:
    versions = [r["tag"] for r in releases]
    platforms = [p for p in PLATFORM_ORDER
                 if any(p in r["platforms"] for r in releases)]
    new_cols = ["date"] + [f"{v}_{p}" for v in versions for p in platforms]
    if existing is None:
        return new_cols
    merged = list(existing)
    for col in new_cols:
        if col not in merged:
            merged.append(col)
    return merged


def main():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if today in load_existing_dates(DOWNLOADS_CSV):
        print(f"Already have data for {today}, skipping.")
        return

    releases = load_tracked_releases()
    if not releases:
        print("No tracked releases found, skipping.")
        return

    existing = load_fieldnames(DOWNLOADS_CSV)
    fieldnames = build_fieldnames(releases, existing)

    # Build counts lookup
    counts = {r["tag"]: r["platforms"] for r in releases}

    row = {"date": today}
    for col in fieldnames:
        if col == "date":
            continue
        version, platform = col.rsplit("_", 1)
        row[col] = counts.get(version, {}).get(platform, 0)

    write_header = not DOWNLOADS_CSV.exists()
    with DOWNLOADS_CSV.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if write_header:
            writer.writeheader()
        writer.writerow(row)

    print(f"Appended {today}: {{r['tag']: r['platforms'] for r in releases}}")


if __name__ == "__main__":
    main()
