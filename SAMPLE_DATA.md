# Sample Data for Testing

This file contains sample data that can be used to test the new per-subject features.

## Copy to students_data.txt

Replace the contents of `backend/students_data.txt` with the following sample data:

```
STUDENT|1001|Arun Kumar|arun|arun123@gmail.com|CSE|2|1|8.50|92.00
  SUBJECT|CS101|Data Structures|18|20|72|92.00|Good grasp of concepts
  SUBJECT|CS102|Database Management|19|18|75|88.50|Needs improvement in SQL queries
  SUBJECT|CS103|Web Development|20|20|80|95.00|Excellent progress
  SUBJECT|CS104|Operating Systems|17|19|70|90.00|
STUDENT|1002|Priya Sharma|priya|priya@gmail.com|ECE|2|1|7.80|87.00
  SUBJECT|EC101|Circuits & Networks|17|19|68|85.00|
  SUBJECT|EC102|Signals & Systems|16|17|70|90.00|Strong foundation in theory
  SUBJECT|EC103|Digital Systems|18|18|72|88.00|Good practical skills
STUDENT|1003|Krupanka R|krupa|krupankaramesha@gmail.com|ECE|2|1|8.20|91.00
  SUBJECT|EC101|Circuits & Networks|19|20|78|93.00|Excellent understanding
  SUBJECT|EC102|Signals & Systems|18|19|75|89.00|
  SUBJECT|EC103|Digital Systems|19|18|76|92.00|Very good
STUDENT|1004|Rajesh Singh|rajesh|rajesh@gmail.com|CIVIL|2|1|7.50|84.00
  SUBJECT|CV101|Structural Analysis|16|18|65|82.00|
  SUBJECT|CV102|Fluid Mechanics|15|17|68|80.00|Needs more focus
  SUBJECT|CV103|Construction Materials|17|19|70|88.00|Good practical knowledge
STUDENT|1005|Anjali Verma|anjali|anjali@gmail.com|CSE|1|1|8.00|90.00
  SUBJECT|CS101|Data Structures|18|19|74|91.00|
  SUBJECT|CS102|Database Management|17|18|73|89.00|
```

## Copy to teachers_data.txt

Replace the contents of `backend/teachers_data.txt` with:

```
TEACHER|2001|Dr. Ramesh Kumar|cse_teacher|ramesh@college.edu|CSE|1|2025-01-01 10:00:00
TEACHER|2002|Prof. Sneha Patel|ec_teacher|sneha@college.edu|ECE|1|2025-01-01 10:00:00
TEACHER|2003|Dr. Vikram Singh|civil_teacher|vikram@college.edu|CIVIL|1|2025-01-01 10:00:00
TEACHER|2004|Prof. Neha Gupta|pending_teacher|neha@college.edu|MECH|0|
```

## Copy to system_meta.txt

```
1006|2005|3001
```

## Testing Accounts

### Teachers (Use email and password for login)

| Department | Email | Password | Status |
|------------|-------|----------|--------|
| CSE | ramesh@college.edu | cse_teacher | Approved |
| ECE | sneha@college.edu | ec_teacher | Approved |
| CIVIL | vikram@college.edu | civil_teacher | Approved |
| MECH | neha@college.edu | pending_teacher | Pending Approval |

### Students (Use ID and password for login)

| ID | Name | Department | Password | CGPA |
|----|------|-----------|----------|------|
| 1001 | Arun Kumar | CSE | arun | 8.50 |
| 1002 | Priya Sharma | ECE | priya | 7.80 |
| 1003 | Krupanka R | ECE | krupa | 8.20 |
| 1004 | Rajesh Singh | CIVIL | rajesh | 7.50 |
| 1005 | Anjali Verma | CSE | anjali | 8.00 |

### Principal

- Password: `principal123`

## Test Scenarios

1. **Login as CSE Teacher (ramesh@college.edu / cse_teacher)**
   - Should see students 1001, 1005 (CSE department only)
   - Should be able to edit their subjects
   - Should NOT see ECE/CIVIL students

2. **Login as Student 1001**
   - Should see own subjects (CS101-CS104)
   - Should see per-subject marks and attendance
   - Should NOT have edit button (read-only)

3. **Login as Principal**
   - Should see all students and teachers
   - Department dropdown should show: CSE, ECE, CIVIL, MECH
   - Selecting "CSE" should show only students 1001, 1005
   - Should be able to edit any student's subjects
