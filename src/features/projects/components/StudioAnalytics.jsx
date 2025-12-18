import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Activity, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Progress } from '../../../shared/components/ui/progress';
import { Badge } from '../../../shared/components/ui/badge';
import { PageHeader } from '../../../shared/components/PageHeader';
import { StatCard } from '../components/StatCard';

const ANALYTICS_DATA = {
  efficiency: [
    { metric: 'Budget Efficiency', value: 87, target: 90, status: 'good' },
    { metric: 'Schedule Adherence', value: 92, target: 95, status: 'excellent' },
    { metric: 'Resource Utilization', value: 78, target: 85, status: 'warning' },
    { metric: 'Quality Score', value: 94, target: 90, status: 'excellent' },
  ],
  departmentPerformance: [
    { name: 'Direction', projects: 4, budget: '$45M', efficiency: 91 },
    { name: 'Production', projects: 4, budget: '$120M', efficiency: 88 },
    { name: 'Camera', projects: 3, budget: '$18M', efficiency: 95 },
    { name: 'Post-Production', projects: 2, budget: '$35M', efficiency: 82 },
    { name: 'VFX', projects: 4, budget: '$180M', efficiency: 79 },
    { name: 'Art Department', projects: 3, budget: '$28M', efficiency: 93 },
  ],
  riskFactors: [
    { risk: 'Budget Overruns', level: 'low', projects: 1 },
    { risk: 'Schedule Delays', level: 'low', projects: 1 },
    { risk: 'Resource Shortage', level: 'medium', projects: 2 },
    { risk: 'Technical Challenges', level: 'medium', projects: 1 },
  ]
};

export default function StudioAnalytics({ onNavigate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <PageHeader
        icon="Target"
        title="STUDIO ANALYTICS"
        subtitle="Performance metrics and insights"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Overall Efficiency"
          value="88%"
          subtitle="Above target"
          icon={Target}
          iconColor="text-green-600"
          subtitleColor="text-green-600"
          subtitleIcon={TrendingUp}
        />
        <StatCard
          title="ROI"
          value="245%"
          subtitle="Return on investment"
          icon={DollarSign}
          iconColor="text-blue-600"
          subtitleColor="text-green-600"
          subtitleIcon={TrendingUp}
        />
        <StatCard
          title="Active Risks"
          value="4"
          subtitle="2 medium, 2 low"
          icon={AlertCircle}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Projects On Track"
          value="75%"
          subtitle="3 of 4 projects"
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
      </div>

      {/* Efficiency Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Studio Efficiency Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ANALYTICS_DATA.efficiency.map((metric) => (
              <div key={metric.metric}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{metric.metric}</span>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {metric.value}% / {metric.target}% target
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ANALYTICS_DATA.departmentPerformance.map((dept) => (
                <div key={dept.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {dept.projects} projects • {dept.budget}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        dept.efficiency >= 90 ? 'text-green-600' :
                        dept.efficiency >= 80 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {dept.efficiency}%
                      </p>
                      <p className="text-xs text-muted-foreground">Efficiency</p>
                    </div>
                  </div>
                  <Progress value={dept.efficiency} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ANALYTICS_DATA.riskFactors.map((risk) => (
                <div key={risk.risk} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{risk.risk}</h4>
                      <p className="text-sm text-muted-foreground">
                        Affecting {risk.projects} project{risk.projects > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge className={getRiskColor(risk.level)}>
                      {risk.level.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Schedule Performance Excellent
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  92% schedule adherence across all projects. Camera department leading with 95% efficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-900/30">
              <Activity className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  Resource Utilization Below Target
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  VFX department at 79% efficiency. Consider resource reallocation to optimize utilization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Strong ROI Performance
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  245% return on investment indicates excellent project selection and execution.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}