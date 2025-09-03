import React from 'react';
import { X, User, Clock, MessageSquare, Tag, Edit, Trash2, Heart, BookOpen, Users, Activity, Award, AlertTriangle, Phone, Calendar } from 'lucide-react';

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
  onEdit?: (note: any) => void;
  onDelete?: (noteId: number) => void;
}

const ViewDailyNote: React.FC<ViewDailyNoteProps> = ({ note, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  // Parse the notes JSON to get all the detailed information
  const parseNoteData = () => {
    try {
      // First, try to parse as JSON
      const noteData = JSON.parse(note.note);
      return {
        category: noteData.category || 'other',
        overallMood: noteData.overallMood || 'neutral',
        generalNotes: noteData.generalNotes || '',
        behaviorNotes: noteData.behaviorNotes || '',
        academicProgress: noteData.academicProgress || '',
        socialInteraction: noteData.socialInteraction || '',
        activitiesParticipated: noteData.activitiesParticipated || '',
        achievementsSuccesses: noteData.achievementsSuccesses || '',
        concernsChallenges: noteData.concernsChallenges || '',
        priority: noteData.priority || 'medium',
        parentContacted: noteData.parentContacted || false,
        parentContactNotes: noteData.parentContactNotes || '',
        followUpNeeded: noteData.followUpNeeded || false,
        followUpAssignee: noteData.followUpAssignee || '',
        tags: noteData.tags || []
      };
    } catch (e) {
      // If JSON parsing fails, treat it as plain text
      console.log('Note contains plain text, not JSON format');
      return {
        category: note.category,
        overallMood: 'neutral',
        generalNotes: note.note, // Use the raw note text
        behaviorNotes: '',
        academicProgress: '',
        socialInteraction: '',
        activitiesParticipated: '',
        achievementsSuccesses: '',
        concernsChallenges: '',
        priority: 'medium',
        parentContacted: false,
        parentContactNotes: '',
        followUpNeeded: false,
        followUpAssignee: '',
        tags: note.tags
      };
    }
  };

  const noteData = parseNoteData();

  const handleEdit = () => {
    if (onEdit) {
      // Create a note object with the parsed data for editing
      const editNote = {
        ...note,
        parsedData: noteData
      };
      onEdit(editNote);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onDelete(note.id);
    }
  };

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

  const getMoodDisplay = (mood: string) => {
    const moods = {
      'very-happy': { name: 'Very Happy', emoji: '😄', color: 'text-green-600' },
      'happy': { name: 'Happy', emoji: '😊', color: 'text-green-500' },
      'neutral': { name: 'Neutral', emoji: '😐', color: 'text-gray-600' },
      'sad': { name: 'Sad', emoji: '😢', color: 'text-blue-600' },
      'frustrated': { name: 'Frustrated', emoji: '😤', color: 'text-orange-600' },
      'anxious': { name: 'Anxious', emoji: '😰', color: 'text-yellow-600' },
      'excited': { name: 'Excited', emoji: '🤩', color: 'text-purple-600' },
      'tired': { name: 'Tired', emoji: '😴', color: 'text-gray-500' }
    };
    return moods[mood as keyof typeof moods] || moods.neutral;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto p-6">
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(noteData.category)}`}>
                  {noteData.category}
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
            <div className="space-y-6">
              {/* Overall Mood and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Overall Mood</span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodDisplay(noteData.overallMood).emoji}</span>
                    <span className={`font-medium ${getMoodDisplay(noteData.overallMood).color}`}>
                      {getMoodDisplay(noteData.overallMood).name}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Priority Level</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(noteData.priority)}`}>
                    {noteData.priority.charAt(0).toUpperCase() + noteData.priority.slice(1)} Priority
                  </span>
                </div>
              </div>

              {/* General Notes */}
              {noteData.generalNotes && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>General Notes</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.generalNotes}</p>
                </div>
              )}

              {/* Behavior Notes */}
              {noteData.behaviorNotes && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Behavior Notes</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.behaviorNotes}</p>
                </div>
              )}

              {/* Academic Progress */}
              {noteData.academicProgress && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Academic Progress</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.academicProgress}</p>
                </div>
              )}

              {/* Social Interaction */}
              {noteData.socialInteraction && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Social Interaction</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.socialInteraction}</p>
                </div>
              )}

              {/* Activities Participated */}
              {noteData.activitiesParticipated && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Activities Participated In</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.activitiesParticipated}</p>
                </div>
              )}

              {/* Achievements and Successes */}
              {noteData.achievementsSuccesses && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Achievements & Successes</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.achievementsSuccesses}</p>
                </div>
              )}

              {/* Concerns and Challenges */}
              {noteData.concernsChallenges && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Concerns & Challenges</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{noteData.concernsChallenges}</p>
                </div>
              )}

              {/* Parent Contact Information */}
              {noteData.parentContacted && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Parent Contact</span>
                  </h4>
                  <div className="space-y-2">
                    <p className="text-blue-800">
                      <span className="font-medium">Status:</span> Parent/Guardian has been contacted
                    </p>
                    {noteData.parentContactNotes && (
                      <div>
                        <p className="text-blue-800 font-medium mb-1">Contact Notes:</p>
                        <p className="text-blue-700 leading-relaxed whitespace-pre-wrap">{noteData.parentContactNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Follow-up Information */}
              {noteData.followUpNeeded && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-900 mb-3 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Follow-up Required</span>
                  </h4>
                  <div className="space-y-2">
                    <p className="text-orange-800">
                      <span className="font-medium">Status:</span> Follow-up is needed for this note
                    </p>
                    {noteData.followUpAssignee && (
                      <p className="text-orange-800">
                        <span className="font-medium">Assigned to:</span> {noteData.followUpAssignee}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {noteData.tags && noteData.tags.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {noteData.tags.map((tag, index) => (
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
                  <span className="font-medium">Category:</span> {noteData.category}
                </div>
                <div>
                  <span className="font-medium">Program:</span> {note.programName}
                </div>
                <div>
                  <span className="font-medium">Staff Member:</span> {note.author}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Note</span>
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
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
      </div>
    </div>
  );
};

export default ViewDailyNote;