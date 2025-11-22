import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

function FilterPillTabs({ options, value, onChange }) {
    return (
        <Tabs value={value} onValueChange={onChange} className="w-full">
            <TabsList className="flex flex-wrap gap-2 p-0 bg-transparent h-auto">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isActive = value === option.value;

                    return (
                        <TabsTrigger
                            key={option.value}
                            value={option.value}
                            className="px-3.5"
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {option.label}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}

export default FilterPillTabs;