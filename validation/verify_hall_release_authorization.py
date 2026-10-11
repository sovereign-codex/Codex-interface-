#!/usr/bin/env python3
"""Fail closed on release operator, founder GO reference and exact SHA.

Human identity and actual GitHub environment protection are separately
verified out of band. This cannot prove a Notion record exists or was approved.
"""
import argparse
import json
import os
import re
import sys

RECEIPT = re.compile(r"^TYME-HALL-LAUNCH-001/G6/[A-Za-z0-9._-]{5,100}$")
SHA = re.compile(r"^[a-f0-9]{40}$")


class AuthorizationHold(ValueError):
    pass


def evaluate(actor, designated_operator, receipt, candidate, mode,
             gate_armed=None, authorized_sha=None):
    checks = {
        "named_release_operator": bool(designated_operator) and
                                  actor == designated_operator,
        "bounded_g6_reference": isinstance(receipt, str) and
                                bool(RECEIPT.fullmatch(receipt)),
        "candidate_exact_sha": isinstance(candidate, str) and
                               bool(SHA.fullmatch(candidate)),
        "known_mode": mode in ("preflight", "deploy"),
    }
    if mode == "deploy":
        checks.update({
            "environment_gate_armed": gate_armed == "true",
            "founder_authorized_sha_matches": authorized_sha == candidate,
        })
    violations = [name for name, state in checks.items() if not state]
    if violations:
        raise AuthorizationHold("HOLD: release gate not configured: " +
                                ", ".join(violations))
    return {
        "verdict": "REFERENTIAL_RELEASE_GATE_VALID_NOT_PROOF_OF_HUMAN_APPROVAL",
        "actor": actor,
        "source_sha": candidate,
        "mode": mode,
        "checks": checks,
        "authority_effect": "none",
        "actual_environment_protection_verified": False,
        "actual_notion_g6_approval_verified": False,
        "deployment_performed": False,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("preflight", "deploy"), required=True)
    args = parser.parse_args()
    try:
        result = evaluate(
            actor=os.environ.get("GITHUB_ACTOR", ""),
            designated_operator=os.environ.get("TYME_RELEASE_OPERATOR", ""),
            receipt=os.environ.get("RELEASE_RECEIPT", ""),
            candidate=os.environ.get("TYME_RELEASE_SHA", ""),
            mode=args.mode,
            gate_armed=os.environ.get("TYME_RELEASE_GATE_ARMED"),
            authorized_sha=os.environ.get("TYME_RELEASE_AUTHORIZED_SHA"),
        )
    except AuthorizationHold as err:
        print(str(err), file=sys.stderr)
        return 2
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
