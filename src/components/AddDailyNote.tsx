import React, { useState, useEffect } from 'react';
import { X, Save, User, MessageSquare, Tag, Calendar, Phone, AlertTriangle } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useDailyNotes } from '../hooks/useDailyNotes';

interface AddDailyNoteProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentId?: number; // Add this prop for pre-selecting a student
  onNoteAdded?: () => void; // Add callback for when note is successfully added
  editNote?: any; // Add this prop for editing an existing note
  isEditMode?: boolean; // Add this prop to indicate if we're in edit mode
}

const AddDailyNote: React.FC<AddDailyNoteProps> = ({ isOpen, onClose, selectedStudentId, onNoteAdded, editNote, isEditMode = false }) => {
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

  // Pre-populate form when a student is selected
  useEffect(() => {
    if (selectedStudentId) {
      // Find the student's program based on the student ID
      let studentProgram = '';
      
      for (const [program, students] of Object.entries(studentsByProgram)) {
        const student = students.find((s: any) => s.id === selectedStudentId);
        if (student) {
          studentProgram = program;
          break;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        program: studentProgram,
        studentId: selectedStudentId.toString()
      }));
    }
  }, [selectedStudentId]);

  // Pre-populate form when editing a note
  useEffect(() => {
    if (isEditMode && editNote) {
      try {
        // Parse the note data from the JSON string
        const parsedNoteData = editNote.parsedData || JSON.parse(editNote.note);
        
        setFormData({
          program: editNote.program || '',
          studentId: editNote.id?.toString() || '',
          category: parsedNoteData.category || 'behavior',
          overallMood: parsedNoteData.overallMood || 'neutral',
          generalNotes: parsedNoteData.generalNotes || '',
          behaviorNotes: parsedNoteData.behaviorNotes || '',
          academicProgress: parsedNoteData.academicProgress || '',
          socialInteraction: parsedNoteData.socialInteraction || '',
          activitiesParticipated: parsedNoteData.activitiesParticipated || '',
          achievementsSuccesses: parsedNoteData.achievementsSuccesses || '',
          concernsChallenges: parsedNoteData.concernsChallenges || '',
          tags: parsedNoteData.tags?.join(', ') || '',
          priority: parsedNoteData.priority || 'medium',
          parentContacted: parsedNoteData.parentContacted || false,
          parentContactNotes: parsedNoteData.parentContactNotes || '',
          followUpNeeded: parsedNoteData.followUpNeeded || false,
          followUpAssignee: parsedNoteData.followUpAssignee || ''
        });
      } catch (error) {
        console.error('Error parsing note data for editing:', error);
        // Fallback to basic data
        setFormData(prev => ({
          ...prev,
          program: editNote.program || '',
          studentId: editNote.id?.toString() || '',
          generalNotes: editNote.note || ''
        }));
      }
    }
  }, [isEditMode, editNote]);

  // Use real data from Supabase
  const { programs: supabasePrograms, students: supabaseStudents } = useStudents();
  const { addDailyNote, updateDailyNote } = useDailyNotes();

  // Transform programs for UI
  const programs = supabasePrograms.map(p => ({ 
    id: p.id.toString(), 
    name: p.name 
  }));

  // Students organized by program using real data
  const studentsByProgram = supabasePrograms.reduce((acc, program) => {
    const programStudents = supabaseStudents.filter(student => student.program_id === program.id);
    acc[program.id.toString()] = programStudents.map(student => ({
      id: student.id,
      name: student.name,
      age: student.date_of_birth ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear() : 0
    }));
    return acc;
  }, {} as Record<string, any[]>);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.program || !formData.studentId) {
      alert('Please select a program and student');
      return;
    }

    try {
      let selectedStudent, selectedProgram;
      
      if (isEditMode && editNote) {
        // In edit mode, use the original note data
        selectedStudent = {
          id: parseInt(formData.studentId),
          name: editNote.studentName
        };
        selectedProgram = {
          id: parseInt(formData.program),
          name: editNote.programName
        };
      } else {
        // In add mode, find from the current data
        selectedStudent = supabaseStudents.find(s => s.id === parseInt(formData.studentId));
        selectedProgram = supabasePrograms.find(p => p.id === parseInt(formData.program));
        
        if (!selectedStudent || !selectedProgram) {
          alert('Student or program not found');
          return;
        }
      }

      // Prepare note data for Supabase using the correct interface
      const noteData = {
        student_id: parseInt(formData.studentId),
        student_name: selectedStudent.name,
        program_id: parseInt(formData.program),
        program_name: selectedProgram.name,
        author_id: 'current-user', // Will be updated when user authentication is implemented
        author_name: 'Current User', // Will be updated when user authentication is implemented
        date: new Date().toISOString().split('T')[0],  // Changed from note_date to date
        notes: JSON.stringify({
          category: formData.category,
          overallMood: formData.overallMood,
          generalNotes: formData.generalNotes,
          behaviorNotes: formData.behaviorNotes,
          academicProgress: formData.academicProgress,
          socialInteraction: formData.socialInteraction,
          activitiesParticipated: formData.activitiesParticipated,
          achievementsSuccesses: formData.achievementsSuccesses,
          concernsChallenges: formData.concernsChallenges,
          priority: formData.priority,
          parentContacted: formData.parentContacted,
          parentContactNotes: formData.parentContactNotes,
          followUpNeeded: formData.followUpNeeded,
          followUpAssignee: formData.followUpAssignee
        }),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      let result;
      
      if (isEditMode && editNote) {
        // Update existing note - only update the notes field and tags
        const updateData = {
          notes: JSON.stringify({
            category: formData.category,
            overallMood: formData.overallMood,
            generalNotes: formData.generalNotes,
            behaviorNotes: formData.behaviorNotes,
            academicProgress: formData.academicProgress,
            socialInteraction: formData.socialInteraction,
            activitiesParticipated: formData.activitiesParticipated,
            achievementsSuccesses: formData.achievementsSuccesses,
            concernsChallenges: formData.concernsChallenges,
            priority: formData.priority,
            parentContacted: formData.parentContacted,
            parentContactNotes: formData.parentContactNotes,
            followUpNeeded: formData.followUpNeeded,
            followUpAssignee: formData.followUpAssignee
          }),
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        };
        
        result = await updateDailyNote(editNote.id, updateData);
        
        if (result.success) {
          console.log('Daily note updated successfully');
          alert('Daily note updated successfully!');
        } else {
          alert('Failed to update daily note. Please try again.');
          return;
        }
      } else {
        // Add new note
        result = await addDailyNote(noteData);
        
        if (result.success) {
          console.log('Daily note added successfully');
          alert('Daily note added successfully!');
        } else {
          alert('Failed to add daily note. Please try again.');
          return;
        }
      }
      
      // Call the callback to refresh the parent component
      if (onNoteAdded) {
        onNoteAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving daily note:', error);
      alert('Failed to save daily note. Please try again.');
    }
  };

  const getAvailableStudents = () => {
    if (!formData.program) return [];
    return studentsByProgram[formData.program as keyof typeof studentsByProgram] || [];
  };

  const getAllStudents = () => {
    return Object.values(studentsByProgram).flat();
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
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Daily Note' : (selectedStudentId ? `Add Daily Note for ${studentsByProgram[formData.program as keyof typeof studentsByProgram]?.find((s: any) => s.id === selectedStudentId)?.name || 'Student'}` : 'Add Daily Note')}
            </h2>
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
                  {isEditMode && formData.program ? (
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                      {editNote?.programName || programs.find(p => p.id === formData.program)?.name || 'Unknown Program'}
                    </div>
                  ) : (
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                      disabled={isEditMode}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select program first...</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student *</label>
                  {isEditMode && formData.studentId ? (
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                      {editNote?.studentName || getAllStudents().find(s => s.id.toString() === formData.studentId)?.name || 'Unknown Student'}
                    </div>
                  ) : (
                    <select
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      disabled={isEditMode || !formData.program}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${(isEditMode || !formData.program) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                  )}
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