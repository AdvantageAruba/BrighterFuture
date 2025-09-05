import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  department?: string
  status: string
  picture_url?: string
  permissions: string[]
  program_id?: number
  class_id?: string
  created_at: string
  updated_at: string
}

export interface Program {
  id: number
  name: string
  description?: string
  max_capacity: number
  status: string
}

export interface ClassGroup {
  id: string
  name: string
  program_id: number
  description?: string
  max_students: number
  status: string
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [classes, setClasses] = useState<ClassGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('first_name')

      if (error) {
        console.error('Users table error:', error)
        // If table doesn't exist, set empty array and continue
        if (error.code === 'PGRST116' || error.message?.includes('relation "users" does not exist')) {
          setUsers([])
          setError(null) // Clear error for missing table
        } else {
          throw error
        }
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
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

      if (error) {
        console.error('Programs table error:', error)
        if (error.code === 'PGRST116' || error.message?.includes('relation "programs" does not exist')) {
          setPrograms([])
        } else {
          throw error
        }
      } else {
        setPrograms(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch programs:', err)
      setPrograms([]) // Set empty array on error
    }
  }

  // Fetch classes for a specific program
  const fetchClasses = async (programId?: number) => {
    try {
      let query = supabase
        .from('classes')
        .select('*')
        .order('name')

      if (programId) {
        query = query.eq('program_id', programId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Classes table error:', error)
        if (error.code === 'PGRST116' || error.message?.includes('relation "classes" does not exist')) {
          setClasses([])
        } else {
          throw error
        }
      } else {
        setClasses(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err)
      setClasses([]) // Set empty array on error
    }
  }

  // Add new user
  const addUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert([userData], { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select()

      if (error) throw error
      
      if (data) {
        const newUser = data[0]
        setUsers(prev => [...prev, newUser])
        
        // If this is a teacher with program_id and class_id, automatically assign them to the class
        if (newUser.role === 'teacher' && newUser.program_id && newUser.class_id) {
          try {
            const { error: classError } = await supabase
              .from('classes')
              .update({ teacher_id: newUser.id })
              .eq('id', newUser.class_id)
              .eq('program_id', newUser.program_id)
            
            if (classError) {
              console.error('Failed to auto-assign teacher to class:', classError)
              // Don't throw error here - user was created successfully, just assignment failed
            } else {
              // Refresh classes to update UI immediately
              fetchClasses()
            }
          } catch (assignError) {
            console.error('Error during auto-assignment:', assignError)
            // Don't throw error here - user was created successfully
          }
        }
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add user' }
    }
  }

  // Update user
  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...updates, updated_at: new Date().toISOString() } : user
        ))
      }
      
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update user' }
    }
  }

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setUsers(prev => prev.filter(user => user.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete user' }
    }
  }

  // Upload user picture
  const uploadUserPicture = async (userId: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `user-${userId}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('user-pictures')
        .getPublicUrl(fileName)

      // Update user record with picture URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ picture_url: urlData.publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, picture_url: urlData.publicUrl }
          : user
      ))

      return { success: true, url: urlData.publicUrl }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload picture')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to upload picture' }
    }
  }

  // Delete user picture
  const deleteUserPicture = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user?.picture_url) {
        return { success: true } // No picture to delete
      }

      // Extract filename from URL
      const urlParts = user.picture_url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('user-pictures')
        .remove([fileName])

      if (deleteError) throw deleteError

      // Update user record to remove picture URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ picture_url: null })
        .eq('id', userId)

      if (updateError) throw updateError

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, picture_url: undefined }
          : user
      ))

      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete picture')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete picture' }
    }
  }

  // Get program name by ID
  const getProgramName = (programId: number) => {
    const program = programs.find(p => p.id === programId)
    return program?.name || 'Unknown Program'
  }

  // Get class name by ID
  const getClassName = (classId: string) => {
    // Try different ID formats to handle type mismatches
    let classGroup = classes.find(c => c.id === classId);
    
    if (!classGroup) {
      // Try string comparison
      classGroup = classes.find(c => String(c.id) === String(classId));
      
      if (!classGroup) {
        // Try number comparison
        classGroup = classes.find(c => c.id === Number(classId));
      }
    }
    
    return classGroup?.name || 'Unknown Class'
  }

  useEffect(() => {
    fetchUsers()
    fetchPrograms()
    fetchClasses()
  }, [])

  return {
    users,
    programs,
    classes,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    uploadUserPicture,
    deleteUserPicture,
    fetchClasses,
    getProgramName,
    getClassName,
    refreshUsers: fetchUsers,
    refreshPrograms: fetchPrograms
  }
}
