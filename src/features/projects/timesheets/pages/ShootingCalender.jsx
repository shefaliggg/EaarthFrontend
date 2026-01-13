import { useMemo, useState } from "react";
import { SelectMenu } from "../../../../shared/components/menus/SelectMenu";
import { Button } from "../../../../shared/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, MapPin, Zap } from "lucide-react";
import PrimaryStats from "../../../../shared/components/wrappers/PrimaryStats";
import { motion } from "framer-motion"
import { cn } from "../../../../shared/config/utils";
import { Badge } from "../../../../shared/components/ui/badge";
import { Card, CardContent } from "../../../../shared/components/ui/card";
import { StatusBadge } from "../../../../shared/components/badges/StatusBadge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Label } from "../../../../shared/components/ui/label";
import { Input } from "../../../../shared/components/ui/input";
import { Checkbox } from "../../../../shared/components/ui/checkbox";
import { Textarea } from "../../../../shared/components/ui/textarea";

const WORKPLACES_LIST = [
  'Bourne Wood', 'Brecon Beacons', 'Crychan Forest', 'Dartmoor', 'Forest of Dean',
  'Redlands Wood', 'Shepperton', 'Sky Studios Elstree', 'Stockers Farm'
];

const TRAVEL_OPTIONS = Array.from({ length: 41 }, (_, i) => (i * 0.25).toFixed(2)); // 0.0 to 10.0
function ShootingCalender() {
  const [selectedUnit, setSelectedUnit] = useState('Main');
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  })

  const [calendarSchedule, setCalendarSchedule] = useState({
    // Week 1 (Dec 2-8, 2025)
    '2025-12-02': { unit: 'Main', unitCall: '07:00', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 48, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio Day - Stage 7' },
    '2025-12-03': { unit: 'Main', unitCall: '07:00', unitWrap: '18:15', workingHours: '10 (CWD)', cameraOT: '1.25', dayType: 'Shoot', dayNumber: 49, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Studio Day - Stage 7' },
    '2025-12-04': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 50, workplaces: ['Sky Studios Elstree'], set: 'Stage 2', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Move to Elstree' },
    '2025-12-05': { unit: 'Main', unitCall: '07:30', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 51, workplaces: ['Sky Studios Elstree'], set: 'Stage 2', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Elstree - Stage 2' },
    '2025-12-06': { unit: 'Main', unitCall: '12:00', unitWrap: '22:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 52, workplaces: ['Sky Studios Elstree'], set: 'Stage 2', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '18:00', mealEnd: '19:00', notes: 'Night Shoot - Elstree Stage 2', nightPenalty: 'Paid', nightPenaltyPaid: 'Paid' },
    '2025-12-07': { dayType: 'Rest', dayNumber: '-' },
    '2025-12-08': { dayType: 'Rest', dayNumber: '-' },

    // Week 2 (Dec 9-15, 2025) - Current week
    '2025-12-09': { unit: 'Main', unitCall: '06:00', unitWrap: '17:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 53, workplaces: ['Bourne Wood'], set: 'Exterior', travelTo: '0.5', travelToPaid: 'Paid', travelFrom: '0.5', travelFromPaid: 'Paid', mealStart: '12:30', mealEnd: '13:30', notes: 'Forest location shoot - Early call', dawn: 'Paid' },
    '2025-12-10': { unit: 'Main', unitCall: '06:30', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 54, workplaces: ['Bourne Wood'], set: 'Exterior', travelTo: '0.5', travelToPaid: 'Paid', travelFrom: '0.5', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Bourne Wood - Continuation' },
    '2025-12-11': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 55, workplaces: ['Crychan Forest'], set: 'Exterior', travelTo: '1.5', travelToPaid: 'Paid', travelFrom: '1.5', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Wales location - Travel allowance' },
    '2025-12-12': { unit: 'Main', unitCall: '07:00', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.5', dayType: 'Shoot', dayNumber: 56, workplaces: ['Crychan Forest'], set: 'Exterior', travelTo: '1.5', travelToPaid: 'Paid', travelFrom: '1.5', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Wales - Day 2' },
    '2025-12-13': { unit: 'Main', unitCall: '14:00', unitWrap: '01:00', unitCallNextDay: false, unitWrapNextDay: true, workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 57, workplaces: ['Brecon Beacons'], set: 'Exterior', travelTo: '1.0', travelToPaid: 'Paid', travelFrom: '1.0', travelFromPaid: 'Paid', mealStart: '20:00', mealEnd: '21:00', mealStartNextDay: false, mealEndNextDay: false, notes: 'Night exterior - Brecon', nightPenalty: 'Paid', nightPenaltyPaid: 'Paid' },
    '2025-12-14': { dayType: 'Rest', dayNumber: '-' },
    '2025-12-15': { dayType: 'Rest', dayNumber: '-' },

    // Week 3 (Dec 16-22, 2025)
    '2025-12-16': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 58, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Back to Studio - Stage 7' },
    '2025-12-17': { unit: 'Main', unitCall: '08:00', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 59, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio - Stage 7' },
    '2025-12-18': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 60, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio - Stage 7' },
    '2025-12-19': { unit: 'Main', unitCall: '08:00', unitWrap: '20:00', workingHours: '10 (CWD)', cameraOT: '2.0', dayType: 'Shoot', dayNumber: 61, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '14:00', mealEnd: '15:00', lateMeal: '1.0', lateMealPaid: 'Paid', notes: 'Long day - VFX sequence' },
    '2025-12-20': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 62, workplaces: ['Shepperton Studios'], set: 'Stage 7', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Studio - Stage 7' },
    '2025-12-21': { dayType: 'Rest', dayNumber: '-' },
    '2025-12-22': { dayType: 'Rest', dayNumber: '-' },

    // Week 4 (Dec 23-29, 2025) - Holiday Break
    '2025-12-23': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },
    '2025-12-24': { dayType: 'Rest', dayNumber: '-', notes: 'Christmas Eve', isPublicHoliday: true },
    '2025-12-25': { dayType: 'Rest', dayNumber: '-', notes: 'Christmas Day', isPublicHoliday: true },
    '2025-12-26': { dayType: 'Rest', dayNumber: '-', notes: 'Boxing Day', isPublicHoliday: true },
    '2025-12-27': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },
    '2025-12-28': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },
    '2025-12-29': { dayType: 'Rest', dayNumber: '-', notes: 'Holiday Break' },

    // Week 5 (Dec 30, 2025 - Jan 5, 2026) - Holiday/Prep Week
    '2025-12-30': { unit: 'Main', unitCall: '09:00', unitWrap: '17:00', workingHours: '8 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 63, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Prep/Rehearsal Day' },
    '2025-12-31': { dayType: 'Rest', dayNumber: '-', notes: 'New Years Eve' },
    '2026-01-01': { dayType: 'Rest', dayNumber: '-', notes: 'New Years Day', isPublicHoliday: true },
    '2026-01-02': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 64, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Back to work - Stage 12' },
    '2026-01-03': { unit: 'Main', unitCall: '07:00', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 65, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12 - Interior' },
    '2026-01-04': { dayType: 'Rest', dayNumber: '-' },
    '2026-01-05': { dayType: 'Rest', dayNumber: '-' },

    // Week 6 (Jan 6-12, 2026)
    '2026-01-06': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 66, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12 - Continues' },
    '2026-01-07': { unit: 'Main', unitCall: '07:30', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 67, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Stage 12' },
    '2026-01-08': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 68, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12' },
    '2026-01-09': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 69, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12' },
    '2026-01-10': { unit: 'Main', unitCall: '07:00', unitWrap: '17:30', workingHours: '10 (CWD)', cameraOT: '0.5', dayType: 'Shoot', dayNumber: 70, workplaces: ['Warner Bros. Studios Leavesden'], set: 'Stage 12', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Stage 12' },
    '2026-01-11': { dayType: 'Rest', dayNumber: '-' },
    '2026-01-12': { dayType: 'Rest', dayNumber: '-' },

    // Week 7 (Jan 13-19, 2026)
    '2026-01-13': { unit: 'Main', unitCall: '06:00', unitWrap: '17:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 71, workplaces: ['Black Park'], set: 'Exterior', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '12:30', mealEnd: '13:30', notes: 'Location shoot - Early call', dawn: 'Paid' },
    '2026-01-14': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 72, workplaces: ['Black Park'], set: 'Exterior', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Black Park - Day 2' },
    '2026-01-15': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 73, workplaces: ['Black Park'], set: 'Exterior', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Black Park - Final day' },
    '2026-01-16': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 74, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Move to Pinewood - Stage 5' },
    '2026-01-17': { unit: 'Main', unitCall: '08:00', unitWrap: '20:00', workingHours: '10 (CWD)', cameraOT: '2.0', dayType: 'Shoot', dayNumber: 75, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '14:00', mealEnd: '15:00', lateMeal: '1.0', lateMealPaid: 'Paid', notes: 'Long day - Action sequence' },
    '2026-01-18': { dayType: 'Rest', dayNumber: '-' },
    '2026-01-19': { dayType: 'Rest', dayNumber: '-' },

    // Week 8 (Jan 20-26, 2026)
    '2026-01-20': { unit: 'Main', unitCall: '07:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 76, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Pinewood - Stage 5' },
    '2026-01-21': { unit: 'Main', unitCall: '07:30', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 77, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Pinewood - Stage 5' },
    '2026-01-22': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 78, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Pinewood - Stage 5' },
    '2026-01-23': { unit: 'Main', unitCall: '13:00', unitWrap: '00:00', unitCallNextDay: false, unitWrapNextDay: true, workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 79, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '19:00', mealEnd: '20:00', mealStartNextDay: false, mealEndNextDay: false, notes: 'Night shoot - Pinewood Stage 5', nightPenalty: 'Paid', nightPenaltyPaid: 'Paid' },
    '2026-01-24': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 80, workplaces: ['Pinewood Studios'], set: 'Stage 5', travelTo: '0.0', travelToPaid: 'Paid', travelFrom: '0.0', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Pinewood - Stage 5' },
    '2026-01-25': { dayType: 'Rest', dayNumber: '-' },
    '2026-01-26': { dayType: 'Rest', dayNumber: '-' },

    // Week 9 (Jan 27-31, 2026) - Final week of January
    '2026-01-27': { unit: 'Main', unitCall: '07:00', unitWrap: '17:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 81, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Move to Ealing - Stage 1' },
    '2026-01-28': { unit: 'Main', unitCall: '07:30', unitWrap: '18:30', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 82, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:30', mealEnd: '14:30', notes: 'Ealing - Stage 1 Interior' },
    '2026-01-29': { unit: 'Main', unitCall: '08:00', unitWrap: '19:00', workingHours: '10 (CWD)', cameraOT: '1.0', dayType: 'Shoot', dayNumber: 83, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Ealing - Stage 1' },
    '2026-01-30': { unit: 'Main', unitCall: '07:00', unitWrap: '20:00', workingHours: '10 (CWD)', cameraOT: '3.0', dayType: 'Shoot', dayNumber: 84, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '14:00', mealEnd: '15:00', lateMeal: '1.0', lateMealPaid: 'Paid', notes: 'Long day - Climax sequence' },
    '2026-01-31': { unit: 'Main', unitCall: '08:00', unitWrap: '18:00', workingHours: '10 (CWD)', cameraOT: '0.0', dayType: 'Shoot', dayNumber: 85, workplaces: ['Ealing Studios'], set: 'Stage 1', travelTo: '0.25', travelToPaid: 'Paid', travelFrom: '0.25', travelFromPaid: 'Paid', mealStart: '13:00', mealEnd: '14:00', notes: 'Ealing - Final day January' },
  });

  // Edit Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [formData, setFormData] = useState(null);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDate = (date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDayOfWeek = (dateString) => {
    const [y, m, d] = dateString.split("-").map(Number)
    const date = new Date(y, m - 1, d)
    const dayIndex = date.getDay()
    return weekDays[dayIndex === 0 ? 6 : dayIndex - 1]
  }

  const getDayOfMonth = (dateString) => {
    const [y, m, d] = dateString.split("-").map(Number)
    return new Date(y, m - 1, d).getDate()
  }

  const getFullDateString = (dateString) => {
    const [y, m, d] = dateString.split("-").map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const goToPreviousWeek = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))
  }

  const goToNextWeek = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
  }

  const getWeekRange = (date) => {
    const d = new Date(date)
    const day = d.getDay() === 0 ? 7 : d.getDay() // Sunday → 7
    const monday = new Date(d)
    monday.setDate(d.getDate() - (day - 1))

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    return { monday, sunday }
  }

  const formatWeekRange = (start, end) => {
    const sameMonth = start.getMonth() === end.getMonth()

    if (sameMonth) {
      return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString("en-US", { month: "short" })} ${start.getFullYear()}`
    }

    return `${start.getDate()} ${start.toLocaleDateString("en-US", { month: "short" })} – ${end.getDate()} ${end.toLocaleDateString("en-US", { month: "short" })} ${end.getFullYear()}`
  }

  const { monday, sunday } = getWeekRange(currentDate)

  const today = new Date()

  const { monday: currentWeekStart, sunday: currentWeekEnd } = getWeekRange(today)

  const isCurrentWeek = currentDate >= currentWeekStart && currentDate <= currentWeekEnd

  const getDaysForView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayStr}`;

      const dayData = calendarSchedule[dateStr] || {};

      days.push({
        date: dateStr,
        dayType: dayData.dayType || 'Rest',
        dayNumber: dayData.dayNumber || '-',
        isPublicHoliday: dayData.isPublicHoliday || false,
        workplaces: Array.isArray(dayData.workplaces) ? dayData.workplaces : (dayData.workplaces ? [dayData.workplaces] : []),
        workingHours: dayData.workingHours || '-',
        travelTo: dayData.travelTo || '0.0',
        travelToPaid: dayData.travelToPaid || 'Paid',
        unitCall: dayData.unitCall || '',
        unitCallNextDay: dayData.unitCallNextDay || false,
        mealStart: dayData.mealStart || '',
        mealStartNextDay: dayData.mealStartNextDay || false,
        mealEnd: dayData.mealEnd || '',
        mealEndNextDay: dayData.mealEndNextDay || false,
        unitWrap: dayData.unitWrap || '',
        unitWrapNextDay: dayData.unitWrapNextDay || false,
        travelFrom: dayData.travelFrom || '0.0',
        travelFromPaid: dayData.travelFromPaid || 'Paid',
        notes: dayData.notes || '',
        lateMeal: dayData.lateMeal || '0.0',
        lateMealPaid: dayData.lateMealPaid || 'Unpaid',
        cameraOT: dayData.cameraOT || '0.0',
        nightPenalty: dayData.nightPenalty || 'Unpaid',
        nightPenaltyPaid: dayData.nightPenaltyPaid || 'Unpaid',
      });
    }
    return days;
  };

  const daysToRender = getDaysForView();

  // Calculate stats
  const stats = useMemo(() => {
    const shootDays = daysToRender.filter(d => d.dayType === 'Shoot').length;
    const restDays = daysToRender.filter(d => d.dayType === 'Rest').length;
    const totalHours = daysToRender.reduce((acc, d) => {
      const hours = parseFloat(d.workingHours.replace(/[^\d.]/g, '')) || 0;
      return acc + hours;
    }, 0);
    const locations = Array.from(new Set(daysToRender.flatMap(d => d.workplaces))).length;
    const totalOT = daysToRender.reduce((acc, d) => {
      const ot = parseFloat(d.cameraOT) || 0;
      return acc + ot;
    }, 0);

    return { shootDays, restDays, totalHours, locations, totalOT };
  }, [daysToRender]);

  const handleEditClick = (day) => {
    setEditingDate(day.date);
    setFormData(JSON.parse(JSON.stringify(day)));
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingDate || !formData || !setCalendarSchedule) return;

    const updatedSchedule = {
      ...calendarSchedule,
      [editingDate]: {
        ...formData,
      }
    };

    setCalendarSchedule(updatedSchedule);
    setIsDialogOpen(false);
  };

  const handleExport = () => {
    console.log('Export calendar data');
    // Add export functionality
  };

  const handlePrint = () => {
    window.print();
  };

  const updateField = (field, value) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const toggleWorkplace = (wp) => {
    if (!formData) return;
    const current = formData.workplaces || [];
    if (current.includes(wp)) {
      updateField('workplaces', current.filter(w => w !== wp));
    } else {
      updateField('workplaces', [...current, wp]);
    }
  };

  const renderTimeDisplay = (time, nextDay) => {
    if (!time) return '';
    return nextDay ? `${time} (+1)` : time;
  };

  const summaryStats = [
    {
      label: "Shoot Days",
      value: 5,
      icon: "Activity",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Rest Days",
      value: 2,
      icon: "Coffee",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Hours",
      value: "50.0h",
      icon: "Clock",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Locations",
      value: 1,
      icon: "MapPin",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Camera O/T",
      value: "2.5h",
      icon: "Zap",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const DAY_TYPES = [
    "Shoot",
    "Pre-shoot",
    "Test",
    "Rehearsal",
    "Prep",
    "Rest",
    "Travel",
    "Turnaround",
    "Hiatus",
    "Shutdown",
    "Wrap",
    "Post",
  ].map(t => ({ label: t, value: t }))

  const TRAVEL_OPTIONS_MENU = TRAVEL_OPTIONS.map(h => ({
    label: `${h}h`,
    value: h,
  }))

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <SelectMenu
            selected={selectedUnit}
            onSelect={(v) => setSelectedUnit(v)}
            items={[
              { label: "Main", value: "Main Unit" },
              { label: "Splinter Camera", value: "Splinter Unit" },
              { label: "VFX Elements", value: "VFX Unit" },
            ]}
            label="Select Unit"
          />

          <div className="flex items-center gap-3">
            {!isCurrentWeek && (
              <Button variant="outline" size="sm" onClick={goToToday}>
                <Calendar className="w-4 h-4" />
                Go To Current Week
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-bold text-lg">
                  {formatWeekRange(monday, sunday)}
                </h3>

              </div>
            </div>

            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <PrimaryStats stats={summaryStats} gridColumns={5} />

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Card className="py-0 border-primary">
            <CardContent className="p-0">
              <div className="overflow-x-auto rounded-3xl">
                <table className="w-full">

                  <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-[150px] sticky left-0 bg-card border-r">
                        Date
                      </th>

                      {daysToRender.map((day, index) => {
                        const isWeekend = ["Sat", "Sun"].includes(getDayOfWeek(day.date))

                        return (
                          <th
                            key={index}
                            className={cn(
                              "px-3 py-3 text-center min-w-[140px] border-r last:border-r-0",
                              isWeekend && "bg-muted/40"
                            )}
                          >
                            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              {getDayOfWeek(day.date)}
                            </div>
                            <div className="text-xl font-semibold">
                              {getDayOfMonth(day.date)}
                            </div>

                            {day.isPublicHoliday && (
                              <Badge variant="destructive" className="mt-2 text-[10px]">
                                Holiday
                              </Badge>
                            )}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Day Type */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Day Type
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            <Badge
                              variant={
                                day.dayType === "Shoot"
                                  ? "default"
                                  : day.dayType === "Rest"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {day.dayType}
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Day Number */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Day #
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center font-bold  border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.dayNumber}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Workplaces */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Locations
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.workplaces.length > 0 ? (
                              <div className="flex flex-col gap-1 items-center">
                                <StatusBadge icon={MapPin} className={"bg-primary/10 text-primary"} size="sm" label={day.workplaces.length} />
                              </div>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-30`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Section Divider */}
                    <tr className={`bg-card border-y `}>
                      <td colSpan={8} className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 text-muted-foreground`} />
                          <span className={`text-xs font-black uppercase tracking-wider text-muted-foreground`}>
                            Schedule & Times
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Working Hours */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Hours
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center font-bold  border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.workingHours}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Travel To */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Travel To
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.travelTo !== '-' && day.travelTo !== '0.0' ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className={`font-bold `}>{day.travelTo}h</span>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${day.travelToPaid === 'Paid'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                                  }`}>
                                  {day.travelToPaid === 'Paid' ? 'PD' : 'INC'}
                                </span>
                              </div>
                            ) : (
                              <span className={`text-xs `}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Unit Call */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Unit Call
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.unitCall ? (
                              <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                                {renderTimeDisplay(day.unitCall, day.unitCallNextDay)}
                              </div>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-20`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Meal Start */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Meal Start
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center text-sm text-muted-foreground border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {renderTimeDisplay(day.mealStart, day.mealStartNextDay) || <span className="opacity-20">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Meal End */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Meal End
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center text-sm text-muted-foreground border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {renderTimeDisplay(day.mealEnd, day.mealEndNextDay) || <span className="opacity-20">-</span>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Unit Wrap */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Unit Wrap
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.unitWrap ? (
                              <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                                {renderTimeDisplay(day.unitWrap, day.unitWrapNextDay)}
                              </div>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-20`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Travel From */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Travel From
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.travelFrom !== '-' && day.travelFrom !== '0.0' ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className={`font-bold `}>{day.travelFrom}h</span>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${day.travelFromPaid === 'Paid'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                                  }`}>
                                  {day.travelFromPaid === 'Paid' ? 'PD' : 'INC'}
                                </span>
                              </div>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-20`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Section Divider */}
                    <tr className={`bg-card border-y `}>
                      <td colSpan={8} className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <Zap className={`w-4 h-4 text-muted-foreground`} />
                          <span className={`text-xs font-black uppercase tracking-wider text-muted-foreground`}>
                            Penalties & Overtime
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Late Meal */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Late Meal
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.lateMeal !== '0.0' && day.lateMeal !== 'Unpaid' ? (
                              <span className="text-red-600 dark:text-red-400 font-bold">{day.lateMeal}</span>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-20`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Camera OT */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Camera O/T
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.cameraOT !== '0.0' ? (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">{day.cameraOT}h</span>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-20`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Night Penalty */}
                    <tr className={`border-b `}>
                      <td className={`px-4 py-3 text-xs font-black uppercase tracking-wider text-muted-foreground bg-card sticky left-0 border-r `}>
                        Night Penalty
                      </td>
                      {daysToRender.map((day, index) => {
                        const isWeekend = ['Sat', 'Sun'].includes(getDayOfWeek(day.date));
                        return (
                          <td
                            key={index}
                            className={`px-3 py-3 text-center border-r  last:border-r-0 ${isWeekend ? 'bg-primary/10  dark:bg-primary/10' : ''
                              }`}
                          >
                            {day.nightPenalty === 'Paid' ? (
                              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs uppercase px-2.5 py-1 rounded-lg font-black tracking-wider">
                                Paid
                              </span>
                            ) : (
                              <span className={`text-xs text-muted-foreground opacity-20`}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Edit Row */}
                    <tr className={` bg-purple-50/30 dark:bg-[#13111a] border-t `}>
                      <td className={`px-4 py-4 sticky left-0  bg-purple-50/30 dark:bg-[#13111a] border-r `}></td>
                      {daysToRender.map((day, index) => (
                        <td
                          key={index}
                          className={`px-3 py-4 text-center border-r  last:border-r-0`}
                        >
                          <Button
                            size={"sm"}
                            onClick={() => handleEditClick(day)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div >

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Edit {editingDate ? getFullDateString(editingDate) : 'Day'}
            </DialogTitle>
            <DialogDescription>
              Update the schedule details, times, and logistics for this shooting day.
            </DialogDescription>
          </DialogHeader>

          {formData && (
            <div className="space-y-6 py-4">
              {/* Day Type & Number */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Day Type</Label>
                  <SelectMenu
                    label="Select day type"
                    items={DAY_TYPES}
                    selected={formData.dayType}
                    onSelect={(v) => updateField("dayType", v)}
                    className="w-full bg-background rounded-3xl shadow-sm"
                  />

                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Day #</Label>
                  <Input
                    value={formData.dayNumber}
                    onChange={(e) => updateField('dayNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-primary/10 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <Checkbox
                  id="public-holiday"
                  checked={formData.isPublicHoliday}
                  onCheckedChange={(c) => updateField('isPublicHoliday', c === true)}
                  className={"border-primary"}
                />
                <Label htmlFor="public-holiday" className="cursor-pointer font-bold text-sm">
                  Set as public holiday
                </Label>
              </div>

              {/* Workplaces */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workplaces / Locations</Label>
                <div className="grid grid-cols-2 gap-2 p-4 bg-muted/50 rounded-xl border">
                  {WORKPLACES_LIST.map(wp => (
                    <div key={wp} className="flex items-center space-x-2">
                      <Checkbox
                        id={`wp-${wp}`}
                        checked={formData.workplaces.includes(wp)}
                        onCheckedChange={() => toggleWorkplace(wp)}
                      />
                      <Label htmlFor={`wp-${wp}`} className="cursor-pointer text-sm font-medium">
                        {wp}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Working Hours</Label>
                <Input
                  value={formData.workingHours}
                  onChange={(e) => updateField('workingHours', e.target.value)}
                  placeholder="e.g., 10 (CWD)"
                />
              </div>

              {/* Travel To */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Travel To (hours)</Label>
                  <SelectMenu
                    label="Hours"
                    items={TRAVEL_OPTIONS_MENU}
                    selected={formData.travelTo}
                    onSelect={(v) => updateField("travelTo", v)}
                    className="w-full bg-background rounded-3xl shadow-sm"
                  />

                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Travel To Status</Label>
                  <SelectMenu
                    label="Status"
                    items={[
                      { label: "Paid", value: "Paid" },
                      { label: "Included", value: "Included" },
                    ]}
                    selected={formData.travelToPaid}
                    onSelect={(v) => updateField("travelToPaid", v)}
                    className="w-full bg-background rounded-3xl shadow-sm"
                  />
                </div>
              </div>

              {/* Unit Call */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Call</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="time"
                    value={formData.unitCall}
                    onChange={(e) => updateField('unitCall', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unit-call-next"
                      checked={formData.unitCallNextDay}
                      onCheckedChange={(c) => updateField('unitCallNextDay', c === true)}
                    />
                    <Label htmlFor="unit-call-next" className="text-sm font-medium whitespace-nowrap">
                      Next day (+1)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Meal Times */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meal Start</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="time"
                      value={formData.mealStart}
                      onChange={(e) => updateField('mealStart', e.target.value)}
                      className="flex-1"
                    />
                    <Checkbox
                      checked={formData.mealStartNextDay}
                      onCheckedChange={(c) => updateField('mealStartNextDay', c === true)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meal End</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="time"
                      value={formData.mealEnd}
                      onChange={(e) => updateField('mealEnd', e.target.value)}
                      className="flex-1"
                    />
                    <Checkbox
                      checked={formData.mealEndNextDay}
                      onCheckedChange={(c) => updateField('mealEndNextDay', c === true)}
                    />
                  </div>
                </div>
              </div>

              {/* Unit Wrap */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Wrap</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="time"
                    value={formData.unitWrap}
                    onChange={(e) => updateField('unitWrap', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unit-wrap-next"
                      checked={formData.unitWrapNextDay}
                      onCheckedChange={(c) => updateField('unitWrapNextDay', c === true)}
                    />
                    <Label htmlFor="unit-wrap-next" className="text-sm font-medium whitespace-nowrap">
                      Next day (+1)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Travel From */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Travel From (hours)</Label>
                  <SelectMenu
                    label="Hours"
                    items={TRAVEL_OPTIONS_MENU}
                    selected={formData.travelFrom}
                    onSelect={(v) => updateField("travelFrom", v)}
                    className="w-full bg-background rounded-3xl shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Travel From Status</Label>
                  <SelectMenu
                    label="Status"
                    items={[
                      { label: "Paid", value: "Paid" },
                      { label: "Included", value: "Included" },
                    ]}
                    selected={formData.travelFromPaid}
                    onSelect={(v) => updateField("travelFromPaid", v)}
                    className="w-full bg-background rounded-3xl shadow-sm"
                  />
                </div>
              </div>

              {/* Penalties */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Late Meal (hours)</Label>
                  <Input
                    value={formData.lateMeal}
                    onChange={(e) => updateField('lateMeal', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Camera O/T (hours)</Label>
                  <Input
                    value={formData.cameraOT}
                    onChange={(e) => updateField('cameraOT', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Add any additional notes or special instructions..."
                  rows={3}
                  className={"border-border"}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShootingCalender