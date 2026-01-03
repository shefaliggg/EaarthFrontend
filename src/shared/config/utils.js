import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const convertTitleToUrl = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export function prettifySegment(seg) {
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const convertToPrettyText = (text) => {
  if (!text) return "";

  return text
    .toString() // ensure it's a string
    .trim() // remove leading/trailing spaces
    .replace(/[-_]+/g, " ") // replace dashes/underscores with space
    .replace(/\s+/g, " ") // collapse multiple spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word
};

export const getFullName = (user) => {
  if (!user) return "";
  return [user.legalFirstName, user.legalLastName].filter(Boolean).join(" ");
};

export function capitalizeFirstLetter(text = "", mode = "first") {
  if (!text) return "";

  if (mode === "all") {
    return text
      .split(" ")
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
      .join(" ");
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getStatusBadge(status) {
  const map = {
    accepted:
      "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    synced:
      "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    approved:
      "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",

    active:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    live: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",

    pending:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    pending_verification:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    syncing:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",

    ended:
      "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
    deactivated:
      "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",

    inactive: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    rejected: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    suspended:
      "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };

  return map[status] || "bg-muted text-muted-foreground";
}
