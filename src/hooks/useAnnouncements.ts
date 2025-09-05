import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  target_audience: 'all' | 'students' | 'parents' | 'staff';
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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Sort announcements by most recent activity (edited_at if exists, otherwise created_at)
      const sortedAnnouncements = (data || []).sort((a, b) => {
        const aDate = a.edited_at ? new Date(a.edited_at) : new Date(a.created_at);
        const bDate = b.edited_at ? new Date(b.edited_at) : new Date(b.created_at);
        return bDate.getTime() - aDate.getTime(); // Most recent first
      });

      setAnnouncements(sortedAnnouncements);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'edited_at' | 'edit_count'>) => {
    try {
      const dataToInsert = {
        ...announcementData,
        author_id: 'default-user', // Add the required author_id field
        author_name: announcementData.author_name || 'System User'
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert([dataToInsert])
        .select();

      if (error) throw error;
      await fetchAnnouncements();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error adding announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add announcement' };
    }
  };

  const updateAnnouncement = async (id: number, announcementData: Partial<Announcement>) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(announcementData)
        .eq('id', id)
        .select();

      if (error) throw error;
      await fetchAnnouncements();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error updating announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update announcement' };
    }
  };

  const deleteAnnouncement = async (id: number) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements();
      return { success: true };
    } catch (err) {
      console.error('Error deleting announcement:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete announcement' };
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};
