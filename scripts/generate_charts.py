#!/usr/bin/env python3
"""
REDasm Charts + README Generator
Reads downloads.csv + releases.json, produces per-platform stacked bar charts
(last 30 days, stacked by version) and writes README.md.

Run from the root of the data branch:
    python3 scripts/generate_charts.py [--csv downloads.csv] [--out-dir charts]
"""

from common import (
    load_tracked_releases,
    version_colors,
    PLATFORM_LABELS,
    PLATFORM_ORDER,
)
import matplotlib.ticker as mticker
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import argparse
import csv
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib
matplotlib.use("Agg")


def load_csv(path: str):
    dates, raw = [], {}
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            dates.append(datetime.strptime(row["date"], "%Y-%m-%d"))
            for col, val in row.items():
                if col == "date":
                    continue
                raw.setdefault(col, []).append(int(val))

    versions, platforms = {}, set()
    for col in raw:
        parts = col.rsplit("_", 1)
        if len(parts) != 2:
            continue
        version, platform = parts
        versions.setdefault(version, {})[platform] = raw[col]
        platforms.add(platform)

    ordered_versions = sorted(versions.keys())
    ordered_platforms = [p for p in PLATFORM_ORDER if p in platforms]
    return dates, versions, ordered_versions, ordered_platforms


def compute_deltas(counts: list) -> list:
    deltas = [0]
    for i in range(1, len(counts)):
        deltas.append(max(0, counts[i] - counts[i - 1]))
    return deltas


def chart_platform(dates, versions, ordered_versions, colors,
                   release_dates, platform, out_path: Path):
    cutoff = dates[-1] - timedelta(days=30)
    idx = next((i for i, d in enumerate(dates) if d >= cutoff), 0)
    d30 = dates[idx:]

    fig, ax = plt.subplots(figsize=(13, 5))
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")

    bottom = [0.0] * len(d30)
    any_data = False

    for version in ordered_versions:
        if platform not in versions[version]:
            continue
        color = colors.get(version, "#AAAAAA")
        deltas = compute_deltas(versions[version][platform])[idx:]
        if not any(deltas):
            continue
        any_data = True

        bars = ax.bar(d30, deltas, bottom=bottom, color=color,
                      label=version, width=0.8, zorder=2)

        for bar, delta, bot in zip(bars, deltas, bottom):
            if delta >= 2:
                ax.text(
                    bar.get_x() + bar.get_width() / 2,
                    bot + delta + 0.05,
                    str(delta),
                    ha="center", va="bottom",
                    fontsize=7, color="#333333",
                )
        bottom = [b + d for b, d in zip(bottom, deltas)]

    if not any_data:
        plt.close(fig)
        return False

    # 7-day rolling average trend line
    import numpy as np
    total_deltas = [0.0] * len(d30)
    for version in ordered_versions:
        if platform not in versions[version]:
            continue
        deltas = compute_deltas(versions[version][platform])[idx:]
        total_deltas = [a + b for a, b in zip(total_deltas, deltas)]

    window = min(3, len(total_deltas))
    rolling = np.convolve(total_deltas, np.ones(window) / window, mode="same")
    ax.plot(d30, rolling, color="#111111", linewidth=2.5,
            linestyle="-", zorder=4, label="3-day avg", alpha=0.85)

    # Release day markers within the 30-day window
    for version, rdate in release_dates.items():
        if rdate >= d30[0]:
            ax.axvline(rdate,
                       color=colors.get(version, "#AAAAAA"),
                       linestyle="--", linewidth=1.2, alpha=0.7, zorder=1)
            ax.text(rdate, ax.get_ylim()[1] * 0.95,
                    version.replace("v4.0.0-", ""),
                    fontsize=7, color=colors.get(version, "#AAAAAA"),
                    ha="center", va="top")

    label = PLATFORM_LABELS.get(platform, platform.capitalize())
    ax.set_title(f"{label} Downloads (Last 30 Days)",
                 fontsize=13, fontweight="bold", pad=10)
    ax.set_ylabel("Downloads")
    ax.yaxis.set_major_locator(mticker.MaxNLocator(integer=True))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m-%d"))
    ax.xaxis.set_major_locator(mdates.DayLocator(interval=3))
    plt.xticks(rotation=45, ha="right", fontsize=8)
    ax.grid(axis="y", linestyle="--", alpha=0.4, zorder=0)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(loc="upper left", fontsize=8, framealpha=0.8,
              title="Release", title_fontsize=8)

    plt.tight_layout()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"Saved: {out_path}")
    return True


def write_readme(dates, versions, ordered_versions, ordered_platforms,
                 release_dates, out_dir: Path, readme_path: Path):
    today = dates[-1].strftime("%Y-%m-%d")

    grand = {p: 0 for p in ordered_platforms}
    grand["total"] = 0
    rows = []

    for version in ordered_versions:
        ver_counts = {p: versions[version].get(p, [0])[-1]
                      for p in ordered_platforms}
        total = sum(ver_counts.values())
        for p in ordered_platforms:
            grand[p] += ver_counts[p]
        grand["total"] += total
        rdate = release_dates.get(version)
        rdate_str = rdate.strftime("%Y-%m-%d") if rdate else " "
        rows.append((version, ver_counts, total, rdate_str))

    # Table
    pcols = " | ".join(PLATFORM_LABELS.get(p, p.capitalize())
                       for p in ordered_platforms)
    psep = " | ".join("-------" for _ in ordered_platforms)
    header = f"| Version | Released | {pcols} | Total |"
    sep = f"|---------|----------|{psep}|-------|"

    table_rows = []
    for version, ver_counts, total, rdate_str in rows:
        cells = " | ".join(str(ver_counts[p]) for p in ordered_platforms)
        table_rows.append(f"| {version} | {rdate_str} | {cells} | {total} |")

    grand_cells = " | ".join(f"**{grand[p]}**" for p in ordered_platforms)
    footer = f"| **All** | | {grand_cells} | **{grand['total']}** |"

    # Chart sections
    chart_sections = []
    for platform in ordered_platforms:
        label = PLATFORM_LABELS.get(platform, platform.capitalize())
        img_path = f"{out_dir.name}/downloads_{platform}.png"
        chart_sections.append(f"## {label}\n\n![{label} Downloads]({img_path})\n")

    readme = f"""\
# REDasm Download Statistics

> Last updated: {today} (data fetched daily at 04:00 UTC)

{"".join(chart_sections)}
## Totals

{header}
{sep}
{"".join(r + chr(10) for r in table_rows)}{footer}
"""
    readme_path.write_text(readme, encoding="utf-8")
    print(f"Saved: {readme_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", default="downloads.csv")
    parser.add_argument("--out-dir", default="charts")
    args = parser.parse_args()

    # Load release metadata from releases.json
    releases = load_tracked_releases()
    release_dates = {r["tag"]: r["date"].replace(tzinfo=None) for r in releases}

    dates, versions, ordered_versions, ordered_platforms = load_csv(args.csv)
    colors = version_colors(ordered_versions)

    print(f"Loaded {len(dates)} days (versions: {ordered_versions}, platforms: {ordered_platforms})")

    out = Path(args.out_dir)
    for platform in ordered_platforms:
        chart_platform(dates, versions, ordered_versions, colors,
                       release_dates, platform, out / f"downloads_{platform}.png")

    write_readme(dates, versions, ordered_versions, ordered_platforms,
                 release_dates, out, Path("README.md"))


if __name__ == "__main__":
    main()
