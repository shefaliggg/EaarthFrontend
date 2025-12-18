import React from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/lib/utils';

export function ProjectCard({
  id,
  name,
  status,
  phase,
  lightColor,
  darkColor,
  bgLight,
  bgDark,
  stats,
  onOpen
}) {
  const formatCurrency = (amount) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Icons.Play className="w-4 h-4" />;
      case 'paused':
        return <Icons.Pause className="w-4 h-4" />;
      case 'completed':
        return <Icons.Archive className="w-4 h-4" />;
      default:
        return <Icons.Film className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Development':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'Pre-Production':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Principal Photography':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Post-Production':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={cn('text-xl font-bold', darkColor)}>
                  {name}
                </h3>
                <Badge className={getPhaseColor(phase)}>
                  {phase}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Icons.Activity className="w-4 h-4" />
                  {stats.completion}% Complete
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpen(id)}
            >
              <Icons.ArrowRight className="w-4 h-4 mr-1" />
              OPEN
            </Button>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-bold">{stats.completion}%</span>
            </div>
            <Progress value={stats.completion} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className={cn('p-3 rounded-lg', bgDark)}>
              <div className="text-xs text-muted-foreground mb-1">Budget</div>
              <div className={cn('font-bold', darkColor)}>
                {formatCurrency(stats.budget)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.spent)} spent
              </div>
            </div>

            <div className={cn('p-3 rounded-lg', bgDark)}>
              <div className="text-xs text-muted-foreground mb-1">Schedule</div>
              <div className={cn('font-bold', darkColor)}>
                {stats.daysShot}/{stats.totalDays}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Days shot</div>
            </div>

            <div className={cn('p-3 rounded-lg', bgDark)}>
              <div className="text-xs text-muted-foreground mb-1">Team</div>
              <div className={cn('font-bold', darkColor)}>
                {stats.crewSize}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.department} depts
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              {stats.onSchedule ? (
                <>
                  <Icons.CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">On Schedule</span>
                </>
              ) : (
                <>
                  <Icons.AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Behind Schedule</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {stats.onBudget ? (
                <>
                  <Icons.CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">On Budget</span>
                </>
              ) : (
                <>
                  <Icons.AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Over Budget</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}