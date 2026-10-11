#!/usr/bin/env python3
"""Reject non-main, moving-head, or unpinned TYME Hall production candidates.

Offline mode: import evaluate_intent() in unit tests.
Live mode: called on GitHub Actions runners, with read-only git ls-remote.
This does not grant release authority: protected environment approval remains separate.
"""
import argparse
import json
import os
import re
import subprocess
import sys

HEX_SHA = re.compile(r"^[0-9a-f]{40}$")
REMOTE = "refs/heads/main"


class ReleaseHold(ValueError):
    pass


def evaluate_intent(candidate, event, ref, event_sha, local_sha, remote_sha):
    checks = {
        "candidate_is_exact_sha": isinstance(candidate, str) and bool(HEX_SHA.fullmatch(candidate)),
        "trigger_is_manual": event == "workflow_dispatch",
        "workflow_ref_is_main": ref == REMOTE,
        "event_sha_matches_candidate": candidate == event_sha,
        "checked_out_source_matches_candidate": candidate == local_sha,
        "fresh_remote_main_matches_candidate": candidate == remote_sha,
    }
    failed = [k for k, ok in checks.items() if not ok]
    if failed:
        raise ReleaseHold("HOLD: release source preflight rejected (" + ", ".join(failed) + ")")
    return {
        "verdict": "SOURCE_ELIGIBLE_FOR_INDEPENDENT_HUMAN_RELEASE_REVIEW",
        "source_sha": candidate,
        "checks": checks,
        "authority_effect": "none",
        "deployment_performed": False,
    }


def read_git(args):
    proc = subprocess.run(["git", *args], capture_output=True, text=True, check=False)
    if proc.returncode:
        raise ReleaseHold("HOLD: Git metadata unavailable or remote check failed")
    return proc.stdout.strip()


def get_remote_main():
    raw = read_git(["ls-remote", "origin", REMOTE])
    lines = [line.split() for line in raw.splitlines() if line.strip()]
    if len(lines) != 1 or len(lines[0]) != 2 or lines[0][1] != REMOTE:
        raise ReleaseHold("HOLD: remote main ref absent or ambiguous")
    return lines[0][0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fresh-remote", action="store_true", required=True)
    ap.parse_args()
    candidate = os.getenv("TYME_RELEASE_SHA", "")
    try:
        result = evaluate_intent(
            candidate,
            os.getenv("GITHUB_EVENT_NAME", ""),
            os.getenv("GITHUB_REF", ""),
            os.getenv("GITHUB_SHA", ""),
            read_git(["rev-parse", "HEAD"]),
            get_remote_main(),
        )
    except ReleaseHold as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
