# 🎓 Student Management System

A comprehensive full-stack Student Management System with multi-role authentication and RESTful API architecture. This system enables efficient management of students, teachers, and academic records with role-based access control for Admin, Principal, Teacher, and Student users.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [Features by Role](#features-by-role)

## ✨ Features

### Multi-Role Authentication System
- **Admin**: System-wide management and configuration
- **Principal**: Teacher approval, student overview, and management
- **Teacher**: Student data management and academic updates
- **Student**: Personal profile and academic record access

### Core Functionality
- 🔐 Secure role-based authentication and authorization
- 👥 Student registration and profile management
- 👨‍🏫 Teacher registration with Principal approval workflow
- 📊 Per-subject academic tracking (Mid1, Mid2, Final exams)
- 📈 Attendance tracking per subject
- 🎯 CGPA calculation and monitoring
- 📝 Academic remarks and feedback system
- 💾 File-based persistent data storage
- 🌐 RESTful API architecture with CORS support

## 🛠️ Tech Stack

### Backend
- **Language**: C
- **Server**: Custom HTTP server using Winsock2 (Windows Sockets API)
- **Port**: 8080
- **Data Storage**: Text-based file system (students_data.txt, teachers_data.txt, approvals.txt)
- **API**: RESTful endpoints with JSON responses

### Frontend
- **Framework**: React 19.2.0
- **Styling**: CSS3 with gradient designs
- **State Management**: React Hooks
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Testing**: Jest & React Testing Library
- **Port**: 3000 (development)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│          React Frontend (Port 3000)             │
│  - LoginSelector  - StudentDashboard            │
│  - TeacherDashboard - PrincipalDashboard        │
│  - AdminPanel - Registration Forms              │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/REST API
                   │
┌──────────────────▼──────────────────────────────┐
│          C Backend Server (Port 8080)           │
│  - Request Handler - Authentication             │
│  - CRUD Operations - File Management            │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│          File-based Storage                     │
│  - students_data.txt - teachers_data.txt        │
│  - approvals.txt - system_meta.txt              │
└─────────────────────────────────────────────────┘
```

## 📦 Prerequisites

### Backend Requirements
- **Windows OS** (uses Winsock2 API)
- **GCC Compiler** (MinGW-w64 recommended)
- Port 8080 available

### Frontend Requirements
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- Port 3000 available

## 🚀 Installation

### Clone the Repository
```bash
git clone https://github.com/Krupanka06/STUDENT_MANAGEMENT_SYSTEM.git
cd STUDENT_MANAGEMENT_SYSTEM
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Compile the server using GCC:
```bash
gcc -o student_server_enhanced.exe student_server_enhanced.c -lws2_32
```

**Note**: The `-lws2_32` flag links the Windows Socket library required for networking.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

This will install all required packages including:
- React and React-DOM
- Testing libraries
- Web vitals
- And all other dependencies listed in package.json

## ▶️ Running the Application

### Start the Backend Server

1. Open a terminal/PowerShell in the backend directory
2. Run the compiled executable:
```bash
cd backend
.\student_server_enhanced.exe
```

The server will start on `http://localhost:8080` and display:
```
=========================================
  Enhanced Student Management System
=========================================
Default Credentials:
  Admin:     password = admin123
  Principal: password = principal123
  Teacher:   password = teacher123
  Student:   password = student123
=========================================

Server running on http://localhost:8080
```

**Important**: Keep this terminal window open while using the application.

### Start the Frontend Application

1. Open a **new** terminal/PowerShell window
2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Start the development server:
```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`

If it doesn't open automatically, navigate to: **http://localhost:3000**

### Verify Both Servers are Running

- Backend: `http://localhost:8080` ✅
- Frontend: `http://localhost:3000` ✅

## 🔑 Default Credentials

### Admin Login
```
Password: admin123
```

### Principal Login
```
Password: principal123
```

### Teacher Login (After Registration & Approval)
```
Password: teacher123 (or custom during registration)
```

### Student Login
```
Student ID: 1001 (or assigned ID after registration)
Password: student123 (or custom during registration)
```

## 📂 Project Structure

```
STUDENT_MANAGEMENT_SYSTEM/
│
├── backend/
│   ├── student_server_enhanced.c      # Main enhanced server implementation
│   ├── student_server_enhanced.exe    # Compiled executable
│   ├── student_server_json.c          # JSON variant
│   ├── student_server.c               # Basic server
│   ├── students_data.txt              # Student records storage
│   ├── teachers_data.txt              # Teacher records storage
│   ├── approvals.txt                  # Teacher approval tracking
│   ├── system_meta.txt                # System metadata
│   └── database.json                  # JSON data storage (if using JSON variant)
│
├── frontend/
│   ├── public/
│   │   ├── index.html                 # HTML template
│   │   ├── manifest.json              # PWA manifest
│   │   └── robots.txt                 # Robots configuration
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginSelector.js       # Role selection page
│   │   │   ├── StudentLogin.js        # Student authentication
│   │   │   ├── StudentRegister.js     # Student registration form
│   │   │   ├── TeacherRegister.js     # Teacher registration form
│   │   │   ├── StudentDashboard.js    # Student interface
│   │   │   ├── TeacherDashboard.js    # Teacher interface
│   │   │   ├── PrincipalDashboard.js  # Principal interface
│   │   │   ├── AdminPanel.js          # Admin interface
│   │   │   ├── AcademicEditor.js      # Academic data editor
│   │   │   ├── LandingPage.js         # Landing page
│   │   │   └── ManageSubjectsModal.js # Subject management modal
│   │   │
│   │   ├── styles/
│   │   │   └── LoginSelector.css      # Styling files
│   │   │
│   │   ├── App.js                     # Main application component
│   │   ├── App.css                    # Application styles
│   │   ├── index.js                   # Entry point
│   │   └── index.css                  # Global styles
│   │
│   ├── package.json                   # Frontend dependencies
│   ├── package-lock.json              # Locked dependency versions
│   └── README.md                      # Frontend documentation
│
└── README.md                          # This file
```

## 🎭 Features by Role

### 👨‍💼 Admin Features
- System-wide access and management
- View all users across roles
- System configuration and maintenance

### 🎓 Principal Features
- **Teacher Management**
  - View all teacher registration requests
  - Approve or reject teacher applications
  - View approved teacher list
- **Student Overview**
  - View all registered students
  - Monitor student performance across departments
  - Access student academic records

### 👨‍🏫 Teacher Features
- **Profile Management**
  - View personal profile information
  - Update contact details
- **Student Management**
  - View list of students
  - Access student profiles
  - Update academic records (marks, attendance)
  - Add subject-wise remarks
  - Track student performance

### 👨‍🎓 Student Features
- **Profile Tab**
  - View personal information
  - Check enrollment details
  - View CGPA and overall attendance
- **Academics Tab**
  - View subject-wise marks (Mid1, Mid2, Final)
  - Check subject-wise attendance
  - Read teacher remarks and feedback
  - Monitor academic progress

## 🌐 API Endpoints

### Authentication Endpoints
```
POST /api/admin/login           # Admin authentication
POST /api/principal/login       # Principal authentication
POST /api/teacher/login         # Teacher authentication
POST /api/student/login         # Student authentication
```

### Student Endpoints
```
GET  /api/students              # List all students
GET  /api/students/{id}         # Get student by ID (with subjects)
POST /api/student/register      # Register new student
PUT  /api/students/{id}         # Update student details
PUT  /api/students/{id}/subject/{subjectId}  # Update subject data
```

### Teacher Endpoints
```
GET  /api/teachers              # List all teachers
GET  /api/teacher/{id}          # Get teacher by ID
POST /api/teacher/register      # Register new teacher (requires approval)
```

### Principal Endpoints
```
GET  /api/principal/pending-teachers     # Get pending teacher approvals
POST /api/principal/teachers/{id}/approve # Approve teacher registration
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

Runs the test suite in interactive watch mode.

### Build for Production
```bash
cd frontend
npm run build
```

Creates an optimized production build in the `build/` folder.

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Server won't start
- **Solution**: Ensure port 8080 is not in use by another application
- Check if you have administrator privileges to bind to the port
- Verify Windows Firewall settings

**Problem**: Compilation errors
- **Solution**: Install MinGW-w64 GCC compiler
- Ensure `-lws2_32` flag is included in the compile command

### Frontend Issues

**Problem**: `npm install` fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure Node.js version is 14 or higher

**Problem**: Cannot connect to backend
- **Solution**: Verify backend server is running on port 8080
- Check browser console for CORS errors
- Ensure backend server is started before frontend

**Problem**: Port 3000 already in use
- **Solution**: Kill the process using port 3000 or run on a different port:
```bash
set PORT=3001 && npm start
```

## 📝 Notes

- All data is stored in text files in the `backend/` directory
- Backend must be running before starting the frontend
- The system uses Windows-specific networking (Winsock2)
- CORS is enabled for localhost:3000 connections
- Student IDs start from 1001, Teacher IDs from 2001, Principal IDs from 3001

## 👥 Contributors

- Krupanka R  
- Ravi R
- Nitish S
- Amith Gowda

## 📄 License

This project is developed as part of an academic project for RVCE (RV College of Engineering).

## 🔮 Future Enhancements

- Database integration (MySQL/PostgreSQL)
- Email notifications for approvals
- File upload for documents
- Timetable management
- Fee management system
- Report card generation
- Mobile responsive design improvements
- Real-time notifications

---

**Made with ❤️ for RVCE - RV College of Engineering**
