/*
* Student Management REST API Server - JSON Storage Version
* Features: JSON-based storage for reliable data persistence
*           Admin, Principal, Teacher, and Student roles
*           Teacher registration with Principal approval
*           Role-based access control
* Compile: gcc -o student_server.exe student_server_json.c -lws2_32
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <time.h>

#pragma comment(lib, "ws2_32.lib")

#define PORT 8080
#define BUFFER_SIZE 16384
#define ADMIN_PASSWORD "admin123"
#define PRINCIPAL_PASSWORD "principal123"
#define TEACHER_PASSWORD "teacher123"
#define DEFAULT_STUDENT_PASSWORD "student123"

// Subject structure
typedef struct {
    char subjectId[20];
    char name[100];
    int mid1;
    int mid2;
    int final;
    double attendance_percent;
    char remarks[200];
} Subject;

typedef struct Student {
    int studentId;
    char name[100];
    char password[100];
    char email[120];
    char department[80];
    int year;
    int semester;
    double cgpa;
    double attendance;
    Subject subjects[10];
    int subjectCount;
    struct Student* next;
} Student;

typedef struct Teacher {
    int teacherId;
    char name[100];
    char password[100];
    char email[120];
    char department[80];
    int approved; // -1=rejected, 0=pending, 1=approved
    char approvalDate[50];
    struct Teacher* next;
} Teacher;

typedef struct {
    int principalId;
    char name[100];
    char password[100];
    struct Principal* next;
} Principal;

typedef struct {
    Student* students;
    Teacher* teachers;
    Principal* principals;
    int nextStudentId;
    int nextTeacherId;
    int nextPrincipalId;
} System;

System g_system;

// Function prototypes
void initSystem();
void handleRequest(SOCKET client, char* request);
void sendResponse(SOCKET client, int status, const char* body);
void sendCORSHeaders(SOCKET client);
Student* findStudent(int id);
Teacher* findTeacher(int id);
Teacher* findTeacherByEmail(char* email);
Principal* findPrincipal(int id);
void saveToJSON();
void loadFromJSON();
void parseJSON(char* json, char* key, char* value);
double parseJSONNumber(char* json, char* key);
int parseJSONInt(char* json, char* key);
void getCurrentTimestamp(char* buffer);
void subjectsToJSON(Subject* subjects, int count, char* output);
Subject* findStudentSubject(Student* s, char* subjectId);
void escapeJSON(char* input, char* output);

int main() {
    WSADATA wsa;
    SOCKET server_sock, client_sock;
    struct sockaddr_in server, client;
    int c;
    char buffer[BUFFER_SIZE];
    int size;

    printf("=========================================\n");
    printf("  Enhanced Student Management System\n");
    printf("=========================================\n");
    printf("Default Credentials:\n");
    printf("  Admin:     password = %s\n", ADMIN_PASSWORD);
    printf("  Principal: password = %s\n", PRINCIPAL_PASSWORD);
    printf("  Teacher:   password = %s\n", TEACHER_PASSWORD);
    printf("  Student:   password = %s\n", DEFAULT_STUDENT_PASSWORD);
    printf("=========================================\n\n");

    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("WSAStartup failed\n");
        return 1;
    }

    initSystem();
    loadFromJSON();

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
            
            char* body_start = strstr(buffer, "\r\n\r\n");
            if (body_start && strlen(body_start + 4) == 0) {
                char* cl = strstr(buffer, "Content-Length: ");
                if (cl) {
                    int content_len = atoi(cl + 16);
                    if (content_len > 0 && size < BUFFER_SIZE - 1) {
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

void escapeJSON(char* input, char* output) {
    int j = 0;
    for (int i = 0; input[i] != '\0' && j < 500; i++) {
        if (input[i] == '"' || input[i] == '\\') {
            output[j++] = '\\';
        }
        output[j++] = input[i];
    }
    output[j] = '\0';
}

void saveToJSON() {
    FILE* f = fopen("database.json", "w");
    if (!f) {
        printf("Error: Cannot create database.json\n");
        return;
    }

    fprintf(f, "{\n");
    fprintf(f, "  \"nextStudentId\": %d,\n", g_system.nextStudentId);
    fprintf(f, "  \"nextTeacherId\": %d,\n", g_system.nextTeacherId);
    fprintf(f, "  \"nextPrincipalId\": %d,\n", g_system.nextPrincipalId);
    
    // Save students
    fprintf(f, "  \"students\": [\n");
    Student* s = g_system.students;
    int firstStudent = 1;
    while (s) {
        if (!firstStudent) fprintf(f, ",\n");
        firstStudent = 0;
        
        char escapedName[200], escapedEmail[200], escapedDept[200];
        escapeJSON(s->name, escapedName);
        escapeJSON(s->email, escapedEmail);
        escapeJSON(s->department, escapedDept);
        
        fprintf(f, "    {\n");
        fprintf(f, "      \"studentId\": %d,\n", s->studentId);
        fprintf(f, "      \"name\": \"%s\",\n", escapedName);
        fprintf(f, "      \"password\": \"%s\",\n", s->password);
        fprintf(f, "      \"email\": \"%s\",\n", escapedEmail);
        fprintf(f, "      \"department\": \"%s\",\n", escapedDept);
        fprintf(f, "      \"year\": %d,\n", s->year);
        fprintf(f, "      \"semester\": %d,\n", s->semester);
        fprintf(f, "      \"cgpa\": %.2f,\n", s->cgpa);
        fprintf(f, "      \"attendance\": %.2f,\n", s->attendance);
        fprintf(f, "      \"subjects\": [\n");
        
        for (int i = 0; i < s->subjectCount; i++) {
            if (i > 0) fprintf(f, ",\n");
            char escapedSubjName[200], escapedRemarks[400];
            escapeJSON(s->subjects[i].name, escapedSubjName);
            escapeJSON(s->subjects[i].remarks, escapedRemarks);
            
            fprintf(f, "        {\n");
            fprintf(f, "          \"subjectId\": \"%s\",\n", s->subjects[i].subjectId);
            fprintf(f, "          \"name\": \"%s\",\n", escapedSubjName);
            fprintf(f, "          \"mid1\": %d,\n", s->subjects[i].mid1);
            fprintf(f, "          \"mid2\": %d,\n", s->subjects[i].mid2);
            fprintf(f, "          \"final\": %d,\n", s->subjects[i].final);
            fprintf(f, "          \"attendance_percent\": %.2f,\n", s->subjects[i].attendance_percent);
            fprintf(f, "          \"remarks\": \"%s\"\n", escapedRemarks);
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
        
        char escapedName[200], escapedEmail[200], escapedDept[200];
        escapeJSON(t->name, escapedName);
        escapeJSON(t->email, escapedEmail);
        escapeJSON(t->department, escapedDept);
        
        fprintf(f, "    {\n");
        fprintf(f, "      \"teacherId\": %d,\n", t->teacherId);
        fprintf(f, "      \"name\": \"%s\",\n", escapedName);
        fprintf(f, "      \"password\": \"%s\",\n", t->password);
        fprintf(f, "      \"email\": \"%s\",\n", escapedEmail);
        fprintf(f, "      \"department\": \"%s\",\n", escapedDept);
        fprintf(f, "      \"approved\": %d,\n", t->approved);
        fprintf(f, "      \"approvalDate\": \"%s\"\n", t->approvalDate);
        fprintf(f, "    }");
        t = t->next;
    }
    fprintf(f, "\n  ]\n");
    
    fprintf(f, "}\n");
    fclose(f);
    printf("  ✓ Data saved to database.json\n");
}

void loadFromJSON() {
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
        saveToJSON();
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

    // Parse JSON (simple parser for our structured format)
    g_system.nextStudentId = parseJSONInt(content, "nextStudentId");
    g_system.nextTeacherId = parseJSONInt(content, "nextTeacherId");
    g_system.nextPrincipalId = parseJSONInt(content, "nextPrincipalId");

    // Parse students
    char* studentsArray = strstr(content, "\"students\":");
    if (studentsArray) {
        char* studentStart = strstr(studentsArray, "[");
        if (studentStart) {
            char* current = studentStart + 1;
            while (*current && *current != ']') {
                // Find next student object
                char* objStart = strchr(current, '{');
                if (!objStart) break;
                
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
                            if (!subjObjStart) break;
                            
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

    // Parse teachers
    char* teachersArray = strstr(content, "\"teachers\":");
    if (teachersArray) {
        char* teacherStart = strstr(teachersArray, "[");
        if (teacherStart) {
            char* current = teacherStart + 1;
            while (*current && *current != ']') {
                char* objStart = strchr(current, '{');
                if (!objStart) break;
                
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

// ... Continue with handleRequest and other functions (same as before but calling saveToJSON instead of saveToFile)
