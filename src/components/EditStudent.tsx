import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Phone, Mail, Calendar, MapPin, FileText } from 'lucide-react';
import PictureUpload from './PictureUpload';
import { useClasses } from '../hooks/useClasses';
import { useStudents } from '../hooks/useStudents';

interface EditStudentProps {
  student: any;
  onBack: () => void;
  onStudentUpdated?: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ student, onBack, onStudentUpdated }) => {
  const { programs, classes, teachers, loading } = useClasses();
  const { updateStudent } = useStudents();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '2016-03-15',
    age: '',
    gender: '',
    program: '',
    className: '',
    teacher: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    allergies: '',
    notes: '',
    status: 'active'
  });

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Debug: Log the student object to see what data is available
  useEffect(() => {
    console.log('EditStudent - Student object received:', student);
    console.log('EditStudent - Available fields:', Object.keys(student));
    console.log('EditStudent - Program:', student.program);
    console.log('EditStudent - Program ID:', student.program_id);
    console.log('EditStudent - Class ID:', student.class_id);
    console.log('EditStudent - Parent name:', student.parent_name);
    console.log('EditStudent - Phone:', student.phone);
    console.log('EditStudent - Email:', student.email);
    console.log('EditStudent - Original data:', student.originalData);
  }, [student]);

  // Update form data when student data changes
  useEffect(() => {
    if (student) {
      // Use originalData if available, otherwise fall back to student object
      const studentData = student.originalData || student;
      
      setFormData({
        firstName: studentData.name?.split(' ')[0] || '',
        lastName: studentData.name?.split(' ')[1] || '',
        dateOfBirth: studentData.date_of_birth || '2016-03-15',
        age: studentData.age?.toString() || '',
        gender: studentData.gender || '',
        program: studentData.program_id ? studentData.program_id.toString() : (studentData.program || ''),
        className: studentData.class_id ? studentData.class_id.toString() : '',
        teacher: studentData.teacher || '',
        parentName: studentData.parent_name || '',
        parentPhone: studentData.phone || '',
        parentEmail: studentData.email || '',
        address: studentData.address || '',
        emergencyContact: studentData.emergency_contact || '',
        emergencyPhone: studentData.emergency_phone || '',
        medicalConditions: studentData.medical_conditions || '',
        allergies: studentData.allergies || '',
        notes: studentData.notes || '',
        status: studentData.status || 'active'
      });
    }
  }, [student]);

  // Filter classes based on selected program
  const filteredClasses = classes.filter(cls => 
    !formData.program || cls.program_id?.toString() === formData.program
  );

  // Filter teachers based on selected class
  const filteredTeachers = teachers.filter(teacher => {
    if (formData.className) {
      const selectedClass = classes.find(cls => cls.id.toString() === formData.className);
      return selectedClass && selectedClass.teacher_id === teacher.id;
    } else if (formData.program) {
      return teacher.department?.toString() === formData.program;
    }
    return false;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'className') {
      const selectedClass = classes.find(cls => cls.id.toString() === value);
      const classTeacher = selectedClass ? teachers.find(teacher => teacher.id === selectedClass.teacher_id) : null;
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        teacher: classTeacher ? `${classTeacher.first_name} ${classTeacher.last_name}` : ''
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
    setSubmitError(null);

    try {
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        gender: formData.gender,
        program_id: formData.program ? parseInt(formData.program) : undefined,
        class_id: formData.className ? parseInt(formData.className) : undefined,
        teacher: formData.teacher,
        status: formData.status,
        
        // Parent/Guardian Information
        parent_name: formData.parentName,
        phone: formData.parentPhone,
        email: formData.parentEmail,
        address: formData.address,
        
        // Emergency Contact Information
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        
        // Medical Information
        medical_conditions: formData.medicalConditions,
        allergies: formData.allergies,
        
        // Additional Notes
        notes: formData.notes,
        
        updated_at: new Date().toISOString()
      };

      const result = await updateStudent(student.id, updateData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update student');
      }

      console.log('Student updated successfully:', result.data);
      alert('Student information updated successfully!');
      
      if (onStudentUpdated) {
        onStudentUpdated();
      }
      
      onBack();
      
    } catch (error) {
      console.error('Error updating student:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Students</span>
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
        <p className="text-gray-600 mt-2">Update {student.name}'s information and enrollment details</p>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (Display Only)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Age is calculated from date of birth</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Picture</span>
            </h3>
            <div className="max-w-md">
              <PictureUpload
                currentPicture={student.picture_url}
                onPictureChange={setSelectedPicture}
                size="md"
              />
            </div>
          </div>

          {/* Program Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Program Enrollment</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Program *</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select program...</option>
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
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  disabled={!formData.program}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.program ? 'Select class...' : 'Select program first'}
                  </option>
                  {filteredClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  disabled={!formData.program}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.program ? 'Select teacher...' : 'Select program first'}
                  </option>
                  {filteredTeachers.map((teacher) => (
                    <option key={teacher.id} value={`${teacher.first_name} ${teacher.last_name}`}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Medical Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Additional Notes</span>
            </h3>
            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any additional notes about the student..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
