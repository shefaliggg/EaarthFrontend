import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export function InfoTooltip({
    content,
    children,
    side = "top",
    align = "center",
    delay = 200,
}) {
    return (
        <Tooltip delayDuration={delay}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align} className="max-w-xs text-xs leading-relaxed">
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
