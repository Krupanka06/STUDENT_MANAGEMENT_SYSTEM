const LandingPage = ({ onEnter }) => {
  const landingStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1A73E8 0%, #00A8CC 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
    color: 'white'
  };

  const contentStyle = {
    maxWidth: '800px',
    zIndex: 10,
    animation: 'slideUp 0.8s ease'
  };

  const logoStyle = {
    fontSize: '80px',
    marginBottom: '20px',
    animation: 'bounce 2s infinite'
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const subtitleStyle = {
    fontSize: '20px',
    marginBottom: '30px',
    opacity: 0.9,
    lineHeight: '1.6'
  };

  const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const featureCardStyle = {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease'
  };

  const featureIconStyle = {
    fontSize: '40px',
    marginBottom: '10px'
  };

  const featureTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const featureDescStyle = {
    fontSize: '13px',
    opacity: 0.8
  };

  const buttonStyle = {
    background: 'white',
    color: '#1A73E8',
    border: 'none',
    padding: '15px 50px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    display: 'inline-block'
  };

  const handleHover = (e) => {
    e.target.style.transform = 'translateY(-3px)';
    e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
  };

  const handleHoverOut = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
  };

  const floatingShapeStyle = (top, left, delay) => ({
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    width: '200px',
    height: '200px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    animation: `float ${8 + delay}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    zIndex: 1
  });

  return (
    <div style={landingStyle}>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(30px);
          }
        }

        .feature-card:hover {
          background: rgba(255,255,255,0.2) !important;
          transform: translateY(-10px) !important;
        }
      `}</style>

      <div style={floatingShapeStyle(10, 10, 0)}></div>
      <div style={floatingShapeStyle(60, 80, 2)}></div>
      <div style={floatingShapeStyle(80, 20, 4)}></div>

      <div style={contentStyle}>
        <div style={logoStyle}>🎓</div>
        <h1 style={titleStyle}>Student Management System</h1>
        <p style={subtitleStyle}>
          Your comprehensive platform for managing student enrollment, teacher approvals, and academic progress
        </p>

        <div style={featureGridStyle}>
          <div style={featureCardStyle} className="feature-card">
            <div style={featureIconStyle}>👨‍🎓</div>
            <div style={featureTitleStyle}>For Students</div>
            <div style={featureDescStyle}>View profiles, track academics, and manage enrollment</div>
          </div>

          <div style={featureCardStyle} className="feature-card">
            <div style={featureIconStyle}>👨‍🏫</div>
            <div style={featureTitleStyle}>For Teachers</div>
            <div style={featureDescStyle}>Manage classes, student records, and get approvals</div>
          </div>

          <div style={featureCardStyle} className="feature-card">
            <div style={featureIconStyle}>👔</div>
            <div style={featureTitleStyle}>For Principal</div>
            <div style={featureDescStyle}>Approve teachers and oversee all operations</div>
          </div>
        </div>

        <button
          onClick={onEnter}
          style={buttonStyle}
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOut}
        >
          🚀 Enter Portal
        </button>

        <p style={{ marginTop: '40px', opacity: 0.8, fontSize: '14px' }}>
          © 2025 Student Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
