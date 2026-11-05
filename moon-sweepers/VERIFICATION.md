# Verification — November 5, 2026

Passed: 5 Node tests covering collect/capacity/sell/first upgrade, all upgrade costs and caps, automated dust accounting and 100% completion, save round trips and corrupt-save rejection, fractional dust conservation. `node --check game.js` passed.

Chrome at a local HTTP origin: started a real game, moved with held D, swept dust with Space/auto sweep, sold dust at the depot for 6 credits, opened the shop with U, confirmed unaffordable purchases disabled, paused/saved/reloaded, and resumed with the same 6 credits and 0.03% restored terrain. The standalone PLAY.html also loaded over HTTP with saved state. Captured browser error logs were empty. Browser automation rendering was throttled, so this is functional evidence, not a smooth-framerate benchmark.

Responsive DOM check at 390 × 844: document width 375px (within the viewport); joystick, sweep and sell controls present. Desktop scene visually inspected. Mobile input on a physical phone, audible output, fullscreen, import/export dialogs, a complete campaign and endgame automation were not exercised in the browser. Their relevant underlying state rules are covered by core tests where applicable.

Direct `file://` navigation was blocked by the automation browser URL policy. Double-click launch of PLAY.html remains user-verifiable; the identical standalone document was tested over HTTP. Browser storage behavior for local files varies.

No original game launch, native gameplay comparison, Steam changes, extraction, uploads, pushes, arcade edits or publication occurred. This is an original simplified 2D adaptation, not a faithful complete port.

Rebuild standalone: `node build.mjs`. Run core checks: `npm test`. To test the modular website: `python -m http.server 8791`, then visit http://localhost:8791.


## Factory expansion and GitHub release — November 5, 2026

12 automated checks pass: existing collection/accounting/save rules plus starter production, a complete powered extractor → conveyor → sand → stone → export chain, no-power/full-buffer stops, placement/upgrade/salvage, physical drone cargo delivery, vehicle ownership/capacity and v1 migration. All tests are included in npm test.

Earlier Chrome checks of the expansion showed the powered sandbox shipping cargo and increasing credits, build dropdown, actual conveyor placement and inspection. No captured page errors. The following garage/reset check stalled on native confirmation-dialog handling; Computer Use then stopped because it could not determine the current URL confidently. Garage switching, extended campaign balance, physical-phone input, audible sound and endgame remain unverified in a browser. Core vehicle and factory rules passed automated checks. Original native-game parity is not claimed.
