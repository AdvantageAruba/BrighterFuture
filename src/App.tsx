import { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClassesDataProvider } from './contexts/ClassesDataContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Attendance from './components/Attendance';
import WaitingList from './components/WaitingList';
import Forms from './components/Forms';
import DailyNotes from './components/DailyNotes';
import Calendar from './components/Calendar';
import Announcements from './components/Announcements';
import Messages from './components/Messages';
import ProgramManagement from './components/ProgramManagement';
import Settings from './components/Settings';
import UserProfile from './components/UserProfile';
import InvitationPage from './components/InvitationPage';
import PasswordChangeModal from './components/PasswordChangeModal';
import { useClassesData } from './contexts/ClassesDataContext';

const AppContent: React.FC = () => {
  const { user, userProfile, loading, isTemporaryPassword, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle URL changes for invitation pages
  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Check if we're on an invitation page
  const isInvitationPage = currentPath.startsWith('/invite/');
  const invitationToken = isInvitationPage ? currentPath.split('/invite/')[1] : null;

  // Show password change modal if user has temporary password
  useEffect(() => {
    if (isTemporaryPassword && user && userProfile) {
      setShowPasswordChange(true);
    }
  }, [isTemporaryPassword, user, userProfile]);


  // Get classes data for ProgramManagement from context
  const classesData = useClassesData();

  // Disable automatic refresh to prevent infinite loops
  // useEffect(() => {
  //   if (activeTab === 'programs') {
  //     classesData.refreshClasses();
  //     classesData.refreshTeachers();
  //   }
  // }, [activeTab, classesData]);

  // Memoize the setActiveTab function to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'profile') {
      setShowUserProfile(true);
    } else {
      setActiveTab(tab);
      setShowUserProfile(false);
    }
  }, []);

  // Check if user has permission to access a specific tab
  const canAccessTab = useCallback((tab: string): boolean => {
    // Always allow dashboard
    if (tab === 'dashboard') return true;
    
    // Check if user has the required permission
    const permissionMap: { [key: string]: string } = {
      'students': 'students',
      'attendance': 'attendance',
      'waitinglist': 'waiting_list',
      'forms': 'forms',
      'dailynotes': 'notes',
      'calendar': 'calendar',
      'messages': 'messages',
      'announcements': 'announcements',
      'programs': 'programs',
      'settings': 'settings'
    };
    
    const requiredPermission = permissionMap[tab];
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    
    // If visible_tabs is set and not empty, only allow tabs in that array
    // If visible_tabs is not set or empty, allow all tabs the user has permission for
    // Administrators always have access to all tabs they have permission for
    if (userProfile?.role !== 'administrator' && userProfile?.visible_tabs && userProfile.visible_tabs.length > 0) {
      if (!userProfile.visible_tabs.includes(tab)) return false;
    }
    
    return true;
  }, [hasPermission, userProfile?.visible_tabs]);

  // Redirect to dashboard if user tries to access a restricted tab
  useEffect(() => {
    if (userProfile && !canAccessTab(activeTab)) {
      console.log(`🚫 User doesn't have permission for ${activeTab}, redirecting to dashboard`);
      setActiveTab('dashboard');
    }
  }, [activeTab, userProfile, canAccessTab]);

  const renderContent = useMemo(() => {
    // Check if user has permission to access the current tab
    if (!canAccessTab(activeTab)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={handleTabChange} />;
      case 'students':
        return <Students />;
      case 'attendance':
        return <Attendance />;
      case 'waitinglist':
        return <WaitingList />;
      case 'forms':
        return <Forms />;
      case 'dailynotes':
        return <DailyNotes />;
      case 'calendar':
        return <Calendar />;
      case 'announcements':
        return <Announcements />;
      case 'messages':
        return <Messages />;
      case 'programs':
        return <ProgramManagement classesData={classesData} setActiveTab={handleTabChange} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={handleTabChange} />;
    }
  }, [activeTab, handleTabChange, classesData, canAccessTab]);

  // Show invitation page if on invitation route
  if (isInvitationPage && invitationToken) {
    return <InvitationPage />;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user || !userProfile) {
    console.log('No user or profile, showing login page');
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={{
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          role: userProfile.role,
          avatar: userProfile.picture_url || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        }}
      />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {renderContent}
        </div>
      </main>
      {showUserProfile && (
        <UserProfile 
          user={userProfile} 
          isOpen={showUserProfile} 
          onClose={() => setShowUserProfile(false)} 
        />
      )}
      {showPasswordChange && (
        <PasswordChangeModal 
          isOpen={showPasswordChange} 
          onClose={() => setShowPasswordChange(false)} 
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ClassesDataProvider>
        <AppContent />
      </ClassesDataProvider>
    </AuthProvider>
  );
}

export default App;