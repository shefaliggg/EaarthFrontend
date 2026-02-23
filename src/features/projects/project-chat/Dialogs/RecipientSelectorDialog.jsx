import React, { useState, useMemo } from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import SearchBar from "../../../../shared/components/SearchBar";

export default function RecipientSelectorDialog({
  open,
  onOpenChange,
  items = [],
  searchQuery,
  onSearchChange,
  mode = "forward",
  selectionType = "multiple",
  onConfirm,
  confirmLabel = "Confirm",
  disableConfirm = false,
}) {
  const [selected, setSelected] = useState([]);

  const isMultiple = selectionType === "multiple";

  const handleSelect = (id) => {
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    } else {
      setSelected([id]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onConfirm(selected);
    if (!disableConfirm) {
      setSelected([]);
      onOpenChange(false);
    }
  };

  const titleMap = {
    forward: "Forward Message",
    direct: "Start Direct Conversation",
    group: "Create Group",
  };

  const descriptionMap = {
    forward: "Select conversations to forward this message to.",
    direct: "Select a project member to start chatting.",
    group: "Select members for your group.",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titleMap[mode]}</DialogTitle>
          <DialogDescription>{descriptionMap[mode]}</DialogDescription>
        </DialogHeader>
        <SearchBar
          value={searchQuery}
          onValueChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search for ${mode === "direct" ? "Project members" : "Conversations"}`}
        />
        <div className="space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium">
                No {mode === "direct" ? "members" : "conversations"} found
              </p>

              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">
                  No results for "{searchQuery}"
                </p>
              )}
            </div>
          ) : (
            items.map((item) => {
              const isSelected = selected.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted border-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarFallback>
                        {item.avatar || item.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {isMultiple && (
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setSelected([]);
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="flex-1"
          >
            {mode === "forward" ? `Forward (${selected.length})` : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
