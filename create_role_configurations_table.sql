-- Create role_configurations table to store dynamic role permissions
CREATE TABLE IF NOT EXISTS role_configurations (
  id SERIAL PRIMARY KEY,
  role_id VARCHAR(50) UNIQUE NOT NULL,
  default_permissions TEXT[] NOT NULL DEFAULT '{}',
  default_tabs TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE role_configurations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read role configurations
CREATE POLICY "Allow authenticated users to read role configurations" ON role_configurations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow administrators to modify role configurations
CREATE POLICY "Allow administrators to modify role configurations" ON role_configurations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt() ->> 'email' 
      AND users.role = 'administrator'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_role_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_role_configurations_updated_at
  BEFORE UPDATE ON role_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_role_configurations_updated_at();

-- Insert initial role configurations based on the static defaults
INSERT INTO role_configurations (role_id, default_permissions, default_tabs) VALUES
  ('administrator', 
   ARRAY['students', 'programs', 'classes', 'users', 'attendance', 'calendar', 'forms', 'notes', 'reports', 'waiting_list', 'settings', 'backup', 'logs', 'announcements', 'notifications'],
   ARRAY['dashboard', 'students', 'programs', 'classes', 'calendar', 'attendance', 'forms', 'notes', 'reports', 'announcements', 'users', 'settings', 'waiting_list']
  ),
  ('teacher',
   ARRAY['students', 'classes', 'attendance', 'calendar', 'forms', 'notes', 'announcements'],
   ARRAY['dashboard', 'students', 'classes', 'calendar', 'attendance', 'forms', 'notes', 'announcements']
  ),
  ('therapist',
   ARRAY['students', 'forms', 'notes', 'calendar', 'announcements'],
   ARRAY['dashboard', 'students', 'forms', 'notes', 'calendar', 'announcements']
  ),
  ('coordinator',
   ARRAY['students', 'programs', 'classes', 'attendance', 'calendar', 'forms', 'notes', 'reports', 'announcements'],
   ARRAY['dashboard', 'students', 'programs', 'classes', 'calendar', 'attendance', 'forms', 'notes', 'reports', 'announcements']
  ),
  ('parent',
   ARRAY['students', 'calendar', 'forms', 'notes', 'announcements'],
   ARRAY['dashboard', 'students', 'calendar', 'forms', 'notes', 'announcements']
  ),
  ('staff',
   ARRAY['students', 'calendar', 'forms', 'notes', 'announcements'],
   ARRAY['dashboard', 'students', 'calendar', 'forms', 'notes', 'announcements']
  )
ON CONFLICT (role_id) DO NOTHING;

-- Create RPC function to create the table (for fallback)
CREATE OR REPLACE FUNCTION create_role_configurations_table()
RETURNS void AS $$
BEGIN
  -- This function is already created above, just return success
  RETURN;
END;
$$ LANGUAGE plpgsql;

