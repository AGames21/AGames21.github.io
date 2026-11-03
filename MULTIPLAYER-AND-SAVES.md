# Multiplayer and save backups

Tank Arena is original AG Arcade game code. Practice runs locally. Private rooms use Firebase project `ag-arcade-frontier` on its free Spark plan, with isolated anonymous sessions named `ag-arcade-tanks`. Google/email OpenFront sessions are kept separate. Two players share a host-ordered arena; if one leaves, the survivor can continue against AI. Private codes and invite links are available. This is casual peer-hosted play, not a ranked or cheat-proof server.

The security rules live in `AGames21/openfront-friends/database.rules.json`; only the host can publish tank state and only the joined guest can publish guest input. Room metadata expires for joining/state writes after two hours. Anonymous sign-in was enabled without changing the billing plan or Google/email providers. Old room history should be periodically cleaned in the Firebase console. No paid services or automatic billing upgrades are configured.

`assets/arcade/firebase-sdk.js` bundles Firebase 13.1.0 with esbuild 0.25.6. `tools/firebase-sdk-entry.js` is the source entry point. In a build workspace with those packages installed, run:

```
esbuild tools/firebase-sdk-entry.js --bundle --minify --format=esm --legal-comments=linked --outfile=assets/arcade/firebase-sdk.js
```

Keep the linked LEGAL.txt alongside the bundle. The Firebase web configuration is public client configuration, not an admin credential. Private OAuth/client secrets and admin credentials must not be committed.

Save backups include allowed game-specific localStorage keys plus the current guest/account's OpenFront IndexedDB world. They do not export Firebase sign-in credentials, other accounts' worlds, game caches or ROM files. JSON files are limited to 25 MB; restoration validates keys/structure and replaces only matching supported saves. Cross-device cloud sync is not implemented. HexGL/Hextris keep their upstream license notices and game code.

Hextris active saveState uses upstream JSONfn function revival. Active-run data is deliberately excluded from external backup export/restore; only its best scores are backed up. Its own native autosave remains in the current browser. This prevents an imported file from introducing executable function strings into the shared site origin.
