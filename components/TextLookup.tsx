"use client";

import { useState } from "react";
import type { Food, NutritionResult } from "@/types";
import { lookupText } from "@/lib/nutritionClient";
import Spinner from "./Spinner";
import NutritionResults from "./NutritionResults";

type Props = {
  onCommit: (foods: Food[]) => void;
};

type Status = "idle" | "loading" | "error";

/** Describe-your-meal input → AI nutrition estimate → confirm into the log. */
export default function TextLookup({ onCommit }: Props) {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<NutritionResult | null>(null);

  const canSubmit = description.trim().length > 0 && status !== "loading";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const res = await lookupText(description.trim());
      setResult(res);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const dismiss = () => {
    setResult(null);
    setDescription("");
  };

  return (
    <div className="space-y-3">
      <form onSubmit={submit} className="space-y-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe what you ate — e.g. “grilled chicken with a cup of rice and a side salad”"
          className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-ink placeholder-ink-faint outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf-ring"
          aria-label="Meal description"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
        >
          {status === "loading" && <Spinner size={16} />}
          {status === "loading" ? "Estimating…" : "Estimate nutrition"}
        </button>
      </form>

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
