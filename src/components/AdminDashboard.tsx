import React, { useState, useEffect } from 'react';
import { useIntakeForms, IntakeFormData } from '../hooks/useIntakeForms';
import { 
  Eye, 
  Edit, 
  Download, 
  Filter, 
  Search, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onViewForm: (form: IntakeFormData) => void;
  onEditForm: (form: IntakeFormData) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewForm, onEditForm }) => {
  const { 
    intakeForms, 
    loading, 
    error, 
    fetchIntakeForms, 
    updateFormStatus,
    searchIntakeForms,
    getFormsByStatus 
  } = useIntakeForms();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [filteredForms, setFilteredForms] = useState<IntakeFormData[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);

  useEffect(() => {
    fetchIntakeForms();
  }, [fetchIntakeForms]);

  useEffect(() => {
    applyFilters();
  }, [intakeForms, searchTerm, statusFilter, urgencyFilter, dateFilter]);

  const applyFilters = () => {
    let filtered = [...intakeForms];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(form => 
        form.child_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.guardian1_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.guardian1_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(form => form.status === statusFilter);
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(form => form.urgency_assessment === urgencyFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(form => {
            const formDate = new Date(form.created_at || '');
            return formDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          filtered = filtered.filter(form => {
            const formDate = new Date(form.created_at || '');
            return formDate >= sevenDaysAgo;
          });
          break;
        case 'month':
          filtered = filtered.filter(form => {
            const formDate = new Date(form.created_at || '');
            return formDate >= thirtyDaysAgo;
          });
          break;
      }
    }

    setFilteredForms(filtered);
  };

  const handleStatusUpdate = async (formId: string, newStatus: string) => {
    const result = await updateFormStatus(formId, newStatus);
    if (result.success) {
      // Refresh the forms list
      fetchIntakeForms();
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    const updatePromises = selectedForms.map(id => updateFormStatus(id, newStatus));
    await Promise.all(updatePromises);
    setSelectedForms([]);
    fetchIntakeForms();
  };

  const exportData = () => {
    const csvContent = generateCSV(filteredForms);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `intake_forms_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (forms: IntakeFormData[]) => {
    const headers = [
      'ID', 'Child Name', 'Date of Birth', 'Guardian Name', 'Guardian Email',
      'Status', 'Urgency', 'Created Date', 'Contact Phone'
    ];

    const rows = forms.map(form => [
      form.id || '',
      form.child_name || '',
      form.date_of_birth || '',
      form.guardian1_name || '',
      form.guardian1_email || '',
      form.status || '',
      form.urgency_assessment || '',
      form.created_at ? new Date(form.created_at).toLocaleDateString() : '',
      form.contact_phone || ''
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading intake forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intake Forms Admin</h1>
          <p className="text-gray-600">Manage and review intake form submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportData}
            disabled={filteredForms.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="immediate">Immediate</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedForms.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedForms.length} form(s) selected
            </span>
            <div className="flex items-center space-x-3">
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                className="px-3 py-1 border border-blue-300 rounded-md text-sm"
              >
                <option value="">Update Status...</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => setSelectedForms([])}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filteredForms.length} form(s) found</span>
        <span>Total: {intakeForms.length} form(s)</span>
      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedForms.length === filteredForms.length && filteredForms.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedForms(filteredForms.map(f => f.id || ''));
                      } else {
                        setSelectedForms([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedForms.includes(form.id || '')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedForms([...selectedForms, form.id || '']);
                        } else {
                          setSelectedForms(selectedForms.filter(id => id !== form.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {form.child_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {form.date_of_birth ? new Date(form.date_of_birth).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {form.guardian1_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {form.guardian1_email || 'No email'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(form.status || 'pending')}
                      <select
                        value={form.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(form.id || '', e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(form.status || 'pending')}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {form.urgency_assessment ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(form.urgency_assessment)}`}>
                        {form.urgency_assessment}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.created_at ? new Date(form.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewForm(form)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Form"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditForm(form)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Form"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
