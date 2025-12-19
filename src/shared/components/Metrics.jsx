import { studioPrimaryMetrics } from "../../features/studio/constants/studioMetricsData";
import { MetricsCard } from "./MetricsCard";

export default function Metrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {studioPrimaryMetrics.map((metric, idx) => (
        <MetricsCard key={idx} {...metric} />
      ))}
    </div>
  );
}
