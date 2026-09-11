# TYME Hall Outer Court Intent Routing v0.1

## Status

`ARCHITECTURE_CANDIDATE / ROUTING_CONTRACT / REPAIR_02 / CONSTITUTIONAL_PASS`

This document maps the proposed `ASK / SEEK / KNOW / KNOCK` encounter layer onto the **existing** public TYME Hall surfaces. It does not create new live routes, change the rendered foyer, activate Hall ingress, introduce persistent identity, or alter institutional authority.

## Baseline

Repository: `sovereign-codex/Codex-interface-`  
Baseline branch: `main`  
Baseline commit: `3c6c0c88c9ef6e67ee571f038656627080cfcdda`  
Baseline tree: `dec7bfac64e62f73670b9f3aaf23bc50ecd4fa2c`

The baseline already preserves the core boundaries this candidate depends upon:

```text
public foyer = non-authorizing
bounded learning != Contribution intake
GitHub issue != Hall receipt
submission != guaranteed review
review != authority
Canon != infallibility
Laboratory != Canon
```

## Governing invariant

> **Expose intentions at the threshold; reveal institutions only as the participant goes deeper.**

The four words are public intent primitives. They are not new institutional organs and do not replace Office, Scrolls, Laboratory, Constellation, Contribution, the Foyer 3 + 1, or the deeper Terminal.

## Constitutional reconciliation

The constitutional / epistemic review resolves the apparent tension between `intent first` and `Charter first` by separating interaction order from authority order:

> **Intent may be first in interaction; sovereignty remains first in authority.**

```text
INTERACTION AXIS
ASK | SEEK | KNOW | KNOCK

GOVERNANCE AXIS
SOVEREIGNTY -> INTELLIGENCE -> RELATIONSHIP -> CONTRIBUTION

AUTHORITY PRECEDENCE
CHARTER -> ratified governance -> ITX -> RIX -> Hall projection -> interaction
```

Selecting an Outer Court intent does not bypass constitutional protections, allocate rights, create authority, or accept a contribution.

## Intent definitions

### ASK

Participant intent: **learn, understand, orient, ask, or begin a question.**

Primary existing destinations:

```text
/projections/cit-learning-v0.1/
/orientation/
/scrolls/           when explanatory inheritance is useful
/map/               when system orientation becomes useful
```

Boundary:

> ASK should remain useful before identity, contribution, authority, or command capability is requested.

### SEEK

Participant intent: **investigate questions, evidence, active state, unresolved material, monitoring, or testing.**

Primary existing destinations:

```text
/laboratory/
/office/
/work/
/constellation/
/map/
/graph-viewer.html
/thread-explorer.html
/trace-viewer.html
/trace-detail.html
```

Boundary:

> Investigation exposes evidence and state without manufacturing truth, Canon status, or authority.

### KNOW

Participant intent: **inspect what has survived review and understand its current evidentiary standing, provenance, uncertainty, and revision history.**

Primary existing destinations:

```text
/scrolls/
/canon/
/work/               for lineage
/trails/             for retained transition history
/node-timeline.html  for temporal provenance
/office/             for current reviewed/public standing
```

Boundary:

```text
KNOW != certainty
KNOW != immutable truth
REVIEW != authority
CANON != delegated consequence authority
```

### KNOCK

Participant intent: **request governed participation in challenging, correcting, reproducing, extending, or returning evidence to the institution.**

Primary existing destination:

```text
/contribute/
```

Current external return:

```text
GitHub Issues
```

Boundary:

```text
GitHub submission != Hall receipt
submission != guaranteed review
review != authority
participation != institutional standing
```

`/control-panel.html` may support deeper artifact preparation, but it is **not** the public KNOCK threshold and must not be presented as consequence-bearing institutional control.

## Encounter-to-institution crosswalk

| Intent | First public question | Existing institutional services | Exit / transition |
|---|---|---|---|
| `ASK` | What would you like to understand? | Learning · Orientation · explanatory Scroll / Map context | Leave freely, continue learning, move to SEEK, or explicitly KNOCK with a return |
| `SEEK` | What would you like to investigate? | Laboratory · Office · Work · Constellation · Graph · Threads · Trace | Continue evidence traversal, move to KNOW when standing matters, or KNOCK with evidence |
| `KNOW` | What has survived review, and with what standing? | Scrolls · Canon · provenance · reviewed Office state · history | Inspect uncertainty / supersession; move to KNOCK to challenge or extend |
| `KNOCK` | What would you like to challenge, correct, reproduce, or return? | Contribution seam · current GitHub external return | Exit without submission or continue through explicit external attribution rules |

## Cross-cutting organs

### Office

Office remains the read-only present-state projection. It can answer contextual questions inside SEEK, KNOW, and KNOCK without being a first-screen noun.

```text
SEEK  -> what is active / waiting / blocked?
KNOW  -> what standing is currently reported?
KNOCK -> where is valid entry currently exposed?
```

The Office does not create institutional state or authority.

### Constellation

Constellation remains a derived relational navigation layer. It can help SEEK traverse relationships and KNOW inspect lineage. It must not become a separate fifth intent or a second truth system.

## Deeper surfaces

The following surfaces belong after participant intent has created a reason to reveal internal machinery:

```text
/terminal/
/control-panel.html
scroll-reader.html        legacy / overlapping reader
machine schemas / raw data
```

Vocabulary such as AVOT, TRACE, I AM, MoDev, QIL, Codex Control Center, or internal lifecycle objects should appear on demand rather than as prerequisites for entry.

Each deeper tool should carry a short boundary appropriate to its capability, such as:

> **Visible tool ≠ institutional control. Generated artifact ≠ persisted or authorized change.**

## Current routing debt

### Foyer noun-first navigation

The current root presents five institutional entrances before the participant has a reason to understand them:

```text
Office
Scrolls
Laboratory
Constellation
Contribution
```

Those distinctions remain valid. The debt is **ordering**, not ontology.

### Promoted candidate encounter — Repair 02

Three context-zero evaluations refined the threshold. The final threshold run returned `PASS`, with threshold vocabulary dependency `NONE`, deeper vocabulary dependency `EXPECTED`, repository reconciliation `PASS`, no boundary failures, and no further repairs recommended.

```text
TYME HALL
What brings you here?

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

Then reveal the Hall organ needed to fulfill that intent.

This is intentionally **not** changed to labels such as `ASK → Orientation`, `SEEK → Laboratory`, or `KNOW → Scrolls / Canon` on the first screen. Those nouns remain deeper because the point of the Outer Court is to reduce vocabulary dependency, not merely rename the current menu.

### Trails semantic overlap

`/trails/` currently carries two meanings:

1. orientation paths for newcomers;
2. append-only institutional Work / Branch lineage.

Candidate treatment:

```text
ASK  -> orientation paths
SEEK / KNOW -> institutional Trails
```

Do not make `Trails` a fifth outer-court primitive.

### Reader overlap

`/scroll-reader.html` predates the current Scroll publication boundary and overlaps with `/scrolls/` and `/canon/`.

Candidate treatment: retain only as a deeper / legacy reader until its content is reconciled with the reviewed inheritance model. Do not let it become a second unversioned KNOW source.

### Control-surface language

`/control-panel.html` generates local YAML / Markdown artifacts but its title may imply institutional control.

Before it is promoted in public navigation, its interface should explicitly distinguish:

```text
artifact generation
from
institutional write / merge / publication / authority
```

## No-new-route rule for v0.1

This contract does **not** require `/ask`, `/seek`, `/know`, or `/knock` routes to exist.

A first rendering candidate may use the four intents as cards / controls that route directly into existing surfaces. New route directories should be created only if later interaction design shows that an intent requires its own stateful or explanatory surface.

## Identity and continuity rule

The Outer Court must preserve the existing participation-before-registration posture.

```text
ASK  -> no persistent identity required by default
SEEK -> no persistent identity required by default
KNOW -> no persistent identity required by default
KNOCK -> current GitHub return may require GitHub identity because it is external
```

Future Hall-native continuity, pseudonymity, receipts, or I AM projection remain separate authorization questions.

`No persistent identity required by architecture` must not be inflated into a broader claim that no data is collected unless independently verified.

## Authority rule

All four intents have:

```text
authority_effect: none
```

An intent may expose evidence, learning, a review state, or a contribution entrance. It does not grant institutional standing, merge rights, Canon promotion rights, autonomous publication power, or delegated consequence authority.

## Rendering requirements from constitutional + epistemic review

Any later rendering candidate must preserve all of the following:

1. `Sovereignty first` remains visible and resolves to the Human Sovereignty constitutional source.
2. Intent selection cannot bypass disclosures required before identity, external transport, delegation, or consequential action.
3. Non-human technical sovereignty language cannot imply identical human rights or self-authorizing power.
4. Interactive AI / agent surfaces disclose actor type and material limitations when relevant.
5. Learn / Delegate / Co-create distinctions remain legible when they affect capability, responsibility, or authorship claims.
6. KNOW surfaces expose posture, provenance, uncertainty, revision, and supersession.
7. KNOCK discloses GitHub external identity / transport before crossing and never represents an issue as Hall receipt or guaranteed review.
8. Deep tools remain non-authorizing.
9. Exit remains first-class.

## Candidate selection algorithm

A future renderer or Steward may route a participant using the following non-authorizing logic:

```text
if intent is learning / orientation / explanation:
    ASK
else if intent is investigation / monitoring / testing / active state:
    SEEK
else if intent is reviewed inheritance / provenance / standing / canon:
    KNOW
else if intent is challenge / correction / evidence return / amendment request:
    KNOCK
else:
    ASK for the smallest clarifying question
```

This classification is a navigation aid, not a determination of user identity, competence, worth, or authority.

## Review status

```text
context-zero threshold gate: PASS
F-12 at Outer Court boundary: RESOLVED
KNOW certainty overreach: RESOLVED
fifth intent required: false
Charter × ITX × RIX + epistemic reconciliation: PASS
next gate: EXPLICIT HUMAN IMPLEMENTATION AUTHORIZATION
```

The constitutional / epistemic reconciliation is recorded at:

`validation/OUTER_COURT_CONSTITUTIONAL_EPISTEMIC_RECONCILIATION_V0_1.md`

## Promotion sequence

```text
routing contract candidate
-> machine-readable intent primitive
-> context-zero review packet
-> independent cold read
-> smallest semantic repair if needed
-> independent re-run after material wording change
-> Charter × ITX × RIX + epistemic reconciliation        PASS
-> explicit human implementation authorization           NEXT
-> separate rendering branch / PR
-> independent rendered-surface review
-> separate merge / deployment decision
```

## Non-goals

This candidate does not:

- edit the live `index.html`;
- change `main`;
- create new Hall ingress;
- promise native Hall receipts;
- activate identity / continuity storage;
- grant AVOT publication or action authority;
- promote any artifact to Canon;
- replace the current Foyer 3 + 1;
- collapse Office, Scrolls, Laboratory, Constellation, or Contribution into one content taxonomy.

## Memory compression

> **ASK encounters intelligence. SEEK pursues evidence. KNOW inspects reviewed inheritance without claiming certainty. KNOCK requests governed participation without granting authority. Intent may be first in interaction; sovereignty remains first in authority.**
