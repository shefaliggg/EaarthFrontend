import { AlertCircle } from "lucide-react";

export default function ProfileCardErrorSkelton({
  message = "Something went wrong",
  onRetry,
}) {
  return (
    <div className="rounded-3xl border bg-card min-h-90 p-6 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-red-500">
        <AlertCircle className="size-8" />
        <span className="font-medium">{message}</span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm px-3 py-1 border rounded-lg hover:bg-muted"
        >
          Retry
        </button>
      )}
    </div>
  );
}
