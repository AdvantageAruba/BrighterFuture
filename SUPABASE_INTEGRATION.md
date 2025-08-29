# Supabase Integration for Brighter Future Intake Forms

This document explains how to set up and use Supabase to store intake form data.

## Setup Instructions

### 1. Create the Database Table

Run the SQL migration file `create_intake_forms_table.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `create_intake_forms_table.sql`
4. Click "Run" to execute the migration

### 2. Environment Variables

Make sure your `.env` file contains the necessary Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

The `intake_forms` table includes:

- **Biographical Information**: Child and guardian details
- **Medical & School Information**: Health and education details
- **Medical & Behavioral History**: Diagnosis and treatment history
- **Main Areas of Concern**: Communication, sensory needs, therapy goals
- **Developmental History**: Milestones and developmental assessments
- **Social & Play Skills**: Social interaction and play preferences
- **Therapy History & Availability**: Previous therapy and scheduling preferences
- **Metadata**: Submission tracking and contact information

## Features

### Form Submission
- Forms are automatically saved to Supabase when submitted
- Data is validated and stored with proper typing
- Form status is tracked (pending, reviewed, approved, rejected)

### Data Management
- Full CRUD operations through the `useIntakeForms` hook
- Search and filter capabilities
- Status management and updates
- Automatic timestamps for creation and updates

### Security
- Row Level Security (RLS) enabled
- Authenticated users can read, create, and update forms
- Data is properly sanitized and validated

## Usage

### In Components

```tsx
import { useIntakeForms } from '../hooks/useIntakeForms';

const MyComponent = () => {
  const { 
    createIntakeForm, 
    updateIntakeForm, 
    deleteIntakeForm,
    intakeForms,
    loading,
    error 
  } = useIntakeForms();

  // Create a new form
  const handleSubmit = async (formData) => {
    const result = await createIntakeForm(formData);
    if (result.success) {
      console.log('Form created:', result.data);
    }
  };

  // Update existing form
  const handleUpdate = async (id, updates) => {
    const result = await updateIntakeForm(id, updates);
    if (result.success) {
      console.log('Form updated:', result.data);
    }
  };
};
```

### Form Data Structure

The form data follows the `IntakeFormData` interface:

```tsx
interface IntakeFormData {
  child_name: string;
  date_of_birth: string;
  guardian1_name: string;
  // ... other fields
  status?: string;
  created_at?: string;
  updated_at?: string;
}
```

## Database Operations

### Insert
```sql
INSERT INTO intake_forms (child_name, date_of_birth, guardian1_name)
VALUES ('John Doe', '2020-01-01', 'Jane Doe');
```

### Select
```sql
-- Get all pending forms
SELECT * FROM intake_forms WHERE status = 'pending';

-- Search by child name
SELECT * FROM intake_forms WHERE child_name ILIKE '%John%';

-- Get forms by date range
SELECT * FROM intake_forms 
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';
```

### Update
```sql
UPDATE intake_forms 
SET status = 'reviewed', notes = 'Form reviewed by staff'
WHERE id = 'form-uuid-here';
```

## Error Handling

The system includes comprehensive error handling:

- Database connection errors
- Validation errors
- Permission errors
- Network timeouts

Errors are displayed to users and logged for debugging.

## Performance Considerations

- Indexes are created on frequently queried fields
- Pagination support for large datasets
- Efficient filtering and search queries
- Optimized data fetching with proper select statements

## Security Features

- Row Level Security (RLS) policies
- Authenticated user access control
- Data validation and sanitization
- Secure API endpoints

## Troubleshooting

### Common Issues

1. **Connection Errors**: Check environment variables and network connectivity
2. **Permission Errors**: Verify RLS policies and user authentication
3. **Validation Errors**: Check required fields and data types
4. **Performance Issues**: Review query optimization and indexing

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages and API responses.

## Support

For technical support or questions about the Supabase integration, refer to:
- Supabase documentation: https://supabase.com/docs
- React hooks documentation
- TypeScript interface definitions in the codebase
