import React from 'react';
import { X, User, Clock, MessageSquare, Tag, Edit, Trash2 } from 'lucide-react';

interface ViewDailyNoteProps {
  note: {
    id: number;
    studentName: string;
    program: string;
    programName: string;
    author: string;
    timestamp: string;
    category: string;
    note: string;
    tags: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

const ViewDailyNote: React.FC<ViewDailyNoteProps> = ({ note, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavior': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-green-100 text-green-800';
      case 'therapy': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      case 'medical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = formatTime(note.timestamp);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Daily Note Details</h2>
            <p className="text-gray-600">{note.studentName} - {note.programName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Note Header */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{note.studentName}</h3>
                    <p className="text-sm text-gray-600">{note.programName}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(note.category)}`}>
                  {note.category}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Author: {note.author}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{time} on {date}</span>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Observation Notes</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{note.note}</p>
              </div>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Note Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <span className="font-medium">Created:</span> {date} at {time}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {note.category}
                </div>
                <div>
                  <span className="font-medium">Program:</span> {note.programName}
                </div>
                <div>
                  <span className="font-medium">Staff Member:</span> {note.author}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Edit className="w-4 h-4" />
              <span>Edit Note</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
              <Trash2 className="w-4 h-4" />
              <span>Delete Note</span>
            </button>
          </div>
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

export default ViewDailyNote;