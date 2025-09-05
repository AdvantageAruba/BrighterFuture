import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Shield, Eye, Link, Copy, X, Save, User } from 'lucide-react';
import AddUser from './AddUser';
import UserProfile from './UserProfile';
import EditUser from './EditUser';
import { useUsers } from '../hooks/useUsers';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Use real data from Supabase
  const { users, loading, error, deleteUser, refreshUsers, programs, classes, updateUser } = useUsers();

  // Transform users data for the UI using useMemo to avoid recreation on every render
  const transformedUsers = useMemo(() => {
    // Helper functions defined inside useMemo to ensure they're available
    const getProgramName = (programId: number) => {
      const program = programs.find(p => p.id === programId);
      return program ? program.name : 'Unknown Program';
    };

    const getClassName = (classId: string) => {
      // Try different ID formats to handle type mismatches
      let classGroup = classes.find(c => c.id === classId);
      
      if (!classGroup) {
        // Try string comparison
        classGroup = classes.find(c => String(c.id) === String(classId));
        
        if (!classGroup) {
          // Try number comparison
          classGroup = classes.find(c => c.id === Number(classId));
        }
      }
      
      return classGroup ? classGroup.name : 'Unknown Class';
    };

    return users.map(user => {
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        phone: user.phone || 'N/A',
        status: user.status,
        avatar: user.picture_url || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000)}?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
        department: user.department || 'N/A',
        program: user.program_id ? getProgramName(user.program_id) : 'N/A',
        class: user.class_id ? getClassName(String(user.class_id)) : 'N/A',
        joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Unknown',
        lastLogin: 'N/A', // Will be updated when login tracking is implemented
        permissions: user.permissions || [],
        // Keep original user data for editing
        originalUser: user
      };
    });
  }, [users, programs, classes]);

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

  const filteredUsers = transformedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
  };

  const handleEditUser = (user: any) => {
    // Use the original user data for editing
    setEditingUser(user.originalUser || user);
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = async (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const result = await deleteUser(user.id);
        if (result.success) {
          alert('User deleted successfully!');
          refreshUsers(); // Refresh the list
        } else {
          alert(`Failed to delete user: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleUserAdded = () => {
    refreshUsers(); // Refresh the list when a new user is added
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error loading users: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user.id} 
              onClick={() => handleViewUser(user)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    {(user.program !== 'N/A' || user.class !== 'N/A') && (
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        {user.program !== 'N/A' && (
                          <span>📚 {user.program}</span>
                        )}
                        {user.class !== 'N/A' && (
                          <span>👥 {user.class}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user);
                    }}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Edit User"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user);
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <AddUser
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {/* User Profile Modal */}
      {isUserProfileOpen && selectedUser && (
        <UserProfile
          user={selectedUser.originalUser || selectedUser}
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          onEdit={() => {
            setIsUserProfileOpen(false);
            handleEditUser(selectedUser);
          }}
          onUpdateUser={updateUser}
        />
      )}

      {/* Edit User Modal */}
      {isEditUserOpen && editingUser && (
        <EditUser
          user={editingUser}
          isOpen={isEditUserOpen}
          onClose={() => setIsEditUserOpen(false)}
          onUserUpdated={handleUserAdded}
        />
      )}
    </div>
  );
};

export default UserManagement;