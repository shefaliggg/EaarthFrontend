import React from "react";
import { Sparkles } from "lucide-react";
import { SmartIcon } from "../SmartIcon";
import { cn } from "../../config/utils";

export default function CardWrapper({
    title = "AI-Powered Predictive Insights",
    icon: Icon = Sparkles,
    iconColor = "text-primary",
    description = "",
    children,
    actions,
    variant="default",
    showLabel = true
}) {
    return (
        <div className={`${variant === "ghost" ? "border-transparent bg-transparent space-y-6" : "bg-background p-6 rounded-3xl border space-y-4"}`}>
            {showLabel &&
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <SmartIcon icon={Icon} size="lg" className={cn(iconColor)} />
                            {title}
                        </h3>

                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                    {actions &&
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    }
                </div>
            }

            {children}
        </div>
    );
}