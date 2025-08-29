import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Attendance {
  id: number
  student_id: number
  date: string
  status: string
  check_in: string | null
  check_out: string | null
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
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        attempt++;
        console.log(`Attempt ${attempt} to add attendance record`);
        
        const { data, error } = await supabase
          .from('attendance')
          .insert([attendanceData])
          .select()

        if (error) throw error
        
        if (data) {
          setAttendance(prev => [data[0], ...prev])
        }
        
        console.log('Attendance record added successfully');
        return { success: true, data: data?.[0] }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add attendance';
        console.error(`Attempt ${attempt} failed:`, errorMessage);
        
        // Check if it's a connection error
        if (errorMessage.includes('connection') || errorMessage.includes('network') || errorMessage.includes('ERR_CONNECTION_CLOSED')) {
          if (attempt < maxRetries) {
            console.log(`Connection error detected, retrying in ${attempt * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage }
      }
    }
    
    return { success: false, error: 'Failed to add attendance after multiple attempts' }
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

  // Fetch attendance for a specific student
  const fetchAttendanceByStudent = async (studentId: number) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student attendance')
      return []
    }
  }

  // Get student attendance statistics
  const getStudentAttendanceStats = (studentId: number) => {
    const studentAttendance = attendance.filter(record => record.student_id === studentId)
    const totalDays = studentAttendance.length
    const presentDays = studentAttendance.filter(r => r.status === 'present').length
    const absentDays = studentAttendance.filter(r => r.status === 'absent').length
    const lateDays = studentAttendance.filter(r => r.status === 'late').length
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendanceRate
    }
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
    fetchAttendanceByStudent,
    getStudentAttendanceStats,
    getAttendanceByDate,
    getAttendanceByStatus,
    getAttendanceCountByStatus,
    refreshAttendance: fetchAttendance
  }
}
