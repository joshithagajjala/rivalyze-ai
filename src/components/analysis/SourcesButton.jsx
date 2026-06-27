import { useState } from "react";
import { ExternalLink, BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SourcesButton({ sources = [] }) {
  const [open, setOpen] = useState(false);
  if (!sources || sources.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg border border-border/50 bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
      >
        <BookOpen className="w-3 h-3" />
        {sources.length} source{sources.length !== 1 ? "s" : ""}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-8 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sources</span>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
                  >
                    <ExternalLink className="w-3 h-3 text-primary mt-0.5 shrink-0 group-hover:text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{src.title || src.url}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{src.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}