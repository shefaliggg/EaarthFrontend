import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { cn } from '@/shared/config/utils';

export function QuickActionButton({
  icon,
  label,
  onClick,
  variant = 'outline',
  className
}) {
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "h-auto py-4 px-4 flex flex-col gap-2 items-center justify-center",
        "transition-all duration-200 hover:scale-105 hover:shadow-md",
        "bg-card hover:bg-accent/10 border-border",
        "group relative overflow-hidden",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender-500/0 to-lavender-600/0 group-hover:from-lavender-500/5 group-hover:to-lavender-600/5 transition-all duration-300 dark:group-hover:from-lavender-400/10 dark:group-hover:to-lavender-500/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {IconComponent && (
          <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-lavender-600 dark:group-hover:text-lavender-400 transition-colors duration-200" />
        )}
        <span className="text-sm font-medium text-foreground group-hover:text-lavender-600 dark:group-hover:text-lavender-400 transition-colors duration-200">
          {label}
        </span>
      </div>
    </Button>
  );
}