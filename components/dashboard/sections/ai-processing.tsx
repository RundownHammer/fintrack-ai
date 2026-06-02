"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatInr } from "@/lib/utils/currency";
import { documents as initialDocuments } from "@/lib/mock/documents";
import { activities as initialActivities } from "@/lib/mock/activities";
import type {
  DocumentExtraction,
  DocumentFileType,
  DocumentLineItem,
  DocumentRecord,
  DocumentStage,
  ReviewStatus,
} from "@/types/document";
import type { ActivityItem, ActivityTone } from "@/types/activity";
import {
  AlertTriangle,
  BadgeCheck,
  CloudUpload,
  FileText,
  FileWarning,
  LoaderCircle,
  Upload,
  CheckCircle2,
  PencilLine,
  XCircle,
  ShieldCheck,
  Clock,
  X,
} from "lucide-react";

const stageConfig: Array<{
  id: "uploaded" | "extracting" | "needs-review" | "completed";
  name: string;
  empty: string;
  statuses: DocumentStage[];
}> = [
  {
    id: "uploaded",
    name: "Uploaded",
    empty: "No documents uploaded yet.",
    statuses: ["uploaded"],
  },
  {
    id: "extracting",
    name: "Extracting",
    empty: "AI extraction pipeline is operating normally.",
    statuses: ["extracting", "ocr-complete"],
  },
  {
    id: "needs-review",
    name: "Needs Review",
    empty: "No documents pending review.",
    statuses: ["needs-review"],
  },
  {
    id: "completed",
    name: "Completed",
    empty: "No completed documents yet.",
    statuses: ["completed", "rejected"],
  },
];

const statusConfig: Record<DocumentStage, { label: string; icon: typeof Upload; className: string }> = {
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
  "ocr-complete": {
    label: "OCR Complete",
    icon: BadgeCheck,
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
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "text-red-400 border-red-500/40",
  },
};

const reviewStatusConfig: Partial<Record<ReviewStatus, { label: string; icon: typeof AlertTriangle; className: string }>> = {
  "manual-review": {
    label: "Manual Review",
    icon: FileWarning,
    className: "text-yellow-300 border-yellow-500/40",
  },
  edited: {
    label: "Edited",
    icon: PencilLine,
    className: "text-sky-300 border-sky-500/40",
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

const getFieldBadge = (score?: number) => {
  if (score === undefined) {
    return null;
  }
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
  onSelect,
}: {
  document: DocumentRecord;
  onSelect: (doc: DocumentRecord) => void;
}) {
  const status = statusConfig[document.stage];
  const confidence = getConfidenceMeta(document.confidenceScore, document.issue);
  const StatusIcon = status.icon;
  const reviewBadge = document.reviewStatus ? reviewStatusConfig[document.reviewStatus] : undefined;
  const ReviewIcon = reviewBadge?.icon;
  const shouldShowConfidence =
    document.stage === "completed" && document.reviewStatus !== "edited" && document.reviewStatus !== "manual-review";

  const extractingSteps = [
    { label: "OCR Processing", value: 25 },
    { label: "Extracting Fields", value: 55 },
    { label: "Matching Vendor", value: 75 },
    { label: "Validating Totals", value: 90 },
  ];
  const extractingStepIndex = Number(document.id.replace(/\D/g, "")) % extractingSteps.length;
  const extractingStep = extractingSteps[Number.isFinite(extractingStepIndex) ? extractingStepIndex : 1];
  const effectiveExtractingStep =
    document.stage === "ocr-complete" ? { label: "OCR Complete", value: 100 } : extractingStep;

  return (
    <button
      type="button"
      onClick={() => onSelect(document)}
      className="w-full text-left bg-background border border-border/60 rounded-lg p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{document.filename}</p>
          {document.vendor ? <p className="text-xs text-muted-foreground truncate">{document.vendor}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="outline" className={cn("gap-1", status.className)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
          {document.stage === "completed" && (document.reviewStatus === "edited" || document.reviewStatus === "manual-review") && (
            <Badge variant="outline" className="gap-1 text-sky-300 border-sky-500/40">
              <ShieldCheck className="w-3 h-3" />
              Manually Reviewed
            </Badge>
          )}
          {document.stage !== "needs-review" && reviewBadge && ReviewIcon && (
            <Badge variant="outline" className={cn("gap-1", reviewBadge.className)}>
              <ReviewIcon className="w-3 h-3" />
              {reviewBadge.label}
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{Number.isFinite(document.amount) ? formatInr(document.amount) : "—"}</span>
        <span>{document.uploadedAt}</span>
      </div>

      {document.stage === "needs-review" && document.issue && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-border/60 bg-secondary/30 p-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-yellow-300 mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium text-foreground">Extraction Issue</p>
            <p className="text-muted-foreground truncate">{document.issue}</p>
          </div>
        </div>
      )}

      {(document.stage === "extracting" || document.stage === "ocr-complete") && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Extraction Progress</span>
            <span className="font-medium text-foreground">{effectiveExtractingStep.value}%</span>
          </div>
          <Progress value={effectiveExtractingStep.value} className="mt-1 h-1.5 **:data-[slot=progress-indicator]:bg-sky-500" />
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">{effectiveExtractingStep.label}</span>
            <span className="text-muted-foreground inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Processing
            </span>
          </div>
        </div>
      )}

      {shouldShowConfidence && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className={cn("font-medium", confidence.textClass)}>{document.confidenceScore}%</span>
          </div>
          <Progress value={document.confidenceScore} className={cn("mt-1 h-1.5", confidence.indicatorClass)} />
          <div className="mt-1 text-[11px]">
            <p className={cn("font-medium", confidence.textClass)}>{confidence.label}</p>
          </div>
        </div>
      )}

      {document.stage === "completed" && (document.reviewStatus === "edited" || document.reviewStatus === "manual-review") && (
        <div className="mt-2 text-[11px] text-muted-foreground">
          Reviewed by {document.reviewedBy ?? "User"}
          {document.reviewedAt ? ` • ${document.reviewedAt}` : ""}
        </div>
      )}
    </button>
  );
}

export function PipelineSection() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [draftExtraction, setDraftExtraction] = useState<DocumentExtraction | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const selectedDocument = useMemo(
    () => documents.find((doc) => doc.id === selectedDocumentId) ?? null,
    [documents, selectedDocumentId]
  );

  useEffect(() => {
    const canShowExtraction = selectedDocument?.stage === "needs-review" || selectedDocument?.stage === "completed";
    if (canShowExtraction && selectedDocument?.extraction) {
      setDraftExtraction({
        ...selectedDocument.extraction,
        lineItems: selectedDocument.extraction.lineItems.map((item) => ({ ...item })),
      });
    } else {
      setDraftExtraction(null);
    }
  }, [selectedDocument]);

  useEffect(() => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
    if (!selectedDocument?.file || selectedDocument.fileType !== "pdf") return;

    const url = URL.createObjectURL(selectedDocument.file);
    setPdfPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocumentId]);

  const stageDocuments = useMemo(() => {
    return stageConfig.map((stage) => ({
      ...stage,
      documents: documents.filter((doc) => stage.statuses.includes(doc.stage)),
    }));
  }, [documents]);

  const summaryItems = useMemo(() => {
    const counts = stageDocuments.reduce<Record<string, number>>((acc, stage) => {
      acc[stage.id] = stage.documents.length;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: "Uploaded Today", value: counts.uploaded ?? 0, icon: Upload },
      { label: "Processing", value: counts.extracting ?? 0, icon: LoaderCircle },
      { label: "Needs Review", value: counts["needs-review"] ?? 0, icon: AlertTriangle },
      { label: "Completed", value: counts.completed ?? 0, icon: BadgeCheck },
    ];
  }, [stageDocuments]);

  const fieldConfidence = selectedDocument?.extraction?.fieldConfidence ?? {};
  const vendorBadge = getFieldBadge(fieldConfidence.vendorName);
  const taxBadge = getFieldBadge(fieldConfidence.taxAmount);
  const totalBadge = getFieldBadge(fieldConfidence.totalAmount);
  const categoryBadge = getFieldBadge(fieldConfidence.category);
  const lineItemsBadge = getFieldBadge(fieldConfidence.lineItems);

  const addActivity = (entry: Omit<ActivityItem, "id" | "timestamp"> & { timestamp?: string }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setActivities((prev) => [
      {
        id,
        timestamp: entry.timestamp ?? "Just now",
        ...entry,
      },
      ...prev,
    ]);
  };

  const updateDocument = (id: string, updater: (doc: DocumentRecord) => DocumentRecord) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? updater(doc) : doc)));
  };

  const getFileType = (file: File): DocumentFileType => {
    const name = file.name.toLowerCase();
    if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
    if (file.type === "image/png" || name.endsWith(".png")) return "png";
    if (file.type === "image/jpeg" || name.endsWith(".jpeg")) return "jpeg";
    if (file.type === "image/jpg" || name.endsWith(".jpg")) return "jpg";
    if (name.endsWith(".jpg")) return "jpg";
    if (name.endsWith(".jpeg")) return "jpeg";
    return "unknown";
  };

  const buildNewDocument = (file: File): DocumentRecord => {
    const now = Date.now();
    const fileType = getFileType(file);
    const isImage = fileType === "png" || fileType === "jpg" || fileType === "jpeg";

    return {
      id: `${now}-${Math.random().toString(16).slice(2)}`,
      filename: file.name,
      fileType,
      vendor: "",
      amount: Number.NaN,
      uploadedAt: "Just now",
      confidenceScore: 0,
      stage: "uploaded",
      file,
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
    };
  };

  const enqueueFiles = (files: File[]) => {
    const next = files.filter((file) => {
      const name = file.name.toLowerCase();
      const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
      const isPng = file.type === "image/png" || name.endsWith(".png");
      const isJpeg = file.type === "image/jpeg" || name.endsWith(".jpeg") || name.endsWith(".jpg");
      return isPdf || isPng || isJpeg;
    });
    if (next.length === 0) return;
    setUploadQueue((prev) => [...prev, ...next]);
  };

  const formatFileSize = (bytes: number) => {
    if (!Number.isFinite(bytes)) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const removeQueuedFile = (key: string) => {
    setUploadQueue((prev) => prev.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== key));
  };

  const startMockUpload = async () => {
    if (uploadQueue.length === 0) return;
    setUploading(true);

    const createdDocs = uploadQueue.map((file) => buildNewDocument(file));
    createdDocs.forEach((doc, index) => {
      window.setTimeout(() => {
        setDocuments((prev) => [doc, ...prev]);
        addActivity({ title: `Document Uploaded: ${doc.filename}`, icon: "upload" });

        window.setTimeout(() => {
          setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, stage: "extracting" } : d)));
          addActivity({ title: `Extraction Started: ${doc.filename}`, icon: "extract-start" });
        }, 3000);

        window.setTimeout(() => {
          setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, stage: "ocr-complete" } : d)));
        }, 7000);

        window.setTimeout(() => {
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? {
                    ...d,
                    stage: "needs-review",
                    reviewStatus: "manual-review",
                    issue:
                      d.fileType === "pdf"
                        ? "Missing totals detected"
                        : "Low image quality detected",
                  }
                : d
            )
          );
          addActivity({ title: `Extraction Completed: ${doc.filename}`, icon: "extract-complete" });
        }, 8000);
      }, index * 250);
    });

    window.setTimeout(() => {
      setUploading(false);
      setUploadQueue([]);
      setUploadDialogOpen(false);
    }, 900 + createdDocs.length * 250);
  };

  const handleApprove = () => {
    if (!selectedDocument) return;
    updateDocument(selectedDocument.id, (doc) => ({
      ...doc,
      stage: "completed",
      reviewStatus: doc.stage === "needs-review" ? "edited" : "approved",
      reviewedBy: doc.stage === "needs-review" ? "You" : doc.reviewedBy,
      reviewedAt: doc.stage === "needs-review" ? "Just now" : doc.reviewedAt,
    }));
    addActivity({ title: `Document Approved: ${selectedDocument.filename}`, icon: "approve", badge: { label: "Approved", tone: "success" } });
    setSelectedDocumentId(null);
  };

  const handleReject = () => {
    if (!selectedDocument) return;
    updateDocument(selectedDocument.id, (doc) => ({
      ...doc,
      stage: "rejected",
      reviewStatus: undefined,
    }));
    addActivity({ title: `Document Rejected: ${selectedDocument.filename}`, icon: "reject", badge: { label: "Rejected", tone: "warning" } });
    setSelectedDocumentId(null);
  };

  const handleEditSave = () => {
    if (!selectedDocument || !draftExtraction) return;
    updateDocument(selectedDocument.id, (doc) => ({
      ...doc,
      vendor: draftExtraction.vendorName,
      amount: draftExtraction.totalAmount,
      extraction: draftExtraction,
      reviewStatus: "edited",
      reviewedBy: doc.reviewedBy ?? "You",
      reviewedAt: doc.reviewedAt ?? "Just now",
    }));
    // keep activity feed concise per requirements (no edit event)
  };

  const updateDraftField = (field: keyof DocumentExtraction, value: DocumentExtraction[keyof DocumentExtraction]) => {
    setDraftExtraction((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateLineItem = (index: number, field: keyof DocumentLineItem, value: string) => {
    setDraftExtraction((prev) => {
      if (!prev) return prev;
      const nextItems = prev.lineItems.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "amount" || field === "unitRate"
                  ? Number(value) || 0
                  : value,
            }
          : item
      );
      return { ...prev, lineItems: nextItems };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Monitor and review automated document extraction.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setUploadDialogOpen(true)}>
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
        {stageDocuments.map((stage) => (
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
                <EmptyState message={stage.empty} />
              ) : (
                stage.documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onSelect={(doc) => setSelectedDocumentId(doc.id)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">Activity Feed</h3>
            <p className="text-sm text-muted-foreground mt-0.5">AI processing and review history</p>
          </div>
        </div>
        <div className="divide-y divide-border/60">
          {activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={(open) => !uploading && setUploadDialogOpen(open)}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>Drag and drop files or select files to add them to the Uploaded column.</DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              "rounded-lg border border-dashed border-border/60 bg-secondary/30 p-8 text-center min-h-56 flex flex-col items-center justify-center",
              uploading && "opacity-70 pointer-events-none"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const files = Array.from(event.dataTransfer.files ?? []);
              enqueueFiles(files);
            }}
          >
            <div className="mx-auto w-10 h-10 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground">
              <CloudUpload className="w-5 h-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">Drag & drop files here</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, PNG, JPG, JPEG</p>

            <div className="mt-4 flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                className="relative overflow-hidden"
                disabled={uploading}
              >
                Select Files
                <input
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    enqueueFiles(files);
                    event.target.value = "";
                  }}
                />
              </Button>
            </div>
          </div>

          {uploadQueue.length > 0 && (
            <div className="mt-2 rounded-lg border border-border/60 bg-background p-3">
              <p className="text-xs font-medium text-foreground">Ready to upload</p>
              <div className="mt-2 space-y-2 max-h-44 overflow-y-auto pr-1">
                {uploadQueue.map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate">{file.name}</p>
                      <p className="text-muted-foreground truncate">
                        {file.type ? file.type : "Unknown type"} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                      disabled={uploading}
                      onClick={() => removeQueuedFile(`${file.name}-${file.size}-${file.lastModified}`)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 sm:gap-3">
            <Button variant="secondary" disabled={uploading} onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={uploading || uploadQueue.length === 0}
              onClick={startMockUpload}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={Boolean(selectedDocument)} onOpenChange={(open) => !open && setSelectedDocumentId(null)}>
        <SheetContent side="right" className="sm:max-w-4xl w-full p-0">
          <SheetHeader className="border-b border-border/60">
            <SheetTitle>Extraction Review</SheetTitle>
            <SheetDescription>Validate and approve structured accounting data.</SheetDescription>
          </SheetHeader>

          {selectedDocument && (
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                <div className="space-y-3">
                  <Card className="border-border/60 bg-secondary/30">
                    <CardContent className="p-3 h-[70vh] lg:h-[calc(100vh-220px)] overflow-hidden">
                      <div className="w-full h-full overflow-y-auto overflow-x-hidden rounded-md bg-background/30">
                        {selectedDocument.fileType !== "pdf" && selectedDocument.previewUrl ? (
                          <img
                            alt={selectedDocument.filename}
                            src={selectedDocument.previewUrl}
                            className="w-full h-auto object-contain"
                          />
                        ) : selectedDocument.fileType === "pdf" && pdfPreviewUrl ? (
                          <iframe title={selectedDocument.filename} src={pdfPreviewUrl} className="w-full h-full" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-center text-muted-foreground p-6">
                            <div>
                              <FileText className="w-6 h-6 mx-auto mb-2" />
                              <p className="text-sm">Document preview</p>
                              <p className="text-xs mt-1">{selectedDocument.filename}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="text-xs text-muted-foreground">
                    Uploaded {selectedDocument.uploadedAt}
                    {selectedDocument.vendor ? ` • ${selectedDocument.vendor}` : ""}
                  </div>
                  {selectedDocument.stage === "needs-review" && selectedDocument.issue && (
                    <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-300 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">Extraction Issue</p>
                          <p className="text-muted-foreground mt-0.5">{selectedDocument.issue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {draftExtraction ? (
                    <Accordion type="multiple" defaultValue={["vendor", "invoice", "items", "summary"]} className="w-full">
                    <AccordionItem value="vendor">
                      <AccordionTrigger>Vendor Information</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendorName">Vendor Name</Label>
                            {vendorBadge && (
                              <Badge variant="outline" className={vendorBadge.className}>
                                {vendorBadge.label}
                              </Badge>
                            )}
                          </div>
                          <Input
                            id="vendorName"
                            value={draftExtraction.vendorName}
                            onChange={(event) => updateDraftField("vendorName", event.target.value)}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vendorAddress">Vendor Address</Label>
                          <Input
                            id="vendorAddress"
                            value={draftExtraction.vendorAddress}
                            onChange={(event) => updateDraftField("vendorAddress", event.target.value)}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="vendorEmail">Vendor Email</Label>
                            <Input
                              id="vendorEmail"
                              value={draftExtraction.vendorEmail}
                              onChange={(event) => updateDraftField("vendorEmail", event.target.value)}
                              className="bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vendorPhone">Vendor Phone</Label>
                            <Input
                              id="vendorPhone"
                              value={draftExtraction.vendorPhone}
                              onChange={(event) => updateDraftField("vendorPhone", event.target.value)}
                              className="bg-secondary border-border"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="invoice">
                      <AccordionTrigger>Invoice Details</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="invoiceNumber">Invoice Number</Label>
                          <Input
                            id="invoiceNumber"
                            value={draftExtraction.invoiceNumber}
                            onChange={(event) => updateDraftField("invoiceNumber", event.target.value)}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="issueDate">Issue Date</Label>
                            <Input
                              id="issueDate"
                              type="date"
                              value={draftExtraction.issueDate}
                              onChange={(event) => updateDraftField("issueDate", event.target.value)}
                              className="bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={draftExtraction.dueDate}
                              onChange={(event) => updateDraftField("dueDate", event.target.value)}
                              className="bg-secondary border-border"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="paymentTerms">Payment Terms</Label>
                            <Input
                              id="paymentTerms"
                              value={draftExtraction.paymentTerms}
                              onChange={(event) => updateDraftField("paymentTerms", event.target.value)}
                              className="bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paymentStatus">Payment Status</Label>
                            <Select value={draftExtraction.paymentStatus} onValueChange={(value) => updateDraftField("paymentStatus", value)}>
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
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="category">Category</Label>
                            {categoryBadge && (
                              <Badge variant="outline" className={categoryBadge.className}>
                                {categoryBadge.label}
                              </Badge>
                            )}
                          </div>
                          <Select value={draftExtraction.category} onValueChange={(value) => updateDraftField("category", value)}>
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
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="items">
                      <AccordionTrigger>Line Items</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Edit extracted line items.</p>
                          {lineItemsBadge && (
                            <Badge variant="outline" className={lineItemsBadge.className}>
                              {lineItemsBadge.label}
                            </Badge>
                          )}
                        </div>
                        <div className="rounded-lg border border-border/60 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-secondary/30">
                                <TableHead className="w-[160px]">Item Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[90px] text-right">Qty</TableHead>
                                <TableHead className="w-[120px] text-right">Unit Rate</TableHead>
                                <TableHead className="w-[120px] text-right">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {draftExtraction.lineItems.map((item, index) => (
                                <TableRow key={item.id}>
                                  <TableCell className="align-top">
                                    <Input
                                      value={item.itemName}
                                      onChange={(event) => updateLineItem(index, "itemName", event.target.value)}
                                      className="bg-secondary border-border"
                                    />
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <Input
                                      value={item.description}
                                      onChange={(event) => updateLineItem(index, "description", event.target.value)}
                                      className="bg-secondary border-border"
                                    />
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <Input
                                      value={item.quantity}
                                      onChange={(event) => updateLineItem(index, "quantity", event.target.value)}
                                      className="bg-secondary border-border text-right tabular-nums"
                                    />
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <Input
                                      value={item.unitRate}
                                      onChange={(event) => updateLineItem(index, "unitRate", event.target.value)}
                                      className="bg-secondary border-border text-right tabular-nums"
                                    />
                                  </TableCell>
                                  <TableCell className="align-top">
                                    <Input
                                      value={item.amount}
                                      onChange={(event) => updateLineItem(index, "amount", event.target.value)}
                                      className="bg-secondary border-border text-right tabular-nums"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="summary">
                      <AccordionTrigger>Financial Summary</AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="subtotalAmount">Subtotal</Label>
                            <Input
                              id="subtotalAmount"
                              value={draftExtraction.subtotalAmount}
                              onChange={(event) => updateDraftField("subtotalAmount", Number(event.target.value) || 0)}
                              className="bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="gst">Tax</Label>
                              {taxBadge && (
                                <Badge variant="outline" className={taxBadge.className}>
                                  {taxBadge.label}
                                </Badge>
                              )}
                            </div>
                            <Input
                              id="gst"
                              value={draftExtraction.taxAmount}
                              onChange={(event) => updateDraftField("taxAmount", Number(event.target.value) || 0)}
                              className="bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="totalAmount">Total</Label>
                              {totalBadge && (
                                <Badge variant="outline" className={totalBadge.className}>
                                  {totalBadge.label}
                                </Badge>
                              )}
                            </div>
                            <Input
                              id="totalAmount"
                              value={draftExtraction.totalAmount}
                              onChange={(event) => updateDraftField("totalAmount", Number(event.target.value) || 0)}
                              className="bg-secondary border-border"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  ) : (
                    <div className="rounded-lg border border-border/60 bg-secondary/30 p-4 text-sm">
                      <p className="font-medium text-foreground">Extraction pending</p>
                      <p className="text-muted-foreground mt-1">
                        This document is uploaded and queued for processing. Extraction details will appear here once available.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="border-t border-border/60">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
              <Button variant="outline" onClick={handleEditSave} disabled={!draftExtraction}>
                Save Changes
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleApprove}>
                Approve
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  const iconMap: Record<ActivityItem["icon"], typeof Upload> = {
    upload: Upload,
    "extract-start": LoaderCircle,
    "extract-complete": FileText,
    "manual-review-required": FileWarning,
    approve: CheckCircle2,
    reject: XCircle,
    edit: PencilLine,
  };

  const badgeToneClass: Record<ActivityTone, string> = {
    neutral: "text-muted-foreground border-border/60",
    success: "text-emerald-400 border-emerald-500/40",
    warning: "text-yellow-300 border-yellow-500/40",
  };

  const Icon = iconMap[activity.icon];

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{activity.title}</p>
          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
        </div>
      </div>
      {activity.badge && (
        <Badge variant="outline" className={cn("text-xs", badgeToneClass[activity.badge.tone])}>
          {activity.badge.label}
        </Badge>
      )}
    </div>
  );
}
