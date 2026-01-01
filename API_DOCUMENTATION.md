# API Documentation - Per-Subject Features

## New & Modified Endpoints

### GET /api/students/:id
**Get full student data including subjects**

**URL:** `GET http://localhost:8080/api/students/1001`

**Headers:**
```
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": 1001,
  "studentId": 1001,
  "name": "Arun Kumar",
  "email": "arun123@gmail.com",
  "department": "CSE",
  "year": 2,
  "semester": 1,
  "cgpa": 8.50,
  "attendance": 92.00,
  "attendance_percent": 92.00,
  "subjects": [
    {
      "subjectId": "CS101",
      "name": "Data Structures",
      "marks": {
        "mid1": 18,
        "mid2": 20,
        "final": 72,
        "total": 110
      },
      "attendance_percent": 92.00,
      "remarks": "Good grasp of concepts"
    },
    {
      "subjectId": "CS102",
      "name": "Database Management",
      "marks": {
        "mid1": 19,
        "mid2": 18,
        "final": 75,
        "total": 112
      },
      "attendance_percent": 88.50,
      "remarks": "Needs improvement in SQL queries"
    }
  ]
}
```

---

### PUT /api/students/:id/subjects/:subjectId
**Update subject marks and attendance for a student**

**URL:** `PUT http://localhost:8080/api/students/1001/subjects/CS101`

**Headers:**
```
Content-Type: application/json
```

**Request Body - Teacher:**
```json
{
  "role": "teacher",
  "email": "ramesh@college.edu",
  "password": "cse_teacher",
  "mid1": 18,
  "mid2": 20,
  "final": 72,
  "attendance_percent": 92.0,
  "remarks": "Excellent understanding of data structures"
}
```

**Request Body - Principal:**
```json
{
  "role": "principal",
  "principalPassword": "principal123",
  "mid1": 18,
  "mid2": 20,
  "final": 72,
  "attendance_percent": 92.0,
  "remarks": "Updated by principal"
}
```

**Response (200 OK):**
```json
{
  "message": "Subject updated",
  "subjectId": "CS101",
  "marks": {
    "mid1": 18,
    "mid2": 20,
    "final": 72,
    "total": 110
  },
  "attendance_percent": 92.0
}
```

**Error Responses:**

- **403 Forbidden** - Teacher trying to update student from different department:
```json
{
  "error": "Forbidden: insufficient role or department mismatch"
}
```

- **400 Bad Request** - Invalid marks/attendance:
```json
{
  "error": "Validation failed: marks must be non-negative, attendance 0-100"
}
```

---

### GET /api/students?role=X&department=Y
**Get students list with role-based filtering**

**URL:** `GET http://localhost:8080/api/students`

**Method:** `POST` (for query parameters, send in body)

**Request Body - Teacher:**
```json
{
  "role": "teacher",
  "department": "CSE",
  "email": "ramesh@college.edu"
}
```

**Request Body - Principal:**
```json
{
  "role": "principal",
  "department": "CSE"
}
```

**Request Body - Student (self only):**
```json
{
  "role": "student",
  "studentId": 1001
}
```

**Response (200 OK):**
```json
[
  {
    "studentId": 1001,
    "name": "Arun Kumar",
    "email": "arun123@gmail.com",
    "department": "CSE",
    "year": 2,
    "cgpa": 8.50,
    "attendance": 92.00
  },
  {
    "studentId": 1005,
    "name": "Anjali Verma",
    "email": "anjali@gmail.com",
    "department": "CSE",
    "year": 1,
    "cgpa": 8.00,
    "attendance": 90.00
  }
]
```

**Authorization Rules:**
- **TEACHER**: Returns only students from teacher's department. `department` param is ignored (server-enforced).
- **PRINCIPAL**: Returns students from specified department, or all if no department specified.
- **STUDENT**: Returns only the student's own data if studentId matches, else 403.

---

### GET /api/teachers?department=X
**Get approved teachers with optional department filter**

**URL:** `GET http://localhost:8080/api/teachers?department=CSE`

**OR** `POST http://localhost:8080/api/teachers` with body:
```json
{
  "department": "CSE",
  "principalPassword": "principal123"
}
```

**Response (200 OK):**
```json
[
  {
    "teacherId": 2001,
    "name": "Dr. Ramesh Kumar",
    "email": "ramesh@college.edu",
    "department": "CSE"
  }
]
```

**Note:** Only returns approved teachers (approved=1).

---

## Authorization Checks

### Role-Based Access Control

| Endpoint | STUDENT | TEACHER | PRINCIPAL |
|----------|---------|---------|-----------|
| GET /api/students/:id (own) | ✓ | ✓ (same dept) | ✓ |
| PUT /api/students/:id/subjects/:id | ✗ | ✓ (same dept) | ✓ |
| GET /api/students (list) | ✓ (self) | ✓ (own dept) | ✓ (all) |
| GET /api/teachers | - | - | ✓ |

### HTTP Status Codes

- **200 OK** - Success
- **201 Created** - New resource created
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Missing/invalid auth
- **403 Forbidden** - Insufficient permissions or department mismatch
- **404 Not Found** - Resource not found

---

## cURL Examples

### Example 1: Student views own subjects
```bash
curl -X GET http://localhost:8080/api/students/1001
```

### Example 2: Teacher updates a student's subject marks
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
    "attendance_percent": 92.5,
    "remarks": "Excellent performance"
  }'
```

### Example 3: Principal gets all CSE students
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "role": "principal",
    "department": "CSE"
  }'
```

### Example 4: Principal gets all CSE teachers
```bash
curl -X GET "http://localhost:8080/api/teachers?department=CSE"
```

### Example 5: Principal edits principal-level student data
```bash
curl -X PUT http://localhost:8080/api/students/1001/academics \
  -H "Content-Type: application/json" \
  -d '{
    "role": "principal",
    "principalPassword": "principal123",
    "cgpa": 8.75,
    "attendance_percent": 93.0
  }'
```

---

## Data Validation Rules

| Field | Type | Min | Max | Notes |
|-------|------|-----|-----|-------|
| mid1 | integer | 0 | 30 | Optional max, server accepts any non-negative |
| mid2 | integer | 0 | 30 | Optional max, server accepts any non-negative |
| final | integer | 0 | 40 | Optional max, server accepts any non-negative |
| attendance_percent | decimal | 0 | 100 | Strict range enforcement |
| remarks | string | 0 | 200 | Optional field |
| cgpa | decimal | 0 | 10 | Strict range enforcement |

---

## Response Format

All endpoints return JSON with:
- **Success**: `{ "message": "...", data_fields... }`
- **Error**: `{ "error": "..." }`

No HTTP response bodies on OPTIONS requests (CORS preflight).
