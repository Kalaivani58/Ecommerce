import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Ecom/Dashboard';
import Auth from './components/Auth/Auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/verifyToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(true);
            setUserData(data); // Store user data upon successful verification

            // console.log(data);
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
    };

    verifyToken();
  }, []); // Run once on component mount

  const handleLogin = (username)=>{ 
    setUserData({username:username});
    // console.log(userData);
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: '75px' }}>
          <div className="container">
            <a className="navbar-brand" href="#">
              Ecommerce
            </a>
            {isLoggedIn && userData ? (
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto align-items-center">
                  <li className="nav-item d-flex align-items-center">
                    <i className="fas fa-user-circle fa-lg" style={{ marginRight: '10px' }} />
                    <span className="nav-link" style={{ marginRight: '10px' }}>
                      Welcome, {userData.username}
                    </span>
                    <a className="nav-link" href="#" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </nav>
        {isLoggedIn ? <Dashboard /> : <Auth onLogin={handleLogin} />}
      </div>
    </Router>
  );
};

export default App;



