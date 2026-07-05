import { GoogleGenAI, Type } from "@google/genai";
import type { NutritionItem, NutritionResult } from "@/types";

// Shared Gemini client + nutrition-estimation logic used by both the text and
// image API routes. Frontend does not import this — it's server-only.
// NutritionItem/NutritionResult are defined once in `@/types` and shared with
// the client UI (type-only import, erased at build — no server code leaks out).

export const GEMINI_MODEL = "gemini-2.5-flash-lite";

/** Thrown for expected, client-actionable failures (bad input, no key, etc.). */
export class NutritionError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "NutritionError";
    this.status = status;
  }
}

let client: GoogleGenAI | null = null;

/** Lazily builds the Gemini client, failing loudly if the key is missing. */
function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-key-here") {
    throw new NutritionError(
      "GEMINI_API_KEY is not configured on the server.",
      500,
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Response schema forces Gemini to return JSON in exactly the shape we want,
// so no brittle string parsing is needed.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          servingSize: { type: Type.STRING },
        },
        required: ["name", "calories", "protein", "carbs", "fat", "servingSize"],
        propertyOrdering: [
          "name",
          "calories",
          "protein",
          "carbs",
          "fat",
          "servingSize",
        ],
      },
    },
    note: { type: Type.STRING },
  },
  required: ["items"],
};

const SYSTEM_INSTRUCTION = [
  "You are a nutrition estimation assistant.",
  "Identify each distinct food in the input and estimate its nutrition for a",
  "realistic single serving. Return calories (kcal), protein, carbs, and fat in",
  "grams, plus a short human-readable servingSize for each item.",
  "If you must assume portion sizes or cooking methods, put a brief caveat in",
  "'note'. If the input contains no identifiable food, return an empty items array.",
].join(" ");

function round(n: number, dp = 1): number {
  const f = 10 ** dp;
  return Math.round((Number(n) || 0) * f) / f;
}

/**
 * Normalizes the model's raw JSON into a NutritionResult and computes totals
 * ourselves (rather than trusting the model to sum) so the numbers are always
 * internally consistent.
 */
function normalize(raw: unknown): NutritionResult {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(obj.items) ? obj.items : [];

  const items: NutritionItem[] = rawItems.map((it) => {
    const r = (it ?? {}) as Record<string, unknown>;
    return {
      name: String(r.name ?? "Unknown food"),
      calories: round(Number(r.calories), 0),
      protein: round(Number(r.protein)),
      carbs: round(Number(r.carbs)),
      fat: round(Number(r.fat)),
      servingSize: String(r.servingSize ?? "1 serving"),
    };
  });

  const total = items.reduce(
    (acc, it) => ({
      calories: acc.calories + it.calories,
      protein: acc.protein + it.protein,
      carbs: acc.carbs + it.carbs,
      fat: acc.fat + it.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return {
    items,
    total: {
      calories: round(total.calories, 0),
      protein: round(total.protein),
      carbs: round(total.carbs),
      fat: round(total.fat),
    },
    note: typeof obj.note === "string" && obj.note.trim() ? obj.note : undefined,
  };
}

type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

/** Runs a Gemini request with our schema and returns normalized nutrition. */
async function estimate(parts: Part[]): Promise<NutritionResult> {
  const ai = getClient();
  let response;
  try {
    response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new NutritionError(`Gemini request failed: ${message}`, 502);
  }

  const text = response.text;
  if (!text) {
    throw new NutritionError("Gemini returned an empty response.", 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new NutritionError("Gemini returned malformed JSON.", 502);
  }
  return normalize(parsed);
}

/** Estimate nutrition from a free-text meal description. */
export async function estimateFromText(
  description: string,
): Promise<NutritionResult> {
  const trimmed = description.trim();
  if (!trimmed) {
    throw new NutritionError("Please provide a description of what you ate.");
  }
  return estimate([{ text: `I ate: ${trimmed}` }]);
}

/** Estimate nutrition from a base64-encoded meal photo. */
export async function estimateFromImage(
  base64Data: string,
  mimeType: string,
): Promise<NutritionResult> {
  if (!base64Data) {
    throw new NutritionError("No image data was provided.");
  }
  return estimate([
    {
      text: "Identify the foods in this meal photo and estimate their nutrition.",
    },
    { inlineData: { mimeType, data: base64Data } },
  ]);
}
