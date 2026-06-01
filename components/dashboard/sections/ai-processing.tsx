"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatInr } from "@/lib/utils/currency";
import {
  AlertTriangle,
  BadgeCheck,
  CloudUpload,
  FileText,
  LoaderCircle,
  Upload,
} from "lucide-react";

type DocumentItem = {
  id: string;
  filename: string;
  vendor: string;
  amount: number;
  uploadedAt: string;
  confidenceScore: number;
  issue?: string;
};

type StageId = "uploaded" | "extracting" | "needs-review" | "completed";

type Stage = {
  id: StageId;
  name: string;
  documents: DocumentItem[];
};

const initialStages: Stage[] = [
  {
    id: "uploaded",
    name: "Uploaded",
    documents: [
      {
        id: "1",
        filename: "AWS_Invoice_Oct.pdf",
        vendor: "Amazon Web Services",
        amount: 45000,
        uploadedAt: "10m ago",
        confidenceScore: 91,
      },
      {
        id: "2",
        filename: "Receipt_Sep_batch.pdf",
        vendor: "Metro Supplies",
        amount: 78000,
        uploadedAt: "35m ago",
        confidenceScore: 66,
        issue: "Blurry scan detected",
      },
      {
        id: "3",
        filename: "PO_Request_001.pdf",
        vendor: "Orbit Office",
        amount: 32000,
        uploadedAt: "1h ago",
        confidenceScore: 96,
      },
    ],
  },
  {
    id: "extracting",
    name: "Extracting",
    documents: [
      {
        id: "4",
        filename: "Expense_Report_Q3.pdf",
        vendor: "Ops Team",
        amount: 125000,
        uploadedAt: "2h ago",
        confidenceScore: 83,
      },
      {
        id: "5",
        filename: "Invoice_2026_001.pdf",
        vendor: "Northwind Labs",
        amount: 89000,
        uploadedAt: "3h ago",
        confidenceScore: 88,
      },
    ],
  },
  {
    id: "needs-review",
    name: "Needs Review",
    documents: [
      {
        id: "6",
        filename: "Statement_Bank_Oct.pdf",
        vendor: "State Bank",
        amount: 167000,
        uploadedAt: "6h ago",
        confidenceScore: 62,
        issue: "Vendor mismatch found",
      },
      {
        id: "7",
        filename: "Receipt_unclear.pdf",
        vendor: "City Travels",
        amount: 95000,
        uploadedAt: "8h ago",
        confidenceScore: 58,
        issue: "Blurry scan detected",
      },
      {
        id: "8",
        filename: "Invoice_corrupted.pdf",
        vendor: "DataStream",
        amount: 54000,
        uploadedAt: "1d ago",
        confidenceScore: 48,
        issue: "Missing totals",
      },
    ],
  },
  {
    id: "completed",
    name: "Completed",
    documents: [
      {
        id: "9",
        filename: "Batch_Complete_Q2.pdf",
        vendor: "Batch Imports",
        amount: 245000,
        uploadedAt: "2d ago",
        confidenceScore: 98,
      },
      {
        id: "10",
        filename: "Documents_Verified.pdf",
        vendor: "Finance Ops",
        amount: 112000,
        uploadedAt: "3d ago",
        confidenceScore: 97,
      },
    ],
  },
];

const statusConfig: Record<StageId, { label: string; icon: typeof Upload; className: string }> = {
  uploaded: {
    label: "Uploaded",
    icon: Upload,
    className: "text-muted-foreground border-border/60",
  },
  extracting: {
    label: "Extracting",
    icon: LoaderCircle,
    className: "text-sky-300 border-sky-500/30",
  },
  "needs-review": {
    label: "Needs Review",
    icon: AlertTriangle,
    className: "text-yellow-300 border-yellow-500/40",
  },
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    className: "text-emerald-400 border-emerald-500/40",
  },
};

const getConfidenceMeta = (score: number, issue?: string) => {
  if (score >= 95) {
    return {
      label: "Trusted extraction",
      textClass: "text-emerald-400",
      indicatorClass: "[&_[data-slot=progress-indicator]]:bg-emerald-500",
      note: undefined,
    };
  }
  if (score >= 75) {
    return {
      label: "Needs light review",
      textClass: "text-yellow-300",
      indicatorClass: "[&_[data-slot=progress-indicator]]:bg-yellow-500",
      note: "Quick validation recommended",
    };
  }
  return {
    label: "Likely extraction issues",
    textClass: "text-red-400",
    indicatorClass: "[&_[data-slot=progress-indicator]]:bg-red-500",
    note: issue || "Blurry scan detected",
  };
};

const getFieldBadge = (score: number) => {
  if (score >= 95) {
    return null;
  }
  if (score >= 75) {
    return { label: "Verify", className: "text-yellow-300 border-yellow-500/40" };
  }
  return { label: "Low confidence", className: "text-red-400 border-red-500/40" };
};

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Upload;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-foreground mt-1">{value}</p>
        </div>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 text-xs text-muted-foreground">
      <FileText className="w-4 h-4 mb-2" />
      <span>{message}</span>
    </div>
  );
}

function DocumentCard({
  document,
  stageId,
  onSelect,
}: {
  document: DocumentItem;
  stageId: StageId;
  onSelect: (doc: DocumentItem) => void;
}) {
  const status = statusConfig[stageId];
  const confidence = getConfidenceMeta(document.confidenceScore, document.issue);
  const StatusIcon = status.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(document)}
      className="w-full text-left bg-background border border-border/60 rounded-lg p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{document.filename}</p>
          <p className="text-xs text-muted-foreground truncate">{document.vendor}</p>
        </div>
        <Badge variant="outline" className={cn("gap-1", status.className)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </Badge>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{formatInr(document.amount)}</span>
        <span>{document.uploadedAt}</span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">AI Confidence</span>
          <span className={cn("font-medium", confidence.textClass)}>
            {document.confidenceScore}%
          </span>
        </div>
        <Progress value={document.confidenceScore} className={cn("mt-1 h-1.5", confidence.indicatorClass)} />
        <div className="mt-1 text-[11px]">
          <p className={cn("font-medium", confidence.textClass)}>{confidence.label}</p>
          {confidence.note && <p className="text-muted-foreground">{confidence.note}</p>}
        </div>
      </div>
    </button>
  );
}

export function PipelineSection() {
  const [stages] = useState(initialStages);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  const stageMap = useMemo(() => {
    return stages.reduce<Record<string, Stage>>((acc, stage) => {
      acc[stage.id] = stage;
      return acc;
    }, {});
  }, [stages]);

  const summaryItems = [
    { label: "Uploaded Today", value: stageMap.uploaded?.documents.length || 0, icon: Upload },
    { label: "Processing", value: stageMap.extracting?.documents.length || 0, icon: LoaderCircle },
    { label: "Needs Review", value: stageMap["needs-review"]?.documents.length || 0, icon: AlertTriangle },
    { label: "Completed", value: stageMap.completed?.documents.length || 0, icon: BadgeCheck },
  ];

  const selectedConfidenceBadge = selectedDocument
    ? getFieldBadge(selectedDocument.confidenceScore)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Monitor and review automated document extraction.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <CloudUpload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryItems.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </div>

      {/* Pipeline board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-card border border-border/60 rounded-xl p-4 min-h-120">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{stage.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {stage.documents.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {stage.documents.length === 0 ? (
                <EmptyState
                  message={
                    stage.id === "needs-review"
                      ? "No documents pending review."
                      : stage.id === "extracting"
                      ? "AI extraction pipeline is operating normally."
                      : stage.id === "completed"
                      ? "No completed documents yet."
                      : "No documents uploaded yet."
                  }
                />
              ) : (
                stage.documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    stageId={stage.id}
                    onSelect={setSelectedDocument}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={Boolean(selectedDocument)} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <SheetContent side="right" className="sm:max-w-4xl w-full p-0">
          <SheetHeader className="border-b border-border/60">
            <SheetTitle>Extraction Review</SheetTitle>
            <SheetDescription>Validate and approve structured accounting data.</SheetDescription>
          </SheetHeader>

          {selectedDocument && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
                <div className="space-y-3">
                  <div className="rounded-lg border border-border/60 bg-secondary/30 p-4 h-90 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <FileText className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm">Invoice preview</p>
                      <p className="text-xs mt-1">{selectedDocument.filename}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Uploaded {selectedDocument.uploadedAt} • {selectedDocument.vendor}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vendorName">Vendor Name</Label>
                      {selectedConfidenceBadge && (
                        <Badge variant="outline" className={selectedConfidenceBadge.className}>
                          {selectedConfidenceBadge.label}
                        </Badge>
                      )}
                    </div>
                    <Input
                      id="vendorName"
                      defaultValue={selectedDocument.vendor}
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input id="invoiceNumber" defaultValue="INV-2026-1042" className="bg-secondary border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input id="invoiceDate" type="date" defaultValue="2026-05-22" className="bg-secondary border-border" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="gst">GST / Tax</Label>
                      {selectedConfidenceBadge && (
                        <Badge variant="outline" className={selectedConfidenceBadge.className}>
                          {selectedConfidenceBadge.label}
                        </Badge>
                      )}
                    </div>
                    <Input id="gst" defaultValue="₹8,100" className="bg-secondary border-border" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      {selectedConfidenceBadge && (
                        <Badge variant="outline" className={selectedConfidenceBadge.className}>
                          {selectedConfidenceBadge.label}
                        </Badge>
                      )}
                    </div>
                    <Input
                      id="totalAmount"
                      defaultValue={formatInr(selectedDocument.amount)}
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category">Category</Label>
                      {selectedConfidenceBadge && (
                        <Badge variant="outline" className={selectedConfidenceBadge.className}>
                          {selectedConfidenceBadge.label}
                        </Badge>
                      )}
                    </div>
                    <Select defaultValue="software">
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select defaultValue="unpaid">
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Line Items</Label>
                      {selectedConfidenceBadge && (
                        <Badge variant="outline" className={selectedConfidenceBadge.className}>
                          {selectedConfidenceBadge.label}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {[
                        { description: "Cloud services", qty: "1", amount: "₹32,000" },
                        { description: "Support plan", qty: "1", amount: "₹13,000" },
                      ].map((item) => (
                        <div key={item.description} className="grid grid-cols-[1fr_70px_110px] gap-2">
                          <Input defaultValue={item.description} className="bg-secondary border-border" />
                          <Input defaultValue={item.qty} className="bg-secondary border-border" />
                          <Input defaultValue={item.amount} className="bg-secondary border-border" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="border-t border-border/60">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
              <Button variant="outline">Edit Fields</Button>
              <Button variant="secondary">Send To Manual Review</Button>
              <Button variant="destructive">Reject</Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Approve</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
