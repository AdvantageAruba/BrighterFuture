import React from 'react';
import { FileText, Users, Calendar, MessageSquare } from 'lucide-react';

interface RecentActivityProps {
  setActiveTab: (tab: string) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ setActiveTab }) => {
  const activities = [
    {
      id: 1,
      type: 'assessment',
      icon: FileText,
      title: 'New assessment completed',
      description: 'Emma Rodriguez - Speech Therapy Evaluation',
      time: '2 hours ago',
      color: 'text-blue-600',
      navigateTo: 'forms'
    },
    {
      id: 2,
      type: 'student',
      icon: Users,
      title: 'Student enrolled',
      description: 'Michael Chen joined First Steps program',
      time: '4 hours ago',
      color: 'text-green-600',
      navigateTo: 'students'
    },
    {
      id: 3,
      type: 'session',
      icon: Calendar,
      title: 'Therapy session scheduled',
      description: 'Individual session with Alex Thompson',
      time: '6 hours ago',
      color: 'text-purple-600',
      navigateTo: 'calendar'
    },
    {
      id: 4,
      type: 'note',
      icon: MessageSquare,
      title: 'Teacher note added',
      description: 'Progress update for Isabella Garcia',
      time: '1 day ago',
      color: 'text-orange-600',
      navigateTo: 'dailynotes'
    }
  ];

  const handleActivityClick = (navigateTo: string) => {
    setActiveTab(navigateTo);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer"
              onClick={() => handleActivityClick(activity.navigateTo)}
            >
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;