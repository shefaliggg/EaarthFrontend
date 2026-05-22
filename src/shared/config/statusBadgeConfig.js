import {
  CheckCircle,
  CircleDashed,
  Clock,
  Info,
  Lock,
  XCircle,
} from "lucide-react";
import { convertToPrettyText } from "./utils";
import { success } from "zod";

const STATUS_STYLES = {
  success:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  info: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  neutral:
    "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
  danger: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  highlight:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  protect:
    "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
};

const STATUS_ICONS = {
  success: CheckCircle,
  info: Info,
  warning: Clock,
  neutral: CircleDashed,
  danger: XCircle,
  highlight: CheckCircle,
  protect: Lock,
};

const STATUS_META = {
  approved: "success",
  success: "success",
  verified: "success",
  submitted: "success",
  active: "success",
  enabled: "success",
  synced: "success",
  completed: "success",
  passed: "success",

  information: "info",

  highlight: "highlight",

  secure: "protect",
  private: "protect",
  locked: "protect",
  restricted: "protect",

  draft: "warning",
  warning: "warning",
  pending: "warning",
  pending_admin_review: "warning",
  "pending-approval": "warning",
  expiring: "warning",
  deleted: "warning",
  processing: "warning",
  "needs_review": "warning",

  "not-started": "neutral",
  inactive: "neutral",
  disabled: "neutral",
  archived: "neutral",
  unverified: "neutral",
  not_scanned: "neutral",
  not_run: "neutral",

  rejected: "danger",
  suspended: "danger",
  revoked: "danger",
  "not-submitted": "danger",
  not_submitted: "danger",
  expired: "danger",
  failed: "danger",
};

export function getStatusBadge(status, label) {
  const group = STATUS_META[status?.toLowerCase()] || "neutral";

  if (!group) {
    return {
      color: "bg-muted text-muted-foreground",
      label: convertToPrettyText(label ?? status),
      Icon: null,
    };
  }

  return {
    color: STATUS_STYLES[group],
    Icon: STATUS_ICONS[group],
    label: convertToPrettyText(label ?? status),
  };
}
