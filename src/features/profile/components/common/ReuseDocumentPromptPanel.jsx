import React from "react";
import { Button } from "../../../../shared/components/ui/button";
import { Info, Paperclip } from "lucide-react";
import { cn, convertToPrettyText } from "../../../../shared/config/utils";

function ReuseDocumentPromptPanel({
  label,
  docs,
  docType = "all",
  selectedId,
  existingDocId = false,
  onSelect,
  disabled = false,
}) {
  if (!docs?.length) return null;

  const normalizedType = docType?.toLowerCase();
  const isLocked = existingDocId === selectedId;

  const filteredDocs = docs?.filter((doc) => {
    if (normalizedType === "all") return true;
    return doc.documentType?.toLowerCase() === normalizedType;
  });

  const isSelected = (docId) => String(docId) === String(selectedId);
  const selectedDoc = filteredDocs.find(
    (doc) => String(doc._id) === String(selectedId),
  );
  return (
    <div className="border rounded-xl p-3 px-4 bg-gray-50 space-y-2">
      <p
        className={cn(
          "text-sm font-medium flex items-center gap-1",
          selectedId ? "text-green-500" : "text-foreground",
        )}
      >
        {isLocked && selectedId ? (
          <>🔒 This document is already submitted and cannot be removed</>
        ) : selectedId ? (
          <>
            <Info className="size-3" />
            Using Existing {label}:{" "}
            {convertToPrettyText(selectedDoc?.originalName) || "N/A"}
          </>
        ) : (
          `Use an existing ${label} or upload a new one`
        )}
      </p>
      <p className="text-sm font-medium"></p>

      <div className="flex flex-wrap gap-2">
        {filteredDocs.map((doc) => (
          <Button
            key={doc._id}
            type="button"
            variant={"outline"}
            onClick={() => {
              if (isLocked && isSelected(doc._id)) {
                return;
              }

              isSelected(doc._id) ? onSelect(null) : onSelect(doc._id);
            }}
            className={`${
              isSelected(doc._id) ? "bg-primary text-white" : "bg-white"
            }`}
            disabled={disabled || (isLocked && isSelected(doc._id))}
          >
            <Paperclip />
            {convertToPrettyText(doc.originalName) || "N/A"}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ReuseDocumentPromptPanel;
