import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  CalendarCheck,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Star,
  Users,
  Clapperboard,
  Tv,
  Video,
  Globe,
  Film,
} from "lucide-react";

import { Badge } from "../../../shared/components/ui/badge";
import { useNavigateWithName } from "../../../shared/hooks/useNavigateWithName";

function ProjectCard({ project, index }) {
  const navigateWithName = useNavigateWithName();

  // Get icon based on project type
  const getProjectIcon = (type) => {
    switch (type.toUpperCase()) {
      case "FEATURE FILM":
        return Clapperboard;
      case "TELEVISION SERIES":
        return Tv;
      case "COMMERCIAL":
        return Video;
      case "DOCUMENTARY":
        return Globe;
      default:
        return Film;
    }
  };

  const getPeriodIcon = (period) => {
    switch (period) {
      case "prep":
        return Clock;
      case "shoot":
        return Play;
      case "wrap":
        return CheckCircle;
      default:
        return Pause;
    }
  };

  const getPeriodColor = (period) => {
    switch (period) {
      case "prep":
        return "text-primary";
      case "shoot":
        return "text-primary";
      case "wrap":
        return "text-primary";
      default:
        return "text-primary";
    }
  };

  const getStatusBubbleColor = (period) => {
    switch (period) {
      case "prep":
        return "bg-yellow-500";
      case "shoot":
        return "bg-green-500";
      case "wrap":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (period) => {
    switch (period) {
      case "prep":
        return "SETUP";
      case "shoot":
        return "LIVE";
      case "wrap":
        return "WRAP";
      default:
        return period?.toUpperCase();
    }
  };

  // Format date from DD/MM/YYYY to MM/DD/YY
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    
    // If already in DD/MM/YYYY format
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const shortYear = year.slice(-2);
      return `${month}/${day}/${shortYear}`;
    }
    
    // Fallback to Date parsing
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: '2-digit' 
      });
    } catch {
      return dateStr;
    }
  };

  const ProjectIcon = getProjectIcon(project.type);
  const PeriodIcon = getPeriodIcon(project.period);

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.15 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() =>
        navigateWithName({
          title: project.title,
          uniqueCode: project.projectCode,
          basePath: "projects",
          storageKey: "currentProjectUniqueKey",
        })
      }
      className="cursor-pointer rounded-xl bg-background hover:bg-[#faf5ff] dark:hover:bg-slate-950 border overflow-hidden transition-all"
    >
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Icon and Project Title in One Row */}
        <div className="flex items-start gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
          {/* Project Icon */}
          <div className="w-10 h-10 rounded-lg bg-[#9333ea]/10 dark:bg-[#9333ea]/20 flex items-center justify-center shrink-0">
            <ProjectIcon className="w-5 h-5 text-[#9333ea]" />
          </div>

          {/* Project Title and Type */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {project.title}
            </h3>
            <p className="text-[10px] font-medium text-gray-700 dark:text-gray-400 uppercase truncate">
              {project.type}
            </p>
          </div>
          
          {/* Status Badge - Right */}
          <div
            className={`px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0 ${getPeriodColor(
              project.period
            )}`}
          >
            <PeriodIcon className="w-3 h-3" />
            <span className="text-[10px] font-medium uppercase">
              {project.period}
            </span>
          </div>
        </div>

        {/* Role */}
        <div className="px-3 py-1.5 rounded-lg border bg-card">
          <p className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase">
            Your Role
          </p>
          <p className="text-xs font-semibold text-[#9333ea] dark:text-lavender-400 truncate">
            {project.role}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase">
              PROGRESS
            </span>
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">
              {project.progress}%
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              className="h-full rounded-full bg-[#9333ea]"
            />
          </div>
        </div>

        {/* Stats - Updated with Start Date, End Date, and Team Size */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="CAST & CREW" value={project.teamSize} />
          <Stat label="START DATE" value={formatDate(project.startDate)} />
          <Stat label="END DATE" value={formatDate(project.endDate)} />
        </div>

        {/* Studios */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {project.studios?.map((studio, i) => (
              <Badge key={i} variant="secondary" className="text-[9px] px-2 py-0.5">
                {studio}
              </Badge>
            ))}
          </div>
          
          {/* Status Bubble */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${getStatusBubbleColor(project.period)}`} />
            <span className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase">
              {getStatusLabel(project.period)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Reusable Stat */
function Stat({ label, value }) {
  return (
    <div className="px-2 py-1.5 rounded-lg bg-card text-center">
      <p className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase mb-0.5">
        {label}
      </p>
      <p className="text-[10px] font-bold text-gray-900 dark:text-white truncate">
        {value}
      </p>
    </div>
  );
}

export default ProjectCard;