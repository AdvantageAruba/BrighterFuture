import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Calendar, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { useClasses } from '../hooks/useClasses';

interface AddAttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  existingRecord?: any; // Add this prop for editing existing records
  studentId?: number; // Add this prop for editing specific student attendance
  onAttendanceAdded?: () => void; // Callback when attendance is successfully added
}

const AddAttendance: React.FC<AddAttendanceProps> = ({ isOpen, onClose, selectedDate, existingRecord, studentId, onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    date: selectedDate || new Date().toISOString().split('T')[0],
    program: '',
    class: '',
    notes: ''
  });

  const [studentAttendance, setStudentAttendance] = useState<{[key: number]: {
    status: string;
    checkIn: string;
    checkOut: string;
    notes: string;
  }}>({});

  // Use real data from Supabase
  const { programs: supabasePrograms, students: supabaseStudents } = useStudents();
  const { classes: realClasses } = useClasses();
  const { addAttendance, updateAttendance } = useAttendance();

  // Transform programs for UI
  const programs = supabasePrograms.map(p => ({ 
    id: p.id.toString(), 
    name: p.name 
  }));

  // Use real classes from database instead of mock data
  const classes = realClasses.map(cls => ({
    id: cls.id,
    name: cls.name,
    program: cls.program_id.toString()
  }));

  // Students organized by program using real data
  const studentsByProgram = useMemo(() => {
    return supabasePrograms.reduce((acc, program) => {
      const programStudents = supabaseStudents.filter(student => student.program_id === program.id);
      acc[program.id.toString()] = programStudents.map(student => ({
        id: student.id,
        name: student.name,
        age: student.date_of_birth ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear() : 0,
        class: student.class_id ? realClasses.find(c => c.id === student.class_id)?.name || 'Unassigned' : 'Unassigned',
        classId: student.class_id || null
      }));
      return acc;
    }, {} as Record<string, any[]>);
  }, [supabasePrograms, supabaseStudents, realClasses]);

  // Pre-populate form when editing existing record
  useEffect(() => {
    if (existingRecord && studentId) {
      // Find the student's program and class based on the student ID
      let studentProgram = '';
      let studentClass = '';
      
      for (const [program, students] of Object.entries(studentsByProgram)) {
        const student = students.find((s: any) => s.id === studentId);
        if (student) {
          studentProgram = program;
          studentClass = student.classId;
          break;
        }
      }
      
      setFormData({
        date: existingRecord.date,
        program: studentProgram,
        class: studentClass,
        notes: existingRecord.notes || ''
      });
      
      setStudentAttendance({
        [studentId]: {
          status: existingRecord.status,
          checkIn: existingRecord.checkIn || '',
          checkOut: existingRecord.checkOut || '',
          notes: existingRecord.notes || ''
        }
      });
    }
  }, [existingRecord, studentId, studentsByProgram]);

  // Pre-populate form when studentId is provided for new attendance entry
  useEffect(() => {
    if (studentId && !existingRecord && Object.keys(studentsByProgram).length > 0) {
      // Find the student's program and class based on the student ID
      let studentProgram = '';
      let studentClass = '';
      
      for (const [program, students] of Object.entries(studentsByProgram)) {
        const student = students.find((s: any) => s.id === studentId);
        if (student) {
          studentProgram = program;
          studentClass = student.classId;
          break;
        }
      }
      
      setFormData({
        date: selectedDate || new Date().toISOString().split('T')[0],
        program: studentProgram,
        class: studentClass,
        notes: ''
      });
      
      // Initialize attendance for this specific student
      setStudentAttendance({
        [studentId]: {
          status: 'present', // Default to present
          checkIn: '08:30',  // Default check-in time
          checkOut: '15:00', // Default check-out time
          notes: ''
        }
      });
    }
  }, [studentId, existingRecord, studentsByProgram, selectedDate]);

  if (!isOpen) return null;

  const getAvailableStudents = () => {
    if (!formData.program) return [];
    const programStudents = studentsByProgram[formData.program as keyof typeof studentsByProgram] || [];
    
    // If studentId is provided, only return that specific student
    if (studentId) {
      return programStudents.filter(student => student.id === studentId);
    }
    
    if (!formData.class) return programStudents;
    
    // Filter students by their assigned class_id
    return programStudents.filter(student => student.classId?.toString() === formData.class);
  };

  const getAvailableClasses = () => {
    if (!formData.program) return [];
    return classes.filter(cls => cls.program === formData.program);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset student attendance when program changes
    if (name === 'program') {
      setStudentAttendance({});
      setFormData(prev => ({
        ...prev,
        class: ''
      }));
    }

    // Reset student attendance when class changes
    if (name === 'class') {
      setStudentAttendance({});
    }
  };

  // Initialize student attendance when program/class changes
  useEffect(() => {
    if (formData.program && !existingRecord && !studentId) {
      const programStudents = studentsByProgram[formData.program as keyof typeof studentsByProgram] || [];
      let availableStudents = programStudents;
      
      if (formData.class) {
        availableStudents = programStudents.filter(student => student.classId?.toString() === formData.class);
      }
      
      if (availableStudents.length > 0) {
        const initialAttendance = availableStudents.reduce((acc, student) => {
          acc[student.id] = {
            status: 'present', // Default to present
            checkIn: '08:30',  // Default check-in time
            checkOut: '15:00', // Default check-out time
            notes: ''
          };
          return acc;
        }, {} as any);
        setStudentAttendance(initialAttendance);
      }
    }
  }, [formData.program, formData.class, existingRecord, studentId, studentsByProgram]);

  const handleStudentAttendanceChange = (studentId: number, field: string, value: string) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.program || !formData.date) {
      alert('Please select a program and date');
      return;
    }

    // Check if at least one student has attendance marked
    const hasAttendance = Object.values(studentAttendance).some(att => att.status && att.status !== '');
    if (!hasAttendance) {
      alert('Please mark attendance for at least one student');
      return;
    }

    try {
      // Process attendance data and save to Supabase
      const attendancePromises = Object.entries(studentAttendance).map(([studentId, att]) => {
        if (att.status === '') return null; // Skip students with no status
        
        const attendanceData = {
          student_id: parseInt(studentId),
          date: formData.date,
          status: att.status,
          check_in: att.checkIn || null,
          check_out: att.checkOut || null,
          notes: att.notes || formData.notes
        };

        console.log('Saving attendance data:', attendanceData);

        // If editing existing record, update it
        if (existingRecord && parseInt(studentId) === existingRecord.student_id) {
          console.log('Updating existing attendance record:', existingRecord.id);
          return updateAttendance(existingRecord.id, attendanceData);
        } else {
          // Otherwise, create new record
          console.log('Creating new attendance record');
          return addAttendance(attendanceData);
        }
      }).filter(Boolean);

      console.log('Filtered attendance promises:', attendancePromises);

      // Wait for all attendance records to be saved
      const results = await Promise.all(attendancePromises);
      
      // Debug: Log the results to see what's happening
      console.log('Attendance save results:', results);
      
      // Check if all operations were successful
      const allSuccessful = results.every(result => result?.success);
      
      if (allSuccessful) {
        console.log('Attendance saved successfully');
        alert('Attendance recorded successfully!');
        // Call the callback to notify parent component
        if (onAttendanceAdded) {
          onAttendanceAdded();
        }
        onClose();
      } else {
        // Log which records failed
        const failedRecords = results.filter(result => !result?.success);
        console.error('Failed attendance records:', failedRecords);
        
        // Check for specific error types
        const hasDuplicateError = failedRecords.some(result => 
          result?.error?.includes('duplicate') || 
          result?.error?.includes('unique') ||
          result?.error?.includes('already exists')
        );
        
        const hasConnectionError = failedRecords.some(result => 
          result?.error?.includes('connection') || 
          result?.error?.includes('network') ||
          result?.error?.includes('ERR_CONNECTION_CLOSED')
        );
        
        if (hasConnectionError) {
          alert('Connection to the server was lost. Please check your internet connection and try again.');
        } else if (hasDuplicateError) {
          alert('Some students already have attendance records for this date. Please check existing records.');
        } else {
          alert('Some attendance records failed to save. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'late': return <Clock className="w-5 h-5 text-orange-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-50 border-green-200';
      case 'absent': return 'bg-red-50 border-red-200';
      case 'late': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
                    <h2 className="text-xl font-bold text-gray-900">
          {existingRecord ? 'Edit Attendance' : 'Record Daily Attendance'}
        </h2>
        <p className="text-gray-600">
          {existingRecord ? 'Update attendance information for the selected student' : 'Mark attendance for students in the selected program'}
        </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Date and Program Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Attendance Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program *</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    disabled={!!studentId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select program...</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    disabled={!formData.program || !!studentId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.program ? 'All classes' : 'Select program first'}
                    </option>
                    {getAvailableClasses().map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Student Attendance */}
            {formData.program && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Student Attendance</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Students start with "Present" as default. Click the status buttons to change attendance status.
                </p>
                <div className="space-y-4">
                  {getAvailableStudents().map((student) => {
                    const attendance = studentAttendance[student.id] || {
                      status: '',
                      checkIn: '',
                      checkOut: '',
                      notes: ''
                    };

                    return (
                      <div 
                        key={student.id} 
                        className={`border-2 rounded-lg p-4 transition-all duration-200 ${getStatusColor(attendance.status || 'present')}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(attendance.status || 'present')}
                            <div>
                              <h4 className="font-medium text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">Age {student.age} • {student.class}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStudentAttendanceChange(student.id, 'status', 'present')}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                attendance.status === 'present' || attendance.status === '' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStudentAttendanceChange(student.id, 'status', 'late')}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                attendance.status === 'late' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStudentAttendanceChange(student.id, 'status', 'absent')}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                attendance.status === 'absent' 
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>

                        {attendance.status !== 'absent' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                              <input
                                type="time"
                                value={attendance.checkIn || ''}
                                onChange={(e) => handleStudentAttendanceChange(student.id, 'checkIn', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                              <input
                                type="time"
                                value={attendance.checkOut || ''}
                                onChange={(e) => handleStudentAttendanceChange(student.id, 'checkOut', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                          <input
                            type="text"
                            value={attendance.notes || ''}
                            onChange={(e) => handleStudentAttendanceChange(student.id, 'notes', e.target.value)}
                            placeholder="Any additional notes about attendance..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Notes</h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any general notes about today's attendance..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
                              <span>{existingRecord ? 'Update Attendance' : 'Save Attendance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendance;