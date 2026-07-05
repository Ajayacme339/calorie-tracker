# Plate — Project Plan

A single-page calorie & macro tracker with AI food logging. This plan captures
what exists today, what the professional-polish pass changed, and where it goes next.

## What We Built

A local-first, no-login daily nutrition tracker:

- **Three ways to log food**
  - *Search* — filter a built-in database of 20+ common foods.
  - *Describe* — plain-English meal → Gemini estimates calories and macros.
  - *Photo* — snap/upload a meal → Gemini identifies every food in it.
- **AI results are confirmed, not auto-logged** — per-item checkboxes let you pick
  exactly what to log; the photo tab previews the image first.
- **Daily calorie budget** — a color-coded ring (green → amber → red) showing what's
  left, with an editable goal and a status pill (On track / Almost there / Over budget).
- **Macro breakdown** — protein / carbs / fat progress bars against goal-derived
  gram targets.
- **Meal categories** — every entry is filed under Breakfast, Lunch, Dinner, or
  Snack; the log is grouped into meal sections with per-meal subtotals and
  card-style entries.
- **Persistence** — the day's log and goal are saved in `localStorage`, keyed by
  date, and survive refreshes. No backend, no accounts.
- **Stack** — Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind v4
  with a custom token theme, Plus Jakarta Sans, and server-side Gemini routes that
  keep the API key off the client.

## What We Improved

The professional-polish pass (Ralph loop + frontend-design skill, 3 cycles):

- **New visual identity** — replaced the generic dark-slate + emerald "default AI"
  look with the **Plate** brand: a warm paper-and-matcha health-app palette, deep
  green-charcoal ink, and three distinct macro hues.
- **A hero with a point of view** — the circular **calorie budget ring** now opens
  the page, framing the day as fuel you spend down rather than a number you count up.
- **Real typography** — Plus Jakarta Sans with heavy weights reserved for the
  budget numbers, so the type scale itself carries personality.
- **New product features** — daily goal + color-coded progress, macro bars, meal
  categories with grouped entries, a status pill, and a proper header (name + date).
- **Structure over lists** — the flat log became meal-grouped cards with subtotals
  and count badges; emoji UI became a consistent inline line-icon set.
- **Polish & accessibility** — consistent radius/spacing rhythm, hover/active
  micro-interactions, visible keyboard focus, reduced-motion support, improved
  contrast, and verified empty / loading / error states.
- **Verified end to end** — clean `tsc` and production build; responsive with zero
  horizontal overflow; green and over-budget states confirmed on screenshots.

## Future Roadmap

**Near term**

- **Deploy to Vercel** — connect the repo and add `GEMINI_API_KEY` as an env var.
- **Custom serving sizes / quantities** — a multiplier per entry (e.g. 1.5×, 2×).
- **Edit & re-file entries** — move an entry between meals; adjust after logging.

**Mid term**

- **Food history charts** — weekly/monthly trends for calories and each macro.
- **History view** — browse and edit previous days; export/import the log as JSON.
- **User preferences** — custom macro split, metric/imperial units, light/dark theme.

**Longer term**

- **Barcode scanning** — look up packaged foods by barcode with the camera.
- **Saved & recent foods** — one-tap re-logging of frequent meals.
- **Accounts & sync** — optional cloud sync behind the swappable storage layer.
