import { useEffect, useState } from 'react';

const PrincipalDashboard = ({ onLogout, showMessage }) => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

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
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (studentRes.ok) {
        setStudents(await studentRes.json());
      }
    } catch (error) {
      showMessage('Error loading data', 'error');
    } finally {
      setLoading(false);
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
          style={tabStyle(activeTab === 'students')}
          onClick={() => setActiveTab('students')}
        >
          🎓 All Students
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

      {activeTab === 'students' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
            📚 All Students ({students.length})
          </h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
          ) : students.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No students registered yet
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
                    <th style={thStyle}>Year</th>
                    <th style={thStyle}>CGPA</th>
                    <th style={thStyle}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.studentId}>
                      <td style={tdStyle}><strong>#{student.studentId}</strong></td>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>{student.department}</td>
                      <td style={tdStyle}>Year {student.year}</td>
                      <td style={tdStyle}><strong>{student.cgpa.toFixed(2)}</strong></td>
                      <td style={tdStyle}><strong>{student.attendance.toFixed(1)}%</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrincipalDashboard;
