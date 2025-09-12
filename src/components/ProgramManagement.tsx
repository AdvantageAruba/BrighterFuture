import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, GraduationCap, Trash2 } from 'lucide-react';
import AddProgram from './AddProgram';
import EditProgram from './EditProgram';
import ProgramDetails from './ProgramDetails';
import AddClass from './AddClass';
import EditClass from './EditClass';
import ClassStudentsModal from './ClassStudentsModal';
import StudentModal from './StudentModal';
import { Class, Program, Teacher } from '../hooks/useClasses';
import { supabase } from '../lib/supabase';

interface ProgramManagementProps {
  classesData: {
    classes: Class[];
    programs: Program[];
    teachers: Teacher[];
    students: any[];
    loading: boolean;
    error: string | null;
    getClassesByProgram: (programId: number) => Class[];
    getClassCountByProgram: (programId: number) => number;
    getTeacherName: (teacherId: number | null) => string;
    getStudentCountByProgram: (programId: number) => number;
    getTotalStudentCount: () => number;
    addClass: (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: Class; error?: string }>;
    updateClass: (id: number, updates: Partial<Class>) => Promise<{ success: boolean; data?: Class; error?: string }>;
    deleteClass: (id: number) => Promise<{ success: boolean; error?: string }>;
    refreshClasses: () => void;
    refreshPrograms: () => Promise<void>;
    refreshTeachers: () => void;
    refreshStudents: () => Promise<void>;
  };
  setActiveTab?: (tab: string) => void;
}

const ProgramManagement: React.FC<ProgramManagementProps> = ({ classesData, setActiveTab }) => {
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
  const [isClassStudentsOpen, setIsClassStudentsOpen] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<any>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDeleteProgramOpen, setIsDeleteProgramOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  // Destructure the data and functions from props
  const { 
    classes, 
    programs,
    teachers,
    students,
    getClassesByProgram, 
    getClassCountByProgram, 
    getStudentCountByProgram,
    getTotalStudentCount,
    addClass, 
    updateClass, 
    deleteClass,
    refreshClasses,
    refreshTeachers
  } = classesData;

    // Use programs from database instead of static data
  const [programsToDisplay, setProgramsToDisplay] = useState<Program[]>([]);

  // Update programs display when programs data changes
  useEffect(() => {
    if (programs && programs.length > 0) {
      setProgramsToDisplay(programs);
    }
  }, [programs]);

  // Disable automatic refresh to prevent ERR_INSUFFICIENT_RESOURCES
  // useEffect(() => {
  //   // Use a small delay to prevent immediate API calls on mount
  //   const timeoutId = setTimeout(() => {
  //     refreshClasses();
  //     refreshTeachers();
  //   }, 100);
  //   
  //   return () => clearTimeout(timeoutId);
  // }, []);

  // Remove the problematic useEffect that runs on every render
  // useEffect(() => {
  //   refreshClasses();
  //   refreshTeachers();
  // });

  // Local helper functions
  const getClassesByProgramLocal = (programId: number) => {
    return getClassesByProgram(programId);
  };

  const getClassCountByProgramLocal = (programId: number) => {
    return getClassCountByProgram(programId);
  };


  // Event handlers
  const handleAddClassClick = (programId: number) => {
    setSelectedProgramForClass(programId);
    setIsAddClassOpen(true);
    // Disable automatic refresh to prevent ERR_INSUFFICIENT_RESOURCES
    // classesData.refreshTeachers();
  };

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData);
    setIsEditClassOpen(true);
    // Disable automatic refresh to prevent ERR_INSUFFICIENT_RESOURCES
    // classesData.refreshTeachers();
  };

  const handleCloseClassModal = () => {
    setIsAddClassOpen(false);
    setIsEditClassOpen(false);
    setEditingClass(null);
    setSelectedProgramForClass(null);
  };

  const handleViewProgram = (program: any) => {
    setSelectedProgram(program);
    setIsProgramDetailsOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setIsEditProgramOpen(true);
  };

  const handleDeleteProgram = (program: Program) => {
    setProgramToDelete(program);
    setIsDeleteProgramOpen(true);
  };

  const confirmDeleteProgram = async () => {
    if (!programToDelete) return;
    
    try {
      // Delete the program from the database
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programToDelete.id);

      if (error) {
        throw error;
      }

      // Close modal and refresh data
      setIsDeleteProgramOpen(false);
      setProgramToDelete(null);
      classesData.refreshPrograms();
      classesData.refreshClasses();
    } catch (err) {
      console.error('Error deleting program:', err);
      alert('Failed to delete program. Please try again.');
    }
  };

  // Quick action handlers for ProgramDetails
  const handleQuickEditProgram = (program: any) => {
    setIsProgramDetailsOpen(false); // Close the details modal
    setEditingProgram(program);
    setIsEditProgramOpen(true);
  };

  const handleQuickViewStudents = (program: any) => {
    setIsProgramDetailsOpen(false); // Close the details modal
    // Navigate to Students page
    if (setActiveTab) {
      setActiveTab('students');
    } else {
      alert(`Viewing students for program: ${program.name}\n\nThis would navigate to the Students page filtered by this program.`);
    }
  };

  const handleQuickViewReports = (program: any) => {
    setIsProgramDetailsOpen(false); // Close the details modal
    // Navigate to Reports page (if available) or show alert
    if (setActiveTab) {
      // For now, navigate to dashboard since we don't have a dedicated reports page
      setActiveTab('dashboard');
    } else {
      alert(`Viewing reports for program: ${program.name}\n\nThis would navigate to the Reports page filtered by this program.`);
    }
  };

  const handleQuickManageWaitingList = (program: any) => {
    setIsProgramDetailsOpen(false); // Close the details modal
    // Navigate to Waiting List page
    if (setActiveTab) {
      setActiveTab('waitinglist');
    } else {
      alert(`Managing waiting list for program: ${program.name}\n\nThis would navigate to the Waiting List page filtered by this program.`);
    }
  };

  // Handler for opening class students modal
  const handleViewClassStudents = (classData: any) => {
    setSelectedClassForStudents(classData);
    setIsClassStudentsOpen(true);
  };

  // Helper function to get program name by ID
  const getProgramName = (programId: number) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'Unknown Program';
  };

  // Handler for when a student is clicked in the class students modal
  const handleStudentClick = (student: any) => {
    setIsClassStudentsOpen(false); // Close the class students modal
    
    // Prepare student data for the modal - pass raw Supabase data with program name added
    const studentData = {
      ...student, // Keep all original Supabase field names
      programName: student.program_id ? getProgramName(student.program_id) : 'Not assigned'
    };
    
    setSelectedStudent(studentData);
    setIsStudentModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'seasonal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'planning': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <button 
              onClick={() => setIsAddProgramOpen(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
              <Plus className="w-5 h-5" />
          <span>Add Program</span>
        </button>
      </div>

      {/* Loading State */}
      {classesData.loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Loading data...</h3>
              <p className="text-sm text-blue-700 mt-1">Please wait while we fetch the latest information.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {classesData.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="text-sm text-red-700 mt-1">{classesData.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white rounded-lg shadow p-6">
           <div className="flex items-center">
             <div className="p-2 bg-blue-100 rounded-lg">
               <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
             <div className="ml-4">
               <p className="text-sm font-medium text-gray-600">Total Programs</p>
               <p className="text-2xl font-bold text-gray-900">{programsToDisplay.length}</p>
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
                 {programsToDisplay.filter((p: Program) => p.status === 'active').length}
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
                 {getTotalStudentCount()}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {programsToDisplay.map((program: Program) => (
                                           <div key={program.id} className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Colored side accent */}
                        <div className={`h-2 ${getStatusColor(program.status).split(' ')[0]}`}></div>
                        
                        {/* Program Header */}
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.name}</h3>
                              <p className="text-gray-600 text-sm mb-3">{program.description}</p>
              <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                      {program.status}
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
                              <button
                                onClick={() => handleDeleteProgram(program)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                                title="Delete Program"
                              >
                                <Trash2 className="w-5 h-5" />
                </button>
                            </div>
              </div>
            </div>

                                               {/* Program Stats */}
                        <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                              <p className="text-sm font-medium text-gray-600">Classes</p>
                              <p className="text-lg font-semibold text-blue-600">
                                {getClassCountByProgramLocal(program.id)}
                              </p>
              </div>
              <div>
                              <p className="text-sm font-medium text-gray-600">Total Students</p>
                              <p className="text-lg font-semibold text-green-600">
                                {getStudentCountByProgram(program.id)}
                              </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-lg font-semibold text-purple-600">
                  {getClassesByProgramLocal(program.id).filter(cls => cls.teacher_id).length}
                </p>
              </div>
            </div>

                          {/* Program Info */}
                          <div className="mb-4">
                            <div className="text-sm text-gray-600">
                              <p><strong>Created:</strong> {new Date(program.created_at).toLocaleDateString()}</p>
                              <p><strong>Last Updated:</strong> {new Date(program.updated_at).toLocaleDateString()}</p>
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
                  <div className="space-y-3">
                    {getClassesByProgramLocal(program.id).map((cls) => {
                      const teacher = teachers.find(t => t.id === cls.teacher_id);
                      
                      
                      // Calculate current enrollment from student data
                      const currentEnrollment = students.filter(s => s.class_id === cls.id).length;
                      const enrollmentPercentage = cls.max_capacity > 0 ? (currentEnrollment / cls.max_capacity) * 100 : 0;
                      
                      return (
                        <div 
                          key={cls.id} 
                          className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200"
                          onClick={() => handleViewClassStudents(cls)}
                        >
                          <div className="flex items-start justify-between">
                        <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h5 className="font-semibold text-gray-900">{cls.name}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  cls.status === 'active' ? 'bg-green-100 text-green-800' :
                                  cls.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                  cls.status === 'full' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {cls.status}
                                </span>
                              </div>
                              
                              {/* Class Details */}
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {currentEnrollment} / {cls.max_capacity} students
                                  </p>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        enrollmentPercentage >= 90 ? 'bg-red-500' :
                                        enrollmentPercentage >= 75 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                      }`}
                                      style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Teacher</p>
                                  {teacher ? (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium text-blue-600">
                                          {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {teacher.first_name} {teacher.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">{teacher.email}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-500">?</span>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500 italic">No teacher assigned</p>
                                        <p className="text-xs text-gray-400">Click to assign</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {cls.description && (
                                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{cls.description}</p>
                              )}
                        </div>
                            
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClass(cls);
                          }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit Class"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                        </div>
                      );
                    })}
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
           onClose={() => {
             setIsAddProgramOpen(false);
             // Refresh programs to show newly added ones
             setTimeout(() => {
               classesData.refreshPrograms();
               classesData.refreshClasses();
             }, 100);
           }}
        />
      )}

      {isEditProgramOpen && editingProgram && (
        <EditProgram
          isOpen={isEditProgramOpen}
          onClose={() => setIsEditProgramOpen(false)}
          program={editingProgram}
          onProgramUpdated={() => {
            classesData.refreshPrograms();
            classesData.refreshClasses();
          }}
        />
      )}

      {isProgramDetailsOpen && selectedProgram && (
        <ProgramDetails
          isOpen={isProgramDetailsOpen}
          onClose={() => setIsProgramDetailsOpen(false)}
          program={selectedProgram}
          classesData={classesData}
          onEditProgram={handleQuickEditProgram}
          onViewStudents={handleQuickViewStudents}
          onViewReports={handleQuickViewReports}
          onManageWaitingList={handleQuickManageWaitingList}
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
           onClassUpdated={() => {
             // Refresh classes and teachers data to show updated teacher assignments
             refreshClasses();
             refreshTeachers();
           }}
         />
       )}

       {/* Delete Program Confirmation Modal */}
       {isDeleteProgramOpen && programToDelete && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
             <div className="p-6">
               <div className="flex items-center space-x-3 mb-4">
                 <div className="p-2 bg-red-100 rounded-lg">
                   <Trash2 className="w-6 h-6 text-red-600" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900">Delete Program</h3>
                   <p className="text-gray-600">This action cannot be undone.</p>
                 </div>
               </div>
               
               <div className="mb-6">
                 <p className="text-gray-700">
                   Are you sure you want to delete <strong>"{programToDelete.name}"</strong>?
                 </p>
                 <p className="text-sm text-red-600 mt-2">
                   ⚠️ This will also delete all associated classes and may affect student records.
                 </p>
               </div>

               <div className="flex items-center justify-end space-x-3">
                 <button
                   onClick={() => {
                     setIsDeleteProgramOpen(false);
                     setProgramToDelete(null);
                   }}
                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={confirmDeleteProgram}
                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                 >
                   <Trash2 className="w-4 h-4" />
                   <span>Delete Program</span>
                 </button>
               </div>
             </div>
           </div>
         </div>
      )}

      {/* Class Students Modal */}
      {isClassStudentsOpen && selectedClassForStudents && (
        <ClassStudentsModal
          isOpen={isClassStudentsOpen}
          onClose={() => {
            setIsClassStudentsOpen(false);
            setSelectedClassForStudents(null);
          }}
          classData={selectedClassForStudents}
          students={students.filter(s => s.class_id === selectedClassForStudents.id)}
          teacherName={teachers.find(t => t.id === selectedClassForStudents.teacher_id)?.first_name + ' ' + teachers.find(t => t.id === selectedClassForStudents.teacher_id)?.last_name}
          onStudentClick={handleStudentClick}
        />
      )}

      {/* Student Modal */}
      {isStudentModalOpen && selectedStudent && (
        <StudentModal
          student={selectedStudent}
          isOpen={isStudentModalOpen}
          onClose={() => {
            setIsStudentModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default React.memo(ProgramManagement);