import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateInvitationToken } from '../lib/passwordUtils'
import { sendInvitationEmail, generateInvitationLink } from '../lib/emailService'

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
  visible_tabs?: string[] // Array of tab IDs that should be visible in navigation
  program_id?: number
  class_id?: string
  children_ids?: number[] // Array of student IDs for parent users
  password_reset_token?: string // Token for password reset
  password_reset_expires?: string // Expiration for password reset token
  invitation_token?: string // Token for invitation links
  invitation_expires?: string // Expiration for invitation token
  invitation_sent?: boolean // Whether invitation email was sent
  invitation_sent_at?: string // When invitation email was sent
  password_changed?: boolean // Whether user has changed their temporary password
  password_changed_at?: string // When user changed their password
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

export interface Student {
  id: number
  name: string
  date_of_birth?: string
  gender?: string
  program_id?: number
  class_id?: number
  status: string
  parent_name?: string
  phone?: string
  email?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  medical_conditions?: string
  allergies?: string
  picture_url?: string
  created_at: string
  updated_at: string
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [classes, setClasses] = useState<ClassGroup[]>([])
  const [students, setStudents] = useState<Student[]>([])
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

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name')

      if (error) {
        console.error('Students table error:', error)
        if (error.code === 'PGRST116' || error.message?.includes('relation "students" does not exist')) {
          setStudents([])
        } else {
          throw error
        }
      } else {
        setStudents(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
      setStudents([]) // Set empty array on error
    }
  }

  // Add new user
  const addUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>, sendInvitation: boolean = false) => {
    try {
      // Generate invitation token if sending invitation
      let invitationToken: string | undefined;
      let invitationExpires: string | undefined;
      
      if (sendInvitation) {
        invitationToken = generateInvitationToken(32);
        // Set invitation to expire in 7 days
        invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      }
      
      const userDataWithInvitation = {
        ...userData,
        invitation_token: invitationToken,
        invitation_expires: invitationExpires,
        invitation_sent: false,
        password_changed: false
      };
      
      const { data, error } = await supabase
        .from('users')
        .upsert([userDataWithInvitation], { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select()

      if (error) throw error
      
      if (data) {
        const newUser = data[0]
        setUsers(prev => [...prev, newUser])
        
        // Send invitation email if requested
        if (sendInvitation && invitationToken) {
          try {
            const invitationLink = generateInvitationLink(invitationToken);
            
            const emailResult = await sendInvitationEmail({
              recipientName: `${newUser.first_name} ${newUser.last_name}`,
              recipientEmail: newUser.email,
              invitationLink,
              organizationName: 'Brighter Future',
              senderName: 'System Administrator',
              role: newUser.role
            });
            
            if (emailResult.success) {
              // Update user record to mark invitation as sent
              const { error: updateError } = await supabase
                .from('users')
                .update({
                  invitation_sent: true,
                  invitation_sent_at: new Date().toISOString()
                })
                .eq('id', newUser.id);
              
              if (updateError) {
                console.error('Failed to update invitation sent status:', updateError);
              } else {
                console.log('✅ Invitation email sent successfully');
                // Update local state
                setUsers(prev => prev.map(user => 
                  user.id === newUser.id 
                    ? { ...user, invitation_sent: true, invitation_sent_at: new Date().toISOString() }
                    : user
                ));
              }
            } else {
              console.error('Failed to send invitation email:', emailResult.error);
            }
          } catch (emailError) {
            console.error('Error sending invitation email:', emailError);
          }
        }
        
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
              console.log(`✅ Teacher ${newUser.first_name} ${newUser.last_name} automatically assigned to class ${newUser.class_id}`)
              // Refresh classes to update UI immediately
              fetchClasses()
              
              // Also trigger a custom event to notify other components
              window.dispatchEvent(new CustomEvent('teacherAssigned', { 
                detail: { 
                  teacherId: newUser.id, 
                  teacherName: `${newUser.first_name} ${newUser.last_name}`,
                  classId: newUser.class_id,
                  programId: newUser.program_id
                } 
              }))
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
      // Get the current user data to check for changes
      const currentUser = users.find(u => u.id === id)
      
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) {
        console.error('❌ updateUser - Database error:', error);
        
        // Check if the error is due to missing granular_permissions column
        if (error.code === '42703' && error.message?.includes('granular_permissions')) {
          console.warn('⚠️ granular_permissions column does not exist. Attempting to update without it...');
          
          // Remove granular_permissions from updates and try again
          const { granular_permissions, ...updatesWithoutGranular } = updates;
          
          const { data: retryData, error: retryError } = await supabase
            .from('users')
            .update({ ...updatesWithoutGranular, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
          
          if (retryError) {
            console.error('❌ updateUser - Retry failed:', retryError);
            throw retryError;
          }
          
          if (retryData) {
            const updatedUser = retryData[0]
            setUsers(prev => prev.map(user => 
              user.id === id ? { ...user, ...updatesWithoutGranular, updated_at: new Date().toISOString() } : user
            ))
            
            console.warn('⚠️ User updated successfully but granular_permissions were not saved. Please run the database migration.');
            return { success: true, data: updatedUser, warning: 'granular_permissions field not found in database' }
          }
        }
        
        throw error;
      }
      
      if (data) {
        const updatedUser = data[0]
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...updates, updated_at: new Date().toISOString() } : user
        ))

        // Handle teacher reassignment if this is a teacher and class assignment changed
        if (updatedUser.role === 'teacher' && currentUser) {
          const oldClassId = currentUser.class_id
          const newClassId = updatedUser.class_id
          
          // Only process if class assignment actually changed
          if (oldClassId !== newClassId) {
            // Remove teacher from old class (if any)
            if (oldClassId) {
              const { error: removeError } = await supabase
                .from('classes')
                .update({ teacher_id: null })
                .eq('id', oldClassId)
                .eq('teacher_id', id)
              
              if (removeError) {
                console.error('Failed to remove teacher from old class:', removeError)
              } else {
                console.log(`✅ Teacher ${updatedUser.first_name} ${updatedUser.last_name} removed from old class ${oldClassId}`)
              }
            }
            
            // Also remove teacher from any other classes they might be assigned to
            // This ensures no duplicate assignments
            const { error: removeAllError } = await supabase
              .from('classes')
              .update({ teacher_id: null })
              .eq('teacher_id', id)
              .neq('id', newClassId || 0) // Don't remove from the new class
            
            if (removeAllError) {
              console.error('Failed to remove teacher from other classes:', removeAllError)
            } else {
              console.log(`✅ Teacher ${updatedUser.first_name} ${updatedUser.last_name} removed from all other classes`)
            }
            
            // Assign teacher to new class (if any)
            if (newClassId) {
              const { error: assignError } = await supabase
                .from('classes')
                .update({ teacher_id: id })
                .eq('id', newClassId)
                .eq('program_id', updatedUser.program_id)
              
              if (assignError) {
                console.error('Failed to assign teacher to new class:', assignError)
              } else {
                console.log(`✅ Teacher ${updatedUser.first_name} ${updatedUser.last_name} assigned to new class ${newClassId}`)
                
                // Trigger custom event to notify other components
                window.dispatchEvent(new CustomEvent('teacherReassigned', { 
                  detail: { 
                    teacherId: id, 
                    teacherName: `${updatedUser.first_name} ${updatedUser.last_name}`,
                    oldClassId: oldClassId,
                    newClassId: newClassId,
                    programId: updatedUser.program_id
                  } 
                }))
              }
            }
            
            // Refresh classes data
            fetchClasses()
          } else {
            // Even if class assignment didn't change, ensure teacher is only assigned to one class
            // This fixes any existing duplicate assignments
            const { error: cleanupError } = await supabase
              .from('classes')
              .update({ teacher_id: null })
              .eq('teacher_id', id)
              .neq('id', updatedUser.class_id || 0)
            
            if (cleanupError) {
              console.error('Failed to cleanup duplicate teacher assignments:', cleanupError)
            } else {
              console.log(`✅ Cleaned up duplicate assignments for teacher ${updatedUser.first_name} ${updatedUser.last_name}`)
            }
            
            // Refresh classes data
            fetchClasses()
          }
        }
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
      // Get the user being deleted to check if they're a teacher
      const userToDelete = users.find(u => u.id === id)
      
      // If this is a teacher, remove them from any classes they're assigned to
      if (userToDelete?.role === 'teacher') {
        const { error: classError } = await supabase
          .from('classes')
          .update({ teacher_id: null })
          .eq('teacher_id', id)
        
        if (classError) {
          console.error('Failed to remove teacher from classes:', classError)
          // Continue with user deletion even if class update fails
        } else {
          console.log(`✅ Teacher ${userToDelete.first_name} ${userToDelete.last_name} removed from all classes`)
        }
      }
      
      // Delete the user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== id))
      
      // Trigger custom event to notify other components (like useClasses) to refresh their data
      if (userToDelete?.role === 'teacher') {
        window.dispatchEvent(new CustomEvent('teacherDeleted', { 
          detail: { 
            teacherId: id, 
            teacherName: `${userToDelete.first_name} ${userToDelete.last_name}`
          } 
        }))
      }
      
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

  // Clean up duplicate teacher assignments
  const cleanupDuplicateTeacherAssignments = async () => {
    try {
      console.log('🧹 Starting cleanup of duplicate teacher assignments...');
      
      // Get all teachers
      const { data: teachers, error: teachersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, class_id')
        .eq('role', 'teacher')
        .eq('status', 'active');

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        return;
      }

      // For each teacher, ensure they're only assigned to one class
      for (const teacher of teachers || []) {
        if (teacher.class_id) {
          // Remove teacher from all classes except their assigned one
          const { error: cleanupError } = await supabase
            .from('classes')
            .update({ teacher_id: null })
            .eq('teacher_id', teacher.id)
            .neq('id', teacher.class_id);

          if (cleanupError) {
            console.error(`Failed to cleanup assignments for teacher ${teacher.first_name} ${teacher.last_name}:`, cleanupError);
          } else {
            console.log(`✅ Cleaned up duplicate assignments for teacher ${teacher.first_name} ${teacher.last_name}`);
          }
        }
      }

      // Refresh classes data
      fetchClasses();
      console.log('🧹 Cleanup completed!');
      
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  };

  useEffect(() => {
    fetchUsers()
    fetchPrograms()
    fetchClasses()
    fetchStudents()
  }, [])

  return {
    users,
    programs,
    classes,
    students,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    uploadUserPicture,
    deleteUserPicture,
    fetchClasses,
    fetchStudents,
    getProgramName,
    getClassName,
    cleanupDuplicateTeacherAssignments,
    refreshUsers: fetchUsers,
    refreshPrograms: fetchPrograms
  }
}
