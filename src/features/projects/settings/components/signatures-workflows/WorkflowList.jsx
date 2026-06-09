import { Plus } from "lucide-react";
import WorkflowCard from "@/features/projects/settings/components/signatures-workflows/WorkflowCard";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";

function WorkflowList({
  workflows,
  signers,
  isEditing,
  onChange,
  emptyWorkflow,
}) {
  const addWorkflow = () => {
    onChange([...workflows, emptyWorkflow()]);
  };

  const updateWorkflow = (id, data) => {
    onChange(
      workflows.map((workflow) => (workflow.id === id ? data : workflow)),
    );
  };

  const removeWorkflow = (id) => {
    onChange(workflows.filter((workflow) => workflow.id !== id));
  };

  return (
    <>
      <div className="space-y-4">
        <AutoHeight className="flex flex-col gap-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              signers={signers}
              isEditing={isEditing}
              onChange={(data) => updateWorkflow(workflow.id, data)}
              onDelete={() => removeWorkflow(workflow.id)}
            />
          ))}
        </AutoHeight>

        {isEditing && (
          <button
            onClick={addWorkflow}
            className="w-full border-2 border-dashed border-border text-primary py-5 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
          >
            <Plus size={16} />
            Add Workflow
          </button>
        )}
      </div>
    </>
  );
}

export default WorkflowList;
