import React, { useState } from 'react';
import { X, Save, BookOpen, Users, Calendar, MapPin, Phone, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SchedulePicker from './SchedulePicker';

interface EditProgramProps {
  program: any;
  isOpen: boolean;
  onClose: () => void;
  onProgramUpdated?: () => void;
}

const EditProgram: React.FC<EditProgramProps> = ({ program, isOpen, onClose, onProgramUpdated }) => {
  const [formData, setFormData] = useState({
    name: program.name || '',
    description: program.description || '',
    type: program.type || '',
    capacity: program.capacity?.toString() || '',
    age_range_start: program.age_range_start || '',
    age_range_end: program.age_range_end || '',
    location: program.location || '',
    schedule: program.schedule || '',
    start_date: program.start_date || '',
    coordinator: program.coordinator || '',
    coordinator_email: program.coordinator_email || '',
    coordinator_phone: program.coordinator_phone || '',
    status: program.status || 'active',
    requirements: program.requirements || '',
    objectives: program.objectives || '',
    curriculum: program.curriculum || '',
    assessment_methods: program.assessment_methods || '',
    staff_requirements: program.staff_requirements || '',
    budget: program.budget?.toString() || '',
    notes: program.notes || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const programTypes = [
    { id: 'full-time-education', name: 'Full-time Education' },
    { id: 'early-intervention', name: 'Early Intervention' },
    { id: 'therapy-services', name: 'Therapy Services' },
    { id: 'consultation', name: 'Consultation' },
    { id: 'seasonal-program', name: 'Seasonal Program' },
    { id: 'after-school', name: 'After School Program' },
    { id: 'summer-camp', name: 'Summer Camp' },
    { id: 'parent-training', name: 'Parent Training' },
    { id: 'professional-development', name: 'Professional Development' }
  ];

  const statusOptions = [
    { id: 'planning', name: 'Planning' },
    { id: 'active', name: 'Active' },
    { id: 'seasonal', name: 'Seasonal' },
    { id: 'inactive', name: 'Inactive' }
  ];

  const ageOptions = [
    { value: '', label: 'Select age' },
    { value: '0', label: '0 years' },
    { value: '1', label: '1 year' },
    { value: '2', label: '2 years' },
    { value: '3', label: '3 years' },
    { value: '4', label: '4 years' },
    { value: '5', label: '5 years' },
    { value: '6', label: '6 years' },
    { value: '7', label: '7 years' },
    { value: '8', label: '8 years' },
    { value: '9', label: '9 years' },
    { value: '10', label: '10 years' },
    { value: '11', label: '11 years' },
    { value: '12', label: '12 years' },
    { value: '13', label: '13 years' },
    { value: '14', label: '14 years' },
    { value: '15', label: '15 years' },
    { value: '16', label: '16 years' },
    { value: '17', label: '17 years' },
    { value: '18', label: '18 years' },
    { value: '19', label: '19 years' },
    { value: '20', label: '20 years' },
    { value: '21', label: '21+ years' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAgeRange = () => {
    if (formData.age_range_start && formData.age_range_end) {
      const startAge = parseInt(formData.age_range_start);
      const endAge = parseInt(formData.age_range_end);
      return endAge >= startAge;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate age range
    if (!validateAgeRange()) {
      alert('Age range end must be greater than or equal to age range start.');
      return;
    }
    
    setIsLoading(true);

    try {
      // Prepare the data for database update
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        age_range: formData.age_range_start && formData.age_range_end 
          ? `${formData.age_range_start}-${formData.age_range_end} years`
          : null,
        age_range_start: formData.age_range_start || null,
        age_range_end: formData.age_range_end || null,
        location: formData.location || null,
        schedule: formData.schedule || null,
        start_date: formData.start_date || null,
        coordinator: formData.coordinator || null,
        coordinator_email: formData.coordinator_email || null,
        coordinator_phone: formData.coordinator_phone || null,
        status: formData.status,
        requirements: formData.requirements || null,
        objectives: formData.objectives || null,
        curriculum: formData.curriculum || null,
        assessment_methods: formData.assessment_methods || null,
        staff_requirements: formData.staff_requirements || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        notes: formData.notes || null
      };

      // Only add updated_at if the column exists (will be added after migration)
      // For now, we'll try without it and handle the error gracefully

      // Update the program in the database
      const { error } = await supabase
        .from('programs')
        .update(updateData)
        .eq('id', program.id);

      if (error) {
        throw error;
      }

      // Call the callback to refresh the data
      if (onProgramUpdated) {
        onProgramUpdated();
      }

      alert('Program updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Program</h2>
            <p className="text-gray-600">Update {program.name} program details</p>
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
            {/* Basic Program Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Program Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {programTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range Start *</label>
                  <select
                    name="age_range_start"
                    value={formData.age_range_start}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range End *</label>
                  <select
                    name="age_range_end"
                    value={formData.age_range_end}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formData.age_range_start && formData.age_range_end && !validateAgeRange()
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {ageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formData.age_range_start && formData.age_range_end && !validateAgeRange() && (
                    <p className="mt-1 text-sm text-red-600">End age must be greater than or equal to start age</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Schedule and Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Schedule & Location</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <SchedulePicker
                    value={formData.schedule}
                    onChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Program Coordinator */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Program Coordinator</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator Name *</label>
                  <input
                    type="text"
                    name="coordinator"
                    value={formData.coordinator}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="coordinator_email"
                    value={formData.coordinator_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="coordinator_phone"
                    value={formData.coordinator_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information or recent updates..."
              />
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
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Update Program</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgram;