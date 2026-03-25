import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "../config/utils";

function SearchBar({ placeholder, value, onValueChange, className }) {
  return (
    <div className={cn("flex-1", className)}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="pl-10 rounded-full bg-background dark:bg-background border-2 border-border focus:bg-background focus:border-primary transition-all h-10 w-full placeholder:text-muted-foreground"
        />
        {value && (
          <button
            onClick={() => onValueChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/80 cursor-pointer"
          >
            <X className="w-3 h-3 text-destructive" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
