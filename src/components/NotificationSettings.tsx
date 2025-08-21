import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Calendar, Users, Save, Edit, Plus } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    sessionReminders: true,
    dailyDigest: false,
    parentUpdates: true,
    systemAlerts: true,
    reminderTime: '15',
    digestTime: '08:00',
    weekendNotifications: false
  });

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Session Reminder',
      subject: 'Upcoming Session Reminder - {{student_name}}',
      type: 'reminder',
      content: 'Dear {{parent_name}},\n\nThis is a friendly reminder that {{student_name}} has a {{session_type}} session scheduled for {{date}} at {{time}}.\n\nLocation: {{location}}\nTherapist: {{therapist_name}}\n\nPlease contact us if you need to reschedule.\n\nBest regards,\nBrighter Future Team'
    },
    {
      id: 2,
      name: 'Progress Update',
      subject: 'Progress Update for {{student_name}}',
      type: 'update',
      content: 'Dear {{parent_name}},\n\nWe wanted to share some exciting progress updates about {{student_name}}:\n\n{{progress_notes}}\n\nNext steps:\n{{next_steps}}\n\nPlease feel free to reach out with any questions.\n\nBest regards,\n{{staff_name}}'
    },
    {
      id: 3,
      name: 'Welcome Email',
      subject: 'Welcome to Brighter Future - {{student_name}}',
      type: 'welcome',
      content: 'Dear {{parent_name}},\n\nWelcome to Brighter Future! We are excited to begin working with {{student_name}}.\n\nYour program coordinator is {{coordinator_name}} and can be reached at {{coordinator_email}}.\n\nProgram: {{program_name}}\nStart Date: {{start_date}}\n\nWe look forward to supporting {{student_name}}\'s journey.\n\nWarm regards,\nBrighter Future Team'
    }
  ]);

  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving notification settings:', settings);
    alert('Notification settings saved successfully!');
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setIsEditingTemplate(true);
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

  const EmailTemplateModal = () => {
    const [templateData, setTemplateData] = useState(
      editingTemplate || {
        name: '',
        subject: '',
        type: 'reminder',
        content: ''
      }
    );

    const templateTypes = [
      { id: 'reminder', name: 'Session Reminder' },
      { id: 'update', name: 'Progress Update' },
      { id: 'welcome', name: 'Welcome Email' },
      { id: 'assessment', name: 'Assessment Notification' },
      { id: 'general', name: 'General Communication' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingTemplate) {
        setEmailTemplates(templates => 
          templates.map(t => t.id === editingTemplate.id ? { ...templateData, id: editingTemplate.id } : t)
        );
        alert('Template updated successfully!');
      } else {
        setEmailTemplates(templates => [...templates, { ...templateData, id: Date.now() }]);
        alert('Template created successfully!');
      }
      setIsEditingTemplate(false);
      setIsAddingTemplate(false);
      setEditingTemplate(null);
    };

    if (!isEditingTemplate && !isAddingTemplate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {editingTemplate ? 'Edit Email Template' : 'Create Email Template'}
            </h2>
            <button onClick={() => {
              setIsEditingTemplate(false);
              setIsAddingTemplate(false);
              setEditingTemplate(null);
            }}>
              <span className="text-gray-400 text-xl">×</span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={templateData.name}
                    onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
                  <select
                    value={templateData.type}
                    onChange={(e) => setTemplateData({...templateData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {templateTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                <input
                  type="text"
                  value={templateData.subject}
                  onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Use {{variable_name}} for dynamic content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Content *</label>
                <textarea
                  value={templateData.content}
                  onChange={(e) => setTemplateData({...templateData, content: e.target.value})}
                  required
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Use {{variable_name}} for dynamic content like {{student_name}}, {{parent_name}}, etc."
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Available Variables:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                  <span>{{student_name}}</span>
                  <span>{{parent_name}}</span>
                  <span>{{date}}</span>
                  <span>{{time}}</span>
                  <span>{{location}}</span>
                  <span>{{therapist_name}}</span>
                  <span>{{program_name}}</span>
                  <span>{{coordinator_name}}</span>
                  <span>{{staff_name}}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button type="button" onClick={() => {
                setIsEditingTemplate(false);
                setIsAddingTemplate(false);
                setEditingTemplate(null);
              }} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Cancel
              </button>
              <button type="submit" className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Save className="w-4 h-4" />
                <span>{editingTemplate ? 'Update' : 'Create'} Template</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <ToggleSwitch 
              checked={settings.emailNotifications} 
              onChange={(value) => handleSettingChange('emailNotifications', value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Session Reminders</h4>
              <p className="text-sm text-gray-600">Get notified before sessions</p>
            </div>
            <ToggleSwitch 
              checked={settings.sessionReminders} 
              onChange={(value) => handleSettingChange('sessionReminders', value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Daily Digest</h4>
              <p className="text-sm text-gray-600">Daily summary of activities</p>
            </div>
            <ToggleSwitch 
              checked={settings.dailyDigest} 
              onChange={(value) => handleSettingChange('dailyDigest', value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Parent Updates</h4>
              <p className="text-sm text-gray-600">Automatic updates to parents</p>
            </div>
            <ToggleSwitch 
              checked={settings.parentUpdates} 
              onChange={(value) => handleSettingChange('parentUpdates', value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">System Alerts</h4>
              <p className="text-sm text-gray-600">Important system notifications</p>
            </div>
            <ToggleSwitch 
              checked={settings.systemAlerts} 
              onChange={(value) => handleSettingChange('systemAlerts', value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Weekend Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications on weekends</p>
            </div>
            <ToggleSwitch 
              checked={settings.weekendNotifications} 
              onChange={(value) => handleSettingChange('weekendNotifications', value)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time (minutes before)</label>
            <select
              value={settings.reminderTime}
              onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="1440">1 day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Digest Time</label>
            <input
              type="time"
              value={settings.digestTime}
              onChange={(e) => handleSettingChange('digestTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Email Templates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
          <button 
            onClick={() => setIsAddingTemplate(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Template</span>
          </button>
        </div>

        <div className="space-y-4">
          {emailTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Subject: {template.subject}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{template.content}</p>
                </div>
                <button 
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmailTemplateModal />
    </div>
  );
};

export default NotificationSettings;