"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, AlertTriangle, BadgeCheck, FileText, Receipt } from "lucide-react";

const activities = [
  {
    title: "Invoice #1042 categorized",
    timestamp: "2 minutes ago",
    icon: FileText,
  },
  {
    title: "GST extracted from AWS invoice",
    timestamp: "6 minutes ago",
    icon: BadgeCheck,
  },
  {
    title: "Possible duplicate invoice detected",
    timestamp: "18 minutes ago",
    icon: AlertTriangle,
    status: "Review",
  },
  {
    title: "Receipt added to ledger",
    timestamp: "42 minutes ago",
    icon: Receipt,
  },
];

export function RecentDeals() {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">AI Activity Log</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Automated system actions</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
          View all
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-border/60">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.title} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activity.status && (
                  <Badge variant="outline" className="text-xs text-yellow-300 border-yellow-500/40">
                    {activity.status}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
