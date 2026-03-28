import React from "react";
import { InfoTooltip } from "../../../../../../shared/components/InfoTooltip";
import * as Icon from "lucide-react";
import { cn } from "../../../../../../shared/config/utils";

function MessageActionButton({
  icon: Icon,
  tooltip,
  className,
  onClick,
  disabled,
}) {
  return (
    <InfoTooltip content={tooltip} side={"bottom"}>
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={cn(
          "p-1.5 rounded-lg bg-muted/80 transition-all duration-200",
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-muted hover:scale-110 active:scale-95",
          className,
        )}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>
    </InfoTooltip>
  );
}

export default MessageActionButton;
