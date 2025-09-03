import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, MessageSquare, Edit, Trash2, Clock } from 'lucide-react';
import AddDailyNote from './AddDailyNote';
import ViewDailyNote from './ViewDailyNote';
import { useDailyNotes } from '../hooks/useDailyNotes';

const DailyNotes: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isViewNoteOpen, setIsViewNoteOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Use real data from Supabase
  const { 
    dailyNotes, 
    loading, 
    error, 
    deleteDailyNote, 
    refreshDailyNotes 
  } = useDailyNotes();

  const programs = [
    { id: 'all', name: 'All Programs' },
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
  ];

  // Transform database data for display
  const dailyNotesData = dailyNotes?.map(note => {
    // Parse the notes JSON to extract category and other fields
    let parsedNotes = {};
    let category = 'other';
    let noteSummary = '';
    
    try {
      parsedNotes = JSON.parse(note.notes || '{}');
      category = parsedNotes.category || 'other';
      // Create a readable summary from the note data
      noteSummary = parsedNotes.generalNotes || 
                   parsedNotes.behaviorNotes || 
                   parsedNotes.academicProgress || 
                   parsedNotes.socialInteraction || 
                   parsedNotes.activitiesParticipated || 
                   parsedNotes.achievementsSuccesses || 
                   parsedNotes.concernsChallenges || 
                   'No detailed notes available';
    } catch (e) {
      console.log('Note contains plain text, not JSON format');
      category = 'other';
      noteSummary = note.notes || 'No notes available';
    }
    
    return {
      id: note.id,
      studentName: note.student_name || 'Unknown Student',
      program: (note.program_name || '').toLowerCase().replace(/\s+/g, '-'),
      programName: note.program_name || 'Unknown Program',
      author: note.author_name || 'Unknown Author',
      timestamp: note.created_at || new Date().toISOString(),
      category: category,
      note: noteSummary, // Show readable summary in cards
      fullNote: note.notes, // Keep complete data for detailed view
      tags: note.tags || []
    };
  }) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavior': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-green-100 text-green-800';
      case 'therapy': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotes = dailyNotesData.filter(note => {
    const matchesSearch = (note.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || note.program === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const handleAddNote = () => {
    setIsAddNoteOpen(true);
  };

  const handleNoteClick = (note: any) => {
    // Create a note object with the complete data for the detailed view
    const detailedNote = {
      ...note,
      note: note.fullNote // Use the complete note data for detailed view
    };
    setSelectedNote(detailedNote);
    setIsViewNoteOpen(true);
  };

  const handleEditNote = (note: any) => {
    // Close the view modal and open the add note modal with edit data
    setIsViewNoteOpen(false);
    setEditNote(note);
    setIsEditMode(true);
    setIsAddNoteOpen(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteDailyNote(noteId);
      setIsViewNoteOpen(false);
      // Refresh the notes list
      refreshDailyNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Notes</h1>
          <p className="text-gray-600 mt-2">Record and track daily observations and student progress</p>
        </div>
        <button 
          onClick={handleAddNote}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes, students, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading notes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading notes: {error}</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No notes found for the selected criteria.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-sm hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => handleNoteClick(note)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{note.studentName}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-600">{note.programName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                          {note.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{note.note}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{note.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(note.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isAddNoteOpen && (
        <AddDailyNote
          isOpen={isAddNoteOpen}
          onClose={() => {
            setIsAddNoteOpen(false);
            setIsEditMode(false);
            setEditNote(null);
          }}
          onNoteAdded={() => {
            // Refresh daily notes data after successful addition
            if (refreshDailyNotes) {
              refreshDailyNotes();
            }
          }}
          editNote={editNote}
          isEditMode={isEditMode}
        />
      )}

      {isViewNoteOpen && selectedNote && (
        <ViewDailyNote
          note={selectedNote}
          isOpen={isViewNoteOpen}
          onClose={() => setIsViewNoteOpen(false)}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
        />
      )}
    </div>
  );
};

export default DailyNotes;