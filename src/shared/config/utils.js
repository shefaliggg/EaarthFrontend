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
}








