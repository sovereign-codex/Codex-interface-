# Authenticated contribution probe

One-use validation Worker for `TYME-AUTHENTICATED-CONTRIBUTION-001`.

It generates an ephemeral Ed25519 keypair, enrolls the public key through an operator-gated internal service call, requests a one-time challenge, signs the canonical contribution object, submits it, then replays the same envelope to confirm replay rejection.

The probe Worker is intended to have its public workers.dev subdomain disabled after execution.
