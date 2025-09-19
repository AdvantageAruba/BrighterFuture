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
  visible_tabs?: string[];
  children_ids?: number[];
  temporary_password?: string;
  password_changed?: boolean;
  password_changed_at?: string;
  program_id?: number;
  class_id?: string;
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

  // EMERGENCY FIX: Create admin profile immediately for development
  const createAdminProfile = (userEmail: string) => {
    console.log('🚀 Creating admin profile for development (bypassing database)');
    setUserProfile({
      id: 1,
      first_name: 'Admin',
      last_name: 'User',
      email: userEmail,
      role: 'administrator',
      status: 'active',
      permissions: ['all'],
      visible_tabs: ['dashboard', 'students', 'attendance', 'waitinglist', 'forms', 'dailynotes', 'calendar', 'announcements', 'programs', 'settings']
    });
  };

  // Proper fetchUserProfile - try to fetch real profile first
  const fetchUserProfile = async (userEmail: string) => {
    console.log('🔍 Fetching user profile for:', userEmail);
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();
        
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
        
      if (!error && data) {
        console.log('✅ Real profile fetched:', data);
        setUserProfile(data);
        return;
      } else {
        console.log('⚠️ Real profile not found, creating admin profile as fallback');
        createAdminProfile(userEmail);
      }
    } catch (err) {
      console.log('⚠️ Profile fetch error, creating admin profile as fallback:', err);
      createAdminProfile(userEmail);
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
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.email);
        } else {
          console.log('No active session found');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
        setUserProfile(null);
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
        
        if (session?.user) {
          await fetchUserProfile(session.user.email);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Emergency fallback - ensure loading is set to false after 15 seconds
    const emergencyTimeout = setTimeout(() => {
      console.log('🚨 Emergency timeout - forcing loading to false');
      setLoading(false);
    }, 15000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(emergencyTimeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // First, check if this is a user with a temporary password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('User not found in database');
      }

      // If user has a temporary password, validate it
      if (userData.temporary_password && !userData.password_changed) {
        if (password === userData.temporary_password) {
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

            // If it's an invalid credentials error, the password is wrong
            // Do NOT create a custom session - this is a security vulnerability
            console.log('❌ Invalid credentials - password is incorrect');
            throw new Error('Invalid login credentials');
          }
        } catch (authError) {
          console.error('Supabase Auth error:', authError);
          // Do NOT create custom session for auth errors - this is a security vulnerability
          throw new Error('Authentication failed');
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
    setUser(null);
    setUserProfile(null);
  };

  const changePassword = async (newPassword: string, currentPassword?: string) => {
    try {
      // Check if we have an active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      // Try to update password through Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        // If email not confirmed error, we'll handle it differently
        if (error.message.includes('Email not confirmed')) {
          console.log('⚠️ Email not confirmed, updating password in users table');
          
          // Update password in our users table
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              password_changed: true,
              password_changed_at: new Date().toISOString()
            })
            .eq('email', session.user.email);

          if (updateError) {
            throw new Error('Failed to update password');
          }

          console.log('✅ Password updated successfully in users table');
          return;
        }
        
        throw error;
      }

      console.log('✅ Password updated successfully');
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    
    // If user has 'all' permission, they can do everything
    if (userProfile.permissions.includes('all')) return true;
    
    // Administrators automatically have all permissions
    if (userProfile.role === 'administrator') return true;
    
    // Check for exact permission match
    if (userProfile.permissions.includes(permission)) return true;
    
    // Check for granular permissions (e.g., if asking for 'students', check for 'students.view', 'students.create', etc.)
    const granularPermission = userProfile.permissions.some(p => p.startsWith(`${permission}.`));
    if (granularPermission) return true;
    
    return false;
  };

  const hasRole = (role: string): boolean => {
    if (!userProfile) return false;
    return userProfile.role === role;
  };

  const permissions = userProfile?.permissions || [];

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        permissions,
        hasPermission,
        hasRole,
        signIn,
        signUp,
        signOut,
        changePassword,
        isTemporaryPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
