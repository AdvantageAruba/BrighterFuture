-- Create waiting_list table for Brighter Future application
-- This table stores information about students on the waiting list

CREATE TABLE IF NOT EXISTS waiting_list (
    id BIGSERIAL PRIMARY KEY,
    
    -- Student Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER,
    
    -- Parent/Guardian Information
    parent_name VARCHAR(200) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    address TEXT,
    
    -- Emergency Contact (if different from parent)
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(20),
    
    -- Program Information
    program VARCHAR(50) NOT NULL, -- 'academy', 'first-steps', 'individual-therapy', 'consultancy'
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    preferred_start_date DATE,
    
    -- Additional Information
    reason_for_waiting TEXT,
    notes TEXT,
    
    -- Status and Timestamps
    status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'contacted', 'enrolled', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contact tracking
    contact_attempts INTEGER DEFAULT 0,
    last_contact_date DATE,
    next_follow_up_date DATE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waiting_list_program ON waiting_list(program);
CREATE INDEX IF NOT EXISTS idx_waiting_list_priority ON waiting_list(priority);
CREATE INDEX IF NOT EXISTS idx_waiting_list_status ON waiting_list(status);
CREATE INDEX IF NOT EXISTS idx_waiting_list_created_at ON waiting_list(created_at);
CREATE INDEX IF NOT EXISTS idx_waiting_list_parent_email ON waiting_list(parent_email);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waiting_list_updated_at 
    BEFORE UPDATE ON waiting_list 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
-- Allow authenticated users to read all waiting list entries
CREATE POLICY "Allow authenticated users to read waiting list" ON waiting_list
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new waiting list entries
CREATE POLICY "Allow authenticated users to insert waiting list" ON waiting_list
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update waiting list entries
CREATE POLICY "Allow authenticated users to update waiting list" ON waiting_list
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete waiting list entries
CREATE POLICY "Allow authenticated users to delete waiting list" ON waiting_list
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE waiting_list IS 'Stores information about students on the waiting list for various programs';
COMMENT ON COLUMN waiting_list.program IS 'Program type: academy, first-steps, individual-therapy, consultancy';
COMMENT ON COLUMN waiting_list.priority IS 'Priority level: high, medium, low';
COMMENT ON COLUMN waiting_list.status IS 'Current status: waiting, contacted, enrolled, declined';
COMMENT ON COLUMN waiting_list.contact_attempts IS 'Number of times contact has been attempted';
