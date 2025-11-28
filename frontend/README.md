# Student Management System - Frontend

React-based frontend for the Enhanced Student Management System with multi-role login and dashboards.

## 🎯 Features

- **Multi-Role Login**: Student, Teacher, Principal, Admin
- **Student Dashboard**: Profile and academics information
- **Teacher Dashboard**: Profile and student management
- **Principal Dashboard**: Pending teacher approvals and student overview
- **Modern UI**: Professional gradient design with smooth animations
- **Responsive Design**: Works on desktop and tablet devices
- **Form Validation**: Input validation and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+) and npm installed
- Backend server running on `http://localhost:8080`

### Installation

```bash
cd frontend
npm install
```

### Running

```bash
npm start
```

This runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page reloads when you make changes.

## 📁 Component Structure

```
src/
├── components/
│   ├── LoginSelector.js           # Main login page with role selector
│   ├── StudentLogin.js            # Student ID/password login
│   ├── StudentRegister.js         # Student registration form
│   ├── TeacherRegister.js         # Teacher registration with email
│   ├── StudentDashboard.js        # Student interface (Profile & Academics)
│   ├── TeacherDashboard.js        # Teacher interface
│   ├── PrincipalDashboard.js      # Principal interface
│   └── AdminPanel.js              # Admin interface
│
├── styles/
│   ├── LoginSelector.css          # Modern login styling
│   ├── App.css                    # Global app styles
│   └── index.css                  # Base styles
│
├── App.js                         # Main app component
├── index.js                       # Entry point
└── reportWebVitals.js
```

## 🎨 UI Components

### LoginSelector.js
- Two-column layout (brand section + login form)
- Role selection tabs (Student, Teacher, Principal, Admin)
- Clean, modern design with professional colors

### StudentDashboard.js
- Profile tab: Name, ID, email, department, year
- Academics tab: CGPA, attendance, academic information

### TeacherDashboard.js
- Profile section: Name, ID, email, department
- Students list: View all students assigned to teacher
- Approval status display

### PrincipalDashboard.js
- **Pending Approvals Tab**: 
  - List of teachers waiting for approval
  - Approve/Reject buttons
  - Teacher details (name, email, department)
- **Students Tab**: View all students in the system
- **Statistics**: Pending count, total students, average CGPA

## 🔄 API Integration

All API calls go to `http://localhost:8080` endpoints:

```javascript
// Teacher Login
POST /api/teacher/login
Body: { email, password }

// Student Login
POST /api/student/login
Body: { studentId, password }

// Pending Teachers
GET /api/principal/pending-teachers

// Approve/Reject Teacher
POST /api/principal/teachers/{id}/approve
Body: { password, action }  // action: 1=approve, -1=reject

// Students List
GET /api/students
```

## 🎨 Color Scheme

```css
--primary: #1A73E8       /* Professional Blue */
--secondary: #00A8CC     /* Teal */
--accent: #19C5FF        /* Light Blue */
--background: #F5F9FF    /* Off White */
```

## 🧪 Testing

1. **Student Login**
   - ID: 1001
   - Password: student123

2. **Teacher Workflow**
   - Register: Click "Teacher" → "Register as Teacher"
   - Wait for approval: Login as Principal
   - Once approved: Login with email

3. **Principal Dashboard**
   - Password: principal123
   - Approve/reject pending teachers
   - View all students

## 📦 Scripts

```bash
npm start       # Start development server (port 3000)
npm test        # Run tests
npm run build   # Build for production
npm run eject   # Eject from Create React App (irreversible)
```

## 🐛 Troubleshooting

### Backend connection error
- Ensure backend server is running on `http://localhost:8080`
- Check browser console (F12) for network errors

### Teacher can't login after registration
- Principal must approve the teacher first
- Check PrincipalDashboard → Pending Approvals tab

### Form validation errors
- Ensure all required fields are filled
- Use valid email format for teacher registration

### Port 3000 already in use
- Change port: `PORT=3001 npm start`
- Or kill existing process: `taskkill /F /IM node.exe`

## 📚 Dependencies

- React 16.13+
- Fetch API for HTTP requests
- CSS3 for styling and animations

## 🔐 Security Notes

- Credentials sent as plain text (consider HTTPS for production)
- No token-based authentication (implement JWT for production)
- CORS enabled for localhost development only

## 🚀 Deployment

To build for production:

```bash
npm run build
```

This creates a `build/` folder ready for deployment.

---

**Part of**: Enhanced Student Management System
**Last Updated**: November 28, 2025
**Status**: ✅ Fully Functional
