import { ChevronLeft, ChevronRight, MapPin, Users, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return { bg: 'bg-green-500', bgLight: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', square: 'bg-green-500' };
    case 'pencil':
      return { bg: 'bg-yellow-500', bgLight: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', square: 'bg-yellow-500' };
    case 'cancelled':
      return { bg: 'bg-red-500', bgLight: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', square: 'bg-red-500' };
    case 'not-available':
      return { bg: 'bg-gray-500', bgLight: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', square: 'bg-gray-500' };
    default:
      return { bg: 'bg-blue-500', bgLight: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', square: 'bg-blue-500' };
  }
};
function ProjectCalendar({ projectName, isProjectCalendar = false }) {
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Sample events
  const allEvents = [
    {
      id: 1,
      title: 'Scene 42 Animation Review',
      start: '09:00',
      end: '11:00',
      date: new Date(2025, 11, 24),
      status: 'confirmed',
      location: 'Studio A, Mumbai',
      attendees: ['Shefali Gajbhiye', 'Director James', 'Producer Sarah', 'Animation Lead'],
      createdBy: 'Director James',
      createdAt: '2025-11-12 14:30',
      project: 'AVATAR 1',
    },
    {
      id: 2,
      title: 'Character Design Meeting',
      start: '14:00',
      end: '16:00',
      date: new Date(2025, 12, 13),
      status: 'pencil',
      location: 'Conference Room B',
      attendees: ['Shefali Gajbhiye', 'Art Director', 'Design Team'],
      createdBy: 'Art Director',
      createdAt: '2025-11-11 12:15',
      project: 'AVATAR 2',
    },
    {
      id: 3,
      title: 'Motion Capture Session',
      start: '12:00',
      end: '18:00',
      date: new Date(2025, 12, 14),
      status: 'cancelled',
      location: 'MoCap Studio, Andheri',
      attendees: ['Shefali Gajbhiye', 'MoCap Team', 'Director', 'Actors x5'],
      createdBy: 'Production Manager',
      createdAt: '2025-11-01 09:00',
      project: 'AVATAR 1',
    },
    {
      id: 4,
      title: 'Storyboard Review',
      start: '11:00',
      end: '13:00',
      date: new Date(2025, 12, 15),
      status: 'confirmed',
      location: 'Virtual Meeting',
      attendees: ['Shefali Gajbhiye', 'Storyboard Artist', 'Director'],
      createdBy: 'Shefali Gajbhiye',
      createdAt: '2025-11-08 16:45',
      project: 'AVATAR 2',
    },
  ];

  const events = isProjectCalendar && projectName
    ? allEvents.filter(e => e.project === projectName)
    : allEvents;

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const getDayEvents = (date) => {
    return events.filter(event =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const renderDayView = () => {
    const dayEvents = getDayEvents(currentDate);

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[80px_1fr] bg-background rounded-xl shadow-md overflow-hidden">
          {/* Time column */}
          <div className="border-r border-gray-200">
            <div className="h-16 border-b border-gray-200" /> {/* Header spacer */}
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b border-gray-200 px-2 py-1 text-sm text-gray-500">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="relative">
            {/* Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-center bg-[#ede7f6]">
              <div className="text-center">
                <div className="font-bold text-gray-900">{daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}</div>
                <div className="text-sm text-gray-500">{currentDate.getDate()} {monthNames[currentDate.getMonth()]}</div>
              </div>
            </div>

            {/* Hour grid */}
            <div className="relative">
              {hours.map(hour => (
                <div key={hour} className="h-20 border-b border-gray-100" />
              ))}

              {/* Events */}
              {dayEvents.map(event => {
                const [startHour, startMinute] = event.start.split(':').map(Number);
                const [endHour, endMinute] = event.end.split(':').map(Number);
                const top = (startHour + startMinute / 60) * 80;
                const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 80;
                const colors = getStatusColor(event.status);

                return (
                  <div
                    key={event.id}
                    className={`absolute left-2 right-2 ${colors.bg} ${colors.border} border-l-4 rounded-lg p-2 shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`font-bold text-sm ${colors.text}`}>{event.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {event.start} - {event.end}
                    </div>
                    {event.location && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {event.attendees.length} attendees
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-background rounded-xl shadow-md overflow-hidden">
          {/* Time column */}
          <div className="border-r border-gray-200">
            <div className="h-16 border-b border-gray-200" /> {/* Header spacer */}
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b border-gray-200 px-2 py-1 text-sm text-gray-500">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIndex) => {
            const dayEvents = getDayEvents(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div key={dayIndex} className="relative border-r border-gray-200 last:border-r-0">
                {/* Header */}
                <div className={`h-16 border-b border-gray-200 flex flex-col items-center justify-center ${isToday ? 'bg-[#ede7f6]' : ''}`}>
                  <div className="font-bold text-gray-900 text-sm">{daysOfWeek[dayIndex].slice(0, 3)}</div>
                  <div className={`text-lg ${isToday ? 'text-[#7e57c2] font-bold' : 'text-gray-600'}`}>
                    {date.getDate()}
                  </div>
                </div>

                {/* Hour grid */}
                <div className="relative">
                  {hours.map(hour => (
                    <div key={hour} className="h-20 border-b border-gray-100" />
                  ))}

                  {/* Events */}
                  {dayEvents.map(event => {
                    const [startHour, startMinute] = event.start.split(':').map(Number);
                    const [endHour, endMinute] = event.end.split(':').map(Number);
                    const top = (startHour + startMinute / 60) * 80;
                    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 80;
                    const colors = getStatusColor(event.status);

                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 ${colors.bg} ${colors.border} border-l-4 rounded p-1 text-xs cursor-pointer hover:shadow-md transition-all overflow-hidden`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className={`font-bold ${colors.text} truncate`}>{event.title}</div>
                        <div className="text-gray-600">{event.start}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="bg-background rounded-xl shadow-md p-4">
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-bold text-gray-700 py-2">
              {day.slice(0, 3)}
            </div>
          ))}
          {days.map((day, idx) => {
            if (!day) return <div key={idx} className="aspect-square" />;

            const date = new Date(year, month, day);
            const dayEvents = getDayEvents(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={idx}
                className={`aspect-square border-2 rounded-lg p-2 ${isToday ? 'border-[#9575cd] bg-[#ede7f6]' : 'border-gray-200 hover:border-[#b39ddb]'
                  } cursor-pointer transition-all`}
              >
                <div className={`font-bold ${isToday ? 'text-[#7e57c2]' : 'text-gray-900'}`}>
                  {day}
                </div>
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 3).map(event => {
                    const colors = getStatusColor(event.status);
                    return (
                      <div
                        key={event.id}
                        className={`${colors.square} h-2 w-2 rounded-sm`}
                        onClick={() => setSelectedEvent(event)}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 3}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map(monthIndex => {
          const monthDate = new Date(year, monthIndex, 1);
          const monthEvents = events.filter(e =>
            e.date.getMonth() === monthIndex && e.date.getFullYear() === year
          );

          return (
            <div key={monthIndex} className="bg-background rounded-xl shadow-md p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-center">
                {monthNames[monthIndex]}
              </h3>
              <div className="space-y-2">
                {monthEvents.slice(0, 5).map(event => {
                  const colors = getStatusColor(event.status);
                  return (
                    <div
                      key={event.id}
                      className={`${colors.bg} ${colors.border} border-l-4 rounded p-2 cursor-pointer hover:shadow-sm transition-all`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`font-bold text-xs ${colors.text}`}>{event.title}</div>
                      <div className="text-xs text-gray-500">{event.date.getDate()} {monthNames[monthIndex].slice(0, 3)}</div>
                    </div>
                  );
                })}
                {monthEvents.length > 5 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{monthEvents.length - 5} more
                  </div>
                )}
                {monthEvents.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">No events</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="border bg-gradient-to-br from-gray-900 to-gray-900 rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isProjectCalendar ? `${projectName} CALENDAR` : 'MY CALENDAR'}
            </h1>
            <p className="text-white/80 text-sm">
              {isProjectCalendar ? 'Project-specific events and meetings' : 'All your events across projects'}
            </p>
          </div>

          {/* View Selector */}
          <div className="flex gap-2">
            {(['day', 'week', 'month', 'year']).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${view === v
                    ? 'bg-background text-[#7e57c2] shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => navigate('prev')}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <h2 className="text-xl font-bold text-white">
            {view === 'day' && `${daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {view === 'week' && `Week of ${getWeekDates()[0].getDate()} ${monthNames[getWeekDates()[0].getMonth()]} ${currentDate.getFullYear()}`}
            {view === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {view === 'year' && currentDate.getFullYear()}
          </h2>

          <button
            onClick={() => navigate('next')}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
      {view === 'year' && renderYearView()}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-white rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${getStatusColor(selectedEvent.status).bg} rounded-xl p-6 mb-4`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 ${getStatusColor(selectedEvent.status).bg} ${getStatusColor(selectedEvent.status).border} border-2 rounded-full text-sm font-bold`}>
                    {selectedEvent.status.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-white/80 rounded-full text-sm font-bold">
                    {selectedEvent.project}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-bold text-gray-900">{selectedEvent.start} - {selectedEvent.end}</div>
                    <div className="text-sm text-gray-500">
                      {selectedEvent.date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div className="font-medium text-gray-700">{selectedEvent.location}</div>
                  </div>
                )}

                {selectedEvent.attendees && (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="font-bold text-gray-900">{selectedEvent.attendees.length} ATTENDEES</div>
                    </div>
                    <div className="ml-8 space-y-1">
                      {selectedEvent.attendees.map((attendee, idx) => (
                        <div key={idx} className="text-sm text-gray-700">{attendee}</div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.createdBy && (
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <div>Created by {selectedEvent.createdBy} on {selectedEvent.createdAt}</div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-6 w-full px-6 py-3 bg-[#9575cd] text-white rounded-xl font-bold hover:bg-[#7e57c2] transition-colors"
              >
                CLOSE
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectCalendar

