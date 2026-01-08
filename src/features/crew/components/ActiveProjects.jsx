import React from 'react';
import { Film, Calendar, ArrowRight, Briefcase } from 'lucide-react';
import { cn } from '../../../config/utils';
import { Badge } from '../../../shared/components/ui/badge';
import { toast } from 'sonner';

export function ActiveProjects({ isDarkMode }) {
  const activeProjects = [
    {
      id: 1,
      name: 'AVATAR 3',
      role: 'Director of Photography',
      department: 'Camera',
      status: 'In Production',
      startDate: '2024-12-01',
      endDate: '2025-03-15',
      nextCallTime: '2024-11-28 06:00',
      dayRate: 2500,
      statusColor: 'green'
    },
    {
      id: 2,
      name: 'The Crown - Season 7',
      role: 'Camera Operator',
      department: 'Camera',
      status: 'Pre-Production',
      startDate: '2025-01-10',
      endDate: '2025-04-30',
      nextCallTime: 'TBD',
      dayRate: 1800,
      statusColor: 'blue'
    }
  ];

  const recentOpportunities = [
    {
      id: 1,
      project: 'Untitled Sci-Fi Thriller',
      role: 'Director of Photography',
      studio: 'Warner Bros',
      rate: '$3,000/day',
      startDate: '2025-02-15',
      status: 'New',
      unread: true
    },
    {
      id: 2,
      project: 'Netflix Limited Series',
      role: 'Camera Operator',
      studio: 'Netflix',
      rate: '$1,500/day',
      startDate: '2025-03-01',
      status: 'Viewed',
      unread: false
    }
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn(
          "text-xl font-black flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Film className="w-5 h-5 text-blue-600" />
          Active Projects
        </h2>
        <button
          onClick={() => toast.info('Opening all projects...')}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          VIEW ALL
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4">
        {activeProjects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer",
              isDarkMode
                ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
            )}
            onClick={() => toast.info(`Opening ${project.name}...`)}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className={cn(
                  "font-black mb-1",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {project.name}
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {project.role} • {project.department}
                </p>
              </div>
              <Badge
                className={cn(
                  "text-xs font-bold",
                  project.statusColor === 'green' && "bg-green-500/20 text-green-600 border-green-500/30",
                  project.statusColor === 'blue' && "bg-blue-500/20 text-blue-600 border-blue-500/30"
                )}
              >
                {project.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                )}>
                  Next Call Time
                </p>
                <p className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                  {project.nextCallTime}
                </p>
              </div>
              <div>
                <p className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                )}>
                  Day Rate
                </p>
                <p className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                  ${project.dayRate.toLocaleString()}
                </p>
              </div>
            </div>

            <div className={cn(
              "flex items-center gap-4 text-xs",
              isDarkMode ? "text-gray-500" : "text-gray-400"
            )}>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {project.startDate} - {project.endDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Opportunities */}
      <div className={cn(
        "mt-6 pt-6 border-t",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}>
        <h3 className={cn(
          "font-black mb-4 flex items-center gap-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Briefcase className="w-4 h-4 text-blue-600" />
          Recent Opportunities
        </h3>
        <div className="space-y-3">
          {recentOpportunities.map((opp) => (
            <div
              key={opp.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                opp.unread
                  ? isDarkMode
                    ? "bg-blue-600/10 border-blue-500/30"
                    : "bg-blue-50 border-blue-200"
                  : isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200"
              )}
              onClick={() => toast.info(`Opening ${opp.project}...`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-sm mb-1", isDarkMode ? "text-white" : "text-gray-900")}>
                    {opp.project}
                  </p>
                  <p className={cn(
                    "text-xs mb-2",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {opp.role} • {opp.studio}
                  </p>
                  <div className={cn(
                    "flex items-center gap-3 text-xs",
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  )}>
                    <span className="font-bold text-green-600">{opp.rate}</span>
                    <span>Starts {opp.startDate}</span>
                  </div>
                </div>
                {opp.unread && (
                  <Badge className="bg-blue-600 text-white text-xs">NEW</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}