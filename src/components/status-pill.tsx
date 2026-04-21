type StatusPillProps = {
  label: string;
  tone?: "ready" | "pending" | "accent";
};

const toneClasses: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  ready:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  pending:
    "border-amber-600/20 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  accent: "border-accent/20 bg-accent/10 text-accent dark:text-orange-200",
};

export function StatusPill({ label, tone = "accent" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
