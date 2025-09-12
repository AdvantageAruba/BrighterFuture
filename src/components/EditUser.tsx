import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Shield, Users, Eye, Settings, Lock, Unlock } from 'lucide-react';
import PictureUpload from './PictureUpload';
import { useUsers } from '../hooks/useUsers';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  AVAILABLE_PERMISSIONS, 
  AVAILABLE_TABS, 
  getDefaultPermissions, 
  getDefaultTabs, 
  canCustomizePermissions,
  getRoleConfig,
  getPermissionsByCategory
} from '../lib/permissions';

interface EditUserProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, isOpen, onClose, onUserUpdated }) => {
  const { userProfile: currentUserProfile, hasPermission } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user.first_name || user.name?.split(' ')[0] || '',
    lastName: user.last_name || user.name?.split(' ').slice(1).join(' ') || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role?.toLowerCase() || '',
    department: user.department || '',
    status: user.status || 'active',
    permissions: user.permissions || [],
    visibleTabs: user.visible_tabs || []
  });

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | ''>(user.program_id || '');
  const [selectedClass, setSelectedClass] = useState<string | ''>(user.class_id || '');
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [showAdvancedPermissions, setShowAdvancedPermissions] = useState(false);
  const [customPermissionsEnabled, setCustomPermissionsEnabled] = useState(false);

  // Permission checking logic
  const isEditingOwnProfile = currentUserProfile?.email === user.email;
  const canEditRole = hasPermission('user_management') && !isEditingOwnProfile;
  const canEditPermissions = hasPermission('user_management') && !isEditingOwnProfile;

  // Use the users hook
  const { updateUser, uploadUserPicture, programs, classes, fetchClasses } = useUsers();

  // Local function to fetch classes for a specific program
  const fetchClassesForProgram = async (programId: number) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('program_id', programId)
        .order('name');

      if (error) throw error;
      setAvailableClasses(data || []);
    } catch (err) {
      console.error('Failed to fetch classes for program:', err);
      setAvailableClasses([]);
    }
  };

  // Initialize classes when component mounts or when user has a program_id
  useEffect(() => {
    console.log('EditUser - Initial user data:', user);
    console.log('EditUser - Initial program_id:', user.program_id, 'Initial class_id:', user.class_id);
    
    // Update selected program and class when user data changes
    setSelectedProgram(user.program_id || '');
    setSelectedClass(user.class_id || '');
    
    if (user.program_id) {
      fetchClassesForProgram(user.program_id);
    } else {
      setAvailableClasses([]);
    }
  }, [user.program_id, user.class_id]);

  // Update permissions and tabs when role changes
  useEffect(() => {
    if (formData.role) {
      const canCustomize = canCustomizePermissions(formData.role);
      setCustomPermissionsEnabled(canCustomize);
      setShowAdvancedPermissions(false);
    }
  }, [formData.role]);

  // Get the current picture URL from the user data
  const currentPictureUrl = user.picture_url || user.avatar;

  const roles = [
    { id: 'administrator', name: 'Administrator' },
    { id: 'teacher', name: 'Teacher' },
    { id: 'therapist', name: 'Therapist' },
    { id: 'coordinator', name: 'Program Coordinator' },
    { id: 'parent', name: 'Parent/Guardian' },
    { id: 'staff', name: 'Support Staff' }
  ];

  const departments = [
    { id: 'administration', name: 'Administration' },
    { id: 'education', name: 'Education' },
    { id: 'therapy', name: 'Therapy Services' },
    { id: 'support', name: 'Support Services' },
    { id: 'external', name: 'External' }
  ];

  const statusOptions = [
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'pending', name: 'Pending' }
  ];

  // Remove the old permissions array since we're using the new permissions system

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p: string) => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleTabVisibilityChange = (tabId: string) => {
    setFormData(prev => ({
      ...prev,
      visibleTabs: prev.visibleTabs.includes(tabId)
        ? prev.visibleTabs.filter(t => t !== tabId)
        : [...prev.visibleTabs, tabId]
    }));
  };

  const resetToDefaults = () => {
    if (formData.role) {
      const defaultPermissions = getDefaultPermissions(formData.role);
      const defaultTabs = getDefaultTabs(formData.role);
      
      setFormData(prev => ({
        ...prev,
        permissions: defaultPermissions,
        visibleTabs: defaultTabs
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare user data for update
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || '',
        role: formData.role,
        department: formData.department || '',
        status: formData.status,
        permissions: formData.permissions,
        visible_tabs: formData.visibleTabs,
        program_id: selectedProgram || undefined,
        class_id: selectedClass || undefined
      };

      console.log('EditUser - Updating user with data:', updateData);
      console.log('EditUser - Selected program:', selectedProgram, 'Selected class:', selectedClass);
      console.log('EditUser - Original user program_id:', user.program_id, 'class_id:', user.class_id);

      // Update user in Supabase
      const result = await updateUser(user.id, updateData);
      
      if (result.success) {
        console.log('User updated successfully:', result.data);
        
        // Upload picture if one was selected
        if (selectedPicture) {
          const pictureResult = await uploadUserPicture(user.id, selectedPicture);
          if (!pictureResult.success) {
            console.warn('User updated but picture upload failed:', pictureResult.error);
            alert('User updated successfully, but picture upload failed. You can try again later.');
          } else {
            console.log('Picture uploaded successfully:', pictureResult.url);
            alert('User and profile picture updated successfully!');
          }
        } else {
          alert('User updated successfully!');
        }
        
        // Notify parent component that user was updated BEFORE closing
        if (onUserUpdated) {
          onUserUpdated();
        }
        
        // Close the modal after refreshing data
        onClose();
      } else {
        alert(`Failed to update user: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
            <p className="text-gray-600">Update {user.name}'s information and permissions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-6 pb-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Picture</span>
              </h3>
              <PictureUpload
                currentPicture={currentPictureUrl}
                onPictureChange={setSelectedPicture}
                size="md"
              />
            </div>

            {/* Role and Department */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Role & Department</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                    {!canEditRole && (
                      <span className="ml-2 text-xs text-red-600 font-medium">
                        {isEditingOwnProfile ? '(Cannot edit your own role)' : '(Admin only)'}
                      </span>
                    )}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={!canEditRole}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      !canEditRole ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {!canEditRole && (
                    <p className="text-xs text-gray-500 mt-1">
                      {isEditingOwnProfile 
                        ? 'You cannot change your own role for security reasons.'
                        : 'Only administrators can change user roles.'
                      }
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select department...</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Program and Class Assignment - Available for all roles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Program & Class Assignment</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Program</label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => {
                      const programId = e.target.value ? parseInt(e.target.value) : '';
                      setSelectedProgram(programId);
                      setSelectedClass(''); // Reset class when program changes
                      if (programId) {
                        fetchClassesForProgram(programId);
                      } else {
                        setAvailableClasses([]);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select program...</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={!selectedProgram}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select class...</option>
                    {availableClasses.map((classGroup) => (
                      <option key={classGroup.id} value={classGroup.id}>
                        {classGroup.name}
                      </option>
                    ))}
                  </select>
                  {!selectedProgram && (
                    <p className="text-xs text-gray-500 mt-1">Select a program first to choose a class</p>
                  )}
                </div>
              </div>
            </div>


            {/* Enhanced Permissions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Permissions & Access Control</span>
                  {!canEditPermissions && (
                    <span className="text-xs text-red-600 font-medium">
                      {isEditingOwnProfile ? '(Cannot edit your own permissions)' : '(Admin only)'}
                    </span>
                  )}
                </h3>
                {customPermissionsEnabled && canEditPermissions && (
                  <button
                    type="button"
                    onClick={() => setShowAdvancedPermissions(!showAdvancedPermissions)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{showAdvancedPermissions ? 'Hide Advanced' : 'Show Advanced'}</span>
                  </button>
                )}
              </div>

              {!canEditPermissions && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Permission Editing Restricted</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {isEditingOwnProfile 
                          ? 'You cannot edit your own permissions for security reasons. Contact an administrator if you need permission changes.'
                          : 'Only administrators can edit user permissions.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Role Information */}
              {formData.role && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {customPermissionsEnabled ? (
                        <Unlock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">
                        {getRoleConfig(formData.role)?.roleName} Role
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {getRoleConfig(formData.role)?.description}
                      </p>
                      {!customPermissionsEnabled && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          ⚠️ This role has fixed permissions for security reasons
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Visibility Control */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Navigation Tabs Visibility</span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Choose which tabs will be visible in the user's navigation menu
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {AVAILABLE_TABS.map((tab) => (
                    <div key={tab.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="checkbox"
                        id={`tab-${tab.id}`}
                        checked={formData.visibleTabs.includes(tab.id)}
                        onChange={() => handleTabVisibilityChange(tab.id)}
                        disabled={!canEditPermissions || (!customPermissionsEnabled && !getDefaultTabs(formData.role).includes(tab.id))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 disabled:opacity-50"
                      />
                      <div className="flex-1 min-w-0">
                        <label htmlFor={`tab-${tab.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                          {tab.name}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{tab.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>System Permissions</span>
                  </h4>
                  {customPermissionsEnabled && canEditPermissions && (
                    <button
                      type="button"
                      onClick={resetToDefaults}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Reset to Defaults
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Configure what actions and features the user can access
                </p>

                {/* Permission Categories */}
                {['management', 'access', 'system', 'communication'].map((category) => {
                  const categoryPermissions = getPermissionsByCategory(category);
                  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                  
                  return (
                    <div key={category} className="mb-6">
                      <h5 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                        {categoryName} Permissions
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <input
                              type="checkbox"
                              id={`perm-${permission.id}`}
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => handlePermissionChange(permission.id)}
                              disabled={!canEditPermissions || (!customPermissionsEnabled && !getDefaultPermissions(formData.role).includes(permission.id))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 disabled:opacity-50"
                            />
                            <div className="flex-1 min-w-0">
                              <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                                {permission.name}
                              </label>
                              <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Advanced Permissions Toggle */}
              {customPermissionsEnabled && showAdvancedPermissions && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Advanced Permission Settings</h4>
                  <p className="text-sm text-yellow-700">
                    Custom permissions are enabled for this role. You can modify the default permissions 
                    to create a tailored access profile for this user.
                  </p>
                </div>
              )}
            </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Update User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;