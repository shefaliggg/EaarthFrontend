import FilterPillTabs from '../../../shared/components/FilterPillTabs';

export function WorkflowStages({ stages, statusCounts, selectedStage, onStageClick }) {
  const options = stages.map((stage) => ({
    value: stage.statusKey,
    label: stage.label,
    icon: stage.icon,
    count: stage.isAction ? null : (statusCounts[stage.statusKey || ""] || 0),
    isAction: stage.isAction
  }));

  // Format labels to include counts
  const optionsWithCounts = options.map(option => ({
    ...option,
    label: option.label,
    icon: option.icon,
  }));

  return (
    <div className="w-full">
      <FilterPillTabs
        options={optionsWithCounts}
        value={selectedStage}
        onChange={(value) => {
          const stage = stages.find(s => s.statusKey === value);
          if (stage) {
            onStageClick(stage);
          }
        }}
      />
    </div>
  );
}