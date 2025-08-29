import React from 'react';
import { IntakeFormData } from '../hooks/useIntakeForms';
import { X, Calendar, Phone, Mail, MapPin, User, Clock, AlertTriangle } from 'lucide-react';

interface FormViewerProps {
  form: IntakeFormData;
  onClose: () => void;
  onEdit: (form: IntakeFormData) => void;
}

const FormViewer: React.FC<FormViewerProps> = ({ form, onClose, onEdit }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatArray = (array: string[] | undefined) => {
    if (!array || array.length === 0) return 'None';
    return array.filter(item => item.trim()).join(', ') || 'None';
  };

  const getStatusColor = (status: string | undefined) => {
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

  const getUrgencyColor = (urgency: string | undefined) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Intake Form Review</h2>
            <p className="text-gray-600">Submitted on {formatDate(form.created_at)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(form.status)}`}>
                {form.status || 'pending'}
              </span>
              {form.urgency_assessment && (
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(form.urgency_assessment)}`}>
                  {form.urgency_assessment}
                </span>
              )}
            </div>
            <button
              onClick={() => onEdit(form)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Form
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          {/* Step 1: Biographical Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Biographical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
                <p className="text-gray-900 font-medium">{form.child_name || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{formatDate(form.date_of_birth)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor ID</label>
                <p className="text-gray-900">{form.sponsor_id || 'Not specified'}</p>
              </div>
            </div>

            {/* Guardian 1 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Primary Guardian</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{form.guardian1_name || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {form.guardian1_email || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {form.guardian1_address || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
                  <div className="space-y-1">
                    {form.guardian1_cell_phone && (
                      <p className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Cell: {form.guardian1_cell_phone}
                      </p>
                    )}
                    {form.guardian1_home_phone && (
                      <p className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Home: {form.guardian1_home_phone}
                      </p>
                    )}
                    {form.guardian1_work_phone && (
                      <p className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Work: {form.guardian1_work_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian 2 */}
            {form.guardian2_name && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Secondary Guardian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{form.guardian2_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{form.guardian2_email || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Household Members */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Household Members</label>
              <p className="text-gray-900">{formatArray(form.household_members)}</p>
            </div>
          </div>

          {/* Step 2: Medical & School Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical & School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Physician</label>
                <p className="text-gray-900">{form.physician_name || 'Not specified'}</p>
                {form.physician_phone && (
                  <p className="text-gray-600 text-sm">{form.physician_phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pediatrician</label>
                <p className="text-gray-900">{form.pediatrician_name || 'Not specified'}</p>
                {form.pediatrician_phone && (
                  <p className="text-gray-600 text-sm">{form.pediatrician_phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <p className="text-gray-900">{form.allergies || 'None reported'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medical Conditions</label>
                <p className="text-gray-900">{form.current_medical_conditions || 'None reported'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <p className="text-gray-900">{form.school_name || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Has IEP</label>
                <p className="text-gray-900">{form.has_iep ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Step 3: Medical & Behavioral History */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical & Behavioral History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                <p className="text-gray-900">{form.diagnosis || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosing Date</label>
                <p className="text-gray-900">{formatDate(form.diagnosing_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <p className="text-gray-900">{form.current_medications || 'None'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seizure History</label>
                <p className="text-gray-900">{form.seizure_history || 'None reported'}</p>
              </div>
            </div>
          </div>

          {/* Step 4: Main Areas of Concern */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Main Areas of Concern</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Concerns</label>
                <p className="text-gray-900">{formatArray(form.primary_concerns)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Goals</label>
                <p className="text-gray-900">{form.therapy_goals || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Assessment</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(form.urgency_assessment)}`}>
                  {form.urgency_assessment || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Step 5: Developmental History */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Developmental History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Smile</label>
                <p className="text-gray-900">{form.first_smile_age || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Sit</label>
                <p className="text-gray-900">{form.sitting_age || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Walk</label>
                <p className="text-gray-900">{form.walking_age || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Words</label>
                <p className="text-gray-900">{form.speaking_age || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Step 6: Social & Play Skills */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Social & Play Skills</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Play Skills & Preferences</label>
                <p className="text-gray-900">{form.play_skills_preferences || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Interaction</label>
                <p className="text-gray-900">{form.interest_in_children || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Step 7: Communication Skills */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Skills</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Methods</label>
                <p className="text-gray-900">{form.communication_forms || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Step 8: Therapy History & Availability */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Therapy History & Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Therapy</label>
                <p className="text-gray-900">{form.previous_therapy_experience || 'None'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Coverage</label>
                <p className="text-gray-900">{form.insurance_coverage ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Days</label>
                <p className="text-gray-900">{formatArray(form.preferred_days)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <p className="text-gray-900">{form.preferred_time_slot || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900">{form.notes || 'No additional notes'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                <p className="text-gray-900">{form.submitted_by || 'Online Form'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormViewer;
