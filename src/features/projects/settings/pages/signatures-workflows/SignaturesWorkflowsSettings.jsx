import { useState, useCallback }  from "react";
import { useOutletContext }        from "react-router-dom";
import { toast }                  from "sonner";
import { Loader2 }                from "lucide-react";

import CardWrapper       from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import SearchBar         from "@/shared/components/SearchBar";
import { SelectMenu }    from "@/shared/components/menus/SelectMenu";
import SignerList        from "../../components/signatures-workflows/SignerList";
import WorkflowList      from "../../components/signatures-workflows/WorkflowList";

import { useSignaturesWorkflowsSettings } from "./useSignaturesWorkflowsSettings";

const DEPARTMENTS = [
  { label: "ALL DEPARTMENTS",  value: "ALL DEPARTMENTS"  },
  { label: "PRODUCTION",       value: "PRODUCTION"       },
  { label: "ACCOUNTS",         value: "ACCOUNTS"         },
  { label: "POST PRODUCTION",  value: "POST PRODUCTION"  },
  { label: "CONSTRUCTION",     value: "CONSTRUCTION"     },
];

const emptySigner = () => ({
  name:                   "",
  role:                   "",
  email:                  "",
  department:             "PRODUCTION",
  hasSignature:           false,
  requiresSecondApproval: false,
  permissions:            [],
  limit:                  "",
});

const emptyWorkflow = () => ({
  name:        "",
  department:  "PRODUCTION",
  requiresAll: true,
  steps:       [],
});

function SectionHeader({ title, description, isEditing, isLoading, onEdit, onSave, onCancel }) {
  return (
    <div className="flex items-center justify-between mb-7">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
        <div>
          <h3 className="text-foreground text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground text-[0.7rem] mt-0.5">{description}</p>
        </div>
      </div>
      <EditToggleButtons
        isEditing={isEditing}
        isLoading={isLoading}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}

function SignaturesWorkflowsSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    isUpdating,
    isSubmitting,
    error,
    addSigner,
    updateSigner,
    deleteSigner,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
  } = useSignaturesWorkflowsSettings(projectId);

  const [editingSection,  setEditingSection]  = useState(null);
  const [signersDraft,    setSignersDraft]    = useState([]);
  const [workflowsDraft,  setWorkflowsDraft]  = useState([]);
  const [signerFilter,    setSignerFilter]    = useState("ALL DEPARTMENTS");
  const [signerSearch,    setSignerSearch]    = useState("");

  const startEditing = useCallback((section) => {
    if (section === "signers")   setSignersDraft([...settings.signers]);
    if (section === "workflows") setWorkflowsDraft([...settings.workflows]);
    setEditingSection(section);
  }, [settings]);

  const cancelEditing = useCallback(() => {
    setEditingSection(null);
    setSignersDraft([]);
    setWorkflowsDraft([]);
  }, []);

  const saveSigners = useCallback(async () => {
    try {
      const existing = settings.signers;
      for (const signer of signersDraft) {
        if (!signer._id) {
          await addSigner(signer).unwrap();
        } else {
          const orig = existing.find((s) => s._id === signer._id);
          if (orig && JSON.stringify(orig) !== JSON.stringify(signer)) {
            await updateSigner(signer._id, signer).unwrap();
          }
        }
      }
      for (const orig of existing) {
        const stillExists = signersDraft.find((s) => s._id === orig._id);
        if (!stillExists) await deleteSigner(orig._id).unwrap();
      }
      toast.success("Signers updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update signers");
    }
  }, [signersDraft, settings.signers, addSigner, updateSigner, deleteSigner, cancelEditing]);

  const saveWorkflows = useCallback(async () => {
    try {
      const existing = settings.workflows;
      for (const workflow of workflowsDraft) {
        if (!workflow._id) {
          await addWorkflow(workflow).unwrap();
        } else {
          const orig = existing.find((w) => w._id === workflow._id);
          if (orig && JSON.stringify(orig) !== JSON.stringify(workflow)) {
            await updateWorkflow(workflow._id, workflow).unwrap();
          }
        }
      }
      for (const orig of existing) {
        const stillExists = workflowsDraft.find((w) => w._id === orig._id);
        if (!stillExists) await deleteWorkflow(orig._id).unwrap();
      }
      toast.success("Workflows updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update workflows");
    }
  }, [workflowsDraft, settings.workflows, addWorkflow, updateWorkflow, deleteWorkflow, cancelEditing]);

  const signersDisplay   = editingSection === "signers"    ? signersDraft   : settings.signers;
  const workflowsDisplay = editingSection === "workflows"  ? workflowsDraft : settings.workflows;

  const filteredSigners = signersDisplay
    .filter((s) => s.isActive !== false)
    .filter((s) => signerFilter === "ALL DEPARTMENTS" || s.department === signerFilter)
    .filter((s) => !signerSearch || s.name.toLowerCase().includes(signerSearch.toLowerCase()));

  if (isFetching && !settings.signers.length && !settings.workflows.length) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading signatures & workflows…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
        {error?.message ?? "Something went wrong. Please try again."}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Authorized Signers"
          description="Manage who can approve timesheets, expenses, and other documents"
          isEditing={editingSection === "signers"}
          isLoading={(isUpdating || isSubmitting) && editingSection === "signers"}
          onEdit={() => startEditing("signers")}
          onSave={saveSigners}
          onCancel={cancelEditing}
        />
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <SearchBar
            value={signerSearch}
            onChange={(e) => setSignerSearch(e.target.value)}
            placeholder="Search signers..."
          />
          <SelectMenu
            value={signerFilter}
            items={DEPARTMENTS}
            onChange={(val) => setSignerFilter(val)}
          />
        </div>
        <SignerList
          signers={filteredSigners}
          isEditing={editingSection === "signers"}
          onChange={setSignersDraft}
          emptySigner={emptySigner}
        />
      </CardWrapper>

      <CardWrapper showLabel={false}>
        <SectionHeader
          title="Approval Workflows"
          description="Configure approval chains for timesheets, expenses, and more"
          isEditing={editingSection === "workflows"}
          isLoading={(isUpdating || isSubmitting) && editingSection === "workflows"}
          onEdit={() => startEditing("workflows")}
          onSave={saveWorkflows}
          onCancel={cancelEditing}
        />
        <WorkflowList
          workflows={workflowsDisplay.filter((w) => w.isActive !== false)}
          signers={settings.signers.filter((s) => s.isActive !== false)}
          isEditing={editingSection === "workflows"}
          emptyWorkflow={emptyWorkflow}
          onChange={setWorkflowsDraft}
        />
      </CardWrapper>

    </div>
  );
}

export default SignaturesWorkflowsSettings;