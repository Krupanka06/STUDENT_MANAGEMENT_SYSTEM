import { useState } from 'react';
import '../styles/LoginSelector.css';

const LoginSelector = ({ onLogin, onRegisterClick, showMessage }) => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [credentials, setCredentials] = useState({
    studentId: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let body = {};

      if (selectedRole === 'student') {
        if (!credentials.studentId || !credentials.password) {
          showMessage('Please enter Student ID and password', 'error');
          setLoading(false);
          return;
        }
        endpoint = 'http://localhost:8080/api/student/login';
        body = { studentId: parseInt(credentials.studentId), password: credentials.password };
      } else if (selectedRole === 'teacher') {
        if (!credentials.email || !credentials.password) {
          showMessage('Please enter email and password', 'error');
          setLoading(false);
          return;
        }
        endpoint = 'http://localhost:8080/api/teacher/login';
        body = { email: credentials.email, password: credentials.password };
      } else if (selectedRole === 'principal') {
        if (!credentials.password) {
          showMessage('Please enter principal password', 'error');
          setLoading(false);
          return;
        }
        endpoint = 'http://localhost:8080/api/principal/login';
        body = { password: credentials.password };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(selectedRole, data);
        setCredentials({ studentId: '', email: '', password: '' });
      } else {
        showMessage(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('Connection error. Is server running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-selector-wrapper">
      {/* Background decoration */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-container">
        {/* Left Side - Brand/Welcome */}
        <div className="login-brand-section">
          <div className="brand-content">
            <div className="brand-icon">🎓</div>
            <h1 className="brand-title">Student Management</h1>
            <p className="brand-subtitle">A modern platform for educational excellence</p>
            
            <div className="brand-features">
              <div className="brand-feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Secure & Reliable</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Easy to Use</span>
              </div>
              <div className="brand-feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">Multi-Role Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Select your role and enter credentials</p>
          </div>

          {/* Role Selector - Tabs Style */}
          <div className="role-tabs">
            {['student', 'teacher', 'principal'].map((role) => (
              <button
                key={role}
                className={`role-tab ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
                title={`${role.charAt(0).toUpperCase() + role.slice(1)} Login`}
              >
                <span className="tab-icon">
                  {role === 'student' && '🎓'}
                  {role === 'teacher' && '👨‍🏫'}
                  {role === 'principal' && '👔'}
                </span>
                <span className="tab-label">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </button>
            ))}
          </div>

          {/* Form Inputs */}
          <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            {selectedRole === 'student' && (
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  id="studentId"
                  type="number"
                  name="studentId"
                  placeholder="Enter your student ID"
                  value={credentials.studentId}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            )}

            {selectedRole === 'teacher' && (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your.email@school.edu"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">
                {selectedRole === 'principal' ? 'Principal Password' : 'Password'}
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-login ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Register Buttons */}
          <div className="register-section">
            <p className="register-divider">
              <span>Don't have an account?</span>
            </p>
            {selectedRole === 'student' && (
              <button
                onClick={() => onRegisterClick('student')}
                className="btn-register"
              >
                Create Student Account
              </button>
            )}
            {selectedRole === 'teacher' && (
              <button
                onClick={() => onRegisterClick('teacher')}
                className="btn-register"
              >
                Register as Teacher
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;
