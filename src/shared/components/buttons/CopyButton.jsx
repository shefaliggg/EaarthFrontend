import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { InfoTooltip } from "../InfoTooltip";

export function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard", {
          description: `${text} has been copied.`,
        });
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        toast.error("Failed to copy", {
          description: `Could not copy ${text}.`,
        });
      });
  };

  return (
    <InfoTooltip content="Copy to clipboard">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={`h-6 w-6 p-0 ${className}`}
      >
        {copied ? (
          <Check className="h-3! w-3!" />
        ) : (
          <Copy className="h-3! w-3!" />
        )}
      </Button>
    </InfoTooltip>
  );
}
