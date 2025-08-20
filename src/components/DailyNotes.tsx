import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, MessageSquare, Edit, Trash2, Clock } from 'lucide-react';
import AddDailyNote from './AddDailyNote';
import ViewDailyNote from './ViewDailyNote';

const DailyNotes: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isViewNoteOpen, setIsViewNoteOpen] = useState(false);

  const programs = [
    { id: 'all', name: 'All Programs' },
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
  ];

  const dailyNotes = [
    {
      id: 1,
      studentName: 'Emma Rodriguez',
      program: 'academy',
      programName: 'Brighter Future Academy',
      author: 'Dr. Sarah Johnson',
      timestamp: '2024-01-15T10:30:00',
      category: 'behavior',
      note: 'Emma showed excellent progress in group activities today. She participated actively in the morning circle time and helped a peer with their assignment. Recommend continuing current behavioral strategies.',
      tags: ['positive behavior', 'peer interaction', 'participation']
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      program: 'first-steps',
      programName: 'First Steps',
      author: 'Ms. Emily Smith',
      timestamp: '2024-01-15T14:15:00',
      category: 'academic',
      note: 'Michael completed his fine motor skills exercises with minimal assistance. He showed improvement in pencil grip and was able to trace letters more accurately than last week.',
      tags: ['fine motor', 'writing skills', 'improvement']
    },
    {
      id: 3,
      studentName: 'Isabella Garcia',
      program: 'individual-therapy',
      programName: 'Individual Therapy',
      author: 'Dr. Michael Wilson',
      timestamp: '2024-01-15T11:45:00',
      category: 'therapy',
      note: 'Speech therapy session focused on articulation exercises. Isabella demonstrated clear progress with /r/ sounds. Homework assigned for practice at home. Parent meeting scheduled for next week.',
      tags: ['speech therapy', 'articulation', 'homework']
    },
    {
      id: 4,
      studentName: 'Alex Thompson',
      program: 'academy',
      programName: 'Brighter Future Academy',
      author: 'Ms. Lisa Brown',
      timestamp: '2024-01-15T09:20:00',
      category: 'social',
      note: 'Alex had difficulty during transition times today. Implemented visual schedule which helped reduce anxiety. Will continue using visual supports and monitor progress.',
      tags: ['transitions', 'anxiety', 'visual supports']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavior': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-green-100 text-green-800';
      case 'therapy': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotes = dailyNotes.filter(note => {
    const matchesSearch = note.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || note.program === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const handleAddNote = () => {
    setIsAddNoteOpen(true);
  };

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setIsViewNoteOpen(true);
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
          {filteredNotes.map((note) => (
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
                      // Handle edit functionality
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete functionality
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
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
          ))}
        </div>
      </div>

      {isAddNoteOpen && (
        <AddDailyNote
          isOpen={isAddNoteOpen}
          onClose={() => setIsAddNoteOpen(false)}
        />
      )}

      {isViewNoteOpen && selectedNote && (
        <ViewDailyNote
          note={selectedNote}
          isOpen={isViewNoteOpen}
          onClose={() => setIsViewNoteOpen(false)}
        />
      )}
    </div>
  );
};

export default DailyNotes;