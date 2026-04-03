import { Button } from "../ui/button";
import { Check, Pen, X } from "lucide-react";
import { cn } from "../../config/utils";

function EditToggleButtons({ isEditing, onEdit, onSave, onCancel }) {
  return (
    <>
      {isEditing && (
        <Button
          size="icon"
          variant="outline"
          onClick={onCancel}
          className="hover:bg-red-200 dark:hover:bg-red-800"
        >
          <X className="text-red-500" />
        </Button>
      )}

      <Button
        size="icon"
        variant="outline"
        onClick={isEditing ? onSave : onEdit}
        className={cn(
          isEditing
            ? "hover:bg-green-200 dark:hover:bg-green-800"
            : "hover:bg-purple-200 dark:hover:bg-purple-800",
        )}
      >
        {isEditing ? (
          <Check className="text-green-500" />
        ) : (
          <Pen className="text-primary" />
        )}
      </Button>
    </>
  );
}

export default EditToggleButtons;
