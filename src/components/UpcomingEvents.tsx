import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

interface UpcomingEventsProps {
  setActiveTab: (tab: string) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ setActiveTab }) => {
  const events = [
    {
      id: 1,
      title: 'IEP Meeting',
      time: '9:00 AM',
      location: 'Conference Room A',
      attendees: 4,
      type: 'meeting',
      navigateTo: 'calendar'
    },
    {
      id: 2,
      title: 'Group Therapy Session',
      time: '11:30 AM',
      location: 'Therapy Room 2',
      attendees: 6,
      type: 'therapy',
      navigateTo: 'calendar'
    },
    {
      id: 3,
      title: 'Parent Consultation',
      time: '2:00 PM',
      location: 'Office 3',
      attendees: 3,
      type: 'consultation',
      navigateTo: 'calendar'
    },
    {
      id: 4,
      title: 'Assessment Review',
      time: '4:15 PM',
      location: 'Assessment Room',
      attendees: 2,
      type: 'review',
      navigateTo: 'forms'
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'border-l-blue-500 bg-blue-50';
      case 'therapy': return 'border-l-green-500 bg-green-50';
      case 'consultation': return 'border-l-purple-500 bg-purple-50';
      case 'review': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleEventClick = (navigateTo: string) => {
    setActiveTab(navigateTo);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} hover:shadow-sm transition-shadow duration-150 cursor-pointer`}
            onClick={() => handleEventClick(event.navigateTo)}
          >
            <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {event.attendees} attendees
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;