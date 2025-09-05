import React, { useState } from 'react';
import { X, Save, Edit, User, Mail, Phone, MapPin, Building, Shield, Camera } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';

interface UserProfileProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onUpdateUser?: (id: number, updates: any) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOpen, onClose, onEdit, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Get programs and classes data to show names instead of IDs
  const { programs, classes, getProgramName, getClassName } = useUsers();
  
  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    department: user.department || '',
    role: user.role,
    status: user.status || 'active',
    permissions: user.permissions || [],
    program_id: user.program_id || null,
    class_id: user.class_id || null,
    picture_url: user.picture_url || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (onUpdateUser && user.id) {
        // Prepare the updates object
        const updates = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          role: formData.role,
          status: formData.status,
          permissions: formData.permissions,
          program_id: formData.program_id,
          class_id: formData.class_id,
          picture_url: formData.picture_url
        };

        // Call the update function
        const result = await onUpdateUser(user.id, updates);
        
        // Update local form data to reflect changes
        setFormData(prev => ({ ...prev, ...formData }));
        
        setIsEditing(false);
      } else {
        console.error('Update function not available');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      role: user.role,
      status: user.status || 'active',
      permissions: user.permissions || [],
      program_id: user.program_id || null,
      class_id: user.class_id || null,
      picture_url: user.picture_url || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-2">Manage user account information and preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white rounded-t-lg">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={formData.picture_url}
                  alt={`${formData.firstName} ${formData.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-transparent border-b-2 border-white/30 focus:border-white focus:outline-none text-white placeholder-white/70"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-transparent border-b-2 border-white/30 focus:border-white focus:outline-none text-white placeholder-white/70"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold">{formData.firstName} {formData.lastName}</h2>
                )}
                <p className="text-xl text-white/90 mt-2 capitalize">{formData.role}</p>
                <p className="text-white/80 mt-1">{formData.department}</p>
                <p className="text-white/70 mt-1 capitalize">Status: {formData.status}</p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white border border-gray-200 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{formData.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{formData.phone || 'Not provided'}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{formData.status}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Professional Information</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.department || 'Not assigned'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    {isEditing ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="administrator">Administrator</option>
                        <option value="teacher">Teacher</option>
                        <option value="therapist">Therapist</option>
                        <option value="coordinator">Program Coordinator</option>
                        <option value="parent">Parent/Guardian</option>
                        <option value="staff">Support Staff</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{formData.role}</span>
                      </p>
                    )}
                  </div>

                  {/* Program and Class Assignment - Available for all roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Program</label>
                    {isEditing ? (
                      <select
                        name="program_id"
                        value={formData.program_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select program...</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {formData.program_id ? getProgramName(formData.program_id) : 'Not assigned'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Class</label>
                    {isEditing ? (
                      <select
                        name="class_id"
                        value={formData.class_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select class...</option>
                        {classes.map((classGroup) => (
                          <option key={classGroup.id} value={classGroup.id}>
                            {classGroup.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {formData.class_id ? getClassName(formData.class_id) : 'Not assigned'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.permissions.length > 0 ? (
                        formData.permissions.map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {permission}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No specific permissions assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="border-t border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  Notification Preferences
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;