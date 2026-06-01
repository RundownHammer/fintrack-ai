"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  Flame,
  RefreshCw,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatInr, formatInrLakhs } from "@/lib/utils/currency";

const cashFlowData = [
  { month: "Jan", income: 920000, expenses: 640000, balanceHistorical: 4200000, balanceProjected: null },
  { month: "Feb", income: 880000, expenses: 670000, balanceHistorical: 3920000, balanceProjected: null },
  { month: "Mar", income: 940000, expenses: 710000, balanceHistorical: 3650000, balanceProjected: null },
  { month: "Apr", income: 960000, expenses: 760000, balanceHistorical: 3480000, balanceProjected: null },
  { month: "May", income: 980000, expenses: 790000, balanceHistorical: 3320000, balanceProjected: null },
  { month: "Jun", income: 1010000, expenses: 830000, balanceHistorical: null, balanceProjected: 3120000 },
  { month: "Jul", income: 1040000, expenses: 860000, balanceHistorical: null, balanceProjected: 2920000 },
  { month: "Aug", income: 1080000, expenses: 910000, balanceHistorical: null, balanceProjected: 2700000 },
  { month: "Sep", income: 1100000, expenses: 940000, balanceHistorical: null, balanceProjected: 2480000 },
];

type CashFlowTooltipProps = {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
};

function CashFlowTooltip({ active, payload, label }: CashFlowTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const income = payload.find((entry) => entry.dataKey === "income")?.value;
  const expenses = payload.find((entry) => entry.dataKey === "expenses")?.value;
  const balanceHistorical = payload.find((entry) => entry.dataKey === "balanceHistorical")?.value;
  const balanceProjected = payload.find((entry) => entry.dataKey === "balanceProjected")?.value;
  const netBalance = balanceProjected ?? balanceHistorical;
  const formatValue = (value?: number) => (typeof value === "number" ? formatInr(value) : "—");

  return (
    <div className="rounded-lg border border-border bg-card/95 p-3 text-xs shadow-sm">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="mt-2 space-y-1 text-muted-foreground">
        <div className="flex items-center justify-between gap-4">
          <span>Income</span>
          <span className="font-medium text-foreground">{formatValue(income)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Expenses</span>
          <span className="font-medium text-foreground">{formatValue(expenses)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Net Balance</span>
          <span className="font-medium text-foreground">{formatValue(netBalance)}</span>
        </div>
      </div>
    </div>
  );
}

export function ForecastingSection() {
  const [timeframe, setTimeframe] = useState("6m");
  const [isLoading, setIsLoading] = useState(true);
  const [churnRate, setChurnRate] = useState(6);
  const [collectionDelay, setCollectionDelay] = useState(24);
  const [equipmentSpend, setEquipmentSpend] = useState(450000);
  const [plannedHiring, setPlannedHiring] = useState(2);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const currentCashBalance = 3840000;
  const projectedMonthlyBurn = 420000;
  const estimatedRunwayMonths = 14;
  const upcomingTaxLiabilities = 650000;

  const kpiStats = [
    {
      label: "Current Cash Balance",
      value: formatInr(currentCashBalance),
      subtext: "As of today",
      icon: Wallet,
      badge: "Updated 2h ago",
    },
    {
      label: "Projected Monthly Burn Rate",
      value: `${formatInr(projectedMonthlyBurn)}/mo`,
      subtext: "Avg last 90 days",
      icon: Flame,
      badge: "AI trend -4%",
    },
    {
      label: "Estimated Runway",
      value: `${estimatedRunwayMonths} Months`,
      subtext: "At current burn",
      icon: Clock,
      badge: "Floor ₹12.4L",
    },
    {
      label: "Upcoming Tax Liabilities",
      value: formatInr(upcomingTaxLiabilities),
      subtext: "Next 45 days",
      icon: AlertTriangle,
      badge: "GST + TDS",
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Predictive Cash Flow & Runway</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-assisted visibility into cash runway, burn, and risk exposure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-35 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 months</SelectItem>
              <SelectItem value="12m">12 months</SelectItem>
              <SelectItem value="18m">18 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiStats.map((stat, index) => (
          <Card
            key={stat.label}
            className={`bg-card transition-all duration-500 ${
              isLoading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            } ${stat.highlight ? "border-yellow-500/40" : "border-border"}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <stat.icon
                    className={`w-5 h-5 ${stat.highlight ? "text-yellow-300" : "text-accent"}`}
                  />
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      stat.highlight
                        ? "text-yellow-300 border-yellow-500/40"
                        : "text-muted-foreground border-border"
                    }`}
                  >
                    {stat.badge}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Cash Flow Runway</CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-6 rounded-full bg-accent" />
                <span className="text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-6 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-6 rounded-full bg-chart-1" />
                <span className="text-muted-foreground">Net Balance (Historical)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0 w-6 border-t-2 border-dashed border-chart-1" />
                <span className="text-muted-foreground">Net Balance (Projected)</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.6 0.22 25)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.6 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis
                  stroke="oklch(0.65 0 0)"
                  fontSize={12}
                  tickFormatter={(value) => formatInrLakhs(value)}
                />
                <Tooltip
                  content={<CashFlowTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="oklch(0.7 0.18 145)"
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="oklch(0.6 0.22 25)"
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                  fillOpacity={0.2}
                />
                <Line
                  type="monotone"
                  dataKey="balanceHistorical"
                  stroke="oklch(0.7 0.18 220)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="balanceProjected"
                  stroke="oklch(0.7 0.18 220)"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Scenario Modeler */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-medium">AI Scenario Modeler</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Adjust key assumptions to simulate runway impact
              </p>
            </div>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Model v2.7 • 10,000 sims
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="churnRate">Expected Client Churn (%)</Label>
                  <span className="text-xs text-muted-foreground">{churnRate.toFixed(1)}%</span>
                </div>
                <Slider
                  id="churnRate"
                  value={[churnRate]}
                  onValueChange={(value) => setChurnRate(value[0] ?? 0)}
                  min={0}
                  max={20}
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground">
                  Higher churn reduces recurring cash inflow velocity.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="collectionDelay">Average Collection Cycle (days)</Label>
                  <span className="text-xs text-muted-foreground">{collectionDelay} days</span>
                </div>
                <Slider
                  id="collectionDelay"
                  value={[collectionDelay]}
                  onValueChange={(value) => setCollectionDelay(value[0] ?? 0)}
                  min={15}
                  max={90}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Longer collection cycles compress runway availability.
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="equipmentSpend">Planned Equipment Purchases (₹)</Label>
                  <span className="text-xs text-muted-foreground">{formatInr(equipmentSpend)}</span>
                </div>
                <Slider
                  id="equipmentSpend"
                  value={[equipmentSpend]}
                  onValueChange={(value) => setEquipmentSpend(value[0] ?? 0)}
                  min={0}
                  max={1000000}
                  step={10000}
                />
                <p className="text-xs text-muted-foreground">
                  Capex allocation planned over the next 90 days.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="plannedHiring">Planned Hiring (FTE)</Label>
                  <span className="text-xs text-muted-foreground">{plannedHiring}</span>
                </div>
                <Slider
                  id="plannedHiring"
                  value={[plannedHiring]}
                  onValueChange={(value) => setPlannedHiring(value[0] ?? 0)}
                  min={0}
                  max={10}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Includes compensation, benefits, and onboarding costs.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="space-y-1">
                <p className="uppercase tracking-[0.2em]">Model Confidence</p>
                <p className="text-sm font-semibold text-foreground">92%</p>
              </div>
              <div className="space-y-1">
                <p className="uppercase tracking-[0.2em]">Projected Cash Floor</p>
                <p className="text-sm font-semibold text-foreground">{formatInr(1240000)}</p>
              </div>
              <div className="space-y-1">
                <p className="uppercase tracking-[0.2em]">Cash-Out Month</p>
                <p className="text-sm font-semibold text-foreground">Nov 2026</p>
              </div>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recalculate Runway
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
