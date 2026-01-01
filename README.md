# Enhanced Student Management System

A multi-role student management system with per-subject tracking, teacher approval workflow, and role-based access control. Built with C backend (Winsock2) and React frontend.

## 🎯 Features

- **Multi-Role Authentication**: Student, Teacher, Principal
- **Per-Subject Tracking**: Track marks and attendance per subject
  - Mid exams, final exams, and cumulative marks
  - Per-subject attendance percentage
  - Teacher remarks per subject
- **Teacher Approval Workflow**: Teachers register and wait for principal approval
- **Role-Based Access Control**:
  - **Students**: View own subjects and marks (read-only)
  - **Teachers**: Update marks for own department students only
  - **Principal**: Manage all students and teachers across departments
- **Department Filtering**: View and manage by department
- **Modern UI**: Beautiful gradient design with smooth animations and expandable cards
- **File-Based Persistence**: Automatic data sync to files

## ✨ New Features (v2.0)

- ✅ Per-subject marks tracking (mid1, mid2, final)
- ✅ Per-subject attendance percentage
- ✅ Subject-wise remarks/comments
- ✅ Department-enforced access (teachers see only own dept)
- ✅ Expandable student cards for better UX
- ✅ AcademicEditor component for reusable subject editing
- ✅ Teachers tab in principal dashboard
- ✅ Real-time mark updates and persistence

## 📋 Default Credentials

### Students
| ID | Password | Department |
|-----|----------|-----------|
| 1001 | student123 | CSE |

### Teachers
| Email | Password | Department | Status |
|-------|----------|-----------|--------|
| ramesh@college.edu | cse_teacher | CSE | Approved |
| sneha@college.edu | ec_teacher | ECE | Approved |
| vikram@college.edu | civil_teacher | CIVIL | Approved |

### Principal
| Password |
|----------|
| principal123 |

See [SAMPLE_DATA.md](SAMPLE_DATA.md) for additional test accounts.

## 🚀 Quick Start

### Prerequisites
- **Windows** with MinGW (gcc) installed
- **Node.js** 12+ and npm
- **Visual Studio Code** (optional)

### Installation & Running

**Terminal 1 - Backend Server:**
```bash
cd backend
gcc -o student_server student_server_enhanced.c -lws2_32
student_server.exe
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
│   ├── student_server_enhanced.c    # Main API server (updated with subjects)
│   ├── student_server.exe           # Compiled binary
│   ├── students_data.txt            # Student/subject data
│   ├── teachers_data.txt            # Teacher records
│   ├── approvals.txt                # Pending approvals
│   └── system_meta.txt              # ID counters
│
├── frontend/src/components/
│   ├── AcademicEditor.js           # [NEW] Reusable subject editor
│   ├── StudentDashboard.js         # [UPDATED] Added Subjects tab
│   ├── TeacherDashboard.js         # [UPDATED] Expandable students
│   ├── PrincipalDashboard.js       # [UPDATED] Added Teachers tab
│   ├── LoginSelector.js            # Multi-role login
│   ├── StudentLogin.js
│   ├── StudentRegister.js
│   └── TeacherRegister.js
│
├── Documentation/
│   ├── API_DOCUMENTATION.md        # Complete API reference
│   ├── MIGRATION_GUIDE.md          # Database schema & migration
│   ├── SAMPLE_DATA.md              # Test data & accounts
│   ├── TEST_PLAN.md                # Manual test cases
│   ├── QUICK_START.md              # Quick reference
│   └── IMPLEMENTATION_SUMMARY.md   # Feature overview
│
└── README.md                        # This file
```

## 🔐 Role-Based Access Control

### Student Role
- View own profile (name, email, department, year)
- View overall CGPA and attendance
- **View per-subject marks and attendance (NEW)**
- Cannot edit any data

### Teacher Role
- View teacher profile
- **View students from own department only (server-enforced)**
- **Update marks and attendance for own department students (NEW)**
- Add remarks for subjects
- Cannot access other departments

### Principal Role
- View all students across all departments
- **View all approved teachers (NEW)**
- **Filter by department (NEW)**
- **Edit any student's marks and remarks (NEW)**
- Approve/reject new teacher registrations
- Manage all data

## 📊 Student Dashboard

### Tabs
1. **👤 Profile** - Personal information and student ID
2. **📊 Academics** - Overall CGPA and attendance
3. **📚 Subjects (NEW)** - Per-subject marks breakdown and attendance

### Subject Details
- Subject ID and name
- Mid exam 1, Mid exam 2, Final exam marks
- Total calculated automatically
- Attendance percentage with visual indicator
- Teacher remarks if available

## 👨‍🏫 Teacher Dashboard

### Tabs
1. **👤 Profile** - Teacher info and approval status
2. **📚 Students (UPDATED)** - Expandable cards showing:
   - Student basic info (ID, email, year)
   - Overall CGPA and attendance
   - **Subjects list with edit capability (NEW)**
   - Edit button for each subject

### Subject Editing
- Click ✏️ Edit on any subject
- Update mid1, mid2, final marks
- Update attendance percentage
- Add optional remarks
- Confirm with teacher password
- Changes persist immediately

## 👔 Principal Dashboard

### Tabs
1. **⏳ Pending Approvals** - Approve/reject teachers (unchanged)
2. **👨‍🏫 Teachers (NEW)**
   - View all approved teachers
   - Filter by department
   - See teacher contact info
3. **🎓 Students (UPDATED)**
   - View all students
   - **Department filter dropdown (NEW)**
   - Expandable student cards
   - **Can edit any student's subjects (NEW)**
   - Full access control

## 🛠️ API Endpoints

### Modified Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/:id` | Get student with subjects |
| POST | `/api/students` | List students (role-filtered) |

### New Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/students/:id/subjects/:subjectId` | Update subject marks/attendance |
| GET | `/api/teachers` | List all teachers (principal only) |

### Authorization Rules
- **TEACHER**: Returns only own department students. Cross-department access returns 403.
- **PRINCIPAL**: Returns all students or filtered by department.
- **STUDENT**: Returns only own data.

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete details with examples.

## 🔄 Teacher Approval Workflow

1. **Teacher Registers**
   - Go to login page → Click "Teacher" → Click "Register as Teacher"
   - Fill name, email, department, password
   - Account status: pending approval

2. **Principal Reviews**
   - Login as Principal
   - Go to "⏳ Pending Approvals" tab
   - See pending teachers
   - Click "✓ Approve" or "✕ Reject"

3. **Teacher Accesses System**
   - Once approved, teacher can login with email and password
   - Access teacher dashboard
   - View and edit students from own department

## 📚 Database Schema

### New Subject Structure
```
SUBJECT {
  subjectId: string        // e.g., "CS101"
  name: string            // e.g., "Data Structures"
  marks: {
    mid1: integer         // First midterm
    mid2: integer         // Second midterm
    final: integer        // Final exam
    total: integer        // Auto-calculated sum
  }
  attendance_percent: decimal  // 0-100%
  remarks: string             // Optional teacher comments
}
```

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed schema and migration steps.

## ✅ Testing

### Quick Test (5 minutes)
1. Load sample data from [SAMPLE_DATA.md](SAMPLE_DATA.md)
2. Login as student 1001 → view Subjects tab
3. Login as teacher ramesh@college.edu → edit student 1001's CS101 marks
4. Login as student 1001 → verify mark changes persisted
5. Login as principal → select CSE → see updated marks

### Full Test Suite
See [TEST_PLAN.md](TEST_PLAN.md) for 10 detailed acceptance criteria test cases.

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup and key features
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with cURL examples
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Database schema and migration steps
- **[SAMPLE_DATA.md](SAMPLE_DATA.md)** - Test accounts and sample data
- **[TEST_PLAN.md](TEST_PLAN.md)** - Manual testing procedures (10 test cases)
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Feature overview and architecture

## 🔄 Data Persistence

Data is stored in plain text files in the `backend/` directory:
- `students_data.txt` - Student records with subjects
- `teachers_data.txt` - Teacher records
- `system_meta.txt` - ID counters

**Note:** The system is backward compatible. Old data without subjects will load correctly.

## 🎨 UI/UX Features

- **Expandable Cards**: Click to expand/collapse student details
- **Progress Bars**: Visual attendance percentage indicators
- **Department Badges**: Color-coded department labels
- **Responsive Design**: Works on different screen sizes
- **Tab Navigation**: Organized information in tabs
- **Inline Editing**: Edit marks without leaving the page
- **Real-time Updates**: Changes visible immediately after save

## 🔒 Security

- **Server-Side Authorization**: All checks enforced on backend
- **Department Enforcement**: Teachers cannot access other departments
- **Role Validation**: Each endpoint validates user permissions
- **Password Confirmation**: Required for updates
- **Input Validation**: Server validates all inputs (marks 0-100, attendance, etc.)
- **Error Messages**: Descriptive but secure error responses

## 🚀 Performance

- **File-based**: Suitable for small to medium deployments
- **Optimized**: Minimal network requests
- **Responsive**: React components update quickly
- **Scalable**: Can support hundreds of students/teachers

## 📋 Acceptance Criteria - All Implemented ✓

1. ✅ Students view subject-level marks & attendance (read-only)
2. ✅ Teachers see only students from their department
3. ✅ Teachers can update marks/attendance for own department
4. ✅ Teachers CANNOT update other department students
5. ✅ Principal can view all students and teachers
6. ✅ Principal can filter by department
7. ✅ Principal can edit any student's marks
8. ✅ New student registration visible immediately
9. ✅ Unauthorized attempts return 403
10. ✅ Teacher approval workflow unchanged

## 🔄 Version History

- **v1.0** - Initial release with basic CGPA/attendance
- **v2.0** - Per-subject tracking, department filtering, role-based access control

## 📝 License

Educational Project - RVCE

## 🤝 Contributing

This is a class project. For modifications, please follow the existing code style and test thoroughly.

## 📞 Support

See documentation files for troubleshooting:
- Issues with setup? → [QUICK_START.md](QUICK_START.md)
- API questions? → [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Testing? → [TEST_PLAN.md](TEST_PLAN.md)
- Database questions? → [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)


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
