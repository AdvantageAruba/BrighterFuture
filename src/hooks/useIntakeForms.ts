import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface IntakeFormData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  
  // Step 1: Biographical Information
  child_name: string;
  date_of_birth: string;
  sponsor_id?: string;
  guardian1_name: string;
  guardian1_email?: string;
  guardian1_address?: string;
  guardian1_cell_phone?: string;
  guardian1_home_phone?: string;
  guardian1_work_phone?: string;
  guardian1_relationship?: string;
  guardian2_name?: string;
  guardian2_email?: string;
  guardian2_address?: string;
  guardian2_cell_phone?: string;
  guardian2_home_phone?: string;
  guardian2_work_phone?: string;
  guardian2_relationship?: string;
  household_members: string[];
  
  // Step 2: Medical & School Information
  physician_name?: string;
  physician_phone?: string;
  physician_address?: string;
  pediatrician_name?: string;
  pediatrician_phone?: string;
  allergies?: string;
  current_medical_conditions?: string;
  hospitalizations_surgeries?: string;
  school_name?: string;
  school_phone?: string;
  school_address?: string;
  has_iep?: boolean;
  grade_level?: string;
  school_based_services?: string;
  service_providers: string[];
  
  // Step 3: Medical & Behavioral History
  diagnosis?: string;
  diagnosing_date?: string;
  diagnosing_provider?: string;
  provider_credentials?: string;
  facility_name?: string;
  current_medications?: string;
  seizure_history?: string;
  other_diagnoses?: string;
  family_history?: string;
  aggressive_behavior_history?: string;
  previous_interventions?: string;
  
  // Step 4: Main Areas of Concern
  communication_forms?: string;
  sensory_needs?: string;
  primary_concerns: string[];
  therapy_goals?: string;
  urgency_assessment?: string;
  
  // Step 5: Developmental History
  pregnancy_complications?: string;
  gestational_age?: string;
  birth_weight?: string;
  first_smile_age?: string;
  sitting_age?: string;
  crawling_age?: string;
  walking_age?: string;
  speaking_age?: string;
  developmental_regression?: string;
  motor_skills_rating?: number;
  language_skills_rating?: number;
  social_skills_rating?: number;
  cognitive_skills_rating?: number;
  additional_developmental_info?: string;
  
  // Step 6: Social & Play Skills
  play_skills_preferences?: string;
  play_style_description?: string;
  repetitive_behaviors?: string;
  interest_in_children?: string;
  response_to_peers?: string;
  social_rules_understanding?: string;
  emotional_comprehension_level?: string;
  emotional_expression_level?: string;
  empathy_level?: string;
  additional_social_info?: string;
  
  // Step 7: Therapy History & Availability
  previous_therapy_experience?: string;
  therapy_type?: string;
  therapy_description?: string;
  insurance_coverage?: boolean;
  insurance_provider?: string;
  policy_member_id?: string;
  insurance_questions?: string;
  preferred_days: string[];
  preferred_time_slot?: string;
  hours_per_week?: string;
  scheduling_restrictions?: string;
  additional_info?: string;
  
  // Metadata
  submitted_by?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
}

export const useIntakeForms = () => {
  const [intakeForms, setIntakeForms] = useState<IntakeFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all intake forms
  const fetchIntakeForms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('intake_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setIntakeForms(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch intake forms';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new intake form
  const createIntakeForm = useCallback(async (formData: IntakeFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('intake_forms')
        .insert([formData])
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Add to local state
      setIntakeForms(prev => [data, ...prev]);
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create intake form';
      setError(errorMessage);
      console.error('Error creating intake form:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing intake form
  const updateIntakeForm = async (id: string, updates: Partial<IntakeFormData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('intake_forms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Update local state
      setIntakeForms(prev => 
        prev.map(form => form.id === id ? data : form)
      );
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update intake form';
      setError(errorMessage);
      console.error('Error updating intake form:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete intake form
  const deleteIntakeForm = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('intake_forms')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // Remove from local state
      setIntakeForms(prev => prev.filter(form => form.id !== id));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete intake form';
      setError(errorMessage);
      console.error('Error deleting intake form:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get intake form by ID
  const getIntakeFormById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch intake form';
      setError(errorMessage);
      console.error('Error fetching intake form:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update form status
  const updateFormStatus = useCallback(async (id: string, status: string) => {
    return updateIntakeForm(id, { status });
  }, [updateIntakeForm]);

  // Search intake forms
  const searchIntakeForms = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: searchError } = await supabase
        .from('intake_forms')
        .select('*')
        .or(`child_name.ilike.%${searchTerm}%,guardian1_name.ilike.%${searchTerm}%,guardian1_email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;
      
      return { success: true, data: data || [] };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search intake forms';
      setError(errorMessage);
      console.error('Error searching intake forms:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get forms by status
  const getFormsByStatus = useCallback(async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('intake_forms')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      return { success: true, data: data || [] };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch forms by status';
      setError(errorMessage);
      console.error('Error fetching forms by status:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  return {
    intakeForms,
    loading,
    error,
    fetchIntakeForms,
    createIntakeForm,
    updateIntakeForm,
    deleteIntakeForm,
    getIntakeFormById,
    updateFormStatus,
    searchIntakeForms,
    getFormsByStatus,
    clearError
  };
};
