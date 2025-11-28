import { useState } from 'react';

const StudentDashboard = ({ studentData, onLogout, showMessage }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '30px'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
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
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  const statLabelStyle = {
    fontSize: '12px',
    opacity: 0.9
  };

  const infoBoxStyle = {
    background: '#f9fafb',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px'
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e5e7eb'
  };

  const infoRowLastStyle = {
    ...infoRowStyle,
    borderBottom: 'none'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#333'
  };

  const valueStyle = {
    color: '#666'
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          🎓 Student Dashboard
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
          style={tabStyle(activeTab === 'academics')}
          onClick={() => setActiveTab('academics')}
        >
          📊 Academics
        </button>
      </div>

      {activeTab === 'profile' && (
        <div>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>#{studentData?.studentId}</div>
              <div style={statLabelStyle}>Student ID</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>Year {studentData?.year}</div>
              <div style={statLabelStyle}>Academic Year</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{studentData?.department}</div>
              <div style={statLabelStyle}>Department</div>
            </div>
          </div>

          <div style={infoBoxStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
              📋 Personal Information
            </h3>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Name:</span>
              <span style={valueStyle}>{studentData?.name}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Email:</span>
              <span style={valueStyle}>{studentData?.email}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Department:</span>
              <span style={valueStyle}>{studentData?.department}</span>
            </div>
            <div style={infoRowLastStyle}>
              <span style={labelStyle}>Current Year:</span>
              <span style={valueStyle}>{studentData?.year}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academics' && (
        <div>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{studentData?.cgpa?.toFixed(2) || '0.00'}</div>
              <div style={statLabelStyle}>CGPA</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{studentData?.attendance?.toFixed(1) || '0'}%</div>
              <div style={statLabelStyle}>Attendance</div>
            </div>
          </div>

          <div style={infoBoxStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
              📊 Academic Performance
            </h3>
            <div style={infoRowStyle}>
              <span style={labelStyle}>CGPA (Cumulative GPA):</span>
              <span style={valueStyle}>
                <strong>{studentData?.cgpa?.toFixed(2) || '0.00'}</strong> / 10.00
              </span>
            </div>
            <div style={infoRowLastStyle}>
              <span style={labelStyle}>Attendance Percentage:</span>
              <span style={valueStyle}>
                <strong>{studentData?.attendance?.toFixed(1) || '0'}%</strong>
              </span>
            </div>
          </div>

          <div style={{
            background: '#f0f4ff',
            borderRadius: '10px',
            padding: '15px',
            borderLeft: '4px solid #667eea'
          }}>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
              <strong>Note:</strong> Academic records are managed by your institution administrator and will be updated periodically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
