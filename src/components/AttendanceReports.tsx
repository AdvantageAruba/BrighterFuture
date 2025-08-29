import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, BarChart3, PieChart, Users, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';

interface AttendanceReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceStats {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  trend: 'up' | 'down' | 'stable';
}

const AttendanceReports: React.FC<AttendanceReportsProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  
  const { attendance, loading } = useAttendance();
  const { programs, students } = useStudents();
  const { classes } = useClasses();

  // Filter attendance data based on selections
  const filteredAttendance = useMemo(() => {
    return attendance.filter(record => {
      if (selectedDate && record.date !== selectedDate) return false;
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
  }, [attendance, selectedDate, selectedProgram, selectedClass, students]);

  // Calculate attendance statistics
  const stats = useMemo((): AttendanceStats => {
    const totalStudents = filteredAttendance.length;
    const presentCount = filteredAttendance.filter(r => r.status === 'present').length;
    const absentCount = filteredAttendance.filter(r => r.status === 'absent').length;
    const lateCount = filteredAttendance.filter(r => r.status === 'late').length;
    const attendanceRate = totalStudents > 0 ? ((presentCount + lateCount) / totalStudents) * 100 : 0;
    
    // Simple trend calculation (compare with previous period)
    const trend: 'up' | 'down' | 'stable' = 'stable'; // Placeholder for now
    
    return {
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate,
      trend
    };
  }, [filteredAttendance]);

  // Get available classes for selected program
  const availableClasses = useMemo(() => {
    return selectedProgram 
      ? classes.filter(cls => cls.program_id.toString() === selectedProgram)
      : [];
  }, [classes, selectedProgram]);

  // Generate weekly/monthly data
  const periodData = useMemo(() => {
    if (viewMode === 'daily') return null;
    
    const days = viewMode === 'weekly' ? 7 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttendance = attendance.filter(r => r.date === dateStr);
      const present = dayAttendance.filter(r => r.status === 'present').length;
      const absent = dayAttendance.filter(r => r.status === 'absent').length;
      const late = dayAttendance.filter(r => r.status === 'late').length;
      
      data.push({
        date: dateStr,
        present,
        absent,
        late,
        total: present + absent + late
      });
    }
    
    return data;
  }, [viewMode, attendance]);

  // Export functions
  const exportToCSV = () => {
    if (filteredAttendance.length === 0) {
      alert('No data to export');
      return;
    }

    // Create comprehensive CSV with summary and detailed data
    const summaryData = [
      ['Attendance Report Summary'],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Summary Statistics'],
      ['Total Students:', stats.totalStudents],
      ['Present:', stats.presentCount],
      ['Absent:', stats.absentCount],
      ['Late:', stats.lateCount],
      ['Attendance Rate:', `${stats.attendanceRate.toFixed(1)}%`],
      [''],
      ['Filter Criteria'],
      ['View Mode:', viewMode],
      ['Date:', selectedDate || 'All dates'],
      ['Program:', selectedProgram ? programs.find(p => p.id.toString() === selectedProgram)?.name : 'All programs'],
      ['Class:', selectedClass ? classes.find(c => c.id.toString() === selectedClass)?.name : 'All classes'],
      [''],
      ['Detailed Records'],
      ['Student Name', 'Student Email', 'Date', 'Status', 'Check-in', 'Check-out', 'Notes', 'Program', 'Class']
    ];

    const records = filteredAttendance.map(record => {
      const student = students.find(s => s.id === record.student_id);
      const program = programs.find(p => p.id === student?.program_id);
      const classInfo = classes.find(c => c.id === student?.class_id);
      
      return [
        student?.name || 'Unknown',
        student?.email || 'No email',
        record.date,
        record.status,
        record.check_in || 'N/A',
        record.check_out || 'N/A',
        record.notes || 'No notes',
        program?.name || 'Unknown',
        classInfo?.name || 'Unassigned'
      ];
    });

    const csvContent = [...summaryData, ...records]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (filteredAttendance.length === 0) {
      alert('No data to export');
      return;
    }

    // For Excel export, we'll create a more structured format with multiple sheets
    const excelData = [
      ['Attendance Report'],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Summary Statistics'],
      ['Total Students:', stats.totalStudents],
      ['Present:', stats.presentCount],
      ['Absent:', stats.absentCount],
      ['Late:', stats.lateCount],
      ['Attendance Rate:', `${stats.attendanceRate.toFixed(1)}%`],
      [''],
      ['Filter Criteria'],
      ['View Mode:', viewMode],
      ['Date:', selectedDate || 'All dates'],
      ['Program:', selectedProgram ? programs.find(p => p.id.toString() === selectedProgram)?.name : 'All programs'],
      ['Class:', selectedClass ? classes.find(c => c.id.toString() === selectedClass)?.name : 'All classes'],
      [''],
      ['Detailed Records'],
      ['Student Name', 'Student Email', 'Date', 'Status', 'Check-in', 'Check-out', 'Notes', 'Program', 'Class']
    ];

    const records = filteredAttendance.map(record => {
      const student = students.find(s => s.id === record.student_id);
      const program = programs.find(p => p.id === student?.program_id);
      const classInfo = classes.find(c => c.id === student?.class_id);
      
      return [
        student?.name || 'Unknown',
        student?.email || 'No email',
        record.date,
        record.status,
        record.check_in || 'N/A',
        record.check_out || 'N/A',
        record.notes || 'No notes',
        program?.name || 'Unknown',
        classInfo?.name || 'Unassigned'
      ];
    });

    excelData.push(...records);

    // Add period data if available (for weekly/monthly views)
    if (periodData && periodData.length > 0) {
      excelData.push(['']);
      excelData.push(['Period Data']);
      excelData.push(['Date', 'Present', 'Absent', 'Late', 'Total', 'Attendance Rate']);
      
      periodData.forEach(day => {
        const rate = day.total > 0 ? ((day.present + day.late) / day.total * 100).toFixed(1) : '0.0';
        excelData.push([
          day.date,
          day.present,
          day.absent,
          day.late,
          day.total,
          `${rate}%`
        ]);
      });
    }

    // Convert to CSV format (Excel can open CSV files)
    const csvContent = excelData
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'csv') {
        exportToCSV();
      } else {
        exportToExcel();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
           <div>
             <h2 className="text-xl font-bold text-gray-900">Attendance Reports & Analytics</h2>
             <p className="text-gray-600">Comprehensive attendance insights and statistics</p>
           </div>
           <div className="flex items-center space-x-3">
             {filteredAttendance.length > 0 && (
               <button
                 onClick={handleExport}
                 disabled={isExporting}
                 className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2 text-sm"
                 title={`Export ${exportFormat.toUpperCase()} (${filteredAttendance.length} records)`}
               >
                 {isExporting ? (
                   <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                 ) : (
                   <Download className="w-4 h-4" />
                 )}
                 <span>Quick Export</span>
               </button>
             )}
             <button
               onClick={onClose}
               className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
             >
               <X className="w-5 h-5 text-gray-400" />
             </button>
           </div>
         </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                     {/* Filters */}
           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                 <select
                   value={viewMode}
                   onChange={(e) => setViewMode(e.target.value as 'daily' | 'weekly' | 'monthly')}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 >
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="monthly">Monthly</option>
                 </select>
               </div>
               
               {viewMode === 'daily' && (
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                   <input
                     type="date"
                     value={selectedDate}
                     onChange={(e) => setSelectedDate(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                 </div>
               )}
               
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
             </div>
           </div>

           {/* Export Controls */}
           <div className="mb-6 p-4 bg-blue-50 rounded-lg">
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
                 <p className="text-sm text-gray-600">Download attendance data for reporting and analysis</p>
               </div>
               <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <label className="flex items-center space-x-2">
                     <input
                       type="radio"
                       value="csv"
                       checked={exportFormat === 'csv'}
                       onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
                       className="text-blue-600 focus:ring-blue-500"
                     />
                     <FileText className="w-4 h-4 text-gray-600" />
                     <span className="text-sm text-gray-700">CSV</span>
                   </label>
                   <label className="flex items-center space-x-2">
                     <input
                       type="radio"
                       value="excel"
                       checked={exportFormat === 'excel'}
                       onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
                       className="text-blue-600 focus:ring-blue-500"
                     />
                     <FileSpreadsheet className="w-4 h-4 text-gray-600" />
                     <span className="text-sm text-gray-700">Excel</span>
                   </label>
                 </div>
                 <button
                   onClick={handleExport}
                   disabled={isExporting || filteredAttendance.length === 0}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                 >
                   {isExporting ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                       <span>Exporting...</span>
                     </>
                   ) : (
                     <>
                       <Download className="w-4 h-4" />
                       <span>Export {exportFormat.toUpperCase()}</span>
                     </>
                   )}
                 </button>
               </div>
             </div>
             {filteredAttendance.length > 0 && (
               <div className="mt-3 text-sm text-gray-600">
                 <span className="font-medium">{filteredAttendance.length}</span> records available for export
               </div>
             )}
           </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lateCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Rate</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${stats.attendanceRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{stats.attendanceRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Attendance Rate</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          {viewMode !== 'daily' && periodData && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {viewMode === 'weekly' ? 'Weekly' : 'Monthly'} Attendance Trend
              </h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {periodData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-t">
                      <div 
                        className="bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${(day.total > 0 ? (day.present + day.late) / day.total : 0) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Attendance List */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Attendance</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading attendance data...</p>
              </div>
            ) : filteredAttendance.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No attendance records found for the selected criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record) => {
                      const student = students.find(s => s.id === record.student_id);
                      return (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student?.name || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student?.email || 'No email'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.check_in || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.check_out || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.notes || 'No notes'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
