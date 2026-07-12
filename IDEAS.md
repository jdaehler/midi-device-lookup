# MIDI Device Lookup — Ideas Backlog

Ideen aus YouTube-Video "Jetzt greift AKAI mit der billig MPC Sample an" (2026-07-09, ~min 53–67) und Session 2026-07-12.
Noch nicht implementiert — revisit wenn relevant.

---

## Export für Hardware-Controller

**Quelle:** ~min 60, Hosts diskutieren Candct-App, SL Mark 3, Oxi, Roto-Control

**Idee:** CC-Mapping eines Geräts in einem Format exportieren das direkt in Hardware-Controller-Apps importiert werden kann.

**Warum noch nicht:** Jede App hat ein anderes Format, kein Standard. Müsste app-spezifisch implementiert werden.

**Möglicher Einstieg:** Generischer JSON/CSV-Export mit Name, CC-Nummer und Range — viele Apps können das importieren.

---

## Funktionale Parameter-Gruppierungen / Templates

**Quelle:** ~min 63, Host: "wenn du Gruppierungen machst und sagst, dieses hier ADSR sind vier Werte"

**Idee:** Über die Sektions-Chips hinaus vordefinierte funktionale Templates anbieten — z.B. "Hüllkurve" fasst alle ADSR-Parameter zusammen egal in welcher Sektion sie liegen.

**Warum noch nicht:** Erfordert Keyword-Matching über Parameternamen (fehleranfällig) oder manuelle Annotation in midi.guide.

**Möglicher Ansatz:** midi.guide bitten, funktionale Tags in die API aufzunehmen — dann direkt darauf filtern. GitHub Issue #273 bereits gestellt (2026-07-09).

---

## Multi-Device Export

**Quelle:** Session 2026-07-12

**Idee:** Mehrere Geräte gleichzeitig auswählen und gemeinsam als CSV/JSON exportieren oder vergleichen.

**Stand:** Export-Modal ist bereits strukturell darauf vorbereitet (Devices-Sektion im Modal). Aktuell nur ein Gerät möglich.

---

## Suche über alle Geräte nach CC / Parameter-Name

**Quelle:** Session 2026-07-12

**Idee:** Suche nach CC-Nummer oder Parameter-Name über alle Geräte hinweg — z.B. "welche Geräte haben CC 74?" oder "welche Geräte haben einen Cutoff-Parameter?".

**Warum:** Aktuell ist nur Gerätesuche möglich. Umgekehrte Suche (vom Parameter zum Gerät) wäre im Alltag sehr nützlich.

---

## Favoriten

**Quelle:** Session 2026-07-12

**Idee:** Geräte als Favorit markieren, die immer oben in der Liste erscheinen (localStorage).

---

## Parameter-Verlauf / Quick-Access

**Quelle:** Session 2026-07-12

**Idee:** Zuletzt angesehene Geräte als Chips oder Quick-Access-Liste anzeigen (localStorage).

---

## Ableton-Integration tiefer

**Quelle:** Session 2026-07-12

**Idee:** Ausgewählte Parameter direkt in einen Ableton MIDI-Clip schreiben.

**Warum noch nicht:** Würde Remote Script Zugriff erfordern — deutlich aufwändiger als eine reine Extension. Langfristig.
