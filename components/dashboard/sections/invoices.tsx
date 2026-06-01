"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

interface Deal {
  id: string;
  invoiceId: string;
  company: string;
  contact: string;
  email: string;
  value: number;
  issueDate: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue" | "processing";
  closeDate: string;
  rep: string;
}

const deals: Deal[] = [
  { id: "1", invoiceId: "INV-2026-001", company: "Acme Corporation", contact: "John Smith", email: "john@acme.com", value: 125000, issueDate: "2024-01-01", dueDate: "2024-01-15", status: "paid", closeDate: "2024-01-15", rep: "Sarah Chen" },
  { id: "2", invoiceId: "INV-2026-002", company: "TechStart Inc", contact: "Lisa Wong", email: "lisa@techstart.io", value: 89500, issueDate: "2024-01-05", dueDate: "2024-01-22", status: "unpaid", closeDate: "2024-01-22", rep: "Mike Johnson" },
  { id: "3", invoiceId: "INV-2026-003", company: "GlobalFin Partners", contact: "Robert Davis", email: "rdavis@globalfin.com", value: 245000, issueDate: "2024-01-10", dueDate: "2024-02-01", status: "processing", closeDate: "2024-02-01", rep: "Emily Davis" },
  { id: "4", invoiceId: "INV-2026-004", company: "DataSync Solutions", contact: "Emma Wilson", email: "emma@datasync.net", value: 67800, issueDate: "2023-12-15", dueDate: "2024-01-10", status: "overdue", closeDate: "2024-01-10", rep: "James Wilson" },
  { id: "5", invoiceId: "INV-2026-005", company: "CloudBase Ltd", contact: "Michael Chen", email: "m.chen@cloudbase.io", value: 178000, issueDate: "2024-01-03", dueDate: "2024-01-18", status: "paid", closeDate: "2024-01-18", rep: "Sarah Chen" },
  { id: "6", invoiceId: "INV-2026-006", company: "Innovate Labs", contact: "Jennifer Park", email: "jpark@innovate.co", value: 156000, issueDate: "2024-01-08", dueDate: "2024-01-28", status: "unpaid", closeDate: "2024-01-28", rep: "Lisa Park" },
  { id: "7", invoiceId: "INV-2026-007", company: "NextGen Systems", contact: "David Lee", email: "david@nextgen.tech", value: 203000, issueDate: "2024-01-12", dueDate: "2024-02-05", status: "processing", closeDate: "2024-02-05", rep: "Mike Johnson" },
  { id: "8", invoiceId: "INV-2026-008", company: "Prime Analytics", contact: "Sarah Johnson", email: "sj@primeanalytics.com", value: 94500, issueDate: "2023-12-20", dueDate: "2024-02-10", status: "overdue", closeDate: "2024-02-10", rep: "Emily Davis" },
];

const statusConfig = {
  paid: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Paid" },
  unpaid: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Unpaid" },
  overdue: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Overdue" },
  processing: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "Processing" },
};

export function DealsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || deal.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Manage, track, and reconcile all client invoices.</p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "paid", "unpaid", "overdue", "processing"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  selectedFilter === filter
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
          <Filter className="w-4 h-4" />
          More filters
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Invoice ID
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issue Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal, index) => {
                const status = statusConfig[deal.status];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={deal.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors duration-150 cursor-pointer animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-foreground">{deal.invoiceId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-foreground">{deal.contact}</p>
                        <p className="text-xs text-muted-foreground">{deal.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                        ₹{deal.value.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{deal.issueDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{deal.dueDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.bg, status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="group relative">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg hidden group-hover:block z-50">
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-t-lg transition-colors"
                          >
                            Download PDF
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                          >
                            Send Reminder
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-b-lg transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <span className="text-sm text-muted-foreground">
            Showing {filteredDeals.length} of {deals.length} invoices
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-accent text-accent-foreground font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
