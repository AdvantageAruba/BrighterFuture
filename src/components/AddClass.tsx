import React, { useState, useEffect } from 'react';
import { X, Save, Users } from 'lucide-react';
import { Class, Program, Teacher } from '../hooks/useClasses';

interface AddClassProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: number; // If provided, pre-select this program
  programs: Program[];
  teachers: Teacher[];
  addClass: (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: Class; error?: string }>;
}

const AddClass: React.FC<AddClassProps> = ({ isOpen, onClose, programId, programs, teachers, addClass }) => {
  const [formData, setFormData] = useState({
    name: '',
    program_id: programId || 0,
    description: '',
    max_capacity: 20,
    status: 'active',
    teacher_id: null as number | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (programId) {
      setFormData(prev => ({ ...prev, program_id: programId }));
    }
  }, [programId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Class name is required');
      return;
    }

    if (!formData.program_id) {
      setError('Please select a program');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Don't generate ID - let the database handle it
      const result = await addClass({
        name: formData.name,
        program_id: formData.program_id,
        description: formData.description,
        max_capacity: formData.max_capacity,
        status: formData.status,
        teacher_id: formData.teacher_id
      });

      if (result.success) {
        // Local state is already updated in the hook
        onClose();
        // Reset form
        setFormData({
          name: '',
          program_id: programId || 0,
          description: '',
          max_capacity: 20,
          status: 'active',
          teacher_id: null
        });
      } else {
        setError(result.error || 'Failed to add class');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_capacity' ? parseInt(value) || 20 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Class</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Class Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Red Class, Class 1, Morning Group"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose a descriptive name for the class (e.g., colors for Academy, numbers for First Steps)
            </p>
          </div>

          <div>
            <label htmlFor="program_id" className="block text-sm font-medium text-gray-700 mb-2">
              Program *
            </label>
            <select
              id="program_id"
              name="program_id"
              value={formData.program_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select a program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the class (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Students
            </label>
            <input
              type="number"
              id="max_capacity"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleInputChange}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="full">Full</option>
            </select>
          </div>

          <div>
            <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-2">
              Assign Teacher
            </label>
            <select
              id="teacher_id"
              name="teacher_id"
              value={formData.teacher_id || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                teacher_id: e.target.value ? parseInt(e.target.value) : null
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No teacher assigned</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select a teacher to assign to this class (optional)
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Add Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
