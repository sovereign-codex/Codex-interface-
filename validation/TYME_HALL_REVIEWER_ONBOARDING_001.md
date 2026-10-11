# TYME-HALL-LAUNCH-001 — Independent Reviewer Qualification and Handoff

**Status:** PREPARED FOR FOUNDER SCREENING · NO COLLABORATOR SELECTED · NO ACCESS GRANTED · UNFUNDED  
**Target:** [Hall draft PR #19](https://github.com/sovereign-codex/Codex-interface-/pull/19) — Office snapshot freshness disclosure and premerge safety gate  
**Program:** [TYME-HALL-LAUNCH-001 release ledger](https://github.com/sovereign-codex/Codex-control-center/issues/15)  
**Ruleset:** [TYME-HALL-LAUNCH-001-main-release, ID 24880323](https://github.com/sovereign-codex/Codex-interface-/rules/24880323)  
**Date:** October 11, 2026. No commercial offer, employment representation, payment commitment, request for private credentials or deployment authorization.

## Why an independent reviewer is needed

Authenticated ruleset readback confirms the default branch is protected. It requires **one approving review**, a fresh approval of the most recent reviewable push, dismissal of stale approvals, resolution of review threads, and no deletion or non-fast-forward updates. There are no bypass actors. The Hall's Cloudflare Pages project deploys from the protected main branch.

GitHub's rulesets documentation states that an approval counting toward a **required** PR review comes from someone with **write permission** in the repository or an eligible designated code owner. A public outsider's review can be valuable without counting toward the merge gate. Source: [GitHub ruleset rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

**Never grant write access just to screen a candidate.** First obtain a public-only work sample; vet identity, competence, availability, conflicts and acceptable contribution terms. Founder authorization is required for any later privilege change.

## Track A — Independent public cold-read (no repository privilege)

- Start at [https://tymehall.org](https://tymehall.org). Use public GitHub and the public Hall only. No Notion, Cloudflare, secrets or internal data.
- Inspect foyer, Office, Scrolls, Laboratory, Constellation, Contribution and terminal paths on an unfamiliar mobile browser or assistive-technology setup.
- Record device, browser/version, timestamp, visited public URLs, safe screenshots, reproduction instructions, unexpected behavior and explicit uncertainties.
- Separate the Office record's generated date from verified current institutional state; distinguish external GitHub Issues from native Hall receipts.
- Return an unedited, evidence-linked report privately through a **founder-selected moderated intake channel**, not the locked bounty issue. Do not request private credentials or claim publication/governance authority.
- This track gives **no approval credit, compensation or repository privilege**.

## Track B — Technical reviewer for required merge approval (vetted privilege only)

Before invitation, require:
1. A verifiable GitHub identity and history of substantive code reviews or accepted fixes, ideally covering static web sites, GitHub Actions, branch controls and accessibility.
2. Independent feedback on the public draft diff: at least one specific risk, one reproducible edge case and one proposed regression test, not a generic guarantee or off-site job link.
3. Evidence of source/provenance discipline, security boundaries and honest treatment of CI versus actual release authorization.
4. Disclosure of AI assistance, conflicts of interest and availability; founder-approved collaboration/contribution terms.

**Permission decision is separate and human-owned:** a screened candidate may receive the smallest eligible GitHub permission *that still counts* toward a required review (typically write permission scoped to the **Hall repository alone**, not organization owner/admin privileges). No Cloudflare, Notion, secret-management, funding, production-credential or ruleset bypass permissions. Even repository write access can affect unprotected development branches; vet the candidate before grant, preserve the default-branch ruleset, and plan revocation.

## Reviewer checklist for Hall PR #19

1. Pin the current PR head SHA and independently examine Office HTML, the snapshot freshness validator, the public Hall premerge tests and their workflows. Treat all proposed documentation as non-authorizing.
2. Independently run the repository's two Node-based test suites and preserve exact SHA, commands, stdout/stderr, timestamp and relevant GitHub Actions URLs.
3. Check stale, missing, future-dated and current Office timestamps; semantic order of notice before Now; text-only rendering, XSS posture, mobile and accessibility behavior; and no unexpected credential or server handler.
4. Verify public machine bootstrap, Office, AGI publication and contribution standing without interpreting a passing CI run as permission to publish or change institutional Canon.
5. Confirm the active ruleset is still applied to main, the PR is unmerged, and the passing candidate job **hall_launch_001_premerge is not yet a required status check**.
6. Put reproducible issues in GitHub PR review threads with file/line/severity and distinguish approval, requested changes and comments. Do not equate automated bot feedback with a qualified human approval.
7. Return findings, independent evidence, uncertainties, GitHub permission eligibility, and a proposed PASS, FAIL or NEEDS_REVISION outcome. A reviewer approval does **not** authorize production deployment; founder authority remains separate.

No outside review has yet been observed; required-review eligibility remains **UNASSIGNED**.

## After a qualified reviewer exists

- Re-run PR tests on the exact current head, complete independent review, and obtain separate founder approval before any production merge. A merge to main may trigger automatic Cloudflare Pages publication.
- The premerge job currently lives on an unmerged PR branch. Do not require a check that cannot reliably appear on every future PR until its workflow is present on the default branch and can be validated.
- After an authorized merge and independent production SHA/route readback, propose making hall_launch_001_premerge a mandatory check through a separately reviewed ruleset change.
- Rehearse staging rollback and complete independent edge security review before claiming the full security or launch gates are closed.
- If an urgent production repair arises during the independent-review freeze, require an individually documented emergency change request; do not add broad standing bypass actors.

## Abuse and funding boundaries

The [unfunded collaborator Issue #18](https://github.com/sovereign-codex/Codex-interface-/issues/18) was locked after unsolicited off-topic repetition and payment requests. Its submissions are not verified technical patches or accepted funding terms. Preserve evidence; never follow unknown off-site job links, disclose secrets or promise payment.

No bounty, hiring, license grant, repository access, Canon status, production deployment or automated Office work is approved by this packet.

## Evidence-return fields

- launch_id: TYME-HALL-LAUNCH-001
- candidate_handle: UNASSIGNED
- participation_track: A_PUBLIC_COLD_READ or B_CODE_APPROVAL
- screened_by: UNASSIGNED
- screening_time_utc: UNKNOWN
- repository_permission: NONE
- pr_url: https://github.com/sovereign-codex/Codex-interface-/pull/19
- reviewed_head_sha: UNKNOWN
- independent_test_runs: []
- findings: []
- outcome: NOT_RUN
- reviewer_approved_on_github: false
- founder_production_authorization: false
- authority_effect: none
- next_valid_action: Screen an independent applicant before access

**Disposition:** REVIEWER_BRIEF_READY / NO_OUTSIDER_REVIEW / NO_PRIVILEGE_GRANTED / RELEASE_GATE_OPEN.
