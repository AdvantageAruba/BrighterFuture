import React, { useState } from 'react';
import { Plus, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import AddEvent from './AddEvent';
import EventDetails from './EventDetails';
import CalendarGrid from './CalendarGrid';
import { useEvents } from '../hooks/useEvents';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Use the events hook to get real data
  const { events, loading, error, refreshEvents, addEvent, deleteEvent } = useEvents();

  // Transform events to match the expected format for CalendarGrid
  const transformedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    date: event.date,
    type: event.type,
    location: event.location,
    attendees: event.attendees ? event.attendees.split(', ') : [],
    description: event.description,
    priority: event.priority,
    program: event.program_name,
    student: event.student_name,
    notes: event.notes,
    author: event.author_name,
    created_at: event.created_at
  }));

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

  const handleDateNavigation = (selectedDate: string) => {
    setCurrentDate(new Date(selectedDate));
    setIsDatePickerOpen(false);
  };

  const handleEditEvent = (event: any) => {
    // Find the original event data from the events array
    const originalEvent = events.find(e => e.id === event.id);
    
    if (originalEvent) {
      setEventToEdit(originalEvent);
      setIsEditEventOpen(true);
      setIsEventDetailsOpen(false);
    } else {
      console.error('Original event not found for editing:', event);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const result = await deleteEvent(eventId);
        if (result.success) {
          alert('Event deleted successfully!');
          setIsEventDetailsOpen(false);
        } else {
          alert(`Failed to delete event: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
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
              <button
                onClick={() => setIsDatePickerOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Go to Date</span>
              </button>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading events...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading events: {error}</p>
            </div>
          ) : (
            <CalendarGrid
              currentDate={currentDate}
              view={view}
              events={transformedEvents}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </div>

      {isAddEventOpen && (
        <AddEvent
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          selectedDate={selectedDate || undefined}
          onEventAdded={refreshEvents}
        />
      )}

      {isEventDetailsOpen && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {isEditEventOpen && eventToEdit && (
        <AddEvent
          isOpen={isEditEventOpen}
          onClose={() => {
            setIsEditEventOpen(false);
            setEventToEdit(null);
          }}
          isEditMode={true}
          existingEvent={eventToEdit}
          onEventAdded={(updatedEvent) => {
            setIsEditEventOpen(false);
            setEventToEdit(null);
            refreshEvents();
          }}
        />
      )}

      {/* Date Picker Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Go to Date</h2>
                <p className="text-gray-600">Select a specific date to navigate to</p>
              </div>
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleDateNavigation(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Quick Navigation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Navigation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const today = new Date();
                        handleDateNavigation(today.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        handleDateNavigation(tomorrow.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Tomorrow
                    </button>
                    <button
                      onClick={() => {
                        const nextWeek = new Date();
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        handleDateNavigation(nextWeek.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Next Week
                    </button>
                    <button
                      onClick={() => {
                        const nextMonth = new Date();
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        handleDateNavigation(nextMonth.toISOString().split('T')[0]);
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Next Month
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;