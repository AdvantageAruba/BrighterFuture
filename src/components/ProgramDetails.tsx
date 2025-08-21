import React from 'react';
import { X, BookOpen, Users, Calendar, MapPin, Phone, Mail, User, BarChart3, TrendingUp, AlertCircle, Edit, Trash2 } from 'lucide-react';

interface ProgramDetailsProps {
  program: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ program, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgramTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time Education': return 'bg-blue-100 text-blue-800';
      case 'Early Intervention': return 'bg-green-100 text-green-800';
      case 'Therapy Services': return 'bg-purple-100 text-purple-800';
      case 'Consultation': return 'bg-orange-100 text-orange-800';
      case 'Seasonal Program': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityPercentage = () => {
    return Math.round((program.students / program.capacity) * 100);
  };

  const getProgressBarColor = () => {
    const percentage = getCapacityPercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{program.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramTypeColor(program.type)}`}>
                  {program.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                  {program.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {/* Program Overview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Overview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{program.description}</p>
              </div>
            </div>

            {/* Key Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{program.students}</p>
                  <p className="text-sm text-blue-700">Current Students</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{program.staffCount}</p>
                  <p className="text-sm text-green-700">Staff Members</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{program.waitingList}</p>
                  <p className="text-sm text-orange-700">Waiting List</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{program.satisfactionScore}</p>
                  <p className="text-sm text-purple-700">Satisfaction Score</p>
                </div>
              </div>
            </div>

            {/* Enrollment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Information</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Current Enrollment</span>
                  <span className="text-sm font-medium text-gray-900">
                    {program.students} / {program.capacity} ({getCapacityPercentage()}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                    style={{ width: `${getCapacityPercentage()}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Age Range</p>
                    <p className="font-medium text-gray-900">{program.ageRange}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Success Rate</p>
                    <p className="font-medium text-gray-900">{program.graduationRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Program Started</p>
                    <p className="font-medium text-gray-900">{new Date(program.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location & Schedule</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{program.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Schedule</p>
                    <p className="font-medium text-gray-900">{program.schedule}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Program Coordinator</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{program.coordinator}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{program.coordinatorEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{program.coordinatorPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Performance Metrics</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{program.graduationRate}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${program.graduationRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{program.satisfactionScore}</div>
                    <div className="text-sm text-gray-600">Satisfaction Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(program.satisfactionScore / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{getCapacityPercentage()}%</div>
                    <div className="text-sm text-gray-600">Capacity Utilization</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressBarColor()}`}
                        style={{ width: `${getCapacityPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                  <span>Edit Program</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <Users className="w-4 h-4" />
                  <span>View Students</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                  <BarChart3 className="w-4 h-4" />
                  <span>View Reports</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
                  <AlertCircle className="w-4 h-4" />
                  <span>Manage Waiting List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;