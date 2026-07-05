type Props = {
  label: string;
  value: number; // grams consumed
  target: number; // gram target
  colorVar: string; // CSS var name, e.g. "--color-protein"
};

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** One macro nutrient shown as a labelled progress bar toward its gram target. */
export default function MacroBar({ label, value, target, colorVar }: Props) {
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const color = `var(${colorVar})`;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="tabular-nums text-ink-soft">
          <span className="font-semibold text-ink">{round(value)}</span>
          <span className="text-ink-faint"> / {target}g</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sunken">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct * 100}%`,
            backgroundColor: color,
            transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
}
