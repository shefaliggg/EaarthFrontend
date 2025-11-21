import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Grid3x3, CalendarDays, CalendarRange } from 'lucide-react';

export default function PersonalCalendar({ isDarkMode = false }) {
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

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(direction === 'prev' ? currentDate.getMonth() - 1 : currentDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(direction === 'prev' ? currentDate.getDate() - 7 : currentDate.getDate() + 7);
    } else if (view === 'day') {
      newDate.setDate(direction === 'prev' ? currentDate.getDate() - 1 : currentDate.getDate() + 1);
    } else if (view === 'year') {
      newDate.setFullYear(direction === 'prev' ? currentDate.getFullYear() - 1 : currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
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
        <div key={`empty-${i}`} className={`p-2 rounded-lg ${isDarkMode ? 'bg-muted' : 'bg-muted'}`} />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      const isSelected = day === selectedDate.getDate();

      days.push(
        <div
          key={`day-${day}`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
          className={`p-2 rounded-lg cursor-pointer transition-all border-2 hover:scale-[1.02] ${
            isToday 
              ? 'border-primary bg-primary/10'
              : isSelected
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:bg-primary/5'
          }`}
        >
          <div className={`text-right mb-1 font-bold ${
            isToday ? 'text-primary' : 'text-foreground'
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
                      ? 'bg-primary/20 text-primary'
                      : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className={`p-2 rounded-lg ${isDarkMode ? 'bg-muted' : 'bg-muted'}`} />
      );
    }

    return days;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            PERSONAL CALENDAR
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal and project schedules</p>
        </div>
        <button
          onClick={() => setIsAddEventOpen(true)}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ADD EVENT
        </button>
      </div>

      {/* View Filters */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'day', label: 'DAY', icon: Calendar },
            { value: 'week', label: 'WEEK', icon: CalendarRange },
            { value: 'month', label: 'MONTH', icon: CalendarDays },
            { value: 'year', label: 'YEAR', icon: Grid3x3 },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setView(option.value)}
                className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  view === option.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('prev')}
            className="p-2.5 rounded-lg transition-colors hover:bg-muted text-foreground"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h3 className="font-bold text-base text-foreground">
            {view === 'month' && `${monthNames[month]} ${year}`}
            {view === 'week' && getWeekRange()}
            {view === 'day' && `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
            {view === 'year' && `${currentDate.getFullYear()}`}
          </h3>

          <button
            onClick={() => navigate('next')}
            className="p-2.5 rounded-lg transition-colors hover:bg-muted text-foreground"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Month View */}
      {view === 'month' && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center font-bold text-[10px] py-1 text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 min-w-[1000px]">
            {/* Time column */}
            <div className="space-y-2">
              <div className="h-16 flex items-center justify-center"></div>
              {hours.map(hour => (
                <div key={hour} className="h-14 text-[10px] text-muted-foreground flex items-center justify-center">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Week days */}
            {getWeekDays().map((day, idx) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={idx} className="space-y-2">
                  <div className={`h-16 text-center rounded-lg p-2 flex flex-col items-center justify-center ${
                    isToday 
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    <div className="text-[10px] font-bold">{dayNames[day.getDay()]}</div>
                    <div className="text-xl font-bold">{day.getDate()}</div>
                  </div>
                  {hours.map(hour => (
                    <div
                      key={hour}
                      className="h-14 rounded-lg border border-border hover:bg-primary/5 cursor-pointer transition-colors relative"
                    >
                      {hour === 9 && day.getDate() === new Date().getDate() && (
                        <div className="absolute inset-1 p-1 bg-primary text-primary-foreground text-[10px] rounded flex flex-col justify-center">
                          <div className="font-bold truncate">Team Standup</div>
                        </div>
                      )}
                      {hour === 14 && day.getDate() === new Date().getDate() && (
                        <div className="absolute inset-1 p-1 bg-secondary text-secondary-foreground text-[10px] rounded flex flex-col justify-center">
                          <div className="font-bold truncate">Scene Review</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {view === 'day' && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Time slots */}
            <div className="space-y-2">
              {hours.map(hour => (
                <div
                  key={hour}
                  className="h-16 rounded-lg border-2 border-border bg-card p-2"
                >
                  <div className="text-xs font-bold text-foreground">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {hour === 9 && (
                    <div className="mt-1 p-1.5 bg-primary text-primary-foreground text-[10px] rounded">
                      <div className="font-bold">Team Standup</div>
                      <div>09:00 - 09:30</div>
                    </div>
                  )}
                  {hour === 11 && (
                    <div className="mt-1 p-1.5 bg-green-600 text-white text-[10px] rounded">
                      <div className="font-bold">Doctor Appointment</div>
                      <div>11:00 - 12:00</div>
                    </div>
                  )}
                  {hour === 14 && (
                    <div className="mt-1 p-1.5 bg-secondary text-secondary-foreground text-[10px] rounded">
                      <div className="font-bold">Scene 42 Review</div>
                      <div>14:00 - 15:30</div>
                    </div>
                  )}
                  {hour === 16 && (
                    <div className="mt-1 p-1.5 bg-yellow-600 text-white text-[10px] rounded">
                      <div className="font-bold">Client Meeting</div>
                      <div>16:30 - 17:30</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Event list */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-foreground">
                SCHEDULED EVENTS
              </h4>
              {events.map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                  className={`p-3 rounded-lg border-2 ${
                    event.status === 'confirmed'
                      ? 'bg-primary/10 border-primary'
                      : 'bg-yellow-500/10 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {event.title}
                      </h4>
                      {event.projectName && (
                        <span className="text-[10px] text-muted-foreground">
                          {event.projectName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Year View */}
      {view === 'year' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthNames.map((monthName, monthIdx) => {
            const monthDate = new Date(currentDate.getFullYear(), monthIdx, 1);
            const { daysInMonth: monthDays, startingDayOfWeek: monthStart } = getDaysInMonth(monthDate);
            
            return (
              <div key={monthName} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h4 className="text-center font-bold mb-3 text-foreground text-xs">
                  {monthName}
                </h4>
                <div className="grid grid-cols-7 gap-1.5">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-muted-foreground h-5 flex items-center justify-center">
                      {d}
                    </div>
                  ))}
                  
                  {Array.from({ length: monthStart }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {Array.from({ length: monthDays }).map((_, dayIdx) => {
                    const day = dayIdx + 1;
                    const isToday = day === new Date().getDate() && 
                                   monthIdx === new Date().getMonth() && 
                                   currentDate.getFullYear() === new Date().getFullYear();
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square text-center text-[10px] font-medium rounded-lg cursor-pointer transition-all flex items-center justify-center ${
                          isToday
                            ? 'bg-primary text-primary-foreground font-bold scale-110'
                            : 'text-foreground hover:bg-primary/10 hover:scale-105 border border-border'
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}