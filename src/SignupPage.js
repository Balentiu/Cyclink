import React, { useState } from 'react';
import './SignupPage.css';
import logo from './logo.svg';
import { NavLink, useNavigate } from 'react-router-dom'
import { createUserAuth, auth  } from './firebase';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const handleSignUp = async () => {
    try {
      await createUserAuth(auth, email, password);
      navigate('/');
    } catch (error) {
      setError("Date invalide!");
    }
};

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-container">
        <img src={logo} alt="Logo" className="logo" />
          <h2 className="signup-text">Sign Up</h2>
          <form>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="signup-button" type="button" onClick={handleSignUp}>
                Sign Up
            </button>
            {error && <p>{error}</p>}
            <p className='login-link'>
             Ți-ai facut contul? Întoarce-te la pagina de logare apăsând <NavLink to='/' activeStyle>aici</NavLink>!
             </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
