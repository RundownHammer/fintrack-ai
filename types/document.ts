export type DocumentStage =
  | "uploaded"
  | "extracting"
  | "ocr-complete"
  | "needs-review"
  | "completed"
  | "rejected";

export type ReviewStatus = "approved" | "rejected" | "manual-review" | "edited" | "pending";

export type PaymentStatus = "unpaid" | "paid" | "overdue";

export type DocumentFileType = "pdf" | "png" | "jpg" | "jpeg" | "unknown";

export type DocumentLineItem = {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unitRate: number;
  amount: number;
};

export type DocumentFieldConfidence = {
  vendorName?: number;
  vendorAddress?: number;
  vendorEmail?: number;
  vendorPhone?: number;
  invoiceNumber?: number;
  issueDate?: number;
  dueDate?: number;
  paymentTerms?: number;
  subtotalAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  category?: number;
  paymentStatus?: number;
  lineItems?: number;
};

export type DocumentExtraction = {
  vendorName: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorPhone: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  category: string;
  paymentStatus: PaymentStatus;
  lineItems: DocumentLineItem[];
  fieldConfidence?: DocumentFieldConfidence;
};

export type DocumentRecord = {
  id: string;
  filename: string;
  fileType: DocumentFileType;
  vendor: string;
  amount: number;
  uploadedAt: string;
  confidenceScore: number;
  issue?: string;
  stage: DocumentStage;
  reviewStatus?: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  file?: File;
  previewUrl?: string;

  // reserved for future OCR / classification / extraction pipeline
  ocrText?: string;
  classification?: string;
  extractionStatus?: string;

  extraction?: DocumentExtraction;
};
