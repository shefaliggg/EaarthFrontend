import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save, 
  Upload,
  Download,
  Users,
  AlertCircle
} from "lucide-react";
import { PageHeader } from '@/shared/components/PageHeader';
import { toast } from "sonner";

export default function BulkOfferCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  
  const [crewMembers, setCrewMembers] = useState([
    { id: 1, fullName: "", email: "", phone: "", jobTitle: "", department: "", rateType: "Weekly", rate: "" }
  ]);

  const handleAddRow = () => {
    const newId = Math.max(...crewMembers.map(c => c.id), 0) + 1;
    setCrewMembers([
      ...crewMembers,
      { id: newId, fullName: "", email: "", phone: "", jobTitle: "", department: "", rateType: "Weekly", rate: "" }
    ]);
  };

  const handleRemoveRow = (id) => {
    if (crewMembers.length === 1) {
      toast.error("You must have at least one crew member");
      return;
    }
    setCrewMembers(crewMembers.filter(c => c.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setCrewMembers(crewMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSaveDrafts = async () => {
    // Validate that at least one row has data
    const validMembers = crewMembers.filter(m => m.fullName || m.email || m.jobTitle);
    
    if (validMembers.length === 0) {
      toast.error("Please add at least one crew member with details");
      return;
    }

    // Validate required fields
    const incomplete = validMembers.some(m => !m.fullName || !m.email || !m.jobTitle);
    if (incomplete) {
      toast.error("Please fill in Name, Email, and Job Title for all crew members");
      return;
    }

    try {
      // API call to create bulk offers
      const response = await fetch("/api/offers/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          crewMembers: validMembers
        })
      });

      if (response.ok) {
        toast.success(`${validMembers.length} draft offers created successfully`);
        navigate(-1); // Go back to previous page
      } else {
        toast.error("Failed to create offers");
      }
    } catch (error) {
      console.error("Error creating bulk offers:", error);
      toast.error("An error occurred while creating offers");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImportCSV = () => {
    toast.info("CSV import feature coming soon");
  };

  const handleExportTemplate = () => {
    toast.info("Template export feature coming soon");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Offer Creation"
        subtitle="Enter multiple crew members at once to create draft offers"
        icon="Users"
        secondaryActions={[
          {
            label: "Import CSV",
            icon: "Upload",
            variant: "outline",
            clickAction: handleImportCSV
          },
          {
            label: "Download Template",
            icon: "Download",
            variant: "outline",
            clickAction: handleExportTemplate
          }
        ]}
      />

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Crew Members ({crewMembers.length})
            </CardTitle>
            <Button onClick={handleAddRow} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Row
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">#</th>
                  <th className="text-left p-3 text-sm font-medium min-w-[200px]">
                    Full Name <span className="text-red-500">*</span>
                  </th>
                  <th className="text-left p-3 text-sm font-medium min-w-[200px]">
                    Email <span className="text-red-500">*</span>
                  </th>
                  <th className="text-left p-3 text-sm font-medium min-w-[150px]">Phone</th>
                  <th className="text-left p-3 text-sm font-medium min-w-[180px]">
                    Job Title <span className="text-red-500">*</span>
                  </th>
                  <th className="text-left p-3 text-sm font-medium min-w-[150px]">Department</th>
                  <th className="text-left p-3 text-sm font-medium min-w-[120px]">Rate Type</th>
                  <th className="text-left p-3 text-sm font-medium min-w-[120px]">Rate</th>
                  <th className="text-left p-3 text-sm font-medium w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {crewMembers.map((member, index) => (
                  <tr key={member.id} className="border-b hover:bg-muted/20">
                    <td className="p-3 text-sm text-muted-foreground">{index + 1}</td>
                    <td className="p-3">
                      <Input
                        value={member.fullName}
                        onChange={(e) => handleInputChange(member.id, "fullName", e.target.value)}
                        placeholder="Enter full name"
                        className="h-9"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleInputChange(member.id, "email", e.target.value)}
                        placeholder="email@example.com"
                        className="h-9"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        value={member.phone}
                        onChange={(e) => handleInputChange(member.id, "phone", e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="h-9"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        value={member.jobTitle}
                        onChange={(e) => handleInputChange(member.id, "jobTitle", e.target.value)}
                        placeholder="e.g., Camera Operator"
                        className="h-9"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        value={member.department}
                        onChange={(e) => handleInputChange(member.id, "department", e.target.value)}
                        placeholder="e.g., Camera"
                        className="h-9"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={member.rateType}
                        onChange={(e) => handleInputChange(member.id, "rateType", e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={member.rate}
                        onChange={(e) => handleInputChange(member.id, "rate", e.target.value)}
                        placeholder="0.00"
                        className="h-9"
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRow(member.id)}
                        className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {crewMembers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No crew members added yet</p>
              <Button onClick={handleAddRow} className="mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add First Crew Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Quick Tips:</p>
              <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
                <li>All offers will be created as drafts that you can review before sending</li>
                <li>Required fields are marked with <span className="text-red-500">*</span></li>
                <li>You can add more details to each offer after they're created</li>
                <li>Use the Import CSV feature to upload large lists of crew members</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveDrafts} className="gap-2">
          <Save className="w-4 h-4" />
          Create {crewMembers.filter(m => m.fullName || m.email || m.jobTitle).length} Draft Offers
        </Button>
      </div>
    </div>
  );
}