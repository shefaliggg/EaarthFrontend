import { Card, CardContent } from "../../../../../../shared/components/ui/card";
import { Badge } from "../../../../../../shared/components/ui/badge";
import { FileCheck } from "lucide-react";
import { FormField, SelectField } from "./Ui";
import TemplateBundleSection from "./Templatebundlesection";
import { RATE_TYPES, ENGAGEMENT_TYPES, CONTRACT_OPTIONS } from "./Constants";

/**
 * ContractsTab
 *
 * Inner tab inside each role. Contains:
 *   - Contract Configuration card (Rate Type, Engagement Type, Alternate Contract Type)
 *   - TemplateBundleSection (auto-resolves from above two fields)
 *
 * Props:
 *   role          {object}    current role object
 *   updateRole    {function}  (id, updates) => void
 *   formData      {object}    top-level form state (for alternativeContractType)
 *   setFormData   {function}  top-level form state setter
 */
export default function ContractsTab({ role, updateRole, formData, setFormData }) {
  return (
    <div className="space-y-5">
      {/* ── Contract Configuration ── */}
      <Card className="border shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase">
              Contract Configuration
            </span>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] text-muted-foreground border-muted-foreground/30"
            >
              Decides bundle
            </Badge>
          </div>

          {/* 3 fields in one row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Rate Type" required>
              <SelectField
                value={role.rateType}
                onChange={(v) => updateRole(role.id, { rateType: v })}
                options={RATE_TYPES}
              />
            </FormField>

            <FormField label="Engagement Type" required>
              <SelectField
                value={role.engagementType}
                onChange={(v) => updateRole(role.id, { engagementType: v })}
                options={ENGAGEMENT_TYPES}
              />
            </FormField>

            <FormField label="Alternate Contract Type">
              <SelectField
                value={formData.alternativeContractType}
                onChange={(v) =>
                  setFormData({ ...formData, alternativeContractType: v })
                }
                options={CONTRACT_OPTIONS}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* ── Template Bundle (auto-resolved) ── */}
      <TemplateBundleSection
        rateType={role.rateType}
        engagementType={role.engagementType}
      />
    </div>
  );
}