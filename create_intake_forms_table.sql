-- Create intake_forms table for Brighter Future Intake Form
CREATE TABLE intake_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, approved, rejected
  
  -- Step 1: Biographical Information
  child_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  sponsor_id VARCHAR(100),
  guardian1_name VARCHAR(255) NOT NULL,
  guardian1_email VARCHAR(255),
  guardian1_address TEXT,
  guardian1_cell_phone VARCHAR(20),
  guardian1_home_phone VARCHAR(20),
  guardian1_work_phone VARCHAR(20),
  guardian1_relationship VARCHAR(100),
  guardian2_name VARCHAR(255),
  guardian2_email VARCHAR(255),
  guardian2_address TEXT,
  guardian2_cell_phone VARCHAR(20),
  guardian2_home_phone VARCHAR(20),
  guardian2_work_phone VARCHAR(20),
  guardian2_relationship VARCHAR(100),
  household_members TEXT[], -- Array of household member names
  
  -- Step 2: Medical & School Information
  physician_name VARCHAR(255),
  physician_phone VARCHAR(20),
  physician_address TEXT,
  pediatrician_name VARCHAR(255),
  pediatrician_phone VARCHAR(20),
  allergies TEXT,
  current_medical_conditions TEXT,
  hospitalizations_surgeries TEXT,
  school_name VARCHAR(255),
  school_phone VARCHAR(20),
  school_address TEXT,
  has_iep BOOLEAN DEFAULT FALSE,
  grade_level VARCHAR(50),
  school_based_services TEXT,
  service_providers TEXT[], -- Array of service provider names
  
  -- Step 3: Medical & Behavioral History
  diagnosis VARCHAR(255),
  diagnosing_date DATE,
  diagnosing_provider VARCHAR(255),
  provider_credentials VARCHAR(255),
  facility_name VARCHAR(255),
  current_medications TEXT,
  seizure_history TEXT,
  other_diagnoses TEXT,
  family_history TEXT,
  aggressive_behavior_history TEXT,
  previous_interventions TEXT,
  
  -- Step 4: Main Areas of Concern
  communication_forms VARCHAR(100), -- verbal, non-verbal, etc.
  sensory_needs TEXT,
  primary_concerns TEXT[], -- Array of concerns
  therapy_goals TEXT,
  urgency_assessment VARCHAR(100),
  
  -- Step 5: Developmental History
  pregnancy_complications TEXT,
  gestational_age VARCHAR(50),
  birth_weight VARCHAR(50),
  first_smile_age VARCHAR(50),
  sitting_age VARCHAR(50),
  crawling_age VARCHAR(50),
  walking_age VARCHAR(50),
  speaking_age VARCHAR(50),
  developmental_regression TEXT,
  motor_skills_rating INTEGER CHECK (motor_skills_rating >= 1 AND motor_skills_rating <= 5),
  language_skills_rating INTEGER CHECK (language_skills_rating >= 1 AND language_skills_rating <= 5),
  social_skills_rating INTEGER CHECK (social_skills_rating >= 1 AND social_skills_rating <= 5),
  cognitive_skills_rating INTEGER CHECK (cognitive_skills_rating >= 1 AND cognitive_skills_rating <= 5),
  additional_developmental_info TEXT,
  
  -- Step 6: Social & Play Skills
  play_skills_preferences TEXT,
  play_style_description TEXT,
  repetitive_behaviors TEXT,
  interest_in_children TEXT,
  response_to_peers TEXT,
  social_rules_understanding TEXT,
  emotional_comprehension_level VARCHAR(100),
  emotional_expression_level VARCHAR(100),
  empathy_level VARCHAR(100),
  additional_social_info TEXT,
  
  -- Step 7: Therapy History & Availability
  previous_therapy_experience TEXT,
  therapy_type VARCHAR(255),
  therapy_description TEXT,
  insurance_coverage BOOLEAN DEFAULT FALSE,
  insurance_provider VARCHAR(255),
  policy_member_id VARCHAR(255),
  insurance_questions TEXT,
  preferred_days TEXT[], -- Array of preferred days
  preferred_time_slot VARCHAR(100),
  hours_per_week VARCHAR(50),
  scheduling_restrictions TEXT,
  additional_info TEXT,
  
  -- Metadata
  submitted_by VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_intake_forms_status ON intake_forms(status);
CREATE INDEX idx_intake_forms_created_at ON intake_forms(created_at);
CREATE INDEX idx_intake_forms_child_name ON intake_forms(child_name);
CREATE INDEX idx_intake_forms_guardian1_email ON intake_forms(guardian1_email);

-- Enable Row Level Security (RLS)
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all intake forms
CREATE POLICY "Users can view all intake forms" ON intake_forms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert intake forms
CREATE POLICY "Users can create intake forms" ON intake_forms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update intake forms
CREATE POLICY "Users can update intake forms" ON intake_forms
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_intake_forms_updated_at 
    BEFORE UPDATE ON intake_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
