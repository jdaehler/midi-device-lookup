# MIDI Device Lookup

Browse CC and NRPN parameters for 400+ hardware MIDI devices — directly in your browser, no installation needed.

🔗 **[jdaehler.github.io/midi-device-lookup](https://jdaehler.github.io/midi-device-lookup/)**

---

## What it does

- Search across 400+ hardware devices from 120+ manufacturers
- Browse CC and NRPN parameters with min/max ranges, descriptions, and sections
- Filter within a device's parameter list
- Click any parameter row to copy its CC or NRPN number to the clipboard
- Copy TSV button exports the full (or filtered) parameter list — paste into Excel or Numbers
- Search history saved in your browser (last 8 searches)

## Data

Device data comes from [pencilresearch/midi](https://github.com/pencilresearch/midi) (CC-BY-SA 4.0).  
The site is rebuilt automatically every Monday to pick up new devices and corrections.

## Ableton Live Extension

If you use Ableton Live, the same lookup is available as a right-click context menu extension — no browser needed.

🔗 [MIDI Device Lookup for Ableton](https://github.com/jdaehler/abletonliveextensions/releases/tag/midi-device-lookup) · part of the [ARPMAN Extensions](https://github.com/jdaehler/abletonliveextensions)

---

## How it's built

The site is a single `index.html` file — no framework, no dependencies, no server.

```
scripts/
  fetch-and-build.mjs   Fetches all CSVs from pencilresearch/midi, builds index.html
src/
  template.html         UI template — device data injected at build time
.github/workflows/
  weekly-build.yml      GitHub Action: runs every Monday, commits updated index.html
```

### Build locally

```bash
node scripts/fetch-and-build.mjs
```

Requires Node.js 18+. Fetches ~400 CSV files from GitHub and writes `index.html` (~2.2 MB).

---

## What's New

**v2026.07.08**
- Light / dark mode toggle (respects system theme, choice saved in browser)
- Clear button in search field
- Version number shown in header

---

Made by [ARPMAN / WireDrifter](https://youtube.com/@WireDrifter)
