import React, { useState } from 'react';
import { Save, Building, Globe, Clock, Shield, Database, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [organizationSettings, setOrganizationSettings] = useState({
    organizationName: 'Brighter Future Educational Center',
    address: '123 Education Street, Learning City, LC 12345',
    phone: '(555) 123-4567',
    email: 'info@brighterfuture.edu',
    website: 'https://www.brighterfuture.edu',
    taxId: '12-3456789',
    license: 'EDU-2024-001',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'en'
  });

  const [systemSettings, setSystemSettings] = useState({
    sessionTimeout: '30',
    maxFileSize: '10',
    backupFrequency: 'daily',
    maintenanceMode: false,
    debugMode: false,
    autoLogout: true,
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    dataRetention: '7'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordComplexity: true,
    sessionEncryption: true,
    auditLogging: true,
    ipWhitelist: false,
    sslRequired: true
  });

  const timezones = [
    { id: 'America/New_York', name: 'Eastern Time (ET)' },
    { id: 'America/Chicago', name: 'Central Time (CT)' },
    { id: 'America/Denver', name: 'Mountain Time (MT)' },
    { id: 'America/Los_Angeles', name: 'Pacific Time (PT)' },
    { id: 'UTC', name: 'UTC' }
  ];

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' }
  ];

  const currencies = [
    { id: 'USD', name: 'US Dollar ($)' },
    { id: 'EUR', name: 'Euro (€)' },
    { id: 'GBP', name: 'British Pound (£)' },
    { id: 'CAD', name: 'Canadian Dollar (C$)' }
  ];

  const handleOrganizationChange = (field: string, value: string) => {
    setOrganizationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSystemChange = (field: string, value: string | boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', {
      organization: organizationSettings,
      system: systemSettings,
      security: securitySettings
    });
    alert('System settings saved successfully!');
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
          checked ? 'transform translate-x-7' : 'transform translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Organization Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <span>Organization Information</span>
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
              <input
                type="text"
                value={organizationSettings.organizationName}
                onChange={(e) => handleOrganizationChange('organizationName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / EIN</label>
              <input
                type="text"
                value={organizationSettings.taxId}
                onChange={(e) => handleOrganizationChange('taxId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={organizationSettings.address}
                onChange={(e) => handleOrganizationChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={organizationSettings.phone}
                onChange={(e) => handleOrganizationChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={organizationSettings.email}
                onChange={(e) => handleOrganizationChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={organizationSettings.website}
                onChange={(e) => handleOrganizationChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                type="text"
                value={organizationSettings.license}
                onChange={(e) => handleOrganizationChange('license', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Regional Settings</span>
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={organizationSettings.timezone}
                onChange={(e) => handleOrganizationChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz.id} value={tz.id}>{tz.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select
                value={organizationSettings.dateFormat}
                onChange={(e) => handleOrganizationChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
              <select
                value={organizationSettings.timeFormat}
                onChange={(e) => handleOrganizationChange('timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="12">12-hour (AM/PM)</option>
                <option value="24">24-hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={organizationSettings.currency}
                onChange={(e) => handleOrganizationChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency.id} value={currency.id}>{currency.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>System Configuration</span>
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <select
                value={systemSettings.sessionTimeout}
                onChange={(e) => handleSystemChange('sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
              <select
                value={systemSettings.maxFileSize}
                onChange={(e) => handleSystemChange('maxFileSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5 MB</option>
                <option value="10">10 MB</option>
                <option value="25">25 MB</option>
                <option value="50">50 MB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                value={systemSettings.backupFrequency}
                onChange={(e) => handleSystemChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
              <select
                value={systemSettings.passwordExpiry}
                onChange={(e) => handleSystemChange('passwordExpiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
              <select
                value={systemSettings.maxLoginAttempts}
                onChange={(e) => handleSystemChange('maxLoginAttempts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3">3 attempts</option>
                <option value="5">5 attempts</option>
                <option value="10">10 attempts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (years)</label>
              <select
                value={systemSettings.dataRetention}
                onChange={(e) => handleSystemChange('dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5 years</option>
                <option value="7">7 years</option>
                <option value="10">10 years</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                <p className="text-sm text-gray-600">Temporarily disable system access</p>
              </div>
              <ToggleSwitch 
                checked={systemSettings.maintenanceMode} 
                onChange={(value) => handleSystemChange('maintenanceMode', value)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Auto Logout</h4>
                <p className="text-sm text-gray-600">Automatically log out inactive users</p>
              </div>
              <ToggleSwitch 
                checked={systemSettings.autoLogout} 
                onChange={(value) => handleSystemChange('autoLogout', value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Security Settings</span>
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Require 2FA for all users</p>
              </div>
              <ToggleSwitch 
                checked={securitySettings.twoFactorAuth} 
                onChange={(value) => handleSecurityChange('twoFactorAuth', value)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Password Complexity</h4>
                <p className="text-sm text-gray-600">Enforce strong password requirements</p>
              </div>
              <ToggleSwitch 
                checked={securitySettings.passwordComplexity} 
                onChange={(value) => handleSecurityChange('passwordComplexity', value)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Session Encryption</h4>
                <p className="text-sm text-gray-600">Encrypt all session data</p>
              </div>
              <ToggleSwitch 
                checked={securitySettings.sessionEncryption} 
                onChange={(value) => handleSecurityChange('sessionEncryption', value)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Audit Logging</h4>
                <p className="text-sm text-gray-600">Log all user activities</p>
              </div>
              <ToggleSwitch 
                checked={securitySettings.auditLogging} 
                onChange={(value) => handleSecurityChange('auditLogging', value)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">SSL Required</h4>
                <p className="text-sm text-gray-600">Force HTTPS connections</p>
              </div>
              <ToggleSwitch 
                checked={securitySettings.sslRequired} 
                onChange={(value) => handleSecurityChange('sslRequired', value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Save className="w-5 h-5" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;