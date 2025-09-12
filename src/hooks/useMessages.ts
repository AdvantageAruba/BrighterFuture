import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  subject: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  recipient_name?: string;
  sender_email?: string;
  recipient_email?: string;
}

export interface SendMessageData {
  recipient_id: number;
  subject: string;
  content: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userProfile } = useAuth();

  // Get current user from AuthContext
  const getCurrentUser = useCallback(() => {
    if (!userProfile) return null;
    
    return {
      id: userProfile.id,
      email: userProfile.email
    };
  }, [userProfile]);

  // Calculate unread count
  const calculateUnreadCount = useCallback(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;
    
    return messages.filter(msg => 
      msg.recipient_id === currentUser.id && !msg.is_read
    ).length;
  }, [messages, getCurrentUser]);

  // Update unread count whenever messages change
  useEffect(() => {
    setUnreadCount(calculateUnreadCount());
  }, [calculateUnreadCount]);

  // Fetch all messages for current user (both sent and received)
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(id, first_name, last_name, email),
          recipient:users!recipient_id(id, first_name, last_name, email)
        `)
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform the data to include sender and recipient names
      const transformedMessages = data?.map((message: any) => ({
        ...message,
        sender_name: message.sender ? `${message.sender.first_name} ${message.sender.last_name}` : 'Unknown',
        recipient_name: message.recipient ? `${message.recipient.first_name} ${message.recipient.last_name}` : 'Unknown',
        sender_email: message.sender?.email,
        recipient_email: message.recipient?.email,
      })) || [];

      setMessages(transformedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser]);

  // Send a new message
  const sendMessage = async (messageData: SendMessageData) => {
    try {
      setError(null);

      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          recipient_id: messageData.recipient_id,
          subject: messageData.subject,
          content: messageData.content,
        })
        .select()
        .single();

      if (sendError) throw sendError;

      // Refresh messages after sending
      await fetchMessages();
      
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  };

  // Mark message as read
  const markAsRead = async (messageId: number) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, is_read: true, read_at: new Date().toISOString() }
          : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark message as read');
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: number) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) throw deleteError;

      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  // Get unread message count
  const getUnreadCount = useCallback(() => {
    return unreadCount;
  }, [unreadCount]);

  // Get messages by conversation (between two users)
  const getConversation = useCallback((otherUserId: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    return messages.filter(msg => 
      (msg.sender_id === currentUser.id && msg.recipient_id === otherUserId) ||
      (msg.sender_id === otherUserId && msg.recipient_id === currentUser.id)
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messages, getCurrentUser]);

  // Get inbox messages (received messages)
  const getInboxMessages = useCallback(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    return messages.filter(msg => msg.recipient_id === currentUser.id);
  }, [messages, getCurrentUser]);

  // Get sent messages
  const getSentMessages = useCallback(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    return messages.filter(msg => msg.sender_id === currentUser.id);
  }, [messages, getCurrentUser]);

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    getUnreadCount,
    getConversation,
    getInboxMessages,
    getSentMessages,
  };
};

