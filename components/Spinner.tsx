type Props = {
  /** Diameter in pixels. */
  size?: number;
  className?: string;
};

/** A small, theme-matched loading spinner (emerald on a faint track). */
export default function Spinner({ size = 18, className = "" }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current/25 border-t-current ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
