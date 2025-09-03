import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, Users, Download, BarChart3, PieChart, Plus } from 'lucide-react';
import StudentModal from './StudentModal';
import AddAttendance from './AddAttendance';
import AttendanceDetails from './AttendanceDetails';
import AttendanceReports from './AttendanceReports';
import BulkAttendance from './BulkAttendance';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { useAttendance } from '../hooks/useAttendance';

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [isAttendanceDetailsOpen, setIsAttendanceDetailsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isBulkAttendanceOpen, setIsBulkAttendanceOpen] = useState(false);

  // Get real data from hooks
  const { programs: realPrograms, students } = useStudents();
  const { classes } = useClasses();
  const { attendance, loading, refreshAttendance } = useAttendance();

  // Add "All Programs" option to real programs
  const programs = [
    { id: 'all', name: 'All Programs' },
    ...realPrograms.map(p => ({ id: p.id.toString(), name: p.name }))
  ];

  // Get available classes for selected program
  const availableClasses = useMemo(() => {
    if (selectedProgram === 'all') return [];
    return classes.filter(cls => cls.program_id.toString() === selectedProgram);
  }, [classes, selectedProgram]);

  // Get students for selected program and class
  const availableStudents = useMemo(() => {
    let filteredStudents = students;
    
    if (selectedProgram !== 'all') {
      filteredStudents = filteredStudents.filter(student => student.program_id.toString() === selectedProgram);
    }
    
    if (selectedClass) {
      filteredStudents = filteredStudents.filter(student => student.class_id?.toString() === selectedClass);
    }
    
    return filteredStudents;
  }, [students, selectedProgram, selectedClass]);

  // Get attendance data for selected date
  const selectedDateAttendance = useMemo(() => {
    return attendance.filter(record => record.date === selectedDate);
  }, [attendance, selectedDate]);

  // Create attendance data for display
  const attendanceData = useMemo(() => {
    return availableStudents.map(student => {
      // Find attendance record for this student on selected date
      const attendanceRecord = selectedDateAttendance.find(record => record.student_id === student.id);
      
      // Get program and class names
      const program = realPrograms.find(p => p.id === student.program_id);
      const classInfo = classes.find(c => c.id === student.class_id);
      
      // Determine status and check-in time
      let status = 'not-recorded';
      let checkInTime = null;
      
      if (attendanceRecord) {
        status = attendanceRecord.status;
        checkInTime = attendanceRecord.check_in ? 
          new Date(`2000-01-01T${attendanceRecord.check_in}`).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }) : null;
      }
      
      return {
        id: student.id,
        name: student.name,
        age: student.age || 'N/A',
        program: student.program_id.toString(),
        programName: program?.name || 'Unknown Program',
        className: classInfo?.name || 'Unassigned',
        status,
        checkInTime,
        avatar: student.picture_url || 'https://images.pexels.com/photos/4473864/pexels-photo-4473864.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        email: student.email,
        notes: attendanceRecord?.notes || ''
      };
    });
  }, [availableStudents, selectedDateAttendance, realPrograms, classes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-100 text-emerald-800';
      case 'absent': return 'bg-rose-100 text-rose-800';
      case 'late': return 'bg-amber-100 text-amber-800';
      case 'not-recorded': return 'bg-sky-100 text-sky-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'late': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'not-recorded': return <Clock className="w-4 h-4 text-sky-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredAttendance = attendanceData.filter(student => 
    (selectedProgram === 'all' || student.program === selectedProgram) &&
    (selectedClass === '' || student.className === classes.find(c => c.id.toString() === selectedClass)?.name) &&
    (selectedStatus === 'all' || student.status === selectedStatus)
  );

  const attendanceStats = {
    present: filteredAttendance.filter(s => s.status === 'present').length,
    absent: filteredAttendance.filter(s => s.status === 'absent').length,
    late: filteredAttendance.filter(s => s.status === 'late').length,
    notRecorded: filteredAttendance.filter(s => s.status === 'not-recorded').length,
    total: filteredAttendance.length
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-2">Track daily attendance and monitor student presence</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsReportsOpen(true)}
            className="flex items-center space-x-2 bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition-colors duration-200 min-w-[140px] justify-center"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => setIsBulkAttendanceOpen(true)}
            className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200 min-w-[140px] justify-center"
          >
            <Users className="w-4 h-4" />
            <span>Bulk Attendance</span>
          </button>
          <button 
            onClick={() => setIsAddAttendanceOpen(true)}
            className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors duration-200 min-w-[140px] justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Record Attendance</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-emerald-50 transition-all duration-200"
          onClick={() => handleStatusFilter('present')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Present</p>
              <p className="text-2xl font-bold text-emerald-600">{attendanceStats.present}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-rose-50 transition-all duration-200"
          onClick={() => handleStatusFilter('absent')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-2xl font-bold text-rose-600">{attendanceStats.absent}</p>
            </div>
            <XCircle className="w-8 h-8 text-rose-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-amber-50 transition-all duration-200"
          onClick={() => handleStatusFilter('late')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Late</p>
              <p className="text-2xl font-bold text-amber-600">{attendanceStats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-sky-50 transition-all duration-200"
          onClick={() => handleStatusFilter('not-recorded')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Not Recorded</p>
              <p className="text-2xl font-bold text-sky-600">{attendanceStats.notRecorded}</p>
            </div>
            <Clock className="w-8 h-8 text-sky-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:bg-gray-50 transition-all duration-200"
          onClick={() => handleStatusFilter('all')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                setSelectedClass(''); // Reset class selection when program changes
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          {selectedProgram !== 'all' && availableClasses.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedClass || ''}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">All Classes</option>
                {availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="not-recorded">Not Recorded</option>
            </select>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Showing:</span> {filteredAttendance.length} students
              {selectedProgram !== 'all' && (
                <span className="ml-2">• Program: {programs.find(p => p.id === selectedProgram)?.name}</span>
              )}
              {selectedClass && (
                <span className="ml-2">• Class: {classes.find(c => c.id.toString() === selectedClass)?.name}</span>
              )}
              {selectedStatus !== 'all' && (
                <span className="ml-2">• Status: {selectedStatus === 'not-recorded' ? 'Not Recorded' : selectedStatus}</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attendance data...</p>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students found for the selected criteria.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting the program filter or date selection.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAttendance.map((student) => (
            <div 
              key={student.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => {
                // Find real attendance record for this student on selected date
                const realRecord = selectedDateAttendance.find(record => record.student_id === student.id);
                
                if (realRecord) {
                  // Use real attendance record
                  const attendanceRecord = {
                    id: realRecord.id,
                    date: realRecord.date,
                    status: realRecord.status,
                    checkIn: realRecord.check_in,
                    checkOut: realRecord.check_out,
                    notes: realRecord.notes || 'No notes'
                  };
                  setSelectedStudent(student);
                  setSelectedAttendanceRecord(attendanceRecord);
                  setIsAttendanceDetailsOpen(true);
                } else {
                  // No attendance recorded yet - open AddAttendance for this student
                  setSelectedStudent(student);
                  setIsAddAttendanceOpen(true);
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.programName}</p>
                  {student.className && (
                    <p className="text-xs text-gray-500">Class: {student.className}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {student.checkInTime && (
                  <span className="text-sm text-gray-600">{student.checkInTime}</span>
                )}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(student.status)}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(student.status)}`}>
                    {student.status === 'not-recorded' ? 'Not Recorded' : student.status}
                  </span>
                </div>
              </div>
                          </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedStudent && (
        <StudentModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isAddAttendanceOpen && (
        <AddAttendance
          isOpen={isAddAttendanceOpen}
          onClose={() => setIsAddAttendanceOpen(false)}
          selectedDate={selectedDate}
          studentId={selectedStudent?.id}
          onAttendanceAdded={async () => {
            // Refresh attendance data to show the new record
            await refreshAttendance();
          }}
        />
      )}

      {isAttendanceDetailsOpen && selectedStudent && selectedAttendanceRecord && (
        <AttendanceDetails
          student={selectedStudent}
          attendanceRecord={selectedAttendanceRecord}
          isOpen={isAttendanceDetailsOpen}
          onClose={() => setIsAttendanceDetailsOpen(false)}
          onAttendanceDeleted={async () => {
            // Refresh attendance data to show the updated status
            await refreshAttendance();
          }}
        />
      )}

      {/* New Feature Modals */}
      {isReportsOpen && (
        <AttendanceReports
          isOpen={isReportsOpen}
          onClose={() => setIsReportsOpen(false)}
        />
      )}

      {isBulkAttendanceOpen && (
        <BulkAttendance
          isOpen={isBulkAttendanceOpen}
          onClose={() => setIsBulkAttendanceOpen(false)}
          onAttendanceAdded={async () => {
            // Refresh attendance data to show the new records
            await refreshAttendance();
          }}
        />
      )}
    </div>
  );
};

export default Attendance;