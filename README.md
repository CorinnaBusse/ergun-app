# DRUCKVERLUST·MONITOR

Live-Simulation eines Druckverlustprüfstands für Schüttschichten im Ohm-Corporate-Design
(Fakultät Angewandte Chemie, TH Nürnberg).

Luft strömt durch eine liegende Kugelschüttung; der Druckverlust wird nach der **Ergun-Gleichung**
berechnet und an einem U-Rohr-Manometer (gefärbtes Wasser) als Δh angezeigt. Durch Variation des
Volumenstroms wird punktweise die Kennlinie Δh vs. V̇ aufgenommen.

**Live:** https://corinnabusse.github.io/ergun-app/

## Funktionen

- **Aufbau einstellen** – Rohrdurchmesser D (2–15 cm), Kugeldurchmesser d_K (1–20 mm) und
  Schütthöhe L (10–100 cm). Diese Werte werden gesperrt, sobald der erste Messpunkt gesammelt wurde.
- **Volumenstrom eingeben** – V̇ in NL/min (0–200). Ein Punkt wird erst beim Bestätigen
  (Enter / Feld verlassen) aufgenommen.
- **Messfehler** – auf jede Ablesung wird ein normalverteilter Fehler (σ = 1 mm) aufaddiert.
- **Animierte Aufbau-Grafik** – Schüttung, Strömungspfeile (Geschwindigkeit ∝ V̇) und
  U-Rohr-Manometer mit Skala; Warnung bei Überschreitung des Messbereichs (±300 mm).
- **Kennlinie** – Streudiagramm Δh vs. V̇, Zoom per Mausrad.
- **CSV-Export** – Messpunkte inkl. Aufbauparametern (Semikolon-getrennt, Dezimalkomma, Excel-kompatibel).

## Modell

| Größe | Ansatz |
|---|---|
| Druckverlust | Ergun: ΔP/L = 150·η·u₀·(1−ε)²/(ε³·d_K²) + 1,75·ρ·u₀²·(1−ε)/(ε³·d_K) |
| Porosität ε | Dixon (1988), Wandeffekt: ε = 0,4 + 0,05/N + 0,412/N², N = D/d_K |
| Luftdichte ρ | ideales Gas bei 20 °C und 1013,25 hPa |
| Viskosität η | Sutherland-Gleichung |
| Volumenstrom | Normliter (0 °C, DIN 1343), auf Betriebstemperatur umgerechnet |
| Manometer | Δh = ΔP / (ρ_Wasser · g) |

## Technik

React 18 · Vite 5 · Tailwind CSS 4 · Recharts

## Schnellstart

```bash
npm install
npm run dev
```

## Produktions-Build

```bash
npm run build     # Ausgabe in dist/
npm run preview   # Build lokal ansehen
```

## Deployment

Jeder Push auf `main` wird über GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
gebaut und auf GitHub Pages veröffentlicht. Der Basis-Pfad `/ergun-app/` ist in
[vite.config.js](vite.config.js) gesetzt.

## Projektstruktur

```
src/
  App.jsx     Simulation, Grafik, Kennlinie, CSV-Export
  main.jsx    Einstiegspunkt
  index.css   Tailwind-Import
index.html
vite.config.js
```
