export type ActivityIcon =
  | "upload"
  | "extract-start"
  | "extract-complete"
  | "manual-review-required"
  | "approve"
  | "reject"
  | "edit";

export type ActivityTone = "neutral" | "success" | "warning";

export type ActivityItem = {
  id: string;
  title: string;
  timestamp: string;
  icon: ActivityIcon;
  badge?: {
    label: string;
    tone: ActivityTone;
  };
};
