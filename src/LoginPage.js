import React, { useState } from 'react';
import './LoginPage.css';
import logo from './logo.svg';
import { NavLink } from 'react-router-dom'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
  <div className='login-page'>
    <div className="login-wrapper">
      <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="login-text">Bun venit!</h2>
        <form>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="text-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Parolă:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="text-input"
              required
            />
          </div>
          <button className="login-button" type="button" onClick={handleLogin}>
            Login
          </button>
          <p className='signup-link'>
            Nu ai cont creat? Pentru a crea unul apasă <NavLink to='/signup' activeStyle>aici</NavLink>!
          </p>
        </form>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
