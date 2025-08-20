import React, { useState } from 'react';
import { Plus, Search, Filter, Download, DollarSign, Calendar, User, CreditCard, AlertCircle, CheckCircle, Clock, Eye, Edit, Send } from 'lucide-react';
import AddPayment from './AddPayment';
import PaymentDetails from './PaymentDetails';
import CreateInvoice from './CreateInvoice';
import StudentBilling from './StudentBilling';

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isStudentBillingOpen, setIsStudentBillingOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'payments', label: 'Payments' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'students', label: 'Student Accounts' }
  ];

  const payments = [
    {
      id: 1,
      studentName: 'Emma Rodriguez',
      studentId: 1,
      program: 'Brighter Future Academy',
      amount: 1250.00,
      dueDate: '2024-01-15',
      paidDate: '2024-01-14',
      status: 'paid',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV-2024-001',
      description: 'Monthly Tuition - January 2024'
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      studentId: 2,
      program: 'First Steps',
      amount: 850.00,
      dueDate: '2024-01-15',
      paidDate: null,
      status: 'overdue',
      paymentMethod: null,
      invoiceNumber: 'INV-2024-002',
      description: 'Monthly Tuition - January 2024'
    },
    {
      id: 3,
      studentName: 'Isabella Garcia',
      studentId: 3,
      program: 'Individual Therapy',
      amount: 200.00,
      dueDate: '2024-01-20',
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      invoiceNumber: 'INV-2024-003',
      description: 'Therapy Session - Week 3'
    },
    {
      id: 4,
      studentName: 'Alex Thompson',
      studentId: 4,
      program: 'Brighter Future Academy',
      amount: 1250.00,
      dueDate: '2024-01-25',
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      invoiceNumber: 'INV-2024-004',
      description: 'Monthly Tuition - January 2024'
    }
  ];

  const students = [
    {
      id: 1,
      name: 'Emma Rodriguez',
      program: 'Brighter Future Academy',
      monthlyTuition: 1250.00,
      balance: 0.00,
      status: 'current',
      lastPayment: '2024-01-14',
      nextDue: '2024-02-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      program: 'First Steps',
      monthlyTuition: 850.00,
      balance: 850.00,
      status: 'overdue',
      lastPayment: '2023-12-15',
      nextDue: '2024-01-15'
    },
    {
      id: 3,
      name: 'Isabella Garcia',
      program: 'Individual Therapy',
      monthlyTuition: 800.00,
      balance: 200.00,
      status: 'pending',
      lastPayment: '2024-01-01',
      nextDue: '2024-01-20'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      program: 'Brighter Future Academy',
      monthlyTuition: 1250.00,
      balance: 1250.00,
      status: 'pending',
      lastPayment: '2023-12-25',
      nextDue: '2024-01-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'current': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'current': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = pendingAmount + overdueAmount;

  const handlePaymentClick = (payment: any) => {
    setSelectedPayment(payment);
    setIsPaymentDetailsOpen(true);
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setIsStudentBillingOpen(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Pending + Overdue</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Needs attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Students</p>
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-gray-500 mt-1">Enrolled</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payment.studentName}</p>
                  <p className="text-sm text-gray-600">{payment.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(payment.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Credit Card</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bank Transfer</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Check</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      {filteredPayments.map((payment) => (
        <div 
          key={payment.id} 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
          onClick={() => handlePaymentClick(payment)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{payment.studentName}</h4>
                <p className="text-sm text-gray-600">{payment.program}</p>
                <p className="text-sm text-gray-500">{payment.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(payment.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Due: {new Date(payment.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-4">
      {filteredStudents.map((student) => (
        <div 
          key={student.id} 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
          onClick={() => handleStudentClick(student)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-600">{student.program}</p>
                <p className="text-sm text-gray-500">Monthly: ${student.monthlyTuition.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">${student.balance.toLocaleString()}</p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(student.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Next Due: {new Date(student.nextDue).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-2">Manage tuition payments, invoices, and student accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
          <button 
            onClick={() => setIsAddPaymentOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab !== 'overview' && (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {activeTab === 'payments' && (
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              )}
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          )}

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'invoices' && renderPayments()}
          {activeTab === 'students' && renderStudents()}
        </div>
      </div>

      {/* Modals */}
      {isAddPaymentOpen && (
        <AddPayment
          isOpen={isAddPaymentOpen}
          onClose={() => setIsAddPaymentOpen(false)}
        />
      )}

      {isPaymentDetailsOpen && selectedPayment && (
        <PaymentDetails
          payment={selectedPayment}
          isOpen={isPaymentDetailsOpen}
          onClose={() => setIsPaymentDetailsOpen(false)}
        />
      )}

      {isCreateInvoiceOpen && (
        <CreateInvoice
          isOpen={isCreateInvoiceOpen}
          onClose={() => setIsCreateInvoiceOpen(false)}
        />
      )}

      {isStudentBillingOpen && selectedStudent && (
        <StudentBilling
          student={selectedStudent}
          isOpen={isStudentBillingOpen}
          onClose={() => setIsStudentBillingOpen(false)}
        />
      )}
    </div>
  );
};

export default Billing;