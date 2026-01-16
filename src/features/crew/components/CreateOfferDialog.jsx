import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../shared/components/ui/dialog";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { Label } from "../../../shared/components/ui/label";
import { Input } from "../../../shared/components/ui/input";
import { Badge } from "../../../shared/components/ui/badge";

import { Building2, User, Users, Plus, ChevronRight } from "lucide-react";
import { cn } from "../../../shared/config/utils";

export default function CreateOfferDialog({ open, onOpenChange }) {
  const navigate = useNavigate();

  const [step, setStep] = useState("company");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [showNewCompanyInput, setShowNewCompanyInput] = useState(false);

  // ✅ DEFAULT UI DATA
  const [companies, setCompanies] = useState([
    { id: 1, name: "Eaarth" },
  ]);

  const resetDialog = () => {
    setStep("company");
    setSelectedCompany(null);
    setNewCompanyName("");
    setShowNewCompanyInput(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setStep("type");
  };

  // ✅ UI-only add company
  const handleCreateNewCompany = () => {
    if (!newCompanyName.trim()) {
      toast.error("Please enter company name");
      return;
    }

    const newCompany = {
      id: Date.now(),
      name: newCompanyName.trim(),
    };

    setCompanies((prev) => [...prev, newCompany]);
    setSelectedCompany(newCompany);
    setNewCompanyName("");
    setShowNewCompanyInput(false);
    setStep("type");

    toast.success(`Company "${newCompany.name}" added`);
  };

  // ✅ Navigation only
  const handleSelectType = (type) => {
  onOpenChange(false);

  if (type === "individual") {
    navigate("../offers/create");
  } else {
    navigate("../offers/create/bulk");
  }

  resetDialog();
};


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {step === "company" ? (
              <>
                <Building2 className="w-5 h-5 text-primary" />
                Select Company
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-primary" />
                Select Offer Type
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {step === "company"
              ? "Choose which company this offer is for"
              : `Creating offer for ${selectedCompany?.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* ---------------- COMPANY STEP ---------------- */}
        {step === "company" && (
          <div className="space-y-3 mt-2">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all",
                  "hover-elevate flex items-center justify-between gap-3"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{company.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}

            {showNewCompanyInput ? (
              <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
                <Label className="text-sm font-medium">New Company Name</Label>

                <div className="flex gap-2">
                  <Input
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateNewCompany();
                    }}
                  />
                  <Button size="sm" onClick={handleCreateNewCompany}>
                    Add
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setShowNewCompanyInput(false);
                    setNewCompanyName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setShowNewCompanyInput(true)}
              >
                <Plus className="w-4 h-4" />
                Add New Company
              </Button>
            )}
          </div>
        )}

        {/* ---------------- TYPE STEP ---------------- */}
        {step === "type" && (
          <div className="space-y-3 mt-2">
            <button
              onClick={() => setStep("company")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Back to company selection
            </button>

            <div className="p-2 rounded-lg bg-muted/50 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{selectedCompany?.name}</span>
            </div>

            <Card
              className="p-4 cursor-pointer hover-elevate border-2 border-transparent hover:border-primary/20"
              onClick={() => handleSelectType("individual")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Individual Offer</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a single offer for one crew member.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground mt-2" />
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer hover-elevate border-2 border-transparent hover:border-primary/20"
              onClick={() => handleSelectType("bulk")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Bulk Offers</h3>
                  <p className="text-sm text-muted-foreground">
                    Create multiple draft offers at once.
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Faster for large teams
                  </Badge>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground mt-2" />
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
