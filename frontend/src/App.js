import { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import LoginSelector from './components/LoginSelector';
import PrincipalDashboard from './components/PrincipalDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentRegister from './components/StudentRegister';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherRegister from './components/TeacherRegister';

const StudentManagementSystem = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleLogin = (role, data) => {
    setUserRole(role);
    setUserData(data);
    setCurrentView(role === 'student' ? 'student-dashboard' :
                   role === 'teacher' ? 'teacher-dashboard' :
                   role === 'principal' ? 'principal-dashboard' :
                   'login-select');
    showMessage(`Welcome ${data.name || 'Principal'}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setUserRole(null);
    setUserData(null);
    setShowRegister(false);
    setRegisterRole(null);
    showMessage('Logged out successfully', 'success');
  };

  const handleRegisterClick = (role) => {
    setRegisterRole(role);
    setShowRegister(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setRegisterRole(null);
    setCurrentView('login-select');
    showMessage('Registration successful! Please login.', 'success');
  };

  return (
    <div className="app-container">


      <div className="main-content">
        <div className="header">
          <div>
            <h1>🎓 Student Management System</h1>
            <p className="header-subtitle">
              {currentView === 'landing' ? 'Welcome to Excellence' :
               currentView === 'login-select' ? 'Portal Login' :
               userRole === 'student' ? `Student: ${userData?.name}` :
               userRole === 'teacher' ? `Teacher: ${userData?.name}` :
               userRole === 'principal' ? 'Principal Dashboard' :
               'Dashboard'}
            </p>
          </div>
          <div className="header-buttons">
            {currentView !== 'landing' && currentView !== 'login-select' && (
              <button onClick={handleLogout} className="btn btn-danger">🚪 Logout</button>
            )}
            {currentView === 'login-select' && (
              <button onClick={() => setCurrentView('landing')} className="btn btn-secondary">← Back</button>
            )}
          </div>
        </div>

        {message && (
          <div className={`message message-${messageType}`}>
            {message}
          </div>
        )}

        <div className="content-area">
          {currentView === 'landing' && (
            <LandingPage onEnter={() => setCurrentView('login-select')} />
          )}

          {currentView === 'login-select' && !showRegister && (
            <LoginSelector 
              onLogin={handleLogin}
              onRegisterClick={handleRegisterClick}
              showMessage={showMessage}
            />
          )}

          {showRegister && registerRole === 'student' && (
            <StudentRegister 
              onSuccess={handleRegisterSuccess}
              onCancel={() => { setShowRegister(false); setRegisterRole(null); }}
              showMessage={showMessage}
            />
          )}

          {showRegister && registerRole === 'teacher' && (
            <TeacherRegister 
              onSuccess={handleRegisterSuccess}
              onCancel={() => { setShowRegister(false); setRegisterRole(null); }}
              showMessage={showMessage}
            />
          )}

          {currentView === 'student-dashboard' && (
            <StudentDashboard 
              studentData={userData}
              onLogout={handleLogout}
              showMessage={showMessage}
              userRole={userRole}
            />
          )}

          {currentView === 'teacher-dashboard' && (
            <TeacherDashboard 
              teacherData={userData}
              onLogout={handleLogout}
              showMessage={showMessage}
            />
          )}

          {currentView === 'principal-dashboard' && (
            <PrincipalDashboard 
              onLogout={handleLogout}
              showMessage={showMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagementSystem;