import React, { useState } from 'react';
import { ArrowLeft, Save, User, Phone, Mail, Calendar, MapPin, FileText } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useWaitingList } from '../hooks/useWaitingList';
import PictureUpload from './PictureUpload';

interface AddStudentProps {
  onBack: () => void;
  onStudentAdded?: () => void; // Callback when student is successfully added
  prefillData?: any; // Add support for pre-filling data from waiting list
  onWaitingListEntryDeleted?: () => void; // Callback when waiting list entry is deleted
}

const AddStudent: React.FC<AddStudentProps> = ({ onBack, onStudentAdded, prefillData, onWaitingListEntryDeleted }) => {
  const [formData, setFormData] = useState({
    firstName: prefillData?.first_name || '',
    lastName: prefillData?.last_name || '',
    dateOfBirth: prefillData?.date_of_birth || '',
    age: prefillData?.age ? prefillData.age.toString() : '',
    gender: '',
    program: prefillData?.program || '',
    classId: '', // Changed from className to classId
    teacher: '',
    parentName: prefillData?.parent_name || '',
    parentPhone: prefillData?.parent_phone || '',
    parentEmail: prefillData?.parent_email || '',
    address: prefillData?.address || '',
    emergencyContact: prefillData?.emergency_contact || '',
    emergencyPhone: prefillData?.emergency_phone || '',
    medicalConditions: '',
    allergies: '',
    notes: prefillData?.notes || prefillData?.reason_for_waiting || '',
    status: 'active'
  });

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use real data from Supabase
  const { 
    programs: supabasePrograms, 
    classes: supabaseClasses,
    teachers: supabaseTeachers,
    getClassesByProgram,
    getTeacherName,
    addStudent, 
    uploadStudentPicture 
  } = useStudents();

  // Use waiting list hook for deleting entries
  const { deleteWaitingListEntry } = useWaitingList();

  // Transform programs for UI
  const programs = supabasePrograms.map(p => ({ 
    id: p.id.toString(), 
    name: p.name 
  }));

  // Get classes for the selected program
  const availableClasses = formData.program ? getClassesByProgram(parseInt(formData.program)) : [];
  
  // Get teacher for the selected class
  const selectedClass = availableClasses.find(cls => cls.id.toString() === formData.classId);
  const assignedTeacher = selectedClass && selectedClass.teacher_id ? getTeacherName(selectedClass.teacher_id) : 'No teacher assigned';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Automatically calculate age when date of birth changes
      if (name === 'dateOfBirth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        newData.age = age.toString();
      }
      
      // Reset class selection when program changes
      if (name === 'program') {
        newData.classId = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender || !formData.program || !formData.emergencyContact || !formData.emergencyPhone) {
        alert('Please fill in all required fields including emergency contact information');
        setIsSubmitting(false);
        return;
      }

      // Prepare student data for Supabase
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.parentEmail || '',
        phone: formData.parentPhone || '',
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender || '',
        program_id: parseInt(formData.program),
        status: formData.status,
        enrollment_date: new Date().toISOString().split('T')[0],
        notes: formData.notes || '',
        // Additional fields for comprehensive student information
        parent_name: formData.parentName || '',
        address: formData.address || '',
        emergency_contact: formData.emergencyContact || '',
        emergency_phone: formData.emergencyPhone || '',
        medical_conditions: formData.medicalConditions || '',
        allergies: formData.allergies || '',
        class_name: selectedClass?.name || '',
        class_id: selectedClass?.id || null,
        teacher: assignedTeacher || ''
      };

      // Save to Supabase
      const result = await addStudent(studentData);
      
      if (result.success) {
        console.log('Student added successfully:', result.data);
        
        // Upload picture if one was selected
        if (selectedPicture && result.data) {
          const pictureResult = await uploadStudentPicture(result.data.id, selectedPicture);
          if (!pictureResult.success) {
            console.warn('Student created but picture upload failed:', pictureResult.error);
            alert('Student created successfully, but picture upload failed. You can add a picture later.');
          }
        }
        
        alert('Student added successfully!');
        
        // If this was an enrollment from waiting list, delete the waiting list entry
        if (prefillData && prefillData.id) {
          const deleteResult = await deleteWaitingListEntry(prefillData.id);
          if (deleteResult.success) {
            console.log('Waiting list entry deleted successfully');
            // Call the callback to notify parent component about waiting list deletion
            if (onWaitingListEntryDeleted) {
              onWaitingListEntryDeleted();
            }
          } else {
            console.warn('Student enrolled but waiting list entry deletion failed:', deleteResult.error);
            alert('Student enrolled successfully, but failed to remove from waiting list. You can manually remove them later.');
          }
        }
        
        // Call the callback to notify parent component
        if (onStudentAdded) {
          onStudentAdded();
        }
        onBack();
      } else {
        alert(`Failed to add student: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-h-[95vh]">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{prefillData ? 'Enroll Student from Waiting List' : 'Add New Student'}</h2>
          <p className="text-gray-600">{prefillData ? 'Complete enrollment for student from waiting list' : 'Enter student information and enrollment details'}</p>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <form onSubmit={handleSubmit} className="space-y-8">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (Calculated)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  readOnly
                  min="1"
                  max="18"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  placeholder="Enter date of birth to calculate age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Program Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Program Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program *</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a program...</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  disabled={!formData.program}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a class...</option>
                  {availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {assignedTeacher && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Assigned Teacher:</strong> {assignedTeacher}
                </p>
              </div>
            )}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
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

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Emergency Contact</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone *</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Student Picture */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Picture</h3>
            <PictureUpload
              selectedPicture={selectedPicture}
              onPictureSelected={setSelectedPicture}
            />
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Medical Information</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any medical conditions or special needs..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any known allergies..."
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
              placeholder="Any additional information about the student..."
            />
          </div>

          {/* Student Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                  <p className="text-sm text-blue-800">
                    <strong>Active:</strong> Student is currently enrolled and receiving services
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Inactive:</strong> Student is not currently receiving services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? (prefillData ? 'Enrolling Student...' : 'Adding Student...') : (prefillData ? 'Enroll Student' : 'Add Student')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;