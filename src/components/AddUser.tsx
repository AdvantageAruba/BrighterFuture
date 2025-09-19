import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Shield, Link, Copy, Check, Users, Eye, EyeOff, Settings, Lock, Unlock } from 'lucide-react';
import PictureUpload from './PictureUpload';
import GranularPermissionsManager from './GranularPermissionsManager';
import { useUsers } from '../hooks/useUsers';
import { 
  AVAILABLE_PERMISSIONS, 
  AVAILABLE_TABS, 
  getDefaultPermissions, 
  getDefaultPermissionsSync,
  getDefaultTabs, 
  getDefaultTabsSync,
  canCustomizePermissions,
  getRoleConfig,
  getPermissionsByCategory,
  Permission,
  TabVisibility,
  unflattenGranularPermissions,
  getDefaultGranularPermissions
} from '../lib/permissions';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded?: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    sendInvite: false,
    permissions: [] as string[],
    visibleTabs: [] as string[]
  });

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | ''>('');
  const [selectedClass, setSelectedClass] = useState<string | ''>('');
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [granularPermissions, setGranularPermissions] = useState<Record<string, string[]>>({});

  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showAdvancedPermissions, setShowAdvancedPermissions] = useState(false);
  const [customPermissionsEnabled, setCustomPermissionsEnabled] = useState(false);

  // Use the users hook
  const { addUser, uploadUserPicture, programs, classes, students, fetchClasses } = useUsers();

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

  // Remove the old permissions array since we're using the new permissions system

  if (!isOpen) return null;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        sendInvite: false,
        permissions: [],
        visibleTabs: []
      });
      setSelectedPicture(null);
      setSelectedProgram('');
      setSelectedClass('');
      setSelectedChildren([]);
      setInviteLink('');
      setLinkCopied(false);
      setEmailError('');
      setShowAdvancedPermissions(false);
      setCustomPermissionsEnabled(false);
    }
  }, [isOpen]);

  // Update permissions and tabs when role changes
  useEffect(() => {
    const updateRoleDefaults = async () => {
      if (formData.role) {
        const defaultPermissions = await getDefaultPermissions(formData.role);
        const defaultTabs = await getDefaultTabs(formData.role);
        const canCustomize = canCustomizePermissions(formData.role);
        const defaultGranularPermissions = getDefaultGranularPermissions(formData.role);
        
        setFormData(prev => ({
          ...prev,
          permissions: defaultPermissions,
          visibleTabs: defaultTabs
        }));
        
        setGranularPermissions(defaultGranularPermissions);
        setCustomPermissionsEnabled(canCustomize);
        setShowAdvancedPermissions(false);
      }
    };

    updateRoleDefaults();
  }, [formData.role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      email: value
    }));
    
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
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
      const defaultPermissions = getDefaultPermissionsSync(formData.role);
      const defaultTabs = getDefaultTabsSync(formData.role);
      
      setFormData(prev => ({
        ...prev,
        permissions: defaultPermissions,
        visibleTabs: defaultTabs
      }));
    }
  };

  const handleChildSelection = (childId: number) => {
    setSelectedChildren(prev => 
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const generateInviteLink = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `https://brighterfuture.edu/invite/${token}`;
    setInviteLink(link);
    return link;
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      // Prepare user data for Supabase
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || '',
        role: formData.role,
        department: formData.role === 'parent' ? '' : (formData.department || ''), // No department for parents
        status: 'active',
        permissions: formData.permissions,
        granular_permissions: granularPermissions,
        visible_tabs: formData.visibleTabs, // Add visible tabs to user data
        program_id: formData.role === 'parent' ? undefined : (selectedProgram || undefined), // No program for parents
        class_id: formData.role === 'parent' ? undefined : (selectedClass || undefined), // No class for parents
        children_ids: formData.role === 'parent' ? selectedChildren : undefined // Only for parents
      };

      // Save user to Supabase with invitation
      const result = await addUser(userData, formData.sendInvite);
      
      if (result.success) {
        console.log('User added successfully:', result.data);
        
        // Upload picture if one was selected
        if (selectedPicture && result.data) {
          const pictureResult = await uploadUserPicture(result.data.id, selectedPicture);
          if (!pictureResult.success) {
            console.warn('User created but picture upload failed:', pictureResult.error);
            alert('User created successfully, but picture upload failed. You can add a picture later.');
          } else {
            console.log('Picture uploaded successfully:', pictureResult.url);
          }
        }
        
        const newInviteLink = generateInviteLink();
        let successMessage = `User created successfully! ${formData.sendInvite ? 'Invitation email sent with temporary password.' : ''} ${selectedPicture ? 'Profile picture uploaded.' : ''}`;
        
        // Add message about automatic teacher assignment if applicable
        if (formData.role === 'teacher' && selectedProgram && selectedClass) {
          successMessage += ' Teacher has been automatically assigned to the selected class.';
        }
        
        // Add message about children assignment if applicable
        if (formData.role === 'parent' && selectedChildren.length > 0) {
          successMessage += ` Parent has been linked to ${selectedChildren.length} child(ren).`;
        }
        
        // Add invitation details if invitation was sent
        if (formData.sendInvite && result.data) {
          successMessage += ` Temporary password: ${result.data.temporary_password}`;
        }
        
        alert(successMessage);
        
        // Close the modal after successful creation
        onClose();
        
        // Notify parent component that user was added
        if (onUserAdded) {
          onUserAdded();
        }
      } else {
        alert(`Failed to create user: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
            <p className="text-gray-600">Create a new user account and send invitation</p>
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
                    onChange={handleEmailChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="user@example.com"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={formData.role === 'parent'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">Select department...</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {formData.role === 'parent' && (
                    <p className="text-xs text-gray-500 mt-1">Department not applicable for parents</p>
                  )}
                </div>
              </div>
            </div>

            {/* Program and Class Assignment */}
            {(formData.role === 'teacher' || formData.role === 'therapist' || formData.role === 'coordinator') && (
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
                          fetchClasses(programId);
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
                      {classes.map((classGroup) => (
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
            )}

            {/* Children Selection for Parents */}
            {formData.role === 'parent' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Children Selection</span>
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Select which children this parent/guardian is responsible for. They will only be able to view and edit information for the selected children.
                  </p>
                  {students.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No students found. Please add students first before creating parent accounts.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`child-${student.id}`}
                            checked={selectedChildren.includes(student.id)}
                            onChange={() => handleChildSelection(student.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`child-${student.id}`} className="text-sm text-gray-700 cursor-pointer">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-gray-500">
                              {student.date_of_birth ? `Age: ${Math.floor((new Date().getTime() - new Date(student.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years` : 'Age not specified'}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedChildren.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Selected children:</strong> {selectedChildren.length} child(ren) selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Permissions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Permissions & Access Control</span>
                </h3>
                {customPermissionsEnabled && (
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
                        disabled={!customPermissionsEnabled && !getDefaultTabsSync(formData.role).includes(tab.id)}
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
                  {customPermissionsEnabled && (
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

                {/* Granular Permissions */}
                <GranularPermissionsManager
                  permissions={formData.permissions}
                  onPermissionsChange={(newPermissions) => {
                    const granularPermissions = unflattenGranularPermissions(newPermissions);
                    setFormData(prev => ({
                      ...prev,
                      permissions: newPermissions
                    }));
                    setGranularPermissions(granularPermissions);
                  }}
                  role={formData.role}
                  disabled={!customPermissionsEnabled}
                />
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

            {/* Invitation Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Invitation</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="sendInvite"
                    checked={formData.sendInvite}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Send invitation email to user
                  </label>
                </div>

                {formData.sendInvite && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Invitation Details</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• A temporary password will be generated</li>
                      <li>• An invitation email will be sent to {formData.email || 'the user'}</li>
                      <li>• The user must change their password on first login</li>
                      <li>• Invitation link expires in 7 days</li>
                    </ul>
                  </div>
                )}

                {inviteLink && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-900">Invitation Link Generated</h4>
                        <p className="text-sm text-green-700 mt-1 break-all">{inviteLink}</p>
                      </div>
                      <button
                        type="button"
                        onClick={copyInviteLink}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{linkCopied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              <span>Create User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;