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
  picture_url?: string | null
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
      console.error('Failed to fetch programs:', err)
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
      // First, delete the student's picture if they have one
      const student = students.find(s => s.id === id)
      if (student?.picture_url) {
        await deleteStudentPicture(id)
      }

      // Delete the student record
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remove from local state
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

  // Upload student picture
  const uploadStudentPicture = async (studentId: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${studentId}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('student-pictures')
        .getPublicUrl(fileName)

      // Update student record with picture URL
      const { error: updateError } = await supabase
        .from('students')
        .update({ picture_url: urlData.publicUrl })
        .eq('id', studentId)

      if (updateError) throw updateError

      // Update local state
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, picture_url: urlData.publicUrl }
          : student
      ))

      return { success: true, url: urlData.publicUrl }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload picture')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to upload picture' }
    }
  }

  // Delete student picture
  const deleteStudentPicture = async (studentId: number) => {
    try {
      const student = students.find(s => s.id === studentId)
      if (!student?.picture_url) {
        return { success: true } // No picture to delete
      }

      // Extract filename from URL
      const urlParts = student.picture_url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('student-pictures')
        .remove([fileName])

      if (deleteError) throw deleteError

      // Update student record to remove picture URL
      const { error: updateError } = await supabase
        .from('students')
        .update({ picture_url: null })
        .eq('id', studentId)

      if (updateError) throw updateError

      // Update local state
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, picture_url: null }
          : student
      ))

      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete picture')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete picture' }
    }
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
    uploadStudentPicture,
    deleteStudentPicture,
    refreshStudents: fetchStudents,
    refreshPrograms: fetchPrograms
  }
}
