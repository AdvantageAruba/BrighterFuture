import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import AddEvent from './AddEvent';
import EventDetails from './EventDetails';
import CalendarGrid from './CalendarGrid';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  const events = [
    {
      id: 1,
      title: 'IEP Meeting - Emma Rodriguez',
      start: '09:00',
      end: '10:00',
      date: '2024-01-15',
      type: 'meeting',
      location: 'Conference Room A',
      attendees: ['Dr. Johnson', 'Ms. Smith', 'Parent'],
      description: 'Individual Education Program meeting to discuss Emma\'s progress and update her learning goals.',
      priority: 'high',
      program: 'Brighter Future Academy',
      student: 'Emma Rodriguez',
      notes: 'Please bring previous assessment results and current IEP documentation.'
    },
    {
      id: 2,
      title: 'Group Therapy Session',
      start: '11:30',
      end: '12:30',
      date: '2024-01-15',
      type: 'therapy',
      location: 'Therapy Room 2',
      attendees: ['Dr. Wilson', '6 students'],
      description: 'Weekly group therapy session focusing on social skills development and peer interaction.',
      priority: 'medium',
      program: 'First Steps',
      notes: 'Focus on turn-taking and communication skills this week.'
    },
    {
      id: 3,
      title: 'Assessment - Michael Chen',
      start: '14:00',
      end: '15:00',
      date: '2024-01-15',
      type: 'assessment',
      location: 'Assessment Room',
      attendees: ['Dr. Brown', 'Parent'],
      description: 'Comprehensive developmental assessment to evaluate progress and adjust intervention strategies.',
      priority: 'high',
      program: 'First Steps',
      student: 'Michael Chen',
      notes: 'This is a follow-up assessment after 3 months of intervention.'
    },
    {
      id: 4,
      title: 'Parent Consultation',
      start: '16:00',
      end: '17:00',
      date: '2024-01-16',
      type: 'consultation',
      location: 'Office 3',
      attendees: ['Dr. Johnson', 'Parent'],
      description: 'Consultation meeting to discuss home strategies and coordinate care between school and home.',
      priority: 'medium',
      program: 'Individual Therapy',
      student: 'Isabella Garcia'
    }
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsAddEventOpen(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedDate(null);
    setIsAddEventOpen(true);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (view === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    } else if (view === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else if (view === 'day') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    }
    
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-2">Schedule and manage sessions, meetings, and activities</p>
        </div>
        <button 
          onClick={handleAddEvent}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Events</option>
                  <option>Meetings</option>
                  <option>Therapy Sessions</option>
                  <option>Assessments</option>
                  <option>Consultations</option>
                </select>
              </div>
            </div>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  view === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  view === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  view === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            events={events}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {isAddEventOpen && (
        <AddEvent
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          selectedDate={selectedDate || undefined}
        />
      )}

      {isEventDetailsOpen && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendar;