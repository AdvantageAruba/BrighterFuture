import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit, MoreVertical, Users, GraduationCap, Baby, MessageSquare, Heart } from 'lucide-react';
import StudentCard from './StudentCard';
import StudentModal from './StudentModal';
import AddStudent from './AddStudent';
import { useStudents } from '../hooks/useStudents';
import EditStudent from './EditStudent';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [editingStudent, setEditingStudent] = useState(null);
  // Use real data from Supabase
  const { 
    students: supabaseStudents, 
    programs: supabasePrograms, 
    loading, 
    error, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    getStudentsByProgram,
    getProgramName 
  } = useStudents();

  // Transform students data for the UI
  const students = supabaseStudents.map(student => ({
    id: student.id,
    name: student.name,
    age: student.date_of_birth ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear() : 0,
    program: student.program_id.toString(),
    programName: getProgramName(student.program_id),
    lastSession: student.updated_at ? new Date(student.updated_at).toISOString().split('T')[0] : 'Unknown',
    status: student.status,
    avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000)}?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    assessments: 0, // Will be updated when forms are implemented
    notes: 0 // Will be updated when daily notes are implemented
  }));

  // Transform programs data for the UI
  const programs = [
    { id: 'all', name: 'All Programs' },
    ...supabasePrograms.map(p => ({ id: p.id.toString(), name: p.name }))
  ];

  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setCurrentView('edit');
  };

  const handleAddStudent = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingStudent(null);
  };

  const handleStatusToggle = async (studentId: number, newStatus: string) => {
    const result = await updateStudent(studentId, { status: newStatus });
    if (result.success) {
      // The hook will automatically update the local state
      console.log('Student status updated successfully');
    } else {
      console.error('Failed to update student status:', result.error);
    }
  };

  if (currentView === 'add') {
    return <AddStudent onBack={handleBackToList} />;
  }

  if (currentView === 'edit' && editingStudent) {
    return <EditStudent student={editingStudent} onBack={handleBackToList} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">Loading student data...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading students...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">Error loading student data</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-medium mb-2">Error Loading Students</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">Manage student profiles and track their progress</p>
        </div>
        <button 
          onClick={handleAddStudent}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
        </div>

        {/* Program Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Program Overview</h3>
            <button
              onClick={() => setSelectedProgram('all')}
              className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                selectedProgram === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              View All Programs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {programs.filter(program => program.id !== 'all').map((program) => {
              const programStudents = students.filter(s => s.program === program.id);
              const activeStudents = programStudents.filter(s => s.status === 'active');
              
              // Get appropriate icon for each program
              const getProgramIcon = (programId: string) => {
                switch (programId) {
                  case 'academy':
                    return <GraduationCap className="w-8 h-8 text-blue-600" />;
                  case 'first-steps':
                    return <Baby className="w-8 h-8 text-green-600" />;
                  case 'individual-therapy':
                    return <Heart className="w-8 h-8 text-purple-600" />;
                  case 'consultancy':
                    return <MessageSquare className="w-8 h-8 text-orange-600" />;
                  default:
                    return <Users className="w-8 h-8 text-gray-600" />;
                }
              };
              
              return (
                <div 
                  key={program.id}
                  className={`bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    selectedProgram === program.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProgram(program.id)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      {getProgramIcon(program.id)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {programStudents.length}
                    </div>
                    <div className="text-sm text-gray-600 mb-2 font-medium">{program.name}</div>
                    <div className="text-xs text-green-600 font-medium mb-2">
                      {activeStudents.length} active
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {selectedProgram === program.id ? 'Selected' : 'Click to filter'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-green-700">Active Students</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {students.filter(s => s.status === 'inactive').length}
            </div>
            <div className="text-sm text-red-700">Inactive Students</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-blue-700">Total Students</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={() => handleViewStudent(student)}
              onEdit={() => handleEditStudent(student)}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      </div>

      {isModalOpen && selectedStudent && (
        <StudentModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Students;