import React, { useState } from 'react';
import {
  Film,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
  Image,
  Video,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Progress } from '../../../shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Avatar, AvatarFallback } from '../../../shared/components/ui/avatar';
import { PageHeader } from '../../../shared/components/PageHeader';
import { cn } from '@/lib/utils';

// Mock project detail data
const PROJECT_DETAIL = {
  id: 'avatar1',
  name: 'AVATAR 1',
  status: 'active',
  phase: 'Principal Photography',
  color: 'blue',
  lightColor: 'text-blue-600',
  darkColor: 'text-blue-400',
  bgLight: 'bg-blue-50',
  bgDark: 'bg-blue-950',
  description: 'Epic science fiction film set on the fictional moon Pandora, where humans are mining a precious mineral. The story follows a paraplegic Marine who becomes torn between following orders and protecting the world he feels is his home.',
  stats: {
    budget: 150000000,
    spent: 89500000,
    daysShot: 87,
    totalDays: 120,
    crewSize: 342,
    department: 24,
    completion: 72.5,
    onSchedule: true,
    onBudget: true,
  },
  director: 'James Cameron',
  producer: 'Jon Landau',
  startDate: '2024-01-15',
  endDate: '2024-12-20',
  keyDepartments: [
    { name: 'Direction', head: 'James Cameron', members: 8, status: 'active' },
    { name: 'Production', head: 'Jon Landau', members: 45, status: 'active' },
    { name: 'Camera', head: 'Russell Carpenter', members: 28, status: 'active' },
    { name: 'VFX', head: 'Joe Letteri', members: 156, status: 'active' },
    { name: 'Sound', head: 'Christopher Boyes', members: 22, status: 'active' },
    { name: 'Art Department', head: 'Rick Carter', members: 83, status: 'active' },
  ],
  recentActivity: [
    { date: '2024-12-18', activity: 'Completed Scene 47 - Forest Chase', type: 'milestone' },
    { date: '2024-12-17', activity: 'VFX Review - 85 shots approved', type: 'review' },
    { date: '2024-12-16', activity: 'Added 12 new crew members to Camera dept', type: 'team' },
    { date: '2024-12-15', activity: 'Budget revision approved - $2M additional', type: 'budget' },
  ],
  upcomingMilestones: [
    { date: '2024-12-22', milestone: 'Complete Act 2 Photography', status: 'upcoming' },
    { date: '2024-12-30', milestone: 'VFX Pre-viz Review', status: 'upcoming' },
    { date: '2025-01-15', milestone: 'Begin Post-Production', status: 'planned' },
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <PageHeader
        icon="Film"
        title={project.name}
        subtitle={project.description.substring(0, 100) + '...'}
      />

      {/* Project Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-4 h-4 text-green-600" />
              <p className="text-xs text-muted-foreground font-semibold">STATUS</p>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {project.phase}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-muted-foreground font-semibold">BUDGET</p>
            </div>
            <p className="text-lg font-bold">{formatCurrency(project.stats.budget)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(project.stats.spent)} spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-muted-foreground font-semibold">SCHEDULE</p>
            </div>
            <p className="text-lg font-bold">{project.stats.daysShot}/{project.stats.totalDays}</p>
            <p className="text-xs text-muted-foreground">Days shot</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-orange-600" />
              <p className="text-xs text-muted-foreground font-semibold">CREW</p>
            </div>
            <p className="text-lg font-bold">{project.stats.crewSize}</p>
            <p className="text-xs text-muted-foreground">{project.stats.department} departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-green-600" />
              <p className="text-xs text-muted-foreground font-semibold">PROGRESS</p>
            </div>
            <p className="text-lg font-bold">{project.stats.completion}%</p>
            <Progress value={project.stats.completion} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Director</p>
                    <p className="font-medium">{project.director}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Producer</p>
                    <p className="font-medium">{project.producer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                    <p className="font-medium">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">End Date</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Project Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">On Schedule</p>
                      <p className="text-sm text-green-700 dark:text-green-300">72.5% complete, 87 of 120 days</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">On Budget</p>
                      <p className="text-sm text-green-700 dark:text-green-300">{formatCurrency(project.stats.spent)} of {formatCurrency(project.stats.budget)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Active Production</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">342 crew members working</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{new Date(milestone.date).getDate()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{milestone.milestone}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(milestone.date)}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{milestone.status}</Badge>
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
              <CardTitle>Key Departments ({project.keyDepartments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.keyDepartments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
                          {dept.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dept.head} • {dept.members} members
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

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="mt-0.5">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.activity}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Schedule view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Budget details coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}