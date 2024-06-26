import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate(); // React Router hook to navigate programmatically
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => {
    setIsLogin(false);
    navigate('/signup'); // Navigate to signup page
  };

  const switchToLogin = () => {
    setIsLogin(true);
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login switchToSignup={switchToSignup} onLogin={onLogin} />
      ) : (
        <Signup switchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default Auth;
