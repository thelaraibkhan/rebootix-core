#!/usr/bin/env python3
from __future__ import annotations
import argparse, os, sys
from pathlib import Path

SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", ".turbo", ".pnpm-store",
    "DerivedData", ".gradle", ".idea", ".vscode"
}
SKIP_EXTS = {
    ".png",".jpg",".jpeg",".gif",".webp",".ico",
    ".pdf",".zip",".gz",".xz",".zst",".7z",".rar",
    ".woff",".woff2",".ttf",".otf",
    ".mp4",".mov",".avi",".mkv",
    ".a",".o",".so",".dylib"
}
MAX_BYTES = 25 * 1024 * 1024

# Ordered: longer/more specific first
REPL = [
    ("ai.rebootix.shared", "ai.rebootix.shared"),
    ("ai.rebootix", "ai.rebootix"),
    ("_rebootix-gw._tcp", "_rebootix-gw._tcp"),
    ("rebootix-gateway", "rebootix-gateway"),
    ("REBOOTIX", "REBOOTIX"),
    ("Rebootix", "Rebootix"),
    ("rebootix", "rebootix"),
    ("Rebootix", "Rebootix"),
    ("rebootix", "rebootix"),
    ("RebootixHub", "RebootixHub"),
    ("rebootix", "rebootix"),
    ("@rebootix/", "@rebootix/"),
]

TOKENS_IN_NAMES = [
    ("REBOOTIX", "REBOOTIX"),
    ("Rebootix", "Rebootix"),
    ("rebootix", "rebootix"),
    ("Rebootix", "Rebootix"),
    ("rebootix", "rebootix"),
]

def is_binary(path: Path) -> bool:
    try:
        with path.open("rb") as f:
            chunk = f.read(4096)
        return b"\x00" in chunk
    except Exception:
        return True

def should_skip_dir(p: Path) -> bool:
    return p.name in SKIP_DIRS

def should_skip_file(p: Path) -> bool:
    if p.suffix.lower() in SKIP_EXTS:
        return True
    try:
        if p.stat().st_size > MAX_BYTES:
            return True
    except Exception:
        return True
    return False

def replace_in_text_file(p: Path) -> int:
    if should_skip_file(p) or is_binary(p):
        return 0
    try:
        text = p.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            return 0
    except Exception:
        return 0

    new = text
    for a, b in REPL:
        new = new.replace(a, b)

    if new != text:
        p.write_text(new, encoding="utf-8")
        return 1
    return 0

def rename_path(p: Path) -> Path:
    new_name = p.name
    for a, b in TOKENS_IN_NAMES:
        new_name = new_name.replace(a, b)
    if new_name == p.name:
        return p
    return p.with_name(new_name)

def walk_repo(root: Path):
    # deterministic traversal
    for dirpath, dirnames, filenames in os.walk(root):
        dp = Path(dirpath)
        # prune dirs
        dirnames[:] = [d for d in sorted(dirnames) if d not in SKIP_DIRS]
        for fn in sorted(filenames):
            yield dp / fn

def all_paths_bottom_up(root: Path):
    # rename children before parents
    paths = []
    for dirpath, dirnames, filenames in os.walk(root):
        dp = Path(dirpath)
        if dp.name in SKIP_DIRS:
            continue
        for fn in filenames:
            paths.append(dp / fn)
        for d in dirnames:
            paths.append(dp / d)
    paths.sort(key=lambda x: len(x.parts), reverse=True)
    return paths

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="Apply changes")
    args = ap.parse_args()

    root = Path(".").resolve()
    if not (root / ".git").exists():
        print("ERROR: run from repo root (where .git exists).", file=sys.stderr)
        sys.exit(2)

    # 1) content replacements
    changed_files = 0
    for f in walk_repo(root):
        changed_files += replace_in_text_file(f)

    # 2) path renames
    renamed = 0
    for p in all_paths_bottom_up(root):
        if p.name in SKIP_DIRS:
            continue
        target = rename_path(p)
        if target == p:
            continue
        if target.exists():
            # avoid collisions; skip
            continue
        try:
            p.rename(target)
            renamed += 1
        except Exception:
            pass

    print(f"[rebootix_rebrand] changed_text_files={changed_files} renamed_paths={renamed}")

if __name__ == "__main__":
    main()
