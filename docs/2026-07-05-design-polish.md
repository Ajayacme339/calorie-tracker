# 2026-07-05 — Professional design polish (Ralph loop + frontend-design)

## Goal

Take the working calorie tracker (Gemini text + photo, local database, connected
frontend) and make it look and feel like a real product built by a professional
team — not a tutorial or hackathon demo. Driven by the **Ralph loop** (iterative
self-review) with the **frontend-design skill** as the quality rubric after each
round. Two to three cycles, then a documentation pass.

## What Ralph found (starting state)

The app was well-engineered but visually generic:

- **Templated aesthetic.** Near-black slate background + a single bright emerald
  accent — exactly one of the AI-default looks the frontend-design skill warns
  about. No distinct identity.
- **No hero / thesis.** The sticky totals bar showed a number, but nothing framed
  the day as a *budget* — the most characteristic thing in a tracker's world.
- **Missing product features.** No daily goal, no visual progress toward it, no
  macro visualization, no meal grouping, and no real header/branding.
- **Flat log.** A single undifferentiated list of entries with no structure.
- **Emoji as UI.** Tab hints used emoji (🍽️ ✍️ 📷), which read as hackathon.

## What was improved

**Cycle 1 — identity + core features**

- New brand: **"Plate"**, with a warm "kitchen" palette (paper canvas, white
  surfaces, deep green-charcoal ink, one matcha accent) and three distinct macro
  hues — a deliberate move away from the black+emerald default.
- Typography: **Plus Jakarta Sans** via `next/font`, heavy weights reserved for
  the big budget numbers.
- **Signature element:** a color-coded circular **calorie budget ring** (green →
  amber → red), framing the day as fuel spent down.
- Added **macro progress bars**, an **editable daily goal** with derived macro
  targets, **meal categories** (Breakfast/Lunch/Dinner/Snack) with grouped
  card-style entries and per-meal subtotals, and a **header** with name + date.
- Replaced emoji with a consistent inline line-icon set.

**Cycle 2 — critique-driven polish**

- Added a **status pill** (On track / Almost there / Over budget) so the color
  coding has a text anchor (clarity + accessibility).
- **Flattened the meal log** — removed the card-in-card nesting so the entry
  cards carry the weight; added per-meal count badges.
- Darkened `--color-ink-faint` for better contrast on meta text (WCAG AA).

**Cycle 3 — coverage + final polish**

- Verified the secondary flows in the new palette: goal editor, Describe tab,
  Photo dropzone, AI confirmation list, and the empty/loading/error states.

## How the design skill verified quality

Each cycle was checked on real screenshots (headless Chrome, desktop + mobile,
plus seeded and over-budget data) against the rubric:

- **Hero is a thesis** — the budget ring opens with the most characteristic thing
  in the subject's world. ✓
- **Not a templated default** — palette and type are specific to a food/health
  product, not the black+acid-accent cluster. ✓
- **Clean, consistent, intentional** — shared radius/spacing/border rhythm across
  hero, add-food, and log cards. ✓
- **Intuitive first use** — header, clear "Add food" with meal target, empty state
  that invites action. ✓
- **Responsive** — measured `scrollWidth === innerWidth` (no horizontal overflow);
  layout collapses cleanly to a single column. ✓
- **Details that matter** — loading spinners, empty state, friendly error messages,
  hover/active micro-interactions, visible keyboard focus, reduced-motion respected. ✓
- **State coverage** — verified green (on track) and red (over budget) ring/pill.

### Screenshot-tooling note

Chrome on this machine clamps headless `innerWidth` to ~482px, so sub-482 "mobile"
PNGs get clipped at the image boundary — an artifact, not a layout bug. Confirmed
via an in-page width probe that the layout itself has zero overflow.

## Verification

- `npx tsc --noEmit` — clean.
- `npm run build` — succeeds (static route, ~111 kB First Load JS), including the
  self-hosted `next/font` fetch.
- All temporary demo-seed / query-param scaffolding used for screenshots removed.

## Result

A cohesive, professional-feeling product: distinct identity, a budget-ring hero,
macro visuals, meal-grouped card entries, an editable goal with color-coded status,
and polished empty/loading/error states — responsive on desktop and mobile.
