# Plate — Daily Calorie & Macro Tracker

A polished, single-page calorie and macro tracker. Log food three ways — search a
built-in list, describe a meal in plain English, or snap a photo — and watch a
color-coded **calorie budget** and your macro totals update in real time. No login,
no accounts; your day is saved locally in the browser and survives refreshes.

## What it does

- **Header** with the app name and today's date, always visible.
- **Daily budget hero** — a color-coded calorie ring (green → amber → red as you
  approach and pass your goal), a status pill (On track / Almost there / Over
  budget), and macro progress bars for protein, carbs, and fat.
- **Editable daily goal** — set a calorie target (with quick presets); macro gram
  targets are derived from it automatically.
- **Three ways to add food:**
  - **Search** — filter a built-in database of 20+ common foods.
  - **Describe** — type what you ate; Gemini estimates calories and macros.
  - **Photo** — upload/take a meal photo; Gemini identifies every food in it.
- AI results (describe/photo) are shown for **confirmation** first — pick which
  items to log; the photo tab also previews the image.
- **Meal categories** — every entry is filed under Breakfast, Lunch, Dinner, or
  Snack (defaulting to the current time of day), and the log is grouped into
  meal sections with per-meal calorie subtotals and card-style entries.
- The daily log persists across refreshes (browser `localStorage`, keyed by date).

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** with a custom design-token theme (`@theme` in `globals.css`)
- **Plus Jakarta Sans** via `next/font` (self-hosted at build time)
- Persistence: browser **`localStorage`** (no backend, no database server)
- AI nutrition lookup: **Gemini API** (`gemini-2.5-flash-lite`) via server routes

## Design system

- **Palette:** warm paper canvas (`#f5f4ee`), white surfaces, deep green-charcoal
  ink, one confident matcha accent (`#2c6e49`), three distinct macro hues
  (protein blue, carbs amber, fat rose), and a green/amber/red status scale.
- **Type:** a single humanist-geometric family; heavy weights are reserved for the
  big budget numbers so the type scale itself carries the personality.
- **Signature:** the circular calorie **budget** gauge — the app's hero, framing
  the day as fuel you spend down rather than a number you count up.
- Tokens live in `app/globals.css`; every color/spacing decision derives from them.

## How to run

```bash
npm install      # first time only
npm run dev      # start the dev server
```

Then open **http://localhost:3000**.

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npx tsc --noEmit # type-check
```

> Requires Node.js 18+ (developed on Node 24). A valid `GEMINI_API_KEY` in `.env`
> is required for the Describe and Photo tabs.

## Folder structure

```
CALORIE_TRACKER/
├── app/
│   ├── api/nutrition/
│   │   ├── text/route.ts   # POST — nutrition from a text description
│   │   └── image/route.ts  # POST — nutrition from a meal photo
│   ├── globals.css         # Tailwind import + design tokens + base theme
│   ├── layout.tsx          # root layout, font, metadata
│   └── page.tsx            # main page — wires the hook to the UI
├── components/
│   ├── Header.tsx           # sticky app header (name + date)
│   ├── DailySummary.tsx     # hero: budget ring + macros + goal editor
│   ├── CalorieRing.tsx      # color-coded SVG budget gauge
│   ├── MacroBar.tsx         # one macro progress bar
│   ├── MealSelector.tsx     # choose which meal an add goes to
│   ├── AddFoodTabs.tsx      # search / describe / photo switcher
│   ├── SearchBar.tsx        # controlled search input (quick add)
│   ├── FoodList.tsx         # responsive grid of foods
│   ├── FoodCard.tsx         # one food + Add button
│   ├── TextLookup.tsx       # describe-a-meal → AI estimate
│   ├── PhotoLookup.tsx      # photo upload + preview → AI estimate
│   ├── NutritionResults.tsx # confirm AI items before logging
│   ├── DailyLog.tsx         # meal-grouped log with subtotals
│   ├── Spinner.tsx          # loading spinner
│   └── icons.tsx            # inline line-icon set (meals, brand mark)
├── hooks/
│   └── useFoodLog.ts        # log state, goal, persistence, totals, meal groups
├── lib/
│   ├── foods.ts             # static 20+ food database
│   ├── meals.ts             # meal categories + time-of-day default
│   ├── goal.ts              # goal defaults + macro-target derivation
│   ├── storage.ts           # localStorage read/write layer (log + goal)
│   ├── nutritionClient.ts   # client fetch wrapper for the AI routes
│   └── gemini.ts            # server-only Gemini client + estimation
├── types.ts                 # Food, LogEntry, Totals, Goal, MealCategory, Nutrition*
├── docs/                    # decision logs
├── PLAN.md                  # what we built / improved / roadmap
├── .env                     # GEMINI_API_KEY (real key; gitignored)
└── CLAUDE.md
```

## AI nutrition API

Two server-side routes estimate nutrition via the **Gemini API**
(`gemini-2.5-flash-lite`). Both return the same JSON shape and are wired into the
UI — the Describe and Photo tabs call them through `lib/nutritionClient.ts`, then
the returned items are confirmed and logged.

**`POST /api/nutrition/text`** — `{ "description": "grilled chicken with rice" }`

**`POST /api/nutrition/image`** — either `multipart/form-data` with an `image`
file field, or JSON `{ "imageBase64": "...", "mimeType": "image/jpeg" }`.

Both respond with:

```jsonc
{
  "items": [
    { "name": "white rice", "calories": 205, "protein": 4,
      "carbs": 45, "fat": 0, "servingSize": "1 cup, cooked" }
  ],
  "total": { "calories": 505, "protein": 51, "carbs": 53, "fat": 9 },
  "note": "optional assumptions/caveats from the model"
}
```

Quick test:

```bash
curl -X POST http://localhost:3000/api/nutrition/text \
  -H "Content-Type: application/json" \
  -d '{"description":"two eggs and a banana"}'
```

## Architecture notes

- **Client UI, server-side AI.** The page is a client component tree;
  `lib/storage.ts` guards every access with a `typeof window` check. Gemini calls
  run in **server-side route handlers** so the API key never reaches the browser.
  `lib/gemini.ts` is server-only; the client talks to it via `nutritionClient.ts`.
- **AI items are confirmed, not auto-logged.** Both AI tabs render the estimate in
  `NutritionResults` with per-item checkboxes; the user commits the selected items
  in one batch via `useFoodLog.addFoods(foods, meal)`.
- **Goal-derived targets.** `lib/goal.ts` turns one calorie number into protein/
  carbs/fat gram targets (30/40/30 split); the hero recomputes status from totals.
- **Meal grouping is derived, not stored twice.** Each `LogEntry` carries a `meal`;
  the hook groups entries into ordered, non-empty meal sections with subtotals.
- **Data layer is swappable.** All persistence goes through `lib/storage.ts` — the
  log (per day) and the goal. Moving to IndexedDB or a database changes only it.
- **Log entries are snapshots.** Macros are copied into the entry at log time, so
  editing the food database later never rewrites past history.
- **Daily keying.** Entries are stored under `calorie-tracker:<YYYY-MM-DD>`; the
  goal under `calorie-tracker:goal`. The UI currently shows today.

## Next steps

- **Deploy to Vercel** — connect the repo, add `GEMINI_API_KEY` as an env var.
- **Food history charts** — trend calories/macros across days (weekly, monthly).
- **User preferences** — custom macro split, units (metric/imperial), theme.
- **Barcode scanning** — look up packaged foods by barcode via the camera.
- Custom serving sizes / quantity multipliers per entry.
- History view to browse and edit previous days; export/import the log.
