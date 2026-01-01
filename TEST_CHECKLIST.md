# Manage Subjects Modal - Quick Test Checklist

## ✅ System Status
- [x] Backend (C Server) Running on Port 8080
- [x] Frontend (React) Running on Port 3000
- [x] ManageSubjectsModal.js Fixed and Compiled
- [x] All Three API Endpoints Ready

## 🧪 Quick Test Steps

### Prerequisites
1. Open browser at http://localhost:3000
2. Wait for React app to load

### Test 1: Login as Teacher
- [ ] Click "Teacher Login" 
- [ ] Email: `john@example.com`
- [ ] Password: `teacher123`
- [ ] Click Login - should see "Students" and "Approvals" tabs

### Test 2: Access Students List
- [ ] Click "Students" tab
- [ ] Should see list of students
- [ ] Each student card has "📚 Manage Subjects" button

### Test 3: Open Manage Subjects Modal
- [ ] Click any "📚 Manage Subjects" button
- [ ] Modal should appear with:
  - [x] Modal title showing student name
  - [x] Two tabs: "➕ Assign Subject" and "📊 Edit Subjects & Academics"
  - [x] Form fields visible in first tab

### Test 4: Assign a Subject
- [ ] Stay on "➕ Assign Subject" tab
- [ ] Enter test data:
  - Subject ID: `CS201`
  - Subject Name: `Database Systems`
  - Mid 1: `18`
  - Mid 2: `20`
  - Final: `38`
  - Attendance %: `88`
- [ ] Click "✓ Assign Subject"
- [ ] Should see: "Subject assigned successfully!" message
- [ ] Message should disappear after 3 seconds

### Test 5: Verify Subject in Edit Tab
- [ ] Click "📊 Edit Subjects & Academics" tab
- [ ] Should see the newly assigned subject in table:
  - Subject ID column shows `CS201`
  - Name column shows `Database Systems`
  - Mid1, Mid2, Final columns show correct marks
  - Attendance shows `88`

### Test 6: Edit Existing Subject
- [ ] In the table, click "✎ Edit" button on your test subject
- [ ] Input fields become editable (white background)
- [ ] Change Mid1 from `18` to `19`
- [ ] Click "Save" button
- [ ] Should see: "Subject updated successfully!" message
- [ ] Table should refresh with new mark: `19`

### Test 7: Update Overall Academics
- [ ] Still in "📊 Edit Subjects & Academics" tab
- [ ] Scroll down to "Overall Academic Performance" section
- [ ] See two input fields: "CGPA (0-10)" and "Overall Attendance %"
- [ ] Enter:
  - CGPA: `8.75`
  - Overall Attendance %: `90`
- [ ] Click "💾 Save Academic Info"
- [ ] Should see: "Academics updated successfully!" message

### Test 8: Close Modal and Reopen
- [ ] Click "✕ Close" button
- [ ] Modal disappears
- [ ] Click "📚 Manage Subjects" again on same student
- [ ] Modal reopens with all previously entered data:
  - [x] Subject visible in table
  - [x] CGPA field shows `8.75`
  - [x] Attendance field shows `90`

### Test 9: Try as Principal
- [ ] Logout or open new incognito window
- [ ] Go to http://localhost:3000
- [ ] Click "Principal Login"
- [ ] Email: `principal@admin.com`
- [ ] Password: `principal123`
- [ ] Repeat Tests 2-8 with principal account
- [ ] Should have access to ALL students (not just department)

## 📋 Detailed Checks

### Data Validation
- [ ] Cannot enter negative marks
- [ ] Cannot enter attendance > 100%
- [ ] Cannot enter CGPA > 10
- [ ] Empty required fields show error message

### Error Handling
- [ ] If backend is down, error message appears
- [ ] If network fails, error message appears
- [ ] Closing error message dismisses it

### Visual Feedback
- [ ] Buttons are disabled while saving ("Loading..." text)
- [ ] Success messages are green
- [ ] Error messages are red
- [ ] Loading indicators appear during API calls

## 🔧 Troubleshooting

### If Modal Won't Open
1. Check browser console (F12 → Console)
2. Look for JavaScript errors
3. Check Network tab for failed API calls
4. Verify backend is responding

### If Data Doesn't Save
1. Check browser console for error messages
2. Check Network tab for API response
3. Verify backend port 8080 is accessible
4. Check backend logs for errors

### If Subject Doesn't Appear
1. Close and reopen modal
2. Refresh page
3. Check if subject was actually saved (check Network tab response)

## 📊 Performance Notes

- First load may take 1-2 seconds while fetching student data
- Subject list scrolls if > 5 subjects assigned
- Marks should update instantly on Save
- No page refresh needed after changes

## 🎯 Success Criteria

All tests PASS when:
- ✅ Modal opens without errors
- ✅ Subjects can be assigned
- ✅ Subjects appear in table immediately after assignment
- ✅ Subjects can be edited
- ✅ CGPA and attendance can be updated
- ✅ All data persists when modal is reopened
- ✅ No JavaScript errors in console
- ✅ Works for both teacher and principal accounts

