export type AddMode = "quick" | "text" | "photo";

type Props = {
  mode: AddMode;
  onChange: (mode: AddMode) => void;
};

function Icon({ mode }: { mode: AddMode }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4",
  };
  if (mode === "quick")
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
    );
  if (mode === "text")
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 8a2 2 0 0 1 2-2h1l1.2-1.6a1 1 0 0 1 .8-.4h6a1 1 0 0 1 .8.4L18 6h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </svg>
  );
}

const TABS: { id: AddMode; label: string }[] = [
  { id: "quick", label: "Search" },
  { id: "text", label: "Describe" },
  { id: "photo", label: "Photo" },
];

/** Segmented control that switches between the three ways to add food. */
export default function AddFoodTabs({ mode, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="How to add food"
      className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-sunken/70 p-1"
    >
      {TABS.map((tab) => {
        const active = tab.id === mode;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active
                ? "bg-surface text-leaf-dark shadow-[0_1px_3px_rgba(26,42,34,0.12)]"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <Icon mode={tab.id} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
