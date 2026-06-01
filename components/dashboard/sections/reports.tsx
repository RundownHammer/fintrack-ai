"use client";

import React from "react";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  BarChart3,
  Clock,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const incomeExpenseData = [
  { month: "Jan", income: 420, expenses: 280 },
  { month: "Feb", income: 460, expenses: 310 },
  { month: "Mar", income: 510, expenses: 330 },
  { month: "Apr", income: 560, expenses: 360 },
  { month: "May", income: 620, expenses: 390 },
  { month: "Jun", income: 670, expenses: 430 },
  { month: "Jul", income: 710, expenses: 450 },
  { month: "Aug", income: 760, expenses: 470 },
  { month: "Sep", income: 820, expenses: 510 },
  { month: "Oct", income: 880, expenses: 540 },
  { month: "Nov", income: 930, expenses: 570 },
  { month: "Dec", income: 990, expenses: 600 },
];

const expenseCategoryData = [
  { name: "Software", value: 28, color: "oklch(0.7 0.18 220)" },
  { name: "Office Supplies", value: 18, color: "oklch(0.7 0.18 145)" },
  { name: "Travel", value: 16, color: "oklch(0.75 0.18 55)" },
  { name: "Marketing", value: 22, color: "oklch(0.65 0.2 25)" },
  { name: "Utilities", value: 16, color: "oklch(0.7 0.15 300)" },
];

const exportHistory = [
  {
    id: "1",
    name: "Monthly Profit & Loss (P&L)",
    date: "May 22, 2026",
    format: "CSV",
    href: "#",
  },
  {
    id: "2",
    name: "GST Liability Summary",
    date: "May 20, 2026",
    format: "PDF",
    href: "#",
  },
  {
    id: "3",
    name: "Expense Categorization",
    date: "May 17, 2026",
    format: "CSV",
    href: "#",
  },
  {
    id: "4",
    name: "Overdue Accounts Receivable",
    date: "May 12, 2026",
    format: "CSV",
    href: "#",
  },
];

function ExportCard({
  title,
  description,
  icon: Icon,
  color,
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  index: number;
}) {
  return (
    <div
      className="group bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
        Generate Export
      </p>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>
      <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">
        <Download className="w-3.5 h-3.5 mr-1.5" />
        Download CSV
      </Button>
    </div>
  );
}

export function ReportsSection() {
  const [chartsLoaded, setChartsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChartsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Financial Insights & Exports</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Export-ready reports and AI-driven financial breakdowns
        </p>
      </div>

      {/* Quick export actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ExportCard
          title="Monthly Profit & Loss (P&L)"
          description="Month-to-date income, expenses, and net margin"
          icon={BarChart3}
          color="bg-chart-1/10 text-chart-1"
          index={0}
        />
        <ExportCard
          title="GST Liability Summary"
          description="Tax collected, input credits, and payable totals"
          icon={FileText}
          color="bg-accent/10 text-accent"
          index={1}
        />
        <ExportCard
          title="Expense Categorization"
          description="AI-tagged expenses by category and vendor"
          icon={PieChartIcon}
          color="bg-chart-3/10 text-chart-3"
          index={2}
        />
        <ExportCard
          title="Overdue Accounts Receivable"
          description="Invoices past due with aging buckets"
          icon={Clock}
          color="bg-chart-5/10 text-chart-5"
          index={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs expenses trend */}
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Income vs. Expenses (Year to Date)</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track how cash inflow compares to operational spend
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_145)]" />
                Income
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_220)]" />
                Expenses
              </div>
            </div>
          </div>
          <div className={`h-[250px] transition-opacity duration-700 ${chartsLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpenseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  tickFormatter={(value) => `${value}k`}
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
                  formatter={(value: number, name: string) => [
                    `INR ${value}k`,
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="oklch(0.7 0.18 145)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="oklch(0.7 0.18 220)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating expenses pie chart */}
        <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground">Operating Expenses by Category</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Share of total operating spend</p>
          </div>
          <div className="flex items-center gap-8">
            <div className={`w-[180px] h-[180px] transition-opacity duration-700 ${chartsLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {expenseCategoryData.map((source, index) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between animate-in fade-in slide-in-from-right-2"
                  style={{ animationDelay: `${(index + 5) * 100}ms`, animationFillMode: "both" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm text-foreground">{source.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated reports history */}
      <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Generated Reports History</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Recent exports available for download
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Date Generated</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exportHistory.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium text-foreground">{report.name}</TableCell>
                <TableCell className="text-muted-foreground">{report.date}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                    {report.format}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={report.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
