import { Grid3x3, LayoutGrid, List } from "lucide-react";
import { convertToPrettyText } from "../../config/utils";
import { Button } from "../ui/button";
import { SmartIcon } from "../SmartIcon";

function ViewToggleButton({ view, onViewChange, showLabel = false, gridIcon = "LayoutGrid", listIcon = "List", listLabel = "list", GridLabel = "grid" }) {
    return (
        <div className={`flex gap-2 bg-background p-1 rounded-md`}>
            <Button
                size={"sm"}
                onClick={() => onViewChange(GridLabel)}
                className={`p-2 rounded-md font-semibold transition-all ${view === GridLabel
                    ? 'bg-[#9333ea] text-background'
                    : 'bg-background text-gray-600 hover:text-background dark:bg-gray-800 dark:text-gray-400 dark:hover:text-background'
                    }`}
            >
                <SmartIcon icon={gridIcon} size="xl" />
                {showLabel && convertToPrettyText(GridLabel)}
            </Button>
            <Button
                size={"sm"}
                onClick={() => onViewChange(listLabel)}
                className={`p-1.5 rounded-md font-semibold transition-all ${view === listLabel
                    ? 'bg-[#9333ea] text-background'
                    : 'bg-background text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-background'
                    }`}
            >
                <SmartIcon icon={listIcon} size="xl" />
                {showLabel && convertToPrettyText(listLabel)}
            </Button>
        </div>
    );
}

export default ViewToggleButton;







