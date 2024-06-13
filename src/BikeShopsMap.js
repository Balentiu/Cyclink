import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getDatabase, ref, onValue } from 'firebase/database';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOutUser, auth} from './firebase';
import logo from './logo.svg';
import './BikeShopsMap.css'
import bikelogo from './cycling.png'


const BikeShopsMap = () => {
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);

  const containerStyle = {
    width: '100%',
    height: '100vh'
  };
  
  const center = {
      lat: 45.758,
      lng: 21.256,
  };
  

  useEffect(() => {
    const db = getDatabase();
    const shopsRef = ref(db, 'bikeShops');
    onValue(shopsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const shopsArray = Object.keys(data).map((key) => ({id: key, ...data[key],}));
        setShops(shopsArray);
      }
    }
    );
  }, []);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

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
    <div className='bikeShopsMap'>
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

        {mapLoaded && (
        <LoadScript googleMapsApiKey="AIzaSyC4l9duK_Mk7E8v7RWboNl_0dkEJuhu23c">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
          >
            {shops.map((shop) => (
              <Marker
                key={shop.id}
                position={shop.position}
                icon={bikelogo}
                onClick={() => setSelectedShop(shop)}
              />
            ))}

            {selectedShop && (
              <InfoWindow
                position={selectedShop.position}
                onCloseClick={() => setSelectedShop(null)}
              >
                <div>
                  <h2>{selectedShop.name}</h2>
                  <p>{selectedShop.address}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default BikeShopsMap;
