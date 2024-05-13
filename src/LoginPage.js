import React, { useState } from 'react';
import './LoginPage.css';
import logo from './logo.svg';
import { NavLink, useNavigate } from 'react-router-dom'
import { signInUserAuth, auth } from './firebase';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        await signInUserAuth(auth, email, password);
        navigate('/homepage');
    } catch (error) {
      setError("Date invalide!");
    }
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
              onChange={(e) => setEmail(e.target.value)}
              className="text-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Parolă:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
              required
            />
          </div>
          <button className="login-button" type="button" onClick={handleLogin}>
            Login
          </button>
          {error && <p>{error}</p>}
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
