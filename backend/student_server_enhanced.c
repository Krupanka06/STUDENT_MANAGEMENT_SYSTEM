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

typedef struct {
    int studentId;
    char name[100];
    char password[100];
    char email[120];
    char department[80];
    int year;
    double cgpa;
    double attendance;
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
                sprintf(resp, "{\"success\":true,\"role\":\"teacher\",\"teacherId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\"}",
                    teacher->teacherId, teacher->name, teacher->email, teacher->department);
                sendResponse(client, 200, resp);
                printf("  ✓ Teacher login: %s\n", teacher->name);
            }
        } else {
            sendResponse(client, 401, "{\"error\":\"Invalid email or password\"}");
        }
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
        stu->cgpa = 0.0;
        stu->attendance = 0.0;
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

    // Get all students (Admin/Principal)
    if (strcmp(method, "GET") == 0 && strcmp(path, "/api/students") == 0) {
        char auth[100];
        parseJSON(body, "password", auth);
        if (strcmp(auth, ADMIN_PASSWORD) != 0 && strcmp(auth, PRINCIPAL_PASSWORD) != 0) {
            sendResponse(client, 401, "{\"error\":\"Unauthorized\"}");
            return;
        }

        char resp[BUFFER_SIZE] = "[";
        Student* current = g_system.students;
        int first = 1;
        while (current != NULL) {
            char item[512];
            sprintf(item, "%s{\"studentId\":%d,\"name\":\"%s\",\"email\":\"%s\",\"department\":\"%s\",\"year\":%d,\"cgpa\":%.2f,\"attendance\":%.2f}",
                first ? "" : ",", current->studentId, current->name, current->email, current->department, current->year, current->cgpa, current->attendance);
            strcat(resp, item);
            first = 0;
            current = current->next;
        }
        strcat(resp, "]");
        sendResponse(client, 200, resp);
        printf("  ✓ Retrieved all students\n");
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
        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
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
        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
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

void saveToFile() {
    // Save meta (next IDs)
    FILE* meta = fopen("system_meta.txt", "w");
    if (meta) {
        fprintf(meta, "%d|%d|%d\n", g_system.nextStudentId, g_system.nextTeacherId, g_system.nextPrincipalId);
        fclose(meta);
    }

    // Save students
    FILE* sf = fopen("students_data.txt", "w");
    if (sf) {
        Student* s = g_system.students;
        while (s) {
            fprintf(sf, "STUDENT|%d|%s|%s|%s|%s|%d|%.2f|%.2f\n",
                s->studentId, s->name, s->password, s->email, s->department, s->year, s->cgpa, s->attendance);
            s = s->next;
        }
        fclose(sf);
    }

    // Save teachers
    FILE* tf = fopen("teachers_data.txt", "w");
    if (tf) {
        Teacher* t = g_system.teachers;
        while (t) {
            fprintf(tf, "TEACHER|%d|%s|%s|%s|%s|%d|%s\n",
                t->teacherId, t->name, t->password, t->email, t->department, t->approved, t->approvalDate);
            t = t->next;
        }
        fclose(tf);
    }

    // Save pending approvals (teacher IDs)
    FILE* af = fopen("approvals.txt", "w");
    if (af) {
        Teacher* t2 = g_system.teachers;
        while (t2) {
            if (t2->approved == 0) {
                fprintf(af, "%d\n", t2->teacherId);
            }
            t2 = t2->next;
        }
        fclose(af);
    }
}

void loadFromFile() {
    // Load meta
    FILE* meta = fopen("system_meta.txt", "r");
    if (meta) {
        fscanf(meta, "%d|%d|%d\n", &g_system.nextStudentId, &g_system.nextTeacherId, &g_system.nextPrincipalId);
        fclose(meta);
    }

    // Load students
    FILE* sf = fopen("students_data.txt", "r");
    if (!sf) {
        // No students file -> create default student
        printf("Creating new system with default student...\n");
        Student* stu = (Student*)malloc(sizeof(Student));
        stu->studentId = g_system.nextStudentId++;
        strcpy(stu->name, "Default Student");
        strcpy(stu->password, DEFAULT_STUDENT_PASSWORD);
        strcpy(stu->email, "student@example.edu");
        strcpy(stu->department, "CSE");
        stu->year = 1;
        stu->cgpa = 0.0;
        stu->attendance = 0.0;
        stu->next = NULL;
        g_system.students = stu;
        saveToFile();
        printf("Default student created: ID=%d, Password=%s\n", stu->studentId, DEFAULT_STUDENT_PASSWORD);
    } else {
        char line[1024];
        while (fgets(line, sizeof(line), sf)) {
            if (strncmp(line, "STUDENT|", 8) == 0) {
                Student* s = (Student*)malloc(sizeof(Student));
                sscanf(line, "STUDENT|%d|%99[^|]|%99[^|]|%119[^|]|%79[^|]|%d|%lf|%lf",
                    &s->studentId, s->name, s->password, s->email, s->department, &s->year, &s->cgpa, &s->attendance);
                s->next = g_system.students;
                g_system.students = s;
            }
        }
        fclose(sf);
    }

    // Load teachers
    FILE* tf = fopen("teachers_data.txt", "r");
    if (tf) {
        char line[1024];
        while (fgets(line, sizeof(line), tf)) {
            if (strncmp(line, "TEACHER|", 8) == 0) {
                Teacher* t = (Teacher*)malloc(sizeof(Teacher));
                sscanf(line, "TEACHER|%d|%99[^|]|%99[^|]|%119[^|]|%79[^|]|%d|%49[^\n]",
                    &t->teacherId, t->name, t->password, t->email, t->department, &t->approved, t->approvalDate);
                t->next = g_system.teachers;
                g_system.teachers = t;
            }
        }
        fclose(tf);
    }

    // Load pending approvals (if any) and ensure teachers are marked pending
    FILE* af = fopen("approvals.txt", "r");
    if (af) {
        int tid;
        while (fscanf(af, "%d\n", &tid) == 1) {
            Teacher* t = findTeacher(tid);
            if (t) {
                t->approved = 0; // ensure pending
            }
        }
        fclose(af);
    }

    printf("System data loaded successfully\n");
}
