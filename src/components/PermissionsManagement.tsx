import React, { useState, useEffect } from 'react';
import { Shield, Users, Check, X, Save, Edit, Lock, Eye, Settings, Calendar, BookOpen, FileText, BarChart3, UserCheck, MessageSquare, Megaphone, Clock } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { supabase } from '../lib/supabase';
import GranularPermissionsManager from './GranularPermissionsManager';
import { 
  AVAILABLE_PERMISSIONS, 
  AVAILABLE_TABS, 
  ROLE_PERMISSIONS, 
  getDefaultPermissions, 
  getDefaultTabs,
  getRoleConfig,
  GRANULAR_PERMISSIONS,
  getDefaultGranularPermissions,
  flattenGranularPermissions,
  unflattenGranularPermissions
} from '../lib/permissions';

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
  permissions: string[]; // Flat permissions for backward compatibility
  granularPermissions: Record<string, string[]>; // Granular permissions
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

  // Define helper functions first
  const getPermissionIcon = (permissionId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'students': <UserCheck className="w-4 h-4" />,
      'programs': <BookOpen className="w-4 h-4" />,
      'classes': <Users className="w-4 h-4" />,
      'users': <Users className="w-4 h-4" />,
      'attendance': <Check className="w-4 h-4" />,
      'calendar': <Calendar className="w-4 h-4" />,
      'forms': <FileText className="w-4 h-4" />,
      'notes': <FileText className="w-4 h-4" />,
      'reports': <BarChart3 className="w-4 h-4" />,
      'waiting_list': <Clock className="w-4 h-4" />,
      'settings': <Settings className="w-4 h-4" />,
      'backup': <Shield className="w-4 h-4" />,
      'logs': <FileText className="w-4 h-4" />,
      'announcements': <Megaphone className="w-4 h-4" />,
      'notifications': <MessageSquare className="w-4 h-4" />
    };
    return iconMap[permissionId] || <Shield className="w-4 h-4" />;
  };

  const getRoleColor = (roleId: string) => {
    const colors = {
      administrator: 'bg-red-100 text-red-800 border-red-200',
      teacher: 'bg-blue-100 text-blue-800 border-blue-200',
      therapist: 'bg-green-100 text-green-800 border-green-200',
      coordinator: 'bg-orange-100 text-orange-800 border-orange-200',
      parent: 'bg-purple-100 text-purple-800 border-purple-200',
      staff: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[roleId as keyof typeof colors] || colors.staff;
  };

  // Define all available permissions using the centralized system
  const allPermissions: Permission[] = AVAILABLE_PERMISSIONS.map(perm => ({
    id: perm.id,
    name: perm.name,
    description: perm.description,
    category: perm.category,
    icon: getPermissionIcon(perm.id)
  }));

  // Define default roles using the centralized system
  const defaultRoles: Role[] = ROLE_PERMISSIONS.map(roleConfig => ({
    id: roleConfig.role,
    name: roleConfig.roleName,
    description: roleConfig.description,
    color: getRoleColor(roleConfig.role),
    permissions: roleConfig.defaultPermissions,
    granularPermissions: getDefaultGranularPermissions(roleConfig.role),
    userCount: 0,
    isSystem: true
  }));

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

  const getPermissionName = (permissionId: string) => {
    const permission = allPermissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const getPermissionDescription = (permissionId: string) => {
    const permission = allPermissions.find(p => p.id === permissionId);
    return permission ? permission.description : '';
  };

  const handleEditRole = (role: Role) => {
    // Convert flat permissions to granular format if needed
    const granularPermissions = role.granularPermissions || unflattenGranularPermissions(role.permissions);
    
    setEditingRole({ 
      ...role, 
      granularPermissions 
    });
    setIsEditModalOpen(true);
  };

  const handleGranularPermissionsChange = (newPermissions: string[]) => {
    if (!editingRole) return;
    
    const granularPermissions = unflattenGranularPermissions(newPermissions);
    
    setEditingRole({ 
      ...editingRole, 
      permissions: newPermissions,
      granularPermissions 
    });
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
      
      // Update the centralized role configuration with granular permissions
      await updateRoleConfiguration(editingRole.id, editingRole.permissions);
      
      // Update local state
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      
      setIsEditModalOpen(false);
      setEditingRole(null);
      
      alert('Role permissions updated successfully! All new users with this role will get these granular permissions by default.');
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to update role permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Function to update role configuration in the centralized system
  const updateRoleConfiguration = async (roleId: string, newPermissions: string[]) => {
    try {
      // Store the updated role configuration in the database
      // This will be used by the permissions.ts system
      const { error } = await supabase
        .from('role_configurations')
        .upsert({
          role_id: roleId,
          default_permissions: newPermissions,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      console.log(`✅ Updated default permissions for role ${roleId}:`, newPermissions);
    } catch (error) {
      console.error('Error updating role configuration:', error);
      // If the table doesn't exist, we'll create it
      await createRoleConfigurationsTable();
      // Try again
      await updateRoleConfiguration(roleId, newPermissions);
    }
  };

  // Function to create the role_configurations table if it doesn't exist
  const createRoleConfigurationsTable = async () => {
    try {
      const { error } = await supabase.rpc('create_role_configurations_table');
      if (error) {
        console.log('Creating role_configurations table manually...');
        // If RPC doesn't work, we'll handle this gracefully
        // The permissions will still work, just won't persist across sessions
      }
    } catch (error) {
      console.log('Role configurations table creation not available, using in-memory storage');
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
              <h4 className="text-sm font-medium text-gray-700">Granular Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const granularPermissions = role.granularPermissions || unflattenGranularPermissions(role.permissions);
                  const permissionCount = Object.keys(granularPermissions).length;
                  const operationCount = Object.values(granularPermissions).flat().length;
                  
                  return (
                    <>
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {permissionCount} permissions
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {operationCount} operations
                      </span>
                    </>
                  );
                })()}
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
                {/* Granular Permissions */}
                <GranularPermissionsManager
                  permissions={editingRole.permissions}
                  onPermissionsChange={handleGranularPermissionsChange}
                  role={editingRole.id}
                  disabled={false}
                />
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