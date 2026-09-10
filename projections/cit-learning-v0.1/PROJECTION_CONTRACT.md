# CIT Learning Projection v0.1

Status: public-facing source candidate  
Live route: not authorized  
Authority: non-authorizing  
Source rehearsal: `sovereign-codex/Tyme-Lab@aa25b07162638d090526cf873eb837137bd6939c`

## Purpose

Project the merged Tyme-Lab multimodal learning rehearsal into a public-facing, mobile-first candidate without changing the current Tyme Hall foyer during Context-Zero Review Cycle 02.

This candidate tests whether a newcomer can encounter one question through several representations without first learning internal TYME vocabulary and without being assigned a global learner category.

## Foyer relationship

The current public foyer remains authoritative for the active validation cycle. This projection does not replace the existing Office / Scrolls / Laboratory / Constellation / Contribution entry structure on `main`.

The candidate instead explores a possible downstream interaction surface compatible with the foyer-to-runtime continuity map:

```text
PUBLIC ORIENTATION
  -> bounded question / inquiry
  -> TALK | SEE | TRY | MAKE
  -> optional SHARE
  -> local contribution preview
  -> private exit or future governed intake
```

`SHARE` is a participatory threshold, not a truth, authority, rank, or publication grant.

## Public-language rule

A newcomer should not need internal vocabulary to begin.

The candidate therefore exposes ordinary participant language first:

```text
Talk
See
Try
Make
Share
```

Deeper terms appear only when they explain a real boundary. `Learn`, `Delegate`, and `Co-create` are shown because the relationship to cognitive assistance materially affects what task completion can mean. Their meanings must be visible on the surface rather than assumed from internal project vocabulary.

The sample encounters are named by subject rather than by participant type:

- Sound + symbol /b/
- Repetition loop
- Duplicate worker execution

The interface must explain that these examples are deliberately far apart in subject matter to test the same interaction grammar across different work. It must not classify a visitor as a child, beginner, expert, rank, or global learner level.

## Semantic continuity rule

Renderer is not semantic state.

Changing among speech, text, visual representation, interaction, code, or participant construction must not silently change:

- participant intent;
- assistance mode;
- claim authority;
- public deployment authority;
- Hall Event state;
- Contribution Trail state.

A new sample encounter may establish a new semantic state. The interface must tell the participant that changing the sample starts a fresh temporary session and clears the current sample's local in-memory activity and notes. A renderer transition inside an encounter may not change the semantic state.

## Assistance relationship

The participant controls:

```text
LEARN | DELEGATE | CO-CREATE
```

This axis remains independent from:

```text
TALK | SEE | TRY | MAKE | SHARE
```

The three modes must be both **defined** and **behaviorally distinguishable** on the participant-facing surface:

- **Learn — help me build the capability.** The participant acts before the page resolves the task, then receives feedback. Immediate success remains insufficient evidence of durable capability.
- **Delegate — do this step for me.** The page may show a worked result or draft directly. Completion must explicitly carry `learning_claim: false` and must not imply participant capability.
- **Co-create — work through this with me.** The participant contribution and page contribution remain visibly distinguishable, with unresolved uncertainty preserved where material.

Changing renderer must never silently switch assistance mode.

## Local-session accounting

The public surface must distinguish **activity** from **saved notes**.

TRY actions and delegated worked results may become local activity evidence for the temporary page session, but must not silently increment a label that implies the participant intentionally saved a note. Explicit participant notes and reflections are separately countable.

The participant must be able to:

- review a plain-language local-session summary;
- see that persistence is memory-only for the current page session;
- clear local activity and saved notes;
- confirm that clearing or leaving has no institutional effect.

No local-session control may transmit data.

## Contribution boundary

In v0.1, `SHARE` can only create a local preview.

Preview is reversible inspection, not submission and not an institutional transition. The state model must support:

```text
not_offered -> offered -> previewed <-> previewed
                         -> declined_private
```

A participant may preview repeatedly. `Keep private` must remain valid after preview. Returning to SHARE after a private decline may reopen the local preview choice without penalty.

The candidate must not:

- transmit over a network;
- create an account;
- create a Contribution Trail;
- emit a Hall Event;
- promote a claim;
- issue a credential;
- alter participant authority;
- persist a developmental record.

Declining SHARE must have no penalty or degraded access.

## Voice boundary

Voice uses browser speech synthesis only when available.

The participant-facing control must describe what is actually occurring (for example, `Hear this aloud`) rather than implying an intelligent speaking persona when no interactive Steward is present.

No microphone capture, voiceprint, speech recording, or speech-to-text ingestion is authorized in this candidate. Failure of speech synthesis must leave text available as the fallback representation. TRY results should also expose an optional text-to-speech path where supported.

## Privacy and persistence boundary

The candidate must contain no network submission path and no persistent browser profile.

Disallowed in v0.1:

- `fetch` submission;
- `XMLHttpRequest` submission;
- WebSocket submission;
- HTML forms with remote actions;
- `localStorage`;
- IndexedDB;
- cookies used for participant continuity;
- hidden identity or capability scoring.

Evidence and reflection exist only in the in-memory page session.

## Mobile presentation boundary

The five interaction verbs must remain usable on a phone without covering active lesson or explanation text. A navigation treatment that visually obscures the current card fails the mobile review even if the controls technically remain clickable.

The current repair uses a non-overlay in-flow verb bar rather than a sticky layer over the learning content.

## External context-zero return — Perplexity / 2026-09-10

The first independent external evaluator loaded the Cloudflare branch preview, inspected the shipped `state.mjs`, clicked the controls in a live browser, observed post-load network behavior, and checked browser persistence.

### Passed signals

- candidate / non-live posture reconstructed correctly;
- TALK / SEE / TRY / MAKE / SHARE reconstructed as alternate representations of one question;
- no post-load participant transmission observed;
- no cookies, localStorage, or sessionStorage observed;
- no microphone capture observed;
- no ranking, credential, authority grant, or coercive sharing behavior observed;
- contribution remained a local mock/preview rather than submission.

### Promotion blockers found

1. Learn / Delegate / Co-create were not defined for a newcomer and initially changed only a label rather than assistance behavior.
2. SHARE preview consumed the `offered` state, causing repeated preview or `Keep private` after preview to throw `share-not-offered`.
3. TRY activity silently increased the visible `local notes` count although no note had been intentionally saved.
4. `Hear Steward` implied an assistant persona while the implementation was browser text-to-speech only.
5. Changing the sample cleared local state without telling the participant.
6. Remaining project and contribution vocabulary still required too much outsider inference.
7. The sticky mobile verb bar could visually cover active explanatory text.
8. The three distant examples lacked an explicit participant-facing explanation for why they were chosen.

Disposition: **PARTIAL PASS — REPAIR REQUIRED.** The constitutional, privacy, and non-authority envelope survived; interaction semantics and outsider intelligibility required repair before merge.

## Repair acceptance gate

The repaired branch may return to external review only when deterministic validation confirms:

- Learn behavior requires participant action before resolution;
- Delegate can provide a worked result/draft while emitting no learning claim;
- Co-create preserves participant and page contributions separately;
- changing renderer preserves assistance mode;
- repeated SHARE preview does not fail;
- Keep private works after preview;
- TRY activity is counted separately from explicitly saved notes/reflection;
- local session can be reviewed and cleared without institutional effect;
- sample-reset behavior is disclosed;
- browser text-to-speech is described without implying a live Steward;
- TRY output has an optional read-aloud path;
- seed-level SHARE copy avoids unexplained internal candidate/trail jargon;
- Tyme Hall and the three-example rationale are minimally explained;
- mobile verb navigation does not overlay current learning content;
- no network, persistence, rank, credential, authority, Hall Event, or Contribution Trail boundary regresses.

After these repairs pass, the next evidence gate is a **different independent context-zero evaluator**. Reusing the first evaluator may be useful for regression checking but does not count as a fresh cold read.

## Context-zero boundary

This candidate is deliberately not linked from the live foyer on `main` during Cycle 02.

Before any live route is proposed for merge, an independent reviewer should be able to answer from the candidate alone:

1. What is this surface for?
2. What changes when TALK / SEE / TRY / MAKE / SHARE changes?
3. What does not change when the renderer changes?
4. What does Learn / Delegate / Co-create mean and how does behavior differ?
5. Does SHARE publish anything? No.
6. Can SHARE be previewed repeatedly and then kept private? Yes.
7. Does successful interaction create rank, credentials, or authority? No.
8. Can the participant inspect and clear local session state? Yes.
9. What source artifact and exact commit does this candidate derive from?
10. What remains unvalidated or unimplemented?

Misunderstanding is review evidence; it should not be repaired by private coaching during the cold read.

## Acceptance gate

A branch-level projection may be reviewed when deterministic validation confirms:

- mobile viewport exists;
- five interaction verbs are visible;
- assistance relationship remains participant-controlled and behaviorally distinguishable;
- all three subject seeds use the same session contract;
- TRY performs bounded real interaction rather than decorative state changes;
- renderer transitions preserve governed state;
- local contribution preview remains pre-institutional and reversible;
- keep-private path has no institutional effect;
- local activity is distinguishable from saved participant notes;
- no network submission path exists;
- no microphone capture exists;
- no persistent participant profile exists;
- no participant-type ranking labels appear;
- exact Tyme-Lab source commit is visible and machine-readable;
- `public_deployment_authorized` remains false.

## Stop condition

Passing this gate authorizes only review of this branch-level public-facing projection candidate.

It does not authorize:

- modifying the live foyer;
- merging into `main`;
- deploying to `tymehall.org`;
- public Contribution intake;
- persistent I AM continuity;
- real child participation;
- production learner records;
- credentials or allocation decisions;
- Canon promotion;
- autonomous Steward authority.
