import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import SearchBar from "@/shared/components/SearchBar";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import * as FramerMotion from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import {
  Mail,
  Plus,
  Check,
  Clock3,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import SignerList from "@/features/projects/settings/components/signatures-workflows/SignerList";
import WorkflowList from "../../components/signatures-workflows/WorkflowList";

const emptySigner = () => ({
  id: Date.now() + Math.random(),
  name: "",
  role: "",
  email: "",
  department: "PRODUCTION",
  hasSignature: false,
  requiresSecondApproval: false,
  permissions: [],
  limit: "",
});

const emptyWorkflow = () => ({
  id: Date.now() + Math.random(),
  name: "",
  department: "PRODUCTION",
  requiresAll: true,
  steps: [],
});

function SignaturesWorkflowsSettings() {
  const [editingSection, setEditingSection] = useState(null);
  const [formState, setFormState] = useState({
    signers: [],
    workflows: [],
  });

  const signersData =
    editingSection === "signers"
      ? formState.signers
      : [
          {
            id: 1,
            name: "SHEERIN KHOSROWSHAHI",
            role: "UPM - UNIT PRODUCTION MANAGER",
            email: "sheerin@project.com",
            department: "PRODUCTION",
            hasSignature: true,
            requiresSecondApproval: false,
            permissions: ["Timesheets", "Expenses"],
            limit: "$5000",
            order: 1,
          },

          {
            id: 2,
            name: "JOHN ALFRED",
            role: "FOCUS EXECUTIVE",
            email: "john.alfred@focusfeatures.com",
            department: "ACCOUNTS",
            hasSignature: true,
            requiresSecondApproval: false,
            permissions: [
              "Expenses",
              "Invoices",
              "Purchase Orders",
              "Contracts",
            ],
            limit: "$50000",
            order: 2,
          },

          {
            id: 3,
            name: "JASON LEIB",
            role: "FOCUS EXECUTIVE",
            email: "jason.leib@focusfeatures.com",
            department: "POST PRODUCTION",
            hasSignature: false,
            requiresSecondApproval: true,
            permissions: ["Timesheets", "Expenses", "Schedule Changes"],
            limit: "$10000",
            order: 3,
          },

          {
            id: 4,
            name: "DAN PALMER",
            role: "FIRST AD",
            email: "dan.palmer@project.com",
            department: "PRODUCTION",
            hasSignature: true,
            requiresSecondApproval: false,
            permissions: ["Timesheets", "Call Sheets", "Schedule Changes"],
            limit: "$2500",
            order: 4,
          },

          {
            id: 5,
            name: "PAYROLL REVIEW",
            role: "PAYROLL REVIEW",
            email: "payroll@project.com",
            department: "ACCOUNTS",
            hasSignature: true,
            requiresSecondApproval: false,
            permissions: ["Timesheets", "Expenses"],
            limit: "$10000",
            order: 5,
          },
        ];

  const workflowsData =
    editingSection === "workflows"
      ? formState.workflows
      : [
          {
            id: 1,
            name: "EXPENSE APPROVAL - ACCOUNTS",
            department: "ACCOUNTS",
            requiresAll: false,
            steps: [
              {
                signerId: 1,
                required: true,
              },
              {
                signerId: 2,
                required: true,
              },
            ],
          },

          {
            id: 2,
            name: "INVOICE APPROVAL - ACCOUNTS",
            department: "ACCOUNTS",
            requiresAll: true,
            steps: [
              {
                signerId: 2,
                required: true,
              },
            ],
          },
        ];

  const startEditing = (section) => {
    if (section === "signers") {
      setFormState((prev) => ({
        ...prev,
        signers: [...signersData],
      }));
    }

    if (section === "workflows") {
      setFormState((prev) => ({
        ...prev,
        workflows: [...workflowsData],
      }));
    }
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setFormState({
      signers: [],
    });
  };

  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Authorized Signers
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Manage who can approve timesheets, expenses, and other
                  documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={editingSection === "signers"}
                onEdit={() => startEditing("signers")}
                onSave={() => {
                  console.log(formState.signers);
                  setEditingSection(null);
                }}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          {/*✅ TOOLBAR */}
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <SearchBar />
            <div className="flex items-end gap-3 flex-wrap">
              <SelectMenu
                items={[
                  { label: "ALL DEPARTMENTS", value: "ALL DEPARTMENTS" },
                  { label: "PRODUCTION", value: "PRODUCTION" },
                  { label: "ACCOUNTS", value: "ACCOUNTS" },
                  { label: "POST PRODUCTION", value: "POST PRODUCTION" },
                  { label: "CONSTRUCTION", value: "CONSTRUCTION" },
                ]}
              />
            </div>
          </div>
          <SignerList
            signers={signersData}
            isEditing={editingSection === "signers"}
            onChange={(updatedSigners) =>
              setFormState((prev) => ({
                ...prev,
                signers: updatedSigners,
              }))
            }
            emptySigner={emptySigner}
          />
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Approval Workflows
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Configure approval chains for timesheets, expenses, and more
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditToggleButtons
                isEditing={editingSection === "workflows"}
                onEdit={() => startEditing("workflows")}
                onSave={() => {
                  console.log(formState.workflows);
                  setEditingSection(null);
                }}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <WorkflowList
            workflows={workflowsData}
            signers={signersData}
            isEditing={editingSection === "workflows"}
            emptyWorkflow={emptyWorkflow}
            onChange={(updatedWorkflows) =>
              setFormState((prev) => ({
                ...prev,
                workflows: updatedWorkflows,
              }))
            }
          />
        </CardWrapper>
      </div>
    </>
  );
}

export default SignaturesWorkflowsSettings;
