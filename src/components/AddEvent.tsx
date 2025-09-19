import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { useEvents, Event } from '../hooks/useEvents';
import { useUsers } from '../hooks/useUsers';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { useAuth } from '../contexts/AuthContext';

interface AddEventProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedDate?: string;
  onEventAdded?: (event: Event) => void;
  isEditMode?: boolean;
  existingEvent?: Event | null;
}

const AddEvent: React.FC<AddEventProps> = ({ 
  isOpen = true, 
  onClose, 
  selectedDate, 
  onEventAdded,
  isEditMode = false,
  existingEvent
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    date: selectedDate || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    attendees: '',
    program: '',
    student: '',
    priority: 'medium',
    recurring: false,
    recurringType: 'weekly',
    reminderTime: '15',
    notes: '',
    // New fields for elaborate attendee selection
    attendeeType: 'manual', // 'manual', 'teachers', 'parents', 'administrators', 'therapists', 'coordinators', 'staff', 'multi_role', 'all_users'
    selectedPrograms: [] as number[],
    selectedTeachers: [] as number[],
    selectedParents: [] as number[],
    selectedAdministrators: [] as number[],
    selectedTherapists: [] as number[],
    selectedCoordinators: [] as number[],
    selectedStaff: [] as number[],
    selectedAllUsers: false,
    authorAttending: false // New field for author attendance
  });

  const { addEvent, updateEvent } = useEvents();
  const { userProfile } = useAuth();

  // Get data for attendee selection
  const { users } = useUsers();
  const { programs: studentPrograms } = useStudents();
  const { teachers, programs: classPrograms } = useClasses();

  // Combine programs from both sources and remove duplicates
  const allPrograms = React.useMemo(() => {
    const combined = [...studentPrograms, ...classPrograms];
    const unique = combined.filter((program, index, self) =>
      index === self.findIndex(p => p.id === program.id)
    );
    return unique;
  }, [studentPrograms, classPrograms]);

  // Get users by role
  const parents = React.useMemo(() => {
    return users.filter(user => user.role === 'parent' && user.status === 'active');
  }, [users]);

  const administrators = React.useMemo(() => {
    return users.filter(user => user.role === 'administrator' && user.status === 'active');
  }, [users]);

  const therapists = React.useMemo(() => {
    return users.filter(user => user.role === 'therapist' && user.status === 'active');
  }, [users]);

  const coordinators = React.useMemo(() => {
    return users.filter(user => user.role === 'coordinator' && user.status === 'active');
  }, [users]);

  const staff = React.useMemo(() => {
    return users.filter(user => user.role === 'staff' && user.status === 'active');
  }, [users]);

  // Initialize form with existing event data when in edit mode
  useEffect(() => {
    if (isEditMode && existingEvent) {
      // Check if the current user (author) is already in the attendees list
      const attendees = existingEvent.attendees || '';
      const userFullName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : '';
      const isAuthorAlreadyAttending = attendees.toLowerCase().includes(userFullName.toLowerCase());
      
      setFormData({
        title: existingEvent.title,
        type: existingEvent.type,
        date: existingEvent.date,
        startTime: existingEvent.start_time,
        endTime: existingEvent.end_time,
        location: existingEvent.location || '',
        description: existingEvent.description || '',
        attendees: existingEvent.attendees || '',
        program: existingEvent.program_name || '',
        student: existingEvent.student_name || '',
        priority: existingEvent.priority,
        recurring: existingEvent.recurring,
        recurringType: existingEvent.recurring_type || 'weekly',
        reminderTime: existingEvent.reminder_minutes?.toString() || '15',
        notes: existingEvent.notes || '',
        // Reset new fields for edit mode
        attendeeType: 'manual',
        selectedPrograms: [],
        selectedTeachers: [],
        selectedParents: [],
        selectedAdministrators: [],
        selectedTherapists: [],
        selectedCoordinators: [],
        selectedStaff: [],
        selectedAllUsers: false,
        authorAttending: isAuthorAlreadyAttending // Preserve existing attendance status
      });
    }
  }, [isEditMode, existingEvent, userProfile]);

  const eventTypes = [
    { id: 'meeting', name: 'Meeting', color: 'blue' },
    { id: 'therapy', name: 'Therapy Session', color: 'green' },
    { id: 'assessment', name: 'Assessment', color: 'purple' },
    { id: 'consultation', name: 'Consultation', color: 'orange' },
    { id: 'training', name: 'Training', color: 'indigo' },
    { id: 'other', name: 'Other', color: 'gray' }
  ];

  const programs = [ // This is a local mock, `allPrograms` from hooks should be used for selection
    { id: 'academy', name: 'Brighter Future Academy' },
    { id: 'first-steps', name: 'First Steps' },
    { id: 'individual-therapy', name: 'Individual Therapy' },
    { id: 'consultancy', name: 'Consultancy' }
  ];

  const priorities = [
    { id: 'low', name: 'Low Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'high', name: 'High Priority' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Helper functions for attendee selection
  const handleAttendeeTypeChange = (attendeeType: string) => {
    setFormData(prev => ({
      ...prev,
      attendeeType,
      selectedPrograms: [],
      selectedTeachers: [],
      selectedParents: [],
      selectedAdministrators: [],
      selectedTherapists: [],
      selectedCoordinators: [],
      selectedStaff: [],
      selectedAllUsers: false
    }));
  };

  const handleProgramToggle = (programId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedPrograms: prev.selectedPrograms.includes(programId)
        ? prev.selectedPrograms.filter(id => id !== programId)
        : [...prev.selectedPrograms, programId]
    }));
  };

  const handleTeacherToggle = (teacherId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherId)
        ? prev.selectedTeachers.filter(id => id !== teacherId)
        : [...prev.selectedTeachers, teacherId]
    }));
  };

  const handleParentToggle = (parentId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedParents: prev.selectedParents.includes(parentId)
        ? prev.selectedParents.filter(id => id !== parentId)
        : [...prev.selectedParents, parentId]
    }));
  };

  const handleAdministratorToggle = (adminId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedAdministrators: prev.selectedAdministrators.includes(adminId)
        ? prev.selectedAdministrators.filter(id => id !== adminId)
        : [...prev.selectedAdministrators, adminId]
    }));
  };

  const handleTherapistToggle = (therapistId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTherapists: prev.selectedTherapists.includes(therapistId)
        ? prev.selectedTherapists.filter(id => id !== therapistId)
        : [...prev.selectedTherapists, therapistId]
    }));
  };

  const handleCoordinatorToggle = (coordinatorId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedCoordinators: prev.selectedCoordinators.includes(coordinatorId)
        ? prev.selectedCoordinators.filter(id => id !== coordinatorId)
        : [...prev.selectedCoordinators, coordinatorId]
    }));
  };

  const handleStaffToggle = (staffId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedStaff: prev.selectedStaff.includes(staffId)
        ? prev.selectedStaff.filter(id => id !== staffId)
        : [...prev.selectedStaff, staffId]
    }));
  };

  // Select All functionality for each role
  const handleSelectAllTeachers = () => {
    const allTeacherIds = teachers.map(teacher => teacher.id);
    setFormData(prev => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.length === teachers.length ? [] : allTeacherIds
    }));
  };

  const handleSelectAllParents = () => {
    const allParentIds = parents.map(parent => parent.id);
    setFormData(prev => ({
      ...prev,
      selectedParents: prev.selectedParents.length === parents.length ? [] : allParentIds
    }));
  };

  const handleSelectAllAdministrators = () => {
    const allAdminIds = administrators.map(admin => admin.id);
    setFormData(prev => ({
      ...prev,
      selectedAdministrators: prev.selectedAdministrators.length === administrators.length ? [] : allAdminIds
    }));
  };

  const handleSelectAllTherapists = () => {
    const allTherapistIds = therapists.map(therapist => therapist.id);
    setFormData(prev => ({
      ...prev,
      selectedTherapists: prev.selectedTherapists.length === therapists.length ? [] : allTherapistIds
    }));
  };

  const handleSelectAllCoordinators = () => {
    const allCoordinatorIds = coordinators.map(coordinator => coordinator.id);
    setFormData(prev => ({
      ...prev,
      selectedCoordinators: prev.selectedCoordinators.length === coordinators.length ? [] : allCoordinatorIds
    }));
  };

  const handleSelectAllStaff = () => {
    const allStaffIds = staff.map(staffMember => staffMember.id);
    setFormData(prev => ({
      ...prev,
      selectedStaff: prev.selectedStaff.length === staff.length ? [] : allStaffIds
    }));
  };

  const handleSelectAllPrograms = () => {
    const allProgramIds = allPrograms.map(program => program.id);
    setFormData(prev => ({
      ...prev,
      selectedPrograms: prev.selectedPrograms.length === allPrograms.length ? [] : allProgramIds
    }));
  };

  const handleSelectAllUsers = () => {
    setFormData(prev => ({
      ...prev,
      selectedAllUsers: !prev.selectedAllUsers
    }));
  };

  // Generate attendees string based on selections
  const generateAttendeesString = () => {
    if (formData.attendeeType === 'manual') {
      // For manual entry, handle author attendance properly
      let attendeesList: string[] = [];
      
      if (formData.attendees) {
        attendeesList = formData.attendees.split(', ').filter(attendee => attendee.trim() !== '');
      }
      
      // Handle author attendance for manual entry
      if (userProfile) {
        const authorName = `${userProfile.first_name} ${userProfile.last_name}`;
        
        if (formData.authorAttending) {
          // Add author if not already in the list
          if (!attendeesList.some(attendee => attendee.toLowerCase().includes(authorName.toLowerCase()))) {
            attendeesList.push(authorName);
          }
        } else {
          // Remove author from the list
          attendeesList = attendeesList.filter(attendee => 
            !attendee.toLowerCase().includes(authorName.toLowerCase())
          );
        }
      }
      
      return attendeesList.join(', ');
    }

    let attendeesList: string[] = [];

    if (formData.attendeeType === 'teachers') {
      // Add selected teachers
      const selectedTeacherNames = teachers
        .filter(teacher => formData.selectedTeachers.includes(teacher.id))
        .map(teacher => `${teacher.first_name} ${teacher.last_name}`);
      attendeesList.push(...selectedTeacherNames);

      // Add programs
      const selectedProgramNames = allPrograms
        .filter(program => formData.selectedPrograms.includes(program.id))
        .map(program => program.name);
      attendeesList.push(...selectedProgramNames);
    } else if (formData.attendeeType === 'parents') {
      // Add selected parents
      const selectedParentNames = parents
        .filter(parent => formData.selectedParents.includes(parent.id))
        .map(parent => `${parent.first_name} ${parent.last_name}`);
      attendeesList.push(...selectedParentNames);
    } else if (formData.attendeeType === 'administrators') {
      // Add selected administrators
      const selectedAdminNames = administrators
        .filter(admin => formData.selectedAdministrators.includes(admin.id))
        .map(admin => `${admin.first_name} ${admin.last_name}`);
      attendeesList.push(...selectedAdminNames);
    } else if (formData.attendeeType === 'therapists') {
      // Add selected therapists
      const selectedTherapistNames = therapists
        .filter(therapist => formData.selectedTherapists.includes(therapist.id))
        .map(therapist => `${therapist.first_name} ${therapist.last_name}`);
      attendeesList.push(...selectedTherapistNames);
    } else if (formData.attendeeType === 'coordinators') {
      // Add selected coordinators
      const selectedCoordinatorNames = coordinators
        .filter(coordinator => formData.selectedCoordinators.includes(coordinator.id))
        .map(coordinator => `${coordinator.first_name} ${coordinator.last_name}`);
      attendeesList.push(...selectedCoordinatorNames);
    } else if (formData.attendeeType === 'staff') {
      // Add selected staff
      const selectedStaffNames = staff
        .filter(staffMember => formData.selectedStaff.includes(staffMember.id))
        .map(staffMember => `${staffMember.first_name} ${staffMember.last_name}`);
      attendeesList.push(...selectedStaffNames);
    } else if (formData.attendeeType === 'all_users') {
      // Add all active users
      if (formData.selectedAllUsers) {
        const allUserNames = users
          .filter(user => user.status === 'active')
          .map(user => `${user.first_name} ${user.last_name}`);
        attendeesList.push(...allUserNames);
      }
    } else if (formData.attendeeType === 'multi_role') {
      // Add selected users from multiple roles
      const selectedTeacherNames = teachers
        .filter(teacher => formData.selectedTeachers.includes(teacher.id))
        .map(teacher => `${teacher.first_name} ${teacher.last_name} (Teacher)`);
      attendeesList.push(...selectedTeacherNames);

      const selectedParentNames = parents
        .filter(parent => formData.selectedParents.includes(parent.id))
        .map(parent => `${parent.first_name} ${parent.last_name} (Parent)`);
      attendeesList.push(...selectedParentNames);

      const selectedAdminNames = administrators
        .filter(admin => formData.selectedAdministrators.includes(admin.id))
        .map(admin => `${admin.first_name} ${admin.last_name} (Administrator)`);
      attendeesList.push(...selectedAdminNames);

      const selectedTherapistNames = therapists
        .filter(therapist => formData.selectedTherapists.includes(therapist.id))
        .map(therapist => `${therapist.first_name} ${therapist.last_name} (Therapist)`);
      attendeesList.push(...selectedTherapistNames);

      const selectedCoordinatorNames = coordinators
        .filter(coordinator => formData.selectedCoordinators.includes(coordinator.id))
        .map(coordinator => `${coordinator.first_name} ${coordinator.last_name} (Coordinator)`);
      attendeesList.push(...selectedCoordinatorNames);

      const selectedStaffNames = staff
        .filter(staffMember => formData.selectedStaff.includes(staffMember.id))
        .map(staffMember => `${staffMember.first_name} ${staffMember.last_name} (Staff)`);
      attendeesList.push(...selectedStaffNames);

      // Add programs if any are selected
      const selectedProgramNames = allPrograms
        .filter(program => formData.selectedPrograms.includes(program.id))
        .map(program => `${program.name} (Program)`);
      attendeesList.push(...selectedProgramNames);
    }

    // Handle author attendance for all attendee types
    if (userProfile) {
      const authorName = `${userProfile.first_name} ${userProfile.last_name}`;
      
      if (formData.authorAttending) {
        // Add author if not already in the list
        if (!attendeesList.some(attendee => attendee.toLowerCase().includes(authorName.toLowerCase()))) {
          attendeesList.push(authorName);
        }
      } else {
        // Remove author from the list
        attendeesList = attendeesList.filter(attendee => 
          !attendee.toLowerCase().includes(authorName.toLowerCase())
        );
      }
    }

    return attendeesList.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        title: formData.title,
        type: formData.type,
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location || undefined,
        description: formData.description || undefined,
        attendees: generateAttendeesString() || undefined,
        program_name: formData.program || undefined,
        student_name: formData.student || undefined,
        priority: formData.priority,
        recurring: formData.recurring,
        recurring_type: formData.recurring ? formData.recurringType : undefined,
        reminder_minutes: parseInt(formData.reminderTime),
        notes: formData.notes || undefined
      };

      let result;
      if (isEditMode && existingEvent) {
        // Transform form data to match database schema for updates
        const updateData = {
          title: formData.title,
          type: formData.type,
          date: formData.date,
          start_time: formData.startTime,
          end_time: formData.endTime,
          location: formData.location || undefined,
          description: formData.description || undefined,
          attendees: generateAttendeesString() || undefined,
          program_name: formData.program || undefined,
          student_name: formData.student || undefined,
          priority: formData.priority,
          recurring: formData.recurring,
          recurring_type: formData.recurring ? formData.recurringType : undefined,
          reminder_minutes: parseInt(formData.reminderTime),
          notes: formData.notes || undefined
        };
        result = await updateEvent(existingEvent.id, updateData);
      } else {
        result = await addEvent(eventData);
      }

      if (result.success) {
        if ('message' in result && result.message) {
          alert(result.message);
        } else {
          alert('Event saved successfully!');
        }
        if ('data' in result && result.data) {
          onEventAdded?.(result.data);
        }
        onClose?.();
      } else {
        alert(`Failed to save event: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Event' : 'Add New Event'}</h2>
            <p className="text-gray-600">{isEditMode ? 'Modify event details' : 'Schedule a new session, meeting, or activity'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Event Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Event Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {eventTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority.id} value={priority.id}>{priority.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Date & Time</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Location and Attendees */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location & Attendees</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>

                {/* Attendee Type Selection */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    🎯 Attendee Selection Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('manual')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'manual'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Manual Entry</div>
                      <div className="text-xs text-gray-500">Type names manually</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('teachers')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'teachers'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Teachers</div>
                      <div className="text-xs text-gray-500">Select teachers & programs</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('parents')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'parents'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Parents</div>
                      <div className="text-xs text-gray-500">Select specific parents</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('administrators')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'administrators'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Administrators</div>
                      <div className="text-xs text-gray-500">Select administrators</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('therapists')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'therapists'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Therapists</div>
                      <div className="text-xs text-gray-500">Select therapists</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('coordinators')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'coordinators'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Coordinators</div>
                      <div className="text-xs text-gray-500">Select coordinators</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('staff')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'staff'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Support Staff</div>
                      <div className="text-xs text-gray-500">Select support staff</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('multi_role')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'multi_role'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Multi-Role</div>
                      <div className="text-xs text-gray-500">Select from multiple roles</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendeeTypeChange('all_users')}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.attendeeType === 'all_users'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">All Users</div>
                      <div className="text-xs text-gray-500">Select all active users</div>
                    </button>
                  </div>
                </div>

                {/* Manual Attendee Entry */}
                {formData.attendeeType === 'manual' && (
                  <div>
                    <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                      Attendees
                    </label>
                    <input
                      type="text"
                      id="attendees"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Dr. Smith, Parent, Student"
                    />
                  </div>
                )}

                {/* Teacher Selection */}
                {formData.attendeeType === 'teachers' && (
                  <div className="space-y-4">
                    {/* Program Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Programs
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedPrograms.length === allPrograms.length && allPrograms.length > 0}
                            onChange={handleSelectAllPrograms}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Programs ({allPrograms.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allPrograms.map(program => (
                          <label key={program.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedPrograms.includes(program.id)}
                              onChange={() => handleProgramToggle(program.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{program.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Teacher Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Teachers
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedTeachers.length === teachers.length && teachers.length > 0}
                            onChange={handleSelectAllTeachers}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Teachers ({teachers.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {teachers.map(teacher => (
                          <label key={teacher.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedTeachers.includes(teacher.id)}
                              onChange={() => handleTeacherToggle(teacher.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{teacher.first_name} {teacher.last_name}</div>
                              <div className="text-xs text-gray-500">{teacher.department}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Parent Selection */}
                {formData.attendeeType === 'parents' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Parents
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedParents.length === parents.length && parents.length > 0}
                          onChange={handleSelectAllParents}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Select All Parents ({parents.length})</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {parents.map(parent => (
                        <label key={parent.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedParents.includes(parent.id)}
                            onChange={() => handleParentToggle(parent.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{parent.first_name} {parent.last_name}</div>
                            <div className="text-xs text-gray-500">{parent.email}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Administrator Selection */}
                {formData.attendeeType === 'administrators' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Administrators
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedAdministrators.length === administrators.length && administrators.length > 0}
                          onChange={handleSelectAllAdministrators}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Select All Administrators ({administrators.length})</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {administrators.map(admin => (
                        <label key={admin.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedAdministrators.includes(admin.id)}
                            onChange={() => handleAdministratorToggle(admin.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{admin.first_name} {admin.last_name}</div>
                            <div className="text-xs text-gray-500">{admin.department}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Therapist Selection */}
                {formData.attendeeType === 'therapists' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Therapists
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedTherapists.length === therapists.length && therapists.length > 0}
                          onChange={handleSelectAllTherapists}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Select All Therapists ({therapists.length})</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {therapists.map(therapist => (
                        <label key={therapist.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedTherapists.includes(therapist.id)}
                            onChange={() => handleTherapistToggle(therapist.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{therapist.first_name} {therapist.last_name}</div>
                            <div className="text-xs text-gray-500">{therapist.department}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coordinator Selection */}
                {formData.attendeeType === 'coordinators' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Coordinators
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedCoordinators.length === coordinators.length && coordinators.length > 0}
                          onChange={handleSelectAllCoordinators}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Select All Coordinators ({coordinators.length})</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {coordinators.map(coordinator => (
                        <label key={coordinator.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedCoordinators.includes(coordinator.id)}
                            onChange={() => handleCoordinatorToggle(coordinator.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{coordinator.first_name} {coordinator.last_name}</div>
                            <div className="text-xs text-gray-500">{coordinator.department}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staff Selection */}
                {formData.attendeeType === 'staff' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Support Staff
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedStaff.length === staff.length && staff.length > 0}
                          onChange={handleSelectAllStaff}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Select All Staff ({staff.length})</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {staff.map(staffMember => (
                        <label key={staffMember.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedStaff.includes(staffMember.id)}
                            onChange={() => handleStaffToggle(staffMember.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{staffMember.first_name} {staffMember.last_name}</div>
                            <div className="text-xs text-gray-500">{staffMember.department}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multi-Role Selection */}
                {formData.attendeeType === 'multi_role' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-2">
                        🎯 Multi-Role Meeting Selection
                      </div>
                      <div className="text-xs text-blue-600">
                        Perfect for multidisciplinary team meetings! Select individuals from different roles to create comprehensive meeting groups.
                      </div>
                    </div>

                    {/* Programs Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Programs
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedPrograms.length === allPrograms.length && allPrograms.length > 0}
                            onChange={handleSelectAllPrograms}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Programs ({allPrograms.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allPrograms.map(program => (
                          <label key={program.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedPrograms.includes(program.id)}
                              onChange={() => handleProgramToggle(program.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{program.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Teachers Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          👩‍🏫 Select Teachers
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedTeachers.length === teachers.length && teachers.length > 0}
                            onChange={handleSelectAllTeachers}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Teachers ({teachers.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {teachers.map(teacher => (
                          <label key={teacher.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedTeachers.includes(teacher.id)}
                              onChange={() => handleTeacherToggle(teacher.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{teacher.first_name} {teacher.last_name}</div>
                              <div className="text-xs text-gray-500">{teacher.department}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Parents Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          👨‍👩‍👧‍👦 Select Parents
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedParents.length === parents.length && parents.length > 0}
                            onChange={handleSelectAllParents}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Parents ({parents.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {parents.map(parent => (
                          <label key={parent.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedParents.includes(parent.id)}
                              onChange={() => handleParentToggle(parent.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{parent.first_name} {parent.last_name}</div>
                              <div className="text-xs text-gray-500">{parent.email}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Therapists Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          👨‍⚕️ Select Therapists
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedTherapists.length === therapists.length && therapists.length > 0}
                            onChange={handleSelectAllTherapists}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Therapists ({therapists.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {therapists.map(therapist => (
                          <label key={therapist.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedTherapists.includes(therapist.id)}
                              onChange={() => handleTherapistToggle(therapist.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{therapist.first_name} {therapist.last_name}</div>
                              <div className="text-xs text-gray-500">{therapist.department}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Administrators Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          👨‍💼 Select Administrators
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedAdministrators.length === administrators.length && administrators.length > 0}
                            onChange={handleSelectAllAdministrators}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Administrators ({administrators.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {administrators.map(admin => (
                          <label key={admin.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedAdministrators.includes(admin.id)}
                              onChange={() => handleAdministratorToggle(admin.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{admin.first_name} {admin.last_name}</div>
                              <div className="text-xs text-gray-500">{admin.department}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Coordinators Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          👨‍💻 Select Coordinators
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedCoordinators.length === coordinators.length && coordinators.length > 0}
                            onChange={handleSelectAllCoordinators}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Coordinators ({coordinators.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {coordinators.map(coordinator => (
                          <label key={coordinator.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedCoordinators.includes(coordinator.id)}
                              onChange={() => handleCoordinatorToggle(coordinator.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{coordinator.first_name} {coordinator.last_name}</div>
                              <div className="text-xs text-gray-500">{coordinator.department}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Staff Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          👷 Select Support Staff
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                          <input
                            type="checkbox"
                            checked={formData.selectedStaff.length === staff.length && staff.length > 0}
                            onChange={handleSelectAllStaff}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Select All Staff ({staff.length})</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {staff.map(staffMember => (
                          <label key={staffMember.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedStaff.includes(staffMember.id)}
                              onChange={() => handleStaffToggle(staffMember.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="text-sm">
                              <div className="font-medium">{staffMember.first_name} {staffMember.last_name}</div>
                              <div className="text-xs text-gray-500">{staffMember.department}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* All Users Selection */}
                {formData.attendeeType === 'all_users' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select All Active Users
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.selectedAllUsers}
                          onChange={handleSelectAllUsers}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Select All Users ({users.filter(user => user.status === 'active').length})</span>
                      </label>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-800">
                        <div className="font-medium mb-2">📋 User Summary:</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          <div>👨‍💼 Administrators: {administrators.length}</div>
                          <div>👩‍🏫 Teachers: {teachers.length}</div>
                          <div>👨‍⚕️ Therapists: {therapists.length}</div>
                          <div>👨‍💻 Coordinators: {coordinators.length}</div>
                          <div>👨‍👩‍👧‍👦 Parents: {parents.length}</div>
                          <div>👷 Support Staff: {staff.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview of Selected Attendees */}
                {(formData.attendeeType === 'teachers' || formData.attendeeType === 'parents' || formData.attendeeType === 'administrators' || formData.attendeeType === 'therapists' || formData.attendeeType === 'coordinators' || formData.attendeeType === 'staff' || formData.attendeeType === 'multi_role' || formData.attendeeType === 'all_users') && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Selected Attendees:</div>
                    <div className="text-sm text-gray-600">
                      {generateAttendeesString() || 'No attendees selected'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Program and Student */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Program & Student</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a program</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.name}>{program.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <input
                    type="text"
                    id="student"
                    name="student"
                    value={formData.student}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter student name"
                  />
                </div>
              </div>
            </div>

            {/* Description and Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Description & Notes</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>

            {/* Recurring Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Recurring Options</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    name="recurring"
                    checked={formData.recurring}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Make this a recurring event
                  </label>
                </div>

                {formData.recurring && (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="recurringType" className="block text-sm font-medium text-gray-700 mb-1">
                        Recurring Type
                      </label>
                      <select
                        id="recurringType"
                        name="recurringType"
                        value={formData.recurringType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                        </div>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Recurring Event Preview</p>
                          <p className="mt-1">
                            This will create <span className="font-semibold">12 events</span> starting from{' '}
                            <span className="font-semibold">{formData.date}</span> and repeating{' '}
                            <span className="font-semibold">
                              {formData.recurringType === 'daily' ? 'every day' : 
                               formData.recurringType === 'weekly' ? 'every week' : 
                               'every month'}
                            </span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Author Attendance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Your Attendance</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="authorAttending"
                    name="authorAttending"
                    checked={formData.authorAttending}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="authorAttending" className="text-sm font-medium text-gray-700">
                    I will be attending this event
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Check this box if you plan to attend the event. Your name will be automatically added to the attendees list.
                </p>
              </div>
            </div>

            {/* Reminder Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Reminder Settings</span>
              </h3>
              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time (minutes before)
                </label>
                <select
                  id="reminderTime"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="1440">1 day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;