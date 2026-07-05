# 🍽️ Plate — Daily Calorie & Macro Tracker

A polished, single-page calorie and macro tracker. Log food three ways — **search**
a built-in list, **describe** a meal in plain English, or **snap a photo** — and watch
a color-coded **calorie budget** and your macro totals update in real time. No login,
no accounts; your day is saved locally in the browser and survives refreshes.

<!-- Add a screenshot: drop an image at docs/screenshot.png and uncomment the line below.
![Plate — daily budget ring, macro bars, and meal-grouped log](docs/screenshot.png)
-->

## Features

- **Daily budget hero** — a color-coded calorie ring (green → amber → red as you
  approach and pass your goal), a status pill (On track / Almost there / Over budget),
  and macro progress bars for protein, carbs, and fat.
- **Editable daily goal** — set a calorie target with quick presets; macro gram
  targets are derived automatically (30/40/30 split).
- **Three ways to add food**
  - **Search** — filter a built-in database of 20+ common foods.
  - **Describe** — type what you ate; Gemini estimates calories and macros.
  - **Photo** — upload or take a meal photo; Gemini identifies every food in it.
- **Confirm before logging** — AI results are shown for review with per-item
  checkboxes; the photo tab previews the image first.
- **Meal categories** — every entry is filed under Breakfast, Lunch, Dinner, or Snack
  (defaulting to the current time of day). The log is grouped into meal sections with
  per-meal calorie subtotals and card-style entries.
- **Local-first persistence** — the day's log and goal are saved in `localStorage`,
  keyed by date, and survive refreshes. No backend, no database.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** with a custom design-token theme (`@theme` in `globals.css`)
- **Plus Jakarta Sans** via `next/font` (self-hosted at build time)
- **Gemini API** (`gemini-2.5-flash-lite`) for AI nutrition lookup, via server routes
- Persistence: browser **`localStorage`** (no backend, no accounts)

## Getting started

```bash
npm install      # first time only
npm run dev      # start the dev server
```

Then open **http://localhost:3000**.

The **Describe** and **Photo** tabs need a Gemini API key. Create a `.env` file in the
project root:

```bash
GEMINI_API_KEY=your_key_here
```

> Get a key from [Google AI Studio](https://aistudio.google.com/apikey). Search-based
> logging works without a key. Requires Node.js 18+ (developed on Node 24).

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npx tsc --noEmit # type-check
```

## How it works

- **Client UI, server-side AI.** The page is a client component tree; Gemini calls run
  in server-side route handlers so the API key never reaches the browser.
- **Two API routes** estimate nutrition and return the same JSON shape:
  - `POST /api/nutrition/text` — `{ "description": "grilled chicken with rice" }`
  - `POST /api/nutrition/image` — `multipart/form-data` with an `image` field, or JSON
    `{ "imageBase64": "...", "mimeType": "image/jpeg" }`
- **Log entries are snapshots.** Macros are copied into each entry at log time, so
  editing the food database later never rewrites past history.
- **Swappable data layer.** All persistence goes through `lib/storage.ts` — moving to
  IndexedDB or a database changes only that file.

## Project structure

```
app/            # App Router: layout, page, and the two AI nutrition routes
components/     # UI — Header, DailySummary, CalorieRing, MacroBar, DailyLog, …
hooks/          # useFoodLog — log state, goal, persistence, totals, meal groups
lib/            # foods, meals, goal math, storage, Gemini client
types.ts        # shared types
docs/           # decision logs
```

## Roadmap

- **Deploy to Vercel** — import the repo and add `GEMINI_API_KEY` as an env var.
- Food history charts (weekly/monthly trends), a history view, and export/import.
- User preferences: custom macro split, metric/imperial units, light/dark theme.
- Barcode scanning for packaged foods via the camera.

See [`PLAN.md`](PLAN.md) for the full plan and [`docs/`](docs/) for decision logs.

---

Nutrition values are estimates. Built as part of a 100-day AI build challenge.
