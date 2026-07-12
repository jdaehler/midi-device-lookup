# MIDI Device Lookup — Ideas Backlog

Ideen aus YouTube-Video "Jetzt greift AKAI mit der billig MPC Sample an" (2026-07-09, ~min 53–67).
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

**Möglicher Ansatz:** midi.guide bitten, funktionale Tags in die API aufzunehmen — dann direkt darauf filtern.
