import { motion } from "framer-motion";

const STAGE_CONFIG = {
  early: { color: "bg-chart-3", label: "Early", order: 0 },
  growing: { color: "bg-primary", label: "Growing", order: 1 },
  peak: { color: "bg-chart-4", label: "Peak", order: 2 },
  decline: { color: "bg-destructive", label: "Declining", order: 3 },
};

export default function TrendChart({ trends }) {
  if (!trends?.length) return <p className="text-sm text-muted-foreground">No trend data available.</p>;

  const maxIntensity = Math.max(...trends.map((t) => t.intensity || 50));

  // Group by stage
  const grouped = {};
  trends.forEach((t) => {
    const stage = t.stage?.toLowerCase() || "growing";
    if (!grouped[stage]) grouped[stage] = [];
    grouped[stage].push(t);
  });

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(STAGE_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${cfg.color}`} />
            <span className="text-xs text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="space-y-2">
        {trends
          .sort((a, b) => (b.intensity || 50) - (a.intensity || 50))
          .map((trend, i) => {
            const stage = trend.stage?.toLowerCase() || "growing";
            const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.growing;
            const width = ((trend.intensity || 50) / maxIntensity) * 100;

            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32 truncate text-right shrink-0">
                  {trend.keyword}
                </span>
                <div className="flex-1 h-6 bg-secondary/50 rounded-md overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={`h-full ${cfg.color} rounded-md opacity-70`}
                  />
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wider shrink-0 w-16 ${
                  stage === "early"
                    ? "text-chart-3"
                    : stage === "growing"
                    ? "text-primary"
                    : stage === "peak"
                    ? "text-chart-4"
                    : "text-destructive"
                }`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}