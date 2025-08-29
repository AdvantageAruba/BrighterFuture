-- Fix any missing required fields in the mock data
-- This ensures all required fields are properly set for the admin dashboard to display

-- Check and fix household_members if they're NULL
UPDATE intake_forms 
SET household_members = ARRAY['Family Member'] 
WHERE household_members IS NULL OR array_length(household_members, 1) = 0;

-- Ensure all required string fields have values
UPDATE intake_forms 
SET 
  child_name = COALESCE(child_name, 'Unknown Child'),
  date_of_birth = COALESCE(date_of_birth, '2020-01-01'),
  guardian1_name = COALESCE(guardian1_name, 'Unknown Guardian')
WHERE 
  child_name IS NULL OR 
  date_of_birth IS NULL OR 
  guardian1_name IS NULL;

-- Set default values for any NULL arrays
UPDATE intake_forms 
SET 
  primary_concerns = COALESCE(primary_concerns, ARRAY['General concern']),
  preferred_days = COALESCE(preferred_days, ARRAY['Monday']),
  service_providers = COALESCE(service_providers, ARRAY['None specified'])
WHERE 
  primary_concerns IS NULL OR 
  preferred_days IS NULL OR 
  service_providers IS NULL;

-- Ensure urgency_assessment has a value
UPDATE intake_forms 
SET urgency_assessment = COALESCE(urgency_assessment, 'moderate')
WHERE urgency_assessment IS NULL;

-- Ensure status has a value
UPDATE intake_forms 
SET status = COALESCE(status, 'pending')
WHERE status IS NULL;

-- Set default values for numeric ratings
UPDATE intake_forms 
SET 
  motor_skills_rating = COALESCE(motor_skills_rating, 3),
  language_skills_rating = COALESCE(language_skills_rating, 3),
  social_skills_rating = COALESCE(social_skills_rating, 3),
  cognitive_skills_rating = COALESCE(cognitive_skills_rating, 3)
WHERE 
  motor_skills_rating IS NULL OR 
  language_skills_rating IS NULL OR 
  social_skills_rating IS NULL OR 
  cognitive_skills_rating IS NULL;

-- Verify the data
SELECT 
  child_name,
  date_of_birth,
  guardian1_name,
  household_members,
  urgency_assessment,
  status,
  created_at
FROM intake_forms
ORDER BY created_at;
