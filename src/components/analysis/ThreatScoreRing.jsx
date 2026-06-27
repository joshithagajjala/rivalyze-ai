import { motion } from "framer-motion";

export default function ThreatScoreRing({ score = 0, rank }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? "hsl(0 72% 55%)"
      : score >= 40
      ? "hsl(35 95% 55%)"
      : "hsl(150 80% 45%)";

  return (
    <div className="relative flex flex-col items-center shrink-0">
      <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="hsl(220 16% 12%)"
          strokeWidth="6"
        />
        <motion.circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-inter font-black" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Threat</span>
      </div>
      {rank && (
        <span className="mt-2 text-[10px] font-mono text-muted-foreground">
          Rank #{rank}
        </span>
      )}
    </div>
  );
}