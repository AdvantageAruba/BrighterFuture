# Class Management Feature for Programs

## 🎯 **Overview**

This feature adds comprehensive class management capabilities to the Program Management system, allowing administrators to create, edit, and manage classes within each program with flexible naming conventions.

## ✨ **Features Added**

### **1. Class Management System**
- **Create Classes**: Add new classes to any program with custom names
- **Edit Classes**: Modify existing class details (name, description, capacity, status)
- **Delete Classes**: Remove classes with confirmation
- **Class Status**: Track active, inactive, and full classes
- **Capacity Management**: Set maximum student limits per class
- **Teacher Assignment**: Assign specific teachers to classes

### **2. Flexible Naming Conventions**
- **Brighter Future Academy**: Use color-based names (Red Class, Blue Class, etc.)
- **First Steps**: Use number-based names (Class 1, Class 2, etc.)
- **Custom Names**: Any descriptive name (Morning Group, Advanced Group, etc.)
- **Program-Specific**: Classes are tied to specific programs

### **3. Integrated UI**
- **Program Cards**: Each program shows its classes with management options
- **Add Class Button**: Quick access to add classes to specific programs
- **Edit Class**: Inline editing for existing classes
- **Class Overview**: Visual status indicators, capacity information, and teacher assignments

## 🔧 **Technical Implementation**

### **New Components Created**
- `useClasses.ts` - Hook for managing class data and operations
- `AddClass.tsx` - Modal for creating new classes
- `EditClass.tsx` - Modal for editing and deleting classes

### **Updated Components**
- `ProgramManagement.tsx` - Integrated class management functionality
- Added class display and management to program cards

### **Database Integration**
- Uses existing `classes` table with new `teacher_id` column
- Real-time updates with Supabase
- Proper error handling and validation
- Database migration script provided (`add_teacher_to_classes.sql`)

## 🎨 **User Experience**

### **Adding Classes**
1. **From Program Card**: Click "+ Add Class" on any program
2. **From Main Header**: Click "Manage Classes" button
3. **Form Fields**:
   - Class Name (required)
   - Program selection (auto-filled if adding from program)
   - Description (optional)
   - Maximum students (default: 20)
   - Status (active/inactive/full)
   - Teacher assignment (optional)

### **Managing Classes**
1. **View Classes**: See all classes for each program
2. **Edit Classes**: Click "Edit" button on any class
3. **Delete Classes**: Available in edit modal with confirmation
4. **Status Tracking**: Visual indicators for class status

### **Class Display**
- **Status Colors**: Green (active), Orange (full), Gray (inactive)
- **Capacity Info**: Shows maximum students per class
- **Teacher Info**: Shows assigned teacher or "No teacher assigned"
- **Quick Actions**: Edit button for each class
- **Empty State**: "No classes yet" message for programs without classes

## 🗄️ **Database Structure**

### **Classes Table**
```sql
CREATE TABLE classes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  program_id INTEGER NOT NULL REFERENCES programs(id),
  description TEXT,
  max_students INTEGER DEFAULT 20,
  status VARCHAR(20) DEFAULT 'active',
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Sample Data**
```sql
-- Brighter Future Academy (colors)
INSERT INTO classes (id, name, program_id, description, max_students) VALUES
('1-1234567890', 'Red Class', 1, 'Morning session for ages 5-8', 15),
('1-1234567891', 'Blue Class', 1, 'Afternoon session for ages 5-8', 15),
('1-1234567892', 'Green Class', 1, 'Advanced learning group', 12);

-- First Steps (numbers)
INSERT INTO classes (id, name, program_id, description, max_students) VALUES
('2-1234567893', 'Class 1', 2, 'Early intervention group A', 10),
('2-1234567894', 'Class 2', 2, 'Early intervention group B', 10),
('2-1234567895', 'Class 3', 2, 'Transition group', 8);
```

## 🚀 **Benefits**

### **For Administrators**
- **Better Organization**: Clear class structure within programs
- **Flexible Naming**: Custom naming conventions per program
- **Capacity Control**: Manage student limits per class
- **Status Tracking**: Monitor class availability and enrollment

### **For Teachers**
- **Clear Assignments**: Know which classes they're responsible for
- **Capacity Awareness**: Understand student limits
- **Status Updates**: Know when classes are full or inactive

### **For Students**
- **Organized Groups**: Clear class assignments
- **Consistent Structure**: Predictable class organization
- **Better Communication**: Clear class identification

## 🔮 **Future Enhancements**

### **Advanced Features**
- **Student Assignment**: Assign students to specific classes
- **Class Scheduling**: Time slots and schedules for classes
- **Attendance Tracking**: Track attendance by class
- **Class Reports**: Performance and enrollment analytics

### **Integration Opportunities**
- **User Management**: Assign teachers to specific classes
- **Student Management**: Enroll students in classes
- **Calendar System**: Class schedules and events
- **Communication Tools**: Class-specific messaging

## 📋 **Usage Instructions**

### **Setting Up Classes**
1. **Navigate to Program Management**
2. **Choose a program** to add classes to
3. **Click "+ Add Class"** on the program card
4. **Fill in class details**:
   - Name: Choose appropriate naming convention
   - Program: Should be pre-selected
   - Description: Optional details about the class
   - Max Students: Set capacity limit
   - Status: Set to active
   - Teacher: Assign a teacher (optional)
5. **Click "Add Class"** to save

### **Managing Existing Classes**
1. **View classes** on program cards
2. **Click "Edit"** on any class
3. **Modify details** as needed
4. **Update or delete** the class
5. **Changes reflect immediately** in the UI

### **Naming Conventions**
- **Brighter Future Academy**: Use colors (Red, Blue, Green, Yellow, etc.)
- **First Steps**: Use numbers (Class 1, Class 2, Class 3, etc.)
- **Individual Therapy**: Use descriptive names (Morning Group, Afternoon Group, etc.)
- **Consultancy**: Use service types (Assessment Group, Support Group, etc.)

## ⚠️ **Important Notes**

### **Class Deletion**
- **Permanent Action**: Deleting a class cannot be undone
- **Student Impact**: Consider students currently assigned to the class
- **Confirmation Required**: Delete action requires user confirmation

### **Program Changes**
- **Class Assignment**: Classes are tied to specific programs
- **Moving Classes**: Classes cannot be moved between programs (delete and recreate)
- **Data Integrity**: Maintains referential integrity with programs

### **Best Practices**
- **Consistent Naming**: Use consistent naming within each program
- **Capacity Planning**: Set realistic student limits
- **Status Management**: Keep class statuses up to date
- **Regular Review**: Periodically review and update class information

This feature provides a solid foundation for organizing students into manageable groups within each program, with the flexibility to use appropriate naming conventions for different program types! 🎓✨
