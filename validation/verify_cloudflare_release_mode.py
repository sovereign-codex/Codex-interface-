#!/usr/bin/env python3
"""Read-only Cloudflare Pages checks surrounding separately authorized deployment.

Do not use this script to change production. A passing check is a precondition,
not independent proof of human authorization or full post-deploy health.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

PROJECT = "codex-interface"
REPO = "Codex-interface-"
ORG = "sovereign-codex"


class CloudflareHold(ValueError):
    pass


def verify_project(project):
    source = project.get("source") or {}
    cfg = source.get("config") or {}
    conditions = {
        "project_matches": project.get("name") == PROJECT,
        "production_branch_main": project.get("production_branch") == "main",
        "source_is_github": source.get("type") == "github",
        "source_owner_matches": cfg.get("owner") == ORG,
        "source_repo_matches": cfg.get("repo_name") == REPO,
        "source_branch_main": cfg.get("production_branch") == "main",
        "automatic_production_disabled": cfg.get("production_deployments_enabled") is False,
        "preview_builds_retained": cfg.get("preview_deployment_setting") == "all",
    }
    invalid = [k for k, valid in conditions.items() if not valid]
    if invalid:
        raise CloudflareHold("HOLD: Cloudflare release mode mismatch: " + ", ".join(invalid))
    return {"verdict": "MANUAL_DEPLOYMENT_MODE_CONFIRMED", "checks": conditions,
            "authority_effect": "none"}


def verify_deployment(deployment, commit):
    if not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise CloudflareHold("invalid commit hash")
    metadata = (deployment.get("deployment_trigger") or {}).get("metadata") or {}
    status = (deployment.get("latest_stage") or {}).get("status")
    checks = {
        "environment_production": deployment.get("environment") == "production",
        "commit_matches": metadata.get("commit_hash") == commit,
        "branch_matches": metadata.get("branch") == "main",
        "deployment_success": status == "success",
    }
    if not all(checks.values()):
        raise CloudflareHold("HOLD: deployment not verified: " +
                             ", ".join(k for k, v in checks.items() if not v))
    return {"verdict": "CLOUDFLARE_DEPLOYMENT_SOURCE_RECORDED",
            "deployment_id": deployment.get("id"), "commit": commit,
            "checks": checks, "authority_effect": "none"}


def client_get(path):
    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    if not re.fullmatch(r"[0-9a-f]{32}", account) or not token:
        raise CloudflareHold("Cloudflare account or scoped credential unavailable")
    url = "https://api.cloudflare.com/client/v4/accounts/" + account + path
    req = urllib.request.Request(
        url, headers={"Authorization": "Bearer " + token, "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            obj = json.load(response)
    except (urllib.error.URLError, TimeoutError, ValueError):
        raise CloudflareHold("read-only Cloudflare API check failed")
    if not obj.get("success"):
        raise CloudflareHold("Cloudflare readback rejected or incomplete")
    return obj.get("result")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--post-deploy-sha")
    args = parser.parse_args()
    try:
        if args.post_deploy_sha:
            for _ in range(12):
                deployments = client_get("/pages/projects/" + PROJECT +
                                         "/deployments?env=production&per_page=5")
                if not isinstance(deployments, list):
                    raise CloudflareHold("missing production deployment list")
                try:
                    result = verify_deployment(deployments[0], args.post_deploy_sha)
                    print(json.dumps(result, sort_keys=True))
                    return 0
                except (CloudflareHold, IndexError):
                    time.sleep(10)
            raise CloudflareHold("post-deploy source and success not independently observed")
        result = verify_project(client_get("/pages/projects/" + PROJECT))
        print(json.dumps(result, sort_keys=True))
        return 0
    except CloudflareHold as exc:
        print(str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
