import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

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
  const { user } = useAuth()

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
      const authorName = user?.email || 'System User';

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
      
      return { success: true, data: data?.[0] }
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

  // Delete event
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
      return data || []
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
      return data || []
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
      return data || []
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
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDateRange,
    getEventsByType,
    getEventsByProgram,
    refreshEvents
  }
}
