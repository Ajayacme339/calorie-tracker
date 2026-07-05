import type { NutritionResult } from "@/types";

// Thin client-side wrapper around the two AI nutrition routes. Keeps fetch +
// error-translation logic out of the UI components. Every failure path throws an
// Error whose message is safe to show the user directly.

// Mirrors the image route's guards so we can reject bad files before uploading.
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

/** Turns a fetch Response / thrown error into a friendly, user-facing message. */
async function friendlyError(res: Response): Promise<Error> {
  // The routes return { error: string } on failure; prefer that message.
  let serverMessage = "";
  try {
    const body = (await res.json()) as { error?: unknown };
    if (typeof body.error === "string") serverMessage = body.error;
  } catch {
    // non-JSON body — ignore, fall back below
  }

  // Gemini overloaded / upstream hiccup — the routes surface these as 502/503.
  if (res.status === 502 || res.status === 503) {
    return new Error("The AI is busy right now. Please try again in a moment.");
  }
  if (res.status === 500) {
    return new Error(
      serverMessage || "Something went wrong on the server. Please try again.",
    );
  }
  return new Error(serverMessage || "Couldn't look up nutrition. Please try again.");
}

/** Estimate nutrition from a free-text meal description. */
export async function lookupText(description: string): Promise<NutritionResult> {
  let res: Response;
  try {
    res = await fetch("/api/nutrition/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
  } catch {
    throw new Error(
      "Couldn't reach the AI service — check your connection and try again.",
    );
  }
  if (!res.ok) throw await friendlyError(res);
  return (await res.json()) as NutritionResult;
}

/** Estimate nutrition from a meal photo (uploaded as multipart/form-data). */
export async function lookupImage(file: File): Promise<NutritionResult> {
  const form = new FormData();
  form.append("image", file);

  let res: Response;
  try {
    res = await fetch("/api/nutrition/image", { method: "POST", body: form });
  } catch {
    throw new Error(
      "Couldn't reach the AI service — check your connection and try again.",
    );
  }
  if (!res.ok) throw await friendlyError(res);
  return (await res.json()) as NutritionResult;
}
