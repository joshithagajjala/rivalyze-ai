import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + delay }}
      className="group p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 hover:bg-card transition-all duration-300"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-inter font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}