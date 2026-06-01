"use client";

import { useState, useEffect } from "react";
import { formatInr, formatInrCompact } from "@/lib/utils/currency";

const arBuckets = [
  { name: "Current", percentage: 45, amount: 650000, color: "bg-emerald-500" },
  { name: "1-30 Days", percentage: 28, amount: 405000, color: "bg-yellow-500" },
  { name: "31-60 Days", percentage: 18, amount: 260000, color: "bg-orange-500" },
  { name: "90+ Days", percentage: 9, amount: 130000, color: "bg-red-500" },
];

export function PipelineOverview() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 h-95">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Accounts Receivable Aging</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Invoice aging by days overdue</p>
      </div>

      <div className="space-y-5">
        {arBuckets.map((bucket, index) => (
          <div key={bucket.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{bucket.name}</span>
              <span className="text-sm font-semibold text-foreground">{formatInrCompact(bucket.amount)}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${bucket.color} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: isLoaded ? `${bucket.percentage}%` : "0%",
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total AR value */}
      <div className="mt-6 pt-5 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Accounts Receivable</span>
          <span className="text-xl font-bold text-foreground">{formatInr(1450000)}</span>
        </div>
      </div>
    </div>
  );
}
