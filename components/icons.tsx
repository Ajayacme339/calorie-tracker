import type { MealCategory } from "@/types";

type IconProps = { className?: string };

/* A small, consistent line-icon set (1.75 stroke, rounded) so the UI reads as a
   real product rather than a wall of emoji. */

const base = "h-full w-full";

export function LeafMark({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M4 20C4 12 9 5 20 4c1 11-4 16-12 16-2 0-4-1-4-1Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M4 20C4 12 9 5 20 4c1 11-4 16-12 16-2 0-4-1-4-1Zm0 0C4 14 8 10 14 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? base} aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function Bowl({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? base} aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M12 3c-2 1.5-2 3.5 0 5M8.5 5c-1.2 1-1.2 2.4 0 3.4" />
    </svg>
  );
}

function Moon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? base} aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function Apple({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? base} aria-hidden fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8c-1.5-1.5-4.5-1.7-6 .5-1.7 2.5-.5 7 2 9.5 1.2 1.2 2.5.8 4-.3 1.5 1.1 2.8 1.5 4 .3 2.5-2.5 3.7-7 2-9.5-1.5-2.2-4.5-2-6-.5Z" />
      <path d="M12 8c0-2 1-3.5 3-4" />
    </svg>
  );
}

const MEAL_ICONS: Record<MealCategory, (p: IconProps) => React.ReactElement> = {
  breakfast: Sun,
  lunch: Bowl,
  dinner: Moon,
  snack: Apple,
};

export function MealIcon({
  meal,
  className,
}: {
  meal: MealCategory;
  className?: string;
}) {
  const Cmp = MEAL_ICONS[meal];
  return <Cmp className={className} />;
}
