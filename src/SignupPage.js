import React, { useState } from 'react';
import './SignupPage.css';
import logo from './logo.svg';
import { NavLink } from 'react-router-dom'

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
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
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            <button className="signup-button" type="button" onClick={handleSignUp}>
                Sign Up
            </button>
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
