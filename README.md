# Enhanced Student Management System

A multi-role student management system with teacher approval workflow, built with C backend (Winsock2) and React frontend.

## 🎯 Features

- **Multi-Role Authentication**: Student, Teacher, Principal, Admin
- **Teacher Approval Workflow**: Teachers register and wait for principal approval
- **Role-Based Dashboards**: Each role has a dedicated interface
- **Student Management**: Track students, academics, CGPA, and attendance
- **Modern UI**: Beautiful gradient design with smooth animations
- **File-Based Persistence**: Data stored in text files with automatic sync

## 📋 Default Credentials

| Role | Email/ID | Password |
|------|----------|----------|
| Student | 1001 | student123 |
| Teacher | - | teacher123 |
| Principal | - | principal123 |
| Admin | - | admin123 |

## 🚀 Quick Start

### Prerequisites
- **Windows** with MinGW (gcc) installed
- **Node.js** and npm
- **Visual Studio Code** (optional)

### Installation & Running

**Terminal 1 - Backend Server:**
```bash
cd backend
gcc -o student_server_new student_server_enhanced.c -lws2_32
student_server_new.exe
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Open in Browser:**
```
http://localhost:3000
```

## 📂 Project Structure

```
Student_Management/
├── backend/
│   ├── student_server_enhanced.c    # Main multi-role API server
│   ├── student_server_new.exe       # Compiled backend executable
│   ├── students_data.txt            # Student records
│   ├── teachers_data.txt            # Teacher records
│   ├── approvals.txt                # Pending teacher approvals
│   └── system_meta.txt              # ID counters
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginSelector.js     # Multi-role login interface
│   │   │   ├── StudentLogin.js      # Student login
│   │   │   ├── StudentRegister.js   # Student registration
│   │   │   ├── TeacherRegister.js   # Teacher registration
│   │   │   ├── StudentDashboard.js  # Student interface
│   │   │   ├── TeacherDashboard.js  # Teacher interface
│   │   │   └── PrincipalDashboard.js# Principal interface
│   │   ├── styles/
│   │   │   └── LoginSelector.css    # Modern login styling
│   │   └── App.js
│   ├── public/
│   └── package.json
│
└── README.md                         # This file
```

## 🔄 Teacher Approval Workflow

1. **Teacher Registers**
   - Go to login page → Click "Teacher" → Click "Register as Teacher"
   - Fill name, email, department, password
   - Account starts with `approved=0` (pending)

2. **Principal Reviews**
   - Login as Principal (password: `principal123`)
   - Go to "Pending Approvals" tab
   - See list of pending teachers
   - Click "Approve" or "Reject"

3. **Teacher Logs In**
   - Once approved (`approved=1`), teacher can login
   - Uses email and password from registration
   - Access teacher dashboard

## 🛠️ API Endpoints

### Teacher Endpoints
- `POST /api/teacher/register` - Register new teacher
- `POST /api/teacher/login` - Login with email/password

### Principal Endpoints
- `GET /api/principal/pending-teachers` - Get pending approval list
- `POST /api/principal/teachers/{id}/approve` - Approve/reject teacher

### Student Endpoints
- `POST /api/student/register` - Register new student
- `POST /api/student/login` - Login with student ID/password
- `GET /api/students` - Get all students

## 📁 Data Files

### teachers_data.txt
```
TEACHER|{id}|{name}|{password}|{email}|{department}|{approved}|{approvalDate}
```
- `approved`: 0=pending, 1=approved, -1=rejected

### students_data.txt
```
STUDENT|{id}|{name}|{password}|{email}|{department}|{year}|{cgpa}|{attendance}
```

### system_meta.txt
```
nextStudentId|nextTeacherId|nextPrincipalId
```

### approvals.txt
Quick reference list of pending teacher IDs (one per line)

## 🎨 Color Scheme

- **Primary**: #1A73E8 (Professional Blue)
- **Secondary**: #00A8CC (Teal)
- **Accent**: #19C5FF (Light Blue)
- **Background**: #F5F9FF (Off White)

## 🧪 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can login as student (ID: 1001)
- [ ] Can register as teacher
- [ ] Can login as principal
- [ ] Can approve pending teachers
- [ ] Approved teacher can login
- [ ] Can view student list from teacher dashboard
- [ ] UI is responsive and looks professional

## 📝 File Format Notes

**Teachers Data Format:**
```
TEACHER|2001|John Smith|test@123|john@college.edu|CSE|1|2025-11-28
```

**System Meta Format:**
```
1005|2005|3001
```
(nextStudentId=1005, nextTeacherId=2005, nextPrincipalId=3001)

## 🔐 Security Notes

- Default credentials are for testing only
- Passwords stored as plain text in files (consider hashing for production)
- CORS enabled for localhost development
- File-based persistence (upgrade to database for production)

## 🐛 Troubleshooting

### Backend won't compile
- Install MinGW: https://www.mingw-w64.org/
- Ensure gcc is in PATH

### Port 8080 already in use
- Kill existing process: `taskkill /F /IM student_server_new.exe`
- Or change port in student_server_enhanced.c

### Can't connect to server
- Verify backend terminal shows "Server running on http://localhost:8080"
- Check Windows Firewall isn't blocking port 8080

### Teacher can't login after approval
- Verify Principal approved the teacher
- Check teachers_data.txt has `approved=1` for that teacher
- Ensure email and password are correct

## 🚀 Future Enhancements

- [ ] Upgrade to database (PostgreSQL/MySQL)
- [ ] Hash passwords with bcrypt
- [ ] Add JWT authentication
- [ ] Email notifications for approvals
- [ ] Advanced user management
- [ ] Grade management system
- [ ] Attendance tracking
- [ ] Report generation

## 📄 License

This project is for educational purposes.

---

**Last Updated**: November 28, 2025
**Status**: ✅ Fully Functional
