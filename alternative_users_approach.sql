-- Alternative approach for existing users table
-- This script provides different options based on your current table structure

-- OPTION 1: Check your current table structure first
-- Run this to see what columns you currently have:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- OPTION 2: If you have a 'name' column instead of 'first_name'/'last_name'
-- You can create a view that splits the name:
CREATE OR REPLACE VIEW users_view AS
SELECT 
    id,
    CASE 
        WHEN name LIKE '% %' THEN SPLIT_PART(name, ' ', 1)
        ELSE name 
    END as first_name,
    CASE 
        WHEN name LIKE '% %' THEN SPLIT_PART(name, ' ', 2)
        ELSE '' 
    END as last_name,
    email,
    phone,
    role,
    department,
    status,
    picture_url,
    permissions,
    created_at,
    updated_at
FROM users;

-- OPTION 3: Rename existing columns to match expected structure
-- Only run these if you're sure about your current structure:

-- If you have 'username' instead of 'email':
-- ALTER TABLE users RENAME COLUMN username TO email;

-- If you have 'full_name' instead of 'name':
-- ALTER TABLE users RENAME COLUMN full_name TO name;

-- OPTION 4: Create a new users table with the correct structure
-- (Only if you want to start fresh)
/*
CREATE TABLE users_new (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  picture_url TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Then migrate data from old table to new table
-- INSERT INTO users_new (first_name, last_name, email, role, ...)
-- SELECT ... FROM users_old;
*/
