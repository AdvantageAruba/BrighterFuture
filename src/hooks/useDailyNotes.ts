import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface DailyNote {
  id: number
  student_id: number
  student_name: string
  program_id: number
  program_name: string
  author_id: string
  author_name: string
  date: string
  notes: string  // Changed from note_content to notes
  tags: string[]
  created_at: string
  updated_at: string
}

export interface AddDailyNoteData {
  student_id: number
  student_name: string
  program_id: number
  program_name: string
  author_id: string
  author_name: string
  date: string
  notes: string  // Changed from note_content to notes
  tags: string[]
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
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDailyNotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch daily notes')
    } finally {
      setLoading(false)
    }
  }

  // Add new daily note
  const addDailyNote = async (noteData: AddDailyNoteData) => {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to add daily note'
      setError(errorMessage)
      return { success: false, error: errorMessage }
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

  // Get daily notes by date
  const getDailyNotesByDate = (date: string) => {
    return dailyNotes.filter(note => note.date === date)
  }

  // Get daily notes by program
  const getDailyNotesByProgram = (programId: number) => {
    return dailyNotes.filter(note => note.program_id === programId)
  }

  // Get daily notes by student
  const getDailyNotesByStudent = (studentId: number) => {
    return dailyNotes.filter(note => note.student_id === studentId)
  }

  // Search daily notes
  const searchDailyNotes = (searchTerm: string) => {
    const term = searchTerm.toLowerCase()
    return dailyNotes.filter(note => 
      note.student_name.toLowerCase().includes(term) ||
      note.notes.toLowerCase().includes(term) ||
      note.author_name.toLowerCase().includes(term) ||
      note.tags.some(tag => tag.toLowerCase().includes(term))
    )
  }

  // Get daily notes statistics
  const getDailyNotesStats = () => {
    const total = dailyNotes.length
    const byProgram = dailyNotes.reduce((acc, note) => {
      acc[note.program_name] = (acc[note.program_name] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byDate = dailyNotes.reduce((acc, note) => {
      acc[note.date] = (acc[note.date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      byProgram,
      byDate
    }
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
    getDailyNotesByDate,
    getDailyNotesByProgram,
    getDailyNotesByStudent,
    searchDailyNotes,
    getDailyNotesStats,
    refreshDailyNotes: fetchDailyNotes
  }
}
