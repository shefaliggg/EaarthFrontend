import React from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  subtitleColor = 'text-muted-foreground',
  subtitleIcon
}) {
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;
  const SubtitleIcon = subtitleIcon && Icons[subtitleIcon] ? Icons[subtitleIcon] : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            <p className={`text-xs mt-2 flex items-center gap-1 ${subtitleColor}`}>
              {SubtitleIcon && <SubtitleIcon className="w-3 h-3" />}
              {subtitle}
            </p>
          </div>
          {IconComponent && <IconComponent className={`w-6 h-6 ${iconColor}`} />}
        </div>
      </CardContent>
    </Card>
  );
}