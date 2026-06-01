"use client";

import { AlertTriangle } from "lucide-react";

const actionItems = [
  { vendor: "Acme Corp", invoice: "INV-2024-1547", amount: "$15,420", confidence: "42%" },
  { vendor: "TechStart Inc", invoice: "INV-2024-1546", amount: "$8,750", confidence: "38%" },
  { vendor: "GlobalFin Solutions", invoice: "INV-2024-1545", amount: "$22,300", confidence: "45%" },
  { vendor: "DataSync Ltd", invoice: "INV-2024-1544", amount: "$5,890", confidence: "35%" },
  { vendor: "CloudBase Partners", invoice: "INV-2024-1543", amount: "$19,250", confidence: "41%" },
];

export function TopPerformers() {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Action Required</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Low confidence invoices needing review</p>
        </div>
        <div className="flex items-center gap-1 text-destructive">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3">
        {actionItems.map((item, index) => (
          <div
            key={item.invoice}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-destructive/5 border border-transparent hover:border-destructive/20 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-right-2"
            style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.vendor}</p>
                <p className="text-xs text-muted-foreground">{item.invoice} • {item.amount}</p>
              </div>
            </div>

            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors whitespace-nowrap ml-2">
              Review Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
