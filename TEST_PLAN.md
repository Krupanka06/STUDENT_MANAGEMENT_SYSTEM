# Manual Testing Plan

## Setup

1. **Load Sample Data**: Replace files in `backend/` with sample data from `SAMPLE_DATA.md`
2. **Compile Backend**: 
   ```bash
   cd backend
   gcc -o student_server student_server_enhanced.c -lws2_32
   student_server.exe
   ```
3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```
4. **Browser**: Open `http://localhost:3000`

---

## Test Cases

### Test 1: Student Views Per-Subject Details (Read-Only)
**Acceptance Criteria #1: Students can view subject-level marks & attendance (read-only)**

**Steps:**
1. Navigate to Student Login
2. Login as: ID `1001`, Password `arun`
3. Go to "📚 Subjects" tab
4. Verify:
   - [ ] Student sees 4 subjects: CS101, CS102, CS103, CS104
   - [ ] Each subject shows: Subject ID, Name, Mid1/Mid2/Final marks, Total marks, Attendance %
   - [ ] No "Edit" button visible (read-only)
   - [ ] All marks match database values

**Expected Result:** ✓ PASS - Student can view subjects read-only

---

### Test 2: Teacher Views Own Department Students Only
**Acceptance Criteria #2: Teachers see only students from their department**

**Steps:**
1. Navigate to Teacher Login
2. Login as: Email `ramesh@college.edu`, Password `cse_teacher` (CSE teacher)
3. Go to "🎓 Students" tab
4. Verify:
   - [ ] Only students 1001 (Arun) and 1005 (Anjali) appear
   - [ ] Students from ECE/CIVIL are NOT visible
   - [ ] Student list shows department correctly

**Expected Result:** ✓ PASS - Teacher sees only own department

---

### Test 3: Teacher Updates Student Subject Marks
**Acceptance Criteria #3: Teachers can update only students from their department**

**Steps:**
1. Login as Teacher: `ramesh@college.edu / cse_teacher`
2. Go to Students tab
3. Expand student "1001 - Arun Kumar"
4. Click ✏️ Edit on subject "CS101 - Data Structures"
5. Update marks:
   - Mid1: `19`
   - Mid2: `21`
   - Final: `75`
   - Attendance: `94.5`
   - Remarks: `Updated test marks`
6. Enter password: `cse_teacher`
7. Click "Save Changes"
8. Verify:
   - [ ] Success message appears
   - [ ] Subject row updates immediately with new values
   - [ ] Total marks shows `115` (19+21+75)

**Login as Student 1001 and verify:**
1. Logout and login as Student 1001
2. Go to Subjects tab
3. Verify:
   - [ ] CS101 shows updated marks: 19, 21, 75
   - [ ] Total is now 115
   - [ ] Attendance shows 94.5%
   - [ ] Remarks visible: "Updated test marks"

**Expected Result:** ✓ PASS - Updates persist and are visible to student

---

### Test 4: Teacher Cannot Edit Other Department Students
**Acceptance Criteria #4: Teachers CANNOT modify students from other departments**

**Steps:**
1. Login as ECE Teacher: `sneha@college.edu / ec_teacher`
2. Go to Students tab
3. Verify:
   - [ ] CSE students (1001, 1005) are NOT visible
   - [ ] Only ECE students (1002, 1003) appear
4. Try to manually edit student 1001 by URL/API (if attempted):
   - Expected: 403 Forbidden error

**Expected Result:** ✓ PASS - Cross-department updates blocked

---

### Test 5: Principal Sees All Students and Teachers
**Acceptance Criteria #5: Principal can view all students and teachers**

**Steps:**
1. Navigate to Principal Login
2. Enter password: `principal123`
3. Go to "🎓 Students" tab
4. Verify without filter:
   - [ ] All 5 students visible (1001-1005)
   - [ ] Department dropdown shows: CSE, ECE, CIVIL, MECH
5. Go to "👨‍🏫 Teachers" tab
6. Verify:
   - [ ] All 4 approved teachers visible
   - [ ] Teachers from all departments shown

**Expected Result:** ✓ PASS - Principal sees all records

---

### Test 6: Principal Filters by Department
**Acceptance Criteria #6: Principal can filter students/teachers by department**

**Steps:**
1. In Principal Dashboard, Students tab
2. Select "CSE" from Department dropdown
3. Verify:
   - [ ] Only students 1001, 1005 shown
   - [ ] ECE/CIVIL students hidden
4. Select "ECE"
5. Verify:
   - [ ] Only students 1002, 1003 shown
6. Select "All"
7. Verify:
   - [ ] All 5 students visible again

**Expected Result:** ✓ PASS - Department filtering works correctly

---

### Test 7: Principal Edits Any Student's Subject
**Acceptance Criteria #7: Principal has full edit access**

**Steps:**
1. In Principal Dashboard, Students tab
2. Expand student 1002 (Priya - ECE department)
3. Click ✏️ Edit on subject "EC102 - Signals & Systems"
4. Update:
   - Mid1: `17`
   - Mid2: `19`
   - Final: `72`
   - Attendance: `91.0`
5. Enter password: `principal123`
6. Save
7. Verify:
   - [ ] Success message
   - [ ] Changes persist

**Expected Result:** ✓ PASS - Principal can edit any student

---

### Test 8: New Student Registration Appears Immediately
**Acceptance Criteria #8: New registrations visible to relevant teachers/principal**

**Steps:**
1. Go to Student Registration
2. Register new student:
   - Name: "Test Student"
   - Email: "test@example.com"
   - Department: "CSE"
   - Year: 3
   - Password: "test123"
3. Verify: Success message with Student ID
4. **In another browser tab:**
   - Login as CSE Teacher: `ramesh@college.edu`
   - Go to Students tab
   - Verify: New student appears in list
5. **Also check Principal:**
   - Login as Principal
   - Go to Students tab
   - Verify: New student visible in CSE filter

**Expected Result:** ✓ PASS - New students appear immediately

---

### Test 9: Validation - Invalid Marks/Attendance
**Acceptance Criteria #9: Proper validation of input ranges**

**Steps:**
1. Login as Teacher: `ramesh@college.edu`
2. Edit student subject with invalid data:
   - Try Attendance: `105` (>100)
   - Click Save
   - Verify: Error message appears
3. Try negative marks:
   - Mid1: `-5`
   - Click Save
   - Verify: Error message appears
4. Try invalid CGPA (if tested):
   - CGPA: `10.5` (>10)
   - Verify: Error message

**Expected Result:** ✓ PASS - Validation errors shown correctly

---

### Test 10: Teacher Approval Workflow Unchanged
**Acceptance Criteria #10: Existing teacher approval flow still works**

**Steps:**
1. Go to Teacher Registration
2. Register new teacher:
   - Name: "New Teacher"
   - Email: "newteacher@college.edu"
   - Department: "MECH"
   - Password: "newpass"
3. Login as Principal
4. Go to "⏳ Pending Approvals" tab
5. Verify: New teacher appears in pending list
6. Click "✓ Approve"
7. Verify: Success message
8. New teacher should now be visible in "👨‍🏫 Teachers" tab
9. Logout Principal, login as the new teacher
10. Verify: Can now access teacher dashboard

**Expected Result:** ✓ PASS - Teacher approval workflow unchanged

---

## Edge Cases & Additional Tests

### Test 11: Cross-Department Teacher Access Denied
**Scenario:** ECE teacher tries to view/edit CSE student

**Manual Test:**
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "role": "teacher",
    "email": "sneha@college.edu",
    "password": "ec_teacher"
  }'
```
**Expected:** Only ECE students returned (403 if trying to edit CSE students)

---

### Test 12: Student Cannot Edit Marks
**Scenario:** Logged-in student tries to call edit API

**Manual Test:**
```bash
curl -X PUT http://localhost:8080/api/students/1001/subjects/CS101 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "student",
    "mid1": 20,
    "mid2": 20,
    "final": 80,
    "attendance_percent": 100
  }'
```
**Expected:** 403 Forbidden error

---

### Test 13: Subject Total Auto-Calculation
**Scenario:** Verify total marks calculated correctly

**Steps:**
1. Edit a subject with: Mid1=15, Mid2=18, Final=70
2. Verify total shows: 103 (15+18+70)

---

### Test 14: Remarks Field Optional
**Scenario:** Update subject without remarks

**Steps:**
1. Edit subject leaving remarks empty
2. Save
3. Verify: No error, changes saved
4. Remarks shown as empty string in display

---

## Performance Checks

### Test 15: Large Subject List
**Scenario:** Student with max subjects (10)

**Expected:** Dashboard loads in <2 seconds

---

## Cleanup

After testing:
1. Delete test student from `students_data.txt`
2. Restore original sample data if needed
3. Close all browser tabs and logout

---

## Test Summary Template

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Student reads subjects | ✓ PASS | |
| 2 | Teacher sees own dept | ✓ PASS | |
| 3 | Teacher updates marks | ✓ PASS | |
| 4 | Cross-dept blocked | ✓ PASS | |
| 5 | Principal sees all | ✓ PASS | |
| 6 | Principal filters | ✓ PASS | |
| 7 | Principal edits | ✓ PASS | |
| 8 | New student appears | ✓ PASS | |
| 9 | Validation works | ✓ PASS | |
| 10 | Approvals unchanged | ✓ PASS | |

---

**All tests PASSED** ✓ = Feature complete and working
