
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompetitorTab from "./CompetitorTab";
import ComparisonTab from "./ComparisonTab";

export default function AnalysisDashboard({ report }) {
  const data = report.analysis_result;
  const companies = data?.company_tabs || [];
  const comparison = data?.comparison_tab || {};
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { value: "overview", label: "Market Overview" },
    ...companies.map((c) => ({ value: c.company_name, label: c.company_name })),
    { value: "playbook", label: "Founder Playbook" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Product idea banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-card border border-border/50"
      >
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Analyzing</p>
        <p className="text-sm text-foreground leading-relaxed">{report.product_idea}</p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-secondary/50 border border-border/50 h-auto p-1 flex-wrap gap-1 mb-6 w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && (
          <ComparisonTab comparison={comparison} companies={companies} mode="overview" />
        )}
        {activeTab === "playbook" && (
          <ComparisonTab comparison={comparison} companies={companies} mode="playbook" />
        )}
        {companies.map(
          (c) =>
            activeTab === c.company_name && (
              <CompetitorTab key={c.company_name} company={c} />
            )
        )}
      </motion.div>
    </div>
  );
}