import React from "react";
import { Sparkles } from "lucide-react";

export default function CardWrapper({
    title = "AI-Powered Predictive Insights",
    icon: Icon = Sparkles,
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
                            <Icon className="w-5 h-5 text-purple-500" />
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