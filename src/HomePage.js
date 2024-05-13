import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth } from './firebase';


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
            <div className="taskbar">
                <NavLink to="/buton1" activeClassName="active-link" className="taskbar-link">Buton1</NavLink>
                <NavLink to="/buton2" activeClassName="active-link" className="taskbar-link">Buton2</NavLink>
                <NavLink to="/buton3" activeClassName="active-link" className="taskbar-link">Buton3</NavLink>
                <NavLink to="/buton4" activeClassName="active-link" className="taskbar-link">Buton4</NavLink>
                <button className="logout-button" onClick={handleSignOut}>Logout</button>
            </div>
        </div>
    );
};

export default HomePage;