import React, { useState, useEffect } from 'react';
import { Mail, Send, Search, Filter, Trash2, Eye, EyeOff, User, Clock, Check, CheckCheck } from 'lucide-react';
import { useMessages, Message } from '../hooks/useMessages';
import { useUsers } from '../hooks/useUsers';
import SendMessage from './SendMessage';

const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);

  const { 
    messages, 
    loading, 
    error, 
    markAsRead, 
    deleteMessage, 
    getInboxMessages, 
    getSentMessages,
    getUnreadCount 
  } = useMessages();

  const { users } = useUsers();

  // Mark message as read when selected
  useEffect(() => {
    if (selectedMessage && !selectedMessage.is_read && activeTab === 'inbox') {
      markAsRead(selectedMessage.id);
    }
  }, [selectedMessage, activeTab, markAsRead]);

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    }
  };

  const handleSendMessage = () => {
    setIsSendModalOpen(true);
  };

  const handleMessageSent = () => {
    setIsSendModalOpen(false);
  };

  const filteredMessages = () => {
    let filtered = activeTab === 'inbox' ? getInboxMessages() : getSentMessages();
    
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterUnread && activeTab === 'inbox') {
      filtered = filtered.filter(msg => !msg.is_read);
    }
    
    return filtered;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    if (activeTab === 'sent') {
      if (message.is_read) {
        return <CheckCheck className="w-4 h-4 text-blue-600" title="Read" />;
      } else {
        return <Check className="w-4 h-4 text-gray-400" title="Sent" />;
      }
    } else {
      if (!message.is_read) {
        return <div className="w-2 h-2 bg-blue-600 rounded-full" title="Unread" />;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-gray-600">Communicate with your team members</p>
        </div>
        <button
          onClick={handleSendMessage}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Send className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {activeTab === 'inbox' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterUnread}
                  onChange={(e) => setFilterUnread(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show unread only</span>
              </label>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'inbox'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inbox ({getUnreadCount()})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'sent'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sent
            </button>
          </div>

          {/* Messages List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMessages().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages().map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageSelect(message)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedMessage?.id === message.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${!message.is_read && activeTab === 'inbox' ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium truncate ${
                          !message.is_read && activeTab === 'inbox' ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {activeTab === 'inbox' ? message.sender_name : message.recipient_name}
                        </h3>
                        {getMessageStatusIcon(message)}
                      </div>
                      <p className={`text-sm truncate ${
                        !message.is_read && activeTab === 'inbox' ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>
                        {activeTab === 'inbox' ? 'From' : 'To'}: {activeTab === 'inbox' ? selectedMessage.sender_name : selectedMessage.recipient_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(selectedMessage.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activeTab === 'inbox' && !selectedMessage.is_read && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Unread
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-600">Choose a message from the list to view its content</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Message Modal */}
      <SendMessage
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onMessageSent={handleMessageSent}
        users={users}
      />
    </div>
  );
};

export default Messages;

