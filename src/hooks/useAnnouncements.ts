import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  target_audience: 'all' | 'students' | 'parents' | 'staff'; // Keep for backward compatibility
  target_audiences?: string[]; // New array field for multiple audiences
  created_at: string;
  author_id: string;
  author_name: string;
  is_active: boolean;
  updated_at: string;
  edited_at: string | null;
  edit_count: number;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchAnnouncements = useCallback(async (userRole?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Store the current user role for use in other functions
      if (userRole) {
        setCurrentUserRole(userRole);
      }
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter announcements based on user role
      let filteredData = data || [];
      const roleToUse = userRole || currentUserRole;
      if (roleToUse) {
        filteredData = filteredData.filter(announcement => {
          // Administrators see all announcements
          if (roleToUse === 'administrator') {
            return true;
          }
          
          const targetAudiences = announcement.target_audiences || [announcement.target_audience || 'all'];
          return targetAudiences.includes('all') || targetAudiences.includes(roleToUse);
        });
      }

      // Sort announcements by most recent activity (edited_at if exists, otherwise created_at)
      const sortedAnnouncements = filteredData.sort((a, b) => {
        const aDate = a.edited_at ? new Date(a.edited_at) : new Date(a.created_at);
        const bDate = b.edited_at ? new Date(b.edited_at) : new Date(b.created_at);
        return bDate.getTime() - aDate.getTime(); // Most recent first
      });

      setAnnouncements(sortedAnnouncements);
      setIsInitialized(true);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [currentUserRole]);

  const addAnnouncement = useCallback(async (announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'edited_at' | 'edit_count'>, currentUser?: { id: string; name: string }) => {
    try {
      const targetAudiences = announcementData.target_audiences || [announcementData.target_audience || 'all'];
      const primaryAudience = targetAudiences.includes('all') ? 'all' : targetAudiences[0];
      
      const dataToInsert = {
        ...announcementData,
        author_id: currentUser?.id || 'system-user',
        author_name: currentUser?.name || 'System User',
        target_audience: primaryAudience, // Keep for backward compatibility
        target_audiences: targetAudiences // New array field
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert([dataToInsert])
        .select();

      if (error) throw error;
      await fetchAnnouncements(currentUserRole);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error adding announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add announcement' };
    }
  }, [fetchAnnouncements, currentUserRole]);

  const updateAnnouncement = useCallback(async (id: number, announcementData: Partial<Announcement>) => {
    try {
      // Handle target_audiences updates
      let updateData = { ...announcementData };
      if (announcementData.target_audiences) {
        const targetAudiences = announcementData.target_audiences;
        const primaryAudience = targetAudiences.includes('all') ? 'all' : targetAudiences[0];
        updateData = {
          ...updateData,
          target_audience: primaryAudience, // Keep for backward compatibility
          target_audiences: targetAudiences // New array field
        };
      }

      const { data, error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchAnnouncements(currentUserRole);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error updating announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update announcement' };
    }
  }, [fetchAnnouncements, currentUserRole]);

  const deleteAnnouncement = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements(currentUserRole);
      return { success: true };
    } catch (err) {
      console.error('Error deleting announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete announcement' };
    }
  }, [fetchAnnouncements, currentUserRole]);

  useEffect(() => {
    // Only fetch announcements if we have a user role to avoid showing all announcements initially
    if (currentUserRole) {
      fetchAnnouncements(currentUserRole);
    }
  }, [fetchAnnouncements, currentUserRole]);

  return {
    announcements,
    loading,
    error,
    isInitialized,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};
