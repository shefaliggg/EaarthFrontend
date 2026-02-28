import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { ContractForm } from "../components/roleActions/ProductionAdminActions/createoffer/Contractform";
import { CreateOfferLayout } from "../components/roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { PageHeader } from "../../../shared/components/PageHeader";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances } from "../utils/Defaultallowance";

const defaultContractData = {
  fullName: "",
  email: "",
  mobileNumber: "",
  isViaAgent: false,
  agentEmail: "",
  alternativeContract: "",
  unit: "main",
  department: "",
  subDepartment: "new",
  jobTitle: "",
  searchAllDepartments: false,
  createOwnJobTitle: false,
  newJobTitle: "",
  jobTitleSuffix: "",
  allowSelfEmployed: "no",
  statusDeterminationReason: "hmrc_list",
  otherStatusDeterminationReason: "",
  regularSiteOfWork: "on_set",
  workingInUK: "yes",
  startDate: "",
  endDate: "",
  dailyOrWeekly: "daily",
  engagementType: "paye",
  workingWeek: "5",
  currency: "GBP",
  feePerDay: "",
  overtime: "calculated",
  otherOT: "",
  cameraOTSWD: "",
  cameraOTSCWD: "",
  cameraOTCWD: "",
  otherDealProvisions: "",
  additionalNotes: "",
};

export default function CreateOfferPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeField, setActiveField] = useState(null);

  const [offer, setOffer] = useState({
    id: id || "new",
    status: "draft",
    contractData: defaultContractData,
    engineSettings: defaultEngineSettings,
    salaryBudgetCodes: [],
    salaryTags: [],
    overtimeBudgetCodes: [],
    overtimeTags: [],
    allowances: defaultAllowances,
  });

  const {
    contractData,
    engineSettings,
    salaryBudgetCodes,
    salaryTags,
    overtimeBudgetCodes,
    overtimeTags,
    allowances,
  } = offer;

  const calculatedRates = useMemo(() => {
    const fee = parseFloat(contractData?.feePerDay) || 0;
    return calculateRates(fee, engineSettings);
  }, [contractData, engineSettings]);

  const makeArraySetter = (field) => (val) => {
    setOffer((prev) => ({
      ...prev,
      [field]: typeof val === "function" ? val(prev[field]) : val,
    }));
  };

  const setSalaryBudgetCodes   = makeArraySetter("salaryBudgetCodes");
  const setSalaryTags          = makeArraySetter("salaryTags");
  const setOvertimeBudgetCodes = makeArraySetter("overtimeBudgetCodes");
  const setOvertimeTags        = makeArraySetter("overtimeTags");

  const setAllowances = (val) =>
    setOffer((prev) => ({
      ...prev,
      allowances: typeof val === "function" ? val(prev.allowances) : val,
    }));

  const handleFieldFocus = (fieldName) => setActiveField(fieldName);
  const handleFieldBlur  = () => setActiveField(null);

  return (
    <div className="min-h-screen bg-purple-50/40 max-w-7xl mx-auto">

      {/* ── PageHeader ── */}
      <div className="px-6 pt-6 pb-4">
        <PageHeader
          title="Create Offer"
         
          icon="FileText"
          secondaryActions={[
            {
              label: "Save Draft",
              icon: "Save",
              variant: "outline",
              clickAction: () => console.log("Save Draft → call API here later"),
            },
          ]}
          primaryAction={{
            label: "Send to Crew",
            icon: "Send",
            variant: "default",
            clickAction: () => navigate("/"),
          }}
        />
      </div>

      {/* ── Two-column layout ── */}
      <div className="px- pb-">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">

          {/* Left: Form */}
          <Card>
            <CardContent className="p-4">
              <ContractForm
                data={contractData}
                onChange={(val) => setOffer((prev) => ({ ...prev, contractData: val }))}
                calculatedRates={calculatedRates}
                engineSettings={engineSettings}
                salaryBudgetCodes={salaryBudgetCodes}
                setSalaryBudgetCodes={setSalaryBudgetCodes}
                salaryTags={salaryTags}
                setSalaryTags={setSalaryTags}
                overtimeBudgetCodes={overtimeBudgetCodes}
                setOvertimeBudgetCodes={setOvertimeBudgetCodes}
                overtimeTags={overtimeTags}
                setOvertimeTags={setOvertimeTags}
                allowances={allowances}
                setAllowances={setAllowances}
                onFieldFocus={handleFieldFocus}
                onFieldBlur={handleFieldBlur}
              />
            </CardContent>
          </Card>

          {/* Right: Preview */}
          <Card>
            <CardContent className="p-0">
              <CreateOfferLayout
                data={contractData}
                activeField={activeField}
                onFieldFocus={handleFieldFocus}
                onFieldBlur={handleFieldBlur}
                calculatedRates={calculatedRates}
                engineSettings={engineSettings}
                salaryBudgetCodes={salaryBudgetCodes}
                setSalaryBudgetCodes={setSalaryBudgetCodes}
                salaryTags={salaryTags}
                setSalaryTags={setSalaryTags}
                overtimeBudgetCodes={overtimeBudgetCodes}
                setOvertimeBudgetCodes={setOvertimeBudgetCodes}
                overtimeTags={overtimeTags}
                setOvertimeTags={setOvertimeTags}
                allowances={allowances}
                hideOfferSections={false}
                hideContractDocument={true}
              />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}