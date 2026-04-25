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

  const str = text.toString().trim();

  // split name and extension
  const lastDotIndex = str.lastIndexOf(".");

  let namePart = str;
  let extension = "";

  if (lastDotIndex !== -1) {
    namePart = str.slice(0, lastDotIndex);
    extension = str.slice(lastDotIndex).toLowerCase(); // keep extension lowercase
  }

  const formattedName = namePart
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return formattedName + extension;
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

export function formatDate(date) {
  return new Date(date)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toLowerCase();
}

export const formatFileSize = (bytes) => {
  if (!bytes) return null;

  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const getSafeFieldData = (val, fallback) => val ?? fallback;
