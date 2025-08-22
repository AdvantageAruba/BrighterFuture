import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface DailyNote {
  id: number
  student_id: number
  program_id: number
  date: string
  notes: string
  created_by: string
  created_at: string
}

export const useDailyNotes = () => {
  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all daily notes
  const fetchDailyNotes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('daily_notes')
        .select(`
          *,
          students (
            id,
            name,
            email
          ),
          programs (
            id,
            name
          )
        `)
        .order('date', { ascending: false })

      if (error) throw error
      setDailyNotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch daily notes')
    } finally {
      setLoading(false)
    }
  }

  // Add new daily note
  const addDailyNote = async (noteData: Omit<DailyNote, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('daily_notes')
        .insert([noteData])
        .select()

      if (error) throw error
      
      if (data) {
        setDailyNotes(prev => [data[0], ...prev])
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add daily note')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add daily note' }
    }
  }

  // Update daily note
  const updateDailyNote = async (id: number, updates: Partial<DailyNote>) => {
    try {
      const { data, error } = await supabase
        .from('daily_notes')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setDailyNotes(prev => prev.map(note => 
          note.id === id ? { ...note, ...updates } : note
        ))
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update daily note')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update daily note' }
    }
  }

  // Delete daily note
  const deleteDailyNote = async (id: number) => {
    try {
      const { error } = await supabase
        .from('daily_notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setDailyNotes(prev => prev.filter(note => note.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete daily note')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete daily note' }
    }
  }

  // Get notes by student
  const getNotesByStudent = (studentId: number) => {
    return dailyNotes.filter(note => note.student_id === studentId)
  }

  // Get notes by program
  const getNotesByProgram = (programId: number) => {
    return dailyNotes.filter(note => note.program_id === programId)
  }

  // Get notes by date
  const getNotesByDate = (date: string) => {
    return dailyNotes.filter(note => note.date === date)
  }

  // Get notes by date range
  const getNotesByDateRange = (startDate: string, endDate: string) => {
    return dailyNotes.filter(note => 
      note.date >= startDate && note.date <= endDate
    )
  }

  useEffect(() => {
    fetchDailyNotes()
  }, [])

  return {
    dailyNotes,
    loading,
    error,
    addDailyNote,
    updateDailyNote,
    deleteDailyNote,
    getNotesByStudent,
    getNotesByProgram,
    getNotesByDate,
    getNotesByDateRange,
    refreshDailyNotes: fetchDailyNotes
  }
}
