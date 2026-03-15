# Codex Interface

Mobile-first interface layer for Codex-Net.

This repository is designed to work well from an iPhone on day one.
It keeps the human-facing UI separate from backend orchestration.

## Modules

- `index.html` – landing hub
- `control-panel.html` – create YAML for repos, threads, decisions, codex entries
- `graph-viewer.html` – lightweight relationship viewer using sample graph data
- `scroll-reader.html` – readable card-style scroll viewer
- `thread-explorer.html` – browse active threads
- `assets/css/style.css` – shared mobile-first styling
- `assets/js/app.js` – shared helpers
- `data/sample-graph.json` – sample graph data for local UI testing

## Design principles

- Mobile-first
- No build step required
- Works as static files
- Easy to host on GitHub Pages
- Keeps Codex Control Center backend separate from human interface
