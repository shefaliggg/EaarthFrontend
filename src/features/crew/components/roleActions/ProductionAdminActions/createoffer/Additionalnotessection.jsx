import { Card, CardContent } from "../../../../../../shared/components/ui/card";
import { Bell } from "lucide-react";
import { SectionHeader, FormField } from "./Ui";

/**
 * AdditionalNotesSection
 *
 * Collapsible section with two free-text areas:
 *   - Other Deal Provisions
 *   - Additional Notes (internal)
 *
 * Props:
 *   formData      {object}    top-level form state
 *   setFormData   {function}  top-level form state setter
 *   isOpen        {boolean}
 *   onToggle      {function}  (section) => void
 */
export default function AdditionalNotesSection({ formData, setFormData, isOpen, onToggle }) {
  return (
    <Card className="border-0 py-0 shadow-sm overflow-hidden">
      <SectionHeader
        title="Additional Notes"
        icon={Bell}
        section="notes"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      {isOpen && (
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Other Deal Provisions">
              <textarea
                value={formData.otherDealProvisions}
                onChange={(e) =>
                  setFormData({ ...formData, otherDealProvisions: e.target.value })
                }
                placeholder="Enter any additional provisions..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </FormField>

            <FormField label="Additional Notes">
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                placeholder="Enter any notes for internal reference..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </FormField>
          </div>
        </CardContent>
      )}
    </Card>
  );
}