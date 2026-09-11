#!/usr/bin/env python3
"""
REDasm Download Append Script
Reads releases.json, extracts download counts for the last 3 tracked versions,
appends a new row to downloads.csv if today's date is not already present.
When tracked versions change, rewrites the CSV to match the new column set.

Run from the root of the data branch:
    python3 scripts/append_downloads.py
"""

import csv
from datetime import datetime, timezone
from pathlib import Path
from common import load_tracked_releases, PLATFORM_ORDER

DOWNLOADS_CSV = Path("downloads.csv")


def build_fieldnames(releases: list) -> list:
    versions = [r["tag"] for r in releases]
    platforms = [p for p in PLATFORM_ORDER
                 if any(p in r["platforms"] for r in releases)]
    return ["date"] + [f"{v}_{p}" for v in versions for p in platforms]


def load_csv(csv_path: Path) -> tuple[list, list | None]:
    """Returns (rows, fieldnames) or ([], None) if file doesn't exist."""
    if not csv_path.exists():
        return [], None
    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader), list(reader.fieldnames)


def rewrite_csv(csv_path: Path, fieldnames: list, rows: list) -> None:
    """Rewrite entire CSV remapping existing rows to new fieldnames."""
    remapped = []
    for row in rows:
        new_row = {"date": row["date"]}
        for col in fieldnames:
            if col == "date":
                continue
            new_row[col] = int(row.get(col, 0))
        remapped.append(new_row)

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(remapped)

    print(f"Rewrote CSV with columns: {fieldnames}")


def main():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    releases = load_tracked_releases()
    if not releases:
        print("No tracked releases found, skipping.")
        return

    fieldnames = build_fieldnames(releases)
    counts = {r["tag"]: r["platforms"] for r in releases}

    existing_rows, existing_fields = load_csv(DOWNLOADS_CSV)

    # Rewrite if columns changed or file is new
    if existing_fields != fieldnames:
        rewrite_csv(DOWNLOADS_CSV, fieldnames, existing_rows)
        existing_rows, _ = load_csv(DOWNLOADS_CSV)

    # Check if today already exists
    if any(row["date"] == today for row in existing_rows):
        print(f"Already have data for {today}, skipping.")
        return

    # Build and append new row
    row = {"date": today}
    for col in fieldnames:
        if col == "date":
            continue
        version, platform = col.rsplit("_", 1)
        row[col] = counts.get(version, {}).get(platform, 0)

    with DOWNLOADS_CSV.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow(row)

    print(f"Appended {today}: {{r['tag']: r['platforms'] for r in releases}}")


if __name__ == "__main__":
    main()
