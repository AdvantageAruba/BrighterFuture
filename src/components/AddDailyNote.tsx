import React, { useState } from 'react';
import { X, Save, User, MessageSquare, Tag, Calendar, Phone, AlertTriangle } from 'lucide-react';

interface AddDailyNoteProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDailyNote: React.FC<AddDailyNoteProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    program: '',
    studentId: '',
    category: 'behavior',
    overallMood: 'neutral',
    generalNotes: '',
    behaviorNotes: '',
    academicProgress: '',
    socialInteraction: '',
    activitiesParticipated: '',
    achievementsSuccesses: '',
    concernsChallenges: '',
    tags: '',
    priority: 'medium',
    parentContacted: false,
    parentContactNotes: '',
    followUpNeeded: false,
    followUpAssignee: ''
  });

  const programs = [
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'consultancy', name: 'Consultancy' },
    { id: 'individual-therapy', name: 'Individual Therapy' }
  ];

  // Students organized by program
  const studentsByProgram = {
    'academy': [
      { id: 1, name: 'Emma Rodriguez', age: 8 },
      { id: 4, name: 'Alex Thompson', age: 7 },
      { id: 5, name: 'Sophie Martinez', age: 9 },
      { id: 6, name: 'James Wilson', age: 8 }
    ],
    'first-steps': [
      { id: 2, name: 'Michael Chen', age: 6 },
      { id: 7, name: 'Olivia Davis', age: 5 },
      { id: 8, name: 'Lucas Brown', age: 6 }
    ],
    'individual-therapy': [
      { id: 3, name: 'Isabella Garcia', age: 10 },
      { id: 9, name: 'Ethan Johnson', age: 9 },
      { id: 10, name: 'Ava Miller', age: 11 }
    ],
    'consultancy': [
      { id: 11, name: 'Noah Anderson', age: 8 },
      { id: 12, name: 'Mia Taylor', age: 7 }
    ]
  };

  const moods = [
    { id: 'very-happy', name: 'Very Happy', emoji: '😄' },
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'neutral', name: 'Neutral', emoji: '😐' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'frustrated', name: 'Frustrated', emoji: '😤' },
    { id: 'anxious', name: 'Anxious', emoji: '😰' },
    { id: 'excited', name: 'Excited', emoji: '🤩' },
    { id: 'tired', name: 'Tired', emoji: '😴' }
  ];

  const categories = [
    { id: 'behavior', name: 'Behavior' },
    { id: 'academic', name: 'Academic' },
    { id: 'therapy', name: 'Therapy' },
    { id: 'social', name: 'Social' },
    { id: 'medical', name: 'Medical' }
  ];

  const priorities = [
    { id: 'low', name: 'Low Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'high', name: 'High Priority' }
  ];

  const followUpAssignees = [
    { id: 'teacher', name: 'Classroom Teacher' },
    { id: 'therapist', name: 'Therapist' },
    { id: 'coordinator', name: 'Program Coordinator' },
    { id: 'administrator', name: 'Administrator' },
    { id: 'parent', name: 'Parent/Guardian' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Reset student selection when program changes
    if (name === 'program') {
      setFormData(prev => ({
        ...prev,
        studentId: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Daily note data:', formData);
    alert('Daily note added successfully!');
    onClose();
  };

  const getAvailableStudents = () => {
    if (!formData.program) return [];
    return studentsByProgram[formData.program as keyof typeof studentsByProgram] || [];
  };

  const getSelectedStudentName = () => {
    const students = getAvailableStudents();
    const student = students.find(s => s.id.toString() === formData.studentId);
    return student ? student.name : '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Daily Note</h2>
            <p className="text-gray-600">Record comprehensive observations and student progress</p>
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
            {/* Student and Program Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Student Information</span>
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
                    <option value="">Select program first...</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student *</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.program}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.program ? 'Select student...' : 'Select program first'}
                    </option>
                    {getAvailableStudents().map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} (Age {student.age})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Overall Mood and Category */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Mood *</label>
                  <select
                    name="overallMood"
                    value={formData.overallMood}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {moods.map((mood) => (
                      <option key={mood.id} value={mood.id}>
                        {mood.emoji} {mood.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
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
              </div>
            </div>

            {/* Note Sections */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Detailed Observations</span>
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">General Notes</label>
                    <textarea
                      name="generalNotes"
                      value={formData.generalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Overall observations and general notes about the student's day..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Behavior Notes</label>
                    <textarea
                      name="behaviorNotes"
                      value={formData.behaviorNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Behavioral observations, responses to interventions, emotional regulation..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Academic Progress</label>
                    <textarea
                      name="academicProgress"
                      value={formData.academicProgress}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Learning achievements, skill development, academic challenges..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Interaction</label>
                    <textarea
                      name="socialInteraction"
                      value={formData.socialInteraction}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Peer interactions, communication skills, social participation..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activities Participated In</label>
                    <textarea
                      name="activitiesParticipated"
                      value={formData.activitiesParticipated}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List activities, level of participation, engagement level..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Achievements and Successes</label>
                    <textarea
                      name="achievementsSuccesses"
                      value={formData.achievementsSuccesses}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Celebrate wins, milestones reached, positive moments..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Concerns & Challenges</label>
                  <textarea
                    name="concernsChallenges"
                    value={formData.concernsChallenges}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Areas of concern, challenges faced, strategies needed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas (e.g., positive behavior, improvement, attention)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                </div>
              </div>
            </div>

            {/* Parent Contact and Follow-up */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Communication & Follow-up</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="parentContacted"
                    checked={formData.parentContacted}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Parent or Guardian has been contacted
                  </label>
                </div>

                {formData.parentContacted && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Contact Notes</label>
                    <textarea
                      name="parentContactNotes"
                      value={formData.parentContactNotes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the conversation with parent/guardian, their response, any concerns discussed..."
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="followUpNeeded"
                    checked={formData.followUpNeeded}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Follow-up is needed for this note
                  </label>
                </div>

                {formData.followUpNeeded && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Follow-up To</label>
                    <select
                      name="followUpAssignee"
                      value={formData.followUpAssignee}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select who should follow up...</option>
                      {followUpAssignees.map((assignee) => (
                        <option key={assignee.id} value={assignee.id}>
                          {assignee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDailyNote;