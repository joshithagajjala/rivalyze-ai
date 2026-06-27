import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, Users, Star, AlertTriangle, CheckCircle2, Tag, Shield } from "lucide-react";
import SourcesButton from "./SourcesButton";
import ThreatScoreRing from "./ThreatScoreRing";
import ConfidenceBadge from "./ConfidenceBadge";

export default function CompetitorTab({ company }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-inter font-bold">{company.company_name}</h2>
            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              company.market_category === "Premium"
                ? "border-chart-4/30 bg-chart-4/10 text-chart-4"
                : company.market_category === "Mid-tier"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-chart-3/30 bg-chart-3/10 text-chart-3"
            }`}>
              {company.market_category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{company.summary}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> {company.website}
              </a>
            )}
            <SourcesButton sources={company.sources} />
          </div>
        </div>
        <ThreatScoreRing score={company.threat_score} rank={company.popularity_ranking} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Target Audience */}
        <Card title="Target Audience" icon={Users}>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Primary</p>
              <p className="text-sm">{company.target_audience?.primary}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Secondary</p>
              <p className="text-sm">{company.target_audience?.secondary}</p>
            </div>
            <ConfidenceBadge value={company.target_audience?.confidence} />
          </div>
        </Card>

        {/* Pricing */}
        <Card title="Pricing" icon={Tag}>
          <p className="text-sm font-medium">{company.pricing_range}</p>
          {company.pricing_estimated && (
            <p className="text-[10px] text-chart-4 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Estimated
            </p>
          )}
          <div className="mt-2">
            <ConfidenceBadge value={company.confidence_scores?.pricing} label="Pricing confidence" />
          </div>
        </Card>

        {/* Brand Personality */}
        <Card title="Brand Personality" icon={Star}>
          <div className="flex flex-wrap gap-1.5">
            {(company.brand_personality || []).map((trait, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-foreground">
                {trait}
              </span>
            ))}
          </div>
        </Card>

        {/* Differentiation */}
        <Card title="Differentiation" icon={Shield} className="md:col-span-2 lg:col-span-3">
          <p className="text-sm text-foreground/90 leading-relaxed">{company.differentiation}</p>
        </Card>

        {/* Key Features */}
        <Card title="Key Features" icon={TrendingUp} className="lg:col-span-2">
          <div className="space-y-1.5">
            {(company.key_features || []).map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${f.heavily_marketed ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <span className="text-sm">{f.name}</span>
                {f.heavily_marketed && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono uppercase">Featured</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Keywords */}
        <Card title="Keywords" icon={Tag}>
          <div className="flex flex-wrap gap-1.5">
            {(company.keywords || []).map((kw, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-md bg-secondary border border-border text-secondary-foreground">
                {kw}
              </span>
            ))}
          </div>
        </Card>

        {/* Positive Points */}
        <Card title="Strengths" icon={CheckCircle2}>
          <ul className="space-y-1.5">
            {(company.positive_points || []).map((p, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-chart-3 mt-0.5">+</span>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Negative Points */}
        <Card title="Weaknesses" icon={AlertTriangle}>
          <ul className="space-y-1.5">
            {(company.negative_points || []).map((p, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-destructive mt-0.5">−</span>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Confidence */}
        <Card title="Confidence Scores" icon={Shield}>
          <div className="space-y-3">
            {Object.entries(company.confidence_scores || {}).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize text-muted-foreground">{key}</span>
                  <span className="font-mono">{((val || 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(val || 0) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`p-5 rounded-xl bg-card border border-border/50 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}