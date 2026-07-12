# MIDI Controller Import Format Research

## Summary of Findings

Research covering 12 hardware MIDI controllers / companion apps, looking for file-based import support for CC/NRPN parameter mappings.

---

## Which formats are realistic export targets?

### Tier 1 — Directly viable

**OXI One (.oxiindef JSON + midi.guide CSV)**
The most directly relevant target. OXI App accepts two formats:
1. `midi.guide` CSV — a simple tabular format with columns for parameter name, CC/NRPN number, type, range, and notes. Our tool (midi-device-lookup-web) already stores this data.
2. `.oxiindef` JSON — a compact JSON format with abbreviated instrument/parameter names and type annotations (CC7, CC14, NRPN). midi.guide already exports both, so we can mirror their approach exactly.

### Tier 2 — Viable with reverse-engineering / schema discovery

**Roto-Control Roto-Setup App (.json)**
Confirmed JSON format for MIDI setups. Schema not publicly documented, but since the format is plain JSON, inspecting an exported file would reveal the structure. Fields likely include: name/label, CC, MIDI channel, mode (CC/NRPN), plus UI extras (color, haptics). A JSON export from our tool targeting this schema is achievable.

**TouchOSC (.tosc = ZIP-compressed XML)**
Viable but requires generating a complete UI layout, not just a parameter list. The `tosclib` Python library can create .tosc files programmatically. A generated layout (e.g., a grid of labeled faders/knobs mapped to synth CCs) would be useful for any controller running TouchOSC. The format is community-documented and the XML structure is accessible.

**Lemur (.jzml = plain XML)**
Similar to TouchOSC: requires generating a full layout. The .jzml format is plain XML and human-editable. Good for advanced users who want a programmable touch surface with full MIDI control.

### Tier 3 — Not viable (proprietary/no import)

| App | Reason |
|---|---|
| Novation Components (SL MkIII, Launch Control XL) | SysEx-only import; JSON ↔ SysEx requires community library; no direct file import in web UI |
| Arturia MIDI Control Center | Proprietary binary, device-type-specific extensions; not hand-craftable |
| Akai MPC (.xmm) | Maps *incoming* controller → MPC, not outgoing CC assignments; wrong direction |
| Behringer X-Touch Editor (.bin) | Proprietary binary, Windows-only editor, no public spec |
| Komplete Kontrol | No per-template import/export at all; monolithic settings file |
| SSL 360 (UF8) | No file import for CC mappings; GUI-only configuration |
| Faderfox | No software editor exists |

---

## Common fields across viable formats

Comparing OXI (.oxiindef/CSV), Roto-Control (JSON), TouchOSC (XML), and Lemur (XML):

| Field | OXI CSV | OXI .oxiindef | Roto-Control JSON | TouchOSC XML | Lemur XML |
|---|---|---|---|---|---|
| Parameter name | ✓ | ✓ (abbreviated) | ✓ (label) | ✓ (control name) | ✓ (object name) |
| CC number | ✓ | ✓ | ✓ | ✓ | ✓ |
| MIDI channel | implied | implied | ✓ | ✓ | ✓ |
| Min value | described in notes | type-implied | ✓ | ✓ | ✓ |
| Max value | described in notes | type-implied | ✓ | ✓ | ✓ |
| NRPN support | ✓ | ✓ (CC14/NRPN) | ✓ | limited | ✓ |
| Description/notes | ✓ | — | — | — | — |
| Control type | inferred | CC7/CC14/NRPN | CC/NRPN | full MIDI types | full MIDI types |

---

## Recommended universal export schema

Based on the intersection of viable formats, a universal export record for each parameter should contain:

```json
{
  "name": "Filter Cutoff",
  "short_name": "Cutoff",
  "type": "CC7",
  "cc": 74,
  "nrpn_msb": null,
  "nrpn_lsb": null,
  "channel": 1,
  "min": 0,
  "max": 127,
  "description": "Controls the filter cutoff frequency"
}
```

**Field notes:**
- `name` — full parameter name (up to ~30 chars); used in Lemur, TouchOSC, Roto-Control
- `short_name` — abbreviated name (≤8 chars); required for OXI One display
- `type` — `"CC7"` (7-bit CC 0-127), `"CC14"` (14-bit CC using MSB/LSB pair), or `"NRPN"` 
- `cc` — CC number (0-127); null for NRPN
- `nrpn_msb` / `nrpn_lsb` — NRPN address bytes; null for CC
- `channel` — MIDI channel (1-16); many apps allow per-parameter channel override
- `min` / `max` — usable value range within 0-127 (e.g. some params use only 0-64)
- `description` — longer text; used in midi.guide CSV "notes" column, helpful for display

---

## Export format recommendations (priority order)

1. **midi.guide CSV** — simplest, already enables OXI App import; also useful as standalone reference
2. **OXI .oxiindef JSON** — compact, well-scoped; directly loadable into OXI One
3. **Roto-Control JSON** — once the schema is confirmed by inspecting an exported file
4. **TouchOSC .tosc** — high effort but high value; covers any device running TouchOSC
5. **SysEx (.syx) for Novation** — requires the community slmkiii library; niche but possible

---

## Sources

- [Novation Components SL MkIII Template Editor Guide](https://support.novationmusic.com/hc/en-gb/articles/360012446819)
- [slmkiii — community Python library for SL MkIII JSON/SysEx](https://github.com/inno/slmkiii)
- [Arturia MCC General Questions FAQ](https://support.arturia.com/hc/en-us/articles/6104313005340)
- [Akai MPC MIDI Map Import/Export](https://support.akaipro.com/en/support/solutions/articles/69000817918)
- [Melbourne Instruments Roto-Setup App](https://www.melbourneinstruments.com/roto)
- [OXI Instrument Definition support on midi.guide](https://midi.guide/blog/adding-oxi-instrument-definition-support/)
- [midi.guide open dataset GitHub](https://github.com/claudinec/midi-guide)
- [Behringer X-Touch Mini HandsOn (reverse engineering)](https://github.com/AndreasPantle/X-Touch-Mini-HandsOn)
- [TouchOSC Manual](https://hexler.net/touchosc/manual/complete)
- [tosclib — Python library for TouchOSC files](https://github.com/AlbertoV5/tosclib)
- [Lemur User Guide (MIDI Kinetics)](https://support.midikinetics.com/wp-content/uploads/2024/10/Lemur-User-Guide.pdf)
- [SSL UF8 product page](https://www.solidstatelogic.com/products/uf8)
- [Faderfox EC4](http://faderfox.de/ec4.html)
