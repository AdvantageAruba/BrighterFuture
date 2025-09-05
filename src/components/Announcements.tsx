import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, User, Bell } from 'lucide-react';
import { useAnnouncements } from '../hooks/useAnnouncements';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  target_audience: 'all' | 'students' | 'parents' | 'staff';
  created_at: string;
  author_id: string;
  author_name: string;
  is_active: boolean;
  updated_at: string;
  edited_at: string | null;
  edit_count: number;
}

interface AddAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onAnnouncementAdded: () => void;
  isEditMode?: boolean;
  existingAnnouncement?: Announcement | null;
  addAnnouncement: (data: any) => Promise<any>;
  updateAnnouncement: (id: number, data: any) => Promise<any>;
}

const AddAnnouncement: React.FC<AddAnnouncementProps> = ({
  isOpen,
  onClose,
  onAnnouncementAdded,
  isEditMode = false,
  existingAnnouncement = null,
  addAnnouncement,
  updateAnnouncement
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    target_audience: 'all' as 'all' | 'students' | 'parents' | 'staff',
    is_active: true
  });

  useEffect(() => {
    if (isEditMode && existingAnnouncement) {
      setFormData({
        title: existingAnnouncement.title,
        content: existingAnnouncement.content,
        priority: existingAnnouncement.priority,
        target_audience: existingAnnouncement.target_audience,
        is_active: existingAnnouncement.is_active
      });
    } else {
      setFormData({
        title: '',
        content: '',
        priority: 'medium',
        target_audience: 'all',
        is_active: true
      });
    }
  }, [isEditMode, existingAnnouncement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const announcementData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        target_audience: formData.target_audience,
        is_active: formData.is_active,
        author_name: 'System User' // This would come from auth context in a real app
      };

      let result;
      if (isEditMode && existingAnnouncement) {
        result = await updateAnnouncement(existingAnnouncement.id, announcementData);
      } else {
        result = await addAnnouncement(announcementData);
      }
      
      if (result.success) {
        alert(isEditMode ? 'Announcement updated successfully!' : 'Announcement created successfully!');
        onClose();
        onAnnouncementAdded();
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'create'} announcement: ${result.error}`);
      }
    } catch (error) {
      console.error('Error with announcement operation:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} announcement. Please try again.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Announcement' : 'Add New Announcement'}
            </h2>
            <p className="text-gray-600">
              {isEditMode ? 'Modify announcement details' : 'Create a new announcement for your community'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement title"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement content..."
              />
            </div>

            {/* Priority and Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience *
                </label>
                <select
                  id="target_audience"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="parents">Parents Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Announcement
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>{isEditMode ? 'Update Announcement' : 'Create Announcement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Announcements: React.FC = () => {
  const { announcements, loading, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementToEdit(announcement);
    setIsEditModalOpen(true);
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const result = await deleteAnnouncement(id);
      if (!result.success) {
        alert(`Failed to delete announcement: ${result.error}`);
      }
    }
  };

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

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && announcement.is_active) ||
      (filter === 'inactive' && !announcement.is_active);
    
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    
    return matchesFilter && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Manage and share important information with your community</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Announcement</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Announcements</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTargetAudienceColor(announcement.target_audience)}`}>
                        {announcement.target_audience.charAt(0).toUpperCase() + announcement.target_audience.slice(1)}
                      </span>
                      {!announcement.is_active && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3 whitespace-pre-wrap">{announcement.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{announcement.author_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(announcement.edited_at || announcement.created_at)}</span>
                      </div>
                      {announcement.edited_at && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <Edit className="w-3 h-3" />
                          <span>Edited {formatDate(announcement.edited_at)}</span>
                          {announcement.edit_count > 1 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                              {announcement.edit_count} edits
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit announcement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No announcements found</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'all' ? 'Create your first announcement to get started' : 'No announcements match your current filters'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Announcement</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      <AddAnnouncement
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAnnouncementAdded={() => {}}
        addAnnouncement={addAnnouncement}
        updateAnnouncement={updateAnnouncement}
      />

      {/* Edit Announcement Modal */}
      <AddAnnouncement
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setAnnouncementToEdit(null);
        }}
        onAnnouncementAdded={() => {}}
        isEditMode={true}
        existingAnnouncement={announcementToEdit}
        addAnnouncement={addAnnouncement}
        updateAnnouncement={updateAnnouncement}
      />
    </div>
  );
};

export default Announcements;
