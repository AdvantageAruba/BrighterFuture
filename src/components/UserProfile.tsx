import React from 'react';
import { X, Mail, Phone, Shield, Calendar, Clock, MapPin, User, Edit } from 'lucide-react';

interface UserProfileProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrator': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'therapist': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionName = (permission: string) => {
    const permissionMap: { [key: string]: string } = {
      'all': 'Full System Access',
      'students': 'Student Management',
      'calendar': 'Calendar Access',
      'notes': 'Daily Notes',
      'therapy': 'Therapy Services',
      'assessments': 'Assessments & Forms',
      'reports': 'Reports & Analytics'
    };
    return permissionMap[permission] || permission;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Contact Information</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">{user.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium text-gray-900">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Account Information</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium text-gray-900">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium text-gray-900">{user.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium text-gray-900">#{user.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Permissions & Access</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.permissions.map((permission: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{getPermissionName(permission)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Activity Summary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-blue-700">Sessions This Month</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-green-700">Students Managed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-purple-700">Notes Created</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Created daily note for Emma Rodriguez</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Completed assessment for Michael Chen</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Scheduled therapy session</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;