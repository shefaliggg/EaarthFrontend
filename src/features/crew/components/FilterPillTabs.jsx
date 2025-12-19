import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import * as Icons from "lucide-react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FilterPillTabs({ options, value, onChange, fullWidth = false, navigatable = false, readOnly = false }) {
    const navigate = useNavigate();

    const handleChange = (newValue) => {
        if (readOnly) return;

        const selected = options.find((opt) => opt.value === newValue);

        if (navigatable && selected?.route) {
            navigate(selected.route);
            return
        }
        onChange?.(newValue);
    };

    return (
        <Tabs value={value} onValueChange={handleChange} className="w-full">
            <TabsList
                className={`p-0 bg-transparent h-auto ${fullWidth
                    ? "grid grid-flow-col auto-cols-fr gap-2 w-full"
                    : "flex flex-wrap gap-2"
                    }`}
            >
                {options.map((option) => {
                    const iconProvided = option.icon !== undefined && option.icon !== null;

                    let Icon = null;

                    if (typeof option.icon === "function") {
                        Icon = option.icon;
                    } else if (typeof option.icon === "string") {
                        Icon = Icons[option.icon] || Circle;
                    }

                    return (
                        <TabsTrigger
                            key={option.value}
                            value={option.value}
                            className={`px-3.5 bg-background/60 ${fullWidth ? "py-2" : ""}`}
                        >
                            {Icon && iconProvided && <Icon className="w-4 h-4 mr-1.5" />}
                            {option.label}
                        </TabsTrigger>

                    );
                })}
            </TabsList>
        </Tabs>
    );
}

export default FilterPillTabs;
