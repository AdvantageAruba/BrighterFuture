import React from 'react';
import { X, Users, User, Mail, Phone, Calendar } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  status: string;
  class_id?: number;
  program_id?: number;
}

interface ClassStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    id: number;
    name: string;
    program_id: number;
    teacher_id?: number;
    max_capacity: number;
    current_enrollment: number;
    status: string;
    description?: string;
  };
  students: Student[];
  teacherName?: string;
  onStudentClick?: (student: Student) => void;
}

const ClassStudentsModal: React.FC<ClassStudentsModalProps> = ({
  isOpen,
  onClose,
  classData,
  students,
  teacherName,
  onStudentClick
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{classData.name}</h2>
              <p className="text-gray-600">
                {students.length} of {classData.max_capacity} students
                {teacherName && ` • Teacher: ${teacherName}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Enrolled</h3>
              <p className="text-gray-600">This class doesn't have any students yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Class Statistics */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                    <div className="text-sm text-gray-600">Current Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((students.length / classData.max_capacity) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Capacity Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {classData.max_capacity - students.length}
                    </div>
                    <div className="text-sm text-gray-600">Available Spots</div>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Students in Class</h3>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                      onStudentClick 
                        ? 'hover:shadow-md hover:border-blue-300 cursor-pointer' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => onStudentClick?.(student)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{student.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                              {student.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            {student.date_of_birth && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{calculateAge(student.date_of_birth)} years old</span>
                              </div>
                            )}
                            {student.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{student.email}</span>
                              </div>
                            )}
                            {student.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassStudentsModal;
