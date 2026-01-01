import { useEffect, useState } from 'react';
import AcademicEditor from './AcademicEditor';

const StudentDashboard = ({ studentData, onLogout, showMessage, userRole }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(studentData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCgpa, setEditCgpa] = useState('');
  const [editAttendance, setEditAttendance] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  useEffect(() => {
    const id = studentData?.studentId || studentData?.id;
    if (!id) return;
    let cancelled = false;
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:8080/api/students/${id}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        if (!cancelled) setProfile(prev => ({ ...prev, ...data }));
      } catch (e) {
        if (!cancelled) setError('Unable to load full profile');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, [studentData]);

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

  const cgpaVal = typeof profile?.cgpa === 'number' ? profile.cgpa : undefined;
  const attValRaw =
    typeof profile?.attendance_percent === 'number'
      ? profile.attendance_percent
      : typeof profile?.attendance === 'number'
      ? profile.attendance
      : undefined;
  const attVal = typeof attValRaw === 'number' ? Math.min(Math.max(attValRaw, 0), 100) : undefined;

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
        <button
          style={tabStyle(activeTab === 'subjects')}
          onClick={() => setActiveTab('subjects')}
        >
          📚 Subjects
        </button>
      </div>

      {activeTab === 'profile' && (
        <div>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>#{profile?.studentId || profile?.id}</div>
              <div style={statLabelStyle}>Student ID</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>Year {profile?.year || '—'}</div>
              <div style={statLabelStyle}>Academic Year</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{profile?.department || '—'}</div>
              <div style={statLabelStyle}>Department</div>
            </div>
            <div className="stat-card stat-card--purple" style={statCardStyle}>
              <div style={statNumberStyle}>{typeof cgpaVal === 'number' ? cgpaVal.toFixed(2) : 'N/A'}</div>
              <div style={statLabelStyle}>CGPA</div>
            </div>
            <div className="stat-card stat-card--purple" style={statCardStyle}>
              <div style={statNumberStyle}>{typeof attVal === 'number' ? attVal.toFixed(1) : 'N/A'}%</div>
              <div style={statLabelStyle}>Attendance</div>
              <div className="progress" style={{ marginTop: '10px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Attendance progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={typeof attVal === 'number' ? Math.round(attVal) : 0}
                  style={{ width: `${typeof attVal === 'number' ? attVal : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div style={infoBoxStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
              📋 Personal Information
            </h3>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Name:</span>
              <span style={valueStyle}>{profile?.name || '—'}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Email:</span>
              <span style={valueStyle}>{profile?.email || '—'}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>Department:</span>
              <span style={valueStyle}>{profile?.department || '—'}</span>
            </div>
            <div style={infoRowLastStyle}>
              <span style={labelStyle}>Current Year:</span>
              <span style={valueStyle}>{profile?.year || '—'}</span>
            </div>
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <div className="spinner" />
                <span style={{ color: '#666', fontSize: '13px' }}>Loading profile…</span>
              </div>
            )}
            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', borderLeft: '4px solid #ef4444', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', marginTop: '10px' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'academics' && (
        <div>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{typeof cgpaVal === 'number' ? cgpaVal.toFixed(2) : '0.00'}</div>
              <div style={statLabelStyle}>CGPA</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{typeof attVal === 'number' ? attVal.toFixed(1) : '0'}%</div>
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
                <strong>{typeof cgpaVal === 'number' ? cgpaVal.toFixed(2) : '0.00'}</strong> / 10.00
              </span>
            </div>
            <div style={infoRowLastStyle}>
              <span style={labelStyle}>Attendance Percentage:</span>
              <span style={valueStyle}>
                <strong>{typeof attVal === 'number' ? attVal.toFixed(1) : '0'}%</strong>
              </span>
            </div>
            {(userRole === 'teacher' || userRole === 'principal') && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                {!isEditing ? (
                  <button onClick={() => { setIsEditing(true); setEditCgpa((cgpaVal ?? 0).toString()); setEditAttendance((attVal ?? 0).toString()); }}
                    style={{ padding: '10px 14px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    ✏️ Edit Academics
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(false)}
                      style={{ padding: '10px 14px', background: '#e5e7eb', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                      Cancel
                    </button>
                    <button onClick={async () => {
                      const id = profile?.studentId || profile?.id;
                      const cg = parseFloat(editCgpa);
                      const att = parseFloat(editAttendance);
                      if (isNaN(cg) || isNaN(att)) { showMessage && showMessage('Provide valid numbers', 'error'); return; }
                      if (cg < 0 || cg > 10 || att < 0 || att > 100) { showMessage && showMessage('CGPA 0-10 and Attendance 0-100', 'error'); return; }
                      const payload = { cgpa: cg, attendance_percent: att };
                      if (userRole === 'teacher') {
                        payload.role = 'teacher';
                        payload.email = profile?.teacherEmail || '';
                        payload.password = authPassword;
                      } else if (userRole === 'principal') {
                        payload.role = 'principal';
                        payload.principalPassword = authPassword;
                      }
                      try {
                        const res = await fetch(`http://localhost:8080/api/students/${id}/academics`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload)
                        });
                        const data = await res.json();
                        if (res.status === 200) {
                          setProfile(prev => ({ ...prev, cgpa: cg, attendance_percent: att, attendance: att }));
                          setIsEditing(false);
                          setAuthPassword('');
                          showMessage && showMessage('Academics updated', 'success');
                        } else if (res.status === 403) {
                          showMessage && showMessage('Forbidden: insufficient role', 'error');
                        } else {
                          showMessage && showMessage(data.error || 'Update failed', 'error');
                        }
                      } catch (e) {
                        showMessage && showMessage('Connection error', 'error');
                      }
                    }}
                      style={{ padding: '10px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                      Save
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing && (userRole === 'teacher' || userRole === 'principal') && (
            <div style={{ ...infoBoxStyle, marginTop: '12px' }}>
              <h4 style={{ margin: 0, marginBottom: '10px', color: '#333' }}>Edit Academics</h4>
              <div style={infoRowStyle}>
                <span style={labelStyle}>CGPA</span>
                <input type="number" min="0" max="10" step="0.01" value={editCgpa} onChange={(e) => setEditCgpa(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '120px' }} />
              </div>
              <div style={infoRowLastStyle}>
                <span style={labelStyle}>Attendance (%)</span>
                <input type="number" min="0" max="100" step="0.1" value={editAttendance} onChange={(e) => setEditAttendance(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '120px' }} />
              </div>
              <div style={{ marginTop: '10px' }}>
                {userRole === 'teacher' && (
                  <div className="form-group">
                    <label style={labelStyle}>Confirm Password</label>
                    <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                      style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '220px' }} />
                  </div>
                )}
                {userRole === 'principal' && (
                  <div className="form-group">
                    <label style={labelStyle}>Principal Password</label>
                    <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                      style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '220px' }} />
                  </div>
                )}
              </div>
            </div>
          )}

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
      {activeTab === 'subjects' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
            📚 Subject-wise Performance
          </h3>

          {profile?.subjects && profile.subjects.length > 0 ? (
            <div>
              {profile.subjects.map((subject) => (
                <AcademicEditor
                  key={subject.subjectId}
                  subject={subject}
                  studentId={profile?.studentId || profile?.id}
                  userRole={userRole}
                  teacherEmail={profile?.email}
                  onSave={() => {
                    // Refresh profile to show updated data
                    const id = profile?.studentId || profile?.id;
                    fetch(`http://localhost:8080/api/students/${id}`)
                      .then(res => res.json())
                      .then(data => setProfile(prev => ({ ...prev, ...data })))
                      .catch(() => {});
                  }}
                  showMessage={showMessage}
                />
              ))}
            </div>
          ) : (
            <div style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '15px',
              borderRadius: '10px',
              borderLeft: '4px solid #f59e0b',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                📭 No subjects assigned yet. Please contact your academic advisor.
              </p>
            </div>
          )}

          <div style={{
            background: '#f0f4ff',
            borderRadius: '10px',
            padding: '15px',
            borderLeft: '4px solid #667eea',
            marginTop: '20px'
          }}>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
              <strong>ℹ️ Info:</strong> This view shows your per-subject marks and attendance. Marks include mid exams, final exam, and cumulative total. Attendance is shown as a percentage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
