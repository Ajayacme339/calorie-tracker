# Decision Log — Initial Build (2026-07-04)

## Summary

Built the first working version of the Calorie Tracker: a single-page Next.js app
that lets you search 20+ common foods, add them to a daily log, and see running
calorie/macro totals that persist across page refreshes. This is "Phase 1 — Build
a Basic App." No login, no accounts, no backend.

## What was built

- Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4 scaffold,
  created manually (not via `create-next-app`, which refuses a non-empty folder — the
  directory already held `.env` and `.gitignore`).
- Static food database of 24 common foods with calories, protein, carbs, fat, and
  serving size (`lib/foods.ts`).
- `localStorage`-backed persistence layer keyed by date (`lib/storage.ts`).
- `useFoodLog` hook managing log state, persistence, and derived totals.
- UI: sticky calorie/macro summary bar, search bar, responsive food grid with Add
  buttons, and a removable daily log with a clear-day action.
- Docs: this decision log + a `CLAUDE.md` project overview.

## Technical choices & rationale

### Persistence: `localStorage` (not SQLite / IndexedDB)
The requirement was a "local database" that survives refreshes. Options considered:

- **`localStorage`** ✅ chosen — persists across refreshes, zero setup, no native
  modules, trivially enough for a daily food log's data volume.
- **SQLite (`better-sqlite3`)** — rejected: needs native compilation, which is
  error-prone on Windows, and requires a server layer. Overkill for a client-only,
  single-user app.
- **IndexedDB** — a genuine client-side database, but heavier API for what is a small
  flat list. Noted as the natural upgrade path if data grows or structured queries
  are needed.

Persistence is isolated behind `lib/storage.ts`, so switching to IndexedDB or a real
DB later touches only that one module.

### Client-only architecture
No API routes or server actions. The app is a client component tree; the data lives in
the browser. This keeps the app simple and deployable as a static-ish Next.js app.
`lib/storage.ts` guards every call with `typeof window` checks so server rendering
doesn't touch `localStorage`.

### Log entries snapshot food data
`LogEntry = Food & { entryId, loggedAt }`. When a food is logged, its macros are copied
into the entry rather than referenced by id. This means correcting a value in the static
food database later won't silently rewrite previously logged days.

### Date-keyed storage
Entries are stored under `calorie-tracker:<YYYY-MM-DD>`. This makes the log genuinely
"daily" and leaves room for a future history/browse-past-days feature without a data
migration.

### Static food list vs. Gemini API
The `.env` already has a `GEMINI_API_KEY` placeholder, but Phase 1 deliberately uses a
hard-coded food list — it's deterministic, offline, instant, and free. AI-based food
lookup via Gemini is deferred to a later phase.

## Hydration note
The `useFoodLog` hook loads persisted entries in an effect (client-only) and sets a
`hydrated` flag before it begins writing back to storage. This prevents the initial
empty React state from overwriting saved data on first render, and avoids a
server/client hydration mismatch.

## Security note
During `npm install`, `next@15.1.6` was flagged for CVE-2025-66478 (critical). Upgraded
to `next@^15.5.20`, which clears the critical advisory (2 moderate advisories remain in
the tree).

## Verification performed
- `npx tsc --noEmit` — passes, no type errors.
- `npm run dev` — compiles cleanly, "Ready" with no errors, `/` compiled (560 modules).
- `GET http://localhost:3000/` returns HTTP 200 with the food list, search bar, and
  summary bar server-rendered in the HTML.

## Next steps
See "What's coming next" in `CLAUDE.md` — Gemini-powered food lookup, quantity
multipliers, daily goals, history view, export/import.
