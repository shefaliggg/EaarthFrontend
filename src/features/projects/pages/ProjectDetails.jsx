import React, { useState } from 'react';
import {
  Film,
  Calendar,
  Users,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart3,
  Target,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  MapPin,
  Camera,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock project detail data - matches ProjectDashboardPage data
const PROJECT_DETAIL = {
  id: 'avatar1',
  name: 'AVATAR 1',
  status: 'active',
  phase: 'Principal Photography',
  description: 'Epic science fiction film set on the fictional moon Pandora, where humans are mining a precious mineral. The story follows a paraplegic Marine who becomes torn between following orders and protecting the world he feels is his home.',
  stats: {
    budget: 150000000,
    spent: 89500000,
    daysShot: 58,
    totalDays: 120,
    crewSize: 247,
    departments: 24,
    completion: 48,
    onSchedule: true,
    onBudget: true,
  },
  director: 'James Cameron',
  producer: 'Jon Landau',
  startDate: '2024-02-01',
  endDate: '2024-05-30',
  keyDepartments: [
    { name: 'Direction', head: 'James Cameron', members: 8, status: 'ACTIVE' },
    { name: 'Production', head: 'Jon Landau', members: 45, status: 'ACTIVE' },
    { name: 'Camera', head: 'Russell Carpenter', members: 28, status: 'ACTIVE' },
    { name: 'VFX', head: 'Joe Letteri', members: 156, status: 'ACTIVE' },
    { name: 'Sound', head: 'Christopher Boyes', members: 22, status: 'ACTIVE' },
    { name: 'Art Department', head: 'Rick Carter', members: 83, status: 'ACTIVE' },
  ],
  todayShoot: {
    callTime: '6:00 AM',
    location: 'Pinewood Studios - Stage 7',
    scenes: 12,
    pages: 8.5,
    crew: 89,
    cast: 15
  },
  recentActivity: [
    { date: '2024-12-18', activity: 'Call sheet published', detail: 'Day 59 - Pinewood Stage 7', time: '15 min ago', user: 'Sarah Chen', type: 'milestone' },
    { date: '2024-12-17', activity: 'Budget revision approved', detail: 'VFX Department +$500K', time: '2 hours ago', user: 'Michael Torres', type: 'budget' },
    { date: '2024-12-16', activity: 'Crew contract signed', detail: 'John Smith - Key Grip', time: '4 hours ago', user: 'HR Department', type: 'team' },
    { date: '2024-12-15', activity: 'Location scouting complete', detail: '3 new locations approved', time: '1 day ago', user: 'Location Team', type: 'review' },
  ],
  upcomingMilestones: [
    { date: '2024-12-22', milestone: 'Mid-Production Review', status: 'current' },
    { date: '2024-12-30', milestone: 'Complete Act 2 Photography', status: 'upcoming' },
    { date: '2025-01-15', milestone: 'VFX Pre-viz Review', status: 'upcoming' },
    { date: '2025-05-30', milestone: 'Principal Photography Wrap', status: 'upcoming' },
  ],
  alerts: [
    { type: 'warning', message: 'Budget review required for VFX department', time: '2h ago' },
    { type: 'info', message: 'Weather forecast update for tomorrow\'s shoot', time: '4h ago' },
    { type: 'success', message: 'All crew timesheets approved for Week 8', time: '1d ago' },
  ],
  budgetBreakdown: [
    { category: 'Above the Line', amount: 45200000, status: 'under', variance: -5 },
    { category: 'Production', amount: 28700000, status: 'on', variance: 0 },
    { category: 'Post-Production', amount: 12600000, status: 'pending', variance: 0 },
    { category: 'Contingency', amount: 3000000, status: 'remaining', variance: 80 },
  ]
};

export default function ProjectDetails({ onNavigate, projectId = 'avatar1' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const project = PROJECT_DETAIL;

  const formatCurrency = (amount) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'review':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'team':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'budget':
        return <DollarSign className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const budgetPercentage = (project.stats.spent / project.stats.budget) * 100;

  return (
   <div className='space-y-6 container mx-auto'>
      <PageHeader
        icon="Film"
        title={project.name}
        subtitle={`${project.phase} - Principal Photography in Progress`}
      />

      {/* Key Metrics Row - Using StatCard Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Budget Status"
          value={formatCurrency(project.stats.spent)}
          subtitle={`of ${formatCurrency(project.stats.budget)} (${budgetPercentage.toFixed(1)}% spent)`}
          icon="DollarSign"
          iconColor={budgetPercentage > 90 ? "text-red-600" : "text-green-600"}
          subtitleColor="text-muted-foreground"
        />
        
        <StatCard
          title="Schedule"
          value={`${project.stats.daysShot}/${project.stats.totalDays}`}
          subtitle="Days shot - On Track"
          icon="Calendar"
          iconColor="text-blue-600"
          subtitleColor="text-muted-foreground"
        />
        
        <StatCard
          title="Crew Size"
          value={project.stats.crewSize}
          subtitle="+12 this week"
          icon="Users"
          iconColor="text-purple-600"
          subtitleColor="text-green-600"
          subtitleIcon="TrendingUp"
        />
        
        <StatCard
          title="Completion"
          value={`${project.stats.completion}%`}
          subtitle={project.phase}
          icon="Target"
          iconColor="text-orange-600"
          subtitleColor="text-muted-foreground"
        />
      </div>

      {/* Today's Shoot Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              TODAY'S SHOOT
            </h3>
            <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ACTIVE
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">CALL TIME</div>
              <div className="font-bold">{project.todayShoot.callTime}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground mb-1">LOCATION</div>
              <div className="font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {project.todayShoot.location}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">SCENES</div>
              <div className="font-bold">{project.todayShoot.scenes}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">PAGES</div>
              <div className="font-bold">{project.todayShoot.pages}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">CREW/CAST</div>
              <div className="font-bold">{project.todayShoot.crew}/{project.todayShoot.cast}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
          <TabsTrigger value="team">TEAM</TabsTrigger>
          <TabsTrigger value="milestones">MILESTONES</TabsTrigger>
          <TabsTrigger value="activity">ACTIVITY</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  PROJECT INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2 font-semibold">DESCRIPTION</p>
                  <p className="text-sm leading-relaxed">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">DIRECTOR</p>
                    <p className="font-semibold">{project.director}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">PRODUCER</p>
                    <p className="font-semibold">{project.producer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">START DATE</p>
                    <p className="font-semibold">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">END DATE</p>
                    <p className="font-semibold">{formatDate(project.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {project.stats.onSchedule ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">On Schedule</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Behind Schedule</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {project.stats.onBudget ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">On Budget</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Over Budget</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts & Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  ALERTS & ISSUES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className={cn(
                        'w-2 h-2 rounded-full mt-2',
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      )} />
                      <div className="flex-1">
                        <div className="text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                BUDGET ANALYTICS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.budgetBreakdown.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-2">{item.category.toUpperCase()}</div>
                    <div className="text-xl font-bold">{formatCurrency(item.amount)}</div>
                    <div className={cn(
                      'text-xs mt-1 flex items-center gap-1',
                      item.status === 'under' ? 'text-green-600' :
                      item.status === 'on' ? 'text-blue-600' :
                      item.status === 'pending' ? 'text-gray-600' : 'text-green-600'
                    )}>
                      {item.status === 'under' && (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          {Math.abs(item.variance)}% under budget
                        </>
                      )}
                      {item.status === 'on' && (
                        <>
                          <Activity className="w-3 h-3" />
                          On budget
                        </>
                      )}
                      {item.status === 'pending' && (
                        <>
                          <Clock className="w-3 h-3" />
                          Not started
                        </>
                      )}
                      {item.status === 'remaining' && (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          {item.variance}% remaining
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                KEY DEPARTMENTS ({project.keyDepartments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.keyDepartments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-600 text-white font-bold">
                          {dept.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dept.head}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dept.members} members
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {dept.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                PROJECT MILESTONES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      milestone.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                      milestone.status === 'current' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      'bg-gray-100 dark:bg-gray-800'
                    )}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : milestone.status === 'current' ? (
                        <Clock className="w-4 h-4 text-blue-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{milestone.milestone}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(milestone.date)}</div>
                    </div>
                    <Badge variant="outline" className="uppercase font-bold text-xs">
                      {milestone.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                RECENT ACTIVITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">{item.activity}</div>
                      <div className="text-sm text-muted-foreground">{item.detail}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                      <div className="text-xs font-medium">{item.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            QUICK ACTIONS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('project-calendar')}
            >
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">View Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('project-accounts')}
            >
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Accounting</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('project-crew')}
            >
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Manage Crew</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 hover:bg-accent"
              onClick={() => onNavigate?.('settings')}
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}