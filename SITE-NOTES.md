# AG Arcade site notes

Updated November 2, 2026.

The collection has eight entries: OpenFront Friends, HLM2 Web, Drive Mad, an NFL Retro Bowl '27 fan season, Moto X3M, Tiny Fishing, Retro Bowl College, and a Super Mario 64 player page. The NFL fan-season page updates the existing playable browser game with the 2026 schedule. Moto X3M and Tiny Fishing have local imported runtimes and player pages.

Local browser checks cover game-card navigation, mobile overflow, game canvases, start-menu input and fullscreen. Fresh Retro Bowl profiles probe nonexistent save/settings files and then correctly show empty save slots. The Moto X3M build emits a nonfatal Promise rejection with an undefined reason during startup; its menu, level selection, and runtime are checked separately. No additional error suppression was added.

The legacy repository and licenses remain intact. Game engine behavior and publisher SDKs are retained; optional portal/analytics loaders were removed from entry pages. The hub itself uses no third-party UI scripts or frameworks. Source snapshots are listed in THIRD-PARTY-GAMES.md.

Tiny Fishing uses an Expand/Exit expanded view control because browser-native fullscreen was unavailable in the tested player. Other player pages retain browser-native fullscreen.

Tiny Fishing's imported ad adapter waited indefinitely for an unrelated external ad-loader. The self-hosted integration now reports unavailable ad inventory through its existing failure path, resumes play, and does not fabricate rewarded-ad completions.


## 2026-11-02: Retro Bowl College

Added the seventh game, Retro Bowl College, using the existing local `files/load/rbcollege` engine. The new wrapper and all game assets deploy on AGames21.github.io; no Poki destination link. Added a matching cover and balanced the desktop grid. Browser checks passed: seven cards, mobile overflow check, College canvas, career setup, and fullscreen. The engine optionally probes for `rb_save_-1.json` on a fresh profile; that missing save is expected. Game rights remain with New Star Games.

## 2026-11-02: Super Mario 64 browser player

Added a card and same-origin WebRetro player using the included Mupen64Plus-Next core. The site supplies the emulator only; players select a game file from their device, and no Super Mario 64 ROM is included or fetched. The page also links to the direct-play reference provided by the user. The Pages workflow copies only the required WebRetro UI, license, and Nintendo 64 core files. A matching original castle/star illustration is used for the card.

Chrome smoke checks passed for all eight cards, 390px mobile width, the NFL Retro Bowl wrapper, and the Super Mario 64 player. WebRetro loaded the Nintendo 64 upload prompt and both Mupen64Plus-Next JS/WASM files with no page errors or missing local resources. A game ROM was not supplied, so in-game Mario gameplay has not been tested.

## 2026-11-02: NFL Retro Bowl '27 fan season

Updated the existing playable browser Retro Bowl card to “NFL Retro Bowl '27 Fan Season”. During Pages packaging, the workflow patches Year 1 in the deployed schedule with official 2026 NFL regular-season matchups; the repository's original `Schedule17.txt` remains unchanged. Start a new career to use the new schedule. The classic engine and player pool remain; Apple Arcade's Gauntlet mode and licensed '27 roster are not included.

Local Chrome checks passed for the eight-card homepage, 390px mobile width, the fan-season page/canvas, 272 updated schedule games, and Super Mario 64's uploader and direct-play link. No JavaScript errors or missing local files appeared; the only 404s were the game's expected first-run save/settings probes. Actual Mario gameplay requires the player to select their own game file.
