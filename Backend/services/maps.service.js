const axios = require('axios');
const captainModel = require('../models/captain.model');

// ─── Geocoding: Address → { ltd, lng } ───────────────────────────────────────
// Uses Nominatim (OpenStreetMap) — free, no API key required
module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp/1.0' }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[ 0 ];
            return {
                ltd: parseFloat(lat),
                lng: parseFloat(lon)
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// ─── Distance & Duration: address → address ───────────────────────────────────
// Geocodes both addresses via Nominatim, then routes via OSRM (free, no key)
// Returns same shape as Google Distance Matrix so ride.service.js needs no changes:
//   { distance: { value: <meters> }, duration: { value: <seconds> } }
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // Step 1: geocode both addresses
        const [ originCoords, destCoords ] = await Promise.all([
            module.exports.getAddressCoordinate(origin),
            module.exports.getAddressCoordinate(destination)
        ]);

        // Step 2: call OSRM Route API
        // OSRM expects coordinates as lng,lat
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false`;

        const response = await axios.get(osrmUrl);

        if (response.data.code === 'Ok' && response.data.routes.length > 0) {
            const route = response.data.routes[ 0 ];
            return {
                distance: { value: route.distance }, // metres
                duration: { value: route.duration }  // seconds
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// ─── Autocomplete suggestions ─────────────────────────────────────────────────
// Uses Photon by Komoot (OpenStreetMap data) — free, no API key required
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`;

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'UberCloneApp/1.0' }
        });

        if (response.data && response.data.features) {
            return response.data.features
                .map(feature => {
                    const p = feature.properties;
                    const parts = [ p.name, p.street, p.city, p.state, p.country ]
                        .filter(Boolean);
                    return parts.join(', ');
                })
                .filter(Boolean);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// ─── Find nearby captains (uses MongoDB geospatial — unchanged) ───────────────
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;
};