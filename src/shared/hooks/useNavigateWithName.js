import { useNavigate } from "react-router-dom";

export function useNavigateWithName() {
  const navigate = useNavigate();

  return function navigateWithName({
    title,
    uniqueCode = null,
    basePath = "",
    storageKey = "appSlug"
  }) {
    const urlSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (uniqueCode) {
      sessionStorage.setItem(storageKey, uniqueCode);
    }

    const path = basePath ? `/${basePath}/${urlSlug}` : `/${urlSlug}`;
    navigate(path);
  };
}
