import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users, Check, X, Save } from 'lucide-react';

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrator',
      description: 'Full access to all features and data',
      users: 3,
      permissions: ['all'],
      color: 'red',
      isSystem: true
    },
    {
      id: 2,
      name: 'Teacher',
      description: 'Access to assigned students and basic calendar features',
      users: 12,
      permissions: ['students', 'calendar', 'notes', 'attendance'],
      color: 'blue',
      isSystem: true
    },
    {
      id: 3,
      name: 'Therapist',
      description: 'Access to therapy students and session management',
      users: 8,
      permissions: ['students', 'therapy', 'assessments', 'calendar', 'notes'],
      color: 'green',
      isSystem: true
    },
    {
      id: 4,
      name: 'Parent',
      description: 'Limited access to own child\'s information and progress',
      users: 45,
      permissions: ['view_child', 'messages', 'calendar_view'],
      color: 'purple',
      isSystem: false
    },
    {
      id: 5,
      name: 'Program Coordinator',
      description: 'Manage specific programs and their students',
      users: 5,
      permissions: ['students', 'programs', 'calendar', 'reports', 'notes'],
      color: 'orange',
      isSystem: false
    }
  ]);

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

  const allPermissions = [
    { id: 'all', name: 'Full System Access', category: 'System' },
    { id: 'students', name: 'Student Management', category: 'Core' },
    { id: 'calendar', name: 'Calendar Access', category: 'Core' },
    { id: 'forms', name: 'Forms & Assessments', category: 'Core' },
    { id: 'notes', name: 'Daily Notes', category: 'Core' },
    { id: 'attendance', name: 'Attendance Tracking', category: 'Core' },
    { id: 'therapy', name: 'Therapy Services', category: 'Specialized' },
    { id: 'assessments', name: 'Assessment Management', category: 'Specialized' },
    { id: 'programs', name: 'Program Management', category: 'Management' },
    { id: 'reports', name: 'Reports & Analytics', category: 'Management' },
    { id: 'settings', name: 'System Settings', category: 'Management' },
    { id: 'user_management', name: 'User Management', category: 'Management' },
    { id: 'view_child', name: 'View Own Child Info', category: 'Parent' },
    { id: 'messages', name: 'Messaging System', category: 'Communication' },
    { id: 'calendar_view', name: 'Calendar View Only', category: 'Limited' }
  ];

  const getRoleColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getPermissionName = (permissionId: string) => {
    const permission = allPermissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setIsEditRoleOpen(true);
  };

  const handleDeleteRole = (role: any) => {
    if (role.isSystem) {
      alert('System roles cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete the ${role.name} role? This will affect ${role.users} users.`)) {
      setRoles(roles.filter(r => r.id !== role.id));
      alert('Role deleted successfully!');
    }
  };

  const AddRoleModal = () => {
    const [newRole, setNewRole] = useState({
      name: '',
      description: '',
      permissions: [] as string[],
      color: 'blue'
    });

    const handlePermissionToggle = (permissionId: string) => {
      setNewRole(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const role = {
        id: Date.now(),
        ...newRole,
        users: 0,
        isSystem: false
      };
      setRoles([...roles, role]);
      setIsAddRoleOpen(false);
      alert('Role created successfully!');
    };

    if (!isAddRoleOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Create New Role</h2>
            <button onClick={() => setIsAddRoleOpen(false)}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={newRole.color}
                  onChange={(e) => setNewRole({...newRole, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
                <div className="space-y-4">
                  {['Core', 'Specialized', 'Management', 'Communication', 'Parent', 'Limited'].map(category => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allPermissions.filter(p => p.category === category).map(permission => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newRole.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{permission.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button type="button" onClick={() => setIsAddRoleOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Cancel
              </button>
              <button type="submit" className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Save className="w-4 h-4" />
                <span>Create Role</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditRoleModal = () => {
    const [roleData, setRoleData] = useState(
      editingRole ? {
        name: editingRole.name,
        description: editingRole.description,
        permissions: [...editingRole.permissions],
        color: editingRole.color
      } : {
        name: '',
        description: '',
        permissions: [] as string[],
        color: 'blue'
      }
    );

    const handlePermissionToggle = (permissionId: string) => {
      setRoleData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...roleData }
          : role
      ));
      setIsEditRoleOpen(false);
      setEditingRole(null);
      alert('Role updated successfully!');
    };

    if (!isEditRoleOpen || !editingRole) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Edit Role - {editingRole.name}</h2>
            <button onClick={() => {
              setIsEditRoleOpen(false);
              setEditingRole(null);
            }}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {editingRole.isSystem && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is a system role. Some changes may be restricted to maintain system integrity.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  value={roleData.name}
                  onChange={(e) => setRoleData({...roleData, name: e.target.value})}
                  required
                  disabled={editingRole.isSystem}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={roleData.description}
                  onChange={(e) => setRoleData({...roleData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={roleData.color}
                  onChange={(e) => setRoleData({...roleData, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
                <div className="space-y-4">
                  {['System', 'Core', 'Specialized', 'Management', 'Communication', 'Parent', 'Limited'].map(category => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {allPermissions.filter(p => p.category === category).map(permission => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={roleData.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              disabled={editingRole.isSystem && permission.id === 'all'}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                            />
                            <span className="text-sm text-gray-700">{permission.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {editingRole.users > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Impact:</strong> This role is currently assigned to {editingRole.users} user(s). 
                    Changes will affect their access permissions immediately.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button type="button" onClick={() => {
                setIsEditRoleOpen(false);
                setEditingRole(null);
              }} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Cancel
              </button>
              <button type="submit" className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Save className="w-4 h-4" />
                <span>Update Role</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Role Permissions</h3>
        <button 
          onClick={() => setIsAddRoleOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className={`border-2 rounded-lg p-6 ${getRoleColor(role.color)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600">{role.users} users</p>
                  {role.isSystem && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">System Role</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditRole(role)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {!role.isSystem && (
                  <button 
                    onClick={() => handleDeleteRole(role)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">{role.description}</p>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Permissions:</h5>
              <div className="space-y-1">
                {role.permissions.slice(0, 4).map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-700">{getPermissionName(permission)}</span>
                  </div>
                ))}
                {role.permissions.length > 4 && (
                  <div className="text-xs text-gray-500">
                    +{role.permissions.length - 4} more permissions
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddRoleModal />
      <EditRoleModal />
    </div>
  );
};

export default PermissionsManagement;