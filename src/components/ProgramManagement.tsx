import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, GraduationCap } from 'lucide-react';
import AddProgram from './AddProgram';
import EditProgram from './EditProgram';
import ProgramDetails from './ProgramDetails';
import AddClass from './AddClass';
import EditClass from './EditClass';
import { Class, Program, Teacher } from '../hooks/useClasses';

interface ProgramManagementProps {
  classesData: {
    classes: Class[];
    programs: Program[];
    teachers: Teacher[];
    loading: boolean;
    error: string | null;
    getClassesByProgram: (programId: number) => Class[];
    getClassCountByProgram: (programId: number) => number;
    getTeacherName: (teacherId: number | null) => string;
    addClass: (classData: Omit<Class, 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: Class; error?: string }>;
    updateClass: (id: string, updates: Partial<Class>) => Promise<{ success: boolean; data?: Class; error?: string }>;
    deleteClass: (id: string) => Promise<{ success: boolean; error?: string }>;
    refreshClasses: () => void;
    refreshPrograms: () => Promise<void>;
    refreshTeachers: () => Promise<void>;
  };
}

const ProgramManagement: React.FC<ProgramManagementProps> = ({ classesData }) => {
  // Component state
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [isProgramDetailsOpen, setIsProgramDetailsOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [selectedProgramForClass, setSelectedProgramForClass] = useState<number | null>(null);

  // Destructure the data and functions from props
  const { 
    classes, 
    programs,
    teachers,
    getClassesByProgram, 
    getClassCountByProgram, 
    getTeacherName, 
    addClass, 
    updateClass, 
    deleteClass 
  } = classesData;

  // Static programs data
  const [staticPrograms] = useState([
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

  // Event handlers
  const handleAddClassClick = (programId: number) => {
    setSelectedProgramForClass(programId);
    setIsAddClassOpen(true);
  };

  const handleViewProgram = (program: any) => {
    setSelectedProgram(program);
    setIsProgramDetailsOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setIsEditProgramOpen(true);
  };

  const handleEditClass = (classData: any) => {
    setEditingClass(classData);
    setIsEditClassOpen(true);
  };

  const handleCloseClassModal = () => {
    setIsAddClassOpen(false);
    setIsEditClassOpen(false);
    setEditingClass(null);
    setSelectedProgramForClass(null);
  };

  // Utility functions
  const getClassesByProgramLocal = (programId: number) => {
    return classes.filter((cls: Class) => cls.program_id === programId);
  };

  const getClassCountByProgramLocal = (programId: number) => {
    return classes.filter((cls: Class) => cls.program_id === programId).length;
  };

  const getTeacherNameLocal = (teacherId: number | null | undefined) => {
    if (!teacherId) return 'No teacher assigned';
    const teacher = teachers.find((t: Teacher) => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher';
  };

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
      case 'Seasonal Program': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
          <p className="text-gray-600 mt-2">Manage educational programs and their classes</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddProgramOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Program</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{staticPrograms.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900">
                {staticPrograms.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {staticPrograms.reduce((sum, p) => sum + p.students, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staticPrograms.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Program Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{program.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                      {program.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramTypeColor(program.type)}`}>
                      {program.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewProgram(program)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEditProgram(program)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Edit Program"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Program Stats */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className={`text-lg font-semibold ${getCapacityColor(program.students, program.capacity)}`}>
                    {program.students}/{program.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff</p>
                  <p className="text-lg font-semibold text-gray-900">{program.staffCount}</p>
                </div>
              </div>
              
              {/* Capacity Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Capacity</span>
                  <span>{Math.round((program.students / program.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(program.students, program.capacity)}`}
                    style={{ width: `${Math.min((program.students / program.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Classes Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Classes ({getClassCountByProgramLocal(program.id)})</h4>
                  <button
                    onClick={() => handleAddClassClick(program.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Class</span>
                  </button>
                </div>
                
                {getClassesByProgramLocal(program.id).length > 0 ? (
                  <div className="space-y-2">
                    {getClassesByProgramLocal(program.id).map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{cls.name}</p>
                          <p className="text-sm text-gray-600">
                            {cls.max_students} students • {cls.status} • {getTeacherNameLocal(cls.teacher_id)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditClass(cls)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Edit Class"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No classes yet. Click "Add Class" to get started.
                  </div>
                )}
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
          isOpen={isEditProgramOpen}
          onClose={() => setIsEditProgramOpen(false)}
          program={editingProgram}
        />
      )}

      {isProgramDetailsOpen && selectedProgram && (
        <ProgramDetails
          isOpen={isProgramDetailsOpen}
          onClose={() => setIsProgramDetailsOpen(false)}
          program={selectedProgram}
        />
      )}

      {isAddClassOpen && selectedProgramForClass && (
        <AddClass
          isOpen={isAddClassOpen}
          onClose={handleCloseClassModal}
          programId={selectedProgramForClass}
          programs={programs}
          teachers={teachers}
          addClass={addClass}
        />
      )}

      {isEditClassOpen && editingClass && (
        <EditClass
          isOpen={isEditClassOpen}
          onClose={handleCloseClassModal}
          classData={editingClass}
          programs={programs}
          teachers={teachers}
          updateClass={updateClass}
          deleteClass={deleteClass}
        />
      )}
    </div>
  );
};

export default React.memo(ProgramManagement);