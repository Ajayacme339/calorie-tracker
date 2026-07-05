"use client";

import { useMemo, useState } from "react";
import type { Food, NutritionResult, Totals } from "@/types";

type Props = {
  result: NutritionResult;
  onCommit: (foods: Food[]) => void;
  onDismiss: () => void;
};

/** Assigns a stable id so an AI item can be logged as a Food. */
function toFood(item: NutritionResult["items"][number]): Food {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ai-${Date.now()}-${Math.random()}`;
  return { id, ...item };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Shows the AI-estimated items with per-item checkboxes so the user can confirm
 * exactly what goes into the log. Used by both the text and photo lookups.
 */
export default function NutritionResults({
  result,
  onCommit,
  onDismiss,
}: Props) {
  const { items, note } = result;

  // All items start selected; the user can uncheck any they don't want.
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => true),
  );

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const selectedCount = checked.filter(Boolean).length;

  // Totals for just the selected items, recomputed on every toggle.
  const selectedTotal: Totals = useMemo(
    () =>
      items.reduce<Totals>(
        (acc, it, i) =>
          checked[i]
            ? {
                calories: acc.calories + it.calories,
                protein: acc.protein + it.protein,
                carbs: acc.carbs + it.carbs,
                fat: acc.fat + it.fat,
              }
            : acc,
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [items, checked],
  );

  const commit = () => {
    const foods = items.filter((_, i) => checked[i]).map(toFood);
    if (foods.length === 0) return;
    onCommit(foods);
    onDismiss();
  };

  if (items.length === 0) {
    return (
      <div className="animate-rise rounded-2xl border border-line bg-surface p-4 text-sm text-ink-soft">
        <p>No food was recognized. Try describing it differently or use another photo.</p>
        {note && <p className="mt-2 text-xs text-ink-faint">{note}</p>}
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 text-xs font-semibold text-ink-faint transition hover:text-ink"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="animate-rise rounded-2xl border border-line bg-surface p-4 shadow-[0_8px_24px_-16px_rgba(26,42,34,0.25)]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">
          Found {items.length} {items.length === 1 ? "item" : "items"}
        </h3>
        <span className="text-xs font-medium text-ink-faint">Pick what to log</span>
      </div>

      <ul className="divide-y divide-line">
        {items.map((it, i) => (
          <li key={i} className="py-2.5">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="h-4 w-4 shrink-0 accent-leaf"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink">{it.name}</span>
                <span className="block text-xs text-ink-faint">
                  {it.servingSize} · P {it.protein}g · C {it.carbs}g · F {it.fat}g
                </span>
              </span>
              <span className="whitespace-nowrap text-sm font-bold tabular-nums text-ink">
                {it.calories}
                <span className="ml-0.5 text-xs font-medium text-ink-faint">kcal</span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      {note && (
        <p className="mt-3 rounded-xl bg-sunken/70 px-3 py-2 text-xs text-ink-soft">
          <span className="font-semibold text-ink">Note: </span>
          {note}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-soft">
          Selected:{" "}
          <span className="font-bold tabular-nums text-ink">
            {Math.round(selectedTotal.calories)} kcal
          </span>{" "}
          · P {round(selectedTotal.protein)}g · C {round(selectedTotal.carbs)}g · F{" "}
          {round(selectedTotal.fat)}g
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs font-semibold text-ink-faint transition hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={commit}
            disabled={selectedCount === 0}
            className="rounded-xl bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            Add {selectedCount} to log
          </button>
        </div>
      </div>
    </div>
  );
}
