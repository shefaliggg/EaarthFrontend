import { toast } from "sonner";

export const downloadFile = async ({ url, fileName, label = "file" }) => {
  const toastId = toast.loading(`Downloading ${label}...`);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${label} downloaded`, {
      id: toastId,
    });
  } catch (err) {
    console.error("Download failed:", err);

    toast.error(`Downloading ${label} failed`, {
      id: toastId,
    });
  }
};
