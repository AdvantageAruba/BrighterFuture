import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  currentDate: Date;
  view: string;
  events: any[];
  onDateSelect: (date: string) => void;
  onEventClick: (event: any) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  view,
  events,
  onDateSelect,
  onEventClick,
  onNavigate
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500 text-white';
      case 'therapy': return 'bg-green-500 text-white';
      case 'assessment': return 'bg-purple-500 text-white';
      case 'consultation': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(currentDay);
    }
    
    return days;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-24 border-r border-b border-gray-200"></div>;
            }
            
            const dateString = formatDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const dayEvents = getEventsForDate(dateString);
            const isCurrentDay = isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            
            return (
              <div
                key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}-${index}`}
                className="h-24 border-r border-b border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                onClick={() => onDateSelect(dateString)}
              >
                <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-8 gap-0 border-b border-gray-200">
          <div className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">Time</div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-3 text-center text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                isToday(day) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 bg-gray-50'
              }`}
              onClick={() => onDateSelect(formatDateString(day))}
            >
              <div>{dayNames[day.getDay()]}</div>
              <div className="text-lg font-bold">{day.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-0">
          {Array.from({ length: 12 }, (_, hour) => {
            const timeSlot = `${(hour + 8).toString().padStart(2, '0')}:00`;
            return (
              <React.Fragment key={hour}>
                <div className="p-2 text-xs text-gray-500 border-r border-b border-gray-200 bg-gray-50">
                  {timeSlot}
                </div>
                {weekDays.map((day) => {
                  const dateString = formatDateString(day);
                  const dayEvents = getEventsForDate(dateString).filter(event => 
                    event.start.startsWith((hour + 8).toString().padStart(2, '0'))
                  );
                  
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="h-16 border-r border-b border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => onDateSelect(dateString)}
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded mb-1 cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(formatDateString(currentDate));
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        <div className="p-4">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No events scheduled for this day</p>
              <button
                onClick={() => onDateSelect(formatDateString(currentDate))}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Add an event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-sm transition-shadow duration-150 ${getEventColor(event.type).replace('text-white', 'text-gray-800').replace('bg-', 'border-l-').replace('-500', '-500 bg-').replace('bg-', 'bg-').replace('-500', '-50')}`}
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <span className="text-sm text-gray-600">{event.start} - {event.end}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {view === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {view === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
            {view === 'day' && currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarGrid;