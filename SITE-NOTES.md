# AG Arcade site notes

Updated November 2, 2026.

The collection has six games: OpenFront Friends, HLM2 Web, Drive Mad, Retro Bowl, Moto X3M, and Tiny Fishing. Retro Bowl was changed from a Poki launch link to the existing archived build on this GitHub Pages site. Moto X3M and Tiny Fishing have local imported runtimes and player pages.

Local browser checks cover six-card navigation, mobile overflow, game canvases, start-menu input and fullscreen. Fresh Retro Bowl profiles probe nonexistent save/settings files and then correctly show empty save slots. The Moto X3M build emits a nonfatal Promise rejection with an undefined reason during startup; its menu, level selection, and runtime are checked separately. No additional error suppression was added.

The legacy repository and licenses remain intact. Game engine behavior and publisher SDKs are retained; optional portal/analytics loaders were removed from entry pages. The hub itself uses no third-party UI scripts or frameworks. Source snapshots are listed in THIRD-PARTY-GAMES.md.
