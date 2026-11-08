# TYME Authenticated Contribution Gateway

Preview-only authentication gateway for `TYME-AUTHENTICATED-CONTRIBUTION-001`.

## Operations

- `POST /api/v0/auth/enroll` — operator-gated Ed25519 public-key enrollment
- `POST /api/v0/auth/challenges` — issue one-time 5-minute challenge
- `POST /api/v0/auth/contributions` — verify signature, consume challenge, forward internally to Commons
- `GET /health`

## Boundary

Cryptographic verification proves key possession and continuity with an enrollment. It does not prove provider identity or institutional authority.

No production `tymehall.org` write route is attached.
