import React, {useState, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth } from './firebase';
import logo from './logo.svg';
import { getDatabase, ref, onValue, update, remove, set, push} from 'firebase/database';
import './EventPage.css'

const EventPage = () => {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        location: '',
        length: '',
        type: 'Urban',
        difficulty: 'Începător',
    });
    const database = getDatabase();

    useEffect(() => {
        const eventsRef = ref(database, 'events');
        const unsubscribeEvents = onValue(eventsRef, (snapshot) => {
            const eventsData = snapshot.val();
            const eventsList = eventsData ? Object.keys(eventsData).map(key => ({ id: key, ...eventsData[key] })) : [];
            setEvents(eventsList);
        });

        const user = auth.currentUser;
        if (user) {
            const profileRef = ref(database, `users/${user.uid}/profile`);
            const unsubscribeProfile = onValue(profileRef, (snapshot) => {
                setUserProfile(snapshot.val());
                setLoading(false);
            });

            return () => {
                unsubscribeEvents();
                unsubscribeProfile();
            };
        } else {
            setLoading(false);
        }
    }, [database]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };


    const handleCreateEvent = () => {
        const { name, date, location, length, type, difficulty } = newEvent;

        if (!name || !date || !location || !length || !type || !difficulty) {
            setError('All fields are required.');
            return;
        }

        const eventsRef = ref(database, 'events');
        const newEventRef = push(eventsRef);
        set(newEventRef, { ...newEvent, participants: {} });
        setPopupVisible(false);
        setError('');
    };

    const handleParticipate = (eventId, eventDifficulty) => {
        const user = auth.currentUser;
        if (user && userProfile) {
            const { experience, fullName } = userProfile;

            if (experience === 'Avansat' || experience === eventDifficulty || (experience === 'Începător' && eventDifficulty === 'Începător')) {
                const eventRef = ref(database, `events/${eventId}/participants/${user.uid}`);
                update(eventRef, { name: fullName });

                const userEventsRef = ref(database, `users/${user.uid}/goingEvents/${eventId}`);
                update(userEventsRef, { eventId });
            }
        }
    };

    const handleDeleteEvent = (eventId) => {
        const eventRef = ref(database, `events/${eventId}`);
        remove(eventRef);
        setEvents(events.filter(event => event.id !== eventId));
        const user = auth.currentUser;
        if (user) {
            const userEventsRef = ref(database, `users/${user.uid}/goingEvents/${eventId}`);
            remove(userEventsRef);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleSignOut = () => {
        signOutUser(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }

    return (
        <div className="eventpage">
            <nav className="navbar">
                <NavLink to="/homepage" className="navbar-logo-link">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </NavLink>
                <div className="navbar-links">
                    <NavLink to="/profile" className="navbar-link">Profile</NavLink>
                    <NavLink to="/events" className="navbar-link">Events</NavLink>
                    <NavLink to="/goingevent" className="navbar-link">Going Events</NavLink>
                    <NavLink to="/bikeshopsmap" className="navbar-link">Bike Shops</NavLink>
                </div>
                <button className="logout-button" onClick={handleSignOut}>Logout</button>
            </nav>
            <div className="eventpage-content">
                <button className="create-event-button" onClick={() => setPopupVisible(true)}>Creează eveniment</button>
                {popupVisible && (
                    <div className="popup">
                        <div className="popup-inner">

                            <label>Nume eveniment:</label>
                            <input type="text" name="name" value={newEvent.name} onChange={handleInputChange} />

                            <label>Data:{formatDate(newEvent.date)}</label>
                            <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} />

                            <label>Locația:</label>
                            <input type="text" name="location" value={newEvent.location} onChange={handleInputChange} />

                            <label>Dificultate traseu:</label>
                            <select name="difficulty" value={newEvent.difficulty} onChange={handleInputChange}>
                                <option value="Începător">Începător</option>
                                <option value="Avansat">Avansat</option>
                            </select>

                            <label>Lungime traseu în kilometri:</label>
                            <input type="text" name="length" value={newEvent.length} onChange={handleInputChange} />

                            <label>Tip traseu:</label>
                            <select name="type" value={newEvent.type} onChange={handleInputChange}>
                                <option value="Urban">Urban</option>
                                <option value="Off-road">Off-road</option>
                            </select>

                            {error && <p className="error-message">{error}</p>}

                            <button onClick={handleCreateEvent}>Creează eveniment</button>
                        </div>
                    </div>
                )}
                <div className="events-list">
                    {events.map((event) => (
                        <div className="event-block" key={event.id}>
                            <h3>{event.name}</h3>
                            <p>Data: {event.date}</p>
                            <p>Locație: {event.location}</p>
                            
                            <p>Lungime traseu: {event.length} km</p>
                            <p>Tipul traseului: {event.type}</p>
                            <p>Dificultate: {event.difficulty}</p>
                            {(userProfile.experience === 'Începător' && event.difficulty === 'Începător') ||
                            (userProfile.experience === 'Avansat' && (event.difficulty === 'Avansat' || event.difficulty === 'Începător')) ? (
                            event.participants && event.participants[auth.currentUser?.uid] ? (
                                <p>Înscris</p>
                             ) : (
                                <button onClick={() => handleParticipate(event.id, event.difficulty)}>Participă</button>
                                 )
                            ) : (
                                <p>Dificultate prea mare a evenimentului</p>
                            )}
                            <p>Participanți:</p>
                            <ul>
                                {event.participants && Object.values(event.participants).map((participant, index) => (
                                    <li key={index}>{participant.name}</li>
                                ))}
                            </ul>
                            <button onClick={() => handleDeleteEvent(event.id)}>Șterge evenimentul</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventPage;
