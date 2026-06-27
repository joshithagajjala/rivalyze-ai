export default function ConfidenceBadge({ value, label = "Confidence" }) {
  if (value == null) return null;
  const pct = Math.round(value * 100);
  const color =
    pct >= 70
      ? "text-chart-3 bg-chart-3/10 border-chart-3/20"
      : pct >= 40
      ? "text-chart-4 bg-chart-4/10 border-chart-4/20"
      : "text-destructive bg-destructive/10 border-destructive/20";

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${color}`}>
      {label}: {pct}%
    </span>
  );
}