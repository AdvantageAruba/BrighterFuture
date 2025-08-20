import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit, MoreVertical } from 'lucide-react';
import StudentCard from './StudentCard';
import StudentModal from './StudentModal';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Emma Rodriguez',
      age: 8,
      program: 'academy',
      programName: 'Brighter Future Academy',
      lastSession: '2024-01-15',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/4473864/pexels-photo-4473864.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 3,
      notes: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 6,
      program: 'first-steps',
      programName: 'First Steps',
      lastSession: '2024-01-14',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/5063389/pexels-photo-5063389.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 2,
      notes: 8
    },
    {
      id: 3,
      name: 'Isabella Garcia',
      age: 10,
      program: 'individual-therapy',
      programName: 'Individual Therapy',
      lastSession: '2024-01-12',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 5,
      notes: 18
    },
    {
      id: 4,
      name: 'Alex Thompson',
      age: 7,
      program: 'academy',
      programName: 'Brighter Future Academy',
      lastSession: '2024-01-13',
      status: 'inactive',
      avatar: 'https://images.pexels.com/photos/5063380/pexels-photo-5063380.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 4,
      notes: 15
    }
  ]);

  const programs = [
    { id: 'all', name: 'All Programs' },
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
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

  const handleStatusToggle = (studentId: number, newStatus: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus }
          : student
      )
    );
  };

  if (currentView === 'add') {
    return <AddStudent onBack={handleBackToList} />;
  }

  if (currentView === 'edit' && editingStudent) {
    return <EditStudent student={editingStudent} onBack={handleBackToList} />;
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