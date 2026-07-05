import type { Food } from "@/types";

type Props = {
  food: Food;
  onAdd: (food: Food) => void;
};

const MACROS = [
  { key: "protein", label: "P", color: "var(--color-protein)" },
  { key: "carbs", label: "C", color: "var(--color-carbs)" },
  { key: "fat", label: "F", color: "var(--color-fat)" },
] as const;

/** A single food in the picker: macros + an Add button. */
export default function FoodCard({ food, onAdd }: Props) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 transition hover:border-line-strong hover:shadow-[0_6px_20px_-12px_rgba(26,42,34,0.25)]">
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold leading-tight text-ink">{food.name}</h3>
          <span className="whitespace-nowrap text-sm font-bold tabular-nums text-ink">
            {food.calories}
            <span className="ml-0.5 text-xs font-medium text-ink-faint">
              kcal
            </span>
          </span>
        </div>
        <p className="mt-0.5 text-xs text-ink-faint">{food.servingSize}</p>
        <div className="mt-2.5 flex gap-3 text-xs font-medium text-ink-soft">
          {MACROS.map((m) => (
            <span key={m.key} className="tabular-nums">
              {m.label}{" "}
              <span style={{ color: m.color }} className="font-semibold">
                {food[m.key]}g
              </span>
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAdd(food)}
        className="mt-3.5 rounded-xl bg-leaf px-3 py-2 text-sm font-semibold text-white transition hover:bg-leaf-dark active:scale-[0.98]"
      >
        Add
      </button>
    </div>
  );
}
