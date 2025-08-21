import React from 'react';
import { Eye, Edit, MoreVertical, FileText, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';

interface StudentCardProps {
  student: {
    id: number;
    name: string;
    age: number;
    program: string;
    programName: string;
    lastSession: string;
    status: string;
    avatar: string;
    assessments: number;
    notes: number;
  };
  onView: () => void;
  onEdit: () => void;
  onStatusToggle?: (studentId: number, newStatus: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onView, onEdit, onStatusToggle }) => {
  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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

  const getProgramBorderColor = (program: string) => {
    switch (program) {
      case 'academy': return 'border-l-blue-500';
      case 'first-steps': return 'border-l-green-500';
      case 'individual-therapy': return 'border-l-purple-500';
      case 'consultancy': return 'border-l-orange-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusToggle) {
      const newStatus = student.status === 'active' ? 'inactive' : 'active';
      onStatusToggle(student.id, newStatus);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 group border-l-4 ${getProgramBorderColor(student.program)} cursor-pointer ${student.status === 'inactive' ? 'opacity-75' : ''}`} onClick={onView}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">Age: {student.age}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleStatusToggle}
            className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 ${
              student.status === 'active' 
                ? 'hover:bg-green-100 text-green-600' 
                : 'hover:bg-red-100 text-red-600'
            }`}
            title={`Mark as ${student.status === 'active' ? 'inactive' : 'active'}`}
          >
            {student.status === 'active' ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all duration-200">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Program:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramColor(student.program)}`}>
            {student.programName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(student.status)}`}>
            {student.status}
          </span>
            {student.status === 'inactive' && (
              <span className="text-xs text-gray-500">(Inactive)</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Session:</span>
          <span className="text-sm text-gray-900">{new Date(student.lastSession).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span>{student.assessments} assessments</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageSquare className="w-4 h-4" />
          <span>{student.notes} notes</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onView}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            student.status === 'active' 
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        <button 
          onClick={onEdit}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            student.status === 'active' 
              ? 'bg-gray-50 text-gray-700 hover:bg-gray-100' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>

      {student.status === 'inactive' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700 text-center">
            This student is currently inactive and not receiving services
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCard;