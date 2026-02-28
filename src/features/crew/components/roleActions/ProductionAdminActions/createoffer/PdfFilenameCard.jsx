import { HardDrive } from "lucide-react";
import { generatePdfFilename } from "../../../../utils/filenameGenerator";

export function PdfFilenameCard({ data }) {
  const filename = generatePdfFilename(data);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-[3px] h-3.5 bg-purple-600 rounded-full" />
        <p className="text-[11px] font-semibold text-purple-900 tracking-wide uppercase">Document Output</p>
      </div>
      <div className="flex items-center gap-2.5 bg-purple-50/60 rounded-lg px-3 py-2 border border-purple-100">
        <HardDrive className="h-4 w-4 text-purple-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-[8px] text-neutral-400 uppercase tracking-wider">PDF Filename (on acceptance)</p>
          <p className="text-[11px] font-mono font-semibold text-purple-800 truncate">{filename}</p>
        </div>
        <div className="ml-auto shrink-0">
          <span className="text-[8px] px-2 py-0.5 rounded bg-purple-100 text-purple-600 font-semibold uppercase tracking-wider">
            Cloud
          </span>
        </div>
      </div>
    </div>
  );
}