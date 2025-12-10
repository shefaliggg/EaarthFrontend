import { Film, Users, Star, Calendar } from "lucide-react";

export const studioPrimaryMetrics = [
  {
    title: "Active Projects",
    value: 1,
    subtext: "In Production",
    icon: Film,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    title: "Total Crew",
    value: 5,
    subtext: "5 total people",
    icon: Users,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  }, 
  {
    title: "Total Cast",
    value: 89,
    subtext: "5 scenes",
    icon: Star,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
  },
  {
    title: "Upcoming Shoot Days",
    value: 42,
    subtext: "Next 30 days",
    icon: Calendar,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
];
