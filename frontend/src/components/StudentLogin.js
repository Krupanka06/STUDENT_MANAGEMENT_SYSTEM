import React from 'react';

const StudentLogin = ({ onLogin, onSwitchToRegister, formData, setFormData, showMessage }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    const studentId = parseInt(formData.studentId);

    if (!studentId || !formData.password) {
      showMessage('Please enter student ID and password!', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId,
          password: formData.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data);
        showMessage('Login successful!', 'success');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        showMessage(data.error || 'Invalid credentials!', 'error');
      }
    } catch (error) {
      showMessage('Error during login', 'error');
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

  return (
    <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
        🎓 Student Login
      </h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Enter your student credentials
      </p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#555' }}>
          Student ID
        </label>
        <input
          type="number"
          name="studentId"
          value={formData.studentId}
          onChange={handleInputChange}
          placeholder="Enter student ID"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#555' }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Enter password"
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleLogin}
        style={{ ...buttonStyle, width: '100%', background: '#8b5cf6', color: 'white', fontSize: '16px' }}
      >
        🔓 Login
      </button>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button
          onClick={onSwitchToRegister}
          style={{ ...buttonStyle, background: 'transparent', color: '#8b5cf6', textDecoration: 'underline' }}
        >
          Don't have an account? Register here
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;
