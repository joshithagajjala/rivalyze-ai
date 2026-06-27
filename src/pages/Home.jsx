import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Zap, Target, TrendingUp, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import HeroBackground from "../components/HeroBackground";
import FeatureCard from "../components/FeatureCard";

const FEATURES = [
  { icon: Search, title: "Competitor Discovery", desc: "AI-powered identification and validation of your real competitors" },
  { icon: Target, title: "Gap Analysis", desc: "Find underserved market opportunities others are missing" },
  { icon: TrendingUp, title: "Trend Detection", desc: "Keyword lifecycle tracking across the competitive landscape" },
  { icon: Shield, title: "Threat Scoring", desc: "Normalized threat assessment across all dimensions" },
  { icon: Zap, title: "Sentiment Mining", desc: "Deep review analysis from Trustpilot, G2, and more" },
  { icon: Sparkles, title: "Founder Playbook", desc: "Data-backed strategy tailored to your unique position" },
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    const report = await base44.entities.AnalysisReport.create({
      product_idea: idea.trim(),
      status: "discovering",
      progress_message: "Initializing competitive intelligence engine...",
    });
    navigate(`/analysis?id=${report.id}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <HeroBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-inter font-bold text-lg tracking-tight">RIVALYZE</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-12 md:pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">AI-Powered Competitive Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-inter font-black tracking-tight leading-[1.05] mb-6">
            Know your market
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              before you launch
            </span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            Describe your product idea. We'll map the competitive landscape, analyze sentiment, and build your strategic playbook.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4">
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your product or service idea in detail...&#10;&#10;e.g., 'An AI-powered project management tool for remote teams that integrates with Slack and provides automated sprint planning'"
                className="bg-transparent border-0 resize-none text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 min-h-[120px] text-base"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {idea.length > 0 ? `${idea.length} characters` : "Be specific for better results"}
                </span>
                <Button
                  onClick={handleAnalyze}
                  disabled={!idea.trim() || loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-xl gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Analyze Market <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full mt-20"
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.1} />
          ))}
        </motion.div>
      </main>
    </div>
  );
}