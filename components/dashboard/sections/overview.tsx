"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { PipelineOverview } from "@/components/dashboard/charts/pipeline-overview";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { TopPerformers } from "@/components/dashboard/top-performers";
import { formatInr, formatInrCompact } from "@/lib/utils/currency";
import { Wallet, FileWarning, FileCheck2, AlertTriangle } from "lucide-react";

export function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cash Balance"
          value={formatInr(1200000)}
          description="Available cash on hand"
          icon={Wallet}
        />
        <MetricCard
          title="Outstanding Invoices"
          value={formatInrCompact(287000)}
          description="Across 24 open invoices"
          icon={FileWarning}
        />
        <MetricCard
          title="Documents Processed"
          value="142"
          description="Processed in the last 24 hours"
          icon={FileCheck2}
        />
        <MetricCard
          title="Needs Review"
          value="8"
          description="Low-confidence items queued"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PipelineOverview />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDeals />
        <TopPerformers />
      </div>
    </div>
  );
}
