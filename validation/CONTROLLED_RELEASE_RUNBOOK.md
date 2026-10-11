# TYME-HALL-LAUNCH-001 — Controlled Production Release

**Status:** PROPOSED / NOT COMMISSIONED / LIVE CONFIGURATION UNCHANGED  
**Scope:** GitHub repository `sovereign-codex/Codex-interface-` → Cloudflare Pages project `codex-interface` → `tymehall.org`  
**Date:** 2026-10-11  
**Gates:** G1 infrastructure, G4 participation, G5 security/privacy and G6 founder release; acceptance A9.

## Why the release gate exists

The live Pages project currently has:
- source provider GitHub; `sovereign-codex/Codex-interface-`;
- production branch `main`;
- `production_deployments_enabled: true`;
- `preview_deployment_setting: all`;
- production deployment `8f2b21b4-9541-471f-b2f7-651373591e4f` sourced from Git SHA `5342cbaf1098391879a15c7ccca752d3fbc241b8` (successful, 2026-09-11).
- active source ruleset [24880323](https://github.com/sovereign-codex/Codex-interface-/rules/24880323) with one eligible review, last-push reapproval, stale-review dismissal, resolved conversations, no bypass and no force pushes or deletion. **No mandatory CI status check is currently configured**.

Under that configuration, an approved/merged PR may automatically publish production even without a separate founder GO. This is the authority seam addressed by this candidate. An ordinary human reviewer must not inherit autonomous publishing authority.

## Proposed independent production gate

```text
Untrusted outside report / pull request
      ↓
Protected main — eligible human review; exact-head CI
      ↓
Safe source selected by explicit SHA
      ↓
Manual workflow_dispatch (designated release operator only)
      ↓
Preflight: SHA equals main event ref, local checkout and fresh GitHub main
      ↓
Source tests and public-only artifact staging WITHOUT secrets
      ↓
GitHub environment: tymehall-production
  required named founder approver; disallow bypass + self-review
      ↓
Founder records G6 GO for that SHA; protected environment approval
      ↓
Environment variables: gate ARMED and authorized SHA match
      ↓
Scoped Pages token exposed ONLY to approved production job
      ↓
Cloudflare GET verifies production auto deploys disabled + previews retained
      ↓
Second fresh source/Cloudflare readback, manual Wrangler Pages upload
      ↓
Cloudflare production deployment ID + SHA/status readback
      ↓
Independent HTTP/route/privacy test and archived release receipt
```

**Design note:** GitHub's environment declaration in the YAML does not set required reviewers. GitHub can create an environment automatically *without any protection rules*. No deployment is safe to initiate just because the environment name appears in this file. The release remains uncommissioned until an admin independently verifies the real environment protection state and no-bypass settings.

## Production promotion mechanism selection

Recommended **Phase A**: keep production branch `main`, disable only automatic production deployments in Pages, keep automatic previews on all non-production branches, use a reviewed manual Pages deploy with `--branch=main` and `--commit-hash=<exact SHA>`.

This avoids creating a second release branch before there is an eligible reviewer or sufficiently tested operations staff. It retains a clear SHA→deploy mapping and the existing Cloudflare Pages custom domain.

Cloudflare explicitly supports disabling automatic Git-triggered Pages builds while using Wrangler to deploy into an existing Git-connected project. See:
- [Git integration and manual Wrangler deployments](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Production branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Wrangler pages deploy options](https://developers.cloudflare.com/workers/wrangler/commands/pages/)
- [Pages rollback rules](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [GitHub environment required reviewers and protection](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)

**Later Phase B:** Consider dedicated release orchestration outside a collaborator-controlled source repository if privileged source changes, compromised reviewers or hostile GitHub Actions are within the threat model. Environment reviewers are not a complete separation of repository administrative power.

## Commissioning prerequisites — in order, none yet executed

1. **Independent PR review and merge.** The [Office freshness/premerge candidate PR #19](https://github.com/sovereign-codex/Codex-interface-/pull/19) must first be independently reviewed and merged, as the controlled workflow requires `validation/launch_hall_premerge.test.mjs` and its production-relevant checks to exist on `main`. Its author-only green tests are not review approval. The new controlled release workflow also requires separate independent review, including code/workflow supply-chain effects. The current one-review main protection may prevent *both merges* until a competent human reviewer joins; this intentional freeze must not be bypassed.
2. **Verify public asset equivalence.** Run the allowlisted builder and compare a complete route manifest with the existing public Cloudflare deployment. It excludes implementation internals `.github/`, `validation/`, and `architecture/`, and so alters the former root=`.` publication scope. A missing route, missing public document or broken relative link is HOLD until explicitly dispositioned. No surprise deletion of inherited Hall surfaces.
3. **Create protected GitHub environment.** In the Hall repository settings, create `tymehall-production`. Require the **human release authority** as a reviewer; restrict deployment branches to protected `main`; prevent self-review and admin bypass to the extent the plan supports them. This requires **two distinct human roles for a release**: a designated operator starts the job; the founder or approved separate release steward reviews/approves the environment. Without such people, keep the release blocked.
4. **Create explicit release controls.** Add repository variable `TYME_RELEASE_OPERATOR=<reviewed GitHub login>`. Under the protected environment only, configure `TYME_RELEASE_GATE_ARMED=true` and `TYME_RELEASE_AUTHORIZED_SHA=<human-authorized 40-char reviewed main SHA>`, updating the latter for *each* release. Never set the authorized SHA to an unreviewed candidate. Store founder's G6 GO receipt `TYME-HALL-LAUNCH-001/G6/<short-reference>` in the actual institutional launch command.
5. **Create scoped credentials.** Create a dedicated Cloudflare API token limited to Pages **Edit** where the provider supports restriction, not a broad global API key. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as protected **environment secrets**, NOT repo-wide secrets, plaintext files, Cloudflare Pages static env vars or GitHub PR comments. Token custody, rotation and revocation require human assignment.
6. **Switch off ONLY automatic production deployments** in Pages > Settings > Builds & deployments > Production branch control, or through a separately authorized, audited exact project PATCH. Preserve `preview_deployment_setting=all` and `production_branch=main`. Verify a fresh GET readback. **Do not change this live setting before prerequisites 1–5 or separately approved safe-mode preparations.**
7. **Rehearse denied cases with NO deployment:** unknown actor, wrong SHA, branch movement during approval wait, empty G6 receipt, missing CI file, unapproved protected environment, `GATE_ARMED` absent, wrong environment authorized SHA, absent scoped token, Cloudflare `production_deployments_enabled=true`, preview setting unexpected, private asset included.
8. **Rehearse staging-only upload and rollback.** Test the actual Wrangler Pages command on an isolated staging project and preserve before/after source SHA, deployment ID, HTTP and static-route manifest. Do not treat offline tests as a real deploy proof. Reconfirm no path silently rewrites `tymehall.org`. The initial staging project/resource creation and token permissions need a separate explicit authorization.
9. **Go decision:** commission the release workflow only after independent review, tested environment restrictions and staging success, then record explicit founder G6 GO for the exact SHA and run the manual workflow from main. Separately verify actual route/response health and Office state disclosures after Cloudflare readback. An Actions job success is not equivalent to all release gates PASS.

The `workflow_dispatch` job exists only when this workflow file is present on GitHub's default branch. While it is only staged on a separate draft branch, it cannot publish production through this path.

## Dry-run tests and boundary

```sh
python3 -m unittest discover -s validation -p 'test_controlled_release.py' -v
TYME_RELEASE_SHA=5342cbaf1098391879a15c7ccca752d3fbc241b8 python3 validation/build_hall_release.py --destination /tmp/tyme-hall-review-assets
```

The second sample must be run with the current candidate SHA, not the historical value, and into a clean non-repository output folder. It produces `_release-manifest.json` for review, not a live Hall receipt. If executed outside Actions, this does not test protected GitHub environments.

The prospective production workflow:
- never triggers on `push` or `pull_request`;
- requires `workflow_dispatch` on `main`;
- checks exact commit and fresh remote branch twice;
- requires explicit actor, short G6 receipt, protected environment, arming variable and exact approved SHA;
- runs public artifact and structural tests without secrets first;
- refuses Cloudflare automatic production mode still active;
- uses pinned Wrangler 4.45.0 installed in a separate uncredentialed step;
- reads back production deployment SHA and status, but still requires separate HTTP and privacy verification.

**Limitations:** GitHub environment protection is **external mutable account state**, not proven by static source. Admins with access may still alter code/workflows, secrets, protection or Cloudflare settings. Do not invite a new write-access collaborator until access boundaries and a tested human-approved production flow have been independently verified. The package allowlist must also be independently compared against historical public routes before being used for a real deployment.

## Emergency rollback — separately authorized

Before a first real release preserve exact existing production deployment ID and commit. Pages permits rollback only to an earlier successful **production** deployment, not a preview. The observed candidate baseline is `8f2b21b4-9541-471f-b2f7-651373591e4f` / `5342cbaf...`.

If needed, human operator follows Cloudflare Pages > Deployments > successful production target > Rollback, after incident/change authorization, recording who acted, when, target ID and post-rollback HTTP validation. Do not automate rollback in this initial release workflow. A separate Pages rollback API may be used under later explicit authorization; no rollback was performed here.

## Current gate disposition

- `A9 = IMPLEMENTATION_CANDIDATE_STAGED`, not PASS.
- `G1/G4/G5/G6 = OPEN` pending measured evidence and humans.
- No Cloudflare settings, Pages secrets, GitHub environments, repository branch protections, public routes, Work, Canon or live receipts were changed by staging.
- **Next valid owner action:** independently review this draft code, verify the nine evidence gates and recruit/screen an eligible human reviewer without granting premature deployment privileges.
