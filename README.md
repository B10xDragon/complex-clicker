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

