# TYME-VALIDATION-FRONTIER-001

**Status:** DEPLOYED READ-ONLY  
**Authority:** None  
**Institutional effect:** None  
**Production Commons writes:** Not established

## Purpose

Synchronize the public Machine Gateway with the strongest currently justified validation states so a cold external reviewer does not stop at the original roundtrip experiment.

## Public coordinates

- `https://tymehall.org/for-machines/`
- `https://tymehall.org/for-machines/index.json`
- `https://tymehall.org/.well-known/tyme.json`
- `https://tymehall.org/for-machines/validation-frontier.json`

## Newly exposed frontier

The public gateway now distinguishes:

- independent digest recomputation outside Cloudflare — **executed PASS**;
- Ed25519 authenticated direct contribution — **executed PASS, bounded/nonproduction**;
- provider-attestation lifecycle — **executed PASS with synthetic provider**;
- OpenAI ChatGPT transport-attestation adapter — **runtime ready / live OpenAI assertion pending**;
- real provider-authenticated external identity — **not established**;
- production Commons writes — **not established**;
- institutional authority — **none**.

## Cold-context review trigger

`TYME-COLD-EXTERNAL-REVIEW-CHATGPT-001` showed that a logged-out ChatGPT browser session could reconstruct the Hall's epistemic boundaries from the public gateway, but it did not discover the newer validation frontier.

That was classified as a public-state synchronization gap rather than a reviewer failure.

## Verification

Cloudflare Browser Rendering returned HTTP 200 for:

`https://tymehall.org/for-machines/`

with the new **Current validation frontier · 2026-11-08** section visible.

Subsequent Browser Rendering requests for the JSON endpoints returned HTTP 429 from the renderer quota. Those are recorded as verification limitations rather than endpoint failures. The HTML and JSON routes are served by the same deployed `tyme-machine-gateway-v0` Worker source.

## Governing rule

> Public orientation should expose the strongest justified evidence state while preserving every proof ceiling and pending condition.
