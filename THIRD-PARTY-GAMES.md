# Self-hosted game builds

Retro Bowl uses the existing archived build from this repository. Moto X3M and Tiny Fishing runtime files were imported from these public source snapshots:

- https://github.com/tbg69/MotoX3M at `a46976e2b91a65af1d09537f320e76f5b7b83ac1`
- https://github.com/ubg98/TinyFishing at `0d12e52af4d244e333f2f3177b9e6075f2725232`

Game engines, artwork, music, and developer credits remain the property of their respective creators and are not relicensed as the arcade UI. Original runtime files are retained apart from portal/analytics loader removal and page metadata. AG Arcade wraps them in same-origin pages; no Poki launch links are used. Tiny Fishing ad inventory is explicitly unavailable on this host; its existing failure callback resumes the game and denies rewarded bonuses. The imported external ad loader is not executed.

Super Mario 64 opens the existing WebRetro 6.5 browser emulator (MIT; https://github.com/BinBashBanana/webretro) with its Mupen64Plus-Next Nintendo 64 core. The site does not include or fetch a Super Mario 64 ROM; the player selects a game file from their own device, which WebRetro reads in the browser. Nintendo game content and trademarks remain Nintendo's property.

The Super Mario 64 page also links to the user's requested direct-play reference at https://supermario64.io/. This is an external site, not a game build copied into AG Arcade.

NFL Retro Bowl '27 is an Apple Arcade-exclusive game, according to New Star Games. AG Arcade's playable “NFL Retro Bowl '27 Fan Season” updates the existing classic browser build with the official 2026 NFL regular-season matchups (https://www.nfl.com/schedules/2026/), applied to Year 1 in the deployment artifact. It does not include New Star's Gauntlet mode or licensed '27 player rosters and is not the official Apple Arcade game. The original `Schedule17.txt` in the repository is preserved.

The fan-season page includes a separate 2026 roster/stats reference panel. Player/roster data comes from `roster_2026.csv.gz` and weekly stats from `stats_player_week_2026.csv.gz`, published by `nflverse/nflverse-data` under CC BY 4.0. Stats are aggregated by player through the Week 8 snapshot, and the dataset's `LA` code is mapped to the Rams. The panel lists HC/OC/DC staff from Edgehalla (Nov 1, 2026) and HC records from ESPN. These reference records are separate from the classic game engine's generated player roster.


## 2026-11-02: Retro Bowl College

Added the seventh game, Retro Bowl College, using the existing local `files/load/rbcollege` engine. The new wrapper and all game assets deploy on AGames21.github.io; no Poki destination link. Added a matching cover and balanced the desktop grid. Browser checks passed: seven cards, mobile overflow check, College canvas, career setup, and fullscreen. The engine optionally probes for `rb_save_-1.json` on a fresh profile; that missing save is expected. Game rights remain with New Star Games.


## 2026-11-03: same-tab games and accurate Retro Bowl labeling

OpenFront and HLM2 now navigate in the current tab. OpenFront has an AG Arcade return link. Removed the separate NFL reference-data chart from the Retro Bowl player. The card/page now says Retro Bowl 2026 fan season: this remains the classic browser engine with a 2026 schedule and generated players. It does not contain the licensed NFL Retro Bowl 27 app, real-player roster, official coach database, or imported live NFL stats. The official app is Apple Arcade exclusive (https://www.newstargames.com/nfl-retro-bowl-27). Existing career storage paths and keys are preserved. A fresh career wrote a 232 KB native savedata.ini and survived a full page reload unchanged in browser verification.


## HexGL and Hextris (2026-11-03)

- HexGL: https://github.com/BKcore/HexGL at 6addc95a2fce3bf05f4d751823cc054c61a16d68. MIT unless a resource specifies otherwise; LICENSE and audio-specific notices/credits retained.
- Hextris: https://github.com/Hextris/hextris at 3f4847dc8fd7dab3d1c87e6324b9159d92fbd396. GPL-3.0-or-later; complete imported source and LICENSE.md retained in files/games/hextris.

Both run from same-origin GitHub Pages assets. Removed analytics bootstrap scripts and repaired insecure font/favicon references; developer credits remain. Tank Arena is original code, not a copied game. Firebase SDK 13.1.0 is Apache licensed; linked legal notices accompany its esbuild bundle.

Standard Retro Bowl is restored: deployment no longer patches Schedule17.txt and the page/card no longer advertises a 2026 fan season or NFL Retro Bowl 27. Existing engine/storage paths are unchanged so careers retain their save keys. The installed browser engine has generated players and single-player gameplay. New Star documents pass-and-play Exhibition for the mobile game: https://www.newstargames.com/post/09-feb-2023-exhibition-mode-for-retro-bowl . This is not online multiplayer for the browser copy.

## Homepage icon artwork (2026-11-03)

The following local game artwork is reused in assets/arcade/icons: Drive Mad webapp/cover.jpg, Retro Bowl img/icon.jpg, HexGL icon_256.png and Hextris images/icons/apple-touch-512.png. The creator and license notices above continue to apply; HexGL and Hextris source/licenses remain in files/games.

OpenFront, HLM2 Web, Moto X3M, Tiny Fishing, Retro Bowl College, Super Mario 64 and Tank Arena use original SVG illustrations created for this arcade. These are unofficial visual remakes, not official publisher logos. Game names and recognizable characters remain the property of their respective owners. No private game assets or ROMs were added for these illustrations.
