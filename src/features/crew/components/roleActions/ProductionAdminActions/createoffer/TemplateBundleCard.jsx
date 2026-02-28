import { FileText, Package } from "lucide-react";
import { getMatchedBundle } from "../../../../utils/bundleMatcher";

export function TemplateBundleCard({ data }) {
  const bundle = getMatchedBundle(data);
  const defaultForms = bundle.forms.filter((f) => f.isDefault);
  const optionalForms = bundle.forms.filter((f) => !f.isDefault);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-[3px] h-3.5 bg-purple-600 rounded-full" />
          <p className="text-[11px] font-semibold text-purple-900 tracking-wide uppercase">Attached Template Bundle</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full border border-purple-300 text-[8px] font-semibold text-purple-600 uppercase tracking-wider">
          {bundle.tag}
        </span>
      </div>

      <div className="border border-purple-100 rounded-xl">
        <div className="flex items-center justify-between px-3 py-2 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <Package className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-[11px] font-semibold text-neutral-800">{bundle.bundleName}</span>
          </div>
          <span className="text-[9px] text-neutral-400">{bundle.forms.length} forms</span>
        </div>

        <div className="px-3 py-2">
          <p className="text-[8px] text-neutral-400 uppercase tracking-wider font-semibold mb-1.5">Default Forms</p>
          <div className="flex flex-wrap gap-1.5">
            {defaultForms.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 bg-purple-50/60 rounded-lg border border-purple-100">
                <FileText className="h-3 w-3 text-purple-500" />
                <span className="text-[9px] font-medium text-neutral-700 uppercase tracking-wide">{f.name}</span>
              </div>
            ))}
          </div>

          {optionalForms.length > 0 && (
            <>
              <p className="text-[8px] text-neutral-400 uppercase tracking-wider font-semibold mt-2 mb-1.5">Optional</p>
              <div className="flex flex-wrap gap-1.5">
                {optionalForms.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded-lg border border-dashed border-neutral-200">
                    <FileText className="h-3 w-3 text-neutral-300" />
                    <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">{f.name}</span>
                    <span className="text-[7px] text-neutral-300 font-semibold">OPT</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="h-1 rounded-b-xl bg-gradient-to-r from-purple-400 via-purple-200 to-transparent" />
      </div>
    </div>
  );
}