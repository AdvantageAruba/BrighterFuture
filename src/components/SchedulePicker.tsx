import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, Plus, Trash2 } from 'lucide-react';

interface ScheduleEntry {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
}

interface SchedulePickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const SchedulePicker: React.FC<SchedulePickerProps> = ({ 
  value, 
  onChange, 
  required = false, 
  className = '' 
}) => {
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const isInitialized = useRef(false);

  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  // Parse the value string into schedule entries - only on initial load
  useEffect(() => {
    if (!isInitialized.current && value && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setScheduleEntries(parsed);
        } else {
          setScheduleEntries([{
            id: '1',
            days: [],
            startTime: '09:00',
            endTime: '17:00'
          }]);
        }
      } catch {
        setScheduleEntries([{
          id: '1',
          days: [],
          startTime: '09:00',
          endTime: '17:00'
        }]);
      }
      isInitialized.current = true;
    } else if (!isInitialized.current) {
      setScheduleEntries([{
        id: '1',
        days: [],
        startTime: '09:00',
        endTime: '17:00'
      }]);
      isInitialized.current = true;
    }
  }, [value]);

  // Update parent only when schedule entries actually change
  const updateScheduleEntries = (newEntries: ScheduleEntry[]) => {
    setScheduleEntries(newEntries);
    const scheduleString = JSON.stringify(newEntries);
    onChange(scheduleString);
  };

  const addScheduleEntry = () => {
    const newEntry: ScheduleEntry = {
      id: Date.now().toString(),
      days: [],
      startTime: '09:00',
      endTime: '17:00'
    };
    updateScheduleEntries([...scheduleEntries, newEntry]);
  };

  const removeScheduleEntry = (id: string) => {
    if (scheduleEntries.length > 1) {
      const newEntries = scheduleEntries.filter(entry => entry.id !== id);
      updateScheduleEntries(newEntries);
    }
  };

  const updateScheduleEntry = (id: string, updates: Partial<ScheduleEntry>) => {
    const newEntries = scheduleEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    );
    updateScheduleEntries(newEntries);
  };

  const toggleDay = (entryId: string, dayId: string) => {
    const entry = scheduleEntries.find(e => e.id === entryId);
    if (entry) {
      const updatedDays = entry.days.includes(dayId)
        ? entry.days.filter(d => d !== dayId)
        : [...entry.days, dayId];
      updateScheduleEntry(entryId, { days: updatedDays });
    }
  };

  const formatScheduleDisplay = (entries: ScheduleEntry[]) => {
    if (entries.length === 0) return '';
    
    return entries.map(entry => {
      if (entry.days.length === 0) return '';
      
      const dayLabels = entry.days.map(dayId => 
        daysOfWeek.find(d => d.id === dayId)?.label || dayId
      );
      
      const daysText = dayLabels.length === 7 ? 'Daily' : 
                     dayLabels.length === 5 && 
                     !dayLabels.includes('Saturday') && 
                     !dayLabels.includes('Sunday') ? 'Weekdays' :
                     dayLabels.join(', ');
      
      return `${daysText}: ${entry.startTime} - ${entry.endTime}`;
    }).filter(Boolean).join('; ');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Schedule {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={addScheduleEntry}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      {scheduleEntries.map((entry, index) => (
        <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Schedule {index + 1}
              </span>
            </div>
            {scheduleEntries.length > 1 && (
              <button
                type="button"
                onClick={() => removeScheduleEntry(entry.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Days Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Days
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(entry.id, day.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    entry.days.includes(day.id)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="time"
                  value={entry.startTime}
                  onChange={(e) => updateScheduleEntry(entry.id, { startTime: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="time"
                  value={entry.endTime}
                  onChange={(e) => updateScheduleEntry(entry.id, { endTime: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Preview */}
      {scheduleEntries.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-1">Schedule Preview:</div>
          <div className="text-sm text-blue-700">
            {formatScheduleDisplay(scheduleEntries) || 'Select days and times to see preview'}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePicker;
