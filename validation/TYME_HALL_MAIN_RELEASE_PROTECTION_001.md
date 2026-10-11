# TYME-HALL-LAUNCH-001 — GitHub `main` release-control protection

**Classification:** human-admin activation checklist, candidate only.  
**Prepared:** October 10, 2026 (Arizona)  
**Repo:** [sovereign-codex/Codex-interface-](https://github.com/sovereign-codex/Codex-interface-)  
**Operational record:** [TYME-HALL-LAUNCH-001](https://app.notion.com/p/3f5c51d54b758197a92ff59d2c203045)  
**Security blocker:** [Control Center security issue #17](https://github.com/sovereign-codex/Codex-control-center/issues/17)

## Observed before the change

- Cloudflare Pages project `codex-interface` automatically deploys GitHub `main` to the public Hall custom domain `tymehall.org`. The current independently recorded production source SHA is `5342cbaf1098391879a15c7ccca752d3fbc241b8`.
- GitHub `main` branch response reports `protected:false`, and its repository rulesets list was empty. Branch-protection detail returned **403: resource not accessible by integration**, despite repository metadata reporting `admin:true`. Therefore effective protection must be confirmed through GitHub's admin UI and later independent API readback. Do not equate reported repo admin permission with the connected application's ability to edit branch rules.
- [Draft Hall PR #19](https://github.com/sovereign-codex/Codex-interface-/pull/19) includes a new **always-running** pull request workflow, `TYME Hall Required Premerge Contract`, with stable required job/check name `hall_launch_001_premerge`. The first run passed 10/10 invariant tests ([run #38099072287](https://github.com/sovereign-codex/Codex-interface-/actions/runs/38099072287)). This check is a CI signal, not a release GO.
- PR #19 is deliberately **unmerged**. Until it is included on `main`, newly created PR branches may need to include this workflow to produce the check. Do **not** configure the rule with an impossible check or merge #19 just to make settings easier.

## Proposed human-activated ruleset

Create a **repository-level branch ruleset** named `TYME-HALL-LAUNCH-001-main-release` targeted to **default branch / main only**, using [GitHub Settings → Rules → Rulesets](https://github.com/sovereign-codex/Codex-interface-/settings/rules).

Proposed conditions, to be reviewed before selecting **Active**:

| Requirement | Target setting | Rationale |
|---|---|---|
| Require pull request | Enabled for `main` | Prevent ordinary direct, unreviewed production source pushes |
| Required approving reviews | **1 independent reviewer** when available | PR authors cannot count their own approval; do not silently waive to claim independent sign-off |
| Dismiss stale PR approvals | Enabled | New changes invalidate prior approval |
| Require approval after latest change | Enabled if available | Last unreviewed code cannot slip past approval |
| Require conversation resolution | Enabled | Open blocking review threads prevent merge |
| Require status checks | `hall_launch_001_premerge` exact job name | Stable protection for public source/authority invariants |
| Expected CI source | GitHub Actions app, where selectable | Avoid accepting arbitrary independently-set status contexts |
| Strict status checks | Branch up to date with `main` when merging | Avoid approving outdated head |
| Block force pushes | Enabled / **do not enable force push** | Preserve deployment/source lineage |
| Block deletions | Enabled / **do not allow deletion** | Avoid destroying production branch |
| Bypass / admin exemptions | Prefer **no standing bypass** | Human release approval must be explicit and reconstructable |
| Separate deployment approval | Human-owned, outside code CI | Passing checks or review does not grant publication, Canon, institutional or production GO |

**Solo-maintainer deadlock:** If there is only one eligible GitHub reviewer, an enforceable 1-approval rule can intentionally hold all production merges until a second reviewer is onboarded. That is preferable to representing self-review as independent assurance, but the founder must accept the release freeze, arrange a qualified reviewer, or explicitly choose a temporary documented exception before activation. Do not secretly lower or bypass required reviews.

**Activation boundary:** Creating a ruleset does not require or authorize merging PR #19. A human administrator must select settings, confirm the check appears as a recognized status check, inspect pending effects, and activate. An unavailable check may leave all merges blocked; verify its status on the actual pull request first. GitHub public repository rulesets are plan-supported, but repository/org-specific policies may affect availability.

### Mobile-first administrator steps

1. From iPhone browser, open [repository rulesets](https://github.com/sovereign-codex/Codex-interface-/settings/rules). If the mobile page hides Settings, use the browser's desktop-site view or the GitHub web menu.
2. Select **New ruleset → New branch ruleset**, name it `TYME-HALL-LAUNCH-001-main-release`, target the default branch `main` and configure the options above. Avoid broad `*` matching that would restrict all development branches.
3. Confirm the exact required check `hall_launch_001_premerge`, not the workflow's display title. Choose GitHub Actions as status source if available; do not accidentally select a path-filtered check.
4. Confirm a distinct reviewer is available before turning on the one-approval rule. If not, hold in draft/not-yet-active posture and explicitly flag the human review dependency. Never mark launch security PASS for an unenforced rule.
5. Activate only after reviewing the resulting summary. Do not click Merge, Re-run with deployment privileges, or change Cloudflare configuration in this step.

### Independent acceptance after administrator activation

From a separate read-only connection or public GitHub settings readback, preserve:
- actor/authorization and actual change time (including which rule actor and permissions were used);
- ruleset name, ID, enforcement status, targeted branch and exact check/job name;
- configured reviewer count, resolved-conversation policy, stale-review handling, bypass list and push/delete posture;
- `main` reports protection **or** effective branch-rule application from GitHub after refresh; no assumption from an intended config alone;
- PR #19 remains unmerged while the ruleset is checked; attempted merge denied for a missing check or reviewer, *without actually merging*;
- post-activation public Pages production deployment remains at the same source SHA until founder separately authorizes a release.

**Do not test enforcement by pushing to `main` or merging a production PR.** Inspect GitHub's rule evaluation/merge box instead. Capture an actual blocked attempt only on a disposable non-production branch if a scoped human-reviewed rehearsal later permits it.

## Rollback and production consequences

- This ruleset protects the repository source. It does **not** replace Cloudflare's rollback mechanism, route health checks, D1 backups, secret rotation, or an incident decision process.
- Branch rollback and Pages deployment rollback have distinct effects. Restoring an older Pages deployment does not necessarily change Git history; reverting Git may trigger a **new** Pages deployment.
- Establish and rehearse an isolated staging rollback and source/response fingerprint before authorizing a production repair or rollout.
- `main` currently supplies the deployed Hall. Any merge, even a minor Office freshness patch, may publish immediately via Pages. Treat every merge as release execution.
- Production GO remains human-owned, G1/G5/G6 still OPEN until all independent evidence is accepted.

## Current evidence checkpoint

`PREMERGE_CHECK_STAGED_AND_TESTED` / `RULESET_NOT_YET_CREATED` / `MAIN_UNPROTECTED` / `PRODUCTION_UNCHANGED`.

Sources: [GitHub creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), [available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
