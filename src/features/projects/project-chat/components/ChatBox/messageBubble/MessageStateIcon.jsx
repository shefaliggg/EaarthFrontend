import { Check, CheckCheck, Clock, X } from "lucide-react";
import React from "react";

function MessageStateIcon({ state }) {
  switch (state) {
    case "sending":
      return (
        <Clock className="w-3 h-3 text-primary-foreground/50 animate-pulse" />
      );
    case "sent":
      return <Check className="w-3 h-3 text-primary-foreground/70" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-primary-foreground/70" />;
    case "seen":
      return <CheckCheck className="w-3 h-3 text-green-400" />;
    case "failed":
      return <X className="w-3 h-3 text-red-500" />;
    default:
      return null;
  }
}

export default MessageStateIcon;
