// src/features/project/components/ProjectStatusBadge.jsx
import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import * as Icons from "lucide-react";

/**
 * Get approval status badge configuration
 */
export function getApprovalStatusConfig(status) {
  const configs = {
    draft: {
      label: "Draft",
      variant: "secondary",
      icon: Icons.Circle,
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    },
    pending: {
      label: "Pending Approval",
      variant: "default",
      icon: Icons.Clock,
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    approved: {
      label: "Approved",
      variant: "default",
      icon: Icons.CheckCircle2,
      className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    rejected: {
      label: "Rejected",
      variant: "destructive",
      icon: Icons.XCircle,
      className: "bg-red-100 text-red-700 hover:bg-red-100",
    },
  };

  return configs[status] || configs.draft;
}

/**
 * Get operational status badge configuration
 */
export function getOperationalStatusConfig(status) {
  const configs = {
    active: {
      label: "Active",
      variant: "default",
      icon: Icons.PlayCircle,
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    },
    completed: {
      label: "Completed",
      variant: "default",
      icon: Icons.CheckCheck,
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    on_hold: {
      label: "On Hold",
      variant: "default",
      icon: Icons.PauseCircle,
      className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    },
    cancelled: {
      label: "Cancelled",
      variant: "default",
      icon: Icons.StopCircle,
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    },
  };

  return configs[status] || configs.active;
}

/**
 * Approval Status Badge
 */
export function ApprovalStatusBadge({ status, showIcon = true }) {
  const config = getApprovalStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

/**
 * Operational Status Badge
 */
export function OperationalStatusBadge({ status, showIcon = true }) {
  const config = getOperationalStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}