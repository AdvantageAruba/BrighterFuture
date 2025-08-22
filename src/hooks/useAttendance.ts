import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Attendance {
  id: number
  student_id: number
  date: string
  status: string
  check_in: string
  check_out: string
  notes: string
  created_at: string
}

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students (
            id,
            name,
            email
          )
        `)
        .order('date', { ascending: false })

      if (error) throw error
      setAttendance(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }

  // Add new attendance record
  const addAttendance = async (attendanceData: Omit<Attendance, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert([attendanceData])
        .select()

      if (error) throw error
      
      if (data) {
        setAttendance(prev => [data[0], ...prev])
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add attendance')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add attendance' }
    }
  }

  // Update attendance record
  const updateAttendance = async (id: number, updates: Partial<Attendance>) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setAttendance(prev => prev.map(record => 
          record.id === id ? { ...record, ...updates } : record
        ))
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update attendance')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update attendance' }
    }
  }

  // Delete attendance record
  const deleteAttendance = async (id: number) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setAttendance(prev => prev.filter(record => record.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete attendance')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete attendance' }
    }
  }

  // Get attendance by student
  const getAttendanceByStudent = (studentId: number) => {
    return attendance.filter(record => record.student_id === studentId)
  }

  // Get attendance by date
  const getAttendanceByDate = (date: string) => {
    return attendance.filter(record => record.date === date)
  }

  // Get attendance by status
  const getAttendanceByStatus = (status: string) => {
    return attendance.filter(record => record.status === status)
  }

  // Get attendance count by status for a specific date
  const getAttendanceCountByStatus = (date: string, status: string) => {
    return attendance.filter(record => record.date === date && record.status === status).length
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  return {
    attendance,
    loading,
    error,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudent,
    getAttendanceByDate,
    getAttendanceByStatus,
    getAttendanceCountByStatus,
    refreshAttendance: fetchAttendance
  }
}
