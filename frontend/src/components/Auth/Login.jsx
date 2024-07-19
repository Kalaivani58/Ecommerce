import React, { useState } from 'react';
import './Auth.css';

const Login = ({ switchToSignup, onLogin}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value.trim());
    setEmailError('');
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.trim());
    setPasswordError('');
    setError('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    const emailValue = email.trim();
    const passwordValue = password.trim();
  
    if (emailValue === '') {
      setEmailError('Email required');
    }
  
    if (passwordValue === '') {
      setPasswordError('Password required');
    }
  
    if (passwordValue !== '' && emailValue !== '') {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailValue, password: passwordValue }),  
        });
  
        if (!response.ok) {
          const data = await response.json();
          console.log(data);
          setError('Please check your email and password..!!!');
        } else {
          const data = await response.json();
          document.cookie = `token=${data.token}; HttpOnly; max-age=${240 * 60 * 60}; path=/`;
          // alert('Successfully logged in..');
          onLogin(data.name);
        }
      } catch (error) {
        setError('Error logging in');
      }
    }
  };
  
    

  return (
    <div className="card" style={{ width: '30rem' }}>
      <div className="card-body">
        <h2 className="card-title text-center">Login</h2>
        {error && <div style={{ display: 'block', color: '#dc3545' }}>{error}</div>}
        <form>
          <div className="form-group">
            <label htmlFor="logEmail" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              className={`form-control ${emailError ? 'error' : ''}`}
              id="logEmail"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              pattern="[a-z0-9]+@[a-z]+\.[a-z]{2,}$"
              autoComplete="off"
            />
            {emailError && <div className="invalid" style={{ display: 'block', color: '#dc3545' }}>{emailError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="logpassword" className="form-label">
              Password
            </label>
            <div className="position-relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className={`form-control ${passwordError ? 'error' : ''}`}
                id="logpassword"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="off"
              />
              <span className="toggle-password" id="log-togglePassword" onClick={handleTogglePassword}>
                <i className={`fas ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </span>
            </div>
            {passwordError && <div className="invalid" style={{ display: 'block', color: '#dc3545' }}>{passwordError}</div>}
          </div>
          <button type="submit" onClick={handleLogin} className="btn btn-primary btn-block">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <a href="#" onClick={switchToSignup}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
