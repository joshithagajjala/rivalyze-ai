import { motion } from "framer-motion";
import { Search, BarChart3, Brain, CheckCircle2 } from "lucide-react";

const STEPS = [
  { key: "discovering", icon: Search, label: "Discovering Competitors", desc: "Scanning the market landscape" },
  { key: "analyzing", icon: BarChart3, label: "Deep Analysis", desc: "Extracting features, pricing & positioning" },
  { key: "synthesizing", icon: Brain, label: "Synthesizing Intel", desc: "Building comparative models" },
  { key: "complete", icon: CheckCircle2, label: "Complete", desc: "Report ready" },
];

const STATUS_ORDER = ["discovering", "analyzing", "synthesizing", "complete"];

export default function LoadingAnalysis({ report }) {
  const currentIdx = STATUS_ORDER.indexOf(report.status);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Animated orb */}
        <div className="relative mx-auto w-32 h-32 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-primary/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-accent/20"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          >
            <div className="w-6 h-6 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
          </motion.div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isActive = step.key === report.status;
            const isDone = currentIdx > i;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isActive
                    ? "border-primary/30 bg-primary/5"
                    : isDone
                    ? "border-border/30 bg-card/50"
                    : "border-border/20 bg-transparent opacity-40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : isDone
                      ? "bg-chart-3/15 text-chart-3"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${isActive ? "text-foreground" : isDone ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{isActive ? report.progress_message : step.desc}</p>
                </div>
                {isActive && (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}