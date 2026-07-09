import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default marker icon broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center as fallback

// Inner component that re-centers the map when position changes
function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
        map.setView([ position.lat, position.lng ]);
    }, [ position, map ]);
    return null;
}

const LiveTracking = () => {
    const [ currentPosition, setCurrentPosition ] = useState(defaultCenter);

    useEffect(() => {
        // Get initial position
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        });

        // Watch for position changes
        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <MapContainer
            center={[ currentPosition.lat, currentPosition.lng ]}
            zoom={15}
            style={containerStyle}
            zoomControl={true}
        >
            {/* OpenStreetMap tiles — completely free, no API key */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[ currentPosition.lat, currentPosition.lng ]} />
            <RecenterMap position={currentPosition} />
        </MapContainer>
    );
};

export default LiveTracking;