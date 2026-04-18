import { Button } from "../ui/button";
import { Check, Loader2, Pen, X } from "lucide-react";
import { cn } from "../../config/utils";
import { InfoTooltip } from "../InfoTooltip";

function EditToggleButtons({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isLoading = false,
  editToolTipContent = "Edit",
  cancelToolTipContent = "Cancel Changes",
  saveToolTipContent = "Save Changes",
}) {
  return (
    <>
      {isEditing ? (
        <>
          <InfoTooltip content={cancelToolTipContent}>
            <Button
              size="icon"
              variant="outline"
              disabled={isLoading}
              onClick={onCancel}
              className="hover:bg-red-200 dark:hover:bg-red-800"
            >
              <X className="text-red-500" />
            </Button>
          </InfoTooltip>

          <InfoTooltip content={saveToolTipContent}>
            <Button
              size="icon"
              variant="outline"
              disabled={isLoading}
              onClick={onSave}
              className={cn("hover:bg-green-200 dark:hover:bg-green-800")}
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-muted-foreground" />
              ) : (
                <Check className="text-green-500" />
              )}
            </Button>
          </InfoTooltip>
        </>
      ) : (
        <InfoTooltip content={editToolTipContent}>
          <Button
            size="icon"
            variant="outline"
            disabled={isLoading}
            onClick={onEdit}
            className={cn("hover:bg-purple-200 dark:hover:bg-purple-800")}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : (
              <Pen className="text-primary" />
            )}
          </Button>
        </InfoTooltip>
      )}
    </>
  );
}

export default EditToggleButtons;
