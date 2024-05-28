import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth, ref, onValue, set } from './firebase';
import { getDatabase} from 'firebase/database';
import logo from './logo.svg';
import './GoingEventPage.css'

const GoingEventPage = () => {
    const navigate = useNavigate();
    const [goingEvents, setGoingEvents] = useState([]);

    const handleSignOut = () => {
        signOutUser(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    const database = getDatabase();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const database = getDatabase();
            const userEventsRef = ref(database, `users/${user.uid}/goingEvents`);
            onValue(userEventsRef, (snapshot) => {
                const eventData = snapshot.val();
                if (eventData) {
                    const eventIds = Object.keys(eventData);
                    const promises = eventIds.map((eventId) => {
                        const eventRef = ref(database, `events/${eventId}`);
                        return new Promise((resolve) => {
                            onValue(eventRef, (snapshot) => {
                                const eventDetails = snapshot.val();
                                resolve({ id: eventId, ...eventDetails });
                            });
                        });
                    });
                    Promise.all(promises).then((events) => {
                        setGoingEvents(events);
                    });
                } else {
                    setGoingEvents([]);
                }
            });
        }
    }, [database]);

    const handleLeaveEvent = (eventId) => {
        const user = auth.currentUser;
        if (user) {
            const eventRef = ref(database, `events/${eventId}/participants/${user.uid}`);
            set(eventRef, null);

            const userEventsRef = ref(database, `users/${user.uid}/goingEvents/${eventId}`);
            set(userEventsRef, null);
        }
    };

    return (
        <div className="goingeventpage">

            <nav className="navbar">
            <NavLink to="/homepage" className="navbar-logo-link">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </NavLink>
                <div className="navbar-links">
                    <NavLink to="/profile" className="navbar-link">Profile</NavLink>
                    <NavLink to="/events" className="navbar-link">Events</NavLink>
                    <NavLink to="/goingevent" className="navbar-link">Going Events</NavLink>
                    <NavLink yo="/bikeshopsmap" className="navbar-link">Bike Shops</NavLink>
                    <button className="logout-button" onClick={handleSignOut}>Logout</button>
                </div>
            </nav>

            <div className="goingeventpage-content">
                <h2>Going Events</h2>
                <div className="events-list">
                    {goingEvents.map((event) => (
                        <div className="event-block" key={event.id}>
                            <h3>{event.name}</h3>
                            <p>Data: {event.date}</p>
                            <p>Locație: {event.location}</p>
                            <p>Lungime traseu: {event.length}</p>
                            <p>Tipul traseului: {event.type}</p>
                            <p>Dificultate: {event.difficulty}</p>
                            <button onClick={() => handleLeaveEvent(event.id)}>Părăsește evenimentul</button>
                            <p>Participanți:</p>
                            <ul>
                                {event.participants && Object.values(event.participants).map((participant, index) => (
                                    <li key={index}>{participant.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoingEventPage;
