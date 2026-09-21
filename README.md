# STARFORGE // Energy Empire

A polished, static, mobile-friendly incremental game built with vanilla ES modules and CSS. No backend or copyrighted assets are required.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. The generated `dist/` folder can be hosted by GitHub Pages or any static host. For GitHub Pages, publish the repository through a Pages workflow using Node, run `npm ci && npm run build`, and upload `dist`.

## Gameplay

Generate energy with the reactor, build an expanding production network, install upgrades, complete the branching research lattice, map new star systems, and transcend for permanent prestige shards. Production runs continuously while the page is open. Offline rewards are recovered for up to two hours by default or twelve hours with Chrono Batteries. The boost button doubles production for sixty seconds.

## Save system

Progress is versioned and stored in `localStorage` under `starforge-save`. It autosaves every ten seconds and on page close. Settings provides manual save, JSON export/import with validation, and a confirmed reset. The engine contains a migration path so future save versions can add defaults without losing existing fields.

## Structure

```text
src/
  app/main.js             # UI composition and interaction wiring
  data/gameData.js        # resources, buildings, upgrades, research, achievements
  systems/gameEngine.js   # state, simulation, purchases, prestige, saves
  styles/main.css         # responsive sci-fi dashboard theme
index.html
```

## Implemented systems

Manual critical clicks, combo streaks, ten resource types, twelve scalable buildings, bulk buying, production/automation/conversion/offline upgrades, branching research, first and second prestige layers, galaxy map and expedition unlock, missions, achievements, statistics, events/logs, local save protection, keyboard/touch input, responsive iPad/mobile layout, and GitHub Pages-compatible static deployment.
## Galaxy progression (v6)

Galaxy navigation unlocks through Space Exploration research or the Deep-space
Navigation upgrade. Select a map node to jump to its destination card. Discoveries
are instant energy purchases: the card shows the exact cost, prerequisite route,
and any required research. Each discovery adds 5% to the production multiplier.
Buttons update as resources accumulate, without leaving the page.

Eighteen systems now form a web across four named galaxies. Vega leads to Orion and
the Silent Void, while the wider route continues through Sirius, Rigel, Andromeda,
Event Horizon and three further galactic sectors. Fourteen discovered systems support
outposts with ten levels each. Outposts consume credits and matter and produce
data, matter, research, dark energy, quantum cores, antimatter or cosmic knowledge.
Their output receives ordinary production modifiers and works offline.
Sixteen additional milestone missions award one-time prestige shards.

Version 6 saves preserve older discoveries and initialize skills and Frontier mastery
at zero. Prestige resets discoveries and outposts, while skills and Frontier mastery
remain permanent. Three skill branches contain 25 ranks per node with scaling costs;
Frontier mastery has no maximum level. Exploration rules are in
src/systems/exploration.js; destination, galaxy and skill definitions are in
src/data/gameData.js. Run regression checks with
`node --test tests/regressions.test.js` and build with `npm run build`.
