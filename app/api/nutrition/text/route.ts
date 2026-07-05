import { NextResponse } from "next/server";
import { estimateFromText, NutritionError } from "@/lib/gemini";

// POST /api/nutrition/text
// Body: { "description": "grilled chicken with rice and salad" }
// Returns: { items: [...], total: {...}, note? }
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const description = (body as { description?: unknown })?.description;
  if (typeof description !== "string") {
    return NextResponse.json(
      { error: "Field 'description' (string) is required." },
      { status: 400 },
    );
  }

  try {
    const result = await estimateFromText(description);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof NutritionError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
