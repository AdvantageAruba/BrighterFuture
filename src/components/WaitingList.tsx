import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import IntakeForm from './IntakeForm';
import AddToWaitingList from './AddToWaitingList';

const WaitingList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isIntakeFormOpen, setIsIntakeFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const programs = [
    { id: 'all', name: 'All Programs' },
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
  ];

  const waitingListData = [
    {
      id: 1,
      name: 'Sarah Williams',
      age: 7,
      program: 'academy',
      programName: 'Brighter Future Academy',
      dateAdded: '2024-01-10',
      priority: 'high',
      parentName: 'Jennifer Williams',
      phone: '(555) 123-4567',
      email: 'jennifer.williams@email.com',
      notes: 'Requires immediate attention for speech therapy'
    },
    {
      id: 2,
      name: 'David Martinez',
      age: 5,
      program: 'first-steps',
      programName: 'First Steps',
      dateAdded: '2024-01-08',
      priority: 'medium',
      parentName: 'Maria Martinez',
      phone: '(555) 234-5678',
      email: 'maria.martinez@email.com',
      notes: 'Early intervention needed'
    },
    {
      id: 3,
      name: 'Lily Johnson',
      age: 9,
      program: 'individual-therapy',
      programName: 'Individual Therapy',
      dateAdded: '2024-01-05',
      priority: 'low',
      parentName: 'Robert Johnson',
      phone: '(555) 345-6789',
      email: 'robert.johnson@email.com',
      notes: 'Flexible scheduling available'
    }
  ];

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
    setSelectedStudent(student);
    setIsIntakeFormOpen(true);
  };

  const handleAddToWaitingList = () => {
    setIsAddFormOpen(true);
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
          {filteredWaitingList.map((student) => (
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
                <button className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200">
                  <ArrowRight className="w-4 h-4" />
                  <span>Enroll Student</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isIntakeFormOpen && selectedStudent && (
        <IntakeForm
          student={selectedStudent}
          isOpen={isIntakeFormOpen}
          onClose={() => setIsIntakeFormOpen(false)}
          isEditing={true}
        />
      )}

      {isAddFormOpen && (
        <AddToWaitingList
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
        />
      )}
    </div>
  );
};

export default WaitingList;