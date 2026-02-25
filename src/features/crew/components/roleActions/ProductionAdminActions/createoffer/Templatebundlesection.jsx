import { Card, CardContent } from "../../../../../../shared/components/ui/card";
import { Badge } from "../../../../../../shared/components/ui/badge";
import { FileText, AlertCircle, Settings } from "lucide-react";
import { getBundleForms } from "./Constants";

/**
 * TemplateBundleSection
 *
 * Displays the attached template bundle based on the role's rateType +
 * engagementType. Three possible states:
 *   1. Neither selected yet   → amber "please select" prompt
 *   2. Combo has bundle        → grid of form cards
 *   3. Combo has no bundle     → "No template configured… Configure in Settings"
 *
 * Props:
 *   rateType        {string}  role.rateType
 *   engagementType  {string}  role.engagementType
 */
export default function TemplateBundleSection({ rateType, engagementType }) {
  const bundleForms = getBundleForms(rateType, engagementType);
  const bundleLabel =
    rateType && engagementType
      ? `${rateType} ${engagementType.replace("_", " ")}`
      : null;

  return (
    <Card className="border shadow-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-primary/5 border-b border-primary/10">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-primary uppercase tracking-wide">
          Attached Template Bundle
        </span>
        {bundleLabel && bundleForms && (
          <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[10px]">
            {bundleLabel}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* State 1: nothing selected yet */}
        {(!rateType || !engagementType) && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Select a <strong>Rate Type</strong> and{" "}
              <strong>Engagement Type</strong> above to load the template bundle.
            </p>
          </div>
        )}

        {/* State 2: known bundle → show cards */}
        {rateType && engagementType && bundleForms && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bundleForms.map((doc, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-5 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs font-bold uppercase text-center leading-tight">{doc}</p>
              </div>
            ))}
          </div>
        )}

        {/* State 3: combo has no bundle configured */}
        {rateType && engagementType && !bundleForms && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">
                No template bundle configured for{" "}
                <span className="text-primary">{bundleLabel}</span>.
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Configure in{" "}
                <span className="text-primary font-medium cursor-pointer hover:underline">
                  Settings
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}