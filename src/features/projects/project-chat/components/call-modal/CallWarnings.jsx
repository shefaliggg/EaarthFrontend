import { X } from "lucide-react";
import useCallStore from "../../store/call.store";

function CallWarnings() {
  const { deviceWarnings, removeDeviceWarning } = useCallStore();

  if (!deviceWarnings?.length) return null;

  return (
    <div className="flex flex-col gap-2 px-3 pt-2">
      {deviceWarnings?.map((w) => (
        <div
          key={w.id}
          className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm px-3 py-2 rounded-md flex justify-between items-center"
        >
          <span>{w.message}</span>

          <button
            onClick={() => removeDeviceWarning(w.id)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default CallWarnings;
