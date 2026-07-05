"use client";

import { useState } from "react";
import type { Goal, Totals } from "@/types";
import { MIN_CALORIE_GOAL, MAX_CALORIE_GOAL } from "@/lib/goal";
import CalorieRing from "./CalorieRing";
import MacroBar from "./MacroBar";

type Props = {
  totals: Totals;
  goal: Goal;
  itemCount: number;
  onSetGoal: (calories: number) => void;
};

const PRESETS = [1500, 1800, 2000, 2500];

type Status = "good" | "warn" | "over";

const STATUS: Record<Status, { label: string; var: string }> = {
  good: { label: "On track", var: "--color-good" },
  warn: { label: "Almost there", var: "--color-warn" },
  over: { label: "Over budget", var: "--color-over" },
};

function StatusPill({ consumed, goal }: { consumed: number; goal: number }) {
  const pct = goal > 0 ? consumed / goal : 0;
  const status: Status = pct > 1 ? "over" : pct >= 0.85 ? "warn" : "good";
  const { label, var: colorVar } = STATUS[status];
  const color = `var(${colorVar})`;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/** Hero card: the calorie budget ring, macro progress, and an editable goal. */
export default function DailySummary({
  totals,
  goal,
  itemCount,
  onSetGoal,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(goal.calories));

  const consumed = Math.round(totals.calories);

  const open = () => {
    setDraft(String(goal.calories));
    setEditing(true);
  };

  const save = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) onSetGoal(n);
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(26,42,34,0.04),0_8px_24px_-12px_rgba(26,42,34,0.12)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Daily budget
            </p>
            <StatusPill consumed={totals.calories} goal={goal.calories} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            <span className="font-semibold tabular-nums text-ink">{consumed}</span>{" "}
            of{" "}
            <span className="tabular-nums">{goal.calories}</span> kcal ·{" "}
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={open}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-line-strong hover:text-ink"
          >
            Edit goal
          </button>
        )}
      </div>

      {editing && (
        <div className="mb-5 rounded-xl border border-line bg-sunken/60 p-3 animate-rise">
          <label
            htmlFor="goal-input"
            className="block text-xs font-semibold uppercase tracking-wide text-ink-faint"
          >
            Daily calorie goal
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              id="goal-input"
              type="number"
              inputMode="numeric"
              min={MIN_CALORIE_GOAL}
              max={MAX_CALORIE_GOAL}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              className="w-28 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold tabular-nums text-ink outline-none focus:border-leaf"
            />
            <span className="text-sm text-ink-soft">kcal</span>
            <div className="flex gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDraft(String(p))}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition ${
                    draft === String(p)
                      ? "bg-leaf text-white"
                      : "bg-surface text-ink-soft hover:text-ink"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-lg bg-leaf px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-leaf-dark"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <CalorieRing consumed={totals.calories} goal={goal.calories} />
        <div className="w-full flex-1 space-y-4">
          <MacroBar
            label="Protein"
            value={totals.protein}
            target={goal.protein}
            colorVar="--color-protein"
          />
          <MacroBar
            label="Carbs"
            value={totals.carbs}
            target={goal.carbs}
            colorVar="--color-carbs"
          />
          <MacroBar
            label="Fat"
            value={totals.fat}
            target={goal.fat}
            colorVar="--color-fat"
          />
        </div>
      </div>
    </section>
  );
}
