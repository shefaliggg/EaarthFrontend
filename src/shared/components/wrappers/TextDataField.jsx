import * as LucideIcons from "lucide-react";
import { convertToPrettyText } from "@/shared/config/utils";
import { SmartIcon } from "../SmartIcon";

function TextDataField({ label, value, icon }) {

    return (
        <div className="flex flex-col gap-1.5 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
                {icon && <SmartIcon icon={icon} size="md" />}
                <span>{label}</span>
            </div>

            <div className="text-sm font-medium text-foreground bg-muted/30 uppercase p-2 rounded-md pl-6 border">
                {value === null || value === undefined
                    ? (
                        <span className="italic text-muted-foreground">
                            Not Available
                        </span>
                    )
                    : typeof value === "string"
                        ? convertToPrettyText(value)
                        : value}
            </div>
        </div>
    )
}

export default TextDataField