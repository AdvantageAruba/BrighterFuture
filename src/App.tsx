import { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import ProgramManagement from './components/ProgramManagement';
import Settings from './components/Settings';
import UserProfile from './components/UserProfile';
import TestComponent from './components/TestComponent';
import { useClasses } from './hooks/useClasses';

const AppContent: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Get classes data for ProgramManagement
  const classesData = useClasses();

  // Refresh classes data when navigating to programs page to ensure latest assignments are shown
  useEffect(() => {
    if (activeTab === 'programs') {
      classesData.refreshClasses();
      classesData.refreshTeachers();
    }
  }, [activeTab, classesData]);

  // Memoize the setActiveTab function to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'profile') {
      setShowUserProfile(true);
    } else {
      setActiveTab(tab);
      setShowUserProfile(false);
    }
  }, []);

  const renderContent = useMemo(() => {
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
      case 'programs':
        return <ProgramManagement classesData={classesData} />;
      case 'settings':
        return <Settings />;
      case 'test':
        return <TestComponent />;
      default:
        return <Dashboard setActiveTab={handleTabChange} />;
    }
  }, [activeTab, handleTabChange, classesData]);

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
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;