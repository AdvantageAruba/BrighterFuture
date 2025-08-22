import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Student {
  id: number
  name: string
  email: string
  phone: string
  date_of_birth: string
  program_id: number
  status: string
  enrollment_date: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Program {
  id: number
  name: string
  description: string
  max_capacity: number
  status: string
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name')

      if (error) throw error
      setStudents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
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
      setError(err instanceof Error ? err.message : 'Failed to fetch programs')
    }
  }

  // Add new student
  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()

      if (error) throw error
      
      if (data) {
        setStudents(prev => [...prev, data[0]])
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add student' }
    }
  }

  // Update student
  const updateStudent = async (id: number, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setStudents(prev => prev.map(student => 
          student.id === id ? { ...student, ...updates, updated_at: new Date().toISOString() } : student
        ))
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update student' }
    }
  }

  // Delete student
  const deleteStudent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setStudents(prev => prev.filter(student => student.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete student' }
    }
  }

  // Get students by program
  const getStudentsByProgram = (programId: number) => {
    return students.filter(student => student.program_id === programId)
  }

  // Get program name by ID
  const getProgramName = (programId: number) => {
    const program = programs.find(p => p.id === programId)
    return program?.name || 'Unknown Program'
  }

  // Get student count by status
  const getStudentCountByStatus = (status: string) => {
    return students.filter(student => student.status === status).length
  }

  useEffect(() => {
    fetchStudents()
    fetchPrograms()
  }, [])

  return {
    students,
    programs,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByProgram,
    getProgramName,
    getStudentCountByStatus,
    refreshStudents: fetchStudents,
    refreshPrograms: fetchPrograms
  }
}
