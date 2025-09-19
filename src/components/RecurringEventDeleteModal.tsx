import React from 'react';
import { X, AlertTriangle, Calendar, Trash2 } from 'lucide-react';

interface RecurringEventDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteAll: boolean) => void;
  eventTitle: string;
  relatedEventsCount: number;
}

const RecurringEventDeleteModal: React.FC<RecurringEventDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  relatedEventsCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Delete Recurring Event</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              "{eventTitle}"
            </h3>
            <p className="text-gray-600 mb-4">
              This is a recurring event with <span className="font-semibold text-blue-600">{relatedEventsCount} total occurrences</span>.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <Calendar className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">What would you like to delete?</p>
                  <p>Choose whether to delete just this occurrence or all related recurring events.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onConfirm(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete This Event Only</span>
            </button>
            
            <button
              onClick={() => onConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All {relatedEventsCount} Recurring Events</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringEventDeleteModal;
