# Moon Sweepers 2D

An original, unofficial single-player lunar cleaning and factory game for browsers. Inspired by Moon Sweepers by DragDrop Games; no Steam code, models, textures, music or saves are included. This is a simplified 2D adaptation, not the complete native game.

**Play:** https://agames21.github.io/moon-sweepers/
**Source:** https://github.com/AGames21/moon-sweepers-web

## Play

- WASD / arrows: move. Hold Space or click: sweep. Auto sweep is available.
- E: unload into a nearby hopper/catcher/silo; otherwise sell dust at the depot.
- U: depot shop, unlocked hand tools and vehicle garage. V cycles owned vehicles at the depot.
- B: construction. Choose a structure, click a tile to place it, and use R to rotate its output. Inspect selects existing structures for rotation, upgrades or 75% salvage when empty.
- Mobile joystick, Sweep and Sell controls; buttons open construction and upgrades.

Six hand tools: toothbrush, household broom, wide rake, vacuum lance, magnetic sweeper and vortex collector. Vehicles: push sweeper, scout buggy, vacuum rover and industrial crawler, each with different speed, cleaning coverage and capacity.

## Automation

Build directional conveyors, unloading hoppers, drone catchers, silos, area vacuums, sand processors, stone furnaces, solar arrays and shipping terminals. Output arrows must connect to adjacent grid tiles. Dust sells for 1 credit/unit, sand for 3 and stone for 6; the shipment multiplier doubles these. Powered machines need the depot within 260m or solar within 240m. Machines stop when unpowered or full. Materials stay buffered when output is missing. Each structure has three purchasable upgrades, plus five global logistics research levels.

Drones physically collect and carry dust, then return to a nearby catcher or the depot. Vacuums clean a finite area and can be emptied/salvaged and rebuilt elsewhere. Cargo is conserved; processing changes value, not mass. There is no offline production.

New moons start with 240 credits. The 220-credit starter layout provides a connected hopper → belt → sand processor → belt → shipping terminal southeast of the depot. Load its hopper with E. Factory sandbox (`?mode=sandbox`) has all tools/vehicles, four drones, 10,000 credits and a working powered factory, with a separate save.

## Run and host

No dependencies or build required. Run `python -m http.server 8791`, then visit http://localhost:8791. For static hosting copy index.html, style.css and all six runtime JS modules (core, factory, drones, sandbox, visuals, game) together. Relative paths support subdirectory hosting.

`npm test` runs all tests. `npm run build` generates the standalone PLAY.html; this can also be opened manually without a server. Direct local-file launch could not be verified by the automation browser, whose policy only permits HTTP/HTTPS. Browser storage for local files varies.

## Saves and limits

Normal saves retain `moonSweepers2d.v1`; version 1 data migrates to version 2 with terrain, money and upgrades preserved (the old rover becomes an owned vacuum rover). Sandbox uses `moonSweepers2d.sandbox.v2`. Autosave is local to this browser/origin; use the pause menu's JSON export/import for backups. Imports validate state before confirmation. Multiplayer, the original full map/economy and exact native-game systems are not reproduced. See VERIFICATION.md for tested behavior and remaining limits.

Original code/art are MIT licensed. The original Moon Sweepers game is credited at https://steamcommunity.com/app/5335510 .
