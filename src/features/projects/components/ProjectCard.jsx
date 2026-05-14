import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Play,
  Pause,
  Clapperboard,
  Tv,
  Video,
  Globe,
  Film,
  Music,
} from "lucide-react";

import { Badge } from "../../../shared/components/ui/badge";
import { useNavigateWithName } from "../../../shared/hooks/useNavigateWithName";

// ─── Field mapping: real API → card display ───────────────────────────────────
//
//  API field             →  old mock field
//  project._id           →  project.id
//  project.productionName→  project.title
//  project.productionType→  project.type
//  project.productionCode→  project.projectCode
//  project.studioId.studioName → project.studios[]
//  project.prepStartDate →  project.startDate  (ISO string)
//  project.wrapEndDate   →  project.endDate    (ISO string)
//  project.crew.length   →  project.teamSize
//  project.status        →  project.period  ("active"|"completed"|"on_hold"|"cancelled")
//  — role / progress / budget / rating: not in API, handled gracefully —
//
// ─────────────────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const navigateWithName = useNavigateWithName();

  // ── Derived display values ────────────────────────────────────────────────
  const title        = project.productionName  ?? project.title   ?? "Untitled";
  const type         = project.productionType  ?? project.type    ?? "";
  const code         = project.productionCode  ?? project.projectCode ?? "";
  const status       = project.status          ?? project.period  ?? "active";
  const teamSize     = project.crew?.filter((c) => c.isActive).length
                       ?? project.teamSize
                       ?? 0;
  const startDate    = project.prepStartDate   ?? project.startDate ?? null;
  const endDate      = project.wrapEndDate     ?? project.endDate   ?? null;

  // Studio name(s)
  const studios = project.studioId?.studioName
    ? [project.studioId.studioName]
    : Array.isArray(project.studios)
    ? project.studios
    : [];

  // Role — not in the production document itself (it's per crew member),
  // so show approval status as a meaningful substitute
  const role = project.role
    ?? (project.approvalStatus
      ? project.approvalStatus.toUpperCase()
      : "APPROVED");

  // Progress — derive from status if not set
  const progress = project.progress !== undefined
    ? project.progress
    : status === "completed" ? 100
    : status === "active"    ? 50
    : status === "on_hold"   ? 30
    : 0;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getProjectIcon = (t) => {
    const upper = (t ?? "").toUpperCase();
    if (upper.includes("FEATURE FILM") || upper.includes("FILM")) return Clapperboard;
    if (upper.includes("TELEVISION") || upper.includes("TV"))     return Tv;
    if (upper.includes("COMMERCIAL"))                              return Video;
    if (upper.includes("DOCUMENTARY"))                             return Globe;
    if (upper.includes("MUSIC"))                                   return Music;
    return Film;
  };

  const getPeriodIcon = (s) => {
    switch (s) {
      case "active":    return Play;
      case "completed": return CheckCircle;
      case "on_hold":   return Pause;
      // legacy mock values
      case "prep":      return Clock;
      case "shoot":     return Play;
      case "wrap":      return CheckCircle;
      default:          return Pause;
    }
  };

  const getStatusBubbleColor = (s) => {
    switch (s) {
      case "active":    return "bg-green-500";
      case "completed": return "bg-gray-400";
      case "on_hold":   return "bg-yellow-500";
      case "cancelled": return "bg-red-400";
      case "prep":      return "bg-yellow-500";
      case "shoot":     return "bg-green-500";
      case "wrap":      return "bg-gray-400";
      default:          return "bg-gray-400";
    }
  };

  const getStatusLabel = (s) => {
    switch (s) {
      case "active":    return "ACTIVE";
      case "completed": return "WRAP";
      case "on_hold":   return "ON HOLD";
      case "cancelled": return "CANCELLED";
      case "prep":      return "SETUP";
      case "shoot":     return "LIVE";
      case "wrap":      return "WRAP";
      default:          return (s ?? "").toUpperCase();
    }
  };

  const formatDate = (raw) => {
    if (!raw) return "N/A";
    // ISO string from MongoDB
    try {
      return new Date(raw).toLocaleDateString("en-US", {
        month: "2-digit",
        day:   "2-digit",
        year:  "2-digit",
      });
    } catch {
      return raw;
    }
  };

  const ProjectIcon = getProjectIcon(type);
  const PeriodIcon  = getPeriodIcon(status);

  return (
    <motion.div
      key={project._id ?? project.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.15 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() =>
        navigateWithName({
          title:      title,
          uniqueCode: code,
          basePath:   "projects",
          storageKey: "currentProjectUniqueKey",
        })
      }
      className="cursor-pointer rounded-xl bg-background hover:bg-[#faf5ff] dark:hover:bg-slate-950 border overflow-hidden transition-all"
    >
      <div className="p-4 space-y-3">
        {/* Icon + Title row */}
        <div className="flex items-start gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-[#9333ea]/10 dark:bg-[#9333ea]/20 flex items-center justify-center shrink-0">
            <ProjectIcon className="w-5 h-5 text-[#9333ea]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            <p className="text-[10px] font-medium text-gray-700 dark:text-gray-400 uppercase truncate">
              {type}
            </p>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-1 shrink-0 text-primary">
            <PeriodIcon className="w-3 h-3" />
            <span className="text-[10px] font-medium uppercase">
              {getStatusLabel(status)}
            </span>
          </div>
        </div>

        {/* Role / approval status */}
        <div className="px-3 py-1.5 rounded-lg border bg-card">
          <p className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase">
            Status
          </p>
          <p className="text-xs font-semibold text-[#9333ea] dark:text-lavender-400 truncate">
            {role}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase">
              PROGRESS
            </span>
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              className="h-full rounded-full bg-[#9333ea]"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="CAST & CREW" value={teamSize || "—"} />
          <Stat label="START DATE"  value={formatDate(startDate)} />
          <Stat label="END DATE"    value={formatDate(endDate)} />
        </div>

        {/* Studios + status bubble */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {studios.length > 0
              ? studios.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px] px-2 py-0.5">
                    {s}
                  </Badge>
                ))
              : <span className="text-[9px] text-gray-400">—</span>
            }
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${getStatusBubbleColor(status)}`} />
            <span className="text-[9px] font-medium text-gray-700 dark:text-gray-400 uppercase">
              {getStatusLabel(status)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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