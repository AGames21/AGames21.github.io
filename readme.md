# AG Arcade

A responsive six-game hub at https://agames21.github.io/.

OpenFront Friends and HLM2 Web open their dedicated GitHub Pages sites. Drive Mad, Retro Bowl, Moto X3M, and Tiny Fishing play inside same-origin player pages with Back and fullscreen/expanded-view controls. No game card links to Poki.

The hub uses plain HTML/CSS and original SVG cover art in `assets/arcade/`. Game engines and assets retain their respective developer credits; see THIRD-PARTY-GAMES.md for imported source snapshots. The original repository license is preserved.

GitHub Actions uses sparse checkout and deploys only the current pages, UI assets, license, and selected game folders. Historical source files remain in Git. `library.html` redirects old bookmarks to the collection.

Preview with any static HTTP server. No package installation or build is needed.


## 2026-11-02: Retro Bowl College

Added the seventh game, Retro Bowl College, using the existing local `files/load/rbcollege` engine. The new wrapper and all game assets deploy on AGames21.github.io; no Poki destination link. Added a matching cover and balanced the desktop grid. Browser checks passed: seven cards, mobile overflow check, College canvas, career setup, and fullscreen. The engine optionally probes for `rb_save_-1.json` on a fresh profile; that missing save is expected. Game rights remain with New Star Games.
