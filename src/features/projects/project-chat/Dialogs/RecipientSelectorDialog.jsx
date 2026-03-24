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
  renderTopContent,
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
  };

  const titleMap = {
    forward: "Forward Message",
    direct: "Start Direct Conversation",
    subject: "Create Subject Group",
  };

  const descriptionMap = {
    forward: "Select conversations to forward this message to.",
    direct: "Select a project member to start chatting.",
    subject: "Select members for your subject group.",
  };

  const searchMap = {
    forward: "Search for Project members or Conversations",
    direct: "Search for Project members.",
    subject: "Search for Project members.",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titleMap[mode]}</DialogTitle>
          <DialogDescription>{descriptionMap[mode]}</DialogDescription>
        </DialogHeader>
        {renderTopContent && <div className="mt-2">{renderTopContent}</div>}
        <div className="space-y-1.5 mt-2">
          {renderTopContent && (
            <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
              <span>Project Members</span>
            </div>
          )}
          <SearchBar
            value={searchQuery}
            onValueChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchMap[mode]}
          />
        </div>
        <div className="space-y-1 min-h-[40vh] max-h-[90vh] overflow-y-auto">
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
                    "w-full p-2.5 rounded-lg border text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted border-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
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
            disabled={disableConfirm}
            onClick={() => {
              if (disableConfirm) return;
              setSelected([]);
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={selected.length === 0 || disableConfirm}
            className="flex-1"
          >
            {mode === "forward" ? `Forward (${selected.length})` : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
