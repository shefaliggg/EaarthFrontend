import { motion } from "framer-motion";

import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Grid3x3, List, CalendarDays, CalendarRange } from 'lucide-react';
import { useState } from 'react';

// AddEventModal Component
function AddEventModal({ onClose, onAddEvent }) {
  const [eventData, setEventData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'personal'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(eventData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Add New Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
          />
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border rounded"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded font-bold">
              Add Event
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded font-bold">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// StyledPageWrapper Component
function StyledPageWrapper({ isDarkMode, title, subtitle, icon: Icon, actions, children }) {
  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
            </div>
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}

// StyledCard Component
function StyledCard({ isDarkMode, children }) {
  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      {children}
    </div>
  );
}

// StyledFilterPills Component
function StyledFilterPills({ options, value, onChange, isDarkMode }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              value === option.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// Main PersonalCalendar Component
export default function PersonalCalendar() {
  const isDarkMode = false;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Team Standup',
      startTime: '09:00',
      endTime: '09:30',
      location: 'Conference Room A',
      attendees: ['John Doe', 'Jane Smith', 'Mike Wilson'],
      status: 'confirmed',
      type: 'project',
      projectName: 'AVATAR 1',
    },
    {
      id: 2,
      title: 'Scene 42 Review',
      startTime: '14:00',
      endTime: '15:30',
      location: 'Studio B',
      attendees: ['Director', 'Producer', 'Animation Team'],
      status: 'confirmed',
      type: 'project',
      projectName: 'AVATAR 1',
    },
    {
      id: 3,
      title: 'Client Meeting',
      startTime: '16:30',
      endTime: '17:30',
      location: 'Virtual',
      attendees: ['Client Rep', 'Project Manager'],
      status: 'pencil',
      type: 'project',
      projectName: 'AVATAR 2',
    },
    {
      id: 4,
      title: 'Doctor Appointment',
      startTime: '11:00',
      endTime: '12:00',
      location: 'City Hospital',
      attendees: ['Dr. Smith'],
      status: 'confirmed',
      type: 'personal',
    },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigate = (direction) => {
    if (view === 'month') navigateMonth(direction);
    else if (view === 'week') navigateWeek(direction);
    else if (view === 'day') navigateDay(direction);
    else if (view === 'year') navigateYear(direction);
  };

  const getEventsForDate = (day) => {
    return events.filter(event => day === 15);
  };

  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      weekDays.push(day);
    }
    
    return weekDays;
  };

  const getWeekRange = () => {
    const weekDays = getWeekDays();
    const start = weekDays[0];
    const end = weekDays[6];
    return `${monthNames[start.getMonth()].substring(0, 3)} ${start.getDate()} - ${monthNames[end.getMonth()].substring(0, 3)} ${end.getDate()}, ${end.getFullYear()}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42;

    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`} />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      const isSelected = day === selectedDate.getDate();

      days.push(
        <motion.div
          key={`day-${day}`}
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedDate(new Date(year, month, day))}
          className={`p-2 rounded-lg cursor-pointer transition-all border-2 ${
            isToday 
              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50'
              : isSelected
              ? isDarkMode ? 'border-purple-500 bg-gray-700' : 'border-purple-400 bg-purple-50'
              : isDarkMode 
              ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' 
              : 'border-gray-200 bg-white hover:bg-purple-50'
          }`}
        >
          <div className={`text-right mb-1 font-bold ${
            isToday 
              ? 'text-purple-600' 
              : isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {day}
          </div>
          {dayEvents.length > 0 && (
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded truncate ${
                    event.status === 'confirmed'
                      ? isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                      : isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          )}
        </motion.div>
      );
    }

    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`} />
      );
    }

    return days;
  };

  return (
    <StyledPageWrapper
      isDarkMode={isDarkMode}
      title="PERSONAL CALENDAR"
      subtitle="Manage your personal and project schedules"
      icon={Calendar}
      actions={
        <button
          onClick={() => setIsAddEventOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ADD EVENT
        </button>
      }
    >
      <StyledCard isDarkMode={isDarkMode}>
        <StyledFilterPills
          options={[
            { value: 'day', label: 'DAY', icon: Calendar },
            { value: 'week', label: 'WEEK', icon: CalendarRange },
            { value: 'month', label: 'MONTH', icon: CalendarDays },
            { value: 'year', label: 'YEAR', icon: Grid3x3 },
          ]}
          value={view}
          onChange={(val) => setView(val)}
          isDarkMode={isDarkMode}
        />
      </StyledCard>

      <StyledCard isDarkMode={isDarkMode}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('prev')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {view === 'month' && `${monthNames[month]} ${year}`}
            {view === 'week' && getWeekRange()}
            {view === 'day' && `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
            {view === 'year' && `${currentDate.getFullYear()}`}
          </h3>

          <button
            onClick={() => navigate('next')}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </StyledCard>

      {view === 'month' && (
        <StyledCard isDarkMode={isDarkMode}>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map(day => (
              <div
                key={day}
                className={`text-center font-bold text-xs py-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </StyledCard>
      )}

      {view === 'week' && (
        <StyledCard isDarkMode={isDarkMode}>
          <div className="grid grid-cols-8 gap-2">
            <div className="space-y-2">
              <div className="h-12"></div>
              {hours.map(hour => (
                <div key={hour} className={`h-16 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {getWeekDays().map((day, idx) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={idx} className="space-y-2">
                  <div className={`h-12 text-center rounded-lg p-2 ${
                    isToday 
                      ? 'bg-purple-600 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <div className="text-xs font-bold">{dayNames[day.getDay()]}</div>
                    <div className="text-lg font-bold">{day.getDate()}</div>
                  </div>
                  {hours.map(hour => (
                    <div
                      key={hour}
                      className={`h-16 rounded border ${
                        isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-purple-50'
                      } cursor-pointer transition-colors`}
                    >
                      {hour === 9 && day.getDate() === new Date().getDate() && (
                        <div className="p-1 bg-purple-600 text-white text-xs rounded m-1">
                          Team Standup
                        </div>
                      )}
                      {hour === 14 && day.getDate() === new Date().getDate() && (
                        <div className="p-1 bg-pink-600 text-white text-xs rounded m-1">
                          Scene Review
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </StyledCard>
      )}

      {view === 'day' && (
        <StyledCard isDarkMode={isDarkMode}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {hours.map(hour => (
                <div
                  key={hour}
                  className={`h-20 rounded-lg border-2 p-3 ${
                    isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {hour === 9 && (
                    <div className="mt-2 p-2 bg-purple-600 text-white text-xs rounded">
                      <div className="font-bold">Team Standup</div>
                      <div>09:00 - 09:30</div>
                    </div>
                  )}
                  {hour === 11 && (
                    <div className="mt-2 p-2 bg-green-600 text-white text-xs rounded">
                      <div className="font-bold">Doctor Appointment</div>
                      <div>11:00 - 12:00</div>
                    </div>
                  )}
                  {hour === 14 && (
                    <div className="mt-2 p-2 bg-pink-600 text-white text-xs rounded">
                      <div className="font-bold">Scene 42 Review</div>
                      <div>14:00 - 15:30</div>
                    </div>
                  )}
                  {hour === 16 && (
                    <div className="mt-2 p-2 bg-yellow-600 text-white text-xs rounded">
                      <div className="font-bold">Client Meeting</div>
                      <div>16:30 - 17:30</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                SCHEDULED EVENTS
              </h4>
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    event.status === 'confirmed'
                      ? isDarkMode ? 'bg-purple-900/20 border-purple-500' : 'bg-purple-50 border-purple-200'
                      : isDarkMode ? 'bg-yellow-900/20 border-yellow-500' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {event.title}
                      </h4>
                      {event.projectName && (
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {event.projectName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </StyledCard>
      )}

      {view === 'year' && (
        <div className="grid grid-cols-3 gap-4">
          {monthNames.map((monthName, monthIdx) => {
            const monthDate = new Date(currentDate.getFullYear(), monthIdx, 1);
            const { daysInMonth: monthDays, startingDayOfWeek: monthStart } = getDaysInMonth(monthDate);
            
            return (
              <StyledCard key={monthName} isDarkMode={isDarkMode}>
                <h4 className={`text-center font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {monthName}
                </h4>
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className={`text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {d}
                    </div>
                  ))}
                  
                  {Array.from({ length: monthStart }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  
                  {Array.from({ length: monthDays }).map((_, dayIdx) => {
                    const day = dayIdx + 1;
                    const isToday = day === new Date().getDate() && 
                                   monthIdx === new Date().getMonth() && 
                                   currentDate.getFullYear() === new Date().getFullYear();
                    
                    return (
                      <div
                        key={day}
                        className={`text-center text-xs p-1 rounded cursor-pointer transition-colors ${
                          isToday
                            ? 'bg-purple-600 text-white font-bold'
                            : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-purple-100'
                        }`}
                        onClick={() => {
                          setCurrentDate(new Date(currentDate.getFullYear(), monthIdx, day));
                          setView('day');
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </StyledCard>
            );
          })}
        </div>
      )}

      {isAddEventOpen && (
        <AddEventModal
          onClose={() => setIsAddEventOpen(false)}
          onAddEvent={(event) => {
            console.log('Adding event:', event);
            setIsAddEventOpen(false);
          }}
        />
      )}
    </StyledPageWrapper>
  );
}