import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Student {
  id: number
  name: string
  email: string
  phone: string
  date_of_birth: string
  gender?: string
  program_id: number
  status: string
  enrollment_date: string
  notes: string
  picture_url?: string | null
  // Additional fields for comprehensive student information
  parent_name?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  medical_conditions?: string
  allergies?: string
  class_name?: string
  class_id?: number
  teacher?: string
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

export interface Teacher {
  id: number
  first_name: string
  last_name: string
  email: string
  department?: string
  status: string
}

export interface Class {
  id: number
  name: string
  program_id: number
  teacher_id: number | null
  max_capacity: number
  current_enrollment: number
  status: string
  description: string
  created_at: string
  updated_at: string
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching students...')
      
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name')

      if (error) {
        console.error('❌ Error fetching students:', error)
        throw error
      }
      
      console.log('✅ Students fetched successfully:', data?.length || 0)
      setStudents(data || [])
    } catch (err) {
      console.error('❌ Failed to fetch students:', err)
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

  // Fetch all teachers from the users table (users with teacher role)
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, department, status')
        .eq('role', 'teacher')
        .eq('status', 'active')
        .order('first_name')

      if (error) throw error
      
      setTeachers(data || [])
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
    }
  }

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      setClasses(data || [])
    } catch (err) {
      console.error('Failed to fetch classes:', err)
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
      console.log('🔍 updateStudent called with:', { id, updates });
      console.log('🔍 updateStudent - class_id being sent:', updates.class_id);
      console.log('🔍 updateStudent - class_name being sent:', updates.class_name);
      console.log('🔍 updateStudent - program_id being sent:', updates.program_id);
      
      // First, let's check what the current student data looks like
      const { data: currentStudent, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching current student:', fetchError);
      } else {
        console.log('🔍 Current student data:', currentStudent);
      }
      
      // Check current authentication status
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('🔍 Current auth user:', authUser);
      
      // Map class_id to class_name for database update
      const updateData = { ...updates, updated_at: new Date().toISOString() };
      
      // If class_id is provided, map it to class_name for the database
      if (updates.class_id !== undefined) {
        // Get the class name from the class_id
        const classData = classes.find(c => c.id === updates.class_id);
        updateData.class_name = classData ? classData.name : null;
        delete updateData.class_id; // Remove class_id since database uses class_name
      }
      
      console.log('🔍 Exact update data being sent to database:', updateData);
      console.log('🔍 Update data class_name:', updateData.class_name);
      console.log('🔍 Update data class_name type:', typeof updateData.class_name);
      
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('❌ Database update error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Database update successful:', data);
      console.log('✅ Updated student class_name:', data?.[0]?.class_name);
      console.log('✅ Updated student program_id:', data?.[0]?.program_id);
      console.log('🔍 Returned data class_name type:', typeof data?.[0]?.class_name);
      console.log('🔍 Full returned student data:', data?.[0]);
      
      if (data) {
        setStudents(prev => prev.map(student => 
          student.id === id ? { ...student, ...updates, updated_at: new Date().toISOString() } : student
        ))
        
        // Refresh the students data to ensure UI is updated
        console.log('🔄 Refreshing students data after update...');
        await fetchStudents();
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('❌ updateStudent catch block:', err);
      setError(err instanceof Error ? err.message : 'Failed to update student')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update student' }
    }
  }

  // Delete student
  const deleteStudent = async (id: number) => {
    try {
      // First, delete all related records from all tables that reference this student
      
      // Delete attendance records
      const { error: attendanceError } = await supabase
        .from('attendance')
        .delete()
        .eq('student_id', id)

      if (attendanceError) {
        console.warn('Failed to delete attendance records, continuing with student deletion:', attendanceError)
      }

      // Delete daily notes
      const { error: dailyNotesError } = await supabase
        .from('daily_notes')
        .delete()
        .eq('student_id', id)

      if (dailyNotesError) {
        console.warn('Failed to delete daily notes, continuing with student deletion:', dailyNotesError)
      }

      // Delete any other related records (add more tables as needed)
      // For example, if you have forms, payments, etc.
      
      // Delete forms if they exist
      try {
        const { error: formsError } = await supabase
          .from('forms')
          .delete()
          .eq('student_id', id)
        
        if (formsError) {
          console.warn('Failed to delete forms, continuing with student deletion:', formsError)
        }
      } catch (formsError) {
        console.warn('Forms table may not exist, continuing:', formsError)
      }

      // Delete payments if they exist
      try {
        const { error: paymentsError } = await supabase
          .from('payments')
          .delete()
          .eq('student_id', id)
        
        if (paymentsError) {
          console.warn('Failed to delete payments, continuing with student deletion:', paymentsError)
        }
      } catch (paymentsError) {
        console.warn('Payments table may not exist, continuing:', paymentsError)
      }

      // Then, delete the student's picture if they have one
      const student = students.find(s => s.id === id)
      if (student?.picture_url) {
        try {
          await deleteStudentPicture(id)
        } catch (pictureError) {
          console.warn('Failed to delete student picture, continuing with student deletion:', pictureError)
        }
      }

      // Finally, delete the student record
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        throw error
      }
      
      // Remove from local state
      setStudents(prev => prev.filter(student => student.id !== id))
      
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error deleting student:', err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
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

  // Get classes by program ID
  const getClassesByProgram = (programId: number) => {
    return classes.filter(cls => cls.program_id === programId)
  }

  // Get teacher name by ID
  const getTeacherName = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher'
  }

  // Get class by ID
  const getClassById = (classId: number) => {
    return classes.find(cls => cls.id === classId)
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
    const loadAllData = async () => {
      console.log('🚀 Starting to load all data...')
      setLoading(true)
      
      try {
        // Load all data in parallel for better performance
        const [studentsResult, programsResult, teachersResult, classesResult] = await Promise.allSettled([
          supabase.from('students').select('*').order('name'),
          supabase.from('programs').select('*').order('name'),
          supabase.from('users').select('*').eq('role', 'teacher').order('first_name'),
          supabase.from('classes').select('*').order('name')
        ])

        // Process students
        if (studentsResult.status === 'fulfilled' && !studentsResult.value.error) {
          console.log('✅ Students loaded:', studentsResult.value.data?.length || 0)
          setStudents(studentsResult.value.data || [])
        } else {
          console.error('❌ Failed to load students:', studentsResult.status === 'rejected' ? studentsResult.reason : studentsResult.value.error)
        }

        // Process programs
        if (programsResult.status === 'fulfilled' && !programsResult.value.error) {
          console.log('✅ Programs loaded:', programsResult.value.data?.length || 0)
          setPrograms(programsResult.value.data || [])
        } else {
          console.error('❌ Failed to load programs:', programsResult.status === 'rejected' ? programsResult.reason : programsResult.value.error)
        }

        // Process teachers
        if (teachersResult.status === 'fulfilled' && !teachersResult.value.error) {
          console.log('✅ Teachers loaded:', teachersResult.value.data?.length || 0)
          setTeachers(teachersResult.value.data || [])
        } else {
          console.error('❌ Failed to load teachers:', teachersResult.status === 'rejected' ? teachersResult.reason : teachersResult.value.error)
        }

        // Process classes
        if (classesResult.status === 'fulfilled' && !classesResult.value.error) {
          console.log('✅ Classes loaded:', classesResult.value.data?.length || 0)
          setClasses(classesResult.value.data || [])
        } else {
          console.error('❌ Failed to load classes:', classesResult.status === 'rejected' ? classesResult.reason : classesResult.value.error)
        }

        console.log('🎉 All data loading completed!')
      } catch (error) {
        console.error('❌ Error loading data:', error)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  return {
    students,
    programs,
    teachers,
    classes,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByProgram,
    getProgramName,
    getClassesByProgram,
    getTeacherName,
    getClassById,
    getStudentCountByStatus,
    uploadStudentPicture,
    deleteStudentPicture,
    refreshStudents: fetchStudents,
    refreshPrograms: fetchPrograms,
    refreshTeachers: fetchTeachers,
    refreshClasses: fetchClasses
  }
}
