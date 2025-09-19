import React, { useMemo } from 'react';
import { Home, Users, Calendar, Settings, BookOpen, LogOut, Clock, FileText, CreditCard, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, user }) => {
  const { signOut, hasPermission, userProfile } = useAuth();

  // Debug logging
  console.log('🔍 Navigation Debug:', {
    userProfile: userProfile,
    permissions: userProfile?.permissions,
    visible_tabs: userProfile?.visible_tabs,
    role: userProfile?.role,
    hasStudentsPermission: hasPermission('students'),
    studentsTabInVisibleTabs: userProfile?.visible_tabs?.includes('students')
  });
  
  // Log the actual permissions array
  if (userProfile?.permissions) {
    console.log('📋 Administrator permissions:', userProfile.permissions);
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: null }, // Always visible
    { id: 'students', label: 'Students', icon: Users, permission: 'students' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, permission: 'attendance' },
    { id: 'waitinglist', label: 'Waiting List', icon: Clock, permission: 'waiting_list' },
    { id: 'forms', label: 'Forms', icon: FileText, permission: 'forms' },
    { id: 'dailynotes', label: 'Daily Notes', icon: BookOpen, permission: 'notes' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, permission: 'calendar' },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare, permission: 'announcements' },
    { id: 'programs', label: 'Programs', icon: BookOpen, permission: 'programs' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings' },
  ], []);

  // Filter navigation items based on user permissions and visible_tabs
  const visibleNavItems = navItems.filter(item => {
    // Always show dashboard
    if (item.id === 'dashboard') return true;
    
    // Check if user has the required permission
    if (item.permission && !hasPermission(item.permission)) {
      console.log(`❌ Filtering out ${item.id}: missing permission ${item.permission}`);
      return false;
    }
    
    // If visible_tabs is set and not empty, only show tabs in that array
    // If visible_tabs is not set or empty, show all tabs the user has permission for
    // Administrators always see all tabs they have permission for
    if (userProfile?.role !== 'administrator' && userProfile?.visible_tabs && userProfile.visible_tabs.length > 0) {
      if (!userProfile.visible_tabs.includes(item.id)) {
        console.log(`❌ Filtering out ${item.id}: not in visible_tabs (${userProfile.visible_tabs.join(', ')})`);
        return false;
      }
    }
    
    console.log(`✅ Showing ${item.id}`);
    return true;
  });

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Brighter Future</h1>
            <p className="text-sm text-gray-500">Educational Portal</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <ul className="space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div 
          className={`flex items-center space-x-3 mb-4 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            activeTab === 'profile'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('profile')}
          title="Click to view profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
            <p className="text-xs text-blue-600 font-medium">View Profile</p>
          </div>
          <User className="w-4 h-4 text-gray-400" />
        </div>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;