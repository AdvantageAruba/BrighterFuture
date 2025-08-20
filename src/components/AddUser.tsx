import React, { useState } from 'react';
import { X, Save, User, Mail, Phone, Shield, Link, Copy, Check } from 'lucide-react';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    permissions: [] as string[],
    sendInvite: true
  });

  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

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

  const permissions = [
    { id: 'students', name: 'Student Management' },
    { id: 'calendar', name: 'Calendar Access' },
    { id: 'forms', name: 'Forms & Assessments' },
    { id: 'notes', name: 'Daily Notes' },
    { id: 'attendance', name: 'Attendance Tracking' },
    { id: 'reports', name: 'Reports & Analytics' },
    { id: 'settings', name: 'System Settings' },
    { id: 'programs', name: 'Program Management' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInviteLink = generateInviteLink();
    console.log('New user data:', formData);
    console.log('Invite link generated:', newInviteLink);
    
    alert(`User created successfully! ${formData.sendInvite ? 'Invite link generated.' : ''}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
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
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={permission.id} className="text-sm text-gray-700">
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
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

                {inviteLink && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Invitation Link Generated</h4>
                        <p className="text-sm text-blue-700 mt-1 break-all">{inviteLink}</p>
                      </div>
                      <button
                        type="button"
                        onClick={copyInviteLink}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
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