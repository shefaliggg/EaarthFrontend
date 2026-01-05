import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import * as Icons from "lucide-react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SmartIcon } from "./SmartIcon";

function FilterPillTabs({
    options,
    value,
    onChange,
    transparentBg = true,
    fullWidth = false,
    navigatable = false,
    readOnly = false,
}) {
    const navigate = useNavigate();

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
                className={`h-auto ${transparentBg ? "p-0 bg-trnasparent" : "p-1 bg-background rounded-3xl"} ${fullWidth
                    ? "grid grid-flow-col auto-cols-fr gap-2 w-full"
                    : "flex flex-wrap gap-2"
                    }`}
            >
                {options.map((option) => {
                    const tabValue = navigatable ? option.route : option.value;

                    return (
                        <TabsTrigger
                            key={tabValue}
                            value={tabValue}
                            className={`px-3.5 py-1.5 bg-background/60 ${fullWidth ? "py-2" : ""}`}
                        >
                            {option.icon && <SmartIcon icon={option.icon} className="w-4 h-4 mr-1.5" />}
                            {option.label}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}

export default FilterPillTabs;
