import React, { useState } from 'react';
import { X, Save, Send, FileText, User, DollarSign, Calendar } from 'lucide-react';

interface CreateInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    description: '',
    invoiceType: 'tuition',
    notes: '',
    sendEmail: true
  });

  const students = [
    { id: 1, name: 'Emma Rodriguez', program: 'Brighter Future Academy', email: 'parent1@email.com' },
    { id: 2, name: 'Michael Chen', program: 'First Steps', email: 'parent2@email.com' },
    { id: 3, name: 'Isabella Garcia', program: 'Individual Therapy', email: 'parent3@email.com' },
    { id: 4, name: 'Alex Thompson', program: 'Brighter Future Academy', email: 'parent4@email.com' }
  ];

  const invoiceTypes = [
    { id: 'tuition', name: 'Monthly Tuition' },
    { id: 'therapy', name: 'Therapy Session' },
    { id: 'assessment', name: 'Assessment Fee' },
    { id: 'materials', name: 'Materials & Supplies' },
    { id: 'late_fee', name: 'Late Payment Fee' },
    { id: 'other', name: 'Other' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Invoice data:', formData);
    alert('Invoice created successfully!');
    onClose();
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${month}-${random}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
            <p className="text-gray-600">Generate a new invoice for student services</p>
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
            {/* Invoice Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Invoice Information</span>
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Invoice Number:</strong> {generateInvoiceNumber()}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Issue Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type *</label>
                  <select
                    name="invoiceType"
                    value={formData.invoiceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {invoiceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Student Information</span>
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student *</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.program}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount and Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Invoice Details</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Monthly tuition for January 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information or payment instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="sendEmail"
                    checked={formData.sendEmail}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    Send invoice via email to parent/guardian
                  </label>
                </div>
                {formData.sendEmail && formData.studentId && (
                  <div className="ml-7 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Invoice will be sent to: {students.find(s => s.id.toString() === formData.studentId)?.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Preview */}
            {formData.studentId && formData.amount && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Preview</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900">Brighter Future Educational Center</h4>
                    <p className="text-gray-600">Invoice</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Bill To:</p>
                      <p className="font-medium text-gray-900">
                        {students.find(s => s.id.toString() === formData.studentId)?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {students.find(s => s.id.toString() === formData.studentId)?.program}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Invoice #: {generateInvoiceNumber()}</p>
                      <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Due: {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{formData.description}</span>
                      <span className="font-bold text-gray-900">${parseFloat(formData.amount || '0').toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-300 mt-4 pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>${parseFloat(formData.amount || '0').toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              <Send className="w-4 h-4" />
              <span>Create & Send Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;