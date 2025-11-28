import React, { useEffect, useState } from 'react';

const AdminPanel = ({ onLogout, showMessage }) => {
  const [students, setStudents] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [academicData, setAcademicData] = useState({ cgpa: 0, attendance: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
    }
  }, [isAuthenticated]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/students?adminPassword=${adminPassword}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      showMessage('Error fetching students', 'error');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        showMessage('Admin login successful!', 'success');
      } else {
        showMessage('Invalid admin password!', 'error');
      }
    } catch (error) {
      showMessage('Error during login', 'error');
    }
  };

  const handleUpdateAcademics = async (studentId) => {
    if (academicData.cgpa < 0 || academicData.cgpa > 10) {
      showMessage('CGPA must be between 0 and 10!', 'error');
      return;
    }
    if (academicData.attendance < 0 || academicData.attendance > 100) {
      showMessage('Attendance must be between 0 and 100!', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/students/${studentId}/academics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: adminPassword,
          cgpa: parseFloat(academicData.cgpa),
          attendance: parseFloat(academicData.attendance)
        })
      });

      if (response.ok) {
        showMessage('Academic records updated successfully!', 'success');
        setSelectedStudent(null);
        setAcademicData({ cgpa: 0, attendance: 0 });
        fetchStudents();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Error updating academics', 'error');
      }
    } catch (error) {
      showMessage('Error updating academics', 'error');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm(`Delete student #${studentId}?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/admin/students/${studentId}?adminPassword=${adminPassword}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage(`Student ${studentId} deleted!`, 'success');
        fetchStudents();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Error deleting student', 'error');
      }
    } catch (error) {
      showMessage('Error deleting student', 'error');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '90%'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            🔐 Admin Login
          </h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Enter admin password</p>
          
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            placeholder="Password"
            style={{ ...inputStyle, marginBottom: '15px' }}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAdminLogin}
              style={{ ...buttonStyle, flex: 1, background: '#8b5cf6', color: 'white' }}
            >
              Login
            </button>
            <button
              onClick={onLogout}
              style={{ ...buttonStyle, flex: 1, background: '#6b7280', color: 'white' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>🏫 Admin Panel</h2>
        <button onClick={onLogout} style={{ ...buttonStyle, background: '#ef4444', color: 'white' }}>
          🚪 Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Students</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{students.length}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Average CGPA</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {students.length > 0 ? (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2) : '0.00'}
          </p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Average Attendance</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {students.length > 0 ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1) : '0.0'}%
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>All Students ({students.length})</h3>
        <button onClick={fetchStudents} style={{ ...buttonStyle, background: '#8b5cf6', color: 'white' }}>🔄 Refresh</button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {students.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>No students</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#555' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#555' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#555' }}>Department</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#555' }}>Year</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#555' }}>CGPA</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#555' }}>Attendance</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#555' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.studentId} style={{ borderBottom: '1px solid #e5e7eb', background: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                  <td style={{ padding: '15px', fontWeight: '600', color: '#333' }}>#{student.studentId}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{student.name}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{student.department}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{student.year}</td>
                  <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#8b5cf6' }}>
                    {student.cgpa.toFixed(2)}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#8b5cf6' }}>
                    {student.attendance.toFixed(1)}%
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setAcademicData({ cgpa: student.cgpa, attendance: student.attendance });
                        }}
                        style={{ ...buttonStyle, background: '#3b82f6', color: 'white', padding: '6px 12px', fontSize: '12px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.studentId)}
                        style={{ ...buttonStyle, background: '#ef4444', color: 'white', padding: '6px 12px', fontSize: '12px' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Academic Update Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
              ✏️ Update Academic Records
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Student: {selectedStudent.name} (#{selectedStudent.studentId})
            </p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#555' }}>
                CGPA (0-10)
              </label>
              <input
                type="number"
                value={academicData.cgpa}
                onChange={(e) => setAcademicData(prev => ({ ...prev, cgpa: e.target.value }))}
                min="0"
                max="10"
                step="0.01"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#555' }}>
                Attendance (0-100%)
              </label>
              <input
                type="number"
                value={academicData.attendance}
                onChange={(e) => setAcademicData(prev => ({ ...prev, attendance: e.target.value }))}
                min="0"
                max="100"
                step="0.1"
                style={inputStyle}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleUpdateAcademics(selectedStudent.studentId)}
                style={{ ...buttonStyle, flex: 1, background: '#10b981', color: 'white' }}
              >
                💾 Update
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setAcademicData({ cgpa: 0, attendance: 0 });
                }}
                style={{ ...buttonStyle, flex: 1, background: '#6b7280', color: 'white' }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
