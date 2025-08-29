import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Users, CheckCircle, XCircle, Clock, Save, X, AlertTriangle } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { useAttendance } from '../hooks/useAttendance';

interface BulkAttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  onAttendanceAdded?: () => void; // Callback when attendance is successfully added
}

interface BulkAttendanceData {
  studentId: number;
  status: 'present' | 'absent' | 'late';
  checkIn: string;
  checkOut: string;
  notes: string;
}

const BulkAttendance: React.FC<BulkAttendanceProps> = ({ isOpen, onClose, onAttendanceAdded }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [bulkStatus, setBulkStatus] = useState<'present' | 'absent' | 'late'>('present');
  const [bulkCheckIn, setBulkCheckIn] = useState('08:30');
  const [bulkCheckOut, setBulkCheckOut] = useState('15:00');
  const [bulkNotes, setBulkNotes] = useState('');
  const [individualAttendance, setIndividualAttendance] = useState<BulkAttendanceData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isInitialRender = useRef(true);

  const { programs, students } = useStudents();
  const { classes } = useClasses();
  const { addAttendance } = useAttendance();

  // Get available classes for selected program
  const availableClasses = useMemo(() => {
    return selectedProgram 
      ? classes.filter(cls => cls.program_id.toString() === selectedProgram)
      : [];
  }, [classes, selectedProgram]);

  // Get students for selected program and class
  const availableStudents = useMemo(() => {
    return students.filter(student => {
      if (selectedProgram && student.program_id.toString() !== selectedProgram) return false;
      if (selectedClass && student.class_id?.toString() !== selectedClass) return false;
      return true;
    });
  }, [students, selectedProgram, selectedClass]);

  // Initialize individual attendance when students change
  useEffect(() => {
    if (availableStudents.length > 0) {
      const initialAttendance = availableStudents.map(student => ({
        studentId: student.id,
        status: bulkStatus as 'present' | 'absent' | 'late',
        checkIn: bulkCheckIn,
        checkOut: bulkCheckOut,
        notes: bulkNotes
      }));
      setIndividualAttendance(initialAttendance);
    } else {
      setIndividualAttendance([]);
    }
  }, [availableStudents]);

  // Update attendance when bulk settings change
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (individualAttendance.length > 0) {
      setIndividualAttendance(prev => prev.map(att => ({
        ...att,
        status: bulkStatus,
        checkIn: bulkCheckIn,
        checkOut: bulkCheckOut,
        notes: bulkNotes
      })));
    }
  }, [bulkStatus, bulkCheckIn, bulkCheckOut, bulkNotes]);

  // Apply bulk settings to all students
  const applyBulkSettings = () => {
    setIndividualAttendance(prev => prev.map(att => ({
      ...att,
      status: bulkStatus,
      checkIn: bulkCheckIn,
      checkOut: bulkCheckOut,
      notes: bulkNotes
    })));
  };

  // Update individual student attendance
  const updateStudentAttendance = (studentId: number, field: keyof BulkAttendanceData, value: string) => {
    setIndividualAttendance(prev => prev.map(att => 
      att.studentId === studentId ? { ...att, [field]: value } : att
    ));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (individualAttendance.length === 0) {
      alert('No students selected for attendance.');
      return;
    }

    setIsSubmitting(true);

    try {
      const attendancePromises = individualAttendance.map(att => {
        const attendanceData = {
          student_id: att.studentId,
          date: selectedDate,
          status: att.status,
          check_in: att.checkIn || null,
          check_out: att.checkOut || null,
          notes: att.notes
        };

        return addAttendance(attendanceData);
      });

      const results = await Promise.all(attendancePromises);
      const allSuccessful = results.every(result => result?.success);

      if (allSuccessful) {
        alert('Bulk attendance recorded successfully!');
        // Call the callback to notify parent component
        if (onAttendanceAdded) {
          onAttendanceAdded();
        }
        onClose();
      } else {
        const failedCount = results.filter(result => !result?.success).length;
        alert(`${failedCount} attendance records failed to save. Please try again.`);
      }
    } catch (error) {
      console.error('Error saving bulk attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Attendance Operations</h2>
            <p className="text-gray-600">Quickly record attendance for multiple students at once</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Settings */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program *</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => {
                    setSelectedProgram(e.target.value);
                    setSelectedClass('');
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select program...</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id.toString()}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={!selectedProgram}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Classes</option>
                  {availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
                <div className="text-sm text-gray-900 font-medium">
                  {availableStudents.length} students
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Settings */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Status</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as 'present' | 'absent' | 'late')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Check-in</label>
                <input
                  type="time"
                  value={bulkCheckIn}
                  onChange={(e) => setBulkCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Check-out</label>
                <input
                  type="time"
                  value={bulkCheckOut}
                  onChange={(e) => setBulkCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={applyBulkSettings}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Apply to All
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Notes</label>
              <input
                type="text"
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder="Enter default notes for all students..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Student List */}
          {availableStudents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student Attendance ({availableStudents.length} students)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availableStudents.map((student) => {
                      const attendance = individualAttendance.find(att => att.studentId === student.id);
                      if (!attendance) return null;
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email || 'No email'}
                            </div>
                          </td>
                          
                          <td className="px-4 py-4 whitespace-nowrap">
                            <select
                              value={attendance.status}
                              onChange={(e) => updateStudentAttendance(student.id, 'status', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="late">Late</option>
                            </select>
                          </td>
                          
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="time"
                              value={attendance.checkIn}
                              onChange={(e) => updateStudentAttendance(student.id, 'checkIn', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="time"
                              value={attendance.checkOut}
                              onChange={(e) => updateStudentAttendance(student.id, 'checkOut', e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={attendance.notes}
                              onChange={(e) => updateStudentAttendance(student.id, 'notes', e.target.value)}
                              placeholder="Individual notes..."
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableStudents.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Attendance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkAttendance;
