import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import FormViewer from './FormViewer';
import FormEditor from './FormEditor';
import { IntakeFormData } from '../hooks/useIntakeForms';

const AdminPage: React.FC = () => {
  const [viewingForm, setViewingForm] = useState<IntakeFormData | null>(null);
  const [showFormViewer, setShowFormViewer] = useState(false);
  const [showFormEditor, setShowFormEditor] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage intake form submissions and review applications</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Admin Access
              </div>
            </div>
          </div>
        </div>

        {/* Admin Dashboard */}
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

        {/* Form Viewer Modal */}
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

        {/* Form Editor Modal */}
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
              // The admin dashboard will automatically refresh
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
