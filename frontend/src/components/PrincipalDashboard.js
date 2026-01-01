import { useEffect, useMemo, useState } from 'react';
import AcademicEditor from './AcademicEditor';
import ManageSubjectsModal from './ManageSubjectsModal';

const PrincipalDashboard = ({ onLogout, showMessage }) => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pending teachers
      const teacherRes = await fetch('http://localhost:8080/api/principal/pending-teachers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (teacherRes.ok) {
        setPendingTeachers(await teacherRes.json());
      }

      // Fetch all students
      const studentRes = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'principal' })
      });
      if (studentRes.ok) {
        setStudents(await studentRes.json());
      }

      // Fetch all teachers
      const allTeachersRes = await fetch('http://localhost:8080/api/teachers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (allTeachersRes.ok) {
        setTeachers(await allTeachersRes.json());
      }
    } catch (error) {
      showMessage('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubjects = async (student) => {
    // Fetch full student data with subjects
    try {
      const res = await fetch(`http://localhost:8080/api/students/${student.studentId}?role=principal`);
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

  const handleApproveTeacher = async (teacherId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/principal/teachers/${teacherId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'principal123', action: action })
      });

      if (response.ok) {
        showMessage(action === 1 ? 'Teacher approved!' : 'Teacher rejected!', 'success');
        fetchData();
      } else {
        showMessage('Action failed', 'error');
      }
    } catch (error) {
      showMessage('Error processing request', 'error');
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

  const statCardStyle = (color) => ({
    background: color,
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center'
  });

  const statNumberStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  const statLabelStyle = {
    fontSize: '12px',
    opacity: 0.9
  };

  const tableStyle = {
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

  const btnStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginRight: '5px'
  };

  const btnApproveStyle = {
    ...btnStyle,
    background: '#10b981',
    color: 'white'
  };

  const btnRejectStyle = {
    ...btnStyle,
    background: '#ef4444',
    color: 'white'
  };

  const filteredStudents = useMemo(() => {
    if (!departmentFilter) return students;
    return students.filter(s => s.department === departmentFilter);
  }, [students, departmentFilter]);

  const departments = useMemo(() => {
    const set = new Set();
    students.forEach(s => set.add(s.department));
    return Array.from(set);
  }, [students]);

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          👔 Principal Dashboard
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

      <div style={statsGridStyle}>
        <div style={statCardStyle('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}>
          <div style={statNumberStyle}>{pendingTeachers.length}</div>
          <div style={statLabelStyle}>Pending Teachers</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')}>
          <div style={statNumberStyle}>{students.length}</div>
          <div style={statLabelStyle}>Total Students</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')}>
          <div style={statNumberStyle}>{Math.round(students.reduce((sum, s) => sum + s.cgpa, 0) / (students.length || 1) * 10) / 10}</div>
          <div style={statLabelStyle}>Avg CGPA</div>
        </div>
      </div>

      <div style={tabContainerStyle}>
        <button
          style={tabStyle(activeTab === 'pending')}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Approvals
        </button>
        <button
          style={tabStyle(activeTab === 'teachers')}
          onClick={() => setActiveTab('teachers')}
        >
          👨‍🏫 Teachers
        </button>
        <button
          style={tabStyle(activeTab === 'students')}
          onClick={() => setActiveTab('students')}
        >
          🎓 Students
        </button>
      </div>

      {activeTab === 'pending' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
            👨‍🏫 Teacher Approval Requests ({pendingTeachers.length})
          </h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : pendingTeachers.length === 0 ? (
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              color: '#065f46'
            }}>
              ✓ No pending teacher registrations
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Department</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTeachers.map(teacher => (
                    <tr key={teacher.teacherId} style={{ background: 'white' }}>
                      <td style={tdStyle}><strong>{teacher.name}</strong></td>
                      <td style={tdStyle}>{teacher.email}</td>
                      <td style={tdStyle}>{teacher.department}</td>
                      <td style={tdStyle}>
                        <button
                          style={btnApproveStyle}
                          onClick={() => handleApproveTeacher(teacher.teacherId, 1)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          style={btnRejectStyle}
                          onClick={() => handleApproveTeacher(teacher.teacherId, -1)}
                        >
                          ✕ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'teachers' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
            👨‍🏫 All Teachers ({teachers.length})
          </h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600', marginRight: '8px' }}>Filter by Department:</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            >
              <option value="">All Departments</option>
              {Array.from(new Set(teachers.map(t => t.department))).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : teachers.filter(t => !departmentFilter || t.department === departmentFilter).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No teachers in selected department
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.filter(t => !departmentFilter || t.department === departmentFilter).map(teacher => (
                    <tr key={teacher.teacherId} style={{ background: 'white' }}>
                      <td style={tdStyle}><strong>#{teacher.teacherId}</strong></td>
                      <td style={tdStyle}>{teacher.name}</td>
                      <td style={tdStyle}>{teacher.email}</td>
                      <td style={tdStyle}>{teacher.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'students' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
            🎓 All Students ({filteredStudents.length})
          </h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600', marginRight: '8px' }}>Filter by Department:</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : filteredStudents.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No students registered yet
            </p>
          ) : (
            <div>
              {filteredStudents.map(student => (
                <div key={student.studentId} style={{ marginBottom: '15px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#f9fafb' }}>
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
                        {student.email} • Year {student.year} • {student.department}
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
                              userRole="principal"
                              onSave={() => {
                                // Refresh students list
                                fetchData();
                              }}
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
        teacher={{ email: 'principal@admin.com', password: 'principal123' }}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
        }}
        onSave={() => {
          fetchData();
          setShowModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default PrincipalDashboard;
