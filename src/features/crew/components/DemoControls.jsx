// src/crew/components/DemoControls.jsx

import { Card, CardContent } from "../../../shared/components/ui/card";
import { MOCK_USER_ROLES } from "../mocks/mockConfig";
import { OFFER_STATUS_PRESETS } from "../mocks/offerStatusPresets";

/**
 * Development-only controls for switching role and status
 * Allows testing all UI states without backend
 */
export function DemoControls({ selectedRole, onRoleChange, selectedStatus, onStatusChange }) {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎮</span>
          <span className="font-semibold text-sm">Demo Controls</span>
          <span className="text-xs text-muted-foreground">
            Switch role and status to test different UI states
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              View as Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MOCK_USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Offer Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.keys(OFFER_STATUS_PRESETS).map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 p-2 bg-white rounded text-xs text-muted-foreground">
          <strong>Current View:</strong> {selectedRole.replace(/_/g, " ")} viewing offer in <strong>{selectedStatus.replace(/_/g, " ")}</strong> status
        </div>
      </CardContent>
    </Card>
  );
}