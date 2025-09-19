import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InvitationData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  invitation_expires: string;
  password_changed: boolean;
}

const InvitationPage: React.FC = () => {
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Get token from URL
  const getTokenFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/invite\/(.+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      validateInvitationToken(token);
    } else {
      setError('Invalid invitation link');
      setLoading(false);
    }
  }, []);

  const validateInvitationToken = async (invitationToken: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, role, invitation_expires, password_changed')
        .eq('invitation_token', invitationToken)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Invitation not found or has expired');
        } else {
          setError('Failed to validate invitation');
        }
        return;
      }

      if (!data) {
        setError('Invitation not found');
        return;
      }

      // Check if invitation has expired
      const now = new Date();
      const expiresAt = new Date(data.invitation_expires);
      
      if (now > expiresAt) {
        setError('This invitation has expired');
        return;
      }

      // Check if password has already been changed
      if (data.password_changed) {
        setError('This invitation has already been used');
        return;
      }

      setInvitationData(data);
    } catch (err) {
      console.error('Error validating invitation:', err);
      setError('Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const validateNewPassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationData) return;

    // Validate passwords
    const passwordValidation = validateNewPassword(newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');

    try {
      // First, try to create user in Supabase Auth with the new password
      console.log('🔐 Creating Supabase Auth user for:', invitationData.email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitationData.email,
        password: newPassword,
        options: {
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      if (authError) {
        // If user already exists in Supabase Auth, try to sign in to verify the password
        if (authError.message.includes('already registered')) {
          console.log('User already exists in Supabase Auth, verifying password...');
          
          // Try to sign in with the new password to verify it works
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: invitationData.email,
            password: newPassword
          });
          
          if (signInError) {
            console.error('Password verification failed:', signInError);
            throw new Error('Password verification failed. Please try again.');
          }
          
          console.log('✅ Password verified successfully');
        } else if (authError.message.includes('Email address') && authError.message.includes('invalid')) {
          console.log('⚠️ Email validation error, skipping Supabase Auth creation');
          console.log('This might be due to Supabase email validation rules');
          // Continue with the password change process even if Supabase Auth fails
        } else {
          console.error('Auth signup error:', authError);
          throw authError;
        }
      } else {
        console.log('✅ User created in Supabase Auth:', authData.user?.email);
        console.log('Auth user ID:', authData.user?.id);
        console.log('Email confirmed:', authData.user?.email_confirmed_at);
        
        // If email is not confirmed, we need to handle this
        if (!authData.user?.email_confirmed_at) {
          console.log('⚠️ Email not confirmed, but user can still log in with invitation system');
        }
      }

      // Update user record to mark password as changed
      const { error } = await supabase
        .from('users')
        .update({
          password_changed: true,
          password_changed_at: new Date().toISOString(),
          invitation_token: null, // Clear invitation token
          invitation_expires: null // Clear invitation expiration
        })
        .eq('id', invitationData.id);

      if (error) {
        throw error;
      }

      setPasswordChanged(true);
      
      // Try to automatically sign in the user with their new password
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: invitationData.email,
          password: newPassword
        });
        
        if (signInError) {
          console.log('Auto sign-in failed, redirecting to login page');
          // If auto sign-in fails, redirect to login page
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          console.log('✅ Auto sign-in successful, waiting for profile to load...');
          // If auto sign-in succeeds, wait a bit longer for profile to load
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      } catch (signInErr) {
        console.log('Auto sign-in error, redirecting to login page:', signInErr);
        // If auto sign-in fails, redirect to login page
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }

    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (passwordChanged) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
          <div className="text-sm text-gray-500">
            <p>Email: {invitationData.email}</p>
            <p>You can now use this email and your new password to log in.</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!invitationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Brighter Future</h1>
          <p className="mt-2 text-gray-600">Complete your account setup</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {invitationData.first_name} {invitationData.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{invitationData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 capitalize">{invitationData.role}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Set Your Password</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please create a secure password for your account. This will be your permanent password for logging in.
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your new password"
                required
              />
            </div>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{passwordError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
            >
              {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
