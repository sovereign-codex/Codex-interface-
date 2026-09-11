# TYME Hall Outer Court — Production Parity Verification v0.1

## Status

`MERGED / DEPLOYMENT_SUCCEEDED / CUSTOM-DOMAIN_CONTENT_READ_PENDING`

PR #14 has been merged to `main` and both Cloudflare Pages and GitHub Pages reported successful deployment for the merge commit. The custom production domain remains reachable at the DNS layer, but this record does **not** claim full live-content parity at `https://tymehall.org` until an independent external read confirms the served first-screen content and routes.

## Merge evidence

Pull request:

`https://github.com/sovereign-codex/Codex-interface-/pull/14`

Merge commit:

`5342cbaf1098391879a15c7ccca752d3fbc241b8`

Merged at:

`2026-09-11T23:36:54Z`

Merged source scope:

```text
changed files: index.html only
new /ask /seek /know /knock routes: none
backend changes: none
identity / persistence changes: none
Hall receipt changes: none
Canon changes: none
AVOT authority changes: none
```

## Main-source parity

After merge, `main/index.html` contains the reviewed Outer Court first encounter:

```text
ASK
Learn, ask a question, or find your bearings.

SEEK
Explore active questions, evidence, and work still in progress.

KNOW
Examine reviewed knowledge, its evidence, and its current standing.
Reviewed does not mean certain.

KNOCK
Challenge, correct, or return evidence for review.
Submitting does not grant authority.

Sovereignty first. Evidence before authority. Exit remains available.
```

Route targets remain:

```text
ASK  -> projections/cit-learning-v0.1/
SEEK -> laboratory/
KNOW -> scrolls/
KNOCK -> contribute/
```

## Cloudflare deployment evidence

The merge commit received a completed Cloudflare Pages check:

```text
check: Cloudflare Pages
head_sha: 5342cbaf1098391879a15c7ccca752d3fbc241b8
status: completed
conclusion: success
result: Deployed successfully
preview: https://8f2b21b4.codex-interface-83q.pages.dev
completed_at: 2026-09-11T23:37:09Z
```

This confirms Cloudflare accepted and deployed the merge commit. It does not by itself prove that the custom domain is currently serving byte-for-byte identical content.

## GitHub Pages deployment evidence

GitHub's dynamic Pages workflow also completed successfully for the same merge commit:

```text
workflow: pages build and deployment
run: 34658725910
head_branch: main
head_sha: 5342cbaf1098391879a15c7ccca752d3fbc241b8
status: completed
conclusion: success
environment_url: https://sovereign-codex.github.io/Codex-interface-/
```

The deploy job log records:

```text
Created deployment for 5342cbaf1098391879a15c7ccca752d3fbc241b8
Reported success!
Evaluated environment url: https://sovereign-codex.github.io/Codex-interface-/
```

## Canonical-domain DNS evidence

`tymehall.org` currently resolves through Cloudflare:

```text
A:    104.21.52.77, 172.67.196.232
AAAA: 2606:4700:3033::6815:344d, 2606:4700:3030::ac43:c4e8
NS:   ethan.ns.cloudflare.com, laylah.ns.cloudflare.com
```

This confirms the canonical domain is DNS-reachable through Cloudflare infrastructure. DNS reachability is not content parity.

## Remaining parity gate

A final external live read should confirm from `https://tymehall.org` itself:

1. the root page returns successfully;
2. ASK / SEEK / KNOW / KNOCK are visible in the reviewed order;
3. `Reviewed does not mean certain.` is visible under KNOW;
4. `Submitting does not grant authority.` is visible under KNOCK;
5. `Sovereignty first. Evidence before authority. Exit remains available.` is visible;
6. ASK routes to `/projections/cit-learning-v0.1/`;
7. SEEK routes to `/laboratory/`;
8. KNOW routes to `/scrolls/`;
9. KNOCK routes to `/contribute/`;
10. no stale pre-Outer-Court foyer is being served through cache or alternate origin.

## Current disposition

```text
MERGE: PASS / COMPLETE
SOURCE PARITY ON main: PASS
CLOUDFLARE DEPLOYMENT: PASS
GITHUB PAGES DEPLOYMENT: PASS
CANONICAL-DOMAIN DNS: PASS
CUSTOM-DOMAIN LIVE CONTENT PARITY: UNVERIFIED
```

Do not freeze the public checkpoint or declare production parity complete until the final custom-domain live read returns cleanly.
