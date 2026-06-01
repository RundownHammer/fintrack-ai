"use client";

import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="mt-3 space-y-1">
        <span className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight font-tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
