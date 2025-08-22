import React, { useState } from 'react';
import { Users, Calendar as CalendarIcon, Settings as SettingsIcon, BookOpen, FileText, Activity, Home, Plus, Clock, MessageSquare } from 'lucide-react';
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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user] = useState({
    name: 'Dr. Sarah Johnson',
    role: 'Administrator',
    avatar: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
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
        return <ProgramManagement />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <UserProfile user={user} onBack={() => setActiveTab('dashboard')} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
      />
      
      <main className="ml-64 transition-all duration-300">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;