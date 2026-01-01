# Database Schema & Migration Guide

## Schema Changes

### Students Table Structure (students_data.txt)

**Previous format:**
```
STUDENT|studentId|name|password|email|department|year|cgpa|attendance
```

**New format:**
```
STUDENT|studentId|name|password|email|department|year|semester|cgpa|attendance
  SUBJECT|subjectId|name|mid1|mid2|final|attendance_percent|remarks
  SUBJECT|subjectId|name|mid1|mid2|final|attendance_percent|remarks
...
```

**Note:** Subjects are now nested under students with indentation. Each SUBJECT line belongs to the student declared in the preceding STUDENT line.

### Key Additions

1. **Student struct** - Added `semester` field and `subjects[]` array with max 10 subjects per student
2. **Subject struct** - New structure with fields:
   - `subjectId`: Course code (e.g., "CS101")
   - `name`: Subject name
   - `mid1`, `mid2`, `final`: Mark values
   - `attendance_percent`: Attendance percentage (0-100)
   - `remarks`: Optional teacher comments

## Migration Steps

### For Existing Data

If you have existing student data without subjects, the system will automatically handle it on first load:
- Existing students will be loaded with `subjectCount = 0`
- No subjects will be displayed until added via the API
- Semester defaults to 1

### Initialize Sample Data

To add subjects to existing students, you can:

1. **Via API** - POST/PUT endpoints (recommended)
2. **Manual file editing** - Edit `students_data.txt` directly

### Example: Adding Subjects via File

Edit `students_data.txt` to add subjects to a student:

```
STUDENT|1001|John Doe|pass123|john@example.com|CSE|2|1|8.50|92.00
  SUBJECT|CS101|Data Structures|18|20|72|92.00|Good understanding
  SUBJECT|CS102|Database Systems|19|18|75|88.50|Needs improvement in SQL
  SUBJECT|CS103|Web Development|20|20|80|95.00|Excellent progress
STUDENT|1002|Jane Smith|pass456|jane@example.com|ECE|1|1|7.80|87.00
  SUBJECT|EC101|Circuits|17|19|68|85.00|
  SUBJECT|EC102|Signals|16|17|70|90.00|Strong foundation
```

## API Integration

### PUT Endpoint to Add Subject Marks

```bash
curl -X PUT http://localhost:8080/api/students/1001/subjects/CS101 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "principal",
    "principalPassword": "principal123",
    "mid1": 18,
    "mid2": 20,
    "final": 72,
    "attendance_percent": 92.0,
    "remarks": "Good understanding of concepts"
  }'
```

## Data File Location

- Backend data directory: `./backend/`
- Student data: `students_data.txt`
- Teachers data: `teachers_data.txt`
- System metadata: `system_meta.txt`

## Backward Compatibility

The system is backward compatible with the old format:
- Old files without semester field will load correctly (semester defaults to 1)
- Subjects are optional; students without subjects simply have empty subject lists
- No data loss during upgrade

## Best Practices

1. **Backup** - Always backup `students_data.txt` before modifications
2. **Format** - Use tab characters for file alignment (optional but recommended)
3. **Validation** - Use API endpoints for validation; manual file edits bypass validation
4. **Marks Range** - Keep marks within reasonable ranges (0-30 for mid exams, 0-40 for finals, etc.)
5. **Attendance** - Keep attendance between 0-100 (decimal values allowed)
