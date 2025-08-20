import React, { useState } from 'react';
import { Search, Filter, Calendar, CheckCircle, XCircle, Clock, Users, Download } from 'lucide-react';
import StudentModal from './StudentModal';
import AddAttendance from './AddAttendance';
import AttendanceDetails from './AttendanceDetails';

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [isAttendanceDetailsOpen, setIsAttendanceDetailsOpen] = useState(false);

  const programs = [
    { id: 'all', name: 'All Programs' },
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
  ];

  const attendanceData = [
    {
      id: 1,
      name: 'Emma Rodriguez',
      age: 8,
      program: 'academy',
      programName: 'Brighter Future Academy',
      status: 'present',
      checkInTime: '08:30 AM',
      avatar: 'https://images.pexels.com/photos/4473864/pexels-photo-4473864.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 3,
      notes: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 6,
      program: 'first-steps',
      programName: 'First Steps',
      status: 'absent',
      checkInTime: null,
      avatar: 'https://images.pexels.com/photos/5063389/pexels-photo-5063389.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 2,
      notes: 8
    },
    {
      id: 3,
      name: 'Isabella Garcia',
      age: 10,
      program: 'individual-therapy',
      programName: 'Individual Therapy',
      status: 'late',
      checkInTime: '09:15 AM',
      avatar: 'https://images.pexels.com/photos/4473775/pexels-photo-4473775.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 5,
      notes: 18
    },
    {
      id: 4,
      name: 'Alex Thompson',
      age: 7,
      program: 'academy',
      programName: 'Brighter Future Academy',
      status: 'present',
      checkInTime: '08:25 AM',
      avatar: 'https://images.pexels.com/photos/5063380/pexels-photo-5063380.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      assessments: 4,
      notes: 15
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredAttendance = attendanceData.filter(student => 
    (selectedProgram === 'all' || student.program === selectedProgram) &&
    (selectedStatus === 'all' || student.status === selectedStatus)
  );

  const attendanceStats = {
    present: filteredAttendance.filter(s => s.status === 'present').length,
    absent: filteredAttendance.filter(s => s.status === 'absent').length,
    late: filteredAttendance.filter(s => s.status === 'late').length,
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
            onClick={() => setIsAddAttendanceOpen(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Calendar className="w-4 h-4" />
            <span>Record Attendance</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-green-50 transition-all duration-200"
          onClick={() => handleStatusFilter('present')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Present</p>
              <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-red-50 transition-all duration-200"
          onClick={() => handleStatusFilter('absent')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Absent</p>
              <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-orange-50 transition-all duration-200"
          onClick={() => handleStatusFilter('late')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Late</p>
              <p className="text-2xl font-bold text-orange-600">{attendanceStats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all duration-200"
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
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAttendance.map((student) => (
            <div 
              key={student.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => {
                // Create a mock attendance record for the selected date
                const mockRecord = {
                  date: selectedDate,
                  status: student.status,
                  checkIn: student.checkInTime,
                  checkOut: student.status === 'present' ? '03:00 PM' : null,
                  notes: student.status === 'late' ? 'Arrived late due to transportation delay' : 
                         student.status === 'absent' ? 'Parent called in sick' : 
                         'Regular attendance, no issues'
                };
                setSelectedStudent(student);
                setSelectedAttendanceRecord(mockRecord);
                setIsAttendanceDetailsOpen(true);
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
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {student.checkInTime && (
                  <span className="text-sm text-gray-600">{student.checkInTime}</span>
                )}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(student.status)}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        />
      )}

      {isAttendanceDetailsOpen && selectedStudent && selectedAttendanceRecord && (
        <AttendanceDetails
          student={selectedStudent}
          attendanceRecord={selectedAttendanceRecord}
          isOpen={isAttendanceDetailsOpen}
          onClose={() => setIsAttendanceDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default Attendance;