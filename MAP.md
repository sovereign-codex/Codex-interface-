# Codex Interface Map

## Role
Human-facing interface layer for Codex-Net.

## Why it belongs here
This repository keeps UI separate from backend orchestration.

- `codex-control-center` = webhook intake, routing, council execution, memory writes
- `codex-interface` = mobile dashboard, graph, scrolls, thread explorer

## Initial modules

- `index.html` — landing hub
- `control-panel.html` — YAML generator for iPhone use
- `graph-viewer.html` — relationship display
- `scroll-reader.html` — codex reading surface
- `thread-explorer.html` — browse active threads

## Mobile-first principles

- one-thumb navigation
- large input fields
- readable cards
- no build step
- static hosting compatible
- GitHub Pages friendly
