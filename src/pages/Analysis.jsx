import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingAnalysis from "../components/analysis/LoadingAnalysis";
import AnalysisDashboard from "../components/analysis/AnalysisDashboard";

export default function Analysis() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get("id");

  const runAnalysis = useCallback(async (rpt) => {
    // Step 1: Discover competitors
    await base44.entities.AnalysisReport.update(rpt.id, {
      status: "discovering",
      progress_message: "Scanning the market for competitors...",
    });
    setReport((prev) => ({ ...prev, status: "discovering", progress_message: "Scanning the market for competitors..." }));

    const discoveryResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a competitive intelligence analyst. Given the following product/service idea, identify 4-6 real, existing competitor companies that operate in the same or adjacent market.

PRODUCT IDEA: "${rpt.product_idea}"

For each competitor, provide:
- company_name: The real company name
- website: Their website URL
- relevance: Why they're a competitor (1 sentence)

Return ONLY real companies that actually exist. Do NOT invent fictional companies.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          competitors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                company_name: { type: "string" },
                website: { type: "string" },
                relevance: { type: "string" },
                source_url: { type: "string" },
              },
            },
          },
        },
      },
      model: "gemini_3_flash",
    });

    const competitors = discoveryResult.competitors || [];
    const competitorNames = competitors.map((c) => c.company_name);

    await base44.entities.AnalysisReport.update(rpt.id, {
      competitors_discovered: competitorNames,
      progress_message: `Found ${competitorNames.length} competitors. Performing deep analysis...`,
      status: "analyzing",
    });
    setReport((prev) => ({
      ...prev,
      competitors_discovered: competitorNames,
      progress_message: `Found ${competitorNames.length} competitors. Performing deep analysis...`,
      status: "analyzing",
    }));

    // Step 2: Deep analysis of each competitor
    const competitorList = competitors.map((c) => `- ${c.company_name} (${c.website}): ${c.relevance}`).join("\n");

    await base44.entities.AnalysisReport.update(rpt.id, {
      progress_message: "Analyzing competitor positioning, features, and sentiment...",
    });
    setReport((prev) => ({ ...prev, progress_message: "Analyzing competitor positioning, features, and sentiment..." }));

    const analysisResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are RIVALYZE, an advanced competitive intelligence engine. Analyze these competitors for the given product idea.

PRODUCT IDEA: "${rpt.product_idea}"

COMPETITORS:
${competitorList}

For each competitor, analyze and extract:
1. Target audience (primary + secondary)
2. Key features (list the main ones, mark which are heavily marketed)
3. What differentiates them
4. Pricing (exact if known, estimate if not — label estimates)
5. Market category: Premium / Mid-tier / Economy
6. Brand personality traits (e.g., Aggressive, Friendly, Technical, Minimalist)
7. Key marketing keywords/phrases
8. Positive points from customer perspective
9. Negative points / common complaints
10. A concise summary
11. Popularity ranking (1 = most popular)
12. Threat score (0-100) based on: popularity(25%), feature strength(20%), sentiment(20%), pricing competitiveness(15%), trend alignment(20%)

Also produce a cross-company comparison:
1. Trend analysis: key industry keywords with lifecycle stage (early/growing/peak/decline)
2. Ranking list by threat score
3. Customer satisfaction overlap score (0-1)
4. White space summary: unmet needs and opportunities
5. Founder's playbook: recommended features, pricing strategy, target audience, positioning, and reasoning

Be data-driven, conservative, and label any estimates. Include confidence scores.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          company_tabs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                company_name: { type: "string" },
                website: { type: "string" },
                popularity_ranking: { type: "number" },
                threat_score: { type: "number" },
                target_audience: {
                  type: "object",
                  properties: {
                    primary: { type: "string" },
                    secondary: { type: "string" },
                    confidence: { type: "number" },
                  },
                },
                key_features: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      heavily_marketed: { type: "boolean" },
                    },
                  },
                },
                differentiation: { type: "string" },
                pricing_range: { type: "string" },
                pricing_estimated: { type: "boolean" },
                market_category: { type: "string" },
                brand_personality: {
                  type: "array",
                  items: { type: "string" },
                },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                },
                positive_points: {
                  type: "array",
                  items: { type: "string" },
                },
                negative_points: {
                  type: "array",
                  items: { type: "string" },
                },
                summary: { type: "string" },
                sources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      url: { type: "string" },
                      title: { type: "string" },
                    },
                  },
                },
                confidence_scores: {
                  type: "object",
                  properties: {
                    pricing: { type: "number" },
                    sentiment: { type: "number" },
                    trend: { type: "number" },
                  },
                },
              },
            },
          },
          comparison_tab: {
            type: "object",
            properties: {
              trend_graph: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyword: { type: "string" },
                    stage: { type: "string" },
                    intensity: { type: "number" },
                  },
                },
              },
              ranking_list: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    company: { type: "string" },
                    rank: { type: "number" },
                    threat_score: { type: "number" },
                  },
                },
              },
              customer_satisfaction_overlap: { type: "number" },
              white_space_summary: { type: "string" },
              white_space_sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: { url: { type: "string" }, title: { type: "string" } },
                },
              },
              trend_sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: { url: { type: "string" }, title: { type: "string" } },
                },
              },
              founder_playbook: {
                type: "object",
                properties: {
                  features: { type: "array", items: { type: "string" } },
                  pricing_strategy: { type: "string" },
                  target_audience: { type: "string" },
                  positioning: { type: "string" },
                  reasoning: { type: "string" },
                  sources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { url: { type: "string" }, title: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      model: "gemini_3_pro",
    });

    // Step 3: Save results
    await base44.entities.AnalysisReport.update(rpt.id, {
      status: "complete",
      progress_message: "Analysis complete!",
      analysis_result: analysisResult,
    });
    setReport((prev) => ({
      ...prev,
      status: "complete",
      progress_message: "Analysis complete!",
      analysis_result: analysisResult,
    }));
  }, []);

  useEffect(() => {
    if (!reportId) {
      navigate("/");
      return;
    }
    const load = async () => {
      const rpt = await base44.entities.AnalysisReport.filter({ id: reportId });
      if (!rpt.length) {
        navigate("/");
        return;
      }
      const r = rpt[0];
      setReport(r);
      setLoading(false);
      if (r.status !== "complete") {
        runAnalysis(r);
      }
    };
    load();
  }, [reportId, navigate, runAnalysis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-inter font-bold text-sm tracking-tight">RIVALYZE</span>
            </div>
          </div>
          {report.status === "complete" && (
            <span className="text-xs text-muted-foreground font-mono">
              {report.competitors_discovered?.length || 0} competitors analyzed
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      {report.status !== "complete" ? (
        <LoadingAnalysis report={report} />
      ) : (
        <AnalysisDashboard report={report} />
      )}
    </div>
  );
}