import React, { useMemo, useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventPreview from './EventPreview';

interface UpcomingEventsProps {
  setActiveTab: (tab: string) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ setActiveTab }) => {
  const { events, loading, refreshEvents } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter events for today and sort by start time
  const todaysEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter(event => event.date === today)
      .sort((a, b) => {
        const timeA = new Date(`2000-01-01T${a.start_time}`);
        const timeB = new Date(`2000-01-01T${b.start_time}`);
        return timeA.getTime() - timeB.getTime();
      });
  }, [events]);

  const getEventColor = (type: string, isAdminAttending?: boolean) => {
    let baseColor = '';
    switch (type) {
      case 'meeting': baseColor = 'border-l-blue-500 bg-blue-50'; break;
      case 'therapy': baseColor = 'border-l-green-500 bg-green-50'; break;
      case 'consultation': baseColor = 'border-l-purple-500 bg-purple-50'; break;
      case 'assessment': baseColor = 'border-l-orange-500 bg-orange-50'; break;
      case 'training': baseColor = 'border-l-indigo-500 bg-indigo-50'; break;
      case 'other': baseColor = 'border-l-gray-500 bg-gray-50'; break;
      default: baseColor = 'border-l-gray-500 bg-gray-50'; break;
    }
    
    // Add admin highlighting with border and shadow
    if (isAdminAttending) {
      return `${baseColor} border-2 border-yellow-400 shadow-lg ring-2 ring-yellow-200 ring-opacity-50`;
    }
    
    return baseColor;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedEvent(null);
  };

  const handleScheduleEvent = () => {
    handleClosePreview();
    setActiveTab('calendar');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
        <div className="space-y-3">
          {todaysEvents.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No events scheduled for today</p>
              <button 
                onClick={handleScheduleEvent}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Schedule an event
              </button>
            </div>
          ) : (
            todaysEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type, event.isAdminAttending)} hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {event.attendees}
                        </div>
                      )}
                      {event.student_name && (
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Student:</span> {event.student_name}
                        </div>
                      )}
                      {event.author_name && (
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Created by:</span> {event.author_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                    Click to view
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <EventPreview
        event={selectedEvent}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onEventUpdated={(updatedEvent) => {
          // Refresh the events list when an event is updated
          console.log('Event updated:', updatedEvent);
          refreshEvents(); // Manually refresh the events list
          handleClosePreview();
        }}
      />
    </>
  );
};

export default UpcomingEvents;