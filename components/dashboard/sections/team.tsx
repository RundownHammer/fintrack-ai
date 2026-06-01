"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Target, TrendingUp, TrendingDown, FileText, Send, MoreHorizontal, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  avatar: string;
  totalSpend: number;
  ytdExpenses: number;
  reconciliationRate: number;
  change: number;
  rank: number;
}

const vendors: Vendor[] = [
  { id: "1", name: "AWS", category: "Cloud Services", email: "billing@aws.amazon.com", avatar: "AWS", totalSpend: 487500, ytdExpenses: 487500, reconciliationRate: 98, change: 15, rank: 1 },
  { id: "2", name: "Google Workspace", category: "Productivity", email: "support@google.com", avatar: "GWS", totalSpend: 356200, ytdExpenses: 356200, reconciliationRate: 95, change: 8, rank: 2 },
  { id: "3", name: "Salesforce", category: "CRM", email: "billing@salesforce.com", avatar: "SF", totalSpend: 312800, ytdExpenses: 312800, reconciliationRate: 94, change: 12, rank: 3 },
  { id: "4", name: "Slack", category: "Communication", email: "billing@slack.com", avatar: "SLK", totalSpend: 289400, ytdExpenses: 289400, reconciliationRate: 91, change: -5, rank: 4 },
  { id: "5", name: "Atlassian", category: "Development", email: "billing@atlassian.com", avatar: "ATLS", totalSpend: 267100, ytdExpenses: 267100, reconciliationRate: 92, change: 9, rank: 5 },
];

const expenseCategoryData = [
  { name: "AWS", spend: 487, category: "Cloud" },
  { name: "Google", spend: 356, category: "Productivity" },
  { name: "Salesforce", spend: 312, category: "CRM" },
  { name: "Slack", spend: 289, category: "Communication" },
  { name: "Atlassian", spend: 267, category: "Development" },
];

function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  const reconciliationRate = vendor.reconciliationRate;
  const isHighReconciliation = reconciliationRate >= 90;

  return (
    <div
      className="group bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-bold text-accent-foreground">
            {vendor.avatar}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{vendor.name}</h4>
            <p className="text-xs text-muted-foreground">{vendor.category}</p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 transition-all duration-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Spend (₹)</p>
          <p className="text-lg font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>₹{(vendor.totalSpend / 100000).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">YTD Expenses</p>
          <p className="text-lg font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>₹{(vendor.ytdExpenses / 100000).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* AI Auto-Reconciliation Rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">AI Auto-Reconciliation</span>
          <span className={cn("font-medium", isHighReconciliation ? "text-success" : "text-foreground")}>
            {reconciliationRate}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", isHighReconciliation ? "bg-success" : "bg-accent")}
            style={{ width: `${Math.min(reconciliationRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-medium", vendor.change >= 0 ? "text-success" : "text-destructive")}>
          {vendor.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {vendor.change >= 0 ? "+" : ""}{vendor.change}%
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChartLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalVendors = vendors.length;
  const ytdExpensesTotal = vendors.reduce((acc, v) => acc + v.ytdExpenses, 0);
  const avgAIConfidence = vendors.reduce((acc, v) => acc + v.reconciliationRate, 0) / vendors.length;
  const flaggedVendors = vendors.filter(v => v.reconciliationRate < 85).length;

  return (
    <div className="space-y-6">
      {/* Page subtitle */}
      <div>
        <p className="text-sm text-muted-foreground">Manage suppliers, track expenses, and monitor AI extraction accuracy.</p>
      </div>

      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Total Vendors</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalVendors}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-chart-1" />
            </div>
            <span className="text-sm text-muted-foreground">YTD Expenses</span>
          </div>
          <p className="text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>₹{(ytdExpensesTotal / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Avg. AI Confidence</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgAIConfidence.toFixed(0)}%</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${flaggedVendors > 0 ? "bg-destructive/10" : "bg-success/10"}`}>
              {flaggedVendors > 0 ? (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-success" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">Flagged Vendors</span>
          </div>
          <p className={`text-2xl font-bold ${flaggedVendors > 0 ? "text-destructive" : "text-success"}`}>{flaggedVendors > 0 ? `${flaggedVendors} Vendors` : "All Clear"}</p>
        </div>
      </div>

      {/* Expense chart */}
      <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">Top Expense Categories</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Top 5 vendors by spend (last 6 months)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Spend (k)</span>
            </div>
          </div>
        </div>
        <div className={`h-[250px] transition-opacity duration-700 ${chartLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseCategoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                tickFormatter={(value) => `₹${value}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.12 0.005 260)",
                  border: "1px solid oklch(0.22 0.005 260)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "oklch(0.95 0 0)", fontWeight: 600 }}
                itemStyle={{ color: "oklch(0.65 0 0)" }}
                formatter={(value: number) => [`₹${value}k`, ""]}
              />
              <Bar dataKey="spend" fill="oklch(0.7 0.18 220)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor profiles grid */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">Vendor Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor, index) => (
            <VendorCard key={vendor.id} vendor={vendor} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
