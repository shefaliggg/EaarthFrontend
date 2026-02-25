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

  const [step, setStep] = useState("country");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [showNewCompanyInput, setShowNewCompanyInput] = useState(false);

  const countries = [
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "IN", name: "India" },
  ];

  const [companiesByCountry, setCompaniesByCountry] = useState({
    US: [{ id: 1, name: "Eaarth US" }],
    UK: [{ id: 2, name: "Eaarth UK" }],
    IN: [{ id: 3, name: "Eaarth India" }],
  });

  const companies = selectedCountry
    ? companiesByCountry[selectedCountry.code] || []
    : [];

  const resetDialog = () => {
    setStep("country");
    setSelectedCountry(null);
    setSelectedCompany(null);
    setNewCompanyName("");
    setShowNewCompanyInput(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setStep("company");
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setStep("type");
  };

  const handleCreateNewCompany = () => {
    if (!newCompanyName.trim()) {
      toast.error("Please enter company name");
      return;
    }

    if (!selectedCountry) {
      toast.error("Please select a country first");
      return;
    }

    const newCompany = {
      id: Date.now(),
      name: newCompanyName.trim(),
    };

    setCompaniesByCountry((prev) => ({
      ...prev,
      [selectedCountry.code]: [...(prev[selectedCountry.code] || []), newCompany],
    }));
    setSelectedCompany(newCompany);
    setNewCompanyName("");
    setShowNewCompanyInput(false);
    setStep("type");

    toast.success(`Company "${newCompany.name}" added`);
  };

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
            {step === "country" ? (
              <>
                <Building2 className="w-5 h-5 text-primary" />
                Select Country
              </>
            ) : step === "company" ? (
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
            {step === "country"
              ? "Choose the country first"
              : step === "company"
              ? `Choose a company in ${selectedCountry?.name}`
              : `Creating offer for ${selectedCompany?.name}`}
          </DialogDescription>
        </DialogHeader>

        {step === "country" && (
          <div className="space-y-3 mt-2">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleSelectCountry(country)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all",
                  "hover-elevate flex items-center justify-between gap-3"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{country.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {step === "company" && (
          <div className="space-y-3 mt-2">
            <button
              onClick={() => setStep("country")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Back to country selection
            </button>

            <div className="p-2 rounded-lg bg-muted/50 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{selectedCountry?.name}</span>
            </div>

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