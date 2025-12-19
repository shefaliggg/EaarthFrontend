import React from 'react';
import { Clock, Calendar, MapPin, Video, Camera, FileText } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Badge } from '../../../shared/components/ui/badge';

export default function UpcomingSchedule({ isDarkMode }) {
  const scheduleItems = [
    {
      id: 1,
      project: 'AVATAR 3',
      date: '2024-11-28',
      callTime: '06:00',
      wrapTime: '18:00',
      location: 'Fox Studios - Stage 4',
      address: '1234 Studio Drive, Los Angeles, CA',
      scene: 'Underwater Sequence',
      notes: 'Bring wetsuit, underwater camera equipment',
      icon: Video,
      status: 'confirmed'
    },
    {
      id: 2,
      project: 'AVATAR 3',
      date: '2024-11-29',
      callTime: '07:00',
      wrapTime: '19:00',
      location: 'Fox Studios - Stage 2',
      address: '1234 Studio Drive, Los Angeles, CA',
      scene: 'Lab Interior',
      notes: 'Standard camera package',
      icon: Camera,
      status: 'confirmed'
    },
    {
      id: 3,
      project: 'The Crown',
      date: '2024-12-02',
      callTime: '08:00',
      wrapTime: '16:00',
      location: 'Lancaster House',
      address: 'Stable Yard, St James\'s, London',
      scene: 'Tech Scout',
      notes: 'Bring measurement tools, lighting meter',
      icon: FileText,
      status: 'tentative'
    },
    {
      id: 4,
      project: 'AVATAR 3',
      date: '2024-12-03',
      callTime: '06:30',
      wrapTime: '18:30',
      location: 'Fox Studios - Backlot',
      address: '1234 Studio Drive, Los Angeles, CA',
      scene: 'Forest Exterior',
      notes: 'Outdoor shoot, weather dependent',
      icon: Camera,
      status: 'confirmed'
    },
    {
      id: 5,
      project: 'AVATAR 3',
      date: '2024-12-04',
      callTime: '07:00',
      wrapTime: '19:00',
      location: 'Fox Studios - Stage 1',
      address: '1234 Studio Drive, Los Angeles, CA',
      scene: 'Command Center',
      notes: 'Complex lighting setup required',
      icon: Video,
      status: 'confirmed'
    }
  ];


  return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <h2 className={cn(
          "text-lg font-black flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Clock className="w-5 h-5 text-primary" />
          UPCOMING SCHEDULE
        </h2>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {scheduleItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={cn(
                "p-4 rounded-lg border transition-all hover:shadow-md",
                isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  isDarkMode ? "bg-primary/20" : "bg-primary/10"
                )}>
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {item.project}
                    </p>
                    <Badge 
                      className={cn(
                        "text-xs font-bold",
                        item.status === 'confirmed' 
                          ? "bg-green-500/20 text-green-600 border-green-500/30"
                          : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                      )}
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <h3 className={cn(
                    "font-black text-sm mb-2",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {item.scene}
                  </h3>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                        {item.date}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {item.callTime} - {item.wrapTime}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                        {item.location}
                      </span>
                    </div>

                    {item.notes && (
                      <div className={cn(
                        "mt-2 p-2 rounded border text-xs",
                        isDarkMode ? "bg-gray-900/50 border-gray-600" : "bg-white border-gray-200"
                      )}>
                        <span className="text-muted-foreground">Notes: </span>
                        <span className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                          {item.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}