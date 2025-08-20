import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Calendar, BookOpen, Settings, Eye, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import AddProgram from './AddProgram';
import EditProgram from './EditProgram';
import ProgramDetails from './ProgramDetails';

const ProgramManagement: React.FC = () => {
  const [programs] = useState([
    {
      id: 1,
      name: 'Brighter Future Academy',
      description: 'Comprehensive educational program for students with special needs focusing on individualized learning plans and skill development.',
      students: 168,
      capacity: 200,
      coordinator: 'Dr. Sarah Johnson',
      coordinatorEmail: 'sarah.johnson@brighterfuture.edu',
      coordinatorPhone: '(555) 123-4567',
      status: 'active',
      startDate: '2020-09-01',
      ageRange: '5-18',
      type: 'Full-time Education',
      location: 'Main Campus - Building A',
      schedule: 'Monday-Friday, 8:00 AM - 3:00 PM',
      staffCount: 25,
      waitingList: 15,
      graduationRate: 92,
      satisfactionScore: 4.8
    },
    {
      id: 2,
      name: 'First Steps',
      description: 'Early intervention program for young children with developmental delays, providing foundational skills and family support.',
      students: 60,
      capacity: 80,
      coordinator: 'Ms. Emily Smith',
      coordinatorEmail: 'emily.smith@brighterfuture.edu',
      coordinatorPhone: '(555) 234-5678',
      status: 'active',
      startDate: '2019-01-15',
      ageRange: '2-6',
      type: 'Early Intervention',
      location: 'Main Campus - Building B',
      schedule: 'Monday-Friday, 9:00 AM - 12:00 PM',
      staffCount: 12,
      waitingList: 8,
      graduationRate: 88,
      satisfactionScore: 4.9
    },
    {
      id: 3,
      name: 'Individual Therapy',
      description: 'One-on-one specialized therapy sessions including speech, occupational, and behavioral therapy tailored to individual needs.',
      students: 40,
      capacity: 50,
      coordinator: 'Dr. Michael Wilson',
      coordinatorEmail: 'michael.wilson@brighterfuture.edu',
      coordinatorPhone: '(555) 345-6789',
      status: 'active',
      startDate: '2018-03-01',
      ageRange: '3-18',
      type: 'Therapy Services',
      location: 'Therapy Center',
      schedule: 'Monday-Friday, 8:00 AM - 6:00 PM',
      staffCount: 8,
      waitingList: 12,
      graduationRate: 95,
      satisfactionScore: 4.7
    },
    {
      id: 4,
      name: 'Consultancy Services',
      description: 'Expert consultation services for families, educators, and other professionals seeking guidance on special education strategies.',
      students: 20,
      capacity: 30,
      coordinator: 'Dr. Lisa Brown',
      coordinatorEmail: 'lisa.brown@brighterfuture.edu',
      coordinatorPhone: '(555) 456-7890',
      status: 'active',
      startDate: '2021-06-01',
      ageRange: 'All Ages',
      type: 'Consultation',
      location: 'Multiple Locations',
      schedule: 'By Appointment',
      staffCount: 5,
      waitingList: 3,
      graduationRate: 100,
      satisfactionScore: 4.6
    },
    {
      id: 5,
      name: 'Summer Intensive Program',
      description: 'Intensive summer program designed to prevent skill regression and provide accelerated learning opportunities.',
      students: 45,
      capacity: 60,
      coordinator: 'Ms. Jennifer Davis',
      coordinatorEmail: 'jennifer.davis@brighterfuture.edu',
      coordinatorPhone: '(555) 567-8901',
      status: 'seasonal',
      startDate: '2022-06-01',
      ageRange: '6-16',
      type: 'Seasonal Program',
      location: 'Main Campus - All Buildings',
      schedule: 'June-August, 9:00 AM - 2:00 PM',
      staffCount: 15,
      waitingList: 5,
      graduationRate: 90,
      satisfactionScore: 4.5
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [isProgramDetailsOpen, setIsProgramDetailsOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressBarColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgramTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time Education': return 'bg-blue-100 text-blue-800';
      case 'Early Intervention': return 'bg-green-100 text-green-800';
      case 'Therapy Services': return 'bg-purple-100 text-purple-800';
      case 'Consultation': return 'bg-orange-100 text-orange-800';
      case 'Seasonal Program': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewProgram = (program: any) => {
    setSelectedProgram(program);
    setIsProgramDetailsOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setIsEditProgramOpen(true);
  };

  const handleAddProgram = () => {
    setIsAddProgramOpen(true);
  };

  const totalStudents = programs.reduce((sum, program) => sum + program.students, 0);
  const totalCapacity = programs.reduce((sum, program) => sum + program.capacity, 0);
  const activePrograms = programs.filter(p => p.status === 'active').length;
  const totalWaitingList = programs.reduce((sum, program) => sum + program.waitingList, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
          <p className="text-gray-600 mt-2">Manage educational programs, enrollment, and program performance</p>
        </div>
        <button 
          onClick={handleAddProgram}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      {/* Program Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
              <p className="text-sm text-green-600 mt-1">{activePrograms} active</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Enrollment</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-sm text-gray-600 mt-1">of {totalCapacity} capacity</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Waiting List</p>
              <p className="text-2xl font-bold text-gray-900">{totalWaitingList}</p>
              <p className="text-sm text-orange-600 mt-1">across all programs</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">4.7</p>
              <p className="text-sm text-green-600 mt-1">out of 5.0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{program.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramTypeColor(program.type)}`}>
                      {program.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleViewProgram(program)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditProgram(program)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Coordinator</p>
                <p className="text-sm font-medium text-gray-900">{program.coordinator}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Age Range</p>
                <p className="text-sm font-medium text-gray-900">{program.ageRange}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Staff Count</p>
                <p className="text-sm font-medium text-gray-900">{program.staffCount} members</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Waiting List</p>
                <p className="text-sm font-medium text-gray-900">{program.waitingList} students</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Enrollment</span>
                <span className={`text-sm font-medium ${getCapacityColor(program.students, program.capacity)}`}>
                  {program.students} / {program.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(program.students, program.capacity)}`}
                  style={{ width: `${(program.students / program.capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>{program.graduationRate}% success</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{program.satisfactionScore}/5.0</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Since {new Date(program.startDate).getFullYear()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {isAddProgramOpen && (
        <AddProgram
          isOpen={isAddProgramOpen}
          onClose={() => setIsAddProgramOpen(false)}
        />
      )}

      {isEditProgramOpen && editingProgram && (
        <EditProgram
          program={editingProgram}
          isOpen={isEditProgramOpen}
          onClose={() => setIsEditProgramOpen(false)}
        />
      )}

      {isProgramDetailsOpen && selectedProgram && (
        <ProgramDetails
          program={selectedProgram}
          isOpen={isProgramDetailsOpen}
          onClose={() => setIsProgramDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProgramManagement;