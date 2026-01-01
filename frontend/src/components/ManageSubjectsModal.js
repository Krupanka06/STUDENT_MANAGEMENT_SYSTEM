import React, { useState, useEffect } from 'react';

const ManageSubjectsModal = ({ isOpen, student, teacher, onClose, onSave }) => {
  const [assignTab, setAssignTab] = useState(true);
  const [newSubject, setNewSubject] = useState({
    subjectId: '',
    name: '',
    mid1: 0,
    mid2: 0,
    final: 0,
    attendance_percent: 0
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [cgpa, setCgpa] = useState(0);
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [studentData, setStudentData] = useState(student);

  // Update CGPA and attendance when student data changes
  useEffect(() => {
    if (student) {
      setStudentData(student);
      setCgpa(student?.cgpa || 0);
      setOverallAttendance(student?.attendance || 0);
    }
  }, [student]);

  if (!isOpen || !studentData) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#3b82f6' : '#e5e7eb',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
    fontSize: '14px'
  });

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '10px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  };

  const thStyle = {
    backgroundColor: '#f3f4f6',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontSize: '13px',
    fontWeight: '600'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    fontSize: '13px'
  };

  // Assign Subject Handler
  const handleAssignSubject = async () => {
    setError('');
    setSuccessMsg('');

    // Validation
    if (!newSubject.subjectId.trim() || !newSubject.name.trim()) {
      setError('Subject ID and Name are required');
      return;
    }

    if (newSubject.mid1 < 0 || newSubject.mid2 < 0 || newSubject.final < 0) {
      setError('Marks cannot be negative');
      return;
    }

    if (newSubject.attendance_percent < 0 || newSubject.attendance_percent > 100) {
      setError('Attendance must be 0-100');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subjectId: newSubject.subjectId,
        name: newSubject.name,
        mid1: newSubject.mid1,
        mid2: newSubject.mid2,
        final: newSubject.final,
        attendance_percent: newSubject.attendance_percent
      };

      // Check if teacher is principal
      if (teacher?.email === 'principal@admin.com') {
        payload.role = 'principal';
        payload.principalPassword = teacher?.password;
      } else {
        payload.role = 'teacher';
        payload.email = teacher?.email;
        payload.password = teacher?.password;
      }

      const response = await fetch(`http://localhost:8080/api/students/${studentData.studentId}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign subject');
      }

      setSuccessMsg('✓ Subject assigned successfully!');
      setNewSubject({ subjectId: '', name: '', mid1: 0, mid2: 0, final: 0, attendance_percent: 0 });
      onSave(); // Refresh parent
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Subject Handler
  const handleEditSubject = async () => {
    if (!editingSubject) return;

    setError('');
    setSuccessMsg('');

    // Validation
    if (editingSubject.mid1 < 0 || editingSubject.mid2 < 0 || editingSubject.final < 0) {
      setError('Marks cannot be negative');
      return;
    }

    if (editingSubject.attendance_percent < 0 || editingSubject.attendance_percent > 100) {
      setError('Attendance must be 0-100');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        mid1: editingSubject.mid1,
        mid2: editingSubject.mid2,
        final: editingSubject.final,
        attendance_percent: editingSubject.attendance_percent,
        remarks: editingSubject.remarks
      };

      // Check if teacher is principal
      if (teacher?.email === 'principal@admin.com') {
        payload.role = 'principal';
        payload.principalPassword = teacher?.password;
      } else {
        payload.role = 'teacher';
        payload.email = teacher?.email;
        payload.password = teacher?.password;
      }

      const response = await fetch(`http://localhost:8080/api/students/${studentData.studentId}/subjects/${editingSubjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update subject');
      }

      setSuccessMsg('✓ Subject updated successfully!');
      setEditingSubjectId(null);
      setEditingSubject(null);
      onSave(); // Refresh parent
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Academics Handler
  const handleUpdateAcademics = async () => {
    setError('');
    setSuccessMsg('');

    if (cgpa < 0 || cgpa > 10) {
      setError('CGPA must be 0-10');
      return;
    }

    if (overallAttendance < 0 || overallAttendance > 100) {
      setError('Attendance must be 0-100');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cgpa: cgpa,
        attendance_percent: overallAttendance
      };

      // Check if teacher is principal
      if (teacher?.email === 'principal@admin.com') {
        payload.role = 'principal';
        payload.principalPassword = teacher?.password;
      } else {
        payload.role = 'teacher';
        payload.email = teacher?.email;
        payload.password = teacher?.password;
      }

      const response = await fetch(`http://localhost:8080/api/students/${studentData.studentId}/academics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update academics');
      }

      setSuccessMsg('✓ Academics updated successfully!');
      onSave(); // Refresh parent
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>📚 Manage Subjects for {studentData.name}</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <button style={tabButtonStyle(assignTab)} onClick={() => { setAssignTab(true); setError(''); setSuccessMsg(''); }}>
            ➕ Assign Subject
          </button>
          <button style={tabButtonStyle(!assignTab)} onClick={() => { setAssignTab(false); setError(''); setSuccessMsg(''); }}>
            📊 Edit Subjects & Academics
          </button>
        </div>

        {error && <div style={{ color: '#dc2626', marginBottom: '10px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '5px' }}>⚠️ {error}</div>}
        {successMsg && <div style={{ color: '#059669', marginBottom: '10px', padding: '10px', backgroundColor: '#d1fae5', borderRadius: '5px' }}>{successMsg}</div>}

        {assignTab ? (
          // Assign Subject Pane
          <div>
            <h3>Assign New Subject</h3>
            <div style={formGroupStyle}>
              <label>Subject ID *</label>
              <input
                style={inputStyle}
                placeholder="e.g., CS101"
                value={newSubject.subjectId}
                onChange={(e) => setNewSubject({ ...newSubject, subjectId: e.target.value })}
              />
            </div>

            <div style={formGroupStyle}>
              <label>Subject Name *</label>
              <input
                style={inputStyle}
                placeholder="e.g., Data Structures"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>
                <label>Mid 1 Marks</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={newSubject.mid1}
                  onChange={(e) => setNewSubject({ ...newSubject, mid1: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label>Mid 2 Marks</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={newSubject.mid2}
                  onChange={(e) => setNewSubject({ ...newSubject, mid2: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>
                <label>Final Marks</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={newSubject.final}
                  onChange={(e) => setNewSubject({ ...newSubject, final: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label>Attendance %</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  max="100"
                  value={newSubject.attendance_percent}
                  onChange={(e) => setNewSubject({ ...newSubject, attendance_percent: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <button style={buttonStyle} onClick={handleAssignSubject} disabled={loading}>
              {loading ? 'Assigning...' : '✓ Assign Subject'}
            </button>
          </div>
        ) : (
          // Edit Subjects & Academics Pane
          <div>
            <h3>Assigned Subjects</h3>
            {studentData?.subjects && studentData.subjects.length > 0 ? (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Subject ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Mid1</th>
                    <th style={thStyle}>Mid2</th>
                    <th style={thStyle}>Final</th>
                    <th style={thStyle}>Attend %</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.subjects.map((subj) => (
                    <tr key={subj.subjectId}>
                      <td style={tdStyle}>{subj.subjectId}</td>
                      <td style={tdStyle}>{subj.name}</td>
                      <td style={tdStyle}>
                        {editingSubjectId === subj.subjectId ? (
                          <input
                            style={{ ...inputStyle, width: '50px' }}
                            type="number"
                            value={editingSubject?.mid1 || 0}
                            onChange={(e) => setEditingSubject({ ...editingSubject, mid1: parseInt(e.target.value) || 0 })}
                          />
                        ) : (
                          subj.marks?.mid1 || 0
                        )}
                      </td>
                      <td style={tdStyle}>
                        {editingSubjectId === subj.subjectId ? (
                          <input
                            style={{ ...inputStyle, width: '50px' }}
                            type="number"
                            value={editingSubject?.mid2 || 0}
                            onChange={(e) => setEditingSubject({ ...editingSubject, mid2: parseInt(e.target.value) || 0 })}
                          />
                        ) : (
                          subj.marks?.mid2 || 0
                        )}
                      </td>
                      <td style={tdStyle}>
                        {editingSubjectId === subj.subjectId ? (
                          <input
                            style={{ ...inputStyle, width: '50px' }}
                            type="number"
                            value={editingSubject?.final || 0}
                            onChange={(e) => setEditingSubject({ ...editingSubject, final: parseInt(e.target.value) || 0 })}
                          />
                        ) : (
                          subj.marks?.final || 0
                        )}
                      </td>
                      <td style={tdStyle}>
                        {editingSubjectId === subj.subjectId ? (
                          <input
                            style={{ ...inputStyle, width: '60px' }}
                            type="number"
                            min="0"
                            max="100"
                            value={editingSubject?.attendance_percent || 0}
                            onChange={(e) => setEditingSubject({ ...editingSubject, attendance_percent: parseFloat(e.target.value) || 0 })}
                          />
                        ) : (
                          subj.attendance_percent?.toFixed(1) || 0
                        )}
                      </td>
                      <td style={tdStyle}>
                        {editingSubjectId === subj.subjectId ? (
                          <>
                            <button
                              style={{ ...buttonStyle, padding: '5px 10px', marginRight: '5px' }}
                              onClick={handleEditSubject}
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              style={{ ...buttonStyle, backgroundColor: '#999', padding: '5px 10px' }}
                              onClick={() => { setEditingSubjectId(null); setEditingSubject(null); }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            style={{ ...buttonStyle, padding: '5px 10px' }}
                            onClick={() => {
                              setEditingSubjectId(subj.subjectId);
                              setEditingSubject({ 
                                mid1: subj.marks?.mid1 || 0,
                                mid2: subj.marks?.mid2 || 0,
                                final: subj.marks?.final || 0,
                                attendance_percent: subj.attendance_percent || 0,
                                remarks: subj.remarks || ''
                              });
                            }}
                          >
                            ✎ Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#666' }}>No subjects assigned yet</p>
            )}

            <h3 style={{ marginTop: '30px' }}>Overall Academic Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={formGroupStyle}>
                <label>CGPA (0-10)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={cgpa !== '' ? cgpa : (studentData?.cgpa || 0)}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div style={formGroupStyle}>
                <label>Overall Attendance %</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={overallAttendance !== '' ? overallAttendance : (studentData?.attendance || 0)}
                  onChange={(e) => setOverallAttendance(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <button style={buttonStyle} onClick={handleUpdateAcademics} disabled={loading}>
              {loading ? 'Updating...' : '💾 Save Academic Info'}
            </button>
          </div>
        )}

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <button
            style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubjectsModal;
