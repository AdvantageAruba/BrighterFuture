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

  // Fetch user profile from users table
  const fetchUserProfile = async (userEmail: string) => {
    try {
      console.log('Attempting to fetch profile for:', userEmail);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('Query result:', { data, error });

      if (error) {
        console.error('Error fetching user profile:', error);
        // If user doesn't exist in users table, create a default profile
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, creating default profile');
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
      console.log('Profile found:', data);
      setUserProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Create default profile on any error
      console.log('Creating default profile due to error');
      setUserProfile({
        id: 0,
        first_name: 'Demo',
        last_name: 'User',
        email: userEmail,
        role: 'administrator',
        status: 'active',
        permissions: ['all']
      });
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session data:', session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          console.log('Fetching profile for:', session.user.email);
          await fetchUserProfile(session.user.email);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          console.log('Fetching profile for:', session.user.email);
          await fetchUserProfile(session.user.email);
        } else {
          console.log('No email in session, setting profile to null');
          // Temporary: Show session details for debugging
          console.log('Session user:', session?.user);
          console.log('Session user email:', session?.user?.email);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    if (userProfile.permissions.includes('all')) return true;
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

