# AG Arcade site notes

Updated November 2, 2026.

The collection has six games: OpenFront Friends, HLM2 Web, Drive Mad, Retro Bowl, Moto X3M, and Tiny Fishing. Retro Bowl was changed from a Poki launch link to the existing archived build on this GitHub Pages site. Moto X3M and Tiny Fishing have local imported runtimes and player pages.

Local browser checks cover six-card navigation, mobile overflow, game canvases, start-menu input and fullscreen. Fresh Retro Bowl profiles probe nonexistent save/settings files and then correctly show empty save slots. The Moto X3M build emits a nonfatal Promise rejection with an undefined reason during startup; its menu, level selection, and runtime are checked separately. No additional error suppression was added.

The legacy repository and licenses remain intact. Game engine behavior and publisher SDKs are retained; optional portal/analytics loaders were removed from entry pages. The hub itself uses no third-party UI scripts or frameworks. Source snapshots are listed in THIRD-PARTY-GAMES.md.

Tiny Fishing uses an Expand/Exit expanded view control because browser-native fullscreen was unavailable in the tested player. Other player pages retain browser-native fullscreen.

Tiny Fishing's imported ad adapter waited indefinitely for an unrelated external ad-loader. The self-hosted integration now reports unavailable ad inventory through its existing failure path, resumes play, and does not fabricate rewarded-ad completions.


## 2026-11-02: Retro Bowl College

Added the seventh game, Retro Bowl College, using the existing local `files/load/rbcollege` engine. The new wrapper and all game assets deploy on AGames21.github.io; no Poki destination link. Added a matching cover and balanced the desktop grid. Browser checks passed: seven cards, mobile overflow check, College canvas, career setup, and fullscreen. The engine optionally probes for `rb_save_-1.json` on a fresh profile; that missing save is expected. Game rights remain with New Star Games.
