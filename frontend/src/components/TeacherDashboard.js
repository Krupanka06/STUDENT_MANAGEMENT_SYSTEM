import { useEffect, useState } from 'react';
import AcademicEditor from './AcademicEditor';
import ManageSubjectsModal from './ManageSubjectsModal';

const TeacherDashboard = ({ teacherData, onLogout, showMessage }) => {
  const [teacher, setTeacher] = useState(teacherData || {});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    refreshTeacher();
    fetchStudents();
  }, []);

  const refreshTeacher = async () => {
    if (!teacherData?.teacherId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/teacher/${teacherData.teacherId}`);
      if (res.ok) {
        const data = await res.json();
        setTeacher(data);
      }
    } catch (e) {
      // silent
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'teacher', department: teacherData?.department || teacher?.department, email: teacherData?.email || teacher?.email })
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      showMessage('Error loading students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'teacher', department: teacher?.department, email: teacher?.email })
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error refreshing students:', error);
    }
  };

  const handleManageSubjects = async (student) => {
    // Fetch full student data with subjects
    try {
      const res = await fetch(`http://localhost:8080/api/students/${student.studentId}?role=teacher&department=${teacher?.department || ''}`);
      if (res.ok) {
        const fullStudent = await res.json();
        setSelectedStudent(fullStudent);
        setShowModal(true);
      } else {
        const errData = await res.json();
        showMessage(errData.error || 'Failed to load student data', 'error');
      }
    } catch (err) {
      showMessage('Error loading student data', 'error');
    }
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '30px',
    marginBottom: '20px'
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e5e7eb'
  };

  const tabStyle = (active) => ({
    padding: '12px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    color: active ? '#667eea' : '#999',
    borderBottom: active ? '3px solid #667eea' : 'none',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    marginBottom: '-2px'
  });

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  };

  const statCardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  const statLabelStyle = {
    fontSize: '12px',
    opacity: 0.9
  };

  const studentTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    background: '#f9fafb',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #ddd',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#555'
  };

  const badgeStyle = (dept) => ({
    background: dept === 'CSE' ? '#dbeafe' : dept === 'ECE' ? '#fce7f3' : '#e0e7ff',
    color: dept === 'CSE' ? '#1e40af' : dept === 'ECE' ? '#be185d' : '#4338ca',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  });

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          👨‍🏫 Teacher Dashboard
        </h2>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🚪 Logout
        </button>
      </div>

      <div style={tabContainerStyle}>
        <button
          style={tabStyle(activeTab === 'profile')}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          style={tabStyle(activeTab === 'students')}
          onClick={() => setActiveTab('students')}
        >
          🎓 Students
        </button>
      </div>

      {activeTab === 'profile' && (
        <div>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{teacher?.teacherId}</div>
              <div style={statLabelStyle}>Teacher ID</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{students.length}</div>
              <div style={statLabelStyle}>Total Students</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{teacher?.approved === 1 ? '✓' : (teacher?.approved === -1 ? '✕' : '⏳')}</div>
              <div style={statLabelStyle}>Approval Status</div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
              📋 Profile Information
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Name:</strong> {teacher?.name}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Email:</strong> {teacher?.email}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Department:</strong> {teacher?.department}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Status:</strong> {teacher?.approved === 1 ? '✓ Approved' : teacher?.approved === 0 ? '⏳ Pending Approval' : '✕ Rejected'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
            📚 Registered Students ({students.length})
          </h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : students.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No students for your department yet
            </p>
          ) : (
            <div>
              {students.map(student => (
                <div key={student.studentId} style={{ marginBottom: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#f9fafb' }}>
                  <div
                    onClick={() => setExpandedStudent(expandedStudent === student.studentId ? null : student.studentId)}
                    style={{
                      padding: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#f9fafb',
                      borderRadius: '10px 10px 0 0',
                      userSelect: 'none'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '600', color: '#333' }}>
                        {student.name} <span style={{ fontSize: '12px', color: '#999' }}>#{student.studentId}</span>
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                        {student.email} • Year {student.year} • <span style={badgeStyle(student.department)}>{student.department}</span>
                      </p>
                    </div>
                    <div style={{ fontSize: '20px' }}>
                      {expandedStudent === student.studentId ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedStudent === student.studentId && (
                    <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleManageSubjects(student)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}
                        >
                          📚 Manage Subjects
                        </button>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                          📊 Overall Performance
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>CGPA</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                              {student.cgpa?.toFixed(2) || 'N/A'}
                            </div>
                          </div>
                          <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Attendance</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                              {student.attendance?.toFixed(1) || 'N/A'}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {student.subjects && student.subjects.length > 0 ? (
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>
                            📚 Subjects ({student.subjects.length})
                          </h4>
                          {student.subjects.map(subject => (
                            <AcademicEditor
                              key={subject.subjectId}
                              subject={subject}
                              studentId={student.studentId}
                              userRole="teacher"
                              teacherEmail={teacher?.email}
                              onSave={() => refreshStudents()}
                              showMessage={showMessage}
                            />
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}>
                          ℹ️ No subjects assigned to this student yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ManageSubjectsModal
        isOpen={showModal}
        student={selectedStudent}
        teacher={teacher}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
        }}
        onSave={() => {
          refreshStudents();
          setShowModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default TeacherDashboard;
