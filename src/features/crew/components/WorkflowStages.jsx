import { StageCard } from '../components/StatCard';

export function WorkflowStages({ stages, statusCounts, selectedStage, onStageClick }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stages.map((stage) => {
        const count = stage.isAction ? null : (statusCounts[stage.statusKey || ""] || 0);
        return (
          <StageCard
            key={stage.label}
            stage={stage}
            count={count}
            isSelected={selectedStage === stage.statusKey}
            isAction={stage.isAction}
            onClick={() => onStageClick(stage)}
          />
        );
      })}
    </div>
  );
}
