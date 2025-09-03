# Brighter Future - Student Management System

A comprehensive React TypeScript application for managing students, programs, attendance, daily notes, and waiting lists for educational institutions.

## 🚀 Features

### 📊 Dashboard
- Overview of students, programs, and recent activities
- Quick access to key metrics and statistics
- Recent activity feed

### 👥 Student Management
- Add, edit, and view student information
- Student profiles with detailed information
- Program enrollment tracking
- Student search and filtering

### 📅 Attendance Management
- Record daily attendance for students
- View attendance history and patterns
- Filter attendance by date and program
- Quick attendance entry for specific students

### 📝 Daily Notes
- Comprehensive note-taking system for student observations
- Multiple note categories (behavior, academic, social, etc.)
- Rich text formatting with mood tracking
- Parent contact and follow-up tracking
- Search and filter notes by student, date, or content

### ⏳ Waiting List Management
- Add students to waiting lists
- Track priority and enrollment preferences
- Direct enrollment from waiting list
- Manage waiting list entries

### 🏫 Program Management
- Create and manage educational programs
- Program details and descriptions
- Student enrollment tracking per program

### 👤 User Management
- User profiles and permissions
- Staff member management
- Role-based access control

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/brighter-future.git
   cd brighter-future
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

The application uses Supabase as the backend. You'll need to set up the following tables:

### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  program_id INTEGER REFERENCES programs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Programs Table
```sql
CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  program_id INTEGER REFERENCES programs(id),
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Daily Notes Table
```sql
CREATE TABLE daily_notes (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  program_id INTEGER NOT NULL,
  program_name VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  notes TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Waiting List Table
```sql
CREATE TABLE waiting_list (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  age INTEGER,
  parent_name VARCHAR(255),
  parent_phone VARCHAR(50),
  parent_email VARCHAR(255),
  address TEXT,
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(50),
  program VARCHAR(255),
  priority VARCHAR(50),
  preferred_start_date DATE,
  reason_for_waiting TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── Students.tsx
│   ├── Attendance.tsx
│   ├── DailyNotes.tsx
│   ├── WaitingList.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useStudents.ts
│   ├── useAttendance.ts
│   ├── useDailyNotes.ts
│   └── ...
├── lib/                # Utility libraries
│   └── supabase.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/brighter-future/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] User authentication and authorization
- [ ] Advanced reporting and analytics
- [ ] Mobile app version
- [ ] Integration with external systems
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Export functionality
- [ ] Real-time notifications

---

**Built with ❤️ for educational institutions**
