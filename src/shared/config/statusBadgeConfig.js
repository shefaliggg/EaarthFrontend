import { CheckCircle, CircleDashed, Clock, Info, XCircle } from "lucide-react";
import { convertToPrettyText } from "./utils";

const STATUS_STYLES = {
  success:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  info: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  neutral:
    "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
  danger: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
};

const STATUS_ICONS = {
  success: CheckCircle,
  info: Info,
  warning: Clock,
  neutral: CircleDashed,
  danger: XCircle,
};

const STATUS_META = {
  approved: "success",
  submitted: "success",
  active: "success",
  enabled: "success",
  synced: "success",
  information: "info",

  draft: "warning",
  pending: "warning",

  "not-started": "neutral",
  disabled: "neutral",

  rejected: "danger",
  suspended: "danger",
};

export function getStatusBadge(status, label) {
  // console.log("status", status)
  const group = STATUS_META[status];

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
