-- Create attendance table for tracking student attendance
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in TIME,
  check_out TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);

-- Add comments for documentation
COMMENT ON TABLE attendance IS 'Stores daily attendance records for students';
COMMENT ON COLUMN attendance.student_id IS 'References the student this attendance record belongs to';
COMMENT ON COLUMN attendance.date IS 'The date of the attendance record';
COMMENT ON COLUMN attendance.status IS 'Attendance status: present, absent, late, or excused';
COMMENT ON COLUMN attendance.check_in IS 'Time the student checked in (optional)';
COMMENT ON COLUMN attendance.check_out IS 'Time the student checked out (optional)';
COMMENT ON COLUMN attendance.notes IS 'Additional notes about the attendance record';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_attendance_updated_at();
