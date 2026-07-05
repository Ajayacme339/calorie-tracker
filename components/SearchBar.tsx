type Props = {
  value: string;
  onChange: (value: string) => void;
};

/** Controlled search input that filters the food list. */
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search foods — chicken, rice, banana…"
        className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-10 text-ink placeholder-ink-faint outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf-ring"
        aria-label="Search foods"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint transition hover:bg-sunken hover:text-ink"
          aria-label="Clear search"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}
