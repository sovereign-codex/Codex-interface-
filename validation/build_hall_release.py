#!/usr/bin/env python3
"""Build a public-only Cloudflare Pages directory from tracked Hall sources.

This deliberately changes the historical root='.' upload semantics. Nothing
is published by this command. Diff the resulting public routes before GO.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys

ROOT_FILES = frozenset({
    "index.html", "control-panel.html", "graph-viewer.html",
    "node-timeline.html", "scroll-reader.html", "thread-explorer.html",
    "trace-detail.html", "trace-viewer.html",
})
PUBLIC_DIRS = frozenset({
    "assets", "branches", "canon", "constellation", "contribute", "data",
    "laboratory", "map", "office", "orientation", "projections",
    "route-candidates", "schemas", "scrolls", "state", "terminal",
    "trails", "work",
})
EXACT_WELL_KNOWN = frozenset({".well-known/tyme.json"})
REQUIRED = frozenset({
    "index.html", "contribute/index.html", "office/index.html",
    "office/state.json", "terminal/index.html", "orientation/index.html",
    "scrolls/AGI-0001/index.html", ".well-known/tyme.json",
})
HEX_SHA = re.compile(r"^[0-9a-f]{40}$")
MAX_BYTES = 15_000_000


class BuildHold(ValueError):
    pass


def public_path(raw):
    if not isinstance(raw, str) or not raw or chr(0) in raw:
        raise BuildHold("bad relative path")
    path = PurePosixPath(raw)
    parts = path.parts
    if (path.is_absolute() or ".." in parts or "." in parts or
            any("\\" in p for p in parts)):
        raise BuildHold("path traversal or malformed path")
    if raw in EXACT_WELL_KNOWN:
        return True
    if any(p.startswith(".") or p.startswith("_") for p in parts):
        return False
    if raw in ROOT_FILES:
        return True
    if len(parts) >= 2 and parts[0] in PUBLIC_DIRS:
        return True
    return False


def select_files(tracked):
    unique = sorted(set(tracked))
    public = [p for p in unique if public_path(p)]
    missing = REQUIRED - set(public)
    if missing:
        raise BuildHold("missing critical route(s): " + ", ".join(sorted(missing)))
    return public


def build(root, out, tracked, sha):
    if not HEX_SHA.fullmatch(sha):
        raise BuildHold("source SHA is not an exact 40-character lowercase hash")
    root, out = root.resolve(), out.resolve()
    if out == root or root in out.parents or out in root.parents:
        raise BuildHold("output must be outside source tree")
    if out.exists():
        raise BuildHold("output already exists; avoid stale or mixed releases")
    chosen = select_files(tracked)
    out.mkdir(parents=True)
    hashes = {}
    for rel in chosen:
        src = root / rel
        if not src.is_file() or src.is_symlink() or any(x.is_symlink() for x in src.parents if x != root):
            raise BuildHold("invalid, missing, or symlinked public asset: " + rel)
        if src.stat().st_size > MAX_BYTES:
            raise BuildHold("public asset exceeds size ceiling: " + rel)
        content = src.read_bytes()
        target = out / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
        hashes[rel] = hashlib.sha256(content).hexdigest()
    manifest = {
        "schema": "tymehall/controlled-release-manifest/v0.1",
        "source_sha": sha,
        "files": hashes,
        "authority_effect": "none",
        "scope": "reviewed_public_static_allowlist",
    }
    (out / "_release-manifest.json").write_text(
        json.dumps(manifest, sort_keys=True, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def tracked_git_files(root):
    p = subprocess.run(
        ["git", "-C", str(root), "ls-files", "-z"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False
    )
    if p.returncode:
        raise BuildHold("cannot enumerate tracked repository sources")
    try:
        return [b.decode("utf-8") for b in p.stdout.split(bytes([0])) if b]
    except UnicodeDecodeError as err:
        raise BuildHold("invalid tracked path encoding") from err


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--destination", required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    try:
        manifest = build(root, Path(args.destination), tracked_git_files(root),
                         os.environ.get("TYME_RELEASE_SHA", ""))
    except BuildHold as exc:
        print("HOLD: " + str(exc), file=sys.stderr)
        return 2
    print(json.dumps({
        "verdict": "PUBLIC_ASSETS_STAGED_NOT_DEPLOYED",
        "source_sha": manifest["source_sha"],
        "file_count": len(manifest["files"]),
        "authority_effect": "none",
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
