import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth, database, ref, onValue, set } from './firebase';
import logo from './logo.svg';
import './ProfilePage.css'

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        fullName: '',
        age: '',
        gender: 'Masculin',
        experience: 'Începător',
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const profileRef = ref(database, `users/${user.uid}/profile`);
            onValue(profileRef, (snapshot) => {
                setProfile(snapshot.val() || {});
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSaveProfile = () => {
        const user = auth.currentUser;
        if (user) {
            const profileRef = ref(database, `users/${user.uid}/profile`);
            set(profileRef, profile);
        }
    };

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
        <div className="profilepage">
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
            <div className="profile-container">
                <div className='profile-wrapper'>
                    <div className="profile-container">
                        <h2 className='profile-title'>Profile Details</h2>
                        <form>
                        <div className='form-group'>
                            <label className='profile-section-title'>Nume întreg:</label>
                            <input className='text-input' type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} />
                        </div>

                        <div className='form-group'>
                        <label className='profile-section-title'>Vârsta:</label>
                        <input className='text-input' type="number" name="age" value={profile.age} onChange={handleInputChange} />
                        </div>

                        <div className='form-group'>
                        <label className='profile-section-title'>Gen:</label>
                        <select name="gender" value={profile.gender} onChange={handleInputChange}>
                            <option value="Male">Masculin</option>
                            <option value="Female">Feminim</option>
                            <option value="Other">Altul</option>
                        </select>
                        </div>

                        <div className='form-group'>
                        <label className='profile-section-title'>Experiența:</label>
                        <select name="experience" value={profile.experience} onChange={handleInputChange}>
                            <option value="Începător">Începător</option>
                            <option value="Avansat">Avansat</option>
                        </select>
                        </div>

                        <button className='profile-button' type="button" onClick={handleSaveProfile}>Salvează</button>
                        </form>
            </div>
            </div>
            </div>
        </div>
    );
};

export default ProfilePage;
