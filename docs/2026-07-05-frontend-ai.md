# Decision Log — Wiring AI Nutrition into the Frontend (2026-07-05)

## Summary

Connected the two existing Gemini routes (`/api/nutrition/text`,
`/api/nutrition/image`) to the UI so the app now offers **three ways to add food**:
quick-add from the static list (unchanged), a free-text "Describe" tab, and a
"Photo" tab. AI results are shown for confirmation before anything is logged, and
everything committed persists through the existing `localStorage` layer. Loading
spinners and friendly error messages throughout.

## What was added / changed

- **`components/AddFoodTabs.tsx`** — segmented control (Quick add · Describe · Photo).
- **`components/TextLookup.tsx`** — textarea → `/api/nutrition/text`.
- **`components/PhotoLookup.tsx`** — file picker + image preview → `/api/nutrition/image`.
- **`components/NutritionResults.tsx`** — shared confirm list (checkbox per item,
  live selected-total, model note) used by both AI tabs.
- **`components/Spinner.tsx`** — reusable loading spinner.
- **`lib/nutritionClient.ts`** — client fetch wrapper (`lookupText`, `lookupImage`)
  that maps HTTP/network failures to friendly messages.
- **`types.ts`** — `NutritionItem`/`NutritionResult` moved here as the shared shape.
- **`lib/gemini.ts`** — now imports those types from `@/types` (was declaring them).
- **`hooks/useFoodLog.ts`** — added `addFoods` (bulk commit) + `makeEntryId` helper.
- **`app/page.tsx`** — tab state + renders the active panel.

## Technical choices & rationale

### Tabbed panel instead of stacking three add UIs
Quick-add is already a large search + grid. Rather than pile a textarea and an
upload box on top, a 3-tab segmented control keeps one add-method visible at a time
and makes the "three ways" explicit. Tab state lives in `app/page.tsx` so the log
and summary stay shared.

### Confirm step for AI results — even for text
The prompt requires a confirm step for photos (multiple items). We use the **same**
`NutritionResults` component for text too. Reasons: AI estimates are approximate and
sometimes split a meal into surprising items, so letting the user uncheck items
before logging is safer and keeps one consistent flow. All items start checked, so
the happy path is still one click ("Add N to log").

### `NutritionItem` → `Food` bridge at commit time
Routes return `NutritionItem` (no `id`). The log stores `Food`-shaped entries, so we
assign `id: crypto.randomUUID()` only when the user commits. This reuses the existing
snapshot behavior in the hook — AI foods then behave identically to static ones in
`DailyLog` and the totals, with no special-casing downstream.

### Bulk `addFoods` rather than looping `addFood`
Committing a multi-item AI result calls `addFoods` once, producing a single state
update (and a single `localStorage` write) instead of N. `makeEntryId` was factored
out so both `addFood` and `addFoods` share the id logic.

### Shared types in `types.ts`
`NutritionItem`/`NutritionResult` were duplicated conceptually between the server and
what the client needed. Moving them to `types.ts` and importing them into
`lib/gemini.ts` gives one source of truth. The client imports the **types only**, so
the server-only `@google/genai` code never enters the browser bundle.

### Client-side image pre-validation mirrors the route
`PhotoLookup` rejects non-image types and files over 8 MB **before** uploading,
matching the route's guards (`ALLOWED_IMAGE_TYPES`, `MAX_IMAGE_BYTES` are exported
from `lib/nutritionClient.ts` and reused). Faster feedback, no wasted request. The
server still validates — the client check is a convenience, not the trust boundary.

### Image preview with object URLs
The picked file is shown via `URL.createObjectURL`, revoked on change/unmount to
avoid leaks. Uses a plain `<img>` (not `next/image`) because the source is a
transient blob URL, not an optimizable asset.

### Friendly error mapping
`lib/nutritionClient.ts` translates failures into user-facing text: network errors →
"check your connection"; Gemini 502/503 (documented as transient in the API decision
log) → "The AI is busy right now, please try again"; otherwise the route's `{ error }`
message with a safe fallback. Components just render whatever message they catch.

## Verification performed

- `npx tsc --noEmit` — passes, no type errors.
- Manual: quick-add still logs + persists; Describe returns items → confirm → log
  updates and survives refresh; Photo shows preview → analyze → multi-item confirm →
  selected items logged; oversized/non-image files rejected client-side with a
  friendly message and no request; induced failures show the error and leave the app
  usable.

## Notes / follow-ups

- No per-item quantity multiplier yet — an AI item is logged at the serving the model
  assumed. Custom servings are the next planned feature.
- HEIC/HEIF are allowed by type but may not render a browser preview on all
  platforms; the analyze call still works.
