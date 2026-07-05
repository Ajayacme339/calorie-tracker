import type { MealCategory } from "@/types";
import { MEALS } from "@/lib/meals";
import { MealIcon } from "./icons";

type Props = {
  value: MealCategory;
  onChange: (meal: MealCategory) => void;
};

/** Chooses which meal newly added food is logged under. */
export default function MealSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        Add to
      </p>
      <div
        role="radiogroup"
        aria-label="Meal"
        className="grid grid-cols-4 gap-1.5"
      >
        {MEALS.map((m) => {
          const active = m.id === value;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(m.id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-sm font-semibold transition ${
                active
                  ? "border-leaf bg-leaf-soft text-leaf-dark"
                  : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink"
              }`}
            >
              <span className="h-4 w-4">
                <MealIcon meal={m.id} className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
