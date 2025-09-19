import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useUsers } from './useUsers'
import { useStudents } from './useStudents'

export interface Event {
  id: number
  title: string
  type: string
  date: string
  start_time: string
  end_time: string
  location?: string
  description?: string
  attendees?: string
  program_id?: number
  program_name?: string
  student_id?: number
  student_name?: string
  priority: string
  recurring: boolean
  recurring_type?: string
  reminder_minutes: number
  notes?: string
  author_id: string
  author_name: string
  created_at: string
  updated_at: string
  isAdminAttending?: boolean // New property for admin highlighting
}

export interface AddEventData {
  title: string
  type: string
  date: string
  start_time: string
  end_time: string
  location?: string
  description?: string
  attendees?: string
  program_id?: number
  program_name?: string
  student_id?: number
  student_name?: string
  priority: string
  recurring: boolean
  recurring_type?: string
  reminder_minutes: number
  notes?: string
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, userProfile } = useAuth()
  const { users } = useUsers()
  const { students } = useStudents()

  // Helper function to check if administrator needs to attend an event
  const isAdminAttendingEvent = (event: Event): boolean => {
    if (!userProfile || userProfile.role !== 'administrator') return false;
    
    const attendees = event.attendees || '';
    const userFullName = `${userProfile.first_name} ${userProfile.last_name}`;
    
    // Check for direct name match in attendees list
    if (attendees.toLowerCase().includes(userFullName.toLowerCase())) {
      return true;
    }
    
    // If user is the author, only mark as attending if their name appears in attendees
    // This ensures the author's attendance checkbox is respected
    if (event.author_id === user?.id) {
      return attendees.toLowerCase().includes(userFullName.toLowerCase());
    }
    
    return false;
  };

  // Helper function to check if current user should see an event
  const shouldUserSeeEvent = (event: Event): boolean => {
    if (!userProfile) return false;
    
    // Administrators see all events
    if (userProfile.role === 'administrator') return true;
    
    // Check if user is directly mentioned in attendees
    const attendees = event.attendees || '';
    const userFullName = `${userProfile.first_name} ${userProfile.last_name}`;
    
    // Check for direct name match
    if (attendees.toLowerCase().includes(userFullName.toLowerCase())) {
      return true;
    }
    
    // Check for role-based matches
    const userRole = userProfile.role.toLowerCase();
    if (attendees.toLowerCase().includes(`(${userRole})`)) {
      return true;
    }
    
    // For parents, check if their children are mentioned
    if (userProfile.role === 'parent' && userProfile.children_ids) {
      // Check if any of the parent's children are mentioned in the event
      const parentStudents = students.filter(student => 
        userProfile.children_ids?.includes(student.id)
      );
      
      for (const student of parentStudents) {
        if (attendees.toLowerCase().includes(student.name.toLowerCase())) {
          return true;
        }
      }
    }
    
    // Check if user is the author of the event
    if (event.author_id === user?.id) {
      return true;
    }
    
    return false;
  };

  // Helper function to convert email addresses to proper names
  const convertEmailToName = (authorName: string): string => {
    // If it's already a proper name (no @ symbol), return as is
    if (!authorName.includes('@')) {
      return authorName;
    }
    
    // Map common email addresses to proper names
    const emailToNameMap: { [key: string]: string } = {
      'sarah.johnson@brighterfuture.edu': 'Dr. Sarah Johnson',
      'emily.smith@brighterfuture.edu': 'Ms. Emily Smith',
      'michael.wilson@brighterfuture.edu': 'Dr. Michael Wilson',
      'lisa.brown@brighterfuture.edu': 'Ms. Lisa Brown',
      'sarah.johnson@brighterfuture.com': 'Dr. Sarah Johnson',
      'michael.chen@brighterfuture.com': 'Michael Chen',
      'emily.rodriguez@brighterfuture.com': 'Emily Rodriguez',
      'david.thompson@brighterfuture.com': 'David Thompson',
      'lisa.williams@brighterfuture.com': 'Lisa Williams',
      'jennifer.davis@brighterfuture.com': 'Jennifer Davis'
    };
    
    // Return mapped name or original if no mapping found
    return emailToNameMap[authorName] || authorName;
  };

  // Helper function to generate recurring event dates
  const generateRecurringDates = (startDate: string, recurringType: string, count: number = 12): string[] => {
    const dates: string[] = [startDate];
    const start = new Date(startDate);
    
    for (let i = 1; i < count; i++) {
      const nextDate = new Date(start);
      
      switch (recurringType) {
        case 'daily':
          nextDate.setDate(start.getDate() + i);
          break;
        case 'weekly':
          nextDate.setDate(start.getDate() + (i * 7));
          break;
        case 'monthly':
          nextDate.setMonth(start.getMonth() + i);
          break;
        default:
          // If unknown type, just return the original date
          return [startDate];
      }
      
      dates.push(nextDate.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  // Helper function to find related recurring events
  const findRelatedRecurringEvents = (event: Event): Event[] => {
    if (!event.recurring) return [event];
    
    // Find events with the same title, time, and author (indicating they're part of the same recurring series)
    return events.filter(e => 
      e.title === event.title &&
      e.start_time === event.start_time &&
      e.end_time === event.end_time &&
      e.author_id === event.author_id &&
      e.recurring === true
    );
  };

  // Filtered events based on current user with admin attendance info
  const filteredEvents = useMemo(() => {
    if (!userProfile) return [];
    return events.filter(shouldUserSeeEvent).map(event => ({
      ...event,
      author_name: convertEmailToName(event.author_name), // Convert email to proper name
      isAdminAttending: isAdminAttendingEvent(event)
    }));
  }, [events, userProfile, students]);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  // Add new event
  const addEvent = async (eventData: AddEventData) => {
    try {
      // Use authenticated user if available, otherwise use default
      const authorId = user?.id || 'default-user';
      const authorName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'System User';

      // If it's a recurring event, create multiple events
      if (eventData.recurring && eventData.recurring_type) {
        const recurringDates = generateRecurringDates(eventData.date, eventData.recurring_type, 12);
        
        // Create events for each recurring date
        const eventsToCreate = recurringDates.map(date => ({
          ...eventData,
          date: date,
          author_id: authorId,
          author_name: authorName
        }));

        const { data, error } = await supabase
          .from('events')
          .insert(eventsToCreate)
          .select()

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (data) {
          setEvents(prev => [...prev, ...data])
        }
        
        return { success: true, data: data, message: `Created ${data.length} recurring events` } as { success: true; data: any; message: string }
      } else {
        // Single event
        const { data, error } = await supabase
          .from('events')
          .insert([{
            ...eventData,
            author_id: authorId,
            author_name: authorName
          }])
          .select()

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (data) {
          setEvents(prev => [...prev, data[0]])
        }
        
        return { success: true, data: data?.[0] } as { success: true; data: any }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add event'
      console.error('Event creation error:', err);
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update event
  const updateEvent = async (id: number, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        // Update the local state with the complete updated event data
        setEvents(prev => prev.map(event => 
          event.id === id ? data[0] : event
        ))
        return { success: true, data: data[0] }
      }
      
      return { success: false, error: 'No data returned from update' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      console.error('Event update error:', err);
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Delete multiple events
  const deleteMultipleEvents = async (eventIds: number[]) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .in('id', eventIds)

      if (error) throw error
      
      setEvents(prev => prev.filter(event => !eventIds.includes(event.id)))
      return { success: true, deletedCount: eventIds.length }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete events')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete events' }
    }
  }

  // Delete event (single or multiple)
  const deleteEvent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setEvents(prev => prev.filter(event => event.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete event' }
    }
  }

  // Get events by date range
  const getEventsByDateRange = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      const allEvents = data || []
      // Filter events based on current user
      return allEvents.filter(shouldUserSeeEvent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events by date range')
      return []
    }
  }

  // Get events by type
  const getEventsByType = async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', type)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      const allEvents = data || []
      // Filter events based on current user
      return allEvents.filter(shouldUserSeeEvent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events by type')
      return []
    }
  }

  // Get events by program
  const getEventsByProgram = async (programId: number) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('program_id', programId)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      const allEvents = data || []
      // Filter events based on current user
      return allEvents.filter(shouldUserSeeEvent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events by program')
      return []
    }
  }

  // Refresh events
  const refreshEvents = () => {
    fetchEvents()
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events: filteredEvents,
    allEvents: events, // Keep original events for admin purposes
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteMultipleEvents,
    findRelatedRecurringEvents,
    getEventsByDateRange,
    getEventsByType,
    getEventsByProgram,
    refreshEvents
  }
}
