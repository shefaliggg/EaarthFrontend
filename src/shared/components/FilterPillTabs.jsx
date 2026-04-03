import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import * as Icons from "lucide-react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SmartIcon } from "./SmartIcon";
import { cn } from "../config/utils";

const SIZE_STYLES = {
  sm: {
    list: "p-0.5 gap-1",
    trigger: "px-2 pr-1 py-1 text-xs shadow-none flex-0",
    icon: "w-3 h-3",
  },
  md: {
    list: "p-1 gap-2",
    trigger: "px-3.5 pr-2 py-1.5 text-sm",
    icon: "w-4 h-4 stroke-2!",
  },
  lg: {
    list: "p-1.5 gap-3",
    trigger: "px-5 py-2.5 text-base",
    icon: "w-5 h-5 stroke-2!",
  },
};

const VARIANT_STYLES = {
  default: {
    list: ({ transparentBg, fullWidth }) => `
      h-auto
      ${transparentBg ? "bg-transparent" : "bg-background rounded-3xl border shadow-sm border-muted"}
      ${fullWidth ? "grid grid-flow-col auto-cols-fr w-full" : "flex flex-wrap justify-start"}
    `,
    trigger: ({ badge }) => `
      bg-background/60
      data-[state=active]:bg-primary
      data-[state=active]:text-white
      ${badge ? "pr-3!" : ""}
    `,
    badge: `
      bg-primary/10 text-primary
      group-data-[state=active]:bg-purple-500
      group-data-[state=active]:text-background
      dark:group-data-[state=active]:bg-purple-900
      dark:group-data-[state=active]:text-foreground
    `,
  },

  modern: {
    list: ({ fullWidth }) => `
      h-auto bg-background shadow-md border rounded-xl p-1 px-1.5
      ${fullWidth ? "grid grid-flow-col auto-cols-fr w-full" : "flex flex-wrap justify-start gap-1.5"}
    `,
    trigger: () => `
      flex flex-col items-center gap-1
      rounded-md
      border-none shadow-none
      px-5 py-2.5
      min-w-20
      text-xs font-medium
      transition-all
      bg-transparent
      text-muted-foreground

      hover:bg-background hover:text-foreground

     data-[state=active]:bg-primary
     data-[state=active]:relative
      data-[state=active]:text-white
      data-[state=active]:shadow-sm
    `,
    badge: `
    font-bold!
    size-4.5!
      bg-primary text-background
      group-data-[state=active]:bg-background
      group-data-[state=active]:text-primary
      group-data-[state=active]:scale-110 transition-colors transition-transform duration-150
    `,
  },
};

function FilterPillTabs({
  options,
  value,
  onChange,
  transparentBg = true,
  fullWidth = false,
  showActiveIndicator = false,
  navigatable = false,
  readOnly = false,
  size = "md",
  variant = "default",
}) {
  const navigate = useNavigate();

  const styles = SIZE_STYLES[size] || SIZE_STYLES.md;
  const variantStyles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  const handleChange = (newValue) => {
    if (readOnly) return;

    if (navigatable) {
      navigate(newValue);
      return;
    }

    onChange?.(newValue);
  };

  return (
    <Tabs
      value={value}
      onValueChange={handleChange}
      className={cn(fullWidth ? "w-full" : "w-fit")}
    >
      <TabsList
        className={`
          ${styles.list}
          ${variantStyles.list({ transparentBg, fullWidth })}
        `}
      >
        {options.map((option) => {
          const tabValue = navigatable ? option.route : option.value;
          const isActive = value === tabValue;

          return (
            <TabsTrigger
              key={tabValue}
              value={tabValue}
              className={`
                ${styles.trigger}
                ${variantStyles.trigger({ badge: option.badge === undefined })}
                group relative
              `}
            >
              {isActive && showActiveIndicator && (
                <div className="absolute -bottom-[5px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-[3px] rotate-45" />
              )}
              {variant === "modern" ? (
                <div className={cn(!isActive && "relative")}>
                  {option.icon && (
                    <SmartIcon icon={option.icon} className={styles.icon} />
                  )}

                  {option.badge !== undefined && (
                    <span
                      className={cn(
                        "absolute size-4 flex items-center justify-center text-[10px] rounded-full",
                        variantStyles.badge,
                        isActive ? "top-1 right-1" : "-top-2 -right-6",
                      )}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  {option.icon && (
                    <SmartIcon icon={option.icon} className={styles.icon} />
                  )}
                </>
              )}

              {option.label}

              {variant !== "modern" && option.badge !== undefined && (
                <span
                  className={cn(
                    "size-4 flex items-center justify-center text-[10px] font-medium rounded-full",
                    variantStyles.badge,
                  )}
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
