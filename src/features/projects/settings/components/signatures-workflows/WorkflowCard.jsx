import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";
import { StatusBadge } from "@/shared/components/badges/StatusBadge";
import * as FramerMotion from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Plus, Clock3, ChevronRight, ShieldCheck } from "lucide-react";

function WorkflowCard({ workflow, signers, isEditing, onChange, onDelete }) {
  const addStep = () => {
    onChange({
      ...workflow,
      steps: [
        ...workflow.steps,
        {
          signerId: signers?.[0]?.id,
          required: true,
        },
      ],
    });
  };

  const updateStep = (index, field, value) => {
    onChange({
      ...workflow,
      steps: workflow.steps.map((step, i) =>
        i === index
          ? {
              ...step,
              [field]: value,
            }
          : step,
      ),
    });
  };

  const removeStep = (index) => {
    onChange({
      ...workflow,
      steps: workflow.steps.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <div className="p-4 border rounded-2xl bg-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2">
            <Clock3 className="w-4 h-4 text-primary mt-0.5" />
            <EditableTextDataField
              label="Workflow Name"
              value={workflow.name}
              isEditing={isEditing}
              onChange={(value) =>
                onChange({
                  ...workflow,
                  name: value,
                })
              }
            />
          </div>
          {isEditing && (
            <div className="flex items-center gap-2">
              <FramerMotion.motion.button
                onClick={addStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[0.7rem] font-medium bg-primary text-primary-foreground shadow-md"
              >
                <Plus size={14} />
                Add Step
              </FramerMotion.motion.button>

              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-100 border-transparent"
                onClick={onDelete}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 overflow-x-auto">
          {workflow.steps.map((step, index) => {
            const signer = signers.find((s) => s.id === step.signerId);

            return (
              <div
                key={`${workflow.id}-${index}`}
                className="flex items-center gap-4"
              >
                <div className="relative p-4 rounded-xl border bg-background">
                  <div className="flex items-center gap-2 mb-3">
                    <StatusBadge
                      size="xs"
                      showIcon={false}
                      label={`STEP ${index + 1}`}
                      status="highlight"
                    />

                    <StatusBadge
                      size="xs"
                      showIcon={false}
                      label={step.required ? "REQUIRED" : "OPTIONAL"}
                      status={step.required ? "danger" : "neutral"}
                    />

                    {isEditing && (
                      <button
                        onClick={() => removeStep(index)}
                        className="absolute top-3 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <EditableSelectField
                    label="Signer"
                    value={step.signerId}
                    isEditing={isEditing}
                    items={signers.map((signer) => ({
                      label: signer.name,
                      value: signer.id,
                    }))}
                    onChange={(value) => updateStep(index, "signerId", value)}
                  />

                  <div className="mt-2">
                    <p className="text-xs font-medium text-foreground">
                      {signer?.role}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {signer?.department}
                    </p>
                  </div>

                  {signer?.limit && (
                    <p className="text-xs font-medium text-peach-600 mt-2">
                      UP TO {signer.limit}
                    </p>
                  )}
                </div>

                {index < workflow.steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />

            <span className="text-xs font-medium">
              {workflow.requiresAll
                ? "ALL APPROVALS REQUIRED"
                : "ANY APPROVAL ACCEPTED"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default WorkflowCard;
