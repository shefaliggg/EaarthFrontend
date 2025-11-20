import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getUserInitials = (userName, userEmail) => {
  if (userName) {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (userEmail) {
    const emailName = userEmail.split("@")[0];
    if (emailName.length >= 2) {
      return emailName.slice(0, 2).toUpperCase();
    }
    return emailName[0].toUpperCase();
  }
  return "U";
};

export function convertToUrlAndSaveSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
