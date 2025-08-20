import React from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User, Edit, Trash2, MessageSquare } from 'lucide-react';

interface AttendanceDetailsProps {
  student: any;
  attendanceRecord: any;
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceDetails: React.FC<AttendanceDetailsProps> = ({ student, attendanceRecord, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'absent': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'late': return <Clock className="w-6 h-6 text-orange-600" />;
      default: return <AlertTriangle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateTotalTime = () => {
    if (!attendanceRecord.checkIn || !attendanceRecord.checkOut) return null;
    
    const checkIn = new Date(`2000-01-01 ${attendanceRecord.checkIn}`);
    const checkOut = new Date(`2000-01-01 ${attendanceRecord.checkOut}`);
    const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    return diff.toFixed(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-gray-600">{formatDate(attendanceRecord.date)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Attendance Status */}
            <div className={`border-2 rounded-lg p-6 ${getStatusColor(attendanceRecord.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(attendanceRecord.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{attendanceRecord.status}</h3>
                    <p className="text-sm text-gray-600">{formatDate(attendanceRecord.date)}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(attendanceRecord.status)}`}>
                  {attendanceRecord.status.charAt(0).toUpperCase() + attendanceRecord.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Student Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Student Information</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-medium text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium text-gray-900">{student.age} years old</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-medium text-gray-900">{student.programName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-medium text-gray-900">Grade 2A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Details */}
            {attendanceRecord.status !== 'absent' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Time Details</span>
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in Time</p>
                      <p className="font-medium text-gray-900">{attendanceRecord.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out Time</p>
                      <p className="font-medium text-gray-900">{attendanceRecord.checkOut || 'Not checked out'}</p>
                    </div>
                    {calculateTotalTime() && (
                      <div>
                        <p className="text-sm text-gray-600">Total Time</p>
                        <p className="font-medium text-gray-900">{calculateTotalTime()} hours</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Notes</span>
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {attendanceRecord.notes ? (
                  <p className="text-gray-700">{attendanceRecord.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">No additional notes for this attendance record.</p>
                )}
              </div>
            </div>

            {/* Attendance History Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">4</div>
                  <div className="text-sm text-green-700">Present Days</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-orange-700">Late Days</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">0</div>
                  <div className="text-sm text-red-700">Absent Days</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                  <span>Edit Attendance</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <MessageSquare className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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

export default AttendanceDetails;