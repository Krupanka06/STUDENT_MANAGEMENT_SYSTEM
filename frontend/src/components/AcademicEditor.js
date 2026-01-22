import { useState } from 'react';

/**
 * AcademicEditor - Reusable component for editing marks and attendance per subject
 * Props:
 *   - subject: Subject object with { subjectId, name, marks: { mid1, mid2, final, total }, attendance_percent, remarks }
 *   - studentId: ID of the student
 *   - userRole: 'student', 'teacher', or 'principal'
 *   - teacherEmail: Email of teacher (required if userRole === 'teacher')
 *   - onSave: Callback function after successful save
 *   - showMessage: Message callback function
 */
const AcademicEditor = ({ subject, studentId, userRole, teacherEmail, onSave, showMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mid1: subject?.mid1 || 0,
    mid2: subject?.mid2 || 0,
    final: subject?.final || 0,
    attendance_percent: subject?.attendance_percent || 0,
    remarks: subject?.remarks || ''
  });
  const [authPassword, setAuthPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isReadOnly = userRole === 'student';

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAuthPassword('');
    setError('');
    setFormData({
      mid1: subject?.mid1 || 0,
      mid2: subject?.mid2 || 0,
      final: subject?.final || 0,
      attendance_percent: subject?.attendance_percent || 0,
      remarks: subject?.remarks || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'remarks' ? value : parseFloat(value) || 0
    }));
  };

  const validateForm = () => {
    const { mid1, mid2, final, attendance_percent } = formData;
    if (mid1 < 0 || mid2 < 0 || final < 0) {
      setError('Marks cannot be negative');
      return false;
    }
    if (attendance_percent < 0 || attendance_percent > 100) {
      setError('Attendance must be between 0 and 100');
      return false;
    }
    if (!authPassword) {
      setError(`${userRole === 'teacher' ? 'Teacher' : 'Principal'} password required`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setError('');
    const { mid1, mid2, final, attendance_percent, remarks } = formData;
    const total = mid1 + mid2 + final;

    try {
      const payload = {
        mid1: parseInt(mid1),
        mid2: parseInt(mid2),
        final: parseInt(final),
        attendance_percent: parseFloat(attendance_percent),
        remarks: remarks || ''
      };

      if (userRole === 'teacher') {
        payload.role = 'teacher';
        payload.email = teacherEmail;
        payload.password = authPassword;
      } else if (userRole === 'principal') {
        payload.role = 'principal';
        payload.principalPassword = authPassword;
      }

      const res = await fetch(`http://localhost:8080/api/students/${studentId}/subjects/${subject.subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status === 200) {
        showMessage && showMessage('Subject updated successfully', 'success');
        setIsEditing(false);
        setAuthPassword('');
        onSave && onSave();
      } else if (res.status === 403) {
        setError('Forbidden: You do not have permission to update this subject');
      } else if (res.status === 400) {
        setError(data.error || 'Validation failed');
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (e) {
      setError('Connection error: unable to save');
    } finally {
      setIsSaving(false);
    }
  };

  const containerStyle = {
    background: '#f9fafb',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const subjectNameStyle = {
    fontWeight: '600',
    fontSize: '15px',
    color: '#333',
    margin: 0
  };

  const subjectIdStyle = {
    fontSize: '12px',
    color: '#999',
    margin: '4px 0 0 0'
  };

  const marksGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
    marginBottom: '12px'
  };

  const markItemStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const markLabelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '4px'
  };

  const markValueStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
  };

  const markInputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box'
  };

  const attendanceStyle = {
    background: '#e0e7ff',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '12px'
  };

  const remarksStyle = {
    marginBottom: '12px'
  };

  const textareaStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '60px',
    boxSizing: 'border-box'
  };

  const buttonsStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  };

  const buttonStyle = (variant) => {
    const baseStyle = {
      padding: '8px 14px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      transition: 'all 0.3s ease'
    };

    if (variant === 'edit') {
      return { ...baseStyle, background: '#667eea', color: 'white' };
    } else if (variant === 'save') {
      return { ...baseStyle, background: '#10b981', color: 'white' };
    } else if (variant === 'cancel') {
      return { ...baseStyle, background: '#ef4444', color: 'white' };
    }
    return baseStyle;
  };

  const errorStyle = {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '12px',
    borderLeft: '4px solid #ef4444'
  };

  const passwordInputStyle = {
    ...markInputStyle,
    marginTop: '8px'
  };

  const total = formData.mid1 + formData.mid2 + formData.final;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h4 style={subjectNameStyle}>{subject?.name || 'Subject'}</h4>
          <p style={subjectIdStyle}>{subject?.subjectId || ''}</p>
        </div>
        {!isEditing && !isReadOnly && (
          <button onClick={handleEdit} style={buttonStyle('edit')}>
            ✏️ Edit
          </button>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {!isEditing ? (
        <>
          <div style={marksGridStyle}>
            <div style={markItemStyle}>
              <span style={markLabelStyle}>Mid 1</span>
              <span style={markValueStyle}>{subject?.mid1 || 0}</span>
            </div>
            <div style={markItemStyle}>
              <span style={markLabelStyle}>Mid 2</span>
              <span style={markValueStyle}>{subject?.mid2 || 0}</span>
            </div>
            <div style={markItemStyle}>
              <span style={markLabelStyle}>Final</span>
              <span style={markValueStyle}>{subject?.final || 0}</span>
            </div>
            <div style={markItemStyle}>
              <span style={markLabelStyle}>Total</span>
              <span style={markValueStyle}>{subject?.total || 0}</span>
            </div>
          </div>

          <div style={attendanceStyle}>
            <span style={markLabelStyle}>Attendance</span>
            <div style={{ marginTop: '6px', fontSize: '18px', fontWeight: 'bold', color: '#4338ca' }}>
              {subject?.attendance_percent?.toFixed(2) || 0}%
            </div>
          </div>

          {subject?.remarks && (
            <div style={remarksStyle}>
              <span style={markLabelStyle}>Remarks</span>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                {subject.remarks}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={marksGridStyle}>
            <div style={markItemStyle}>
              <label style={markLabelStyle}>Mid 1</label>
              <input
                type="number"
                name="mid1"
                min="0"
                value={formData.mid1}
                onChange={handleChange}
                style={markInputStyle}
                disabled={isSaving}
              />
            </div>
            <div style={markItemStyle}>
              <label style={markLabelStyle}>Mid 2</label>
              <input
                type="number"
                name="mid2"
                min="0"
                value={formData.mid2}
                onChange={handleChange}
                style={markInputStyle}
                disabled={isSaving}
              />
            </div>
            <div style={markItemStyle}>
              <label style={markLabelStyle}>Final</label>
              <input
                type="number"
                name="final"
                min="0"
                value={formData.final}
                onChange={handleChange}
                style={markInputStyle}
                disabled={isSaving}
              />
            </div>
            <div style={markItemStyle}>
              <label style={markLabelStyle}>Total</label>
              <div style={{ ...markValueStyle, padding: '8px', background: '#e5e7eb', borderRadius: '6px' }}>
                {total}
              </div>
            </div>
          </div>

          <div style={attendanceStyle}>
            <label style={markLabelStyle}>Attendance %</label>
            <input
              type="number"
              name="attendance_percent"
              min="0"
              max="100"
              step="0.5"
              value={formData.attendance_percent}
              onChange={handleChange}
              style={{ ...markInputStyle, marginTop: '6px' }}
              disabled={isSaving}
            />
          </div>

          <div style={remarksStyle}>
            <label style={markLabelStyle}>Remarks (Optional)</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Enter any remarks or comments..."
              disabled={isSaving}
            />
          </div>

          <div style={remarksStyle}>
            <label style={markLabelStyle}>
              {userRole === 'teacher' ? 'Teacher Password' : 'Principal Password'}
            </label>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              style={passwordInputStyle}
              placeholder="Enter your password"
              disabled={isSaving}
            />
          </div>

          <div style={buttonsStyle}>
            <button
              onClick={handleCancel}
              style={buttonStyle('cancel')}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={buttonStyle('save')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AcademicEditor;
