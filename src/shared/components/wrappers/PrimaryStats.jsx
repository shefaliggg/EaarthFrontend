import { MetricsCard } from '../cards/MetricsCard';
import { SecondaryMetricsCard } from '../cards/SecondaryMetricsCard';

export default function PrimaryStats({ stats, gridColumns, gridGap = 4, useSecondaryCard = false }) {

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
  };

  const gridClass = gridCols[gridColumns] ?? gridCols[stats.length] ?? "grid-cols-1";
  
  const gaps = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
  };

  return (
    <div className={`grid ${gridClass} ${gaps[gridGap] ?? "gap-4"}`}>
      {stats.map((stat, index) => (
        useSecondaryCard
          ? <SecondaryMetricsCard
            key={index}
            title={stat.label}
            subtext={stat.subLabel}
            subtextColor={stat.subLabelColor}
            value={stat.value}
            valueColor={stat.color}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
          : <MetricsCard
            key={index}
            title={stat.label}
            subtext={stat.subLabel}
            subtextColor={stat.subLabelColor}
            value={stat.value}
            valueColor={stat.color}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
      ))}
    </div>
  );
}