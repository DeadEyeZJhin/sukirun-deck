# SukiRun — presentation and live demo

**Live:** [deadeyezjhin.github.io/sukirun-deck](https://deadeyezjhin.github.io/sukirun-deck/) ·
**Demo:** [deadeyezjhin.github.io/sukirun-deck/demo](https://deadeyezjhin.github.io/sukirun-deck/demo/)

A 25-slide portfolio presentation of **SukiRun**, written for the people who run a business,
not for developers: what the app does for them, screen by screen, and how the same approach
fits other kinds of business. Static page — no build step, no framework, no server required.

**Short / Full** (top right, or `?short` / `?full` in the address): Short is the 12 slides to
say out loud in a room; Full adds the eight business scenarios and the rest, for reading.

**The demo** is the real app with every server address removed and an invented company
preloaded — see *The demo* below.

## Contents

| Slide | Covers |
|---|---|
| 01 Cover | One app instead of three spreadsheets and a group chat |
| 02 Before | The order typed three times; the office's spreadsheets |
| 03 After | Each spreadsheet, and the screen that replaced it |
| 04 Login and roles | Accounts, five roles, enforced by the database |
| 05 Products | The catalogue with pictures; change once, hide don't delete |
| 06 Groups | The agent's folders and the office's group management |
| 07 Nothing forgotten | Add product's missing-field check; the Missing something tab |
| 08 Taking an order | Pick, check, send — three phone screens |
| 09 Full status | The four-step bar and the who-and-when timeline |
| 10 Dashboard | Admin → Orders on a PC |
| 11 Daily sales and quota | The agent's month and week; the boss's view of any agent |
| 12 Sync | Phone ⇄ database ⇄ PC, with no signal in the shop |
| 13 Next: receipt to stock | Not built — print a receipt, stock goes down, 0 hides it |
| 14 Any business | The five lists every business keeps |
| 15–22 Scenarios | Distributor · store · food · service · delivery · clinic · construction · rental: the work in five steps, today, what I'd build, what carries over |
| 23 Keep your spreadsheet | The app reads and writes a Google Sheet; one place to type each list; move one list at a time |
| 24 How I work | Measure first; what I chose not to build; the numbers |
| 25 Thank you | Contact |

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

`assets/screens/` holds the 15 used by the deck. Every one shows an **invented** company
(Demo Distribution Co.), invented shops, invented people and invented orders. They were
taken from the real app in a throwaway headless Chrome whose every request to the database
was answered locally, so no demo row could reach the real server. Products are the 76 that
ship inside the public APK. Phone shots are 560 px wide; office shots are 1380 px wide,
and the two `-zoom` files are cropped to the part the slide is about.

## The demo

`demo/index.html` is generated, never edited by hand:

```
python make_demo.py            # reads D:\Order Run\sukirun.built.html
```

It blanks the server address, its key and the update address (with no server the app skips
login, opens all five roles and keeps every save in the browser), renames the company,
drops any product with no picture (the APK's built-in list still carries two the office deleted
on the server; the real app forgets them on sync, the demo never syncs), re-saves the HD product photos at 520 px (only the full-screen view uses them; 7.4 MB page
becomes 5.0), adds `window.__demoRole(role)` so the portfolio's phone can switch role
without reloading, runs `demo-src/seed.js` before the app to load the invented shops and a month of orders
dated relative to today, and adds a strip with **Reset demo**. It refuses to write the file
if the server address survives anywhere in it. Re-run it after each app release.

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
