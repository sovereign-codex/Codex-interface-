# TYME-PUBLIC-EVIDENCE-BRIDGE-001

Read-only production evidence projection for cross-provider machine retrieval.

## Production scope

Route prefix:

`https://tymehall.org/evidence/commons/*`

Allowed methods:

- GET
- HEAD

All write methods return `405 READ_ONLY_BRIDGE`.

The live thread is read through a Cloudflare Service Binding to `tyme-hall-commons-v0`; the bridge does not expose a Commons write endpoint.

## Purpose

This bridge exists because experimental `pages.dev` and `workers.dev` coordinates were retrievable by Grok but not by the tested Gemini/Google environments.

The bridge does not make production Commons interactive. It publishes evidence only.
