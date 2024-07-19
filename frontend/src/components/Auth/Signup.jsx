import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Auth.css';

const Signup = ({ switchToLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  // Function to determine input field classes
  const getInputClass = (errorState, validState) => {
    if (errorState) {
      return 'form-control error';
    } else if (validState) {
      return 'form-control noerror';
    } else {
      return 'form-control';
    }
  };

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.querySelector('i').classList.remove('fa-eye-slash');
      toggleIcon.querySelector('i').classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      toggleIcon.querySelector('i').classList.remove('fa-eye');
      toggleIcon.querySelector('i').classList.add('fa-eye-slash');
    }
  };


  const getPasswordStrength = (password) => {
    const patternRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/|<>~`]).{8,15}$/;
    if (patternRegex.test(password)) {
      return 'patternMatch';
    } else {
      return 'invalid';
    }
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    setNameError('');
    setNameValid(value.trim().length > 0);
    if (!event.target.checkValidity()) {
      setNameError('Please enter a valid email');
      setNameValid(false);
      return;
    }
  };

  const handleEmailChange = async (event) => {
    const emailValue = event.target.value.trim();
    setEmail(emailValue);
    console.log("here", emailValue);  
    setEmailError('');

    if (!event.target.checkValidity()) {
      setEmailError('Please enter a valid email');
      setEmailValid(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/checkEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailValue }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setEmailError('Email already exists');
          setEmailValid(false);
        } else {
          setEmailValid(true);
        }
      } else {
        throw new Error('Failed to check email availability');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailError('Error checking email availability');
      setEmailValid(false);
    }
  };


  const [passwordBorderColor, setPasswordBorderColor] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');


  const handlePasswordStrength = (passwordValue) => {
    const passwordLength = passwordValue.length;
    const passwordStrength = getPasswordStrength(passwordValue);

    if (passwordLength < 8 || passwordLength > 15) {
      return { feedback: 'Password should be between 8 and 15 characters.', borderColor: '#dc3545', color: '#dc3545' };
    } else if (passwordStrength === 'patternMatch' && passwordLength === 8) {
      return { feedback: 'Weak password', borderColor: '#dc3545', color: '#dc3545' };
    } else if (passwordStrength === 'patternMatch' && passwordLength > 8 && passwordLength <= 12) {
      return { feedback: 'Strong password', borderColor: '#ffc107', color: '#ffc107' };
    } else if (passwordStrength === 'patternMatch' && passwordLength >= 13 && passwordLength <= 15) {
      return { feedback: 'Super strong password', borderColor: '#198754', color: '#198754' };
    } else {
      return { feedback: 'Password should have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character', borderColor: '#dc3545', color: '#dc3545' };
    }
  };


  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordError('');
    setPasswordValid(value.trim().length > 0);

    // Handle password strength feedback
    const { feedback, borderColor, color } = handlePasswordStrength(value);
    setPasswordError(feedback);
    setPasswordBorderColor(borderColor);
    setFeedbackColor(color);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    // console.log("heloooo there");

    // Validate name
    if (name.trim() === '') {
      setNameError('Name required');
      setNameValid(false);
      // return;
    } else {
      setNameValid(true);
    }

    // Validate email
    const emailValue = email.trim();
    if (emailValue === '') {
      setEmailError('Email required');
      setEmailValid(false);
      // return;
    } else if (!emailValid) {
      return; // If there's an email error already shown, do not proceed
    }

    // Validate password
    if (password.trim() === '') {
      setPasswordError('Password required');
      setPasswordValid(false);
      // return;
    } else {
      setPasswordValid(true);
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email: emailValue, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign up');
      }

      // alert('Signup successful! Please login to continue.');
      navigate('/login');
      switchToLogin();
    } catch (error) {
      console.error('Signup error:', error);
      // Handle specific errors if needed
      // setError(error.message); // Set a general error state if required
    }
  };

  return (
    <div className="card" style={{width: "30rem"}}>
      <div className="card-body">
        <h2 className="card-title text-center">Sign Up</h2>
        <form >
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className={getInputClass(nameError, nameValid)}
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
              pattern="[A-Za-z\s]+"
              autoComplete="off"
            />
            {nameError && <div className="invalid" style={{ display: 'block' }}>{nameError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="Email" className="form-label">E-mail</label>
            <input
              type="email"
              className={getInputClass(emailError, emailValid)}
              id="Email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              pattern="[a-z0-9]+@[a-z]+\.[a-z]{2,}$"
              autoComplete="off"
            />
            {emailError && <div className="invalid" style={{ display: 'block' }}>{emailError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="position-relative">
              <input
                type="password"
                className={getInputClass(passwordError, passwordValid)}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="off"
                style={{ borderColor: passwordBorderColor }}
              />
              <span className="toggle-password" id="togglePassword" onClick={togglePasswordVisibility}>
                <i className="fas fa-eye-slash"></i>
              </span>
            </div>
            {passwordError && <div className="invalid" style={{ display: 'block' , color: feedbackColor}}>{passwordError}</div>}
          </div>
          <button type="submit" onClick={handleSignup} className="btn btn-primary btn-block">Sign Up</button>
        </form>
        <p className="text-center mt-3">Already have an account? <a href="#" onClick={switchToLogin}>Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
