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

// const STATUS_ICON = {
//   success: {
//     icon: <CheckCircle className="w-4 h-4" />,
//   },
//   info: {
//     icon: <Info className="w-4 h-4" />,
//   },
//   warning: {
//     icon: <Clock className="w-4 h-4" />,
//   },
//   neutral: {
//     icon: <CircleDashed className="w-4 h-4" />,
//   },
//   danger: {
//     icon: <XCircle className="w-4 h-4" />,
//   },
// };


// const STATUS_META = {
//   approved: {
//     group: "success",
//     label: "Approved",
//     icon: <CheckCircle className="w-4 h-4" />,
//   },

//   submitted: {
//     group: "success",
//     label: "Pending",
//     icon: <Clock className="w-4 h-4" />,
//   },

//   draft: {
//     group: "warning",
//     label: "Draft",
//     icon: <FileEdit className="w-4 h-4" />,
//   },

//   "not-started": {
//     group: "neutral",
//     label: "New",
//     icon: <CircleDashed className="w-4 h-4" />,
//   },
// };

export function getStatusBadge(status) {
//   const meta = STATUS_META[status];
const meta = ""

  if (!meta) {
    return {
      color: "bg-muted text-muted-foreground border-muted",
      label: status,
      icon: null,
    };
  }

  return {
    color: STATUS_STYLES[meta.group],
    label: meta.label,
    icon: meta.icon,
  };
}
