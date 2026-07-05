import type { LogEntry } from "@/types";
import type { MealGroup } from "@/hooks/useFoodLog";
import { mealLabel } from "@/lib/meals";
import { MealIcon } from "./icons";

type Props = {
  mealGroups: MealGroup[];
  onRemove: (entryId: string) => void;
  onClear: () => void;
};

function EntryRow({
  entry,
  onRemove,
}: {
  entry: LogEntry;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition hover:border-line-strong">
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{entry.name}</p>
        <p className="mt-0.5 truncate text-xs text-ink-faint">
          {entry.servingSize} · P {entry.protein}g · C {entry.carbs}g · F{" "}
          {entry.fat}g
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap text-sm font-bold tabular-nums text-ink">
          {Math.round(entry.calories)}
          <span className="ml-0.5 text-xs font-medium text-ink-faint">kcal</span>
        </span>
        <button
          type="button"
          onClick={() => onRemove(entry.entryId)}
          aria-label={`Remove ${entry.name}`}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition hover:bg-sunken hover:text-over"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </li>
  );
}

/** Today's log, grouped into meal sections with per-meal calorie subtotals. */
export default function DailyLog({ mealGroups, onRemove, onClear }: Props) {
  const hasEntries = mealGroups.length > 0;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-ink">Today&apos;s meals</h2>
        {hasEntries && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-ink-faint transition hover:text-over"
          >
            Clear day
          </button>
        )}
      </div>

      {!hasEntries ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface/60 px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-soft text-leaf">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <p className="font-semibold text-ink">No meals logged yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">
            Add your first food above — search the list, describe a meal, or snap
            a photo.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {mealGroups.map((group) => (
            <div key={group.meal} className="animate-rise">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-leaf-soft text-leaf">
                    <MealIcon meal={group.meal} className="h-4 w-4" />
                  </span>
                  <h3 className="font-bold text-ink">{mealLabel(group.meal)}</h3>
                  <span className="rounded-full bg-sunken px-2 py-0.5 text-xs font-semibold text-ink-soft">
                    {group.entries.length}
                  </span>
                </div>
                <span className="text-sm font-bold tabular-nums text-ink-soft">
                  {Math.round(group.totals.calories)}
                  <span className="ml-0.5 text-xs font-medium text-ink-faint">
                    kcal
                  </span>
                </span>
              </div>
              <ul className="space-y-2">
                {group.entries.map((e) => (
                  <EntryRow key={e.entryId} entry={e} onRemove={onRemove} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
