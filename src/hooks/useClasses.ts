import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { requestThrottle } from '../lib/requestThrottle'

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Add call tracking to prevent infinite loops
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false)
  const [isFetchingClasses, setIsFetchingClasses] = useState(false)
  const hasLoadedInitialData = useRef(false)

  // Fetch all classes with retry logic and throttling
  const fetchClasses = async (retryCount = 0) => {
    // Prevent multiple simultaneous calls
    if (isFetchingClasses) {
      console.log('Classes fetch already in progress, skipping...');
      return;
    }
    
    setIsFetchingClasses(true);
    
    return requestThrottle.throttleRequest(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .order('name')

        if (error) throw error
        
        console.log('Classes fetched successfully:', data);
        
        
        setClasses(data || [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch classes:', err)
        if (retryCount < 2) {
          // Retry up to 2 times with exponential backoff
          setTimeout(() => fetchClasses(retryCount + 1), Math.pow(2, retryCount) * 1000)
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch classes')
        }
      } finally {
        setLoading(false)
        setIsFetchingClasses(false)
      }
    });
  }

  // Fetch all programs
  const fetchPrograms = useCallback(async () => {
    try {
      console.log('Fetching programs...');
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }
      
      console.log('Programs fetched successfully:', data);
      setPrograms(data || [])
    } catch (err) {
      console.error('Failed to fetch programs:', err)
    }
  }, [])

  // Fetch all teachers from the users table (users with teacher role) with retry logic and throttling
  const fetchTeachers = useCallback(async (retryCount = 0) => {
    // Prevent multiple simultaneous calls
    if (isFetchingTeachers) {
      console.log('Teachers fetch already in progress, skipping...');
      return;
    }
    
    setIsFetchingTeachers(true);
    
    return requestThrottle.throttleRequest(async () => {
      try {
        console.log('Fetching teachers...');
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, department, status')
          .eq('role', 'teacher')
          .eq('status', 'active')
          .order('first_name')

        if (error) {
          console.error('Error fetching teachers:', error);
          throw error;
        }
        
        console.log('Teachers fetched successfully:', data);
        
        
        setTeachers(data || [])
      } catch (err) {
        console.error('Failed to fetch teachers:', err)
        if (retryCount < 2) {
          // Retry up to 2 times with exponential backoff
          setTimeout(() => fetchTeachers(retryCount + 1), Math.pow(2, retryCount) * 1000)
        }
      } finally {
        setIsFetchingTeachers(false);
      }
    });
  }, [])

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      console.log('Fetching students...');
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      console.log('Students fetched successfully:', data);
      setStudents(data || [])
      
      // Debug logging for student data structure
      if (data && data.length > 0) {
        console.log('Sample student data:', {
          firstStudent: data[0],
          programIds: [...new Set(data.map(s => s.program_id))],
          classIds: [...new Set(data.map(s => s.class_id).filter(Boolean))]
        });
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
    }
  }, [])


  // Add new class
  const addClass = async (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
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
  const updateClass = async (id: number, updates: Partial<Class>) => {
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
  const deleteClass = async (id: number) => {
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

  // Get student count by program (including students assigned to classes within the program)
  const getStudentCountByProgram = (programId: number) => {
    // Count all students assigned to this program (either directly or through classes)
    const programStudents = students.filter(s => {
      // Check direct program assignment
      if (s.program_id === programId) {
        return true;
      }
      
      // Check class assignment (if student is assigned to a class within this program)
      if (s.class_id) {
        const studentClass = classes.find(c => c.id === s.class_id);
        return studentClass && studentClass.program_id === programId;
      }
      
      return false;
    });
    
    return programStudents.length;
  }

  // Get total student count across all programs
  const getTotalStudentCount = () => {
    return students.length
  }


  // Refresh all data
  const refreshClasses = () => {
    fetchClasses()
  }

  // Load initial data automatically
  useEffect(() => {
    if (hasLoadedInitialData.current) return;
    
    const fetchAllData = async () => {
      try {
        hasLoadedInitialData.current = true;
        await Promise.all([
          fetchClasses(),
          fetchPrograms(),
          fetchTeachers(),
          fetchStudents()
        ]);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        hasLoadedInitialData.current = false; // Reset on error so it can retry
      }
    };
    
    fetchAllData();
  }, [])

  // Listen for teacher assignment events to refresh data
  useEffect(() => {
    const handleTeacherAssigned = (event: CustomEvent) => {
      console.log('🔄 Teacher assigned event received, refreshing classes and teachers data...', event.detail);
      // Refresh classes and teachers data to show the new assignment
      fetchClasses();
      fetchTeachers();
    };

    const handleTeacherReassigned = (event: CustomEvent) => {
      console.log('🔄 Teacher reassigned event received, refreshing classes and teachers data...', event.detail);
      // Refresh classes and teachers data to show the reassignment
      fetchClasses();
      fetchTeachers();
    };

    const handleTeacherDeleted = (event: CustomEvent) => {
      console.log('🔄 Teacher deleted event received, refreshing classes and teachers data...', event.detail);
      // Refresh classes and teachers data to remove the deleted teacher
      fetchClasses();
      fetchTeachers();
    };

    // Add event listeners
    window.addEventListener('teacherAssigned', handleTeacherAssigned as EventListener);
    window.addEventListener('teacherReassigned', handleTeacherReassigned as EventListener);
    window.addEventListener('teacherDeleted', handleTeacherDeleted as EventListener);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('teacherAssigned', handleTeacherAssigned as EventListener);
      window.removeEventListener('teacherReassigned', handleTeacherReassigned as EventListener);
      window.removeEventListener('teacherDeleted', handleTeacherDeleted as EventListener);
    };
  }, [])

  return {
    classes,
    programs,
    teachers,
    students,
    loading,
    error,
    getClassesByProgram,
    getClassCountByProgram,
    getTeacherName,
    getStudentCountByProgram,
    getTotalStudentCount,
    addClass,
    updateClass,
    deleteClass,
    refreshClasses,
    refreshPrograms: fetchPrograms,
    refreshTeachers: () => {
      fetchTeachers();
    },
    refreshStudents: fetchStudents
  }
}

// Types - Updated to match database schema
export interface Class {
  id: number
  name: string
  program_id: number
  teacher_id?: number | null
  max_capacity: number
  current_enrollment: number
  status: string
  description: string
  created_at: string
  updated_at: string
}

export interface Program {
  id: number
  name: string
  description: string
  status: string
  type?: string
  capacity?: number
  age_range?: string
  age_range_start?: number
  age_range_end?: number
  location?: string
  schedule?: string
  start_date?: string
  coordinator?: string
  coordinator_email?: string
  coordinator_phone?: string
  requirements?: string
  objectives?: string
  curriculum?: string
  assessment_methods?: string
  staff_requirements?: string
  budget?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: number
  first_name: string
  last_name: string
  email: string
  department?: string
  status: string
}
