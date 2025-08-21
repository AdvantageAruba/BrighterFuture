import React, { useState } from 'react';
import { X, Save, Calendar, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AddAttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
}

const AddAttendance: React.FC<AddAttendanceProps> = ({ isOpen, onClose, selectedDate }) => {
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

  const programs = [
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'individual-therapy', name: 'Individual Therapy' },
    { id: 'consultancy', name: 'Consultancy' }
  ];

  const classes = [
    { id: 'grade-1a', name: 'Grade 1A', program: 'academy' },
    { id: 'grade-1b', name: 'Grade 1B', program: 'academy' },
    { id: 'grade-2a', name: 'Grade 2A', program: 'academy' },
    { id: 'grade-2b', name: 'Grade 2B', program: 'academy' },
    { id: 'early-learners', name: 'Early Learners', program: 'first-steps' },
    { id: 'pre-k', name: 'Pre-K', program: 'first-steps' },
    { id: 'individual-1', name: 'Individual Session Room 1', program: 'individual-therapy' },
    { id: 'individual-2', name: 'Individual Session Room 2', program: 'individual-therapy' },
    { id: 'consultation-a', name: 'Consultation Group A', program: 'consultancy' }
  ];

  // Students organized by program
  const studentsByProgram = {
    'academy': [
      { id: 1, name: 'Emma Rodriguez', age: 8, class: 'Grade 2A', classId: 'grade-2a' },
      { id: 4, name: 'Alex Thompson', age: 7, class: 'Grade 1B', classId: 'grade-1b' },
      { id: 5, name: 'Sophie Martinez', age: 9, class: 'Grade 2B', classId: 'grade-2b' },
      { id: 6, name: 'James Wilson', age: 8, class: 'Grade 2A', classId: 'grade-2a' }
    ],
    'first-steps': [
      { id: 2, name: 'Michael Chen', age: 6, class: 'Early Learners', classId: 'early-learners' },
      { id: 7, name: 'Olivia Davis', age: 5, class: 'Pre-K', classId: 'pre-k' },
      { id: 8, name: 'Lucas Brown', age: 6, class: 'Early Learners', classId: 'early-learners' }
    ],
    'individual-therapy': [
      { id: 3, name: 'Isabella Garcia', age: 10, class: 'Individual Session Room 1', classId: 'individual-1' },
      { id: 9, name: 'Ethan Johnson', age: 9, class: 'Individual Session Room 2', classId: 'individual-2' },
      { id: 10, name: 'Ava Miller', age: 11, class: 'Individual Session Room 1', classId: 'individual-1' }
    ],
    'consultancy': [
      { id: 11, name: 'Noah Anderson', age: 8, class: 'Consultation Group A', classId: 'consultation-a' },
      { id: 12, name: 'Mia Taylor', age: 7, class: 'Consultation Group A', classId: 'consultation-a' }
    ]
  };

  if (!isOpen) return null;

  const getAvailableStudents = () => {
    if (!formData.program) return [];
    const programStudents = studentsByProgram[formData.program as keyof typeof studentsByProgram] || [];
    
    if (!formData.class) return programStudents;
    
    return programStudents.filter(student => student.classId === formData.class);
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

  const handleStudentAttendanceChange = (studentId: number, field: string, value: string) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attendance data:', {
      ...formData,
      studentAttendance
    });
    alert('Attendance recorded successfully!');
    onClose();
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
            <h2 className="text-xl font-bold text-gray-900">Record Daily Attendance</h2>
            <p className="text-gray-600">Mark attendance for students in the selected program</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    disabled={!formData.program}
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
                <div className="space-y-4">
                  {getAvailableStudents().map((student) => {
                    const attendance = studentAttendance[student.id] || {
                      status: 'present',
                      checkIn: '08:30',
                      checkOut: '15:00',
                      notes: ''
                    };

                    return (
                      <div 
                        key={student.id} 
                        className={`border-2 rounded-lg p-4 transition-all duration-200 ${getStatusColor(attendance.status)}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(attendance.status)}
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
                                attendance.status === 'present' 
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
                                value={attendance.checkIn}
                                onChange={(e) => handleStudentAttendanceChange(student.id, 'checkIn', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                              <input
                                type="time"
                                value={attendance.checkOut}
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
                            value={attendance.notes}
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
              <span>Save Attendance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendance;