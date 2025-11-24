import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import ViewToggleButton from '../../../shared/components/ViewToggleButton';
import ProjectActionGridCard from '../components/ProjectActionGridCard';
import ProjectActionListCard from '../components/ProjectActionListCard';
import { useFavorites } from '../hooks/useFavorites';
import { Minus } from 'lucide-react';

function ProjectCallSheets() {
  const { isFavorite } = useFavorites('project-callsheet-favorites');
  const params = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const currentProjectName = params.projectName.replace("-", " ").toUpperCase() || 'PROJECT';

  const callSheetSections = [
    { id: 'today', icon: "FileText", title: 'TODAY\'S CALL SHEET', subtitle: 'View today\'s call sheet' },
    { id: 'upcoming', icon: "CalendarClock", title: 'UPCOMING', subtitle: 'Upcoming call sheets' },
    { id: 'past', icon: "Clock", title: 'PAST', subtitle: 'Historical call sheets' },
    { id: 'draft', icon: "FileCheck", title: 'DRAFTS', subtitle: 'Draft call sheets' },
    { id: 'templates', icon: "FileStack", title: 'TEMPLATES', subtitle: 'Call sheet templates' },
  ];

  const sortedSections = [...callSheetSections].sort((a, b) => {
    const aFav = isFavorite(a.id);
    const bFav = isFavorite(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className='flex justify-between pr-2'>
          <h2 className={`text-3xl font-bold text-foreground flex items-center gap-2`}>
            CALL SHEETS <Minus /> {currentProjectName}
          </h2>
          <ViewToggleButton view={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {sortedSections.map((section, index) => (
              <ProjectActionGridCard
                feature={
                  {
                    id: section.id,
                    label: section.title,
                    subtitle: section.subtitle,
                    icon: section.icon
                  }
                }
                key={index}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {sortedSections.map((section, index) => (
              <ProjectActionListCard
                feature={
                  {
                    id: section.id,
                    label: section.title,
                    subtitle: section.subtitle,
                    icon: section.icon
                  }
                }
                key={index}
              />
            ))}
          </div>
        )}
      </div>
  );
};


export default ProjectCallSheets



