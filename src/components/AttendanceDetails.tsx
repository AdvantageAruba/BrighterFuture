import React, { useMemo, useState } from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';

interface AttendanceDetailsProps {
  student: any;
  attendanceRecord: any;
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceDetails: React.FC<AttendanceDetailsProps> = ({ student, attendanceRecord, isOpen, onClose }) => {
  const { attendance, updateAttendance, deleteAttendance, refreshAttendance } = useAttendance();
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the current attendance record from the refreshed data
  const currentAttendanceRecord = useMemo(() => {
    if (!student || !attendance.length) return attendanceRecord;
    
    const updatedRecord = attendance.find(record => 
      record.id === attendanceRecord.id && record.student_id === student.id
    );
    
    return updatedRecord || attendanceRecord;
  }, [attendance, student, attendanceRecord]);
  const getCurrentWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // End of week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { startOfWeek, endOfWeek };
  };

  // Get attendance statistics for the selected date range
  const attendanceStats = useMemo(() => {
    if (!student || !attendance.length) {
      return { presentDays: 0, lateDays: 0, absentDays: 0 };
    }

    let startDate: Date, endDate: Date;
    
    if (selectedStartDate && selectedEndDate) {
      // Use custom date range
      startDate = new Date(selectedStartDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(selectedEndDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Use current week
      const { startOfWeek, endOfWeek } = getCurrentWeekRange();
      startDate = startOfWeek;
      endDate = endOfWeek;
    }
    
    // Filter attendance records for this student within the selected date range
    const filteredAttendance = attendance.filter(record => {
      if (record.student_id !== student.id) return false;
      
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const presentDays = filteredAttendance.filter(r => r.status === 'present').length;
    const lateDays = filteredAttendance.filter(r => r.status === 'late').length;
    const absentDays = filteredAttendance.filter(r => r.status === 'absent').length;

    return { presentDays, lateDays, absentDays };
  }, [student, attendance, selectedStartDate, selectedEndDate]);

  // Format date range for display
  const getDateRangeDisplay = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      const { startOfWeek, endOfWeek } = getCurrentWeekRange();
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  // Handle edit attendance
  const handleEditAttendance = () => {
    setIsEditModalOpen(true);
  };

  // Handle delete record
  const handleDeleteRecord = async () => {
    if (!window.confirm('Are you sure you want to delete this attendance record? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteAttendance(currentAttendanceRecord.id);
      if (result.success) {
        alert('Attendance record deleted successfully!');
        onClose();
      } else {
        alert(`Failed to delete attendance record: ${result.error}`);
      }
    } catch (error) {
      alert('An error occurred while deleting the attendance record.');
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!attendanceRecord.check_in || !attendanceRecord.check_out) return null;
    
    const checkIn = new Date(`2000-01-01 ${attendanceRecord.check_in}`);
    const checkOut = new Date(`2000-01-01 ${attendanceRecord.check_out}`);
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
              <p className="text-gray-600">{formatDate(currentAttendanceRecord.date)}</p>
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
            <div className={`border-2 rounded-lg p-6 ${getStatusColor(currentAttendanceRecord.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(currentAttendanceRecord.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{currentAttendanceRecord.status}</h3>
                    <p className="text-sm text-gray-600">{formatDate(currentAttendanceRecord.date)}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(currentAttendanceRecord.status)}`}>
                  {currentAttendanceRecord.status.charAt(0).toUpperCase() + currentAttendanceRecord.status.slice(1)}
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
                    <p className="font-medium text-gray-900">{student.age || 'N/A'} years old</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-medium text-gray-900">{student.programName || 'Unknown Program'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-medium text-gray-900">{student.className || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Details */}
            {currentAttendanceRecord.status !== 'absent' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Time Details</span>
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in Time</p>
                      <p className="font-medium text-gray-900">{currentAttendanceRecord.check_in || 'Not recorded'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out Time</p>
                      <p className="font-medium text-gray-900">{currentAttendanceRecord.check_out || 'Not checked out'}</p>
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
                {currentAttendanceRecord.notes ? (
                  <p className="text-gray-700">{currentAttendanceRecord.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">No additional notes for this attendance record.</p>
                )}
              </div>
            </div>

            {/* Attendance History Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
              <div className="mb-4 flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {getDateRangeDisplay()}
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    placeholder="End Date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  {(selectedStartDate || selectedEndDate) && (
                    <button
                      onClick={() => {
                        setSelectedStartDate('');
                        setSelectedEndDate('');
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{attendanceStats.presentDays}</div>
                  <div className="text-sm text-green-700">Present Days</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">{attendanceStats.lateDays}</div>
                  <div className="text-sm text-orange-700">Late Days</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">{attendanceStats.absentDays}</div>
                  <div className="text-sm text-red-700">Absent Days</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleEditAttendance}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Attendance</span>
                </button>
                <button 
                  onClick={handleDeleteRecord}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isLoading ? 'Deleting...' : 'Delete Record'}</span>
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

      {/* Edit Attendance Modal */}
      {isEditModalOpen && (
        <EditAttendanceModal
          attendanceRecord={currentAttendanceRecord}
          student={student}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={async (updates) => {
            setIsLoading(true);
            try {
              const result = await updateAttendance(currentAttendanceRecord.id, updates);
              if (result.success) {
                alert('Attendance record updated successfully!');
                await refreshAttendance(); // Refresh attendance data
                setIsEditModalOpen(false);
              } else {
                alert(`Failed to update attendance record: ${result.error}`);
              }
            } catch (error) {
              alert('An error occurred while updating the attendance record.');
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default AttendanceDetails;

// Edit Attendance Modal Component
interface EditAttendanceModalProps {
  attendanceRecord: any;
  student: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: any) => Promise<void>;
}

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({ attendanceRecord, student, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: attendanceRecord.status,
    check_in: attendanceRecord.check_in || '',
    check_out: attendanceRecord.check_out || '',
    notes: attendanceRecord.notes || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Attendance</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
            <p className="text-gray-900">{student.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <p className="text-gray-900">{new Date(attendanceRecord.date).toLocaleDateString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              required
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          {formData.status !== 'absent' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                <input
                  type="time"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                <input
                  type="time"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};