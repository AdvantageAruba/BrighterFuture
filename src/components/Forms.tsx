import React, { useState } from 'react';
import { Plus, Search, FileText, Edit, Copy, Trash2, Eye, Calendar, User, UserCheck, ClipboardList, BarChart3, Shield } from 'lucide-react';
import ComprehensiveIntakeForm from './ComprehensiveIntakeForm';
import AdminDashboard from './AdminDashboard';
import FormViewer from './FormViewer';
import FormEditor from './FormEditor';

// Form Edit Component
const FormEditForm: React.FC<{ form: any; onSave: (form: any) => void; onCancel: () => void }> = ({ form, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: form.name,
    type: form.type,
    description: form.description,
    status: form.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="intake">Intake</option>
          <option value="assessment">Assessment</option>
          <option value="diagnosis">Diagnosis</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Completed Form Edit Component
const CompletedFormEditForm: React.FC<{ form: any; onSave: (form: any) => void; onCancel: () => void }> = ({ form, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    formName: form.formName,
    studentName: form.studentName,
    completedBy: form.completedBy,
    status: form.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Name</label>
        <input
          type="text"
          value={formData.formName}
          onChange={(e) => setFormData({ ...formData, formName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
        <input
          type="text"
          value={formData.studentName}
          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Completed By</label>
        <input
          type="text"
          value={formData.completedBy}
          onChange={(e) => setFormData({ ...formData, completedBy: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="completed">Completed</option>
          <option value="pending_review">Pending Review</option>
          <option value="in_progress">In Progress</option>
        </select>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const Forms: React.FC = () => {
  const [activeTab, setActiveTab] = useState('intake');
  const [searchTerm, setSearchTerm] = useState('');
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [editingForm, setEditingForm] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompletedForm, setEditingCompletedForm] = useState<any>(null);
  const [showCompletedEditModal, setShowCompletedEditModal] = useState(false);
  
  // Admin interface state
  const [viewingForm, setViewingForm] = useState<any>(null);
  const [showFormViewer, setShowFormViewer] = useState(false);
  const [showFormEditor, setShowFormEditor] = useState(false);

  const formTemplates = [
    {
      id: 1,
      name: 'Brighter Future Intake Form',
      type: 'intake',
      description: 'Comprehensive intake form for new students - First Steps application',
      fields: 45,
      lastModified: '2024-01-15',
      status: 'active',
      isComprehensive: true
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
      name: 'Occupational Therapy Assessment',
      type: 'assessment',
      description: 'Assessment for fine motor skills and daily living activities',
      fields: 25,
      lastModified: '2024-01-09',
      status: 'active'
    },
    {
      id: 5,
      name: 'Sensory Processing Assessment',
      type: 'assessment',
      description: 'Evaluation of sensory needs and preferences',
      fields: 20,
      lastModified: '2024-01-07',
      status: 'active'
    },
    {
      id: 6,
      name: 'IEP Progress Report',
      type: 'diagnosis',
      description: 'Individual Education Program progress tracking',
      fields: 15,
      lastModified: '2024-01-08',
      status: 'draft'
    },
    {
      id: 7,
      name: 'Monthly Progress Report',
      type: 'diagnosis',
      description: 'Monthly student progress and goal achievement tracking',
      fields: 12,
      lastModified: '2024-01-05',
      status: 'active'
    },
    {
      id: 8,
      name: 'Quarterly Evaluation Report',
      type: 'diagnosis',
      description: 'Comprehensive quarterly student evaluation and recommendations',
      fields: 30,
      lastModified: '2024-01-03',
      status: 'active'
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

  const handleEditForm = (form: any) => {
    setEditingForm(form);
    setShowEditModal(true);
  };

  const handleEditCompletedForm = (form: any) => {
    setEditingCompletedForm(form);
    setShowCompletedEditModal(true);
  };

  const handleSaveForm = (updatedForm: any) => {
    // Update the form template
    const index = formTemplates.findIndex(f => f.id === updatedForm.id);
    if (index !== -1) {
      const newTemplates = [...formTemplates];
      newTemplates[index] = { ...newTemplates[index], ...updatedForm };
      // In a real app, you would save this to your backend
      console.log('Form template updated:', updatedForm);
    }
    setShowEditModal(false);
    setEditingForm(null);
  };

  const handleSaveCompletedForm = (updatedForm: any) => {
    // Update the completed form
    const index = completedForms.findIndex(f => f.id === updatedForm.id);
    if (index !== -1) {
      const newCompletedForms = [...completedForms];
      newCompletedForms[index] = { ...newCompletedForms[index], ...updatedForm };
      // In a real app, you would save this to your backend
      console.log('Completed form updated:', updatedForm);
    }
    setShowCompletedEditModal(false);
    setEditingCompletedForm(null);
  };

  const tabs = [
    { id: 'intake', label: 'Intake Forms', icon: UserCheck },
    { id: 'assessment', label: 'Assessment Forms', icon: ClipboardList },
    { id: 'reports', label: 'Reports & Progress', icon: BarChart3 },
    { id: 'templates', label: 'Form Templates', icon: FileText },
    { id: 'completed', label: 'Completed Forms', icon: FileText },
    { id: 'admin', label: 'Admin Dashboard', icon: Shield }
  ];

  const filteredTemplates = formTemplates.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompleted = completedForms.filter(form =>
    form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIntakeForms = formTemplates.filter(form =>
    form.type === 'intake' && (
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredAssessmentForms = formTemplates.filter(form =>
    form.type === 'assessment' && (
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredReportForms = formTemplates.filter(form =>
    form.type === 'diagnosis' && (
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-2">Create and manage assessments, intakes, and diagnostic forms</p>
        </div>
        <button 
          onClick={() => setShowIntakeForm(false)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Form</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  activeTab === 'intake' ? 'Search intake forms...' :
                  activeTab === 'assessment' ? 'Search assessment forms...' :
                  activeTab === 'reports' ? 'Search reports...' :
                  activeTab === 'templates' ? 'Search form templates...' :
                  'Search completed forms...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {activeTab === 'intake' && (
            <div className="space-y-6">
              {/* Intake Forms Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">Intake Forms</h2>
                    <p className="text-blue-700">Complete intake forms for new students joining Brighter Future</p>
                  </div>
                  <button 
                    onClick={() => setShowIntakeForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start New Intake</span>
                  </button>
                </div>
              </div>

              {/* Intake Form Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Brighter Future Intake Form */}
                <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 text-lg">Brighter Future Intake Form</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Comprehensive
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-blue-800 mb-4">
                    Complete application form for new students. Includes biographical information, medical history, 
                    developmental assessment, and therapy preferences.
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Steps:</span>
                      <span className="font-medium text-blue-900">8</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Estimated Time:</span>
                      <span className="font-medium text-blue-900">15-20 min</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowIntakeForm(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Fill Out Intake Form</span>
                  </button>
                </div>

                {/* Quick Intake Form */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Quick Intake Form</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Basic
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Simplified intake form for initial contact and basic information gathering.
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium text-gray-900">3</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium text-gray-900">5-10 min</span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <UserCheck className="w-4 h-4" />
                    <span>Start Quick Intake</span>
                  </button>
                </div>

                {/* Emergency Intake */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Emergency Intake</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Expedited intake process for urgent cases requiring immediate attention.
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Steps:</span>
                      <span className="font-medium text-gray-900">4</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium text-gray-900">8-12 min</span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <UserCheck className="w-4 h-4" />
                    <span>Emergency Intake</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-6">
              {/* Assessment Forms Header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">Assessment Forms</h2>
                    <p className="text-green-700">Comprehensive assessment tools for evaluating student needs and progress</p>
                  </div>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Create Assessment</span>
                  </button>
                </div>
              </div>

              {/* Assessment Form Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessmentForms.map((form) => (
                  <div key={form.id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-green-600" />
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
                      <button className="flex-1 flex items-center justify-center space-x-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => handleEditForm(form)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Reports Header */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900 mb-2">Reports & Progress</h2>
                    <p className="text-purple-700">Generate and view progress reports, assessments, and student evaluations</p>
                  </div>
                  <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>

              {/* Report Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReportForms.map((form) => (
                  <div key={form.id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
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
                      <button className="flex-1 flex items-center justify-center space-x-1 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => handleEditForm(form)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((form) => (
                 <div key={form.id} className={`border rounded-lg p-6 hover:shadow-sm transition-shadow duration-200 ${
                   form.isComprehensive 
                     ? 'border-blue-300 bg-blue-50 shadow-md' 
                     : 'border-gray-200'
                 }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{form.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(form.type)}`}>
                            {form.type}
                          </span>
                          {form.isComprehensive && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </div>
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
                    <button 
                      onClick={() => form.isComprehensive ? setShowIntakeForm(true) : null}
                      className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{form.isComprehensive ? 'Fill Out' : 'View'}</span>
                    </button>
                    <button 
                      onClick={() => handleEditForm(form)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
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
                        <button 
                          onClick={() => handleEditCompletedForm(form)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
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

          {activeTab === 'admin' && (
            <div className="space-y-6">
              <AdminDashboard
                onViewForm={(form) => {
                  setViewingForm(form);
                  setShowFormViewer(true);
                }}
                onEditForm={(form) => {
                  setViewingForm(form);
                  setShowFormEditor(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Intake Form Modal */}
      {showIntakeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">Brighter Future Intake Form</h2>
                 <p className="text-gray-600">First Steps - Complete Application</p>
                 <p className="text-sm text-blue-600 mt-1">Fill out this comprehensive form to schedule an evaluation</p>
               </div>
              <button
                onClick={() => setShowIntakeForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
              <ComprehensiveIntakeForm />
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Template Modal */}
      {showEditModal && editingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Form Template</h2>
                <p className="text-gray-600">Update form template details</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <FormEditForm 
                form={editingForm} 
                onSave={handleSaveForm}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Completed Form Modal */}
      {showCompletedEditModal && editingCompletedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Completed Form</h2>
                <p className="text-gray-600">Update completed form details</p>
              </div>
              <button
                onClick={() => setShowCompletedEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <CompletedFormEditForm 
                form={editingCompletedForm} 
                onSave={handleSaveCompletedForm}
                onCancel={() => setShowCompletedEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Form Viewer Modal */}
      {showFormViewer && viewingForm && (
        <FormViewer
          form={viewingForm}
          onClose={() => {
            setShowFormViewer(false);
            setViewingForm(null);
          }}
          onEdit={(form) => {
            setShowFormViewer(false);
            setViewingForm(form);
            setShowFormEditor(true);
          }}
        />
      )}

      {/* Admin Form Editor Modal */}
      {showFormEditor && viewingForm && (
        <FormEditor
          form={viewingForm}
          onClose={() => {
            setShowFormEditor(false);
            setViewingForm(null);
          }}
          onSave={(updatedForm) => {
            setShowFormEditor(false);
            setViewingForm(null);
            // Refresh the admin dashboard
            setActiveTab('admin');
          }}
        />
      )}
    </div>
  );
};

export default Forms;