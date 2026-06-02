import {
  CheckCircle2,
  LoaderCircle,
  AlertTriangle,
  Circle,
  TriangleAlertIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

export const updateStageStatus = (stages, stageId, status) =>
  stages.map((stage) => (stage.id === stageId ? { ...stage, status } : stage));

export function SaveStageDialog({
  open,
  title,
  description,
  stages = [],
  errorMessage,
  onOpenChange,
}) {
  const hasFailedStage = stages.some((stage) => stage.status === "failed");

  const canClose = hasFailedStage || errorMessage;

  const renderIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;

      case "loading":
        return <LoaderCircle className="h-5 w-5 animate-spin text-primary" />;

      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;

      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => onOpenChange(v)}>
      <DialogContent
        showCloseButton={canClose}
        preventClose={!canClose}
        className="max-w-md min-h-[240px] max-h-[95vh] flex flex-col gap-3"
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <DialogTitle className="font-bold text-gray-900 tracking-tight">
              {title}
            </DialogTitle>

            {description && (
              <DialogDescription className="mt-2.5 text-sm text-gray-600 leading-relaxed mx-auto">
                {description}
              </DialogDescription>
            )}
          </div>

          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center gap-3">
                {renderIcon(stage.status)}

                <div className="flex-1">
                  <p className="text-sm font-medium">{stage.title}</p>
                </div>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-center gap-2">
              <TriangleAlertIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
