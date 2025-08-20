import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Shield, Eye, Link, Copy, X, Save, User } from 'lucide-react';
import AddUser from './AddUser';
import UserProfile from './UserProfile';
import EditUser from './EditUser';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const users = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@brighterfuture.edu',
      role: 'Administrator',
      phone: '(555) 123-4567',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      department: 'Administration',
      joinDate: '2020-01-15',
      lastLogin: '2024-01-15 09:30 AM',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'Ms. Emily Smith',
      email: 'emily.smith@brighterfuture.edu',
      role: 'Teacher',
      phone: '(555) 234-5678',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      department: 'Education',
      joinDate: '2021-03-10',
      lastLogin: '2024-01-15 08:45 AM',
      permissions: ['students', 'calendar', 'notes']
    },
    {
      id: 3,
      name: 'Dr. Michael Wilson',
      email: 'michael.wilson@brighterfuture.edu',
      role: 'Therapist',
      phone: '(555) 345-6789',
      status: 'active',
      avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      department: 'Therapy Services',
      joinDate: '2019-08-22',
      lastLogin: '2024-01-14 04:20 PM',
      permissions: ['students', 'therapy', 'assessments']
    }
  ];

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log('Deleting user:', user);
      alert('User deleted successfully!');
    }
  };

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button 
          onClick={handleAddUser}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-4 cursor-pointer flex-1"
                onClick={() => handleViewUser(user)}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleViewUser(user)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="View Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditUser(user)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Edit User"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteUser(user)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <AddUser
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
        />
      )}

      {/* User Profile Modal */}
      {isUserProfileOpen && selectedUser && (
        <UserProfile
          user={selectedUser}
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          onEdit={() => {
            setIsUserProfileOpen(false);
            handleEditUser(selectedUser);
          }}
        />
      )}

      {/* Edit User Modal */}
      {isEditUserOpen && editingUser && (
        <EditUser
          user={editingUser}
          isOpen={isEditUserOpen}
          onClose={() => setIsEditUserOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;