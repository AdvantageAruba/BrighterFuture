import React, { useState } from 'react';
import { X, Send, User, Mail } from 'lucide-react';
import { useMessages, SendMessageData } from '../hooks/useMessages';

interface SendMessageProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: () => void;
  users: any[];
}

const SendMessage: React.FC<SendMessageProps> = ({ isOpen, onClose, onMessageSent, users }) => {
  const [formData, setFormData] = useState({
    recipient_id: '',
    subject: '',
    content: ''
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage } = useMessages();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipient_id || !formData.subject.trim() || !formData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSending(true);
      setError(null);

      const messageData: SendMessageData = {
        recipient_id: parseInt(formData.recipient_id),
        subject: formData.subject.trim(),
        content: formData.content.trim()
      };

      await sendMessage(messageData);
      
      // Reset form
      setFormData({
        recipient_id: '',
        subject: '',
        content: ''
      });
      
      onMessageSent();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setFormData({
      recipient_id: '',
      subject: '',
      content: ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Send Message</h3>
            <p className="text-gray-600 mt-1">Send a message to another user</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-red-600">⚠</div>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Recipient Selection */}
          <div>
            <label htmlFor="recipient_id" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Recipient
            </label>
            <select
              id="recipient_id"
              name="recipient_id"
              value={formData.recipient_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a recipient...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter message subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Character Count */}
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {formData.content.length} characters
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !formData.recipient_id || !formData.subject.trim() || !formData.content.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;

