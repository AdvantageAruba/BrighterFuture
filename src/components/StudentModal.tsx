import React, { useState } from 'react';
import { X, FileText, MessageSquare, Calendar, User, Phone, Mail, CheckCircle, XCircle, Clock, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
import AddAttendance from './AddAttendance';
import AddDailyNote from './AddDailyNote';

interface StudentModalProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [detailView, setDetailView] = useState(null); // 'assessment', 'note', 'form', 'attendance'
  
  // New state for managing modals
  const [isEditAttendanceOpen, setIsEditAttendanceOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  const handleBackToTabs = () => {
    setDetailView(null);
    setSelectedAssessment(null);
    setSelectedNote(null);
    setSelectedForm(null);
    setSelectedAttendanceRecord(null);
  };

  // Sample data - in a real app this would come from props or API
  const studentDetails = {
    ...student,
    parentName: 'Jennifer Rodriguez',
    parentPhone: '(555) 123-4567',
    parentEmail: 'jennifer.rodriguez@email.com',
    dateOfBirth: '2016-03-15',
    address: '123 Main Street, City, State 12345',
    emergencyContact: 'Maria Rodriguez',
    emergencyPhone: '(555) 987-6543',
    medicalConditions: 'Speech delay, requires additional support',
    allergies: 'None known',
    enrollmentDate: '2023-09-01',
    className: 'Grade 2A',
    teacher: 'Ms. Emily Smith',
    status: student.status || 'active'
  };

  const attendanceData = [
    { date: '2024-01-15', status: 'present', checkIn: '08:30 AM', checkOut: '03:00 PM' },
    { date: '2024-01-14', status: 'present', checkIn: '08:25 AM', checkOut: '03:05 PM' },
    { date: '2024-01-13', status: 'late', checkIn: '09:15 AM', checkOut: '03:00 PM' },
    { date: '2024-01-12', status: 'absent', checkIn: null, checkOut: null },
    { date: '2024-01-11', status: 'present', checkIn: '08:35 AM', checkOut: '02:58 PM' },
    { date: '2024-01-10', status: 'present', checkIn: '08:28 AM', checkOut: '03:02 PM' },
    { date: '2024-01-09', status: 'present', checkIn: '08:32 AM', checkOut: '03:00 PM' }
  ];

  const assessmentData = [
    {
      id: 1,
      title: 'Speech Therapy Assessment',
      date: '2024-01-13',
      assessor: 'Dr. Michael Wilson',
      type: 'Speech & Language',
      status: 'completed',
      score: '85%',
      notes: 'Significant improvement in articulation. Recommend continued therapy sessions.'
    },
    {
      id: 2,
      title: 'Behavioral Assessment',
      date: '2024-01-08',
      assessor: 'Ms. Emily Smith',
      type: 'Behavioral',
      status: 'completed',
      score: '78%',
      notes: 'Shows good progress in social interactions. Continue current behavioral strategies.'
    },
    {
      id: 3,
      title: 'Academic Progress Review',
      date: '2024-01-05',
      assessor: 'Dr. Sarah Johnson',
      type: 'Academic',
      status: 'pending_review',
      score: 'Pending',
      notes: 'Assessment completed, awaiting final review and recommendations.'
    }
  ];

  const notesData = [
    {
      id: 1,
      date: '2024-01-15',
      author: 'Ms. Emily Smith',
      category: 'behavior',
      title: 'Excellent Group Participation',
      content: 'Emma showed outstanding participation in group activities today. She helped a peer with their assignment and demonstrated excellent listening skills during circle time.',
      tags: ['positive behavior', 'peer interaction', 'participation']
    },
    {
      id: 2,
      date: '2024-01-14',
      author: 'Dr. Michael Wilson',
      category: 'therapy',
      title: 'Speech Therapy Progress',
      content: 'Continued work on /r/ sounds. Emma is showing consistent improvement and was able to produce the sound correctly in 8 out of 10 attempts.',
      tags: ['speech therapy', 'articulation', 'improvement']
    },
    {
      id: 3,
      date: '2024-01-13',
      author: 'Dr. Sarah Johnson',
      category: 'academic',
      title: 'Math Skills Development',
      content: 'Emma completed addition problems up to 20 with minimal assistance. She is ready to move on to subtraction concepts next week.',
      tags: ['math', 'addition', 'ready for next level']
    },
    {
      id: 4,
      date: '2024-01-12',
      author: 'Ms. Lisa Brown',
      category: 'social',
      title: 'Playground Interaction',
      content: 'Emma initiated play with two classmates during recess. She shared toys appropriately and followed playground rules without reminders.',
      tags: ['social skills', 'sharing', 'independence']
    }
  ];

  const formsData = [
    {
      id: 1,
      title: 'Initial Intake Form',
      date: '2023-08-15',
      completedBy: 'Jennifer Rodriguez (Parent)',
      status: 'completed',
      type: 'intake'
    },
    {
      id: 2,
      title: 'IEP Development Form',
      date: '2023-09-01',
      completedBy: 'Dr. Sarah Johnson',
      status: 'completed',
      type: 'educational'
    },
    {
      id: 3,
      title: 'Therapy Consent Form',
      date: '2023-09-05',
      completedBy: 'Jennifer Rodriguez (Parent)',
      status: 'completed',
      type: 'consent'
    },
    {
      id: 4,
      title: 'Progress Review Form',
      date: '2024-01-10',
      completedBy: 'Ms. Emily Smith',
      status: 'pending_review',
      type: 'review'
    }
  ];

  const calculateHours = (checkIn: string, checkOut: string) => {
    const checkInTime = new Date(`2000-01-01 ${checkIn}`);
    const checkOutTime = new Date(`2000-01-01 ${checkOut}`);
    const diffInHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    return Math.round(diffInHours * 10) / 10;
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'forms', label: 'Forms', icon: FileText }
  ];

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssessmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavior': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-green-100 text-green-800';
      case 'therapy': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      case 'medical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormTypeColor = (type: string) => {
    switch (type) {
      case 'intake': return 'bg-blue-100 text-blue-800';
      case 'educational': return 'bg-green-100 text-green-800';
      case 'consent': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="font-medium text-gray-900">{studentDetails.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Age</label>
                    <p className="font-medium text-gray-900">{studentDetails.age} years old</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Date of Birth</label>
                    <p className="font-medium text-gray-900">{new Date(studentDetails.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Enrollment Date</label>
                    <p className="font-medium text-gray-900">{new Date(studentDetails.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Class</label>
                    <p className="font-medium text-gray-900">{studentDetails.className}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Teacher</label>
                    <p className="font-medium text-gray-900">{studentDetails.teacher}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      studentDetails.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {studentDetails.status.charAt(0).toUpperCase() + studentDetails.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Parent/Guardian</label>
                    <p className="font-medium text-gray-900">{studentDetails.parentName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{studentDetails.parentPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{studentDetails.parentEmail}</span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="text-sm text-gray-900">{studentDetails.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-red-700">Emergency Contact</label>
                    <p className="font-medium text-red-900">{studentDetails.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-sm text-red-700">Emergency Phone</label>
                    <p className="font-medium text-red-900">{studentDetails.emergencyPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Program Details</h4>
              <div className={`border-2 rounded-lg p-4 ${
                studentDetails.status === 'active' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="font-medium text-blue-900">{studentDetails.programName}</p>
                <p className="text-sm text-blue-700 mt-1">
                  Enrolled since {new Date(studentDetails.enrollmentDate).toLocaleDateString()}
                </p>
                {studentDetails.status === 'inactive' && (
                  <p className="text-sm text-red-700 mt-1 font-medium">
                    ⚠️ Student is currently inactive
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Medical Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Medical Conditions</label>
                  <p className="text-sm text-gray-900">{studentDetails.medicalConditions}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Allergies</label>
                  <p className="text-sm text-gray-900">{studentDetails.allergies}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-sm text-green-700">Attendance Rate</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{studentDetails.assessments}</p>
                  <p className="text-sm text-blue-700">Assessments</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{studentDetails.notes}</p>
                  <p className="text-sm text-purple-700">Daily Notes</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">4</p>
                  <p className="text-sm text-orange-700">Active Forms</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Recent Attendance</h4>
              <div className="text-sm text-gray-600">
                Attendance Rate: <span className="font-medium text-green-600">85%</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{attendanceData.filter(r => r.status === 'present').length}</div>
                <div className="text-sm text-green-700">Present Days</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{attendanceData.filter(r => r.status === 'absent').length}</div>
                <div className="text-sm text-red-700">Absent Days</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{attendanceData.filter(r => r.status === 'late').length}</div>
                <div className="text-sm text-orange-700">Late Days</div>
              </div>
            </div>
            {attendanceData.map((record, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                onClick={() => {
                  setSelectedAttendanceRecord(record);
                  setDetailView('attendance');
                }}
              >
                <div className="flex items-center space-x-3">
                  {getAttendanceIcon(record.status)}
                  <div>
                    <p className="font-medium text-gray-900">{new Date(record.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">
                      {record.status === 'present' && record.checkIn && record.checkOut 
                        ? `${record.checkIn} - ${record.checkOut}` 
                        : record.status === 'late' && record.checkIn 
                        ? `Late arrival at ${record.checkIn}`
                        : record.status === 'absent' 
                        ? 'Did not attend'
                        : 'No time recorded'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getAttendanceColor(record.status)}`}>
                    {record.status}
                  </span>
                  {record.status === 'present' && record.checkIn && record.checkOut && (
                    <p className="text-xs text-gray-500 mt-1">
                       {calculateHours(record.checkIn, record.checkOut)} hours
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'assessments':
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Assessment Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{assessmentData.length}</div>
                  <div className="text-sm text-blue-700">Total Assessments</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{assessmentData.filter(a => a.status === 'completed').length}</div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{assessmentData.filter(a => a.status === 'pending_review').length}</div>
                  <div className="text-sm text-yellow-700">Pending Review</div>
                </div>
              </div>
            </div>
            {assessmentData.map((assessment) => (
              <div 
                key={assessment.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  setSelectedAssessment(assessment);
                  setDetailView('assessment');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                    <p className="text-sm text-gray-600">by {assessment.assessor}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{new Date(assessment.date).toLocaleDateString()}</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssessmentStatusColor(assessment.status)}`}>
                        {assessment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-sm text-gray-600">Assessment Type</label>
                    <p className="text-sm font-medium text-gray-900">{assessment.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Score</label>
                    <p className="text-sm font-medium text-gray-900">{assessment.score}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{assessment.notes}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Notes Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{notesData.filter(n => n.category === 'behavior').length}</div>
                  <div className="text-xs text-blue-700">Behavior</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{notesData.filter(n => n.category === 'academic').length}</div>
                  <div className="text-xs text-green-700">Academic</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">{notesData.filter(n => n.category === 'therapy').length}</div>
                  <div className="text-xs text-purple-700">Therapy</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-600">{notesData.filter(n => n.category === 'social').length}</div>
                  <div className="text-xs text-orange-700">Social</div>
                </div>
              </div>
            </div>
            {notesData.map((note) => (
              <div 
                key={note.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedNote(note);
                  setDetailView('note');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                    <p className="text-sm text-gray-600">by {note.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                        {note.category}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{note.content}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(note.date).toLocaleDateString()} • {note.category}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'forms':
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Forms Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{formsData.filter(f => f.status === 'completed').length}</div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{formsData.filter(f => f.status === 'pending_review').length}</div>
                  <div className="text-sm text-yellow-700">Pending Review</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{formsData.length}</div>
                  <div className="text-sm text-blue-700">Total Forms</div>
                </div>
              </div>
            </div>
            {formsData.map((form) => (
              <div 
                key={form.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
                onClick={() => {
                  setSelectedForm(form);
                  setDetailView('form');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{form.title}</h4>
                    <p className="text-sm text-gray-600">Completed by {form.completedBy}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{new Date(form.date).toLocaleDateString()}</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormTypeColor(form.type)}`}>
                        {form.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFormStatusColor(form.status)}`}>
                    {form.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                      <span>View Form</span>
                    </button>
                    <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderDetailView = () => {
    switch (detailView) {
      case 'assessment':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToTabs}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <span>← Back to Assessments</span>
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedAssessment?.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAssessmentStatusColor(selectedAssessment?.status)}`}>
                  {selectedAssessment?.status?.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm text-gray-600">Assessment Type</label>
                  <p className="font-medium text-gray-900">{selectedAssessment?.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assessor</label>
                  <p className="font-medium text-gray-900">{selectedAssessment?.assessor}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date Completed</label>
                  <p className="font-medium text-gray-900">{new Date(selectedAssessment?.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Score</label>
                  <p className="font-medium text-gray-900">{selectedAssessment?.score}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">Assessment Notes</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedAssessment?.notes}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                  <span>Edit Assessment</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'note':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToTabs}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <span>← Back to Notes</span>
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedNote?.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedNote?.category)}`}>
                  {selectedNote?.category}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm text-gray-600">Author</label>
                  <p className="font-medium text-gray-900">{selectedNote?.author}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <p className="font-medium text-gray-900">{new Date(selectedNote?.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-2">Note Content</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedNote?.content}</p>
                </div>
              </div>
              {selectedNote?.tags && selectedNote.tags.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm text-gray-600 block mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                  <span>Edit Note</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <span>Share with Parent</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToTabs}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <span>← Back to Forms</span>
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedForm?.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFormTypeColor(selectedForm?.type)}`}>
                    {selectedForm?.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFormStatusColor(selectedForm?.status)}`}>
                    {selectedForm?.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm text-gray-600">Completed By</label>
                  <p className="font-medium text-gray-900">{selectedForm?.completedBy}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date Completed</label>
                  <p className="font-medium text-gray-900">{new Date(selectedForm?.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Form Details</h4>
                <p className="text-gray-700">This form contains important information about the student's progress and development. All required fields have been completed and the form is ready for review.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                  <span>View Full Form</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <span>Download PDF</span>
                </button>
                {selectedForm?.status === 'pending_review' && (
                  <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    <span>Mark as Reviewed</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <button 
                onClick={handleBackToTabs}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <span>← Back to Attendance</span>
              </button>
            </div>
            
            {/* Embedded Attendance Details View */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header with student info and status */}
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={studentDetails.avatar}
                      alt={studentDetails.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{studentDetails.name}</h3>
                      <p className="text-gray-600">{studentDetails.programName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(selectedAttendanceRecord?.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getAttendanceColor(selectedAttendanceRecord?.status)}`}>
                      {getAttendanceIcon(selectedAttendanceRecord?.status)}
                      <span className="capitalize">{selectedAttendanceRecord?.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Information */}
              <div className="p-6 space-y-6">
                {/* Time Details */}
                {selectedAttendanceRecord?.status !== 'absent' && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Time Details</span>
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Check-in Time</p>
                          <p className="font-medium text-gray-900">{selectedAttendanceRecord?.checkIn || 'Not recorded'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-out Time</p>
                          <p className="font-medium text-gray-900">{selectedAttendanceRecord?.checkOut || 'Not recorded'}</p>
                        </div>
                        {selectedAttendanceRecord?.checkIn && selectedAttendanceRecord?.checkOut && (
                          <div>
                            <p className="text-sm text-gray-600">Total Time</p>
                            <p className="font-medium text-gray-900">
                              {(() => {
                                const checkIn = new Date(`2000-01-01 ${selectedAttendanceRecord.checkIn}`);
                                const checkOut = new Date(`2000-01-01 ${selectedAttendanceRecord.checkOut}`);
                                const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                                return `${diff.toFixed(1)} hours`;
                              })()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Notes</span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedAttendanceRecord?.notes ? (
                      <p className="text-gray-700">{selectedAttendanceRecord.notes}</p>
                    ) : (
                      <p className="text-gray-500 italic">No additional notes for this attendance record.</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Edit className="w-4 h-4" />
                      <span>Edit Attendance</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <MessageSquare className="w-4 h-4" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={studentDetails.avatar}
              alt={studentDetails.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{studentDetails.name}</h2>
              <p className="text-gray-600">{studentDetails.programName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {!detailView && (
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {detailView ? renderDetailView() : renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentModal;