import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/PageHeader';
import { StatCard } from '../components/StatCard';
import { ProjectCard } from '../components/ProjectCard';
import { QuickActionButton } from '../components/QuickActionButton';

// Mock project data with live statistics
const LIVE_PROJECTS = [
  {
    id: 'avatar1',
    name: 'AVATAR 1',
    status: 'active',
    phase: 'Principal Photography',
    color: 'blue',
    lightColor: 'text-blue-600',
    darkColor: 'text-blue-400',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-950',
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
    }
  },
  {
    id: 'avatar3',
    name: 'AVATAR 3',
    status: 'active',
    phase: 'Pre-Production',
    color: 'cyan',
    lightColor: 'text-cyan-600',
    darkColor: 'text-cyan-400',
    bgLight: 'bg-cyan-50',
    bgDark: 'bg-cyan-950',
    stats: {
      budget: 175000000,
      spent: 12400000,
      daysShot: 0,
      totalDays: 145,
      crewSize: 89,
      department: 12,
      completion: 23.5,
      onSchedule: true,
      onBudget: true,
    }
  },
  {
    id: 'avatar4',
    name: 'AVATAR 4',
    status: 'active',
    phase: 'Development',
    color: 'emerald',
    lightColor: 'text-emerald-600',
    darkColor: 'text-emerald-400',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-950',
    stats: {
      budget: 180000000,
      spent: 5800000,
      daysShot: 0,
      totalDays: 150,
      crewSize: 34,
      department: 8,
      completion: 8.2,
      onSchedule: true,
      onBudget: true,
    }
  },
  {
    id: 'scifi-thriller',
    name: 'Untitled Sci-Fi Thriller',
    status: 'active',
    phase: 'Post-Production',
    color: 'purple',
    lightColor: 'text-purple-600',
    darkColor: 'text-purple-400',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-950',
    stats: {
      budget: 85000000,
      spent: 84200000,
      daysShot: 68,
      totalDays: 68,
      crewSize: 156,
      department: 18,
      completion: 94.3,
      onSchedule: false,
      onBudget: false,
    }
  },
];

export function ProjectInformationDashboard() {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const totalBudget = LIVE_PROJECTS.reduce((sum, p) => sum + p.stats.budget, 0);
  const totalCrew = LIVE_PROJECTS.reduce((sum, p) => sum + p.stats.crewSize, 0);
  const totalSpent = LIVE_PROJECTS.reduce((sum, p) => sum + p.stats.spent, 0);
  const activeProjects = LIVE_PROJECTS.filter(p => p.status === 'active').length;

  const handleProjectOpen = (projectId) => {
    navigate(`/projects/details/${projectId}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          icon="Film"
          title="PROJECTS"
          subtitle="Studio Project Dashboard"
        />
        
        <Button onClick={() => navigate('/projects/create')}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          CREATE NEW PROJECT
        </Button>
      </div>

      {/* Studio Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Production pipeline"
          icon="Film"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          subtitle="Across all projects"
          icon="DollarSign"
          iconColor="text-green-600"
          subtitleColor="text-green-600"
          subtitleIcon="TrendingUp"
        />

        <StatCard
          title="Total Crew"
          value={totalCrew}
          subtitle="Across all projects"
          icon="Users"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          subtitle="On budget"
          icon="BarChart3"
          iconColor="text-orange-600"
          subtitleColor="text-green-600"
          subtitleIcon="CheckCircle2"
        />
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {LIVE_PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            onOpen={handleProjectOpen}
          />
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionButton
              icon="Plus"
              label="Create Project"
              onClick={() => navigate('/projects/create')}
            />
            <QuickActionButton
              icon="BarChart3"
              label="View Reports"
              onClick={() => navigate('/projects/reports')}
            />
            <QuickActionButton
              icon="Users"
              label="Manage Team"
              onClick={() => navigate('/projects/team')}
            />
            <QuickActionButton
              icon="Target"
              label="Studio Analytics"
              onClick={() => navigate('/projects/analytics')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}