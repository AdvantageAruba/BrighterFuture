import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Users, X } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';

interface AttendanceCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  attendanceCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const { attendance, loading } = useAttendance();
  const { programs, students } = useStudents();
  const { classes } = useClasses();

  // Get available classes for selected program
  const availableClasses = useMemo(() => {
    return selectedProgram 
      ? classes.filter(cls => cls.program_id.toString() === selectedProgram)
      : [];
  }, [classes, selectedProgram]);

  // Filter attendance data based on selections
  const filteredAttendance = useMemo(() => {
    return attendance.filter(record => {
      if (selectedProgram) {
        const student = students.find(s => s.id === record.student_id);
        if (!student || student.program_id.toString() !== selectedProgram) return false;
      }
      if (selectedClass) {
        const student = students.find(s => s.id === record.student_id);
        if (!student || student.class_id?.toString() !== selectedClass) return false;
      }
      return true;
    });
  }, [attendance, selectedProgram, selectedClass, students]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get attendance data for this date
      const dayAttendance = filteredAttendance.filter(r => r.date === dateStr);
      const presentCount = dayAttendance.filter(r => r.status === 'present').length;
      const absentCount = dayAttendance.filter(r => r.status === 'absent').length;
      const lateCount = dayAttendance.filter(r => r.status === 'late').length;
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: dateStr === today,
        attendanceCount: dayAttendance.length,
        presentCount,
        absentCount,
        lateCount
      });
    }
    
    return days;
  }, [currentDate, filteredAttendance]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get month name
  const monthName = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  // Handle date selection
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // Get attendance summary for selected date
  const selectedDateSummary = useMemo(() => {
    if (!selectedDate) return null;
    
    const dayAttendance = filteredAttendance.filter(r => r.date === selectedDate);
    const presentCount = dayAttendance.filter(r => r.status === 'present').length;
    const absentCount = dayAttendance.filter(r => r.status === 'absent').length;
    const lateCount = dayAttendance.filter(r => r.status === 'late').length;
    const totalStudents = presentCount + absentCount + lateCount;
    
    return {
      date: selectedDate,
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate: totalStudents > 0 ? ((presentCount + lateCount) / totalStudents) * 100 : 0
    };
  }, [selectedDate, filteredAttendance]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Attendance Calendar</h2>
            <p className="text-gray-600">Visual attendance tracking and patterns</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => {
                    setSelectedProgram(e.target.value);
                    setSelectedClass('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Programs</option>
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
              
              <div className="flex items-end">
                <button
                  onClick={goToToday}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Go to Today
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold text-gray-900">{monthName}</h3>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={`min-h-[100px] p-2 border-r border-b border-gray-200 cursor-pointer transition-colors duration-200 ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    day.isToday ? 'ring-2 ring-blue-500' : ''
                  } ${
                    selectedDate === day.date ? 'bg-blue-50' : ''
                  } hover:bg-gray-50`}
                >
                  <div className="text-right mb-1">
                    <span className={`text-sm font-medium ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${
                      day.isToday ? 'text-blue-600 font-bold' : ''
                    }`}>
                      {day.day}
                    </span>
                  </div>
                  
                  {day.attendanceCount > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">●</span>
                        <span className="text-gray-600">{day.presentCount}</span>
                      </div>
                      {day.lateCount > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-600">●</span>
                          <span className="text-gray-600">{day.lateCount}</span>
                        </div>
                      )}
                      {day.absentCount > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-red-600">●</span>
                          <span className="text-gray-600">{day.absentCount}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">●</span>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-600">●</span>
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-600">●</span>
              <span className="text-gray-600">Absent</span>
            </div>
          </div>

          {/* Selected Date Summary */}
          {selectedDateSummary && (
            <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance Summary for {new Date(selectedDateSummary.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedDateSummary.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedDateSummary.presentCount}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedDateSummary.lateCount}</div>
                  <div className="text-sm text-gray-600">Late</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedDateSummary.absentCount}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedDateSummary.attendanceRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedDateSummary.attendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
