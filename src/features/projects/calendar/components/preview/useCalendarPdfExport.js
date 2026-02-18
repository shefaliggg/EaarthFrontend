import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export async function exportCalendarPdf({
  ref,
  fileName = "calendar.pdf",
  orientation = "landscape",
}) {
  if (!ref?.current) return;

  try {
    toast.loading("Generating PDF...");

    const dataUrl = await toPng(ref.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4",
    });

    const width = orientation === "landscape" ? 297 : 210;
    const height = orientation === "landscape" ? 210 : 297;

    pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
    pdf.save(fileName);

    toast.success("PDF downloaded");
  } catch (err) {
    console.error(err);
    toast.error("Failed to generate PDF");
  }
}
