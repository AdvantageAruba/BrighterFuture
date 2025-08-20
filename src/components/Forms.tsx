import React, { useState } from 'react';
import { Plus, Search, FileText, Edit, Copy, Trash2, Eye, Calendar, User } from 'lucide-react';

const Forms: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');

  const formTemplates = [
    {
      id: 1,
      name: 'Initial Intake Form',
      type: 'intake',
      description: 'Comprehensive intake form for new students',
      fields: 25,
      lastModified: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Speech Therapy Assessment',
      type: 'assessment',
      description: 'Detailed assessment for speech and language evaluation',
      fields: 18,
      lastModified: '2024-01-12',
      status: 'active'
    },
    {
      id: 3,
      name: 'Behavioral Assessment',
      type: 'assessment',
      description: 'Assessment form for behavioral evaluation',
      fields: 22,
      lastModified: '2024-01-10',
      status: 'active'
    },
    {
      id: 4,
      name: 'IEP Progress Report',
      type: 'diagnosis',
      description: 'Individual Education Program progress tracking',
      fields: 15,
      lastModified: '2024-01-08',
      status: 'draft'
    }
  ];

  const completedForms = [
    {
      id: 1,
      formName: 'Initial Intake Form',
      studentName: 'Emma Rodriguez',
      completedBy: 'Dr. Sarah Johnson',
      completedDate: '2024-01-14',
      status: 'completed'
    },
    {
      id: 2,
      formName: 'Speech Therapy Assessment',
      studentName: 'Michael Chen',
      completedBy: 'Dr. Michael Wilson',
      completedDate: '2024-01-13',
      status: 'pending_review'
    },
    {
      id: 3,
      formName: 'Behavioral Assessment',
      studentName: 'Isabella Garcia',
      completedBy: 'Ms. Emily Smith',
      completedDate: '2024-01-12',
      status: 'completed'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'intake': return 'bg-blue-100 text-blue-800';
      case 'assessment': return 'bg-green-100 text-green-800';
      case 'diagnosis': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'templates', label: 'Form Templates' },
    { id: 'completed', label: 'Completed Forms' }
  ];

  const filteredTemplates = formTemplates.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompleted = completedForms.filter(form =>
    form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-2">Create and manage assessments, intakes, and diagnostic forms</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Create New Form</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={activeTab === 'templates' ? 'Search form templates...' : 'Search completed forms...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{form.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(form.type)}`}>
                          {form.type}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{form.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fields:</span>
                      <span className="font-medium text-gray-900">{form.fields}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Modified:</span>
                      <span className="font-medium text-gray-900">{new Date(form.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {filteredCompleted.map((form) => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{form.formName}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{form.studentName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(form.completedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                        {form.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Completed by: {form.completedBy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forms;