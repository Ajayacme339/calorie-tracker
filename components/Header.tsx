import { LeafMark } from "./icons";

type Props = {
  /** Today's date as a YYYY-MM-DD string; formatted for display here. */
  dateKey: string;
};

function formatToday(dateKey: string): string {
  // Parse as local date (dateKey is already local from storage.todayKey).
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Slim sticky app header: brand mark + name on the left, today's date right. */
export default function Header({ dateKey }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf text-white">
            <LeafMark className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">
            Plate
          </span>
        </div>
        <time className="text-sm font-medium text-ink-soft">
          {formatToday(dateKey)}
        </time>
      </div>
    </header>
  );
}
