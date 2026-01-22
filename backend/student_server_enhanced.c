/*
* Student Management REST API Server - Enhanced Multi-Role Version
* Features: Admin, Principal, Teacher, and Student roles
*           Teacher registration with Principal approval
*           Role-based access control
* Compile: gcc -o student_server student_server_enhanced.c -lws2_32
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <time.h>

#pragma comment(lib, "ws2_32.lib")

#define PORT 8080
#define BUFFER_SIZE 8192
#define ADMIN_PASSWORD "admin123"
#define PRINCIPAL_PASSWORD "principal123"
#define TEACHER_PASSWORD "teacher123"
#define DEFAULT_STUDENT_PASSWORD "student123"

// Subject structure for per-subject marks and attendance
typedef struct {
    char subjectId[20];
    char name[100];
    int mid1;
    int mid2;
    int final;
    double attendance_percent;
    char remarks[200];
} Subject;

typedef struct {
    int studentId;
    char name[100];
    char password[100];
    char email[120];
    char department[80];
    int year;
    int semester;
    double cgpa;
    double attendance;
    // Per-subject data
    Subject subjects[10];  // max 10 subjects per student
    int subjectCount;
    struct Student* next;
} Student;

typedef struct {
    int teacherId;
    char name[100];
    char password[100];
    char email[120];
    char department[80];
    int approved;
    char approvalDate[50];
    struct Teacher* next;
} Teacher;

typedef struct {
    int principalId;
    char name[100];
    char password[100];
    char email[120];
    struct Principal* next;
} Principal;

typedef struct {
    Student* students;
    Teacher* teachers;
    Principal* principals;
    int nextStudentId;
    int nextTeacherId;
    int nextPrincipalId;
} SystemData;

SystemData g_system = {NULL, NULL, NULL, 1001, 2001, 3001};

// Function prototypes
void initSystem();
void loadFromFile();
void saveToFile();
Student* findStudent(int id);
Teacher* findTeacher(int id);
Teacher* findTeacherByEmail(char* email);
Principal* findPrincipal(int id);
void handleRequest(SOCKET client, char* request);
void sendResponse(SOCKET client, int status, const char* body);
void sendCORSHeaders(SOCKET client);
void parseJSON(char* json, char* key, char* value);
double parseJSONNumber(char* json, char* key);
int parseJSONInt(char* json, char* key);
void getCurrentTimestamp(char* buffer);
void subjectsToJSON(Subject* subjects, int count, char* output);
Subject* findStudentSubject(Student* s, char* subjectId);

int main() {
    WSADATA wsa;
    SOCKET server_sock, client_sock;
    struct sockaddr_in server, client;
    int c, size;
    char buffer[BUFFER_SIZE];

    printf("=========================================\n");
    printf("  Enhanced Student Management System\n");
    printf("=========================================\n");
    printf("Default Credentials:\n");
    printf("  Admin:     password = admin123\n");
    printf("  Principal: password = principal123\n");
    printf("  Teacher:   password = teacher123\n");
    printf("  Student:   password = student123\n");
    printf("=========================================\n\n");

    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("WSAStartup failed\n");
        return 1;
    }

    initSystem();
    loadFromFile();

    if ((server_sock = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET) {
        printf("Socket creation failed\n");
        return 1;
    }

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(PORT);

    if (bind(server_sock, (struct sockaddr*)&server, sizeof(server)) == SOCKET_ERROR) {
        printf("Bind failed\n");
        return 1;
    }

    listen(server_sock, 3);
    printf("Server running on http://localhost:%d\n\n", PORT);

    c = sizeof(struct sockaddr_in);
    while ((client_sock = accept(server_sock, (struct sockaddr*)&client, &c)) != INVALID_SOCKET) {
        size = recv(client_sock, buffer, BUFFER_SIZE - 1, 0);
        if (size > 0) {
            buffer[size] = '\0';
            
            // Check if we need to read more (simple handling for split packets)
            char* body_start = strstr(buffer, "\r\n\r\n");
            if (body_start && strlen(body_start + 4) == 0) {
                 char* cl = strstr(buffer, "Content-Length: ");
                 if (cl) {
                     int content_len = atoi(cl + 16);
                     if (content_len > 0) {
                         int received = recv(client_sock, buffer + size, BUFFER_SIZE - 1 - size, 0);
                         if (received > 0) {
                             size += received;
                             buffer[size] = '\0';
                         }
                     }
                 }
            }
            
            handleRequest(client_sock, buffer);
        }
        closesocket(client_sock);
    }

    closesocket(server_sock);
    WSACleanup();
    return 0;
}

void initSystem() {
    g_system.students = NULL;
    g_system.teachers = NULL;
    g_system.principals = NULL;
    g_system.nextStudentId = 1001;
    g_system.nextTeacherId = 2001;
    g_system.nextPrincipalId = 3001;
}

void handleRequest(SOCKET client, char* request) {
    char method[10], path[256];
    sscanf(request, "%s %s", method, path);

    printf("[%s] %s\n", method, path);

    if (strcmp(method, "OPTIONS") == 0) {
        sendCORSHeaders(client);
        return;
    }

    char* body_start = strstr(request, "\r\n\r\n");
    char body[BUFFER_SIZE] = {0};
    if (body_start) {
        strcpy(body, body_start + 4);
    }

    // Admin login
    if (strcmp(method, "POST") == 0 && strcmp(path, "/api/admin/login") == 0) {
        char password[100];
        parseJSON(body, "password", password);
        if (strcmp(password, ADMIN_PASSWORD) == 0) {
            sendResponse(client, 200, "{\"success\":true,\"role\":\"admin\",\"message\":\"Admin login successful\"}");
            printf("  ✓ Admin login successful\n");
        } else {
            sendResponse(client, 401, "{\"error\":\"Invalid admin password\"}");
        }
        return;
    }

    // Principal login
    if (strcmp(method, "POST") == 0 && strcmp(path, "/api/principal/login") == 0) {
        char password[100];
        parseJSON(body, "password", password);
        if (strcmp(password, PRINCIPAL_PASSWORD) == 0) {
            char resp[512];
            sprintf(resp, "{\"success\":true,\"role\":\"principal\",\"principalId\":3001,\"message\":\"Principal login successful\"}");
            sendResponse(client, 200, resp);
            printf("  ✓ Principal login successful\n");
        } else {
            sendResponse(client, 401, "{\"error\":\"Invalid principal password\"}");
        }
        return;
    }

    // Teacher login
    if (strcmp(method, "POST") == 0 && strcmp(path, "/api/teacher/login") == 0) {
        char email[120], password[100];
        parseJSON(body, "email", email);
        parseJSON(body, "password", password);

        Teacher* teacher = findTeacherByEmail(email);
        if (teacher && strcmp(teacher->password, password) == 0) {
            if (teacher->approved == 0) {
                sendResponse(client, 403, "{\"error\":\"Your account is pending principal approval\"}");
            } else if (teacher->approved == -1) {
                sendResponse(client, 403, "{\"error\":\"Your account has been rejected\"}");
            } else {
                char resp[512];
                sprintf(resp, "{\"success\":true,\"role\":\"teacher\",\"teacherId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"approved\":%d,\"password\":\"%s\"}",
                    teacher->teacherId, teacher->name, teacher->email, teacher->department, teacher->approved, teacher->password);
                sendResponse(client, 200, resp);
                printf("  ✓ Teacher login: %s\n", teacher->name);
            }
        } else {
            sendResponse(client, 401, "{\"error\":\"Invalid email or password\"}");
        }
        return;
    }

    // Get teacher by ID
    if (strcmp(method, "GET") == 0 && strstr(path, "/api/teacher/") == path) {
        int tid = 0;
        sscanf(path, "/api/teacher/%d", &tid);
        Teacher* t = findTeacher(tid);
        if (!t) {
            sendResponse(client, 404, "{\"error\":\"Teacher not found\"}");
            return;
        }
        char resp[512];
        sprintf(resp, "{\"teacherId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"approved\":%d}",
            t->teacherId, t->name, t->email, t->department, t->approved);
        sendResponse(client, 200, resp);
        return;
    }

    // Get teachers list (Principal can filter by department)
    if ((strcmp(method, "GET") == 0 || strcmp(method, "POST") == 0) && strncmp(path, "/api/teachers", 13) == 0) {
        char department[80] = "";
        char principalPassword[100] = "";
        
        // Parse query string or body
        char* query = strchr(path, '?');
        if (query != NULL) {
            char queryBuf[256];
            strncpy(queryBuf, query + 1, sizeof(queryBuf) - 1);
            queryBuf[sizeof(queryBuf) - 1] = '\0';
            if (strncmp(queryBuf, "department=", 11) == 0) {
                strncpy(department, queryBuf + 11, sizeof(department) - 1);
            }
        }
        
        // Also try parsing from JSON body
        parseJSON(body, "department", department);
        parseJSON(body, "principalPassword", principalPassword);

        // Optional: verify principal auth
        if (strlen(principalPassword) > 0 && strcmp(principalPassword, PRINCIPAL_PASSWORD) != 0) {
            sendResponse(client, 401, "{\"error\":\"Unauthorized\"}");
            return;
        }

        char resp[BUFFER_SIZE] = "[";
        Teacher* current = g_system.teachers;
        int first = 1;
        while (current != NULL) {
            int include = 0;
            if (strlen(department) == 0) {
                // No filter: include all approved teachers
                include = (current->approved == 1);
            } else {
                // Filter by department and approved status
                include = (current->approved == 1 && strcmp(current->department, department) == 0);
            }

            if (include) {
                char item[512];
                sprintf(item, "%s{\"teacherId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\"}",
                    first ? "" : ",", current->teacherId, current->name, current->email, current->department);
                strcat(resp, item);
                first = 0;
            }
            current = current->next;
        }
        strcat(resp, "]");
        sendResponse(client, 200, resp);
        printf("  ✓ Teachers fetched (filter: %s)\n", strlen(department) > 0 ? department : "none");
        return;
    }

    // Student login
    if (strcmp(method, "POST") == 0 && strcmp(path, "/api/student/login") == 0) {
        int studentId = parseJSONInt(body, "studentId");
        char password[100];
        parseJSON(body, "password", password);

        Student* student = findStudent(studentId);
        if (student && strcmp(student->password, password) == 0) {
            char resp[1024];
            sprintf(resp, "{\"success\":true,\"role\":\"student\",\"studentId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"year\":%d,\"cgpa\":%.2f,\"attendance\":%.2f}",
                student->studentId, student->name, student->email, student->department, student->year, student->cgpa, student->attendance);
            sendResponse(client, 200, resp);
            printf("  ✓ Student login: #%d\n", studentId);
        } else {
            sendResponse(client, 401, "{\"error\":\"Invalid student ID or password\"}");
        }
        return;
    }

    // Student registration
    if (strcmp(method, "POST") == 0 && strcmp(path, "/api/student/register") == 0) {
        char name[100], password[100], email[120], department[80];
        int year;
        parseJSON(body, "name", name);
        parseJSON(body, "password", password);
        parseJSON(body, "email", email);
        parseJSON(body, "department", department);
        year = parseJSONInt(body, "year");

        if (strlen(name) == 0 || strlen(password) < 4 || year < 1 || year > 6) {
            sendResponse(client, 400, "{\"error\":\"Invalid input\"}");
            return;
        }

        Student* stu = (Student*)malloc(sizeof(Student));
        stu->studentId = g_system.nextStudentId++;
        strcpy(stu->name, name);
        strcpy(stu->password, password);
        strcpy(stu->email, email);
        strcpy(stu->department, department);
        stu->year = year;
        stu->semester = 1;  // default semester
        stu->cgpa = 0.0;
        stu->attendance = 0.0;
        stu->subjectCount = 0;  // no subjects initially
        stu->next = g_system.students;
        g_system.students = stu;

        char resp[512];
        sprintf(resp, "{\"studentId\":%d,\"name\":\"%s\",\"message\":\"Registration successful\"}", stu->studentId, stu->name);
        sendResponse(client, 201, resp);
        saveToFile();
        printf("  ✓ Student registered: #%d\n", stu->studentId);
        return;
    }

    // Teacher registration (pending approval)
    if (strcmp(method, "POST") == 0 && strcmp(path, "/api/teacher/register") == 0) {
        char name[100], password[100], email[120], department[80];
        parseJSON(body, "name", name);
        parseJSON(body, "password", password);
        parseJSON(body, "email", email);
        parseJSON(body, "department", department);

        if (strlen(name) == 0 || strlen(password) < 4 || strlen(email) == 0) {
            sendResponse(client, 400, "{\"error\":\"Invalid input\"}");
            return;
        }

        if (findTeacherByEmail(email) != NULL) {
            sendResponse(client, 400, "{\"error\":\"Email already registered\"}");
            return;
        }

        Teacher* teacher = (Teacher*)malloc(sizeof(Teacher));
        teacher->teacherId = g_system.nextTeacherId++;
        strcpy(teacher->name, name);
        strcpy(teacher->password, password);
        strcpy(teacher->email, email);
        strcpy(teacher->department, department);
        teacher->approved = 0;
        strcpy(teacher->approvalDate, "");
        teacher->next = g_system.teachers;
        g_system.teachers = teacher;

        char resp[512];
        sprintf(resp, "{\"teacherId\":%d,\"message\":\"Registration submitted. Pending principal approval\"}", teacher->teacherId);
        sendResponse(client, 201, resp);
        saveToFile();
        printf("  ✓ Teacher registered (pending): #%d - %s\n", teacher->teacherId, teacher->name);
        return;
    }

    // Get pending teachers (Principal only)
    if (strcmp(method, "GET") == 0 && strcmp(path, "/api/principal/pending-teachers") == 0) {
        char resp[BUFFER_SIZE] = "[";
        Teacher* current = g_system.teachers;
        int first = 1;
        while (current != NULL) {
            if (current->approved == 0) {
                char item[512];
                sprintf(item, "%s{\"teacherId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\"}",
                    first ? "" : ",", current->teacherId, current->name, current->email, current->department);
                strcat(resp, item);
                first = 0;
            }
            current = current->next;
        }
        strcat(resp, "]");
        sendResponse(client, 200, resp);
        printf("  ✓ Retrieved pending teachers\n");
        return;
    }

    // Approve/Reject teacher
    if (strcmp(method, "POST") == 0 && strstr(path, "/api/principal/teachers/") && strstr(path, "/approve")) {
        int teacherId;
        sscanf(path, "/api/principal/teachers/%d/approve", &teacherId);
        char auth[100];
        int action;
        parseJSON(body, "password", auth);
        action = parseJSONInt(body, "action");

        if (strcmp(auth, PRINCIPAL_PASSWORD) != 0) {
            sendResponse(client, 401, "{\"error\":\"Unauthorized\"}");
            return;
        }

        Teacher* teacher = findTeacher(teacherId);
        if (!teacher) {
            sendResponse(client, 404, "{\"error\":\"Teacher not found\"}");
            return;
        }

        if (action == 1) {
            teacher->approved = 1;
            getCurrentTimestamp(teacher->approvalDate);
            sendResponse(client, 200, "{\"message\":\"Teacher approved\"}");
            printf("  ✓ Teacher approved: #%d\n", teacherId);
        } else {
            teacher->approved = -1;
            sendResponse(client, 200, "{\"message\":\"Teacher rejected\"}");
            printf("  ✓ Teacher rejected: #%d\n", teacherId);
        }
        saveToFile();
        return;
    }

    // Get student by ID (with subjects) - must come before list students
    if (strcmp(method, "GET") == 0 && strstr(path, "/api/students/") == path) {
        // Check if this is actually a single student request (has ID after /api/students/)
        char pathCopy[256];
        strncpy(pathCopy, path, sizeof(pathCopy) - 1);
        pathCopy[sizeof(pathCopy) - 1] = '\0';
        
        // Remove query string if present
        char* queryStart = strchr(pathCopy, '?');
        if (queryStart) *queryStart = '\0';
        
        // Check if there's a student ID (path is longer than just "/api/students")
        if (strlen(pathCopy) > 14) {  // "/api/students/" is 14 chars
            int studentId = 0;
            sscanf(path, "/api/students/%d", &studentId);
            Student* s = findStudent(studentId);
            if (!s) {
                sendResponse(client, 404, "{\"error\":\"Student not found\"}");
                return;
            }
            char subjectsJson[2048];
            subjectsToJSON(s->subjects, s->subjectCount, subjectsJson);
            char resp[4096];
            sprintf(resp, "{\"id\":%d,\"studentId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"year\":%d,\"semester\":%d,\"cgpa\":%.2f,\"attendance\":%.2f,\"attendance_percent\":%.2f,\"subjects\":%s}",
                s->studentId, s->studentId, s->name, s->email, s->department, s->year, s->semester, s->cgpa, s->attendance, s->attendance, subjectsJson);
            sendResponse(client, 200, resp);
            return;
        }
    }

    // Role-based student fetch (supports GET with query or POST with JSON)
    if ((strcmp(method, "GET") == 0 || strcmp(method, "POST") == 0) && (strcmp(path, "/api/students") == 0 || strstr(path, "/api/students?") == path)) {
        char role[50];
        char dept[80];
        char teacherEmail[120];
        char principalPassword[100];
        int studentIdFilter = 0;
        role[0] = '\0'; dept[0] = '\0'; teacherEmail[0] = '\0'; principalPassword[0] = '\0';

        // Parse JSON body first
        parseJSON(body, "role", role);
        parseJSON(body, "department", dept);
        parseJSON(body, "email", teacherEmail);
        parseJSON(body, "principalPassword", principalPassword);
        studentIdFilter = parseJSONInt(body, "studentId");

        // Fallback: parse query string for role/department if body was empty
        char* query = strchr(path, '?');
        if (query != NULL) {
            char queryBuf[256];
            strncpy(queryBuf, query + 1, sizeof(queryBuf) - 1);
            queryBuf[sizeof(queryBuf) - 1] = '\0';
            char* token = strtok(queryBuf, "&");
            while (token != NULL) {
                if (strncmp(token, "role=", 5) == 0 && strlen(role) == 0) {
                    strncpy(role, token + 5, sizeof(role) - 1);
                } else if (strncmp(token, "department=", 11) == 0 && strlen(dept) == 0) {
                    strncpy(dept, token + 11, sizeof(dept) - 1);
                }
                token = strtok(NULL, "&");
            }
        }

        if (strlen(role) == 0) {
            sendResponse(client, 400, "{\"error\":\"Role required\"}");
            return;
        }

        // Optional authorization for principal
        if (strcmp(role, "principal") == 0 && strlen(principalPassword) > 0 && strcmp(principalPassword, PRINCIPAL_PASSWORD) != 0) {
            sendResponse(client, 401, "{\"error\":\"Unauthorized\"}");
            return;
        }

        // Ensure teachers are approved before listing students
        if (strcmp(role, "teacher") == 0) {
            Teacher* t = NULL;
            if (strlen(teacherEmail) > 0) {
                t = findTeacherByEmail(teacherEmail);
            }
            if (t == NULL || t->approved != 1) {
                sendResponse(client, 403, "{\"error\":\"Forbidden: teacher not approved\"}");
                return;
            }
            if (strlen(dept) == 0 && t != NULL) {
                strncpy(dept, t->department, sizeof(dept) - 1);
            }
        }

        char resp[BUFFER_SIZE] = "[";
        Student* current = g_system.students;
        int first = 1;
        while (current != NULL) {
            int include = 0;
            if (strcmp(role, "student") == 0) {
                include = (studentIdFilter == 0 || current->studentId == studentIdFilter);
            } else if (strcmp(role, "teacher") == 0) {
                // Teacher sees only matching department
                include = (strlen(dept) > 0 && strcmp(current->department, dept) == 0);
            } else if (strcmp(role, "principal") == 0) {
                include = 1;
            }

            if (include) {
                char item[512];
                sprintf(item, "%s{\"studentId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"year\":%d,\"cgpa\":%.2f,\"attendance\":%.2f}",
                    first ? "" : ",", current->studentId, current->name, current->email, current->department, current->year, current->cgpa, current->attendance);
                strcat(resp, item);
                first = 0;
            }
            current = current->next;
        }
        strcat(resp, "]");
        sendResponse(client, 200, resp);
        printf("  ✓ Students fetched for role %s\n", role);
        return;
    }

    // Update subject marks and attendance (role-based)
    if (strcmp(method, "PUT") == 0 && strstr(path, "/api/students/") && strstr(path, "/subjects/")) {
        int studentId = 0;
        char subjectId[20];
        sscanf(path, "/api/students/%d/subjects/%19[^/]", &studentId, subjectId);
        
        Student* s = findStudent(studentId);
        if (!s) {
            sendResponse(client, 404, "{\"error\":\"Student not found\"}");
            return;
        }

        // Parse authorization
        char role[50], teacherEmail[120], teacherPassword[100], principalPassword[100];
        role[0] = '\0'; teacherEmail[0] = '\0'; teacherPassword[0] = '\0'; principalPassword[0] = '\0';
        parseJSON(body, "role", role);
        parseJSON(body, "email", teacherEmail);
        parseJSON(body, "password", teacherPassword);
        parseJSON(body, "principalPassword", principalPassword);

        int authorized = 0;
        char authError[256] = "";
        
        printf("  [DEBUG] Update Subject - Role: '%s', Email: '%s', Pass: '%s', PrincipalPass: '%s'\n", 
            role, teacherEmail, teacherPassword, principalPassword);
        
        if (strcmp(role, "teacher") == 0) {
            // Teacher must be from same department
            Teacher* t = findTeacherByEmail(teacherEmail);
            if (!t) {
                sprintf(authError, "{\"error\":\"Teacher not found with email: %s\"}", teacherEmail);
                printf("  [DEBUG] Teacher not found: %s\n", teacherEmail);
            } else {
                printf("  [DEBUG] Found teacher: %s, approved=%d, password=%s, dept=%s\n", 
                    t->name, t->approved, t->password, t->department);
                
                if (t->approved != 1) {
                    sprintf(authError, "{\"error\":\"Teacher not approved (status: %d)\"}", t->approved);
                } else if (strcmp(t->password, teacherPassword) != 0) {
                    strcpy(authError, "{\"error\":\"Invalid teacher password\"}");
                } else if (strcmp(t->department, s->department) != 0) {
                    sprintf(authError, "{\"error\":\"Department mismatch: teacher=%s, student=%s\"}", t->department, s->department);
                } else {
                    authorized = 1;
                }
            }
        } else if (strcmp(role, "principal") == 0) {
            // Principal can update any student
            printf("  [DEBUG] Checking principal password: '%s' vs '%s'\n", principalPassword, PRINCIPAL_PASSWORD);
            if (strcmp(principalPassword, PRINCIPAL_PASSWORD) == 0) {
                authorized = 1;
            } else {
                strcpy(authError, "{\"error\":\"Invalid principal password\"}");
            }
        } else {
            sprintf(authError, "{\"error\":\"Invalid role: %s\"}", role);
        }

        if (!authorized) {
            if (strlen(authError) == 0) {
                sendResponse(client, 403, "{\"error\":\"Forbidden: insufficient role or department mismatch\"}");
            } else {
                sendResponse(client, 403, authError);
            }
            printf("  ✗ Authorization failed for subject update: %s\n", authError);
            return;
        }

        // Find subject in student's subjects
        Subject* subj = findStudentSubject(s, subjectId);
        if (!subj) {
            sendResponse(client, 404, "{\"error\":\"Subject not found for this student\"}");
            return;
        }

        // Parse marks and attendance
        int mid1 = parseJSONInt(body, "mid1");
        int mid2 = parseJSONInt(body, "mid2");
        int final = parseJSONInt(body, "final");
        double attendance = parseJSONNumber(body, "attendance_percent");
        char remarks[200];
        parseJSON(body, "remarks", remarks);

        // Validation: marks should be non-negative
        if (mid1 < 0 || mid2 < 0 || final < 0 || attendance < 0.0 || attendance > 100.0) {
            sendResponse(client, 400, "{\"error\":\"Validation failed: marks must be non-negative, attendance 0-100\"}");
            return;
        }

        // Update subject
        subj->mid1 = mid1;
        subj->mid2 = mid2;
        subj->final = final;
        subj->attendance_percent = attendance;
        if (strlen(remarks) > 0) {
            strncpy(subj->remarks, remarks, sizeof(subj->remarks) - 1);
        }

        saveToFile();
        
        // Return updated subject
        char respBody[512];
        int total = subj->mid1 + subj->mid2 + subj->final;
        sprintf(respBody, "{\"message\":\"Subject updated\",\"subjectId\":\"%s\",\"marks\":{\"mid1\":%d,\"mid2\":%d,\"final\":%d,\"total\":%d},\"attendance_percent\":%.2f}",
            subj->subjectId, subj->mid1, subj->mid2, subj->final, total, subj->attendance_percent);
        sendResponse(client, 200, respBody);
        printf("  ✓ Subject updated for student #%d - %s\n", studentId, subjectId);
        return;
    }

    // Update student academics (role-based)
    if (strcmp(method, "PUT") == 0 && strstr(path, "/api/students/") == path && strstr(path, "/academics") != NULL) {
        int studentId = 0;
        sscanf(path, "/api/students/%d/academics", &studentId);
        Student* s = findStudent(studentId);
        if (!s) {
            sendResponse(client, 404, "{\"error\":\"Student not found\"}");
            return;
        }

        char role[50];
        char teacherEmail[120];
        char teacherPassword[100];
        char principalPassword[100];
        role[0] = '\0'; teacherEmail[0] = '\0'; teacherPassword[0] = '\0'; principalPassword[0] = '\0';
        parseJSON(body, "role", role);
        parseJSON(body, "email", teacherEmail);
        parseJSON(body, "password", teacherPassword);
        parseJSON(body, "principalPassword", principalPassword);

        int authorized = 0;
        char authError[256] = "";
        
        printf("  [DEBUG] Update Academics - Role: '%s', Email: '%s', Pass: '%s', PrincipalPass: '%s'\n", 
            role, teacherEmail, teacherPassword, principalPassword);
        
        if (strcmp(role, "teacher") == 0) {
            Teacher* t = findTeacherByEmail(teacherEmail);
            if (!t) {
                sprintf(authError, "{\"error\":\"Teacher not found with email: %s\"}", teacherEmail);
                printf("  [DEBUG] Teacher not found: %s\n", teacherEmail);
            } else {
                printf("  [DEBUG] Found teacher: %s, approved=%d, password=%s, dept=%s\n", 
                    t->name, t->approved, t->password, t->department);
                
                if (t->approved != 1) {
                    sprintf(authError, "{\"error\":\"Teacher not approved (status: %d)\"}", t->approved);
                } else if (strcmp(t->password, teacherPassword) != 0) {
                    strcpy(authError, "{\"error\":\"Invalid teacher password\"}");
                } else {
                    // ensure teacher can only update own department
                    Student* target = findStudent(studentId);
                    if (!target) {
                        strcpy(authError, "{\"error\":\"Student not found\"}");
                    } else if (strcmp(target->department, t->department) != 0) {
                        sprintf(authError, "{\"error\":\"Department mismatch: teacher=%s, student=%s\"}", t->department, target->department);
                    } else {
                        authorized = 1;
                    }
                }
            }
        } else if (strcmp(role, "principal") == 0) {
            printf("  [DEBUG] Checking principal password: '%s' vs '%s'\n", principalPassword, PRINCIPAL_PASSWORD);
            if (strcmp(principalPassword, PRINCIPAL_PASSWORD) == 0) {
                authorized = 1;
            } else {
                strcpy(authError, "{\"error\":\"Invalid principal password\"}");
            }
        } else {
            sprintf(authError, "{\"error\":\"Invalid role: %s\"}", role);
        }

        if (!authorized) {
            if (strlen(authError) == 0) {
                sendResponse(client, 403, "{\"error\":\"Forbidden: insufficient role\"}");
            } else {
                sendResponse(client, 403, authError);
            }
            printf("  ✗ Authorization failed for academics update: %s\n", authError);
            return;
        }

        double newCgpa = parseJSONNumber(body, "cgpa");
        double newAttendance = parseJSONNumber(body, "attendance_percent");
        if (newAttendance == 0.0) {
            // allow key 'attendance' as well
            newAttendance = parseJSONNumber(body, "attendance");
        }

        if (newCgpa < 0.0 || newCgpa > 10.0 || newAttendance < 0.0 || newAttendance > 100.0) {
            sendResponse(client, 400, "{\"error\":\"Validation failed: CGPA 0-10, Attendance 0-100\"}");
            return;
        }

        s->cgpa = newCgpa;
        s->attendance = newAttendance;
        saveToFile();
        char resp[256];
        sprintf(resp, "{\"message\":\"Academics updated\",\"cgpa\":%.2f,\"attendance_percent\":%.2f}", s->cgpa, s->attendance);
        sendResponse(client, 200, resp);
        printf("  ✓ Academics updated for student #%d by %s\n", studentId, strlen(role)?role:"unknown");
        return;
    }

    // Assign new subject to student (POST /api/students/:id/subjects)
    if (strcmp(method, "POST") == 0 && strstr(path, "/api/students/") && strstr(path, "/subjects") && !strstr(path, "/subjects/")) {
        int studentId = 0;
        sscanf(path, "/api/students/%d/subjects", &studentId);
        
        Student* s = findStudent(studentId);
        if (!s) {
            sendResponse(client, 404, "{\"error\":\"Student not found\"}");
            return;
        }

        // Parse authorization
        char role[50], teacherEmail[120], teacherPassword[100], principalPassword[100];
        role[0] = '\0'; teacherEmail[0] = '\0'; teacherPassword[0] = '\0'; principalPassword[0] = '\0';
        parseJSON(body, "role", role);
        parseJSON(body, "email", teacherEmail);
        parseJSON(body, "password", teacherPassword);
        parseJSON(body, "principalPassword", principalPassword);

        int authorized = 0;
        char authError[256] = "";
        
        printf("  [DEBUG] Assign Subject - Role: '%s', Email: '%s', Pass: '%s', PrincipalPass: '%s'\n", 
            role, teacherEmail, teacherPassword, principalPassword);
        
        if (strcmp(role, "teacher") == 0) {
            // Teacher must be from same department
            Teacher* t = findTeacherByEmail(teacherEmail);
            if (!t) {
                sprintf(authError, "{\"error\":\"Teacher not found with email: %s\"}", teacherEmail);
                printf("  [DEBUG] Teacher not found: %s\n", teacherEmail);
            } else {
                printf("  [DEBUG] Found teacher: %s, approved=%d, password=%s, dept=%s\n", 
                    t->name, t->approved, t->password, t->department);
                printf("  [DEBUG] Student dept=%s, Passwords match=%d\n", 
                    s->department, strcmp(t->password, teacherPassword) == 0);
                
                if (t->approved != 1) {
                    sprintf(authError, "{\"error\":\"Teacher not approved (status: %d)\"}", t->approved);
                } else if (strcmp(t->password, teacherPassword) != 0) {
                    strcpy(authError, "{\"error\":\"Invalid teacher password\"}");
                } else if (strcmp(t->department, s->department) != 0) {
                    sprintf(authError, "{\"error\":\"Department mismatch: teacher=%s, student=%s\"}", t->department, s->department);
                } else {
                    authorized = 1;
                }
            }
        } else if (strcmp(role, "principal") == 0) {
            // Principal can assign subjects to any student
            printf("  [DEBUG] Checking principal password: '%s' vs '%s'\n", principalPassword, PRINCIPAL_PASSWORD);
            if (strcmp(principalPassword, PRINCIPAL_PASSWORD) == 0) {
                authorized = 1;
            } else {
                strcpy(authError, "{\"error\":\"Invalid principal password\"}");
            }
        } else {
            sprintf(authError, "{\"error\":\"Invalid role: %s\"}", role);
        }

        if (!authorized) {
            if (strlen(authError) == 0) {
                sendResponse(client, 403, "{\"error\":\"Forbidden: insufficient role or department mismatch\"}");
            } else {
                sendResponse(client, 403, authError);
            }
            printf("  ✗ Authorization failed for subject assignment: %s\n", authError);
            return;
        }

        // Parse subject data
        char subjectId[20], name[100];
        subjectId[0] = '\0'; name[0] = '\0';
        parseJSON(body, "subjectId", subjectId);
        parseJSON(body, "name", name);

        if (strlen(subjectId) == 0 || strlen(name) == 0) {
            sendResponse(client, 400, "{\"error\":\"Validation failed: subjectId and name are required\"}");
            return;
        }

        // Check if subject already exists for this student
        Subject* existing = findStudentSubject(s, subjectId);
        if (existing != NULL) {
            sendResponse(client, 400, "{\"error\":\"Subject already assigned to this student\"}");
            return;
        }

        // Check capacity
        if (s->subjectCount >= 10) {
            sendResponse(client, 400, "{\"error\":\"Student can have maximum 10 subjects\"}");
            return;
        }

        // Parse marks and attendance
        int mid1 = parseJSONInt(body, "mid1");
        int mid2 = parseJSONInt(body, "mid2");
        int final = parseJSONInt(body, "final");
        double attendance = parseJSONNumber(body, "attendance_percent");

        // Validation
        if (mid1 < 0 || mid2 < 0 || final < 0 || attendance < 0.0 || attendance > 100.0) {
            sendResponse(client, 400, "{\"error\":\"Validation failed: marks must be non-negative, attendance 0-100\"}");
            return;
        }

        // Create new subject entry
        Subject* newSubj = &s->subjects[s->subjectCount];
        strncpy(newSubj->subjectId, subjectId, sizeof(newSubj->subjectId) - 1);
        strncpy(newSubj->name, name, sizeof(newSubj->name) - 1);
        newSubj->mid1 = mid1;
        newSubj->mid2 = mid2;
        newSubj->final = final;
        newSubj->attendance_percent = attendance;
        newSubj->remarks[0] = '\0';

        s->subjectCount++;
        saveToFile();

        // Return newly created subject
        char respBody[512];
        int total = newSubj->mid1 + newSubj->mid2 + newSubj->final;
        sprintf(respBody, "{\"message\":\"Subject assigned\",\"subjectId\":\"%s\",\"name\":\"%s\",\"marks\":{\"mid1\":%d,\"mid2\":%d,\"final\":%d,\"total\":%d},\"attendance_percent\":%.2f}",
            newSubj->subjectId, newSubj->name, newSubj->mid1, newSubj->mid2, newSubj->final, total, newSubj->attendance_percent);
        sendResponse(client, 201, respBody);
        printf("  ✓ Subject assigned to student #%d - %s\n", studentId, subjectId);
        return;
    }

    sendResponse(client, 404, "{\"error\":\"Endpoint not found\"}");
}

void sendResponse(SOCKET client, int status, const char* body) {
    char response[BUFFER_SIZE];
    const char* status_text = "OK";
    if (status == 201) status_text = "Created";
    else if (status == 400) status_text = "Bad Request";
    else if (status == 401) status_text = "Unauthorized";
    else if (status == 403) status_text = "Forbidden";
    else if (status == 404) status_text = "Not Found";

    sprintf(response,
        "HTTP/1.1 %d %s\r\n"
        "Content-Type: application/json\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n"
        "Content-Length: %d\r\n"
        "\r\n%s",
        status, status_text, (int)strlen(body), body);

    send(client, response, strlen(response), 0);
}

void sendCORSHeaders(SOCKET client) {
    char response[512];
    sprintf(response,
        "HTTP/1.1 200 OK\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n"
        "\r\n");
    send(client, response, strlen(response), 0);
}

Student* findStudent(int id) {
    Student* current = g_system.students;
    while (current) {
        if (current->studentId == id) return current;
        current = current->next;
    }
    return NULL;
}

Teacher* findTeacher(int id) {
    Teacher* current = g_system.teachers;
    while (current) {
        if (current->teacherId == id) return current;
        current = current->next;
    }
    return NULL;
}

Teacher* findTeacherByEmail(char* email) {
    Teacher* current = g_system.teachers;
    while (current) {
        if (strcmp(current->email, email) == 0) return current;
        current = current->next;
    }
    return NULL;
}

Principal* findPrincipal(int id) {
    Principal* current = g_system.principals;
    while (current) {
        if (current->principalId == id) return current;
        current = current->next;
    }
    return NULL;
}

void parseJSON(char* json, char* key, char* value) {
    value[0] = '\0';
    char search[110];
    sprintf(search, "\"%s\"", key);
    char* key_pos = strstr(json, search);
    if (key_pos) {
        char* colon = strchr(key_pos + strlen(search), ':');
        if (colon) {
            char* start = strchr(colon, '"');
            if (start) {
                start++; // Move past opening quote
                char* end = strchr(start, '"');
                if (end) {
                    int len = end - start;
                    if (len > 99) len = 99;
                    strncpy(value, start, len);
                    value[len] = '\0';
                }
            }
        }
    }
}

double parseJSONNumber(char* json, char* key) {
    char search[110];
    sprintf(search, "\"%s\"", key);
    char* key_pos = strstr(json, search);
    if (key_pos) {
        char* colon = strchr(key_pos + strlen(search), ':');
        if (colon) {
            return atof(colon + 1);
        }
    }
    return 0.0;
}

int parseJSONInt(char* json, char* key) {
    return (int)parseJSONNumber(json, key);
}

void getCurrentTimestamp(char* buffer) {
    time_t now = time(NULL);
    struct tm* t = localtime(&now);
    strftime(buffer, 50, "%Y-%m-%d %H:%M:%S", t);
}

// Convert subject array to JSON array string
void subjectsToJSON(Subject* subjects, int count, char* output) {
    strcpy(output, "[");
    for (int i = 0; i < count; i++) {
        if (i > 0) strcat(output, ",");
        char subjStr[512];
        int total = subjects[i].mid1 + subjects[i].mid2 + subjects[i].final;
        sprintf(subjStr, "{\"subjectId\":\"%s\",\"name\":\"%s\",\"mid1\":%d,\"mid2\":%d,\"final\":%d,\"total\":%d,\"attendance_percent\":%.2f,\"remarks\":\"%s\"}",
            subjects[i].subjectId, subjects[i].name, subjects[i].mid1, subjects[i].mid2, subjects[i].final, total, subjects[i].attendance_percent, subjects[i].remarks);
        strcat(output, subjStr);
    }
    strcat(output, "]");
}

// Find subject in student's subject array by subjectId
Subject* findStudentSubject(Student* s, char* subjectId) {
    for (int i = 0; i < s->subjectCount; i++) {
        if (strcmp(s->subjects[i].subjectId, subjectId) == 0) {
            return &s->subjects[i];
        }
    }
    return NULL;
}


void saveToFile() {
    FILE* f = fopen("database.json", "w");
    if (!f) {
        printf("Error: Cannot create database.json\n");
        return;
    }

    fprintf(f, "{\n");
    fprintf(f, "  \"nextStudentId\": %d,\n", g_system.nextStudentId);
    fprintf(f, "  \"nextTeacherId\": %d,\n", g_system.nextTeacherId);
    fprintf(f, "  \"nextPrincipalId\": %d,\n", g_system.nextPrincipalId);
    
    // Save students with subjects
    fprintf(f, "  \"students\": [\n");
    Student* s = g_system.students;
    int firstStudent = 1;
    while (s) {
        if (!firstStudent) fprintf(f, ",\n");
        firstStudent = 0;
        
        fprintf(f, "    {\n");
        fprintf(f, "      \"studentId\": %d,\n", s->studentId);
        fprintf(f, "      \"name\": \"%s\",\n", s->name);
        fprintf(f, "      \"password\": \"%s\",\n", s->password);
        fprintf(f, "      \"email\": \"%s\",\n", s->email);
        fprintf(f, "      \"department\": \"%s\",\n", s->department);
        fprintf(f, "      \"year\": %d,\n", s->year);
        fprintf(f, "      \"semester\": %d,\n", s->semester);
        fprintf(f, "      \"cgpa\": %.2f,\n", s->cgpa);
        fprintf(f, "      \"attendance\": %.2f,\n", s->attendance);
        fprintf(f, "      \"subjects\": [\n");
        
        for (int i = 0; i < s->subjectCount; i++) {
            if (i > 0) fprintf(f, ",\n");
            fprintf(f, "        {\n");
            fprintf(f, "          \"subjectId\": \"%s\",\n", s->subjects[i].subjectId);
            fprintf(f, "          \"name\": \"%s\",\n", s->subjects[i].name);
            fprintf(f, "          \"mid1\": %d,\n", s->subjects[i].mid1);
            fprintf(f, "          \"mid2\": %d,\n", s->subjects[i].mid2);
            fprintf(f, "          \"final\": %d,\n", s->subjects[i].final);
            fprintf(f, "          \"attendance_percent\": %.2f,\n", s->subjects[i].attendance_percent);
            fprintf(f, "          \"remarks\": \"%s\"\n", s->subjects[i].remarks);
            fprintf(f, "        }");
        }
        
        fprintf(f, "\n      ]\n");
        fprintf(f, "    }");
        s = s->next;
    }
    fprintf(f, "\n  ],\n");
    
    // Save teachers
    fprintf(f, "  \"teachers\": [\n");
    Teacher* t = g_system.teachers;
    int firstTeacher = 1;
    while (t) {
        if (!firstTeacher) fprintf(f, ",\n");
        firstTeacher = 0;
        
        fprintf(f, "    {\n");
        fprintf(f, "      \"teacherId\": %d,\n", t->teacherId);
        fprintf(f, "      \"name\": \"%s\",\n", t->name);
        fprintf(f, "      \"password\": \"%s\",\n", t->password);
        fprintf(f, "      \"email\": \"%s\",\n", t->email);
        fprintf(f, "      \"department\": \"%s\",\n", t->department);
        fprintf(f, "      \"approved\": %d,\n", t->approved);
        fprintf(f, "      \"approvalDate\": \"%s\"\n", t->approvalDate);
        fprintf(f, "    }");
        t = t->next;
    }
    fprintf(f, "\n  ]\n");
    
    fprintf(f, "}\n");
    fclose(f);
}

void loadFromFile() {
    FILE* f = fopen("database.json", "r");
    if (!f) {
        printf("No existing database found. Creating new system...\n");
        // Create default student
        Student* stu = (Student*)malloc(sizeof(Student));
        stu->studentId = g_system.nextStudentId++;
        strcpy(stu->name, "Default Student");
        strcpy(stu->password, DEFAULT_STUDENT_PASSWORD);
        strcpy(stu->email, "student@example.edu");
        strcpy(stu->department, "CSE");
        stu->year = 1;
        stu->semester = 1;
        stu->cgpa = 0.0;
        stu->attendance = 0.0;
        stu->subjectCount = 0;
        stu->next = NULL;
        g_system.students = stu;
        saveToFile();
        printf("Default student created: ID=%d, Password=%s\n", stu->studentId, DEFAULT_STUDENT_PASSWORD);
        return;
    }

    // Read entire file
    fseek(f, 0, SEEK_END);
    long fsize = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    char* content = (char*)malloc(fsize + 1);
    fread(content, 1, fsize, f);
    content[fsize] = '\0';
    fclose(f);

    // Parse JSON metadata
    g_system.nextStudentId = parseJSONInt(content, "nextStudentId");
    g_system.nextTeacherId = parseJSONInt(content, "nextTeacherId");
    g_system.nextPrincipalId = parseJSONInt(content, "nextPrincipalId");

    // Parse students array
    char* studentsArray = strstr(content, "\"students\":");
    if (studentsArray) {
        char* studentStart = strchr(studentsArray, '[');
        if (studentStart) {
            char* current = studentStart + 1;
            while (*current && *current != ']') {
                // Find next student object
                char* objStart = strchr(current, '{');
                if (!objStart || objStart > strchr(current, ']')) break;
                
                char* objEnd = objStart;
                int braceCount = 1;
                objEnd++;
                while (*objEnd && braceCount > 0) {
                    if (*objEnd == '{') braceCount++;
                    else if (*objEnd == '}') braceCount--;
                    objEnd++;
                }
                
                // Extract student JSON
                int len = objEnd - objStart;
                char* studentJSON = (char*)malloc(len + 1);
                strncpy(studentJSON, objStart, len);
                studentJSON[len] = '\0';
                
                // Parse student
                Student* s = (Student*)malloc(sizeof(Student));
                memset(s, 0, sizeof(Student));
                s->studentId = parseJSONInt(studentJSON, "studentId");
                parseJSON(studentJSON, "name", s->name);
                parseJSON(studentJSON, "password", s->password);
                parseJSON(studentJSON, "email", s->email);
                parseJSON(studentJSON, "department", s->department);
                s->year = parseJSONInt(studentJSON, "year");
                s->semester = parseJSONInt(studentJSON, "semester");
                s->cgpa = parseJSONNumber(studentJSON, "cgpa");
                s->attendance = parseJSONNumber(studentJSON, "attendance");
                s->subjectCount = 0;
                
                // Parse subjects for this student
                char* subjArray = strstr(studentJSON, "\"subjects\":");
                if (subjArray) {
                    char* subjStart = strchr(subjArray, '[');
                    if (subjStart) {
                        char* subjCurrent = subjStart + 1;
                        while (*subjCurrent && *subjCurrent != ']' && s->subjectCount < 10) {
                            char* subjObjStart = strchr(subjCurrent, '{');
                            if (!subjObjStart || subjObjStart > strchr(subjCurrent, ']')) break;
                            
                            char* subjObjEnd = subjObjStart;
                            int subjBraces = 1;
                            subjObjEnd++;
                            while (*subjObjEnd && subjBraces > 0) {
                                if (*subjObjEnd == '{') subjBraces++;
                                else if (*subjObjEnd == '}') subjBraces--;
                                subjObjEnd++;
                            }
                            
                            int subjLen = subjObjEnd - subjObjStart;
                            char* subjJSON = (char*)malloc(subjLen + 1);
                            strncpy(subjJSON, subjObjStart, subjLen);
                            subjJSON[subjLen] = '\0';
                            
                            Subject* subj = &s->subjects[s->subjectCount];
                            memset(subj, 0, sizeof(Subject));
                            parseJSON(subjJSON, "subjectId", subj->subjectId);
                            parseJSON(subjJSON, "name", subj->name);
                            subj->mid1 = parseJSONInt(subjJSON, "mid1");
                            subj->mid2 = parseJSONInt(subjJSON, "mid2");
                            subj->final = parseJSONInt(subjJSON, "final");
                            subj->attendance_percent = parseJSONNumber(subjJSON, "attendance_percent");
                            parseJSON(subjJSON, "remarks", subj->remarks);
                            
                            s->subjectCount++;
                            free(subjJSON);
                            subjCurrent = subjObjEnd;
                        }
                    }
                }
                
                s->next = g_system.students;
                g_system.students = s;
                free(studentJSON);
                current = objEnd;
            }
        }
    }

    // Parse teachers array
    char* teachersArray = strstr(content, "\"teachers\":");
    if (teachersArray) {
        char* teacherStart = strchr(teachersArray, '[');
        if (teacherStart) {
            char* current = teacherStart + 1;
            while (*current && *current != ']') {
                char* objStart = strchr(current, '{');
                if (!objStart || objStart > strchr(current, ']')) break;
                
                char* objEnd = objStart;
                int braceCount = 1;
                objEnd++;
                while (*objEnd && braceCount > 0) {
                    if (*objEnd == '{') braceCount++;
                    else if (*objEnd == '}') braceCount--;
                    objEnd++;
                }
                
                int len = objEnd - objStart;
                char* teacherJSON = (char*)malloc(len + 1);
                strncpy(teacherJSON, objStart, len);
                teacherJSON[len] = '\0';
                
                Teacher* t = (Teacher*)malloc(sizeof(Teacher));
                memset(t, 0, sizeof(Teacher));
                t->teacherId = parseJSONInt(teacherJSON, "teacherId");
                parseJSON(teacherJSON, "name", t->name);
                parseJSON(teacherJSON, "password", t->password);
                parseJSON(teacherJSON, "email", t->email);
                parseJSON(teacherJSON, "department", t->department);
                t->approved = parseJSONInt(teacherJSON, "approved");
                parseJSON(teacherJSON, "approvalDate", t->approvalDate);
                
                t->next = g_system.teachers;
                g_system.teachers = t;
                free(teacherJSON);
                current = objEnd;
            }
        }
    }

    free(content);
    printf("System data loaded successfully from database.json\n");
}
