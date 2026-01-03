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

