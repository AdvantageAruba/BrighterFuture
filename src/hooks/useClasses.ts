import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name')

      if (error) throw error
      
      setClasses(data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch classes:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch classes')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all programs
  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name')

      if (error) throw error
      
      setPrograms(data || [])
    } catch (err) {
      console.error('Failed to fetch programs:', err)
    }
  }

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('role', 'teacher')
        .order('first_name')

      if (error) throw error
      
      setTeachers(data || [])
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
    }
  }

  // Fetch classes by program
  const fetchClassesByProgram = async (programId: number) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('program_id', programId)
        .order('name')

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Failed to fetch classes by program:', err)
      return []
    }
  }

  // Add new class
  const addClass = async (classData: Omit<Class, 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([classData])
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        const newClass = data[0]
        
        // Update state immediately with new class
        setClasses(prev => [...prev, newClass])
        
        return { success: true, data: newClass }
      }
      
      return { success: false, error: 'No data returned from insert' }
    } catch (err) {
      console.error('Error in addClass:', err)
      setError(err instanceof Error ? err.message : 'Failed to add class')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add class' }
    }
  }

  // Update class
  const updateClass = async (id: string, updates: Partial<Class>) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        const updatedClass = data[0]
        
        // Update state immediately with updated class
        setClasses(prev => prev.map(cls => 
          cls.id === id ? updatedClass : cls
        ))
        
        return { success: true, data: updatedClass }
      }
      
      return { success: false, error: 'No data returned from update' }
    } catch (err) {
      console.error('Error in updateClass:', err)
      setError(err instanceof Error ? err.message : 'Failed to update class')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update class' }
    }
  }

  // Delete class
  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update state immediately by removing the deleted class
      setClasses(prev => prev.filter(cls => cls.id !== id))
      
      return { success: true }
    } catch (err) {
      console.error('Error in deleteClass:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete class')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete class' }
    }
  }

  // Get classes by program
  const getClassesByProgram = (programId: number) => {
    return classes.filter(cls => cls.program_id === programId)
  }

  // Get class count by program
  const getClassCountByProgram = (programId: number) => {
    return classes.filter(cls => cls.program_id === programId).length
  }

  // Get teacher name by ID
  const getTeacherName = (teacherId: number | null) => {
    if (!teacherId) return 'No teacher assigned'
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher'
  }

  // Refresh all data
  const refreshClasses = () => {
    fetchClasses()
  }

  // Initial data fetch
  useEffect(() => {
    fetchClasses()
    fetchPrograms()
    fetchTeachers()
  }, [])

  return {
    classes,
    programs,
    teachers,
    loading,
    error,
    getClassesByProgram,
    getClassCountByProgram,
    getTeacherName,
    addClass,
    updateClass,
    deleteClass,
    refreshClasses,
    refreshPrograms: fetchPrograms,
    refreshTeachers: fetchTeachers
  }
}

// Types
export interface Class {
  id: string
  name: string
  program_id: number
  description: string
  max_students: number
  status: string
  teacher_id?: number | null
  created_at: string
  updated_at: string
}

export interface Program {
  id: number
  name: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: number
  first_name: string
  last_name: string
}
