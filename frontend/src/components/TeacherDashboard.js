import { useEffect, useState } from 'react';

const TeacherDashboard = ({ teacherData, onLogout, showMessage }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/students', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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
              <div style={statNumberStyle}>{teacherData?.teacherId}</div>
              <div style={statLabelStyle}>Teacher ID</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{students.length}</div>
              <div style={statLabelStyle}>Total Students</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{teacherData?.approved === 1 ? '✓' : '⏳'}</div>
              <div style={statLabelStyle}>Approval Status</div>
            </div>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
              📋 Profile Information
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Name:</strong> {teacherData?.name}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Email:</strong> {teacherData?.email}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Department:</strong> {teacherData?.department}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
              <strong>Status:</strong> {teacherData?.approved === 1 ? '✓ Approved' : teacherData?.approved === 0 ? '⏳ Pending Approval' : '✕ Rejected'}
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
              No students registered yet
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={studentTableStyle}>
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
                    <tr key={student.studentId} style={{ background: 'white' }}>
                      <td style={tdStyle}><strong>#{student.studentId}</strong></td>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(student.department)}>
                          {student.department}
                        </span>
                      </td>
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

export default TeacherDashboard;
