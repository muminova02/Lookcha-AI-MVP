"""Lightweight JSON file storage.

A thin, safe read/write layer over JSON files in `settings.data_path`.
Designed so it can later be swapped for SQLite without touching callers:
services depend on the function signatures here, not on the file system.
"""

from __future__ import annotations

import json
import tempfile
import threading
from pathlib import Path
from typing import Any

from app.config import settings

# Serialize writes per-process to avoid interleaved/corrupt files.
_lock = threading.Lock()


class StorageError(RuntimeError):
    """Raised when a data file cannot be read or written."""


def _path_for(name: str) -> Path:
    """Resolve a collection name (without extension) to its JSON file path."""
    return settings.data_path / f"{name}.json"


def read_json(name: str, default: Any = None) -> Any:
    """Read and parse a JSON collection.

    Returns `default` when the file is missing. Raises `StorageError` on
    malformed JSON or unreadable files.
    """
    path = _path_for(name)
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except (json.JSONDecodeError, OSError) as exc:
        raise StorageError(f"Failed to read '{name}': {exc}") from exc


def write_json(name: str, data: Any) -> None:
    """Atomically write a JSON collection.

    Writes to a temp file in the same directory then replaces the target,
    so readers never observe a partially written file.
    """
    path = _path_for(name)
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with _lock:
            fd, tmp_name = tempfile.mkstemp(dir=str(path.parent), suffix=".tmp")
            tmp_path = Path(tmp_name)
            try:
                with open(fd, "w", encoding="utf-8") as fh:
                    json.dump(data, fh, ensure_ascii=False, indent=2)
                tmp_path.replace(path)
            finally:
                if tmp_path.exists():
                    tmp_path.unlink(missing_ok=True)
    except OSError as exc:
        raise StorageError(f"Failed to write '{name}': {exc}") from exc


def read_list(name: str) -> list[dict]:
    """Read a collection guaranteed to be a list (empty if missing)."""
    data = read_json(name, default=[])
    if not isinstance(data, list):
        raise StorageError(f"Collection '{name}' is not a list")
    return data


def append_item(name: str, item: dict) -> dict:
    """Append a dict to a list-backed collection and persist it."""
    items = read_list(name)
    items.append(item)
    write_json(name, items)
    return item
