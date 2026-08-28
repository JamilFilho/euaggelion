"""
Generates/updates content/modules.json based on the actual state of /content.

Usage:
python3 scripts/generate_content_index.py

Expected convention for automatic module discovery:

content/<module>/<locale>/<dataset>/<files...>

Where <locale> follows the xx-XX pattern (e.g., en-US, pt-BR). A module that does not
follow this convention is still included in the index (id/dir/status/valid/version),
but without automatically discovered "datasets"—manual editing is required.

This script does not yet validate the structure/content of each module (schema,
broken references, etc.)—it only discovers and counts them. Consequently, every
module/dataset is always marked with valid=false. Fields defined manually in
previous runs (status, version, label, license) are preserved; only the calculated
fields (total, discovered locales/dirs, updatedAt, valid) are recalculated during
each execution.

"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from _common import CONTENT_DIR

INDEX_PATH = CONTENT_DIR / "modules.json"

LOCALE_RE = re.compile(r"^[a-z]{2}-[A-Z]{2}$")
DEFAULT_VERSION = "0.1.0"


def humanize(slug: str) -> str:
    return " ".join(part.capitalize() for part in slug.split("_") if part)


def count_files(directory: Path) -> int:
    return sum(1 for path in directory.rglob("*") if path.is_file())


def discover_module(module_dir: Path) -> dict:
    locale_dirs = sorted(
        p for p in module_dir.iterdir() if p.is_dir() and LOCALE_RE.match(p.name)
    )
    if not locale_dirs:
        return {"locales": [], "datasets": []}

    datasets: dict[str, dict] = {}
    for locale_dir in locale_dirs:
        lang = locale_dir.name
        for dataset_dir in sorted(p for p in locale_dir.iterdir() if p.is_dir()):
            dataset_id = dataset_dir.name
            entry = datasets.setdefault(
                dataset_id,
                {
                    "id": dataset_id,
                    "label": humanize(dataset_id),
                    "license": None,
                    "locales": [],
                },
            )
            entry["locales"].append(
                {
                    "lang": lang,
                    "dir": f"./{lang}/{dataset_id}",
                    "total": count_files(dataset_dir),
                }
            )

    module_locale_totals: dict[str, int] = {}
    for dataset in datasets.values():
        for loc in dataset["locales"]:
            module_locale_totals[loc["lang"]] = (
                module_locale_totals.get(loc["lang"], 0) + loc["total"]
            )

    locales = [
        {"lang": lang, "total": total}
        for lang, total in sorted(module_locale_totals.items())
    ]
    return {"locales": locales, "datasets": list(datasets.values())}


def merge_dataset(existing: dict | None, discovered: dict) -> dict:
    if existing is None:
        return discovered
    merged = dict(existing)
    merged["locales"] = discovered["locales"]
    return merged


def merge_module(existing: dict | None, module_dir: Path, discovered: dict) -> dict:
    existing_datasets = {d["id"]: d for d in (existing or {}).get("datasets", [])}
    merged_datasets = [
        merge_dataset(existing_datasets.get(d["id"]), d) for d in discovered["datasets"]
    ]

    return {
        "id": module_dir.name,
        "dir": f"./{module_dir.name}",
        "status": (existing or {}).get("status", "dev"),
        "valid": False,
        "version": (existing or {}).get("version", DEFAULT_VERSION),
        "locales": discovered["locales"],
        "datasets": merged_datasets,
    }


def generate() -> dict:
    existing_index: dict = {}
    if INDEX_PATH.exists():
        existing_index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    existing_modules = {m["id"]: m for m in existing_index.get("modules", [])}

    modules = []
    for module_dir in sorted(p for p in CONTENT_DIR.iterdir() if p.is_dir()):
        discovered = discover_module(module_dir)
        if not discovered["datasets"]:
            print(
                f"[warning] '{module_dir.name}' does not follow the <locale>/<dataset>/ convention — registered without automatic datasets."
            )
        modules.append(
            merge_module(existing_modules.get(module_dir.name), module_dir, discovered)
        )

    return {
        "name": "Bíblia.academy Content Index",
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "modules": modules,
    }


def main() -> None:
    index = generate()
    INDEX_PATH.write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"[modules] content/modules.json updated ({len(index['modules'])} module(s) added).")


if __name__ == "__main__":
    main()
