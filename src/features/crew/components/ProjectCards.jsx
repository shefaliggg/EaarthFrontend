// ProjectCard.jsx - Updated to use CSS color variables
import { Star, Users, Calendar, CalendarCheck, Clapperboard, Video, Tv, Palette, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../../../shared/components/ui/badge';

const projectIcons = {
  'FEATURE FILM': Clapperboard,
  'TELEVISION SERIES': Tv,
  'COMMERCIAL': Video,
  'DOCUMENTARY': Globe,
  'SHORT FILM': Video,
  'MUSIC VIDEO': Video,
  'ANIMATION': Palette,
  'WEB SERIES': Tv,
};

const statusColors = {
  shoot: { 
    bg: 'bg-mint-100 dark:bg-mint-900/30', 
    text: 'text-mint-700 dark:text-mint-300', 
    label: 'SHOOT' 
  },
  prep: { 
    bg: 'bg-sky-100 dark:bg-sky-900/30', 
    text: 'text-sky-700 dark:text-sky-300', 
    label: 'PREP' 
  },
  wrap: { 
    bg: 'bg-peach-100 dark:bg-peach-900/30', 
    text: 'text-peach-700 dark:text-peach-300', 
    label: 'WRAP' 
  },
  post: { 
    bg: 'bg-lavender-100 dark:bg-lavender-900/30', 
    text: 'text-lavender-700 dark:text-lavender-300', 
    label: 'POST' 
  },
  active: { 
    bg: 'bg-mint-100 dark:bg-mint-900/30', 
    text: 'text-mint-700 dark:text-mint-300', 
    label: 'ACTIVE' 
  },
  completed: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground', 
    label: 'COMPLETED' 
  },
  rehearsal: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground', 
    label: 'REHEARSAL' 
  },
  performance: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground', 
    label: 'PERFORMANCE' 
  },
};

export function ProjectCard({
  id,
  title,
  type,
  rating,
  status,
  yourRole,
  roleLabel,
  progress,
  crewCount,
  startDate,
  endDate,
  studio,
  productionCompany,
  isDarkMode,
  onClick,
}) {
  const IconComponent = projectIcons[type.toUpperCase()] || Clapperboard;
  const statusConfig = statusColors[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:scale-[1.02] hover:border-primary/50',
        'bg-card border-border'
      )}
    >
      {/* Top Row: Rating and Status */}
      <div className="flex items-start justify-between mb-4">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-peach-500 fill-peach-500" />
          <span className="text-sm font-bold text-foreground">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn(
            'uppercase text-[10px] font-bold tracking-wider border-0 px-2.5 py-0.5',
            statusConfig.bg,
            statusConfig.text
          )}
        >
          {statusConfig.label}
        </Badge>
      </div>

      {/* Project Icon */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={cn(
            'w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
            'bg-primary/10 group-hover:bg-primary/20'
          )}
        >
          <IconComponent className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Project Title & Type */}
      <div className="mb-4">
        <h3 className="font-bold text-base mb-1 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {type}
        </p>
      </div>

      {/* Your Role */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
          {roleLabel || 'YOUR ROLE'}
        </p>
        <p className="text-sm font-bold line-clamp-1 text-primary">
          {yourRole}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            PROGRESS
          </p>
          <span className="text-sm font-bold text-foreground">
            {progress}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        {/* Crew Count */}
        <div className="flex flex-col items-center">
          <Users className="w-4 h-4 text-muted-foreground mb-1" strokeWidth={1.5} />
          <span className="text-sm font-bold text-foreground">
            {crewCount}
          </span>
        </div>

        {/* Start Date */}
        <div className="flex flex-col items-center">
          <Calendar className="w-4 h-4 text-muted-foreground mb-1" strokeWidth={1.5} />
          <span className="text-[10px] font-bold text-foreground">
            {new Date(startDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
          </span>
        </div>

        {/* End Date */}
        <div className="flex flex-col items-center">
          <CalendarCheck className="w-4 h-4 text-muted-foreground mb-1" strokeWidth={1.5} />
          <span className="text-[10px] font-bold text-foreground">
            {new Date(endDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Studio Name */}
      <div className="mt-4 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground font-semibold truncate">{studio}</span>
        {productionCompany && (
          <span className="text-muted-foreground font-semibold truncate ml-2">{productionCompany}</span>
        )}
      </div>
    </div>
  );
}