import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Clock, CheckCircle, Upload, FileText, Users,
  MessageSquare, Bell, Download, Edit, Trash, Filter,
  Search, ChevronDown, Activity as ActivityIcon, Save
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../shared/components/ui/button";

function ProjectActivities() {
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("7days");

  useEffect(() => {
    const saved = localStorage.getItem("activityFilterPreferences");
    if (saved) {
      const prefs = JSON.parse(saved);
      setFilterType(prefs.filterType || "all");
      setFilterDepartment(prefs.filterDepartment || "all");
      setDateRange(prefs.dateRange || "7days");
    }
  }, []);

  const savePreferences = () => {
    const prefs = { filterType, filterDepartment, dateRange };
    localStorage.setItem("activityFilterPreferences", JSON.stringify(prefs));
    toast.success("FILTER PREFERENCES SAVED SUCCESSFULLY!");
  };

  const activities = [
    {
      id: "1",
      type: "task",
      action: "Completed task",
      user: "John Smith",
      userAvatar: "👨‍🎨",
      timestamp: "2 hours ago",
      details: "Scene 42 Animation - Character movement",
      relatedItem: "Animation Department",
    },
    {
      id: "2",
      type: "file",
      action: "Uploaded file",
      user: "Sarah Johnson",
      userAvatar: "👩‍💼",
      timestamp: "3 hours ago",
      details: "Character_Design_Final_v3.psd",
      relatedItem: "Cloud Storage",
    },
    {
      id: "3",
      type: "event",
      action: "Created event",
      user: "Director Mike",
      userAvatar: "🎬",
      timestamp: "5 hours ago",
      details: "Storyboard Review Meeting",
      relatedItem: "Project Calendar",
    },
    {
      id: "4",
      type: "notice",
      action: "Posted notice",
      user: "Producer Lisa",
      userAvatar: "👩‍💻",
      timestamp: "1 day ago",
      details: "Safety Guidelines Update - Required Reading",
      relatedItem: "Notice Board",
    },
    {
      id: "5",
      type: "chat",
      action: "Sent message",
      user: "VFX Lead Tom",
      userAvatar: "🎭",
      timestamp: "1 day ago",
      details: "Shared latest VFX renders for approval",
      relatedItem: "VFX Department Chat",
    },
    {
      id: "6",
      type: "edit",
      action: "Updated task",
      user: "Animation Lead",
      userAvatar: "🎨",
      timestamp: "2 days ago",
      details: "Changed priority to HIGH for Scene 45",
      relatedItem: "Tasks",
    },
    {
      id: "7",
      type: "task",
      action: "Created task",
      user: "Director Mike",
      userAvatar: "🎬",
      timestamp: "2 days ago",
      details: "Background cleanup for Scene 38",
      relatedItem: "Art Department",
    },
    {
      id: "8",
      type: "file",
      action: "Downloaded file",
      user: "Sound Engineer",
      userAvatar: "🎵",
      timestamp: "3 days ago",
      details: "Audio_Mix_Scene_42.wav",
      relatedItem: "Cloud Storage",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "task":
        return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/30" };
      case "file":
        return { icon: Upload, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30" };
      case "event":
        return { icon: Calendar, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/30" };
      case "notice":
        return { icon: Bell, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/30" };
      case "chat":
        return { icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/30" };
      case "edit":
        return { icon: Edit, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/30" };
      default:
        return { icon: ActivityIcon, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-700" };
    }
  };

  const filteredActivities = activities
    .filter((a) => filterType === "all" || a?.type === filterType)
    .filter((a) => filterDepartment === "all" || a?.relatedItem === filterDepartment)
    .filter(
      (a) =>
        a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.details?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <ActivityIcon className="w-7 h-7" />
            PROJECT ACTIVITIES
          </h1>
          <p className="text-gray-500 dark:text-gray-400">All actions and updates for the project</p>
        </div>

        <Button
        size={"lg"}
          onClick={savePreferences}
        >
          <Save className="w-4 h-4" />
          SAVE PREFERENCES
        </Button>
      </div>

      {/* Filters */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr_1fr_1fr] gap-3">
          {/* Search */}
          <div className="relative mr-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH ACTIVITIES..."
              className="w-full pl-10 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Select Department */}
          <select
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">ENTIRE PROJECT</option>
            <option value="Animation Department">ANIMATION DEPT</option>
            <option value="VFX Department">VFX DEPT</option>
            <option value="Art Department">ART DEPT</option>
            <option value="Sound Department">SOUND DEPT</option>
            <option value="Project Calendar">PROJECT CALENDAR</option>
            <option value="Cloud Storage">CLOUD STORAGE</option>
            <option value="Notice Board">NOTICE BOARD</option>
          </select>

          {/* Select Type */}
          <select
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">ALL TYPES</option>
            <option value="task">TASKS</option>
            <option value="file">FILES</option>
            <option value="event">EVENTS</option>
            <option value="notice">NOTICES</option>
            <option value="chat">CHAT</option>
            <option value="edit">EDITS</option>
          </select>

          {/* Date Range */}
          <select
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">TODAY</option>
            <option value="7days">LAST 7 DAYS</option>
            <option value="30days">LAST 30 DAYS</option>
            <option value="all">ALL TIME</option>
          </select>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-3">
        {filteredActivities.map((activity, index) => {
          const { icon: Icon, color, bg } = getActivityIcon(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.03 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activity.userAvatar}</span>

                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {activity.user}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.action}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.timestamp}
                    </div>
                  </div>

                  {activity.details && (
                    <div className="text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">
                      {activity.details}
                    </div>
                  )}

                  {activity.relatedItem && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
                      bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="w-3 h-3" />
                      {activity.relatedItem}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredActivities.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow mt-6">
          <ActivityIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Activities Found</h3>
          <p className="text-gray-500 dark:text-gray-400">No activities match your current filters</p>
        </div>
      )}
    </div>
  );
}

export default ProjectActivities