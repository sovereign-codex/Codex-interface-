# TYME Hall Outer Court Intent Routing v0.1

## Status

`ARCHITECTURE_CANDIDATE / ROUTING_CONTRACT`

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

Participant intent: **investigate what is active, unresolved, related, monitored, or being tested.**

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
| `KNOW` | What has survived review, and why? | Scrolls · Canon · provenance · reviewed Office state · history | Inspect uncertainty / supersession; move to KNOCK to challenge or extend |
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

Candidate future encounter:

```text
TYME HALL
What brings you here?

ASK
Learn. Question. Orient.

SEEK
Investigate what is becoming.

KNOW
Examine what has survived review.

KNOCK
Challenge, extend, or return evidence through a governed path.
```

Then reveal the Hall organ needed to fulfill that intent.

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

## Authority rule

All four intents have:

```text
authority_effect: none
```

An intent may expose evidence, learning, a review state, or a contribution entrance. It does not grant institutional standing, merge rights, Canon promotion rights, autonomous publication power, or delegated consequence authority.

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

## Context-zero success conditions

A fresh participant should be able to determine, without private project history:

1. where to learn or ask;
2. where to investigate active work or evidence;
3. where to inspect reviewed inheritance and its current standing;
4. how to challenge or return evidence;
5. that they may leave without creating an account or contributing;
6. that a contribution does not automatically become knowledge;
7. that review does not automatically create authority;
8. that Canon remains revisable through explicit provenance and governance;
9. that deeper system vocabulary is optional until needed.

## Promotion sequence

```text
routing contract candidate
-> machine-readable intent primitive
-> context-zero review packet
-> independent cold read
-> Charter × ITX × RIX + epistemic reconciliation
-> explicit human implementation authorization
-> rendering branch / PR
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

> **ASK encounters intelligence. SEEK pursues evidence. KNOW inspects reviewed inheritance. KNOCK requests governed participation in changing or extending it. The intents route into existing Hall organs; they do not replace them.**
