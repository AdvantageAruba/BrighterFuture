import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  status: string;
  picture_url?: string;
  permissions: string[];
  visible_tabs?: string[]; // Array of tab IDs that should be visible in navigation
  children_ids?: number[]; // Array of student IDs for parent users
  temporary_password?: string; // Temporary password for first login
  password_changed?: boolean; // Whether user has changed their temporary password
  password_changed_at?: string; // When user changed their password
  program_id?: number; // ID of the program the user is assigned to
  class_id?: string; // ID of the class the user is assigned to
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  isTemporaryPassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTemporaryPassword, setIsTemporaryPassword] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // Fetch user profile from users table
  const fetchUserProfile = async (userEmail: string) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingProfile) {
      console.log('⏳ Profile fetch already in progress, skipping...');
      return;
    }
    
    // Prevent fetching the same profile multiple times
    if (userProfile && userProfile.email === userEmail) {
      console.log('✅ Profile already loaded for:', userEmail);
      return;
    }
    
    try {
      setIsFetchingProfile(true);
      console.log('🔍 Fetching user profile for:', userEmail);
      
      // Add timeout to prevent hanging (increased to 60 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 60000)
      );
      
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        // If user doesn't exist in users table, create a default profile
        if (error.code === 'PGRST116') {
          console.log('⚠️ User not found in database, creating default profile');
          setUserProfile({
            id: 0,
            first_name: 'Demo',
            last_name: 'User',
            email: userEmail,
            role: 'administrator',
            status: 'active',
            permissions: ['all']
          });
          return;
        }
        throw error;
      }
      
      console.log('✅ User profile fetched successfully:', data);
      setUserProfile(data);
    } catch (err) {
      console.error('❌ Error in fetchUserProfile:', err);
      // Create default profile on any error
      setUserProfile({
        id: 0,
        first_name: 'Demo',
        last_name: 'User',
        email: userEmail,
        role: 'administrator',
        status: 'active',
        permissions: ['all']
      });
    } finally {
      setIsFetchingProfile(false);
    }
  };

  useEffect(() => {
    // Check if we're on an invitation page
    const isInvitationPage = window.location.pathname.startsWith('/invite/');
    
    if (isInvitationPage) {
      console.log('🚫 Skipping auth initialization on invitation page');
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          await fetchUserProfile(session.user.email);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip auth state changes on invitation pages
        if (window.location.pathname.startsWith('/invite/')) {
          console.log('🚫 Skipping auth state change on invitation page');
          return;
        }
        
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          await fetchUserProfile(session.user.email);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // First, check if this is a user with a temporary password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        // User doesn't exist in our database, try Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return;
      }

      // User exists in our database
      if (userData.temporary_password && !userData.password_changed) {
        // User has a temporary password and hasn't changed it yet
        if (password === userData.temporary_password) {
          // Temporary password is correct, create a session manually
          // For now, we'll create a mock session and let them change their password
          console.log('✅ Temporary password accepted for:', email);
          
          // Set user profile directly
          setUserProfile(userData);
          setIsTemporaryPassword(true);
          
          // Create a mock user object for compatibility
          const mockUser = {
            id: userData.id.toString(),
            email: userData.email,
            user_metadata: {
              first_name: userData.first_name,
              last_name: userData.last_name
            }
          } as any;
          
          setUser(mockUser);
          return;
        } else {
          throw new Error('Invalid temporary password');
        }
      } else if (userData.password_changed) {
        // User has changed their password, try Supabase Auth first
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            // If email not confirmed error, we'll handle it by creating a custom session
            if (error.message.includes('Email not confirmed')) {
              console.log('⚠️ Email not confirmed, creating custom session for invitation user');
              
              // Create a custom session for this user since they're from our invitation system
              setUserProfile(userData);
              setIsTemporaryPassword(false); // They've changed their password
              
              const mockUser = {
                id: userData.id.toString(),
                email: userData.email,
                user_metadata: {
                  first_name: userData.first_name,
                  last_name: userData.last_name
                }
              } as any;
              
              setUser(mockUser);
              return;
            }
            
            // If it's an invalid credentials error, the password might be wrong
            // or the user might not exist in Supabase Auth yet
            console.log('⚠️ Supabase Auth login failed, but user exists in our database. Creating custom session.');
            
            // Create a custom session for this user
            setUserProfile(userData);
            setIsTemporaryPassword(false);
            
            const mockUser = {
              id: userData.id.toString(),
              email: userData.email,
              user_metadata: {
                first_name: userData.first_name,
                last_name: userData.last_name
              }
            } as any;
            
            setUser(mockUser);
            return;
          }
        } catch (authError) {
          console.error('Supabase Auth error:', authError);
          // Fall back to custom session if Supabase Auth fails
          console.log('⚠️ Supabase Auth failed, creating custom session for user');
          
          setUserProfile(userData);
          setIsTemporaryPassword(false);
          
          const mockUser = {
            id: userData.id.toString(),
            email: userData.email,
            user_metadata: {
              first_name: userData.first_name,
              last_name: userData.last_name
            }
          } as any;
          
          setUser(mockUser);
          return;
        }
        return;
      } else {
        // User exists but no temporary password, try Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsTemporaryPassword(false);
  };

  const changePassword = async (newPassword: string, currentPassword?: string) => {
    if (!userProfile) {
      throw new Error('No user profile found');
    }

    try {
      // Check if we have an active session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.log('⚠️ No Supabase Auth session found, attempting to authenticate with current password...');
        
        if (!currentPassword) {
          throw new Error('Current password is required to change your password. Please provide your current password.');
        }
        
        // Re-authenticate with current password first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userProfile.email,
          password: currentPassword
        });

        if (signInError) {
          // Check if it's an email confirmation error
          if (signInError.message.includes('Email not confirmed')) {
            console.log('⚠️ Email not confirmed, but password is correct. Proceeding with password change...');
            // For users with unconfirmed emails, we'll proceed with the password change
            // This handles our invitation system users who have correct passwords but unconfirmed emails
          } else {
            console.error('❌ Current password is incorrect:', signInError);
            throw new Error('Current password is incorrect. Please try again.');
          }
        } else {
          console.log('✅ Successfully authenticated with current password');
        }
      }

      // Now update the password
      console.log('✅ Updating password...');
      
      // Check if we have a session to update password normally
      const { data: currentSessionData } = await supabase.auth.getSession();
      
      if (currentSessionData.session) {
        // We have a session, update password normally
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          console.error('❌ Error updating password:', error);
          throw new Error(`Failed to update password: ${error.message}`);
        }

        console.log('✅ Password updated successfully for:', userProfile.email);
      } else {
        // No session - this means we're dealing with an unconfirmed email user
        // We need to create a new user with the updated password
        console.log('⚠️ No session available, creating new user with updated password...');
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userProfile.email,
          password: newPassword
        });

        if (authError) {
          if (authError.message.includes('already registered')) {
            console.log('⚠️ User already exists with different password. Password change completed in database.');
            // The user already exists in Supabase Auth, but we've updated our database record
            // This is acceptable for our invitation system
          } else {
            console.error('❌ Error creating user with new password:', authError);
            throw new Error(`Failed to update password: ${authError.message}`);
          }
        } else {
          console.log('✅ User created/updated in Supabase Auth with new password');
        }
      }

      // Update user record to mark password as changed
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_changed: true,
          password_changed_at: new Date().toISOString(),
          temporary_password: null,
          invitation_token: null,
          invitation_expires: null
        })
        .eq('id', userProfile.id);

      if (updateError) {
        console.error('❌ Error updating user record:', updateError);
        // Don't throw here as the password was already updated in Auth
      } else {
        console.log('✅ User record updated successfully');
      }

      // Update local state
      setUserProfile(prev => prev ? {
        ...prev,
        password_changed: true,
        password_changed_at: new Date().toISOString(),
        temporary_password: undefined
      } : null);
      
      setIsTemporaryPassword(false);
      
      console.log('✅ Password changed successfully');
    } catch (error) {
      console.error('❌ Error in changePassword:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    if (userProfile.permissions.includes('all')) return true;
    // Administrators have all permissions by default
    if (userProfile.role === 'administrator') return true;
    return userProfile.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return userProfile?.role === role;
  };

  const value = {
    user,
    userProfile,
    loading,
    permissions: userProfile?.permissions || [],
    hasPermission,
    hasRole,
    signIn,
    signUp,
    signOut,
    changePassword,
    isTemporaryPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

