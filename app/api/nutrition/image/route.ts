import { NextResponse } from "next/server";
import { estimateFromImage, NutritionError } from "@/lib/gemini";

// POST /api/nutrition/image
// Accepts either:
//   - multipart/form-data with an "image" file field, OR
//   - JSON: { "imageBase64": "...", "mimeType": "image/jpeg" }
// Returns: { items: [...], total: {...}, note? }

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  let base64: string;
  let mimeType: string;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("image");
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Form field 'image' (a file) is required." },
          { status: 400 },
        );
      }
      mimeType = file.type || "image/jpeg";
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (bytes.byteLength === 0) {
        return NextResponse.json({ error: "Uploaded image is empty." }, { status: 400 });
      }
      if (bytes.byteLength > MAX_BYTES) {
        return NextResponse.json(
          { error: "Image is too large (max 8 MB)." },
          { status: 413 },
        );
      }
      base64 = Buffer.from(bytes).toString("base64");
    } else {
      const body = (await request.json()) as {
        imageBase64?: unknown;
        mimeType?: unknown;
      };
      if (typeof body.imageBase64 !== "string" || !body.imageBase64) {
        return NextResponse.json(
          { error: "Field 'imageBase64' (string) is required." },
          { status: 400 },
        );
      }
      // Strip a data-URL prefix if the caller included one.
      base64 = body.imageBase64.replace(/^data:[^;]+;base64,/, "");
      mimeType = typeof body.mimeType === "string" ? body.mimeType : "image/jpeg";
    }
  } catch {
    return NextResponse.json(
      { error: "Could not read the request body." },
      { status: 400 },
    );
  }

  if (!ALLOWED.includes(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type '${mimeType}'. Use JPEG, PNG, or WebP.` },
      { status: 415 },
    );
  }

  try {
    const result = await estimateFromImage(base64, mimeType);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof NutritionError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
