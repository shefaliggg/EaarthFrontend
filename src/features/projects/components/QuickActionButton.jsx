import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function QuickActionButton({
  icon,
  label,
  onClick
}) {
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-4 flex flex-col gap-2"
    >
      {IconComponent && <IconComponent className="w-5 h-5" />}
      <span>{label}</span>
    </Button>
  );
}