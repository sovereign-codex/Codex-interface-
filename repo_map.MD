# repo_map.MD

## Repository
- Name: `sovereign-codex/Codex-interface-`
- Role: Human-facing interface layer for Codex-Net
- Last observed: 2026-05-16

## Canon
- Static mobile-first interface surface with no checked-in build tooling. Evidence: `README.md`, `index.html`, `assets/css/style.css`, `assets/js/app.js`. Last observed: 2026-05-16.
- The checked-in UI surface includes eight HTML entry points: `index.html`, `control-panel.html`, `graph-viewer.html`, `trace-viewer.html`, `trace-detail.html`, `node-timeline.html`, `scroll-reader.html`, and `thread-explorer.html`. Evidence: repository root file set and `index.html`. Last observed: 2026-05-16.
- `control-panel.html` is a local artifact generator for repo, thread, decision, and codex-entry YAML or Markdown output. Evidence: `control-panel.html`. Last observed: 2026-05-16.
- `scroll-reader.html` and `thread-explorer.html` currently ship with embedded static content rather than fetched runtime data. Evidence: `scroll-reader.html`, `thread-explorer.html`. Last observed: 2026-05-16.
- `graph-viewer.html` is an interactive graph canvas with focus state, path tracing, root-cause candidates, and time playback. Evidence: `graph-viewer.html`. Last observed: 2026-05-16.
- `graph-viewer.html` depends on external graph and reliability feeds from `sovereign-codex/Codex-net-index`: `data/system-graph.json` and `data/node-reliability.json`. Evidence: `graph-viewer.html`. Last observed: 2026-05-16.
- `trace-detail.html` depends on external trace and relationship data from `sovereign-codex/AVOT-TRACE` and `sovereign-codex/Codex-net-index`: `traces/*.json`, `data/trace-index.json`, and `relationships/generated/cross-trace-intelligence.json`. Evidence: `trace-detail.html`. Last observed: 2026-05-16.
- `node-timeline.html` depends on external trace and reliability data from `AVOT-TRACE` and `Codex-net-index`. Evidence: `node-timeline.html`. Last observed: 2026-05-16.
- Shared styling and small DOM helpers are centralized in `assets/css/style.css` and `assets/js/app.js`. Evidence: `style.css`, `app.js`, and HTML page imports. Last observed: 2026-05-16.

## Hypothesis
- `trace-viewer.html` likely expects a published or generated local `data/trace-index.json` artifact during deployment, because the page references that path but the checked-in tree does not currently contain the file. Evidence: `trace-viewer.html`; absence of matching checked-in `data/trace-index.json` in repository search. Last observed: 2026-05-16.
- The repository is evolving from a simple static control surface into a cross-repo observability client for trace and graph inspection. Evidence: README baseline versus the newer `trace-viewer.html`, `trace-detail.html`, `node-timeline.html`, and recent commits. Last observed: 2026-05-16.

## Active Work
- Recent work has concentrated on observability views rather than the original static module set. Evidence: recent commits on `trace-viewer.html`, `trace-detail.html`, `node-timeline.html`, and `graph-viewer.html` dated 2026-05-02 through 2026-05-04. Last observed: 2026-05-16.
- `graph-viewer.html` received substantial interaction and temporal playback expansion in commit `3266c025ae4aee6b61f1100736abbef0d5269122` on 2026-05-04. Evidence: commit history for `graph-viewer.html`. Last observed: 2026-05-16.
- `trace-viewer.html` and `trace-detail.html` were introduced and then iterated repeatedly on 2026-05-02 and 2026-05-03. Evidence: commit history for those files. Last observed: 2026-05-16.

## Deprecated
- The README's reference to `data/sample-graph.json` is stale relative to the currently observed repository tree. Evidence: `README.md`; repository search did not find a checked-in `data/sample-graph.json`. Last observed: 2026-05-16.
- `MAP.md` describes the "initial modules" and does not yet reflect the trace-detail or node-timeline surfaces now present in the repo. Evidence: `MAP.md` compared with the current root HTML files. Last observed: 2026-05-16.

## Boundaries
- Upstream data producers: `Codex-net-index` for graph and reliability datasets; `AVOT-TRACE` for trace artifacts.
- This repository's responsibility: render human-facing pages and light interaction logic over those datasets.
- Not observed here: backend orchestration, workflow execution, persistent memory writes, or checked-in build tooling.
