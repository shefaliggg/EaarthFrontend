"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {

  return (
    <Sonner
      theme="system"
      position="bottom-right"
      richColors
      visibleToasts={4}           // max toast count
      duration={3000}             // default time
      expand={true}               // expands long text
      toastOptions={{
        classNames: {
          toast:
            "bg-popover border border-border text-foreground shadow-md rounded-xl",
          title: "font-semibold",
          description: "text-sm opacity-90",
          actionButton:
            "bg-primary text-primary-foreground rounded-md px-3 py-1",
          cancelButton:
            "bg-muted text-muted-foreground rounded-md px-3 py-1",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "12px",
      }}
    />
  );
}
