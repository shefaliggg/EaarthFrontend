import { CheckSquare, Star } from 'lucide-react';
import React, { useState } from 'react'
import ViewToggleButton from '../../../shared/components/ViewToggleButton';
import ProjectActionGridCard from './ProjectActionGridCard';
import ProjectActionListCard from './ProjectActionListCard';

function ProjectActionsLayout({ projectInfo, toggleFavorite, isFavorite }) {
    const [viewMode, setViewMode] = useState('grid');

    const projectActions = [
        { id: 'activities', label: 'ACTIVITIES', icon: "Activity", subtitle: 'View all project activities and updates' },
        { id: 'apps', label: 'APPS', icon: "Grid", subtitle: 'Access project applications and tools' },
        { id: 'calendar', label: 'CALENDAR', icon: "Calendar", subtitle: 'Manage project schedule and events' },
        { id: 'call-sheets', label: 'CALL SHEETS', icon: "BookOpen", subtitle: 'Daily call sheets and production info' },
        { id: 'cast-crew', label: 'CAST & CREW', icon: "Users", subtitle: 'Manage cast and crew members' },
        { id: 'cloud-storage', label: 'CLOUD STORAGE', icon: "Cloud", subtitle: 'Access project files and documents' },
        { id: 'departments', label: 'DEPARTMENTS', icon: "Layers", subtitle: 'Department organization and roles' },
        { id: 'notice-board', label: 'NOTICE BOARD', icon: "Bell", subtitle: 'Important announcements and notices' },
        { id: 'onboarding', label: 'ONBOARDING', icon: "UserPlus", subtitle: 'Onboard new team members' },
        { id: 'project-chat', label: 'PROJECT CHAT', icon: "MessageSquare", subtitle: 'Team communication and discussions' },
        { id: 'shooting-schedule', label: 'SHOOTING SCHEDULE', icon: "CalendarDays", subtitle: 'Plan and track shooting schedule' },
        { id: 'tasks', label: 'TASKS', icon: "CheckSquare", subtitle: 'Task management and tracking' },
        { id: 'timeline', label: 'TIMELINE', icon: "Clock", subtitle: 'Project timeline and milestones' },
        { id: 'settings', label: 'SETTINGS', icon: "Settings", subtitle: 'Project settings and configuration' },
    ];
    return (
        <>
            <div className={`mt-6 mb-4 pb-6 border-b  `}>
                <div className="flex items-center gap-6">

                    <div className="flex items-center gap-4 flex-1">
                        {/* Project Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-xl bg-[#7e57c2] flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                    {projectInfo?.name.substring(0, 2) || 'PR'}
                                </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border border-white">
                                <CheckSquare className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* Project Info */}
                        <div>
                            <h1 className={`text-2xl font-bold dark:text-white text-gray-900`}>
                                {projectInfo?.name || 'PROJECT'}
                            </h1>
                            <p className={`text-sm mt-1 dark:text-gray-400 text-gray-600`}>
                                {projectInfo?.role || 'Project Role'} • {projectInfo?.period || 'Period'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="px-3 py-1 bg-green-500 rounded-full flex items-center gap-1">
                                    <CheckSquare className="w-3 h-3 text-white" />
                                    <span className="text-xs font-medium text-white">ACTIVE PROJECT</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Actions */}
                    <div className="flex items-center gap-6">
                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className={`text-2xl font-semibold dark:text-white text-gray-900`}>
                                    {projectInfo?.pendingTasks || 0}
                                </div>
                                <div className={`text-xs dark:text-gray-400 text-gray-600`}>
                                    PENDING TASKS
                                </div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-semibold dark:text-white text-gray-900`}>
                                    {projectInfo?.upcomingEvents || 0}
                                </div>
                                <div className={`text-xs dark:text-gray-400 text-gray-600`}>
                                    UPCOMING EVENTS
                                </div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-semibold dark:text-white text-gray-900`}>
                                    {projectInfo?.progress || 0}%
                                </div>
                                <div className={`text-xs dark:text-gray-400 text-gray-600`}>
                                    COMPLETE
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleFavorite(projectInfo?.id)}
                                className={`p-2 rounded-lg transition-colors ${isFavorite(projectInfo?.id)
                                    ? 'bg-[#7e57c2] text-white'
                                    : 'dark:text-gray-400 dark:hover:bg-gray-800 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Star className={`w-5 h-5 ${isFavorite(projectInfo?.id) ? 'fill-white' : ''}`} />
                            </button>
                        </div>
                    </div>
                    <ViewToggleButton view={viewMode} onViewChange={setViewMode} />
                </div>
            </div>

            {/* Grid View - Category Cards */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {projectActions.map((feature) => (
                        <ProjectActionGridCard feature={feature} key={feature.id} />
                    ))}
                </div>
            )}

            {/* List View - Category Cards */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {projectActions.map((feature) => (
                        <ProjectActionListCard feature={feature} key={feature.id} />
                    ))}
                </div>
            )}
        </>
    )
}

export default ProjectActionsLayout



