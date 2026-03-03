import {
  Plus,
  Briefcase,
  Plane,
  Hotel,
  Paperclip,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import SearchBar from "@/shared/components/SearchBar";

function TmoSidebar({
  filteredTmos,
  searchText,
  onSearchChange,
  selectedTmo,
  onSelectTmo,
  onCreateNew,
  onEditTmo,
  onDeleteTmo,
}) {
  return (
    <div className="md:w-86 flex flex-col border-b md:border-b-0 md:border-r border-primary/20 bg-card">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-purple-900 dark:text-lavender-300 tracking-tight">
              Travel Orders
            </h3>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {filteredTmos.length} Documents
            </p>
          </div>

          <Button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 transition-all duration-150 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </Button>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Search name, dept…"
          value={searchText}
          onValueChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-160px)]">
        {filteredTmos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground/50 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-1">
              <FolderOpen className="w-5 h-5 text-primary/40" />
            </div>
            <p className="text-sm font-semibold">No documents found</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredTmos.map((tmo, index) => {
              const currentId = tmo._id || tmo.id || index;
              const isSelected = selectedTmo?._id === currentId || selectedTmo?.id === currentId;

              return (
                <div
                  key={currentId}
                  onClick={() =>
                    onSelectTmo(isSelected ? null : tmo)
                  }
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    isSelected
                      ? "bg-lavender-50 dark:bg-primary/10 border-l-4 border-l-primary/60 shadow-sm"
                      : "bg-card border-primary/20 hover:border-primary/25 hover:bg-lavender-50/60 dark:hover:bg-primary/5",
                  )}
                >
                  {/* TMO number + date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-primary/70 bg-primary/8 dark:bg-primary/15 px-2 py-0.5 rounded-md border border-primary/15 tracking-wide uppercase">
                      {tmo.tmoCode || tmo.tmoNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">
                      {new Date(tmo.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Name */}
                  <h4
                    className={cn(
                      "font-bold text-sm mb-1 truncate transition-colors",
                      isSelected
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary",
                    )}
                  >
                    {tmo.name}
                  </h4>

                  {/* Department */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Briefcase className="w-3 h-3" />
                    <span className="truncate">{tmo.department}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {tmo.sections?.some((s) => s.type === "travel") && (
                        <span
                          title="Travel"
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50"
                        >
                          <Plane className="w-2.5 h-2.5" />
                        </span>
                      )}
                      {tmo.sections?.some(
                        (s) => s.type === "accommodation",
                      ) && (
                        <span
                          title="Accommodation"
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-peach-100 dark:bg-peach-900/30 text-peach-700 dark:text-peach-300 border border-peach-200 dark:border-peach-800/50"
                        >
                          <Hotel className="w-2.5 h-2.5" />
                        </span>
                      )}
                      {tmo.attachments?.length > 0 && (
                        <span
                          title="Attachments"
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border"
                        >
                          <Paperclip className="w-2.5 h-2.5" />
                          {tmo.attachments.length}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div
                      className={cn(
                        "flex gap-0.5 transition-opacity duration-150",
                        isSelected
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      <button
                        onClick={(e) => onEditTmo(tmo, e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => onDeleteTmo(currentId, e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TmoSidebar;