# Quick Start - Teacher Subject Management

## What's New?

Teachers can now assign and manage subjects directly from their dashboard with a new **"Manage Subjects"** button.

---

## How to Use (Teacher)

### Step 1: Login
- Email: `john@example.com` (or any approved teacher)
- Password: `teacher123`

### Step 2: Go to Students Tab
- Click **🎓 Students** tab
- See all students from your department

### Step 3: Expand a Student
- Click any student card to expand
- See their CGPA and attendance summary

### Step 4: Click "Manage Subjects"
- New blue button: **📚 Manage Subjects**
- Modal opens with 2 tabs

### Step 5: Assign New Subject
- Click **➕ Assign Subject** tab
- Fill in:
  - Subject ID (e.g., `CS201`)
  - Subject Name (e.g., `Algorithms`)
  - Mid 1, Mid 2, Final marks
  - Attendance %
- Click **✓ Assign Subject**
- Success! Subject appears in student profile

### Step 6: Edit Marks Later
- Click **📊 Edit Subjects & Academics** tab
- See table of assigned subjects
- Click **✎ Edit** on any subject
- Inline editing appears
- Modify marks/attendance
- Click **Save** to update

### Step 7: Update Overall Academics
- Same modal, same **📊 Edit Subjects & Academics** tab
- Scroll down to "Overall Academic Performance"
- Update CGPA (0-10) and Attendance % (0-100)
- Click **💾 Save Academic Info**

---

## Principal Usage

Same as teacher, but:
- ✅ Can manage ANY student (no dept restriction)
- ✅ Can see all departments
- ✅ Click **🎓 Students** tab → see all students
- ✅ Same "📚 Manage Subjects" button
- ✅ Same modal interface

---

## What Students See

**For Students:**
- New **📚 Subjects** tab in dashboard
- Shows all assigned subjects with:
  - Subject name and ID
  - Marks breakdown (mid1, mid2, final, total)
  - Attendance %
  - Remarks (if teacher added)
- Read-only view (cannot edit)
- Updates automatically when teacher assigns/edits

---

## What Data Is Saved?

### Per-Subject:
- Subject ID and name
- 3 marks: mid1, mid2, final (auto-totals)
- Attendance percentage (0-100)
- Optional remarks

### Overall Student:
- CGPA (0-10)
- Overall attendance % (0-100)

All stored in `students_data.txt` with indented format:
```
STUDENT|1001|name|...
  SUBJECT|CS101|Data Structures|18|19|42|88|remarks
  SUBJECT|CS102|Database Systems|20|18|45|85|remarks
```

---

## Test Accounts

### Teachers:
| Email | Password | Department |
|-------|----------|------------|
| john@example.com | teacher123 | CSE |
| demo.teacher@example.edu | teacher123 | Physics |

### Students:
| ID | Password | Department |
|----|----------|------------|
| 1001 | student123 | CSE |
| 1002 | student123 | ECE |

### Principal:
Password: `principal123`

---

## Common Tasks

### "I want to assign CS201 to student 1001"
1. Login as teacher from CSE dept
2. Go to Students tab
3. Find student 1001
4. Click → expand card
5. Click "📚 Manage Subjects"
6. Fill form:
   - Subject ID: `CS201`
   - Name: `Algorithms`
   - Marks: 20, 18, 60
   - Attendance: 90
7. Click "✓ Assign Subject"
8. Done! Modal closes, subject appears

### "I want to update marks for CS101"
1. Click "📚 Manage Subjects" on student
2. Click "📊 Edit Subjects & Academics" tab
3. Find CS101 in table
4. Click "✎ Edit"
5. Modify marks/attendance inline
6. Click "Save"
7. Done!

### "I want to see what my teacher assigned"
1. Login as student 1001
2. Click "📚 Subjects" tab
3. See all your subjects with marks
4. Read-only view (you can't edit)
5. Changes appear automatically when teacher updates

---

## Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Forbidden: insufficient role or department mismatch" | Trying to edit student from different dept | Only edit your own department students |
| "Validation failed: marks must be non-negative" | Entered negative mark | Use 0 or positive numbers only |
| "Validation failed: attendance 0-100" | Attendance outside range | Use 0-100 only |
| "Subject already assigned to this student" | Tried to assign same subject twice | Edit instead of assign |
| "CGPA must be 0-10" | CGPA outside valid range | Use 0-10 scale |
| "Server error" | Backend crashed | Restart backend: `./student_server` |

---

## API Reference (for developers)

### POST /api/students/:id/subjects
```bash
curl -X POST http://localhost:8080/api/students/1001/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "role":"teacher","email":"john@example.com","password":"teacher123",
    "subjectId":"CS201","name":"Algorithms",
    "mid1":20,"mid2":18,"final":60,"attendance_percent":95
  }'
```

### PUT /api/students/:id/subjects/:subjectId
```bash
curl -X PUT http://localhost:8080/api/students/1001/subjects/CS201 \
  -H "Content-Type: application/json" \
  -d '{
    "role":"teacher","email":"john@example.com","password":"teacher123",
    "mid1":22,"mid2":20,"final":58,"attendance_percent":96
  }'
```

### PUT /api/students/:id/academics
```bash
curl -X PUT http://localhost:8080/api/students/1001/academics \
  -H "Content-Type: application/json" \
  -d '{
    "role":"teacher","email":"john@example.com","password":"teacher123",
    "cgpa":8.5,"attendance_percent":92
  }'
```

---

## Verification Checklist

After deployment, verify:
- [ ] Backend compiles: `gcc -o student_server student_server_enhanced.c -lws2_32`
- [ ] No compiler errors (warnings ok)
- [ ] Backend starts: `./student_server`
- [ ] Frontend runs: `npm start`
- [ ] Can login as teacher
- [ ] Can see students from own dept only
- [ ] Can click "Manage Subjects" button
- [ ] Modal opens with 2 tabs
- [ ] Can assign a subject
- [ ] Subject appears in student dashboard
- [ ] Can edit marks
- [ ] Student sees updated marks
- [ ] Principal sees updated marks
- [ ] Can update CGPA/attendance

---

## Support

For detailed documentation, see: `TEACHER_SUBJECT_MANAGEMENT.md`

For API details, see: `API_DOCUMENTATION.md`

For all test scenarios, see: `TEST_PLAN.md`
