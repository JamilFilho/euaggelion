"""
Translates a content module's datasets from one locale to another using the
DeepSeek API.

Usage:
    python3 scripts/translate.py --module=sermons --from=en-US --to=pt-BR [--dataset=c_h_spurgeon]

Without --dataset, every dataset found under content/<module>/<from>/ is in scope.

Flow:
    1. Asks whether to translate everything still missing a translation, or to
       select specific items from a paginated list (20 per page).
    2. "Translate everything" only ever fills gaps: any item that already has a
       translations.<to_lang> entry in the dataset's translation registry — no
       matter its status (ai/revised/approved) or whether it was produced by
       this script or written by hand in luther — is left untouched. Overwriting
       an existing translation is only possible through manual selection, and
       even then requires an explicit confirmation.
    3. For each item translated: calls the DeepSeek API, writes the translated
       Markdown file to content/<module>/<to>/<dataset>/<same file name>, and
       records the result in content/<module>/translations/<dataset>.json (see
       CLAUDE.md, "Script de tradução", for the registry's schema/semantics).

Requires DEEPSEEK_API_KEY (see scripts/dev.py) and the `requests` package (see
scripts/requirements.txt).
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

from _common import CONTENT_DIR, get_env_var

DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
DEEPSEEK_MODEL = "deepseek-v4-flash"
REQUEST_TIMEOUT = 180
PAGE_SIZE = 20

SYSTEM_PROMPT = (
    "You are a professional translator specialized in historical Christian "
    "theological texts (18th/19th-century sermons and doctrinal writings). "
    "Translate faithfully and completely, preserving the formal, "
    "period-appropriate tone, scripture references, and any Markdown/plain-text "
    "formatting (line breaks, emphasis, verse layout). Do not summarize, add "
    "commentary, or explain anything — output only the requested translation, "
    "in exactly the format requested."
)

# content/<module>/<from>/<dataset>/<file> follows this fixed template (see
# scripts-local/scraping_data.py): "# <title>\n\nFonte: <url>\n\n---\n\n<body>".
HEADER_RE = re.compile(
    r"^#\s*(?P<title>.+?)\s*\n\n"
    r"Fonte:\s*(?P<source_url>\S+)\s*\n\n"
    r"---\n\n"
    r"(?P<body>.*)\Z",
    re.DOTALL,
)

RESPONSE_RE = re.compile(r"TITLE:\s*(?P<title>.*?)\n---BODY---\n(?P<body>.*)\Z", re.DOTALL)


class TranslationError(Exception):
    pass


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Translate a content module's datasets via the DeepSeek API."
    )
    parser.add_argument("--module", required=True, help="Module id (= its directory under content/, e.g. 'sermons').")
    parser.add_argument("--from", dest="from_lang", required=True, help="Source locale, e.g. en-US.")
    parser.add_argument("--to", dest="to_lang", required=True, help="Target locale, e.g. pt-BR.")
    parser.add_argument(
        "--dataset",
        default=None,
        help="Restrict to a single dataset id. Omit to run over every dataset in the module.",
    )
    return parser.parse_args(argv)


def resolve_datasets(module_dir: Path, from_lang: str, dataset: str | None) -> list[str]:
    from_dir = module_dir / from_lang
    if not from_dir.is_dir():
        sys.exit(f"No '{from_lang}' content found under {module_dir}.")
    if dataset:
        if not (from_dir / dataset).is_dir():
            sys.exit(f"Dataset '{dataset}' not found under {from_dir}.")
        return [dataset]
    return sorted(p.name for p in from_dir.iterdir() if p.is_dir())


def list_source_items(dataset_dir: Path) -> list[Path]:
    return sorted(p for p in dataset_dir.iterdir() if p.is_file())


# --- translations.json (per-dataset translation registry) -------------------


def translations_path_for(module_dir: Path, dataset_id: str) -> Path:
    return module_dir / "translations" / f"{dataset_id}.json"


def load_translations(path: Path, module_id: str, dataset_id: str) -> dict:
    import json

    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"module": module_id, "dataset": dataset_id, "updatedAt": None, "items": {}}


def save_translations(path: Path, data: dict) -> None:
    import json

    data["updatedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def existing_translation(translations: dict, item_id: str, to_lang: str) -> dict | None:
    return translations["items"].get(item_id, {}).get("translations", {}).get(to_lang)


def file_hash(path: Path) -> str:
    return f"sha256:{hashlib.sha256(path.read_bytes()).hexdigest()}"


# --- interactive selection ---------------------------------------------------


def prompt_mode() -> str:
    while True:
        choice = input(
            "\nTranslate [a]ll items still missing a translation, or [s]elect specific ones? "
        ).strip().lower()
        if choice in ("a", "all"):
            return "all"
        if choice in ("s", "select"):
            return "select"
        print("Please answer 'a' or 's'.")


def status_label(entry: dict | None) -> str:
    return "not translated" if entry is None else entry.get("status", "unknown")


def paginate_and_select(items: list[Path], translations: dict, to_lang: str) -> list[Path]:
    selected_ids: set[str] = set()
    index = 0

    while True:
        page = items[index : index + PAGE_SIZE]
        print(f"\n-- items {index + 1}-{index + len(page)} of {len(items)} ({len(selected_ids)} selected) --")
        for offset, item_path in enumerate(page, start=1):
            item_id = item_path.stem
            mark = "*" if item_id in selected_ids else " "
            entry = existing_translation(translations, item_id, to_lang)
            print(f" {mark} {index + offset:>4}. {item_id}  [{status_label(entry)}]")

        print(
            "\nNumbers/ranges to add (e.g. 1,3,5-10) · 'a' = all on this page · "
            "'n' = next page · 'p' = previous page · 'q' = done · 'c' = cancel"
        )
        choice = input("> ").strip().lower()

        if choice == "c":
            return []
        if choice == "q":
            break
        if choice == "n":
            if index + PAGE_SIZE < len(items):
                index += PAGE_SIZE
            continue
        if choice == "p":
            index = max(0, index - PAGE_SIZE)
            continue
        if choice == "a":
            selected_ids.update(p.stem for p in page)
            continue

        for token in choice.split(","):
            token = token.strip()
            if not token:
                continue
            if "-" in token:
                start_s, _, end_s = token.partition("-")
                if not (start_s.isdigit() and end_s.isdigit()):
                    print(f"  (ignoring invalid range: '{token}')")
                    continue
                start, end = int(start_s), int(end_s)
            elif token.isdigit():
                start = end = int(token)
            else:
                print(f"  (ignoring invalid entry: '{token}')")
                continue
            for n in range(start, end + 1):
                if 1 <= n <= len(items):
                    selected_ids.add(items[n - 1].stem)

    return [p for p in items if p.stem in selected_ids]


def confirm_overwrites(selected: list[Path], translations: dict, to_lang: str) -> list[Path]:
    existing = [p for p in selected if existing_translation(translations, p.stem, to_lang)]
    if not existing:
        return selected

    print(f"\n{len(existing)} selected item(s) already have a '{to_lang}' translation:")
    for p in existing:
        entry = existing_translation(translations, p.stem, to_lang)
        print(f"  - {p.stem}  [{entry.get('status')}]")
    choice = input("Overwrite these? [y/N] ").strip().lower()
    if choice == "y":
        return selected

    existing_ids = {p.stem for p in existing}
    return [p for p in selected if p.stem not in existing_ids]


# --- DeepSeek call ------------------------------------------------------------


def build_user_prompt(from_lang: str, to_lang: str, title: str, body: str) -> str:
    return (
        f"Translate the following text from {from_lang} to {to_lang}.\n"
        "Respond in exactly this format and nothing else:\n\n"
        "TITLE: <translated title>\n"
        "---BODY---\n"
        "<translated body>\n\n"
        f"TITLE: {title}\n"
        "---BODY---\n"
        f"{body}"
    )


def call_deepseek(api_key: str, user_prompt: str) -> str:
    response = requests.post(
        DEEPSEEK_API_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": DEEPSEEK_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.3,
        },
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def translate_item(api_key: str, from_lang: str, to_lang: str, source_path: Path, dest_path: Path) -> str:
    raw = source_path.read_text(encoding="utf-8")
    match = HEADER_RE.match(raw)
    if match:
        title, source_url, body = match["title"], match["source_url"], match["body"]
    else:
        title, source_url, body = source_path.stem, "", raw

    response_text = call_deepseek(api_key, build_user_prompt(from_lang, to_lang, title, body))
    response_match = RESPONSE_RE.match(response_text.strip())
    if not response_match:
        raise TranslationError(f"unexpected response format:\n{response_text[:500]}")
    translated_title = response_match["title"].strip()
    translated_body = response_match["body"].strip()

    translated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    header = [f"# {translated_title}", ""]
    if source_url:
        header.append(f"Fonte: {source_url}")
    header.append(f"Tradução: {DEEPSEEK_MODEL} — {translated_at}")
    header += ["", "---", "", translated_body, ""]

    dest_path.parent.mkdir(parents=True, exist_ok=True)
    dest_path.write_text("\n".join(header), encoding="utf-8")
    return translated_at


# --- main ---------------------------------------------------------------------


def main() -> None:
    args = parse_args()

    module_dir = CONTENT_DIR / args.module
    if not module_dir.is_dir():
        sys.exit(f"Module '{args.module}' not found at {module_dir}.")

    api_key = get_env_var("DEEPSEEK_API_KEY")
    if not api_key:
        sys.exit("DEEPSEEK_API_KEY not set. Run 'python3 scripts/dev.py' or set it in .env.local.")

    dataset_ids = resolve_datasets(module_dir, args.from_lang, args.dataset)
    print(f"Scope: module={args.module} from={args.from_lang} to={args.to_lang} datasets={dataset_ids}")

    mode = prompt_mode()

    for dataset_id in dataset_ids:
        source_dir = module_dir / args.from_lang / dataset_id
        dest_dir = module_dir / args.to_lang / dataset_id
        translations_path = translations_path_for(module_dir, dataset_id)
        translations = load_translations(translations_path, args.module, dataset_id)

        items = list_source_items(source_dir)
        if not items:
            print(f"[{dataset_id}] no source files — skipping.")
            continue

        if mode == "all":
            to_translate = [
                p for p in items if existing_translation(translations, p.stem, args.to_lang) is None
            ]
            print(
                f"[{dataset_id}] {len(to_translate)} of {len(items)} item(s) will be translated "
                "(the rest already have a translation and are left untouched)."
            )
        else:
            if len(dataset_ids) > 1:
                proceed = input(f"\nSelect items in dataset '{dataset_id}'? [y/N] ").strip().lower()
                if proceed != "y":
                    continue
            to_translate = paginate_and_select(items, translations, args.to_lang)
            to_translate = confirm_overwrites(to_translate, translations, args.to_lang)

        if not to_translate:
            print(f"[{dataset_id}] nothing to do.")
            continue

        translated_count = 0
        failed_count = 0
        for source_path in to_translate:
            item_id = source_path.stem
            dest_path = dest_dir / source_path.name
            print(f"[{dataset_id}] translating {item_id}...")

            try:
                translated_at = translate_item(api_key, args.from_lang, args.to_lang, source_path, dest_path)
            except (TranslationError, requests.RequestException) as exc:
                print(f"  [error] {item_id}: {exc}", file=sys.stderr)
                failed_count += 1
                continue

            source_hash = file_hash(source_path)
            item_entry = translations["items"].setdefault(item_id, {})
            item_entry["source"] = {
                "lang": args.from_lang,
                "file": f"./{args.from_lang}/{dataset_id}/{source_path.name}",
                "hash": source_hash,
            }
            item_entry.setdefault("translations", {})[args.to_lang] = {
                "file": f"./{args.to_lang}/{dataset_id}/{source_path.name}",
                "status": "ai",
                "engine": DEEPSEEK_MODEL,
                "sourceHashAtTranslation": source_hash,
                "translatedAt": translated_at,
            }
            translated_count += 1
            # Saved after every item so an interrupted run doesn't lose progress.
            save_translations(translations_path, translations)

        print(f"[{dataset_id}] done: {translated_count} translated, {failed_count} failed.")


if __name__ == "__main__":
    main()
