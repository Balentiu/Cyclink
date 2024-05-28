import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth } from './firebase';
import logo from './logo.svg';
import './HomePage.css'

const HomePage = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOutUser(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <div className="homepage">
            <nav className="navbar">
            <NavLink to="/homepage" className="navbar-logo-link">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </NavLink>
                <div className="navbar-links">
                    <NavLink to="/profile" className="navbar-link">Profile</NavLink>
                    <NavLink to="/events" className="navbar-link">Events</NavLink>
                    <NavLink to="/goingevent" className="navbar-link">Going Events</NavLink>
                    <NavLink to="/bikeshopsmap" className="navbar-link">Bike Shops</NavLink>
                    <button className="logout-button" onClick={handleSignOut}>Logout</button>
                </div>
            </nav>
            <div className="background-container">
            <div className="text-overlay">
                <h1>Welcome to Cyclink!</h1>
                <p>Your ultimate cycling companion!</p>
            </div>
            </div>
        </div>
    );
};

export default HomePage;
