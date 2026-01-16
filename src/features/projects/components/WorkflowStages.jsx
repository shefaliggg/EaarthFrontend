import { StageCard } from '../../crew/components/StatCard';

export function WorkflowStages({ stages, statusCounts, selectedStage, onStageClick }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8  gap-3">
      {stages.map((stage) => {
        const count = statusCounts[stage.statusKey] || 0;
        return (
          <StageCard
            key={stage.label}
            stage={stage}
            count={count}
            isSelected={selectedStage === stage.statusKey}
            onClick={() => onStageClick(stage)}
          />
        );
      })}
    </div>
  );
}