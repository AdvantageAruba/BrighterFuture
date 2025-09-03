import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface WaitingListEntry {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  age: number | null
  parent_name: string
  parent_phone: string
  parent_email: string
  address: string | null
  emergency_contact: string | null
  emergency_phone: string | null
  program: string
  priority: 'high' | 'medium' | 'low'
  preferred_start_date: string | null
  reason_for_waiting: string | null
  notes: string | null
  status: 'waiting' | 'contacted' | 'enrolled' | 'declined'
  created_at: string
  updated_at: string
  contact_attempts: number
  last_contact_date: string | null
  next_follow_up_date: string | null
}

export interface AddWaitingListData {
  first_name: string
  last_name: string
  date_of_birth: string
  age?: number
  parent_name: string
  parent_phone: string
  parent_email: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  program: string
  priority?: 'high' | 'medium' | 'low'
  preferred_start_date?: string
  reason_for_waiting?: string
  notes?: string
}

export const useWaitingList = () => {
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all waiting list entries
  const fetchWaitingList = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('waiting_list')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWaitingList(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch waiting list')
    } finally {
      setLoading(false)
    }
  }

  // Add new waiting list entry
  const addWaitingListEntry = async (entryData: AddWaitingListData) => {
    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .insert([entryData])
        .select()

      if (error) throw error
      
      if (data) {
        setWaitingList(prev => [data[0], ...prev])
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add waiting list entry'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update waiting list entry
  const updateWaitingListEntry = async (id: number, updates: Partial<WaitingListEntry>) => {
    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setWaitingList(prev => prev.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        ))
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update waiting list entry')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update waiting list entry' }
    }
  }

  // Delete waiting list entry
  const deleteWaitingListEntry = async (id: number) => {
    try {
      const { error } = await supabase
        .from('waiting_list')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setWaitingList(prev => prev.filter(entry => entry.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete waiting list entry')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete waiting list entry' }
    }
  }

  // Get waiting list entries by program
  const getWaitingListByProgram = (program: string) => {
    return waitingList.filter(entry => entry.program === program)
  }

  // Get waiting list entries by priority
  const getWaitingListByPriority = (priority: string) => {
    return waitingList.filter(entry => entry.priority === priority)
  }

  // Get waiting list entries by status
  const getWaitingListByStatus = (status: string) => {
    return waitingList.filter(entry => entry.status === status)
  }

  // Get waiting list statistics
  const getWaitingListStats = () => {
    const total = waitingList.length
    const byProgram = waitingList.reduce((acc, entry) => {
      acc[entry.program] = (acc[entry.program] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byPriority = waitingList.reduce((acc, entry) => {
      acc[entry.priority] = (acc[entry.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byStatus = waitingList.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      byProgram,
      byPriority,
      byStatus
    }
  }

  // Update contact attempts
  const updateContactAttempts = async (id: number, contactDate: string, nextFollowUp?: string) => {
    const entry = waitingList.find(e => e.id === id)
    if (!entry) return { success: false, error: 'Entry not found' }

    const updates = {
      contact_attempts: entry.contact_attempts + 1,
      last_contact_date: contactDate,
      next_follow_up_date: nextFollowUp || null,
      status: 'contacted' as const
    }

    return await updateWaitingListEntry(id, updates)
  }

  // Change status
  const changeStatus = async (id: number, status: WaitingListEntry['status']) => {
    return await updateWaitingListEntry(id, { status })
  }

  useEffect(() => {
    fetchWaitingList()
  }, [])

  return {
    waitingList,
    loading,
    error,
    addWaitingListEntry,
    updateWaitingListEntry,
    deleteWaitingListEntry,
    getWaitingListByProgram,
    getWaitingListByPriority,
    getWaitingListByStatus,
    getWaitingListStats,
    updateContactAttempts,
    changeStatus,
    refreshWaitingList: fetchWaitingList
  }
}
