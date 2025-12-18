import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '../components/StatCard';

const REPORT_DATA = {
  monthlySpending: [
    { month: 'Jan', amount: 12500000, budget: 15000000 },
    { month: 'Feb', amount: 18200000, budget: 20000000 },
    { month: 'Mar', amount: 22800000, budget: 25000000 },
    { month: 'Apr', amount: 19500000, budget: 22000000 },
  ],
  projectPerformance: [
    { project: 'AVATAR 1', completion: 72.5, status: 'On Track' },
    { project: 'AVATAR 3', completion: 23.5, status: 'On Track' },
    { project: 'AVATAR 4', completion: 8.2, status: 'On Track' },
    { project: 'Sci-Fi Thriller', completion: 94.3, status: 'Delayed' },
  ]
};

export function ViewReports() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          icon="BarChart3"
          title="REPORTS & ANALYTICS"
          subtitle="Studio performance and financial reports"
        />
        
        <Button variant="outline" onClick={() => console.log('Export reports')}>
          <Icons.Download className="w-4 h-4 mr-2" />
          EXPORT REPORTS
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value="$425.8M"
          subtitle="Year to date"
          icon="DollarSign"
          iconColor="text-green-600"
          subtitleColor="text-green-600"
          subtitleIcon="TrendingUp"
        />
        <StatCard
          title="Total Expenses"
          value="$192.0M"
          subtitle="45% of budget"
          icon="BarChart3"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Projects Completed"
          value="12"
          subtitle="This year"
          icon="Calendar"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Avg Completion"
          value="49.6%"
          subtitle="All active projects"
          icon="TrendingUp"
          iconColor="text-purple-600"
        />
      </div>

      {/* Monthly Spending */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monthly Spending Overview</CardTitle>
            <Button variant="outline" size="sm">
              <Icons.Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {REPORT_DATA.monthlySpending.map((data) => {
              const percentage = (data.amount / data.budget) * 100;
              return (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{data.month} 2024</span>
                    <span className="text-sm text-muted-foreground">
                      ${(data.amount / 1000000).toFixed(1)}M / ${(data.budget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Project Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {REPORT_DATA.projectPerformance.map((project) => (
              <div key={project.project} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{project.project}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 max-w-xs">
                      <Progress value={project.completion} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{project.completion}%</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'On Track' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {project.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}