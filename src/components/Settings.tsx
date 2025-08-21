import React, { useState } from 'react';
import { Users, Shield, Bell, Database, Save, Settings as SettingsIcon } from 'lucide-react';
import UserManagement from './UserManagement';
import PermissionsManagement from './PermissionsManagement';
import NotificationSettings from './NotificationSettings';
import SystemSettings from './SystemSettings';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('users');

  const sections = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'system', label: 'System Settings', icon: SettingsIcon }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'permissions':
        return <PermissionsManagement />;
      case 'notifications':
        return <NotificationSettings />;
      case 'data':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <Database className="w-5 h-5" />
                <span>Export Student Data</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors duration-200">
                <Save className="w-5 h-5" />
                <span>Backup System Data</span>
              </button>
            </div>
          </div>
        );
      case 'system':
        return <SystemSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage system configurations and administrative settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;