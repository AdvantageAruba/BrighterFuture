import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, GraduationCap, Trash2, RefreshCw } from 'lucide-react';
import AddProgram from './AddProgram';
import EditProgram from './EditProgram';
import ProgramDetails from './ProgramDetails';
import AddClass from './AddClass';
import EditClass from './EditClass';
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
    refreshTeachers: () => Promise<void>;
    refreshStudents: () => Promise<void>;
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
    getTeacherName, 
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

  // Refresh classes data when component mounts to ensure latest assignments are shown
  useEffect(() => {
    refreshClasses();
    refreshTeachers();
  }, []);

  // Also refresh data whenever the component is rendered (becomes visible)
  useEffect(() => {
    refreshClasses();
    refreshTeachers();
  });

  // Local helper functions
  const getClassesByProgramLocal = (programId: number) => {
    return getClassesByProgram(programId);
  };

  const getClassCountByProgramLocal = (programId: number) => {
    return getClassCountByProgram(programId);
  };

  const getTeacherNameLocal = (teacherId: number | null | undefined) => {
    return getTeacherName(teacherId || null);
  };

  // Event handlers
  const handleAddClassClick = (programId: number) => {
    setSelectedProgramForClass(programId);
    setIsAddClassOpen(true);
    // Refresh teachers to ensure newly added teachers appear in dropdown
    classesData.refreshTeachers();
  };

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData);
    setIsEditClassOpen(true);
    // Refresh teachers to ensure newly added teachers appear in dropdown
    classesData.refreshTeachers();
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
                                   <div className="flex items-center space-x-4">
        <button 
              onClick={() => {
                refreshClasses();
                refreshTeachers();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
              <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
        <button 
              onClick={() => setIsAddProgramOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
              <Plus className="w-5 h-5" />
          <span>Add Program</span>
        </button>
          </div>
      </div>

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
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div className="space-y-2">
                    {getClassesByProgramLocal(program.id).map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{cls.name}</p>
                          <p className="text-sm text-gray-600">
                            {cls.max_capacity} students • {cls.status} • {getTeacherNameLocal(cls.teacher_id)}
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
    </div>
  );
};

export default React.memo(ProgramManagement);