import React from 'react';
import { Users, Calendar, FileText, TrendingUp, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import UpcomingEvents from './UpcomingEvents';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const stats = [
    {
      title: 'Total Students',
      value: '4',
      change: '+12 this month',
      icon: Users,
      color: 'blue',
      onClick: () => setActiveTab('students')
    },
    {
      title: 'Active Students',
      value: '3',
      change: '75% of total',
      icon: Users,
      color: 'green',
      onClick: () => setActiveTab('students')
    },
    {
      title: 'Upcoming Sessions',
      value: '34',
      change: 'Today',
      icon: Calendar,
      color: 'green',
      onClick: () => setActiveTab('calendar')
    },
    {
      title: 'Pending Assessments',
      value: '18',
      change: 'Needs attention',
      icon: FileText,
      color: 'orange',
      onClick: () => setActiveTab('forms')
    },
    {
      title: 'New Notes',
      value: '12',
      change: 'Today',
      icon: MessageSquare,
      color: 'purple',
      onClick: () => setActiveTab('dailynotes')
    },
    {
      title: 'Pending Intakes',
      value: '8',
      change: 'Awaiting completion',
      icon: FileText,
      color: 'orange',
      onClick: () => setActiveTab('forms')
    }
  ];

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
        <div>
          <UpcomingEvents setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Brighter Future Academy</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">2</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">First Steps</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Individual Therapy</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">1</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inactive Students</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">1</span>
              </div>
            </div>
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