import React, { useEffect, useState } from 'react';
import { X, Clock, MapPin, Users, Calendar, AlertTriangle, FileText, MessageSquare, User, Edit, Save, ArrowLeft } from 'lucide-react';
import { Event } from '../hooks/useEvents';
import AddEvent from './AddEvent';

interface EventPreviewProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated?: (updatedEvent: Event) => void;
}

const EventPreview: React.FC<EventPreviewProps> = ({ event, isOpen, onClose, onEventUpdated }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditMode) {
          setIsEditMode(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isEditMode]);

  if (!isOpen || !event) return null;

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleEventUpdated = (updatedEvent?: Event) => {
    setIsEditMode(false);
    if (onEventUpdated && updatedEvent) {
      onEventUpdated(updatedEvent);
    }
    onClose();
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-5 h-5" />;
      case 'therapy': return <MessageSquare className="w-5 h-5" />;
      case 'assessment': return <FileText className="w-5 h-5" />;
      case 'consultation': return <User className="w-5 h-5" />;
      case 'training': return <AlertTriangle className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'therapy': return 'bg-green-100 text-green-800';
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'assessment': return 'bg-orange-100 text-orange-800';
      case 'training': return 'bg-indigo-100 text-indigo-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // If in edit mode, show the AddEvent form
  if (isEditMode) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleCancelEdit}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit Mode Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Event</h2>
                <p className="text-sm text-gray-500">Modify event details</p>
              </div>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Edit Form */}
          <div className="p-6">
            <AddEvent 
              isEditMode={true}
              existingEvent={event}
              onEventAdded={handleEventUpdated}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      </div>
    );
  }

  // Preview mode
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
              <p className="text-sm text-gray-500 capitalize">{event.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{event.location}</p>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && (
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Attendees</p>
                <p className="font-medium text-gray-900">{event.attendees}</p>
              </div>
            </div>
          )}

          {/* Student */}
          {event.student_name && (
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium text-gray-900">{event.student_name}</p>
              </div>
            </div>
          )}

          {/* Priority */}
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(event.priority)}`}>
                {event.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{event.description}</p>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Notes</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{event.notes}</p>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {event.program_name && (
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium text-gray-900">{event.program_name}</p>
              </div>
            )}
            {event.recurring && (
              <div>
                <p className="text-sm text-gray-500">Recurring</p>
                <p className="font-medium text-gray-900">
                  {event.recurring_type ? `${event.recurring_type} recurring` : 'Yes'}
                </p>
              </div>
            )}
            {event.reminder_minutes && (
              <div>
                <p className="text-sm text-gray-500">Reminder</p>
                <p className="font-medium text-gray-900">{event.reminder_minutes} minutes before</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Created by</p>
              <p className="font-medium text-gray-900">{event.author_name}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;
