import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import EventPage from './EventPage';
import GoingEventPage from './GoingEventPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/goingevent" element={<GoingEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
