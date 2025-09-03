import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, User, Clock, ArrowRight, Trash2 } from 'lucide-react';
import AddToWaitingList from './AddToWaitingList';
import AddStudent from './AddStudent';
import { useWaitingList } from '../hooks/useWaitingList';

const WaitingList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);

  // Use real data from database
  const { waitingList, loading, error, refreshWaitingList, deleteWaitingListEntry } = useWaitingList();

  const programs = [
    { id: 'all', name: 'All Programs' },
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
  ];

  // Transform database data for display
  const waitingListData = waitingList.map(entry => ({
    id: entry.id,
    name: `${entry.first_name} ${entry.last_name}`,
    age: entry.age || 'N/A',
    program: entry.program,
    programName: programs.find(p => p.id === entry.program)?.name || entry.program,
    dateAdded: entry.created_at.split('T')[0], // Extract date part
    priority: entry.priority,
    parentName: entry.parent_name,
    phone: entry.parent_phone,
    email: entry.parent_email,
    notes: entry.notes || entry.reason_for_waiting || 'No notes'
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgramColor = (program: string) => {
    switch (program) {
      case 'academy': return 'bg-blue-100 text-blue-800';
      case 'first-steps': return 'bg-green-100 text-green-800';
      case 'individual-therapy': return 'bg-purple-100 text-purple-800';
      case 'consultancy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWaitingList = waitingListData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const handleStudentClick = (student: any) => {
    // Find the original database entry for this student
    const originalEntry = waitingList.find(entry => entry.id === student.id);
    setSelectedStudent(originalEntry);
    setIsAddFormOpen(true);
  };

  const handleAddToWaitingList = () => {
    setSelectedStudent(null); // Ensure no student is selected for new entry
    setIsAddFormOpen(true);
  };

  const handleEnrollStudent = (student: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Find the original database entry for this student
    const originalEntry = waitingList.find(entry => entry.id === student.id);
    setSelectedStudent(originalEntry);
    setIsEnrollFormOpen(true);
  };

  const handleDeleteStudent = async (student: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to remove ${student.name} from the waiting list?`)) {
      return;
    }
    
    try {
      const result = await deleteWaitingListEntry(student.id);
      if (result.success) {
        console.log('Waiting list entry deleted successfully');
        // The useWaitingList hook will automatically update the UI
      } else {
        alert(`Failed to delete entry: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting waiting list entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waiting List</h1>
          <p className="text-gray-600 mt-2">Manage prospective students and enrollment queue</p>
        </div>
        <button 
          onClick={handleAddToWaitingList}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Waiting List</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student or parent name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading waiting list...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading waiting list: {error}</p>
            </div>
          ) : filteredWaitingList.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students found on the waiting list.</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting the search or program filter.</p>
            </div>
          ) : (
            filteredWaitingList.map((student) => (
              <div 
                key={student.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200 cursor-pointer hover:bg-gray-50"
                onClick={() => handleStudentClick(student)}
              >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">Age: {student.age} • Parent: {student.parentName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(student.priority)}`}>
                    {student.priority} priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgramColor(student.program)}`}>
                    {student.programName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Added: {new Date(student.dateAdded).toLocaleDateString()}</span>
                </div>
              </div>

              {student.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{student.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Waiting for {Math.floor((new Date().getTime() - new Date(student.dateAdded).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    onClick={(e) => handleDeleteStudent(student, e)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  <button 
                    type="button"
                    className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
                    onClick={(e) => handleEnrollStudent(student, e)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Enroll Student</span>
                  </button>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {isAddFormOpen && (
        <AddToWaitingList
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          editingEntry={selectedStudent}
          isEditing={!!selectedStudent}
          onWaitingListAdded={() => {
            // Refresh waiting list data after successful addition
            setSelectedStudent(null); // Reset selected student after editing
            // Force refresh of waiting list data
            if (refreshWaitingList) {
              refreshWaitingList();
            }
          }}
        />
      )}

      {isEnrollFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <AddStudent
              onBack={() => {
                setIsEnrollFormOpen(false);
                setSelectedStudent(null);
              }}
              prefillData={selectedStudent}
              onStudentAdded={() => {
                // Refresh waiting list data after successful enrollment
                setIsEnrollFormOpen(false);
                setSelectedStudent(null);
                // Force refresh of waiting list data
                if (refreshWaitingList) {
                  refreshWaitingList();
                }
              }}
              onWaitingListEntryDeleted={() => {
                // Refresh waiting list data after successful enrollment and deletion
                setIsEnrollFormOpen(false);
                setSelectedStudent(null);
                // Force refresh of waiting list data
                if (refreshWaitingList) {
                  refreshWaitingList();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingList;