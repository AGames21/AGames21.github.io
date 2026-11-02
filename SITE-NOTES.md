# AG Arcade site notes

Updated November 2, 2026.

The public homepage is now **AG Arcade**, with three game cards: OpenFront Friends, HLM2 Web, and Drive Mad. The original source and license remain in the repository; the historical library is not included in the curated deployment.

- OpenFront: https://agames21.github.io/openfront-friends/
- HLM2: https://agames21.github.io/hlm2-web/
- Drive Mad: `/drive-mad.html`, wrapping the retained `/files/drive-mad/` game.

New hub UI and SVG covers are self-contained. Drive Mad's old portal title, legacy portal script, analytics loader, and unrelated redirect/advertising loader were removed from its entry page; the game engine and assets remain unchanged.

Local Chrome verification passed: exactly three correct game links; no visible old branding; desktop and 390px mobile layouts; no horizontal overflow; old library bookmark redirects; Drive Mad rendered a running game canvas inside the new player; no missing local resources or JavaScript page errors. Screenshots were visually inspected.

The Pages workflow packages the small current site and the 2.9 MB Drive Mad folder. It uses sparse checkout rather than uploading the full historical repository.
