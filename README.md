# SukiRun — presentation

A 19-slide portfolio presentation of **SukiRun**, an offline-first order-taking app for field
sales agents. Static page — no build step, no framework, no server required.

Same deck engine as the Network Build presentation: navigation, light/dark theme, speaker
notes, print-to-PDF, deep links and the constellation background. The topology diagrams,
traffic-flow animation and queue simulator are not carried over — this deck shows screenshots.

## Contents

| Slide | Covers |
|---|---|
| 01 Cover | What it is, in one line, with the badges |
| 02 Agenda | The three questions the deck answers |
| 03 The problem | The order typed out three times — notebook, Messenger, warehouse |
| 04 What it is | One HTML file, two runtimes, five roles |
| 05 The one job | The phone handed across the counter, and what that decided |
| 06 Taking an order | Three screenshots, start to finish |
| 07 The paste | The copied text as a designed artefact, and the three decisions in it |
| 08 Offline-first | Queue, storage tiers, what works with no signal |
| 09 Merge | Per-row merge, tombstones, the versioned `REPAIR_ID` repair |
| 10 Roles and access | Row-level security, `security definer` writes, who sees what |
| 11 The catalogue | 200+ products, four selling units, the frozen price |
| 12 Shops and visits | The round, and who has gone quiet |
| 13 Pictures and maps | Both working with no connection |
| 14 The office | The list, undo-is-not-cancel, what-changed |
| 15 Shipping it | One HTML file → signed APK → GitHub Releases |
| 16 What I did not build | The parked features, each with the number that parked it |
| 17 By the numbers | Measured out of the code, not remembered |
| 18 Stack | Front end, back end, build and ship |
| 19 Thank you | Contact, other work |

## Controls

| Key | Action |
|---|---|
| `←` `→` `Space` `PgUp/PgDn` | Navigate slides |
| `Home` / `End` | First / last slide |
| `T` | Toggle light / dark theme (remembered) |
| `N` | Toggle speaker notes |
| `F` | Fullscreen presentation mode |
| `P` | Print — expands every slide into a PDF handout |

Touch: swipe left/right. Mouse: the dot rail on the right jumps to any slide.
Deep links work: `index.html#13` opens slide 13.

## Screenshots

Ten screenshots go in `assets/screens/`. Until they exist, each slot shows a dashed frame
naming the file it wants. `assets/screens/README.md` lists every file, which screen it comes
from, and what to cover up before shooting — most of these screens carry real shop names.

## Files

| | |
|---|---|
| `index.html` | the deck — edit this |
| `deck.css` | styles and theme tokens |
| `deck.js` | navigation, theme, notes, background |
| `assets/` | icons; `assets/screens/` holds the app screenshots |
| `build.py` | bundles everything into the two files below |
| `presentation.html` | **generated** — one self-contained file, opens offline, e-mail it anywhere |
| `artifact.html` | **generated** — body-only fragment for hosting |

## Build

```
python build.py
```

Inlines `deck.css`, `deck.js` and every referenced asset as base64 into
`presentation.html`, and writes the body-only `artifact.html` beside it. Each asset is
embedded exactly once, so an icon used twelve times costs one copy.

Nothing is minified and nothing is fetched at runtime except the Google Fonts stylesheet.

## The app itself

Releases, the APK and the full feature list:
[github.com/DeadEyeZJhin/sukirun-releases](https://github.com/DeadEyeZJhin/sukirun-releases)
