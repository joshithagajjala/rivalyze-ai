import { motion } from "framer-motion";
import { TrendingUp, Target, Lightbulb, BarChart3, Users, DollarSign, Crosshair, BookOpen } from "lucide-react";
import SourcesButton from "./SourcesButton";
import ThreatScoreRing from "./ThreatScoreRing";
import TrendChart from "./TrendChart";

export default function ComparisonTab({ comparison, companies, mode }) {
  if (mode === "playbook") {
    return <PlaybookView playbook={comparison.founder_playbook} />;
  }

  return (
    <div className="space-y-6">
      {/* Threat Rankings */}
      <Section title="Threat Rankings" icon={BarChart3}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(comparison.ranking_list || [])
            .sort((a, b) => a.rank - b.rank)
            .map((item) => (
              <motion.div
                key={item.company}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center p-4 rounded-xl bg-card border border-border/50"
              >
                <ThreatScoreRing score={item.threat_score} rank={item.rank} />
                <p className="mt-3 text-xs font-medium text-center truncate w-full">{item.company}</p>
              </motion.div>
            ))}
        </div>
      </Section>

      {/* Trend Analysis */}
      <Section title="Keyword Trends" icon={TrendingUp} sources={comparison.trend_sources}>
        <TrendChart trends={comparison.trend_graph || []} />
      </Section>

      {/* Satisfaction Overlap */}
      {comparison.customer_satisfaction_overlap != null && (
        <Section title="Customer-Market Alignment" icon={Target}>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(220 16% 12%)" strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(195 100% 50%)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={283}
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - comparison.customer_satisfaction_overlap * 283 }}
                  transition={{ duration: 1.5 }}
                  className="-rotate-90 origin-center"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-inter font-black text-primary">
                  {Math.round(comparison.customer_satisfaction_overlap * 100)}%
                </span>
                <span className="text-[9px] text-muted-foreground uppercase">Overlap</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {comparison.customer_satisfaction_overlap < 0.5
                  ? "Low overlap indicates significant unmet customer needs — a strong opportunity for differentiation."
                  : comparison.customer_satisfaction_overlap < 0.75
                  ? "Moderate overlap suggests some needs are being met, but gaps remain to be exploited."
                  : "High overlap means the market is well-served. Differentiation will require innovative approaches."}
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* White Space */}
      <Section title="White Space Analysis" icon={Lightbulb} sources={comparison.white_space_sources}>
        <p className="text-sm text-foreground/90 leading-relaxed">{comparison.white_space_summary}</p>
      </Section>

      {/* Feature Comparison */}
      <Section title="Feature Landscape" icon={BarChart3}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pricing</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Features</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Threat</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c, i) => (
                <motion.tr
                  key={c.company_name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{c.company_name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      c.market_category === "Premium"
                        ? "border-chart-4/30 bg-chart-4/10 text-chart-4"
                        : c.market_category === "Mid-tier"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-chart-3/30 bg-chart-3/10 text-chart-3"
                    }`}>
                      {c.market_category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{c.pricing_range}</td>
                  <td className="py-3 px-4 text-center font-mono text-xs">{(c.key_features || []).length}</td>
                  <td className="py-3 px-4 text-center font-mono text-xs font-bold">{c.threat_score}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function PlaybookView({ playbook }) {
  if (!playbook) {
    return <p className="text-muted-foreground text-sm">No playbook data available.</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h2 className="text-3xl font-inter font-black mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Founder's Playbook
          </h2>
          <p className="text-muted-foreground text-sm">Data-backed strategy for market entry</p>
        </div>
        <SourcesButton sources={playbook?.sources} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlaybookCard icon={Crosshair} title="Recommended Features" delay={0}>
          <ul className="space-y-2">
            {(playbook.features || []).map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary font-bold">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </PlaybookCard>

        <PlaybookCard icon={DollarSign} title="Pricing Strategy" delay={0.1}>
          <p className="text-sm leading-relaxed">{playbook.pricing_strategy}</p>
        </PlaybookCard>

        <PlaybookCard icon={Users} title="Target Audience" delay={0.2}>
          <p className="text-sm leading-relaxed">{playbook.target_audience}</p>
        </PlaybookCard>

        <PlaybookCard icon={Target} title="Positioning" delay={0.3}>
          <p className="text-sm leading-relaxed">{playbook.positioning}</p>
        </PlaybookCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Strategic Reasoning</h3>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{playbook.reasoning}</p>
      </motion.div>
    </div>
  );
}

function PlaybookCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 rounded-xl bg-card border border-border/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Section({ title, icon: Icon, children, sources }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        </div>
        <SourcesButton sources={sources} />
      </div>
      {children}
    </div>
  );
}