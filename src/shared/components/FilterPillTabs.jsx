import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import * as Icons from "lucide-react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SmartIcon } from "./SmartIcon";

const SIZE_STYLES = {
  sm: {
    list: "p-0.5 gap-1",
    trigger: "px-2 pr-1 py-1 text-xs shadow-none",
    icon: "w-3 h-3",
  },
  md: {
    list: "p-1 gap-2",
    trigger: "px-3.5 py-1.5 text-sm",
    icon: "w-4 h-4",
  },
  lg: {
    list: "p-1.5 gap-3",
    trigger: "px-5 py-2.5 text-base",
    icon: "w-5 h-5",
  },
};

function FilterPillTabs({
  options,
  value,
  onChange,
  transparentBg = true,
  fullWidth = false,
  navigatable = false,
  readOnly = false,
  size = "md",
}) {
  const navigate = useNavigate();
  const styles = SIZE_STYLES[size] || SIZE_STYLES.md;

  const handleChange = (newValue) => {
    if (readOnly) return;

    if (navigatable) {
      navigate(newValue);
      return;
    }

    onChange?.(newValue);
  };

  return (
    <Tabs value={value} onValueChange={handleChange} className="w-full">
      <TabsList
        className={`h-auto ${styles.list} ${
          transparentBg
            ? "bg-transparent"
            : "bg-background rounded-3xl border shadow-sm border-muted"
        } ${
          fullWidth
            ? "grid grid-flow-col auto-cols-fr w-full"
            : "flex flex-wrap"
        }`}
      >
        {options.map((option) => {
          const tabValue = navigatable ? option.route : option.value;

          return (
            <TabsTrigger
              key={tabValue}
              value={tabValue}
              className={`bg-background/60 ${styles.trigger} group`}
            >
              {option.icon && (
                <SmartIcon icon={option.icon} className={styles.icon} />
              )}
              {option.label}
              {option.badge !== undefined && (
                <span
                  className="
                    py-0.5 px-1.5
                    text-[10px] font-medium
                    rounded-full
                    bg-primary/10 text-primary
                    group-data-[state=active]:bg-purple-500
                    dark:group-data-[state=active]:bg-purple-900
                    group-data-[state=active]:text-background
                    dark:group-data-[state=active]:text-foreground
                    "
                >
                  {option.badge}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export default FilterPillTabs;
