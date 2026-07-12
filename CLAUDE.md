# MIDI Device Lookup — Web Version

## Overview

Single-file web app: search MIDI CC/NRPN parameters for 400+ devices.
Published at: **https://jdaehler.github.io/midi-device-lookup/**

This is the **primary/canonical** implementation. The Ableton extension (`/Users/jd/Cowork/AbletonExtensions/midi-device-lookup/`) is derivative — always implement here first, then port.

---

## Project structure

```
midi-device-lookup-web/
├── src/
│   └── template.html       Source template — edit this, not index.html
├── scripts/
│   ├── fetch-and-build.mjs Fetches API data, injects into template → index.html
│   └── screenshot.mjs      Puppeteer screenshot generator
├── screenshots/             Current screenshots (4 PNG files)
├── releases/
│   └── v1.0.18/
│       ├── index.html       Built snapshot of this version
│       └── screenshots/     Screenshots at release time
├── index.html               Built output — committed to repo for GitHub Pages
├── README.md                GitHub landing page
└── package.json
```

---

## Build & release workflow

### 1. Build
```bash
cd /Users/jd/Cowork/midi-device-lookup-web
node scripts/fetch-and-build.mjs
```
Fetches fresh data from api.midi.guide → writes `index.html`.

### 2. Screenshots
```bash
node scripts/screenshot.mjs
```
Requires a local server running on port 7655:
```bash
npx serve . -p 7655
```
Generates 4 screenshots: `dark-list.png`, `dark-detail.png`, `light-list.png`, `light-detail.png`.

### 3. Release backup
```bash
VER=1.0.x   # current version
mkdir -p releases/v$VER/screenshots
cp index.html releases/v$VER/
cp screenshots/*.png releases/v$VER/screenshots/
```

### 4. Publish (after local approval)
```bash
# Push index.html + screenshots to GitHub Pages repo
SHA=$(gh api repos/jdaehler/midi-device-lookup/contents/index.html --jq '.sha')
CONTENT=$(base64 -i index.html)
gh api repos/jdaehler/midi-device-lookup/contents/index.html \
  --method PUT --field message="v$VER" \
  --field content="$CONTENT" --field sha="$SHA"
```
GitHub Pages serves from the `midi-device-lookup` repo root.

---

## Version

Version is set manually in `scripts/fetch-and-build.mjs` → `const VERSION = "1.0.x"`.  
Uses the same version number as the Ableton extension.

---

## Key implementation notes

- `src/template.html` contains all HTML/CSS/JS inline — `index.html` is the built output
- `__DEVICE_DATA__`, `__SUBTITLE__`, `__VERSION__` are replaced at build time
- NRPN filter chip: additive filter, stacks with search — `pool` variable pre-filters before search query
- Export modal (`showExport()`): CSV or JSON download for current device; `currentDevice` holds the active device; multi-device selection is the planned next step — modal UI already structured for it
- CSS uses variables (`--purple`, `--text-faint`, etc.) for theming — supports light + dark mode
- Screenshot: `dark-list.png` shows NRPN active + "Korg" search (combined filter demo)
