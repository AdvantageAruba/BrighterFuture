import React from 'react';
import { X, Calendar, Clock, MapPin, Users, FileText, Edit, Trash2, Copy } from 'lucide-react';

interface EventDetailsProps {
  event: {
    id: number;
    title: string;
    start: string;
    end: string;
    date: string;
    type: string;
    location: string;
    attendees: string[];
    description?: string;
    priority?: string;
    program?: string;
    student?: string;
    notes?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'therapy': return 'bg-green-100 text-green-800 border-green-200';
      case 'assessment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'consultation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'training': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getEventColor(event.type)}`}>
              {event.type}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
              <p className="text-gray-600">{formatDate(event.date)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Event Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Attendees</p>
                    <p className="font-medium text-gray-900">{event.attendees.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority and Program Info */}
            {(event.priority || event.program || event.student) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Information</h3>
                <div className="space-y-3">
                  {event.priority && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                        {event.priority} priority
                      </span>
                    </div>
                  )}
                  {event.program && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Program:</span>
                      <span className="text-sm font-medium text-gray-900">{event.program}</span>
                    </div>
                  )}
                  {event.student && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Student:</span>
                      <span className="text-sm font-medium text-gray-900">{event.student}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Description</span>
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {event.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">{event.notes}</p>
                </div>
              </div>
            )}

            {/* Event Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                  <span>Edit Event</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <Copy className="w-4 h-4" />
                  <span>Duplicate Event</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;