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

## Safe commissioning order — none of these production actions has been authorized or executed

**Non-negotiable sequencing:** disabling automatic *production* builds is a prerequisite **before merging either PR #19 or this PR #20 into `main`**. A merge performed while Cloudflare currently watches `main` could publish without explicit founder GO even when the source change is only a governance/workflow file.

1. **Review baseline and emergency recovery.** Record the current successful production deployment `8f2b21b4-9541-471f-b2f7-651373591e4f`, live SHA `5342cbaf1098391879a15c7ccca752d3fbc241b8`, Pages source settings, production/custom-domain health and permitted rollback operator. This is read-only. Do not treat mere existence of an old deployment as evidence the rollback has been rehearsed.
2. **Independent candidate review and static/route equivalence.** Obtain qualified, uncoached technical review for draft [Hall PR #19](https://github.com/sovereign-codex/Codex-interface-/pull/19) and this PR #20, preserving the existing protected-main one-approval gate. Run source/negative tests, compare the public allowlisted artifact with current Pages root=`.` route inventory, and record intentional omissions. Hold on any broken/unknown public route or private asset exposure. No merger, credentials or Cloudflare setting changes yet.
3. **Prepare, verify, but do not yet arm GitHub release infrastructure.** A human admin creates protected `tymehall-production`, requires founder release approval, restricts deployments to protected `main`, enables no-admin-bypass and prevent-self-review when supported, and verifies actual UI/API readback. Merely listing `environment:` in YAML does not protect it. Name **two distinct humans**: a release operator to dispatch and the founder/approved separate release reviewer to authorize. With no such human qualification, STOP here and retain the freeze. Save operator login in `TYME_RELEASE_OPERATOR` repo variable; **leave `TYME_RELEASE_GATE_ARMED` unset and no valid authorized SHA during setup**.
4. **Scope and store controlled credentials safely.** Prepare a dedicated Cloudflare API token with only the necessary Pages Edit permission, and protect `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the GitHub **protected environment only**; never put them in repository-level Actions secrets, static Pages variables or public content. Account admin retains rotation/revocation custody. No production deployment performed.
5. **Approve and execute a production-build freeze as its own human change.** With rollback operator ready, the founder authorizes a narrow Cloudflare settings change: `production_deployments_enabled=false`, preserve `production_branch=main`, `preview_deployment_setting=all`. Apply it using the Pages dashboard or a separately authorized scoped PATCH, then independently read back those exact values. This is a deliberately visible availability/change-control transition: previews continue, production remains on the existing deployed SHA. **DO NOT merge ANY branch until this GET readback succeeds.**
6. **Only after the freeze, review and merge the pending source PRs in dependency order.** PR #19 first supplies the required Hall premerge regression script. Then, after its separate independent review and any necessary rebase/CI, PR #20 can install the manual release workflow on `main`. Both still require existing 1-review GitHub rules and separate founder authorization; never bypass protection. With production autobuild disabled, these merges must not automatically publish. Independently verify Cloudflare production still has the baseline SHA after each merge.
7. **Exercise deny paths with no release.** Test wrong operator, missing/not-real G6 reference, wrong/moving source SHA, absent premerge workflow, invalid package, missing/stale environment approval, no token, unarmed environment, unauthorized SHA, unexpected Cloudflare production-auto setting, unexpected preview setting and unsuccessful readback. Source-only and synthetic tests are *not* substitutes for real protected-environment and staging verification.
8. **Rehearse in an isolated staging environment.** Under separately authorized creation/funding/credentials, test actual Wrangler Pages upload, independent source/HTTP readback, safe rollback, route manifest and privacy. Do not accidentally promote staging to `tymehall.org`. Obtain independently observed release-denial and recovery evidence before commissioning production.
9. **Record exact founder G6 GO and intentionally arm one source.** Only after G1/G4/G5 independent gates are satisfied, record the institutional `TYME-HALL-LAUNCH-001/G6/<approved-reference>` and set `TYME_RELEASE_AUTHORIZED_SHA` in the protected environment to that reviewed current `main` SHA. Set `TYME_RELEASE_GATE_ARMED=true` for that release window only; restrict release operator and require separate founder environment approval. This referential check cannot authenticate Notion approval without a separate witnessed gate.
10. **Manually invoke the production workflow and independently attest.** Run `workflow_dispatch` on main with exact SHA and G6 reference; require protected human approval; independently confirm Cloudflare manual mode and the exact source again; publish via Wrangler; read back deployment ID, SHA and `success`; run external HTTP and privacy probes. Restore `TYME_RELEASE_GATE_ARMED` to unset/false and clear authorized SHA after the attempt. Never equate workflow green with automatically satisfied institutional G6.

The controlled workflow remains unavailable via normal `workflow_dispatch` until its workflow file is on default branch. The live Pages auto-production setting is still **enabled** as of this packet. The current state is therefore an intentional HOLD, not a broken automation.

The `workflow_dispatch` job exists only when this workflow file is present on GitHub's default branch. While it is only staged on a separate draft branch, it cannot publish production through this path.

## Dry-run tests and boundary

```sh
python3 -m unittest discover -s validation -p 'test_controlled_release.py' -v
TYME_RELEASE_SHA=5342cbaf1098391879a15c7ccca752d3fbc241b8 python3 validation/build_hall_release.py --destination /tmp/tyme-hall-review-assets
```

The second sample must be run with the current candidate SHA, not the historical value, and into a clean non-repository output folder. It produces `_release-manifest.json` for review, not a live Hall receipt. If executed outside Actions, this does not test protected GitHub environments.

The release candidate also includes `validation/verify_hall_release_authorization.py`, a testable, purely referential G6/operator/authorized-SHA validator. It rejects missing or unauthorized operator identities, malformed G6 references, an unarmed environment, and any source mismatch. Its PASS explicitly states that it **has not validated real Notion approval, GitHub environment protection, or deployment**. Only an independent admin review of configured protection rules and a witnessed human approval can establish those facts. The separate no-secret PR CI tests this authorization contract as well as source identity and Cloudflare deployment-mode denial cases.

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
