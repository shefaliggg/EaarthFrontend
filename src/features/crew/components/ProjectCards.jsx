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
  shoot: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'SHOOT' },
  prep: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'PREP' },
  wrap: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'WRAP' },
  post: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'POST' },
  active: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'ACTIVE' },
  completed: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'COMPLETED' },
  rehearsal: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'REHEARSAL' },
  performance: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'PERFORMANCE' },
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
        'relative rounded-xl p-4 border transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:scale-[1.01] hover:border-primary/50',
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-900/50 border-gray-800 hover:from-gray-800 hover:to-gray-900'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:from-gray-50 hover:to-white'
      )}
    >
      {/* Top Row: Rating and Status */}
      <div className="flex items-start justify-between mb-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className={cn('text-xs font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn(
            'uppercase text-[10px] font-bold tracking-wider border-0 px-2 py-0.5',
            statusConfig.bg,
            statusConfig.text
          )}
        >
          {statusConfig.label}
        </Badge>
      </div>

      {/* Project Icon */}
      <div className="flex items-center justify-center mb-3">
        <div
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
            isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'
          )}
        >
          <IconComponent className={cn('w-7 h-7', 'text-purple-600')} strokeWidth={1.5} />
        </div>
      </div>

      {/* Project Title & Type */}
      <div className="mb-3">
        <h3
          className={cn(
            'font-bold text-sm mb-0.5 line-clamp-1',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}
        >
          {title}
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {type}
        </p>
      </div>

      {/* Your Role */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">
          {roleLabel || 'YOUR ROLE'}
        </p>
        <p className={cn("text-xs font-bold line-clamp-1", isDarkMode ? "text-purple-400" : "text-purple-600")}>
          {yourRole}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            PROGRESS
          </p>
          <span className={cn('text-xs font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
            {progress}%
          </span>
        </div>
        <div
          className={cn(
            'h-1.5 rounded-full overflow-hidden',
            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          )}
        >
          <div
            className="h-full bg-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div
        className={cn(
          'grid grid-cols-3 gap-3 pt-3 border-t',
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        )}
      >
        {/* Crew Count */}
        <div className="flex flex-col items-center">
          <Users className="w-3.5 h-3.5 text-muted-foreground mb-1" />
          <span className={cn('text-xs font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
            {crewCount}
          </span>
        </div>

        {/* Start Date */}
        <div className="flex flex-col items-center">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground mb-1" />
          <span className={cn('text-[10px] font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
            {new Date(startDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
          </span>
        </div>

        {/* End Date */}
        <div className="flex flex-col items-center">
          <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground mb-1" />
          <span className={cn('text-[10px] font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
            {new Date(endDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Studio Name */}
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground font-medium truncate">{studio}</span>
        {productionCompany && (
          <span className="text-muted-foreground font-medium truncate ml-2">{productionCompany}</span>
        )}
      </div>
    </div>
  );
}