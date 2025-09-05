import React from 'react';
import { Bell, Plus, Clock, User, Edit } from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';

interface AnnouncementsWidgetProps {
  setActiveTab: (tab: string) => void;
}

const AnnouncementsWidget: React.FC<AnnouncementsWidgetProps> = ({ setActiveTab }) => {
  const { announcements, loading } = useAnnouncements();

  // Get recent active announcements (last 5)
  const recentAnnouncements = announcements
    .filter(announcement => announcement.is_active)
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTargetAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'text-blue-600 bg-blue-100';
      case 'students': return 'text-purple-600 bg-purple-100';
      case 'parents': return 'text-orange-600 bg-orange-100';
      case 'staff': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
            <p className="text-sm text-gray-600">Latest updates and important information</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('announcements')}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recentAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {recentAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setActiveTab('announcements')}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {truncateText(announcement.title, 50)}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTargetAudienceColor(announcement.target_audience)}`}>
                    {announcement.target_audience.charAt(0).toUpperCase() + announcement.target_audience.slice(1)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {truncateText(announcement.content, 120)}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{announcement.author_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(announcement.edited_at || announcement.created_at)}</span>
                  </div>
                  {announcement.edited_at && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Edit className="w-3 h-3" />
                      <span>Edited</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm font-medium">No announcements yet</p>
          <p className="text-gray-400 text-xs mt-1">Create your first announcement to get started</p>
          <button
            onClick={() => setActiveTab('announcements')}
            className="mt-3 px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Announcement
          </button>
        </div>
      )}

      {recentAnnouncements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('announcements')}
            className="w-full text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
          >
            View all announcements ({announcements.filter(a => a.is_active).length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsWidget;
