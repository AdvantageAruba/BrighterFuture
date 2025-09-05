import React, { useEffect, useState } from 'react';
import { FileText, Users, Calendar, MessageSquare, Plus, Clock, Bell } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import { useDailyNotes } from '../hooks/useDailyNotes';
import { useEvents } from '../hooks/useEvents';
import { useAnnouncements } from '../hooks/useAnnouncements';

interface RecentActivityProps {
  setActiveTab: (tab: string) => void;
}

interface Activity {
  id: string;
  type: string;
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
  navigateTo: string;
  timestamp: Date;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ setActiveTab }) => {
  const { students } = useStudents();
  const { attendance } = useAttendance();
  const { dailyNotes } = useDailyNotes();
  const { events } = useEvents();
  const { announcements } = useAnnouncements();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Generate recent activities from real data
  useEffect(() => {
    const newActivities: Activity[] = [];



    // Add recent student enrollments
    const recentStudents = students
      .filter(student => {
        // Use created_at for accurate timing, but handle timezone properly
        const studentDate = student.created_at;
        if (!studentDate) return false; // Skip students with no date
        
        // Parse the ISO string and treat it as UTC, then convert to local time
        const studentDateObj = new Date(studentDate + 'Z'); // Add Z to treat as UTC
        if (isNaN(studentDateObj.getTime())) return false; // Skip invalid dates
        
        const daysDiff = (new Date().getTime() - studentDateObj.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7; // Show students enrolled in the last 7 days
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at + 'Z');
        const dateB = new Date(b.created_at + 'Z');
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 2);

    recentStudents.forEach(student => {
      // Use created_at for accurate timing, but handle timezone properly
      const studentDate = student.created_at;
      
      // Parse the ISO string and treat it as UTC, then convert to local time
      const parsedDate = new Date(studentDate + 'Z'); // Add Z to treat as UTC
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Student ${student.name} has no valid date:`, studentDate);
        return; // Skip this student
      }
      
      newActivities.push({
        id: `student-${student.id}`,
        type: 'student',
        icon: Users,
        title: 'Student enrolled',
        description: `${student.name} joined the program`,
        time: getTimeAgo(parsedDate),
        color: 'text-green-600',
        navigateTo: 'students',
        timestamp: parsedDate
      });
    });

    // Add recent attendance records
    const recentAttendance = attendance
      .filter(record => {
        const recordDate = new Date(record.created_at);
        const daysDiff = (new Date().getTime() - recordDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 3; // Show attendance from last 3 days
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentAttendance.forEach(record => {
      const student = students.find(s => s.id === record.student_id);
      if (student) {
        newActivities.push({
          id: `attendance-${record.id}`,
          type: 'attendance',
          icon: Calendar,
          title: 'Attendance recorded',
          description: `${student.name} - ${record.status} on ${new Date(record.date).toLocaleDateString()}`,
          time: getTimeAgo(new Date(record.created_at)),
          color: 'text-purple-600',
          navigateTo: 'calendar',
          timestamp: new Date(record.created_at)
        });
      }
    });

    // Add recent daily notes
    const recentNotes = dailyNotes
      .filter(note => {
        const noteDate = new Date(note.created_at);
        const daysDiff = (new Date().getTime() - noteDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 3; // Show notes from last 3 days
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentNotes.forEach(note => {
      const student = students.find(s => s.id === note.student_id);
      if (student) {
        newActivities.push({
          id: `note-${note.id}`,
          type: 'note',
          icon: MessageSquare,
          title: 'Daily note added',
          description: `Progress update for ${student.name}`,
          time: getTimeAgo(new Date(note.created_at)),
          color: 'text-orange-600',
          navigateTo: 'dailynotes',
          timestamp: new Date(note.created_at)
        });
      }
    });

    // Add recent calendar events
    const recentEvents = events
      .filter(event => {
        const eventDate = new Date(event.created_at);
        const daysDiff = (new Date().getTime() - eventDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7; // Show events created in the last 7 days
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);

    recentEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const formattedTime = event.start_time ? 
        new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }) : '';

      newActivities.push({
        id: `event-${event.id}`,
        type: 'event',
        icon: Clock,
        title: 'Event created',
        description: `${event.title} - ${formattedDate} ${formattedTime}`,
        time: getTimeAgo(new Date(event.created_at)),
        color: 'text-blue-600',
        navigateTo: 'calendar',
        timestamp: new Date(event.created_at)
      });
    });

    // Add recent announcements
    const recentAnnouncements = announcements
      .filter(announcement => {
        const announcementDate = new Date(announcement.created_at);
        const daysDiff = (new Date().getTime() - announcementDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7; // Show announcements from last 7 days
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentAnnouncements.forEach(announcement => {
      newActivities.push({
        id: `announcement-${announcement.id}`,
        type: 'announcement',
        icon: Bell,
        title: 'Announcement created',
        description: `${announcement.title} - ${announcement.priority} priority`,
        time: getTimeAgo(new Date(announcement.created_at)),
        color: 'text-indigo-600',
        navigateTo: 'announcements',
        timestamp: new Date(announcement.created_at)
      });
    });

    // Sort all activities by timestamp (most recent first)
    newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit to 8 most recent activities
    setActivities(newActivities.slice(0, 8));
  }, [students, attendance, dailyNotes, events, announcements]);

  // Helper function to parse dates more robustly
  const parseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    
    try {
      // Try parsing as ISO string first
      if (typeof dateString === 'string' && dateString.includes('T')) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) return date;
      }
      
      // Try parsing as regular date string
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) return date;
      
      return null;
    } catch (error) {
      console.warn('Failed to parse date:', dateString, error);
      return null;
    }
  };

  // Helper function to get relative time
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    
    // Ensure we're working with valid dates
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', date);
      return 'Unknown time';
    }
    
    const diffInMs = now.getTime() - date.getTime();
    
    // Handle future dates (shouldn't happen but just in case)
    if (diffInMs < 0) {
      console.warn('Future date detected:', date, 'Current time:', now);
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // More precise time calculation
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleActivityClick = (navigateTo: string) => {
    setActiveTab(navigateTo);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div 
                key={activity.id} 
                className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer"
                onClick={() => handleActivityClick(activity.navigateTo)}
              >
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-400 text-xs mt-1">Activities will appear here as you use the system</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;