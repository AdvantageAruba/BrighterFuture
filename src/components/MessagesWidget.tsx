import React from 'react';
import { Mail, Send, Clock, User } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';

interface MessagesWidgetProps {
  setActiveTab: (tab: string) => void;
}

const MessagesWidget: React.FC<MessagesWidgetProps> = ({ setActiveTab }) => {
  const { messages, loading, getInboxMessages, getUnreadCount } = useMessages();

  const inboxMessages = getInboxMessages();
  const unreadCount = getUnreadCount();
  const recentMessages = inboxMessages.slice(0, 3); // Show only the 3 most recent messages

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleViewAllMessages = () => {
    setActiveTab('messages');
  };

  const handleComposeMessage = () => {
    setActiveTab('messages');
    // In a real app, you might also trigger opening the compose modal
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={handleComposeMessage}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Send className="w-4 h-4" />
          <span>Compose</span>
        </button>
      </div>

      {recentMessages.length === 0 ? (
        <div className="text-center py-6">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No messages yet</p>
          <button
            onClick={handleComposeMessage}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
          >
            Send your first message
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentMessages.map((message) => (
            <div
              key={message.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={handleViewAllMessages}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium truncate ${
                    !message.is_read ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {message.sender_name}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                </div>
                <p className={`text-sm truncate ${
                  !message.is_read ? 'text-gray-900 font-medium' : 'text-gray-600'
                }`}>
                  {message.subject}
                </p>
                {!message.is_read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                )}
              </div>
            </div>
          ))}
          
          {inboxMessages.length > 3 && (
            <button
              onClick={handleViewAllMessages}
              className="w-full text-center py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border-t border-gray-200 pt-3"
            >
              View all {inboxMessages.length} messages
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesWidget;

