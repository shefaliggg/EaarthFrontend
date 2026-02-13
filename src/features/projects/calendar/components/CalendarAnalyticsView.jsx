import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { format, isValid, parseISO } from "date-fns";
import {
  Calendar,
  Video,
  Plane,
  ClipboardList,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import PrimaryStats from "../../../../shared/components/wrappers/PrimaryStats";

// --- Constants ---
const COLORS = {
  prep: "#0ea5e9",
  shoot: "#f97316",
  wrap: "#10b981",
  scout: "#64748b",
  tech: "#475569",
  travel: "#8b5cf6",
  meeting: "#eab308",
  other: "#94a3b8",
};
const DEFAULT_COLORS = ["#8b5cf6", "#ec4899", "#eab308", "#3b82f6", "#10b981"];

// --- Helper Components ---
const EmptyState = ({ icon: Icon, label }) => (
  <div className="flex h-full w-full flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-border/50 bg-muted/5 text-muted-foreground/40">
    <div className="rounded-full bg-muted/10 p-3">
      <Icon className="size-8" />
    </div>
    <p className="text-sm font-medium">{label}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-popover-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: payload[0].color || payload[0].fill }}
        />
        <span className="text-muted-foreground">
          {payload[0].name}:{" "}
          <span className="font-medium text-foreground">
            {payload[0].value}
          </span>
        </span>
      </div>
    </div>
  );
};

function CalendarAnalyticsView({ analyticsData, currentDate }) {
  // If no data is passed (e.g. initial load), provide fallback
  const { typeCounts = {}, weekCounts = {}, stats = {} } = analyticsData || {};

  const monthLabel = useMemo(
    () => (isValid(currentDate) ? format(currentDate, "MMMM yyyy") : ""),
    [currentDate],
  );

  // 1. Format Pie Data for Chart
  const pieData = useMemo(
    () =>
      Object.entries(typeCounts)
        .map(([name, value], idx) => ({
          name,
          value,
          color: COLORS[name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value),
    [typeCounts],
  );

  // 2. Format Bar Data for Chart
  const barData = useMemo(
    () =>
      Object.entries(weekCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateKey, count]) => ({
          name: format(parseISO(dateKey), "MMM d"),
          fullDate: dateKey,
          count,
        })),
    [weekCounts],
  );

  const statsConfig = [
    {
      label: "Total Events",
      subLabel: `Scheduled in ${monthLabel}`,
      value: stats.total || 0,
      icon: Calendar,
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-700 dark:text-purple-300",
    },
    {
      label: "Shoot Days",
      subLabel: "Principal Photography",
      value: stats.shoot || 0,
      icon: Video,
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-700 dark:text-orange-300",
    },
    {
      label: "Prep Days",
      subLabel: "Pre-production tasks",
      value: stats.prep || 0,
      icon: ClipboardList,
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-700 dark:text-sky-300",
    },
    {
      label: "Travel",
      subLabel: "Logistics movements",
      value: stats.travel || 0,
      icon: Plane,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      iconColor: "text-indigo-700 dark:text-indigo-300",
    },
  ];

  return (
    <>
      <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500 ease-out">
        <PrimaryStats stats={statsConfig} gridColumns={4} gridGap={4} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Volume Chart */}
        <Card className="flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Weekly Activity
            </CardTitle>
            <CardDescription>
              Event density per week in {monthLabel}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex-1 pb-4">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                    content={<CustomTooltip />}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={BarChart2} label="No activity scheduled" />
            )}
          </CardContent>
        </Card>

        {/* Event Type Distribution */}
        <Card className="flex flex-col shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Event Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by type for {monthLabel}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center pb-6">
            {pieData.length > 0 ? (
              <div className="flex h-full flex-col items-center">
                <div className="h-[943px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="var(--card)"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid w-full grid-cols-2 gap-x-4 gap-y-2 px-4">
                  {pieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full ring-1 ring-border/20"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="capitalize text-muted-foreground">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[1032px]">
                <EmptyState icon={PieChartIcon} label="No data available" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}

export default CalendarAnalyticsView;
