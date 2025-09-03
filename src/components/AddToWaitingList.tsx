import React, { useState } from 'react';
import { X, Save, User, Phone, Mail, Calendar, MapPin, FileText } from 'lucide-react';
import { useWaitingList } from '../hooks/useWaitingList';

interface AddToWaitingListProps {
  isOpen: boolean;
  onClose: () => void;
  onWaitingListAdded?: () => void;
  editingEntry?: any; // Add support for editing existing entry
  isEditing?: boolean; // Add flag to indicate editing mode
}

const AddToWaitingList: React.FC<AddToWaitingListProps> = ({ isOpen, onClose, onWaitingListAdded, editingEntry, isEditing = false }) => {
  const { addWaitingListEntry, updateWaitingListEntry } = useWaitingList();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Student Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    
    // Parent/Guardian Information
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    
    // Emergency Contact
    emergencyContact: '',
    emergencyPhone: '',
    
    // Program Information
    program: '',
    priority: 'medium',
    preferredStartDate: '',
    
    // Additional Information
    notes: '',
    reasonForWaiting: ''
  });

  // Pre-populate form when editing
  React.useEffect(() => {
    if (isEditing && editingEntry) {
      setFormData({
        firstName: editingEntry.first_name || '',
        lastName: editingEntry.last_name || '',
        dateOfBirth: editingEntry.date_of_birth || '',
        age: editingEntry.age ? editingEntry.age.toString() : '',
        parentName: editingEntry.parent_name || '',
        parentPhone: editingEntry.parent_phone || '',
        parentEmail: editingEntry.parent_email || '',
        address: editingEntry.address || '',
        emergencyContact: editingEntry.emergency_contact || '',
        emergencyPhone: editingEntry.emergency_phone || '',
        program: editingEntry.program || '',
        priority: editingEntry.priority || 'medium',
        preferredStartDate: editingEntry.preferred_start_date || '',
        notes: editingEntry.notes || '',
        reasonForWaiting: editingEntry.reason_for_waiting || ''
      });
    } else {
      // Reset form when adding new entry
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        age: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        program: '',
        priority: 'medium',
        preferredStartDate: '',
        notes: '',
        reasonForWaiting: ''
      });
    }
  }, [isEditing, editingEntry, isOpen]);

  const programs = [
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'individual-therapy', name: 'Individual Therapy' },
    { id: 'consultancy', name: 'Consultancy' }
  ];

  const priorities = [
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ];

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If date of birth is being changed, automatically calculate age
    if (name === 'dateOfBirth') {
      const calculatedAge = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        age: calculatedAge > 0 ? calculatedAge.toString() : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // Transform form data to match database schema
      const waitingListData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        age: formData.age ? parseInt(formData.age) : undefined,
        parent_name: formData.parentName,
        parent_phone: formData.parentPhone,
        parent_email: formData.parentEmail,
        address: formData.address || undefined,
        emergency_contact: formData.emergencyContact || undefined,
        emergency_phone: formData.emergencyPhone || undefined,
        program: formData.program,
        priority: formData.priority as 'high' | 'medium' | 'low',
        preferred_start_date: formData.preferredStartDate || undefined,
        reason_for_waiting: formData.reasonForWaiting || undefined,
        notes: formData.notes || undefined
      };

      let result;
      if (isEditing && editingEntry) {
        // Update existing entry
        result = await updateWaitingListEntry(editingEntry.id, waitingListData);
      } else {
        // Add new entry
        result = await addWaitingListEntry(waitingListData);
      }
      
      if (result.success) {
        alert(isEditing ? 'Waiting list entry updated successfully!' : 'Student added to waiting list successfully!');
        // Call callback to notify parent component
        if (onWaitingListAdded) {
          onWaitingListAdded();
        }
        onClose();
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'add'} waiting list entry: ${result.error}`);
      }
    } catch (error) {
      alert(`An error occurred while ${isEditing ? 'updating' : 'adding'} the waiting list entry.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Waiting List Entry' : 'Add to Waiting List'}</h2>
            <p className="text-gray-600">{isEditing ? 'Update the waiting list entry details' : 'Add a new student to the program waiting list'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Student Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Student Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (Auto-calculated)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Enter date of birth to calculate age"
                  />
                  <p className="text-xs text-gray-500 mt-1">Age is automatically calculated from the date of birth</p>
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Parent/Guardian Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Program Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Program *</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a program...</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date</label>
                  <input
                    type="date"
                    name="preferredStartDate"
                    value={formData.preferredStartDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Waiting List</label>
                  <textarea
                    name="reasonForWaiting"
                    value={formData.reasonForWaiting}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Explain why the student needs to be on the waiting list..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information about the student or special requirements..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Entry' : 'Add to Waiting List')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToWaitingList;