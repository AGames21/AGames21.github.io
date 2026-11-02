# AG Arcade

A small, responsive game hub at https://agames21.github.io/.

The current collection is OpenFront Friends, HLM2 Web, and the existing Drive Mad game. OpenFront and HLM2 launch in their own tabs; Drive Mad has a local full-screen-capable player with a link back to the hub.

The homepage has no framework, remote fonts, analytics, or third-party UI scripts. New cover art and branding are original SVGs in `assets/arcade/`. Existing game files and the upstream Apache license are preserved. Game copyrights belong to their respective owners.

GitHub Actions publishes only the hub's pages, its assets, the license, and `files/drive-mad/`. The larger historical library remains in Git history/source but is not part of the new site's navigation or deployment. `library.html` redirects old bookmarks to the new collection.

To preview, serve the repository with any local static HTTP server. No package install or build is needed.
