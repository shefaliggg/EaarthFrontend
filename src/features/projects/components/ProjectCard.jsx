import React from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Progress } from '../../../shared/components/ui/progress';
import { cn } from '@/lib/utils';

export function ProjectCard({
  id,
  name,
  status,
  phase,
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
      case 'on_hold':
        return <Icons.Pause className="w-4 h-4" />;
      case 'completed':
        return <Icons.Archive className="w-4 h-4" />;
      case 'cancelled':
        return <Icons.XCircle className="w-4 h-4" />;
      default:
        return <Icons.Film className="w-4 h-4" />;
    }
  };

  const getPhaseStyles = (phase) => {
    switch (phase) {
      case 'Development':
        return {
          badge: 'bg-muted text-muted-foreground',
          accent: 'text-muted-foreground',
          bg: 'bg-muted/50'
        };
      case 'Pre-Production':
        return {
          badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
          accent: 'text-sky-600 dark:text-sky-400',
          bg: 'bg-sky-50 dark:bg-sky-900/20'
        };
      case 'Principal Photography':
        return {
          badge: 'bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-400',
          accent: 'text-mint-600 dark:text-mint-400',
          bg: 'bg-mint-50 dark:bg-mint-900/20'
        };
      case 'Post-Production':
        return {
          badge: 'bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-400',
          accent: 'text-lavender-600 dark:text-lavender-400',
          bg: 'bg-lavender-50 dark:bg-lavender-900/20'
        };
      case 'Distribution':
        return {
          badge: 'bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-400',
          accent: 'text-peach-600 dark:text-peach-400',
          bg: 'bg-peach-50 dark:bg-peach-900/20'
        };
      default:
        return {
          badge: 'bg-muted text-muted-foreground',
          accent: 'text-muted-foreground',
          bg: 'bg-muted/50'
        };
    }
  };

  const phaseStyles = getPhaseStyles(phase);

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className={cn('text-xl font-bold', phaseStyles.accent)}>
                  {name}
                </h3>
                <Badge className={cn('shrink-0', phaseStyles.badge)}>
                  {phase}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icons.Activity className="w-4 h-4" />
                  {stats.completion}% Complete
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpen(id)}
              className="shrink-0"
            >
              <Icons.ArrowRight className="w-4 h-4 mr-1.5" />
              OPEN
            </Button>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className={cn('font-bold', phaseStyles.accent)}>
                {stats.completion}%
              </span>
            </div>
            <Progress 
              value={stats.completion} 
              className="h-2"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className={cn('p-3 rounded-lg border border-border', phaseStyles.bg)}>
              <div className="text-xs text-muted-foreground mb-1">Budget</div>
              <div className={cn('font-bold text-base', phaseStyles.accent)}>
                {formatCurrency(stats.budget)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.spent)} spent
              </div>
            </div>

            <div className={cn('p-3 rounded-lg border border-border', phaseStyles.bg)}>
              <div className="text-xs text-muted-foreground mb-1">Schedule</div>
              <div className={cn('font-bold text-base', phaseStyles.accent)}>
                {stats.daysShot}/{stats.totalDays}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Days shot</div>
            </div>

            <div className={cn('p-3 rounded-lg border border-border', phaseStyles.bg)}>
              <div className="text-xs text-muted-foreground mb-1">Team</div>
              <div className={cn('font-bold text-base', phaseStyles.accent)}>
                {stats.crewSize}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.department} depts
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4 pt-3 border-t border-border flex-wrap">
            <div className="flex items-center gap-2">
              {stats.onSchedule ? (
                <>
                  <Icons.CheckCircle2 className="w-4 h-4 text-mint-600 dark:text-mint-400" />
                  <span className="text-sm text-mint-600 dark:text-mint-400 font-medium">On Schedule</span>
                </>
              ) : (
                <>
                  <Icons.AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">Behind Schedule</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {stats.onBudget ? (
                <>
                  <Icons.CheckCircle2 className="w-4 h-4 text-mint-600 dark:text-mint-400" />
                  <span className="text-sm text-mint-600 dark:text-mint-400 font-medium">On Budget</span>
                </>
              ) : (
                <>
                  <Icons.AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">Over Budget</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}