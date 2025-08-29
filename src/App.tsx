import React, { useState, useMemo, useCallback } from 'react';
import { Users, Calendar as CalendarIcon, Settings as SettingsIcon, BookOpen, FileText, Activity, Home, Plus, Clock, MessageSquare, Database } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Attendance from './components/Attendance';
import WaitingList from './components/WaitingList';
import Forms from './components/Forms';
import DailyNotes from './components/DailyNotes';
import Calendar from './components/Calendar';
import ProgramManagement from './components/ProgramManagement';
import Settings from './components/Settings';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';
import SupabaseTest from './components/SupabaseTest';
import { useClasses } from './hooks/useClasses';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user] = useState({
    name: 'Dr. Sarah Johnson',
    role: 'Administrator',
    avatar: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  });

  // Move useClasses to App level so it persists across tab switches
  const classesData = useClasses();

  // Memoize the setActiveTab function to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
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
      case 'programs':
        return <ProgramManagement classesData={classesData} />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <UserProfile user={user} onBack={() => handleTabChange('dashboard')} />;
      case 'test':
        return <SupabaseTest />;
      default:
        return <Dashboard setActiveTab={handleTabChange} />;
    }
  }, [activeTab, user, classesData, handleTabChange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        user={user} 
      />
      
      <main className="ml-64 transition-all duration-300">
        <div className="p-8">
          {renderContent}
        </div>
      </main>
    </div>
  );
}

export default App;