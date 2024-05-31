import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth, ref, onValue, set } from './firebase';
import { getDatabase} from 'firebase/database';
import logo from './logo.svg';
import './GoingEventPage.css'

const GoingEventPage = () => {
    const navigate = useNavigate();
    const [goingEvents, setGoingEvents] = useState([]);
    const [loading, setLoading]=useState(true);

    const handleSignOut = () => {
        signOutUser(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const database = getDatabase();
            const userEventsRef = ref(database, `users/${user.uid}/goingEvents`);
           const unsubscribe = onValue(userEventsRef, async (snapshot) => {
                const eventData = snapshot.val();
                if (eventData) {
                    const eventIds = Object.keys(eventData);
                    const events = await Promise.all(eventIds.map(async (eventId) => {
                        const eventRef = ref(database, `events/${eventId}`);
                        return new Promise((resolve) => {
                            onValue(eventRef, (eventSnapshot) => {
                                const eventDetails = eventSnapshot.val();
                                resolve({ id: eventId, ...eventDetails });
                            }, { onlyOnce: true });
                        });
                    }));
                    setGoingEvents(events);
                } else {
                    setGoingEvents([]);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLeaveEvent = (eventId) => {
        const user = auth.currentUser;
        if (user) {
            const database = getDatabase();
            const eventRef = ref(database, `events/${eventId}/participants/${user.uid}`);
            set(eventRef, null);

            const userEventsRef = ref(database, `users/${user.uid}/goingEvents/${eventId}`);
            set(userEventsRef, null);

            setGoingEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
                    <NavLink to="/bikeshopsmap" className="navbar-link">Bike Shops</NavLink>
                    <button className="logout-button" onClick={handleSignOut}>Logout</button>
                </div>
            </nav>
            <div className="goingeventpage-content">
                <h2>Going Events</h2>
                {goingEvents.length > 0 ? (
                    <div className="events-list">
                        {goingEvents.map((event) => (
                            <div className="event-block" key={event.id}>
                                <h3 className='event-title'>{event.name}</h3>
                                <p className='event-description'>Data: {event.date}</p>
                                <p className='event-description'>Locație: {event.location}</p>
                                <p className='event-description'>Lungime traseu: {event.length} km</p>
                                <p className='event-description'>Tipul traseului: {event.type}</p>
                                <p className='event-description'>Dificultate: {event.difficulty}</p>
                                <p className='event-participants'>Participanți:</p>
                                <ul>
                                    {event.participants && Object.values(event.participants).map((participant, index) => (
                                        <li className='participant-names' key={index}>{participant.name}</li>
                                    ))}
                                </ul>
                                <button className='event-delete-button' onClick={() => handleLeaveEvent(event.id)}>Părăsește evenimentul</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No events you are going to.</p>
                )}
            </div>
        </div>
    );
};

export default GoingEventPage;
