"use client";

import { useState, useEffect } from "react";
import {
  ComposedChart, // Swapped AreaChart for ComposedChart
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatInr, formatInrCompact } from "@/lib/utils/currency";

const rawData = [
  { month: "Jan", income: 186000, expenses: 140000 },
  { month: "Feb", income: 205000, expenses: 155000 },
  { month: "Mar", income: 237000, expenses: 165000 },
  { month: "Apr", income: 273000, expenses: 180000 },
  { month: "May", income: 209000, expenses: 160000 },
  { month: "Jun", income: 314000, expenses: 185000 },
  { month: "Jul", income: 352000, expenses: 200000 },
  { month: "Aug", income: 319000, expenses: 415000 },
  { month: "Sep", income: 321000, expenses: 525000 },
  { month: "Oct", income: 458000, expenses: 345000 },
  { month: "Nov", income: 492000, expenses: 260000 },
  { month: "Dec", income: 547000, expenses: 280000 },
];

const data = rawData.map((entry) => ({
  ...entry,
  netBalance: entry.income - entry.expenses,
}));

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CashFlowTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const income = data.income || 0;
    const expenses = data.expenses || 0;
    const netBalance = data.netBalance || 0;

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-4">
            <span>Income</span>
            <span className="font-medium text-foreground">{formatInr(income)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Expenses</span>
            <span className="font-medium text-foreground">{formatInr(expenses)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
            <span>Net Balance</span>
            <span className={`font-medium ${netBalance < 0 ? 'text-red-400' : 'text-blue-400'}`}>
              {formatInr(netBalance)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 h-95">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Cash Flow</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Monthly income and expenses</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0 w-5 border-t-2 border-dashed border-blue-500" />
            <span className="text-muted-foreground">Net Balance</span>
          </div>
        </div>
      </div>

      <div className={`h-70 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <ResponsiveContainer width="100%" height="100%">
          {/* Swapped to ComposedChart so Lines and Areas can coexist natively */}
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value: number) => formatInrCompact(value)}
              // Removed domain={[0, "dataMax"]} so the negative values don't break the chart
              dx={-10}
            />
            <Tooltip content={<CashFlowTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />
            
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="rgb(239, 68, 68)"
              strokeWidth={2}
              fill="url(#expensesGradient)"
              fillOpacity={0.2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="rgb(34, 197, 94)"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              fillOpacity={0.2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="netBalance"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}