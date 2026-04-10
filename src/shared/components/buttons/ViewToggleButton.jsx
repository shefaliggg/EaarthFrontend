import { Grid3x3, LayoutGrid, List } from "lucide-react";
import { convertToPrettyText } from "../../config/utils";
import { Button } from "../ui/button";
import { SmartIcon } from "../SmartIcon";
import { InfoTooltip } from "../InfoTooltip";

function ViewToggleButton({
  view,
  onViewChange,
  showLabel = false,
  showTable = false,
  gridIcon = "LayoutGrid",
  listIcon = "List",
  tableIcon = "Table2",
  listLabel = "list",
  GridLabel = "grid",
  tableLabel = "table",
  variant = "outline",
}) {
  const views = [
    ...(showTable
      ? [
          {
            key: tableLabel,
            icon: tableIcon,
            label: tableLabel,
          },
        ]
      : []),
    {
      key: GridLabel,
      icon: gridIcon,
      label: GridLabel,
    },
    {
      key: listLabel,
      icon: listIcon,
      label: listLabel,
    },
  ];

  return (
    <div className="flex gap-1 bg-background p-1 rounded-md">
      {views.map((item) =>
        !showLabel ? (
          <InfoTooltip key={item.key} content={`Switch to ${item.label}`}>
            <Button
              size="sm"
              onClick={() => onViewChange(item.key)}
              className={`p-2 rounded-md font-semibold transition-all border border-transparent ${
                view === item.key
                  ? "bg-[#9333ea] text-background"
                  : "bg-background text-gray-600 hover:text-background dark:bg-gray-800 dark:text-gray-400 dark:hover:text-background border-muted"
              }`}
            >
              <SmartIcon icon={item.icon} size="xl" />
            </Button>
          </InfoTooltip>
        ) : (
          <Button
            key={item.key}
            size="sm"
            onClick={() => onViewChange(item.key)}
            className={`p-2 rounded-md font-semibold transition-all ${
              view === item.key
                ? "bg-[#9333ea] text-background"
                : "bg-background text-gray-600 hover:text-background dark:bg-gray-800 dark:text-gray-400 dark:hover:text-background"
            }`}
          >
            <SmartIcon icon={item.icon} size="xl" />
            {convertToPrettyText(item.label)}
          </Button>
        ),
      )}
    </div>
  );
}

export default ViewToggleButton;
