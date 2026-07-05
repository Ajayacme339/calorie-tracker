type Props = {
  consumed: number;
  goal: number;
  size?: number;
};

type Status = "good" | "warn" | "over";

function statusFor(pct: number): Status {
  if (pct > 1) return "over";
  if (pct >= 0.85) return "warn";
  return "good";
}

const STATUS_COLOR: Record<Status, string> = {
  good: "#2c6e49",
  warn: "#cf8a1e",
  over: "#c9483a",
};

/**
 * The product's signature: a circular calorie *budget* gauge. The arc fills as
 * the day is logged and shifts green → amber → red as the goal is approached
 * and passed. The center reads what's left (or how far over).
 */
export default function CalorieRing({ consumed, goal, size = 176 }: Props) {
  const pct = goal > 0 ? consumed / goal : 0;
  const status = statusFor(pct);
  const color = STATUS_COLOR[status];

  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.min(pct, 1);
  const offset = c * (1 - filled);

  const remaining = Math.round(goal - consumed);
  const over = remaining < 0;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(consumed)} of ${goal} calories logged, ${
        over ? `${Math.abs(remaining)} over budget` : `${remaining} remaining`
      }`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-sunken)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.3s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-extrabold tabular-nums leading-none"
          style={{ color }}
        >
          {Math.abs(remaining)}
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {over ? "over budget" : "kcal left"}
        </span>
      </div>
    </div>
  );
}
