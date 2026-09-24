# The screenshots

All ten are here and already in the deck. They were captured from the real app running at
`localhost:8766`, driven over the Chrome DevTools Protocol at a 412×915 phone viewport
(2× pixel ratio), except `admin-orders.png` which is the office screen at 1040×820.

| File | Screen |
|---|---|
| `cover.png` | The order screen, mid-order |
| `roles.png` | The five role cards |
| `order-form.png` | Product grid with quantities typed in |
| `cart.png` | The basket, with the `‹ 1 ›` copy row |
| `summary.png` | Order summary and **Send order to office** |
| `stores.png` | The Stores tab, with one shop overdue |
| `map.png` | The map, six pinned shops over Bacolod |
| `profile.png` | My profile — the day, the month, the target |
| `settings.png` | Settings, **Your data** open |
| `admin-orders.png` | Admin → Orders, on a desktop |

## What is in them

**No real customer, shop, person or total appears in any of these.**

The account used to take them is an office account, so the agent screens legitimately hold
no shops of their own — the real ones belong to other agents' books and never render there.
Rather than photograph empty states, the browser was handed six invented shops and five
invented orders at render time:

- Every save path (`localSave`, `saveStores`, `markDirty`, `syncNow`, …) was stubbed out
  **before** anything was faked, so not one invented row could reach localStorage or the
  office, and the page was reloaded afterwards.
- The distributor is not named: the wordmark and the mark are replaced with a neutral one.
- Phone numbers and the account email are masked in the DOM before the shutter.

The scripts that did it are in the session scratchpad, not in this repo: `shot.py` (the
CDP client), `demo.js` (the invented shops), `anon.js` (the masking), `run_shots2.py`
(the walk).

## Re-taking one

Serve the app, open it in a Chrome started with `--remote-debugging-port=9223`, sign in,
then run the walk again. Replace a file here, run `python build.py`, and the deck picks it
up — each slot swaps itself in when the file exists, so `index.html` never needs editing.

## Shape

- Phone shots: 824×1830 (412×915 at 2×). The frame in the deck uses that exact ratio, so
  nothing is cropped.
- `admin-orders.png`: 2080×1640, capped to 50 % of the slide height when displayed.
- PNG throughout, dark theme throughout.
