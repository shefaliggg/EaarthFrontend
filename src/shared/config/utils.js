import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { store } from "../../app/store";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getCurrentUserId = () => {
  const state = store.getState();
  return state.auth?.user?._id || state.user?.currentUser?._id || null;
};

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
    .toLowerCase()
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

export function getAvatarFallback(name) {
  if (!name || typeof name !== "string") {
    return "??";
  }

  const cleaned = name.trim().replace(/\s+/g, " ");

  if (!cleaned) return "??";

  const parts = cleaned.split(" ");

  if (parts.length === 1) {
    // Single name → first 2 letters
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Multiple words → first letter of first two words
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
