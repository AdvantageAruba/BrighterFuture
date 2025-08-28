# Program and Class Selection Feature for Users

## 🎯 **Overview**

This feature allows new users (especially teachers, therapists, and coordinators) to select which program they are active in and which specific class they teach or manage.

## ✨ **Features Added**

### **1. Database Schema Updates**
- **`users` table**: Added `program_id` and `class_id` columns
- **`classes` table**: New table to organize students into class groups within programs
- **Relationships**: Users can be assigned to specific programs and classes

### **2. User Interface Enhancements**
- **AddUser Form**: Program and class selection fields (conditional display)
- **EditUser Form**: Same fields for updating existing users
- **UserManagement**: Displays program and class information in user cards

### **3. Conditional Display Logic**
- **Program/Class fields only show for**:
  - Teachers
  - Therapists  
  - Program Coordinators
- **Hidden for**: Administrators, Parents, Support Staff

### **4. Smart Field Dependencies**
- **Class selection is disabled** until a program is selected
- **Class list updates** automatically when program changes
- **Helpful hints** guide users through the selection process

## 🗄️ **Database Changes Required**

### **Step 1: Add Fields to Users Table**
Run this SQL in your Supabase SQL editor:

```sql
-- Add program_id and class_id columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS program_id INTEGER REFERENCES programs(id);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS class_id VARCHAR(50);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_program_id ON users(program_id);
CREATE INDEX IF NOT EXISTS idx_users_class_id ON users(class_id);
```

### **Step 2: Create Classes Table**
Run this SQL to create the classes table:

```sql
-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  description TEXT,
  max_students INTEGER DEFAULT 20,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sample classes
INSERT INTO classes (id, name, program_id, description, max_students, status) VALUES
('class-a', 'Class A', 1, 'Morning session for ages 3-5', 15, 'active'),
('class-b', 'Class B', 1, 'Afternoon session for ages 3-5', 15, 'active'),
('class-c', 'Class C', 2, 'Advanced learning group', 12, 'active'),
('class-d', 'Class D', 2, 'Beginner learning group', 12, 'active')
ON CONFLICT (id) DO NOTHING;
```

## 🎨 **User Experience**

### **Adding New Users**
1. **Fill in basic information** (name, email, role, etc.)
2. **If role is Teacher/Therapist/Coordinator**:
   - Program selection dropdown appears
   - Class selection dropdown appears (disabled until program selected)
3. **Select program first**, then class becomes available
4. **Upload profile picture** (optional)
5. **Set permissions** and save

### **Editing Existing Users**
1. **Current program/class** is pre-selected
2. **Change program** to see different class options
3. **All changes** are saved together

### **User Management View**
- **Program icons** (📚) show which program users belong to
- **Class icons** (👥) show specific class assignments
- **Filtering** by program/class (future enhancement)

## 🔧 **Technical Implementation**

### **Components Updated**
- `AddUser.tsx` - Added program/class selection fields
- `EditUser.tsx` - Added program/class selection fields  
- `UserManagement.tsx` - Displays program/class information
- `useUsers.ts` - Added program/class data fetching and management

### **Data Flow**
1. **User selects role** → Conditional fields appear
2. **User selects program** → Class list updates
3. **User selects class** → Both values stored in form state
4. **Form submission** → Data saved to Supabase
5. **UI refresh** → New information displayed

### **State Management**
- **Local state** for program/class selection
- **API calls** to fetch available programs and classes
- **Conditional rendering** based on user role
- **Form validation** ensures proper data submission

## 🚀 **Benefits**

### **For Administrators**
- **Better organization** of staff by program/class
- **Clearer reporting** on staff assignments
- **Easier management** of program-specific staff

### **For Teachers/Therapists**
- **Clear assignment** to specific programs and classes
- **Better understanding** of their responsibilities
- **Program-specific permissions** (future enhancement)

### **For Students**
- **Clearer connection** between staff and their classes
- **Better communication** channels
- **Program-specific support** structure

## 🔮 **Future Enhancements**

### **Advanced Features**
- **Multiple program assignments** per user
- **Class capacity management** with user assignments
- **Program-specific permissions** and access controls
- **Schedule integration** with program/class assignments
- **Reporting tools** for program/class staff analysis

### **Integration Opportunities**
- **Student enrollment** tied to class assignments
- **Attendance tracking** by class and program
- **Communication tools** for class-specific messaging
- **Resource allocation** by program/class

## 📋 **Testing Checklist**

- [ ] **Database migration** runs successfully
- [ ] **Program selection** shows available programs
- [ ] **Class selection** updates when program changes
- [ ] **Conditional display** works for different roles
- [ ] **Data saving** works correctly
- [ ] **Data editing** preserves existing assignments
- **User management** displays program/class information
- [ ] **Form validation** prevents invalid submissions

## 🎯 **Getting Started**

1. **Run the database migrations** above
2. **Refresh your application**
3. **Try adding a new teacher** with program/class selection
4. **Edit an existing user** to assign programs/classes
5. **Verify the information** displays in User Management

This feature provides a solid foundation for better organization and management of your educational programs! 🎓
