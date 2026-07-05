"use client";

import { useEffect, useRef, useState } from "react";
import type { Food, NutritionResult } from "@/types";
import {
  lookupImage,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/nutritionClient";
import Spinner from "./Spinner";
import NutritionResults from "./NutritionResults";

type Props = {
  onCommit: (foods: Food[]) => void;
};

type Status = "idle" | "loading" | "error";

/** Upload/take a meal photo → AI identifies foods → confirm into the log. */
export default function PhotoLookup({ onCommit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<NutritionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke the object URL when it changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = () => {
    setFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    // Client-side guards mirror the server route so bad files fail fast.
    if (!ALLOWED_IMAGE_TYPES.includes(picked.type)) {
      setError("That file type isn't supported. Use a JPEG, PNG, or WebP image.");
      setStatus("error");
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setError("That image is too large (max 8 MB). Try a smaller photo.");
      setStatus("error");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
    setResult(null);
    setError("");
    setStatus("idle");
  };

  const analyze = async () => {
    if (!file || status === "loading") return;
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const res = await lookupImage(file);
      setResult(res);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  // After committing to the log, clear everything for the next photo.
  const dismiss = () => reset();

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="hidden"
        aria-label="Choose a meal photo"
      />

      {!previewUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong bg-surface/60 px-4 py-12 text-ink-soft transition hover:border-leaf hover:bg-leaf-soft/40 hover:text-ink"
        >
          <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-soft text-leaf" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8a2 2 0 0 1 2-2h1l1.2-1.6a1 1 0 0 1 .8-.4h6a1 1 0 0 1 .8.4L18 6h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
              <circle cx="12" cy="12.5" r="3.2" />
            </svg>
          </span>
          <span className="text-sm font-semibold">Take or upload a meal photo</span>
          <span className="text-xs text-ink-faint">JPEG, PNG, or WebP · up to 8 MB</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Meal preview"
              className="max-h-72 w-full bg-sunken object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={analyze}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              {status === "loading" && <Spinner size={16} />}
              {status === "loading" ? "Analyzing…" : "Analyze photo"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={status === "loading"}
              className="text-xs font-semibold text-ink-faint transition hover:text-over disabled:opacity-50"
            >
              Remove photo
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="rounded-xl border border-over/25 bg-over/8 px-3.5 py-2.5 text-sm font-medium text-over">
          {error}
        </p>
      )}

      {result && (
        <NutritionResults result={result} onCommit={onCommit} onDismiss={dismiss} />
      )}
    </div>
  );
}
