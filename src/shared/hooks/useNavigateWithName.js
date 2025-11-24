import { useNavigate } from "react-router-dom";
import { convertTitleToUrl } from "../config/utils";

export function useNavigateWithName() {
  const navigate = useNavigate();

  return function navigateWithName({
    title,
    uniqueCode = null,
    basePath = "",
    storageKey = "appSlug"
  }) {
    const urlSlug = convertTitleToUrl(title)

    if (uniqueCode) {
      sessionStorage.setItem(storageKey, uniqueCode);
    }

    const path = basePath ? `/${basePath}/${urlSlug}` : `/${urlSlug}`;
    navigate(path);
  };
}








