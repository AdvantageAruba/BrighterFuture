-- Add temporary password fields to the users table
-- This script adds fields to support invitation system with temporary passwords

-- Add temporary password field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS temporary_password VARCHAR(255);

-- Add password reset token field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);

-- Add password reset expires field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;

-- Add invitation token field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255);

-- Add invitation expires field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS invitation_expires TIMESTAMP WITH TIME ZONE;

-- Add invitation sent field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE;

-- Add invitation sent date field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP WITH TIME ZONE;

-- Add password changed field (to track if user has changed their temporary password)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;

-- Add password changed date field
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_invitation_token ON users(invitation_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_users_invitation_expires ON users(invitation_expires);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_expires ON users(password_reset_expires);

-- Add comments to document the new fields
COMMENT ON COLUMN users.temporary_password IS 'Temporary password for first-time login';
COMMENT ON COLUMN users.password_reset_token IS 'Token for password reset functionality';
COMMENT ON COLUMN users.password_reset_expires IS 'Expiration time for password reset token';
COMMENT ON COLUMN users.invitation_token IS 'Unique token for invitation links';
COMMENT ON COLUMN users.invitation_expires IS 'Expiration time for invitation token';
COMMENT ON COLUMN users.invitation_sent IS 'Whether invitation email has been sent';
COMMENT ON COLUMN users.invitation_sent_at IS 'When invitation email was sent';
COMMENT ON COLUMN users.password_changed IS 'Whether user has changed their temporary password';
COMMENT ON COLUMN users.password_changed_at IS 'When user changed their password';

-- Update existing users to have default values
UPDATE users
SET 
  invitation_sent = FALSE,
  password_changed = FALSE
WHERE invitation_sent IS NULL OR password_changed IS NULL;

