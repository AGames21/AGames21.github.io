# Self-hosted game builds

Retro Bowl uses the existing archived build from this repository. Moto X3M and Tiny Fishing runtime files were imported from these public source snapshots:

- https://github.com/tbg69/MotoX3M at `a46976e2b91a65af1d09537f320e76f5b7b83ac1`
- https://github.com/ubg98/TinyFishing at `0d12e52af4d244e333f2f3177b9e6075f2725232`

Game engines, artwork, music, and developer credits remain the property of their respective creators and are not relicensed as the arcade UI. Original runtime files are retained apart from portal/analytics loader removal and page metadata. AG Arcade wraps them in same-origin pages; no Poki launch links are used. Tiny Fishing ad inventory is explicitly unavailable on this host; its existing failure callback resumes the game and denies rewarded bonuses. The imported external ad loader is not executed.

Super Mario 64 opens the existing WebRetro 6.5 browser emulator (MIT; https://github.com/BinBashBanana/webretro) with its Mupen64Plus-Next Nintendo 64 core. The site does not include or fetch a Super Mario 64 ROM; the player selects a game file from their own device, which WebRetro reads in the browser. Nintendo game content and trademarks remain Nintendo's property.

The Super Mario 64 page also links to the user's requested direct-play reference at https://supermario64.io/. This is an external site, not a game build copied into AG Arcade.

NFL Retro Bowl '27 is an Apple Arcade-exclusive game, according to New Star Games. AG Arcade's playable “NFL Retro Bowl '27 Fan Season” updates the existing classic browser build with the official 2026 NFL regular-season matchups (https://www.nfl.com/schedules/2026/), applied to Year 1 in the deployment artifact. It does not include New Star's Gauntlet mode or licensed '27 player rosters and is not the official Apple Arcade game. The original `Schedule17.txt` in the repository is preserved.


## 2026-11-02: Retro Bowl College

Added the seventh game, Retro Bowl College, using the existing local `files/load/rbcollege` engine. The new wrapper and all game assets deploy on AGames21.github.io; no Poki destination link. Added a matching cover and balanced the desktop grid. Browser checks passed: seven cards, mobile overflow check, College canvas, career setup, and fullscreen. The engine optionally probes for `rb_save_-1.json` on a fresh profile; that missing save is expected. Game rights remain with New Star Games.
