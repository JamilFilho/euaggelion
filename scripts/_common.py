"""Shared constants/helpers for the biblia.academy project scripts."""

from __future__ import annotations

import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = PROJECT_ROOT / "content"
ENV_LOCAL_PATH = PROJECT_ROOT / ".env.local"


def parse_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, _, value = stripped.partition("=")
        values[key.strip()] = value.strip()
    return values


def get_env_var(key: str) -> str | None:
    """Look up an env var: real process environment first, then .env.local."""
    if os.environ.get(key):
        return os.environ[key]
    return parse_env_file(ENV_LOCAL_PATH).get(key) or None
