import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/config/utils";
import { startOfWeek, format, parseISO, isValid, getYear, getMonth } from 'date-fns';
import { 
  TrendingUp, 
  Calendar, 
  Video, 
  Plane, 
  ClipboardList,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react';

// --- Configuration ---

const TYPE_COLORS = {
  prep: '#0ea5e9',    // Sky 500
  scout: '#64748b',   // Slate 500
  tech: '#475569',    // Slate 600
  shoot: '#f43f5e',   // Rose 500
  travel: '#8b5cf6',  // Violet 500
  meeting: '#eab308', // Yellow 500
  wrap: '#10b981',    // Emerald 500
  other: '#94a3b8',   // Slate 400
};

const CHART_COLORS = [
  '#8b5cf6', '#ec4899', '#eab308', '#3b82f6', '#10b981', '#f97316', '#64748b'
];

// --- Helper Components ---

const StatCard = ({ title, value, subtitle, icon: Icon, trend, colorClass, className }) => (
  <Card className={cn("p-6", className)}>
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg bg-primary/5 text-primary", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 flex gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </Badge>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold tracking-tight mb-1">{value}</h3>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/60 mt-1">{subtitle}</p>}
    </div>
  </Card>
);

const EmptyChartState = ({ icon: Icon, label }) => (
  <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-3 bg-muted/5 rounded-lg border border-dashed border-border/50">
    <div className="p-3 bg-muted/10 rounded-full">
      <Icon className="w-8 h-8" />
    </div>
    <p className="text-sm font-medium">{label}</p>
  </div>
);

// --- Main Component ---

export default function CalendarAnalyticsView({ events = [], currentDate = new Date() }) {
  
  // 0. Filter Events (Robust Month Check)
  const filteredEvents = useMemo(() => {
    if (!currentDate) return events;

    const targetMonth = getMonth(currentDate);
    const targetYear = getYear(currentDate);

    return events.filter(event => {
      const dateStr = event.startDateTime || event.date;
      if (!dateStr) return false;
      const eventDate = parseISO(dateStr);
      if (!isValid(eventDate)) return false;

      // Compare Year and Month directly
      return getMonth(eventDate) === targetMonth && getYear(eventDate) === targetYear;
    });
  }, [events, currentDate]);

  // 1. Process Data: Pie Chart
  const pieData = useMemo(() => {
    const counts = filteredEvents.reduce((acc, event) => {
      // Handle casing and ensure default
      const rawType = event.eventType || event.type || 'other';
      const typeKey = rawType.toLowerCase(); 
      acc[typeKey] = (acc[typeKey] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0) // Filter out zero values
      .sort((a, b) => b.value - a.value);
  }, [filteredEvents]);

  // 2. Process Data: Bar Chart
  const barData = useMemo(() => {
    const weeklyMap = filteredEvents.reduce((acc, event) => {
      const dateStr = event.startDateTime || event.date;
      if (!dateStr) return acc;

      try {
        const date = parseISO(dateStr);
        if (!isValid(date)) return acc;
        
        // Group by ISO Week Start Date (Monday)
        const weekStartKey = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        acc[weekStartKey] = (acc[weekStartKey] || 0) + 1;
      } catch (e) {
        return acc;
      }
      return acc;
    }, {});

    const currentYear = new Date().getFullYear();

    return Object.entries(weeklyMap)
      .sort((a, b) => a[0].localeCompare(b[0])) 
      .map(([dateKey, count]) => {
        const date = parseISO(dateKey);
        const label = getYear(date) !== currentYear 
          ? format(date, "MMM d ''yy") 
          : format(date, 'MMM d');
          
        return {
          name: label,
          fullDate: dateKey,
          count: Number(count) // Ensure it's a number
        };
      });
  }, [filteredEvents]);

  // 3. Totals
  const totalEvents = filteredEvents.length;
  const counts = filteredEvents.reduce((acc, e) => {
    const type = (e.eventType || e.type || '').toLowerCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const shootDays = counts['shoot'] || 0;
  const prepDays = counts['prep'] || 0;
  const travelLegs = counts['travel'] || 0;

  const currentMonthLabel = format(currentDate, 'MMMM yyyy');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Events" 
          value={totalEvents} 
          subtitle={`Scheduled in ${currentMonthLabel}`}
          icon={Calendar}
          colorClass="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        />
        <StatCard 
          title="Shoot Days" 
          value={shootDays} 
          subtitle={`Principal Photography in ${currentMonthLabel}`}
          icon={Video}
          colorClass="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
          className="border-l-4 border-l-rose-500"
        />
        <StatCard 
          title="Prep Days" 
          value={prepDays} 
          subtitle="Pre-production tasks"
          icon={ClipboardList}
          colorClass="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
        />
        <StatCard 
          title="Travel & Moves" 
          value={travelLegs} 
          subtitle="Logistics movements"
          icon={Plane}
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Weekly Volume Chart */}
        <Card className="p-6 flex flex-col">
          <CardHeader className="p-0 mb-6">
            <div>
              <h3 className="font-semibold mb-1">Weekly Activity Volume</h3>
              <p className="text-xs text-muted-foreground">Event density per week in {currentMonthLabel}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[300px] flex-1 min-h-[300px]">
            {barData && barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={0} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState icon={BarChart2} label="No activity scheduled this month" />
            )}
          </CardContent>
        </Card>

        {/* Event Distribution Chart */}
        <Card className="p-6 flex flex-col">
          <CardHeader className="p-0 mb-6">
            <div>
              <h3 className="font-semibold mb-1">Event Type Distribution</h3>
              <p className="text-xs text-muted-foreground">Breakdown for {currentMonthLabel}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[300px] flex-1 min-h-[300px]">
             {pieData && pieData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={TYPE_COLORS[entry.name.toLowerCase()] || CHART_COLORS[index % CHART_COLORS.length]} 
                        stroke="var(--card)" 
                        strokeWidth={2} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs font-medium text-muted-foreground capitalize ml-1">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
             ) : (
               <EmptyChartState icon={PieChartIcon} label="No data to display" />
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}