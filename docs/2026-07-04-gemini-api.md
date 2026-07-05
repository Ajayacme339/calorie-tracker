# Decision Log — Gemini Nutrition API (2026-07-04)

## Summary

Added AI-powered nutrition lookup as **backend-only** API routes. The app can now
estimate calories and macros two ways — from a text description of a meal, or from
a photo of it — using the Gemini API (`gemini-2.5-flash-lite`). The frontend was
intentionally **not touched**; wiring the UI to these routes is the next step.

## What was added

- `lib/gemini.ts` — server-only module holding the Gemini client, the structured
  response schema, the estimation prompt, normalization + totals computation, and a
  typed `NutritionError`.
- `app/api/nutrition/text/route.ts` — `POST` with `{ description }`, returns
  structured nutrition JSON.
- `app/api/nutrition/image/route.ts` — `POST` accepting either `multipart/form-data`
  (an `image` file) or JSON (`{ imageBase64, mimeType }`), returns the same shape.
- Dependency: `@google/genai` (v2.10.0), the current unified Google GenAI SDK.
- Updated `CLAUDE.md` (new "AI nutrition API" section, folder tree, architecture notes).

## Technical choices & rationale

### SDK: `@google/genai` (not `@google/generative-ai`)
`@google/genai` is Google's current, actively maintained unified SDK; the older
`@google/generative-ai` package is deprecated. It cleanly supports
`gemini-2.5-flash-lite`, system instructions, structured output, and multimodal
(image) input.

### Model: `gemini-2.5-flash-lite`
Chosen per the requirement. It's the cheapest/fastest 2.5 tier, which suits
high-frequency, low-complexity nutrition estimates. The model id lives in one
constant (`GEMINI_MODEL` in `lib/gemini.ts`) so it's trivial to bump later.

### Structured output via `responseSchema`
Both routes call Gemini with `responseMimeType: "application/json"` and an explicit
`responseSchema`. This forces valid JSON in exactly our shape and removes brittle
"parse the prose" logic. `temperature: 0.2` keeps estimates stable.

### Totals computed server-side, not by the model
The schema asks the model only for per-item macros; the route sums them itself
(`normalize()` in `lib/gemini.ts`). This guarantees `total` always equals the sum of
`items` and never drifts because the model did mental math wrong. Verified live:
250 + 205 + 50 = 505 kcal.

### Shared logic, thin routes
All Gemini interaction lives in `lib/gemini.ts`; the route files only parse/validate
the request and map errors to HTTP status codes. Both text and image paths funnel
through one `estimate(parts)` function, so behavior stays consistent.

### Image route accepts two input formats
`multipart/form-data` is what an HTML file input / `FormData` upload sends naturally,
so the frontend can post a photo directly. A JSON `imageBase64` path is also accepted
for programmatic callers and easy `curl` testing. Guards: 8 MB size cap, allow-list of
image MIME types (JPEG/PNG/WebP/HEIC/HEIF), data-URL prefix stripping.

### Error handling
A typed `NutritionError { message, status }` distinguishes expected, client-actionable
failures (empty input → 400, missing key → 500, upstream Gemini failure → 502) from
unexpected ones (generic 500). The key is validated (and the `your-key-here`
placeholder rejected) before any request is made.

### Security: key stays on the server
Gemini is only ever called from route handlers; `lib/gemini.ts` is never imported by a
client component, so `GEMINI_API_KEY` is not exposed to the browser. The key lives in
`.env`, which is gitignored.

## Verification performed
- `npx tsc --noEmit` — passes, no type errors.
- **Text route** — `POST /api/nutrition/text` with "grilled chicken breast with a cup
  of white rice and a green salad" → HTTP 200, 3 items, correct server-summed totals
  (505 kcal), plus an assumptions note. Transient Gemini 503 (model overloaded) was
  correctly surfaced as HTTP 502 and succeeded on retry.
- **Image route** — validation paths return 400 (missing field) and 415 (unsupported
  type); a live vision call via both the JSON and `multipart/form-data` paths returned
  HTTP 200 with structured JSON (the test pixel correctly reported "no identifiable
  food").

## Notes / follow-ups
- Gemini can return transient `503 UNAVAILABLE` under load; the frontend should retry
  or show a friendly "try again" message when it consumes these routes.
- No rate limiting / auth on the routes yet — fine for local single-user dev, worth
  adding before any public deployment.
- Next step: build the frontend (text input + photo upload) that calls these routes and
  adds the returned items into the existing daily log.
