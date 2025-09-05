import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, TrendingUp, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import UpcomingEvents from './UpcomingEvents';
import AnnouncementsWidget from './AnnouncementsWidget';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { useDailyNotes } from '../hooks/useDailyNotes';
import { useEvents } from '../hooks/useEvents';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { students, programs, loading: studentsLoading } = useStudents();
  const { attendance, loading: attendanceLoading } = useAttendance();
  const { dailyNotes, loading: notesLoading } = useDailyNotes();
  const { events, loading: eventsLoading } = useEvents();

  const [stats, setStats] = useState([
    {
      title: 'Total Students',
      value: '0',
      change: 'Loading...',
      icon: Users,
      color: 'blue' as const,
      onClick: () => setActiveTab('students')
    },
    {
      title: 'Today\'s Events',
      value: '0',
      change: 'Loading...',
      icon: Calendar,
      color: 'green' as const,
      onClick: () => setActiveTab('calendar')
    },
    {
      title: 'Pending Assessments',
      value: '0',
      change: 'Loading...',
      icon: FileText,
      color: 'orange' as const,
      onClick: () => setActiveTab('forms')
    },
    {
      title: 'New Notes',
      value: '0',
      change: 'Loading...',
      icon: MessageSquare,
      color: 'purple' as const,
      onClick: () => setActiveTab('dailynotes')
    },
    {
      title: 'Pending Intakes',
      value: '0',
      change: 'Loading...',
      icon: FileText,
      color: 'orange' as const,
      onClick: () => setActiveTab('forms')
    }
  ]);

  // Update stats when data loads
  useEffect(() => {
    if (!studentsLoading && !attendanceLoading && !notesLoading && !eventsLoading) {
      const today = new Date().toISOString().split('T')[0];
      const todayNotes = dailyNotes.filter(note => note.date === today);
      const todayAttendance = attendance.filter(record => record.date === today);
      const todaysEvents = events.filter(event => event.date === today);
      const activeStudentsCount = students.filter(student => student.status === 'active').length;
      
      setStats([
        {
          title: 'Total Students',
          value: students.length.toString(),
          change: `${activeStudentsCount} active`,
          icon: Users,
          color: 'blue' as const,
          onClick: () => setActiveTab('students')
        },
        {
          title: 'Today\'s Events',
          value: todaysEvents.length.toString(),
          change: `${todaysEvents.filter(e => e.priority === 'high').length} high priority`,
          icon: Calendar,
          color: 'green' as const,
          onClick: () => setActiveTab('calendar')
        },
        {
          title: 'Pending Assessments',
          value: '0', // Will be updated when forms are implemented
          change: 'Needs attention',
          icon: FileText,
          color: 'orange' as const,
          onClick: () => setActiveTab('forms')
        },
        {
          title: 'Today\'s Notes',
          value: todayNotes.length.toString(),
          change: 'New today',
          icon: MessageSquare,
          color: 'purple' as const,
          onClick: () => setActiveTab('dailynotes')
        },
        {
          title: 'Pending Intakes',
          value: '0', // Will be updated when forms are implemented
          change: 'Awaiting completion',
          icon: FileText,
          color: 'orange' as const,
          onClick: () => setActiveTab('forms')
        }
      ]);
    }
  }, [students, attendance, dailyNotes, events, studentsLoading, attendanceLoading, notesLoading, eventsLoading]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-student':
        setActiveTab('students');
        // In a real app, you might also set a flag to open the add student form
        break;
      case 'schedule-session':
        setActiveTab('calendar');
        break;
      case 'create-assessment':
        setActiveTab('forms');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at Brighter Future today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} onClick={stat.onClick} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity setActiveTab={setActiveTab} />
        </div>
        <div className="space-y-8">
          <UpcomingEvents setActiveTab={setActiveTab} />
          <AnnouncementsWidget setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Distribution</h3>
          <div className="space-y-4">
            {(() => {
              // Calculate program distribution from students
              const programCounts = students.reduce((acc, student) => {
                // Find the program name by program_id
                const program = programs.find(p => p.id === student.program_id);
                const programName = program ? program.name : `Program ${student.program_id}`;
                acc[programName] = (acc[programName] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              const totalStudents = students.length;
              const activeStudents = students.filter(s => s.status === 'active').length;
              const inactiveStudents = totalStudents - activeStudents;

              return (
                <>
                  {Object.entries(programCounts).map(([program, count]) => {
                    const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                    return (
                      <div key={program} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{program}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                  {inactiveStudents > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Inactive Students</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${(inactiveStudents / totalStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{inactiveStudents}</span>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('add-student')}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Add New Student</span>
            </button>
            <button 
              onClick={() => handleQuickAction('schedule-session')}
              className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Schedule Session</span>
            </button>
            <button 
              onClick={() => handleQuickAction('create-assessment')}
              className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Create Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;