import { MetricsCard } from '../MetricsCard';

export default function PrimaryStats({ stats, gridColumns }) {

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  const gridClass = gridCols[gridColumns] ?? gridCols[stats.length] ?? "grid-cols-1";

  return (
    <div className={`grid ${gridClass}  gap-4`}>
      {stats.map((stat, index) => (
        <MetricsCard
          key={index}
          title={stat.label}
          value={stat.value}
          valueColor={stat.color}
          icon={stat.icon}
          subtext={stat.subLabel}
          subtextColor={stat.subLabelColor}
        />
      ))}
    </div>
  );
}