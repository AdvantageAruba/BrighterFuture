-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  department VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  picture_url TEXT,
  permissions TEXT[] DEFAULT '{}',
  program_id INTEGER,
  class_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programs table if it doesn't exist
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_capacity INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table if it doesn't exist
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  program_id INTEGER NOT NULL,
  description TEXT,
  max_students INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY IF NOT EXISTS "Allow all users to read users" ON users FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow all users to insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all users to update users" ON users FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Allow all users to delete users" ON users FOR DELETE USING (true);

-- Create policies for programs table
CREATE POLICY IF NOT EXISTS "Allow all users to read programs" ON programs FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow all users to insert programs" ON programs FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all users to update programs" ON programs FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Allow all users to delete programs" ON programs FOR DELETE USING (true);

-- Create policies for classes table
CREATE POLICY IF NOT EXISTS "Allow all users to read classes" ON classes FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow all users to insert classes" ON classes FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all users to update classes" ON classes FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Allow all users to delete classes" ON classes FOR DELETE USING (true);

-- Insert some sample data
INSERT INTO programs (name, description, max_capacity) VALUES 
('Early Childhood Education', 'Program for children ages 3-5', 20),
('Elementary Education', 'Program for children ages 6-10', 25),
('Special Needs Support', 'Specialized support program', 15)
ON CONFLICT DO NOTHING;

INSERT INTO classes (name, program_id, description, max_students) VALUES 
('Red Class', 1, 'Ages 3-4', 12),
('Blue Class', 1, 'Ages 4-5', 12),
('Green Class', 2, 'Ages 6-7', 15),
('Yellow Class', 2, 'Ages 8-10', 15),
('Purple Class', 1, 'Mixed ages', 12)
ON CONFLICT DO NOTHING;

INSERT INTO users (first_name, last_name, email, role, department, program_id, class_id) VALUES 
('John', 'Doe', 'john.doe@example.com', 'teacher', 'education', 1, '1'),
('Jane', 'Smith', 'jane.smith@example.com', 'teacher', 'education', 1, '2'),
('Mike', 'Johnson', 'mike.johnson@example.com', 'administrator', 'administration', NULL, NULL),
('Sarah', 'Wilson', 'sarah.wilson@example.com', 'teacher', 'education', 2, '3')
ON CONFLICT (email) DO NOTHING;

