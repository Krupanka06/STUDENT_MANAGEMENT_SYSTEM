import { useState } from 'react';

const TeacherRegister = ({ onSuccess, onCancel, showMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showMessage('Please enter your name', 'error');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showMessage('Please enter a valid email', 'error');
      return false;
    }
    if (formData.password.length < 4) {
      showMessage('Password must be at least 4 characters', 'error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return false;
    }
    if (!formData.department.trim()) {
      showMessage('Please select a department', 'error');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/teacher/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Registration successful! Awaiting principal approval.', 'success');
        setFormData({ name: '', email: '', password: '', confirmPassword: '', department: '' });
        setTimeout(() => onSuccess(), 1500);
      } else {
        showMessage(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showMessage('Connection error. Is server running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '30px',
    maxWidth: '500px',
    margin: '0 auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const selectStyle = {
    ...inputStyle
  };

  const btnContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  };

  const btnStyle = {
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const btnPrimaryStyle = {
    ...btnStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  };

  const btnSecondaryStyle = {
    ...btnStyle,
    background: '#e5e7eb',
    color: '#666'
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
        👨‍🏫 Teacher Registration
      </h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Register as a teacher. Your account will need principal approval to be active.
      </p>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleInputChange}
        style={inputStyle}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleInputChange}
        style={inputStyle}
      />

      <select
        name="department"
        value={formData.department}
        onChange={handleInputChange}
        style={selectStyle}
      >
        <option value="">Select Department</option>
        <option value="CSE">Computer Science</option>
        <option value="ECE">Electronics</option>
        <option value="MECH">Mechanical</option>
        <option value="CIVIL">Civil</option>
        <option value="EEE">Electrical</option>
      </select>

      <input
        type="password"
        name="password"
        placeholder="Password (min 4 characters)"
        value={formData.password}
        onChange={handleInputChange}
        style={inputStyle}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
        style={inputStyle}
      />

      <div style={btnContainerStyle}>
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            ...btnPrimaryStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registering...' : '✓ Register'}
        </button>
        <button
          onClick={onCancel}
          style={btnSecondaryStyle}
        >
          ✕ Cancel
        </button>
      </div>

      <div style={{
        background: '#f0f4ff',
        borderRadius: '10px',
        padding: '15px',
        marginTop: '20px',
        borderLeft: '4px solid #667eea'
      }}>
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>
          <strong>Note:</strong> After registration, your account will be pending principal approval. You can login once approved.
        </p>
      </div>
    </div>
  );
};

export default TeacherRegister;
