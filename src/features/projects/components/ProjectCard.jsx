import { Award, Calendar, CheckCircle, Clock, Pause, Play, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react'
import { Badge } from '../../../shared/components/ui/badge';
import { useNavigateWithName } from '../../../shared/hooks/useNavigateWithName';

function ProjectCard({ project, index }) {
    const navigateWithName = useNavigateWithName();
    const getPeriodIcon = (period) => {
        switch (period) {
            case 'prep': return Clock;
            case 'shoot': return Play;
            case 'wrap': return CheckCircle;
            default: return Pause;
        }
    };

    const getPeriodColor = (period) => {
        switch (period) {
            case 'prep': return 'bg-sky-100 text-blue-800 border-sky-300 dark:bg-sky-700/70 dark:text-sky-100 dark:border-sky-700';
            case 'shoot': return 'bg-mint-100 text-green-800 border-mint-300 dark:bg-mint-700/70 dark:text-mint-100 dark:border-mint-700';
            case 'wrap': return 'bg-peach-100 text-orange-800 border-peach-300 dark:bg-peach-700/70 dark:text-peach-100 dark:border-peach-700';
            default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
        }
    };

    const PeriodIcon = getPeriodIcon(project.period);


    return (
        <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.15 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
                navigateWithName({
                    title: project.title,
                    uniqueCode: project.projectCode,
                    basePath: "projects",
                    storageKey: "currentProjectUniqueKey"
                })
            }}
            className="cursor-pointer rounded-2xl bg-background hover:bg-lavender-50 dark:hover:bg-slate-950 border shadow-lg hover:shadow-md dark:shadow-shadow transition-all overflow-hidden"
        >
            {/* Project Content */}
            <div className="p-6 space-y-4">
                {/* Header with emoji, title and period badge */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#ede7f6] dark:border-gray-700">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="text-4xl">{project.image}</div>
                        <div className="flex-1">
                            <h3 className="font-medium text-lg mb-1 text-gray-900 dark:text-white">
                                {project.title}
                            </h3>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-400">
                                {project.type}
                            </p>
                        </div>
                    </div>
                    {/* Period Badge - Top Right */}
                    <Badge className={`px-3 py-1.5 rounded-xl border ${getPeriodColor(project.period)} flex items-center gap-1.5`}>
                        <PeriodIcon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">{project.period}</span>
                    </Badge>
                </div>


                {/* Role */}
                <div className="px-4 py-2 rounded-xl border bg-card">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-400">
                        Your Role
                    </p>
                    <p className="font-medium text-purple-700 dark:text-lavender-400">
                        {project.role}
                    </p>
                </div>


                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-400">
                            PROGRESS
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {project.progress}%
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            className={`h-full rounded-full ${project.category === 'film' ? 'bg-[#7e57c2]' :
                                project.category === 'tv' ? 'bg-[#7e57c2]' :
                                    project.category === 'commercial' ? 'bg-[#9575cd]' :
                                        'bg-[#b39ddb]'
                                }`}
                        />
                    </div>
                </div>


                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="px-3 py-2 rounded-xl bg-card text-center">
                        <Users className="w-4 h-4 mx-auto mb-1 text-lavender-700 dark:text-gray-400" />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {project.teamSize}
                        </p>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-card text-center">
                        <Calendar className="w-4 h-4 mx-auto mb-1 text-lavender-700 dark:text-gray-400" />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {project.startDate.split('/')[1]}/{project.startDate.split('/')[2]}
                        </p>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-card text-center">
                        <Award className="w-4 h-4 mx-auto mb-1 text-lavender-700 dark:text-gray-400" />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {project.budget}
                        </p>
                    </div>
                </div>


                {/* Studios and Rating */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                        {project.studios.map((studio, i) => (
                            <Badge
                                variant={"secondary"}
                                key={i}
                            >
                                {studio}
                            </Badge>
                        ))}
                    </div>

                    {/* Rating Badge - Inline with Studios */}
                    {project.rating && (
                        <div className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {project.rating}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectCard



