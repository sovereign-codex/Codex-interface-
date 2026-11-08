# TYME Hall Commons bootstrap

This directory integrates the first bounded Commons/chat surface into the public Hall source tree.

## Proof ceiling

- The page itself is static and reviewable.
- User-authored messages are stored only in that browser's localStorage.
- Local messages receive preview receipts with `persistence_state: accepted_local`.
- No public message transport, server-side persistence, participant authentication, independent readback, moderation, or institutional authority is established.
- This branch MUST NOT be described as a live Public Intelligence Terminal roundtrip.

## Durable working set

The repository is the durable public anchor. ChatGPT Space/Page surfaces remain useful working projections, but they are not treated as canonical custody.

Inspect:
- `recent-work.json`
- `../protocols/TYME-HALL-COLLABORATION-001.md`
- `../schemas/collaborative-message-v0.1.schema.json`
