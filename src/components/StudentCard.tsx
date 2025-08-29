import React from 'react';
import { Eye, Edit, MoreVertical, FileText, MessageSquare, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

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
  onDelete?: (studentId: number) => void;
  onStatusToggle?: (studentId: number, newStatus: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onView, onEdit, onDelete, onStatusToggle }) => {
  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getProgramColor = (program: string) => {
    switch (program) {
      case '1': return 'bg-blue-100 text-blue-800';      // Brighter Future Academy
      case '2': return 'bg-green-100 text-green-800';    // First Steps
      case '3': return 'bg-purple-100 text-purple-800';  // Individual Therapy
      case '4': return 'bg-orange-100 text-orange-800';  // Consultancy
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgramBorderColor = (program: string) => {
    switch (program) {
      case '1': return 'border-l-blue-500';      // Brighter Future Academy
      case '2': return 'border-l-green-500';    // First Steps
      case '3': return 'border-l-purple-500';   // Individual Therapy
      case '4': return 'border-l-orange-500';   // Consultancy
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
          <span className="text-sm text-gray-600">Last Session:</span>
          <span className="text-sm text-gray-900">{student.lastSession}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
            {student.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Assessments: {student.assessments}</span>
        <span>Notes: {student.notes}</span>
      </div>

      <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={(e) => { e.stopPropagation(); onView(); }}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(student.id); }}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
