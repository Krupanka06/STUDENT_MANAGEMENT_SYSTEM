import { useState } from 'react';

const StudentRegister = ({ onSuccess, onCancel, showMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: 1
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.password || !formData.email || !formData.department) {
      showMessage('Please fill all required fields!', 'error');
      return;
    }

    if (formData.password.length < 4) {
      showMessage('Password must be at least 4 characters!', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showMessage('Passwords do not match!', 'error');
      return;
    }

    if (formData.year < 1 || formData.year > 6) {
      showMessage('Year must be between 1 and 6!', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
          email: formData.email,
          department: formData.department,
          year: parseInt(formData.year)
        })
      });

      const data = await response.json();
      if (response.ok) {
        showMessage(`Registration successful! Student ID: ${data.studentId}. Please login.`, 'success');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          department: '',
          year: 1
        });
        setTimeout(() => onSuccess(), 1500);
      } else {
        showMessage(data.error || 'Error during registration', 'error');
      }
    } catch (error) {
      showMessage('Error during registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '15px',
    fontFamily: 'inherit'
  };

  const selectStyle = inputStyle;

  const btnContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  };

  const buttonStyle = {
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const btnPrimaryStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  };

  const btnSecondaryStyle = {
    ...buttonStyle,
    background: '#e5e7eb',
    color: '#666'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '30px',
    maxWidth: '500px',
    margin: '0 auto'
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
        🎓 Student Registration
      </h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Create a new student account
      </p>
      
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Full Name"
        style={inputStyle}
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email Address"
        style={inputStyle}
      />

      <select
        name="department"
        value={formData.department}
        onChange={handleInputChange}
        style={selectStyle}
      >
        <option value="">Select Department</option>
        <option value="CSE">Computer Science & Engineering</option>
        <option value="ECE">Electronics & Communication</option>
        <option value="MECH">Mechanical Engineering</option>
        <option value="CIVIL">Civil Engineering</option>
        <option value="EEE">Electrical Engineering</option>
      </select>

      <select
        name="year"
        value={formData.year}
        onChange={handleInputChange}
        style={selectStyle}
      >
        <option value={1}>1st Year</option>
        <option value={2}>2nd Year</option>
        <option value={3}>3rd Year</option>
        <option value={4}>4th Year</option>
        <option value={5}>5th Year</option>
        <option value={6}>6th Year</option>
      </select>

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password (min 4 characters)"
        style={inputStyle}
      />

      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        placeholder="Confirm Password"
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
    </div>
  );
};

export default StudentRegister;