# Quick Start Guide - Per-Subject Features

## 5-Minute Setup

### Step 1: Update Data Files
Copy sample data from `SAMPLE_DATA.md` to:
- `backend/students_data.txt`
- `backend/teachers_data.txt`
- `backend/system_meta.txt`

### Step 2: Compile Backend
```bash
cd backend
gcc -o student_server student_server_enhanced.c -lws2_32
student_server.exe
```

### Step 3: Start Frontend
```bash
cd frontend
npm install  # if needed
npm start
```

### Step 4: Open Browser
```
http://localhost:3000
```

---

## Test Accounts

### Students
| ID | Password | Department |
|----|----------|-----------|
| 1001 | arun | CSE |
| 1002 | priya | ECE |
| 1003 | krupa | ECE |
| 1004 | rajesh | CIVIL |
| 1005 | anjali | CSE |

### Teachers
| Email | Password | Department |
|-------|----------|-----------|
| ramesh@college.edu | cse_teacher | CSE |
| sneha@college.edu | ec_teacher | ECE |
| vikram@college.edu | civil_teacher | CIVIL |

### Principal
| Password |
|----------|
| principal123 |

---

## Key Features at a Glance

### 👤 Student Dashboard
- Profile tab: Basic info
- Academics tab: Overall CGPA & attendance
- **Subjects tab (NEW):** Per-subject marks & attendance (read-only)

### 👨‍🏫 Teacher Dashboard
- Profile tab: Teacher info
- **Students tab (UPDATED):** Expandable students with subject editing
  - Teachers see only their department students
  - Can edit marks, attendance, remarks
  - Changes persist immediately

### 👔 Principal Dashboard
- Pending Approvals: Approve/reject teachers (unchanged)
- **Teachers tab (NEW):** Filter all teachers by department
- **Students tab (UPDATED):** Expandable view, department filter
  - Can edit any student's subjects
  - Full access to all departments

---

## API Examples

### Get student with subjects
```bash
curl http://localhost:8080/api/students/1001
```

### Teacher updates subject marks
```bash
curl -X PUT http://localhost:8080/api/students/1001/subjects/CS101 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "teacher",
    "email": "ramesh@college.edu",
    "password": "cse_teacher",
    "mid1": 18,
    "mid2": 20,
    "final": 72,
    "attendance_percent": 92.0,
    "remarks": "Good performance"
  }'
```

### Principal gets all CSE teachers
```bash
curl "http://localhost:8080/api/teachers?department=CSE"
```

---

## Testing Checklist

Quick 5-test suite:

1. **Student reads subjects** ✓
   - Login as student 1001
   - Go to Subjects tab
   - See 4 subjects with marks

2. **Teacher updates marks** ✓
   - Login as ramesh@college.edu
   - Expand student 1001
   - Edit CS101 marks
   - Save

3. **Verify persistence** ✓
   - Logout teacher
   - Login as student 1001
   - Check updated marks in Subjects tab

4. **Teacher can't see other dept** ✓
   - Login as sneha@college.edu (ECE teacher)
   - Only see ECE students (1002, 1003)
   - Don't see CSE students

5. **Principal sees all** ✓
   - Login as principal (principal123)
   - See all 5 students
   - See all 3 approved teachers
   - Select "CSE" filter → see only CSE students

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Backend won't compile | Ensure `gcc` and `ws2_32` lib installed |
| Frontend won't start | Run `npm install` first, check Node version |
| Students not appearing | Restart backend and frontend servers |
| Can't update marks | Verify correct password and department match |
| Data not persisting | Check file permissions in `backend/` folder |

---

## File Locations

```
project-root/
├── backend/
│   ├── student_server_enhanced.c    [Modified - main backend]
│   ├── student_server.exe           [Compiled binary]
│   ├── students_data.txt            [Student/subject data]
│   ├── teachers_data.txt            [Teacher data]
│   ├── system_meta.txt              [ID counters]
│   └── approvals.txt                [Pending teachers]
│
├── frontend/
│   └── src/components/
│       ├── AcademicEditor.js        [NEW - subject editor component]
│       ├── StudentDashboard.js      [Modified - added Subjects tab]
│       ├── TeacherDashboard.js      [Modified - expandable students]
│       ├── PrincipalDashboard.js    [Modified - added Teachers tab]
│       └── ...
│
└── Documentation/
    ├── API_DOCUMENTATION.md         [Complete API reference]
    ├── MIGRATION_GUIDE.md           [Schema & migration]
    ├── SAMPLE_DATA.md               [Test accounts & data]
    ├── TEST_PLAN.md                 [Manual test cases]
    ├── IMPLEMENTATION_SUMMARY.md    [Feature overview]
    └── QUICK_START.md               [This file]
```

---

## Key Changes Summary

| Component | Change | Impact |
|-----------|--------|--------|
| C Backend | Added subjects array | Students now have per-subject tracking |
| Student Dashboard | Added Subjects tab | Students can view marks per subject |
| Teacher Dashboard | Expandable students | Better UX for managing multiple students |
| Principal Dashboard | Added Teachers tab | Can manage all teachers centrally |
| API | +1 new endpoint, modified 2 | More flexible filtering |
| Authorization | Server-side enforcement | Better security for cross-dept access |

---

## Next Steps (Optional Enhancements)

- [ ] Add WebSocket for real-time updates
- [ ] Implement batch mark upload
- [ ] Export transcript as PDF
- [ ] Grade curve calculations
- [ ] Mobile-friendly UI refinement
- [ ] Performance optimization with DB

---

## Support & Documentation

- **Quick Issues:** Check "Common Issues & Solutions" above
- **API Details:** See `API_DOCUMENTATION.md`
- **Setup Issues:** See `MIGRATION_GUIDE.md`
- **Testing:** See `TEST_PLAN.md`
- **Full Details:** See `IMPLEMENTATION_SUMMARY.md`

---

**Ready to go!** 🚀  
Start with the test accounts and follow the 5-test checklist above.
