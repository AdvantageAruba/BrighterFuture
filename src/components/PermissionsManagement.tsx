import React, { useState, useEffect } from 'react';
import { Shield, Users, Check, X, Save, Edit, Lock, Eye, Settings, Calendar, BookOpen, FileText, BarChart3, UserCheck } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { supabase } from '../lib/supabase';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { users } = useUsers();

  // Define all available permissions
  const allPermissions: Permission[] = [
    // System Permissions
    { id: 'system_admin', name: 'System Administration', description: 'Full system access and configuration', category: 'System', icon: <Settings className="w-4 h-4" /> },
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and manage user accounts', category: 'System', icon: <Users className="w-4 h-4" /> },
    
    // Core Permissions
    { id: 'students', name: 'Student Management', description: 'View, add, edit, and delete student records', category: 'Core', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'calendar', name: 'Calendar Access', description: 'View and manage calendar events and schedules', category: 'Core', icon: <Calendar className="w-4 h-4" /> },
    { id: 'attendance', name: 'Attendance Tracking', description: 'Mark and view student attendance', category: 'Core', icon: <Check className="w-4 h-4" /> },
    { id: 'notes', name: 'Daily Notes', description: 'Create and view daily notes for students', category: 'Core', icon: <FileText className="w-4 h-4" /> },
    
    // Program Management
    { id: 'programs', name: 'Program Management', description: 'Create and manage educational programs', category: 'Programs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'classes', name: 'Class Management', description: 'Manage classes and student assignments', category: 'Programs', icon: <Users className="w-4 h-4" /> },
    
    // Assessment & Forms
    { id: 'forms', name: 'Forms & Assessments', description: 'Create and manage assessment forms', category: 'Assessment', icon: <FileText className="w-4 h-4" /> },
    { id: 'therapy', name: 'Therapy Services', description: 'Access to therapy-specific features', category: 'Assessment', icon: <Shield className="w-4 h-4" /> },
    
    // Reporting & Analytics
    { id: 'reports', name: 'Reports & Analytics', description: 'Generate and view system reports', category: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    
    // Parent-Specific Permissions
    { id: 'view_child', name: 'View Own Child', description: 'View information for assigned children only', category: 'Parent', icon: <Eye className="w-4 h-4" /> },
    { id: 'edit_child', name: 'Edit Own Child', description: 'Edit information for assigned children only', category: 'Parent', icon: <Edit className="w-4 h-4" /> },
    
    // Communication
    { id: 'messages', name: 'Messaging System', description: 'Send and receive messages', category: 'Communication', icon: <FileText className="w-4 h-4" /> },
  ];

  // Define default roles with their permissions
  const defaultRoles: Role[] = [
    {
      id: 'administrator',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      color: 'red',
      permissions: ['system_admin', 'user_management', 'students', 'calendar', 'attendance', 'notes', 'programs', 'classes', 'forms', 'therapy', 'reports'],
      userCount: 0,
      isSystem: true
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Access to assigned students and classroom management',
      color: 'blue',
      permissions: ['students', 'calendar', 'attendance', 'notes', 'classes', 'forms'],
      userCount: 0,
      isSystem: true
    },
    {
      id: 'therapist',
      name: 'Therapist',
      description: 'Access to therapy students and assessment tools',
      color: 'green',
      permissions: ['students', 'calendar', 'notes', 'forms', 'therapy'],
      userCount: 0,
      isSystem: true
    },
    {
      id: 'coordinator',
      name: 'Program Coordinator',
      description: 'Manage programs and oversee multiple classes',
      color: 'orange',
      permissions: ['students', 'calendar', 'attendance', 'notes', 'programs', 'classes', 'forms', 'reports'],
      userCount: 0,
      isSystem: true
    },
    {
      id: 'parent',
      name: 'Parent/Guardian',
      description: 'Limited access to own children\'s information',
      color: 'purple',
      permissions: ['view_child', 'edit_child', 'messages'],
      userCount: 0,
      isSystem: true
    },
    {
      id: 'staff',
      name: 'Support Staff',
      description: 'Basic access for administrative support',
      color: 'gray',
      permissions: ['calendar', 'notes'],
      userCount: 0,
      isSystem: true
    }
  ];

  // Load roles and user counts
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        
        // Count users for each role
        const roleCounts = defaultRoles.map(role => {
          const count = users.filter(user => user.role === role.id).length;
          return { ...role, userCount: count };
        });
        
        setRoles(roleCounts);
      } catch (error) {
        console.error('Error loading roles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [users]);

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

  const getPermissionIcon = (permissionId: string) => {
    const permission = allPermissions.find(p => p.id === permissionId);
    return permission?.icon || <Shield className="w-4 h-4" />;
  };

  const getPermissionName = (permissionId: string) => {
    const permission = allPermissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const getPermissionDescription = (permissionId: string) => {
    const permission = allPermissions.find(p => p.id === permissionId);
    return permission ? permission.description : '';
  };

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
    setIsEditModalOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!editingRole) return;
    
    const currentPermissions = editingRole.permissions;
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(p => p !== permissionId)
      : [...currentPermissions, permissionId];
    
    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  const handleSaveRole = async () => {
    if (!editingRole) return;
    
    try {
      setSaving(true);
      
      // Update all users with this role to have the new permissions
      const { error } = await supabase
        .from('users')
        .update({ permissions: editingRole.permissions })
        .eq('role', editingRole.id);
      
      if (error) throw error;
      
      // Update local state
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      
      setIsEditModalOpen(false);
      setEditingRole(null);
      
      alert('Role permissions updated successfully!');
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to update role permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingRole(null);
  };

  const getPermissionsByCategory = () => {
    const categories = [...new Set(allPermissions.map(p => p.category))];
    return categories.map(category => ({
      category,
      permissions: allPermissions.filter(p => p.category === category)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading permissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permissions Management</h2>
          <p className="text-gray-600">Manage role-based permissions and access controls</p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getRoleColor(role.color)}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.userCount} users</p>
                </div>
              </div>
              <button
                onClick={() => handleEditRole(role)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Edit Permissions"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{role.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permissionId) => (
                  <span key={permissionId} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {getPermissionIcon(permissionId)}
                    <span>{getPermissionName(permissionId)}</span>
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Role Modal */}
      {isEditModalOpen && editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Edit Role Permissions</h3>
                <p className="text-gray-600 mt-1">Configure permissions for {editingRole.name} role</p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-6 pb-8">
                {getPermissionsByCategory().map(({ category, permissions }) => (
                  <div key={category} className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={editingRole.permissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <label htmlFor={permission.id} className="flex items-center space-x-2 cursor-pointer">
                              <div className="text-gray-600">
                                {permission.icon}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {permission.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsManagement;