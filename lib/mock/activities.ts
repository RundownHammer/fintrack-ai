import type { ActivityItem } from "@/types/activity";

export const activities: ActivityItem[] = [
  {
    id: "act-1",
    title: "Document Uploaded: AWS_Invoice_Oct.pdf",
    timestamp: "10m ago",
    icon: "upload",
  },
  {
    id: "act-2",
    title: "Extraction Completed: Invoice_2026_001.pdf",
    timestamp: "3h ago",
    icon: "extract-complete",
  },
  {
    id: "act-3",
    title: "Manual Review Required: Statement_Bank_Oct.pdf",
    timestamp: "6h ago",
    icon: "manual-review-required",
    badge: { label: "Review", tone: "warning" },
  },
  {
    id: "act-4",
    title: "Document Approved: Batch_Complete_Q2.pdf",
    timestamp: "2d ago",
    icon: "approve",
    badge: { label: "Approved", tone: "success" },
  },
];
