import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { vehicleIcon as carIcon, jobIcon, planeDivIcon, getAirportIcon } from '../utils/mapIcons'; // Import Icons!
import L from 'leaflet';
// Import PlaneMarker (Assuming it's a sub-component or needs to be defined/imported)
// If PlaneMarker is not imported, let's define a simple one here to be safe or import it if exists.
// Actually, looking at the code, PlaneMarker is used but not defined. I need to find where it is or define it.
// For now, I'll define the constants.

const CENTER_LAT = 6.2442;
const CENTER_LNG = -75.5812;
console.log("✅ CoreOperativo Loaded. Center:", CENTER_LAT, CENTER_LNG);

// --- DUMMY PlaneMarker if not imported ---
const PlaneMarker = ({ p }) => (
    <Marker
        position={[p.lat, p.lng]}
        icon={planeDivIcon(p.heading)}
        zIndexOffset={1000}
        eventHandlers={{
            mouseover: (e) => e.target.openTooltip(),
            mouseout: (e) => e.target.closeTooltip()
        }}
    >
        <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
            <div style={{
                background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', borderRadius: '6px',
                padding: '10px', minWidth: '160px', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                fontFamily: 'sans-serif'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '900', color: '#38bdf8', fontSize: '0.9rem' }}>{p.id}</span>
                    <span style={{ fontSize: '0.6rem', background: '#10b981', padding: '2px 6px', borderRadius: '10px', color: '#fff', fontWeight: 'bold', border: '1px solid #059669' }}>IN FLIGHT</span>
                </div>
                <div style={{ fontSize: '0.75rem', lineHeight: '1.5', color: '#e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ color: '#94a3b8' }}>Ruta:</span>
                        <span style={{ fontWeight: 'bold' }}>{p.from} ➔ MDE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>📡 {p.alt.toLocaleString()} ft</span>
                        <span>🚀 {p.spd} kts</span>
                    </div>
                    <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #334155', color: '#94a3b8', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>✈️</span> {p.airline} Airlines • B737
                    </div>
                </div>
            </div>
        </Tooltip>
    </Marker>
);
const createPlane = (bounds, center) => {
    const airlines = ['AA', 'AV', 'LA', 'CM', 'NK', 'IB', 'DL', 'AM'];
    const markets = ['MIA', 'MAD', 'BOG', 'PTY', 'JFK', 'SCL', 'LIM', 'MEX'];

    let south, north, west, east;

    if (!bounds || !bounds.getSouth || !bounds.isValid()) {
        south = 6.00; north = 6.40; west = -75.70; east = -75.30;
    } else {
        south = bounds.getSouth();
        north = bounds.getNorth();
        west = bounds.getWest();
        east = bounds.getEast();
    }

    const safeCenter = (center && typeof center.lat === 'number') ? center : { lat: 6.2442, lng: -75.5812 };
    const latSpan = north - south;
    const lngSpan = east - west;

    // SPAWN JUST OUTSIDE (Immediate Entry)
    // 10-20% margin outside the screen is enough to be invisible but enter quickly
    const PADDING_LAT = latSpan * 0.15;
    const PADDING_LNG = lngSpan * 0.15;

    const edge = Math.floor(Math.random() * 4);
    let lat, lng;

    if (edge === 0) { lat = north + PADDING_LAT; lng = west + (Math.random() * lngSpan); }
    else if (edge === 1) { lat = south - PADDING_LAT; lng = west + (Math.random() * lngSpan); }
    else if (edge === 2) { lat = south + (Math.random() * latSpan); lng = west - PADDING_LNG; }
    else { lat = south + (Math.random() * latSpan); lng = east + PADDING_LNG; }

    const targetLat = safeCenter.lat + (Math.random() - 0.5) * (latSpan * 0.3);
    const targetLng = safeCenter.lng + (Math.random() - 0.5) * (lngSpan * 0.3);
    const angleToCenter = Math.atan2(targetLng - lng, targetLat - lat) * (180 / Math.PI);

    // SPEED: Adjusted for visual flow
    const speed = ((latSpan * 0.002) + (Math.random() * (latSpan * 0.0010)));

    return {
        id: `${airlines[Math.floor(Math.random() * airlines.length)]}${Math.floor(100 + Math.random() * 900)}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        from: markets[Math.floor(Math.random() * markets.length)],
        lat, lng,
        heading: angleToCenter,
        speed: speed,
        alt: 10000 + Math.floor(Math.random() * 5000),
        spd: 300 + Math.floor(Math.random() * 200)
    };
};

// Simulation Engine Component (Must be child of MapContainer)
const RadarController = ({ setPlanes }) => {
    const map = useMap(); // Access the map instance!

    useEffect(() => {
        if (!map) return;
        const safeUpdate = () => {
            try {
                if (!map || !map._leaflet_id) return;
                const bounds = map.getBounds();
                const center = map.getCenter();
                // Tight Death Bounds: Die as soon as they are partially off-screen (0.2 padding)
                // This ensures we don't simulate invisible planes for long
                const deathBounds = bounds.pad(0.2);

                setPlanes(prevPlanes => {
                    // Initialize or Replenish to 8 (User requested ~6 constant)
                    // We generate 8 to ensure coverage even if 1-2 are transitioning
                    let currentPlanes = [...prevPlanes];
                    if (currentPlanes.length < 8) {
                        while (currentPlanes.length < 8) {
                            // console.log("✈️ Spawning New Plane...");
                            currentPlanes.push(createPlane(bounds, center));
                        }
                    }

                    // Move & Despawn Logic
                    return currentPlanes.map(p => {
                        const nextLat = p.lat + (Math.cos(p.heading * Math.PI / 180) * p.speed);
                        const nextLng = p.lng + (Math.sin(p.heading * Math.PI / 180) * p.speed);

                        // If outside death bounds, respawn IMMEDIATELY
                        if (!deathBounds.contains([nextLat, nextLng])) {
                            return createPlane(bounds, center);
                        }
                        return { ...p, lat: nextLat, lng: nextLng };
                    });
                });
            } catch (err) { /* silent */ }
        };
        const interval = setInterval(safeUpdate, 50); // Faster tick (50ms = 20fps) for smoother 'immediate' entry
        return () => clearInterval(interval);
    }, [map, setPlanes]);

    return null;
};

export function CoreOperativo({ onClose, onHome, command, simulationData, activeLayers }) {
    const [fleet, setFleet] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [internalPlanes, setInternalPlanes] = useState([]); // Local state for simulation

    // 1. INITIALIZE FLEET & DATA FROM SIMULATION
    useEffect(() => {
        if (simulationData && simulationData.services) {
            const activeServices = simulationData.services.slice(0, 15);
            const mappedFleet = activeServices.map((svc, i) => ({
                id: svc.plate || `V-0${i + 10}`,
                lat: svc.lat || (CENTER_LAT + (Math.random() - 0.5) * 0.05),
                lng: svc.lng || (CENTER_LNG + (Math.random() - 0.5) * 0.05),
                status: svc.status === 'COMPLETED' ? 'ACTIVE' : 'IDLE',
                speed: Math.floor(Math.random() * 60) + 20,
                target: null,
                driver: svc.driver_name
            }));
            setFleet(mappedFleet);
        } else {
            // Fallback
            setFleet(Array.from({ length: 15 }).map((_, i) => ({
                id: `V-0${i + 10}`,
                lat: CENTER_LAT + (Math.random() - 0.5) * 0.06,
                lng: CENTER_LNG + (Math.random() - 0.5) * 0.06,
                status: 'ACTIVE',
                speed: 30
            })));
        }
    }, [simulationData]);

    // 2. LISTEN FOR COMMANDS (The Brain Logic)
    useEffect(() => {
        const cmdType = command?.type || command;
        if (cmdType === 'DISPATCH_WAVE') {
            // VISUAL DISPATCH EFFECT
            setFleet(prev => prev.map(v => ({
                ...v,
                status: 'DISPATCHED',
                target: {
                    // Move to a random nearby point to simulate activity
                    lat: v.lat + (Math.random() - 0.5) * 0.02,
                    lng: v.lng + (Math.random() - 0.5) * 0.02
                },
                speed: Math.floor(Math.random() * 40) + 60 // Accelerate
            })));
            console.log("🌊 DISPATCH WAVE EXECUTED: Units Mobilized.");
        }
    }, [command]);

    // INTERNAL COMPONENT: MAP COMMAND HANDLER
    const MapCommandHandler = ({ cmd }) => {
        const map = useMap();
        useEffect(() => {
            if (cmd && cmd.type === 'FLY_TO' && cmd.payload) {
                console.log("✈️ FLYING TO:", cmd.payload);
                map.flyTo([cmd.payload.lat, cmd.payload.lng], 15, { duration: 2.0, easeLinearity: 0.25 });
                map.openPopup(L.popup().setLatLng([cmd.payload.lat, cmd.payload.lng]).setContent(`Target: ${cmd.payload.id || 'Location'}`));
            }
        }, [cmd, map]);
        return null;
    };

    // 3. LIVE FLEET ANIMATION LOOP 
    useEffect(() => {
        const interval = setInterval(() => {
            setFleet(prev => prev.map(car => {
                const isMoving = car.status === 'ACTIVE' || car.status === 'DISPATCHED';
                if (!isMoving) return car;

                return {
                    ...car,
                    lat: car.lat + (Math.random() - 0.5) * 0.0015,
                    lng: car.lng + (Math.random() - 0.5) * 0.0015,
                    speed: Math.max(20, Math.floor(Math.random() * 70))
                };
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // DEBUG: Monitor Plane Count
    useEffect(() => {
        console.log("✈️ [CoreOperativo] Active Planes:", internalPlanes.length);
        if (internalPlanes.length > 0) {
            console.log("✈️ [CoreOperativo] Sample Plane:", internalPlanes[0]);
        }
    }, [internalPlanes]);


    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* THE MAP ITSELF */}
            <MapContainer
                center={[CENTER_LAT, CENTER_LNG]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* ACTIVATE RADAR CONTROLLER */}
                <MapCommandHandler cmd={command} />
                <RadarController setPlanes={setInternalPlanes} />

                {/* LAYER 1: FLEET VECTORS */}
                {(!activeLayers || activeLayers.includes('FLEET')) && fleet.map(car => (
                    <Marker key={car.id} position={[car.lat, car.lng]} icon={carIcon}>
                        <Popup><strong>{car.id}</strong></Popup>
                    </Marker>
                ))}

                {/* LAYER 2: DEMAND/JOBS */}
                {(!activeLayers || activeLayers.includes('JOBS')) && jobs.map(job => (
                    <Marker key={job.id} position={[job.lat, job.lng]} icon={jobIcon} />
                ))}

                {/* LAYER 3: STATIC INFRASTRUCTURE (AIRPORTS) */}
                {[
                    { id: 'MDE', lat: 6.17, lng: -75.43, code: 'JMC' }, // Jose Maria Cordova
                    { id: 'EOH', lat: 6.22, lng: -75.59, code: 'EOH' }  // Olaya Herrera
                ].map(apt => (
                    <Marker key={apt.id} position={[apt.lat, apt.lng]} icon={getAirportIcon(apt.code)}>
                        <Popup>{apt.code}</Popup>
                    </Marker>
                ))}

                {/* LAYER 3: AIRSPACE/RADAR (DEBUG: ALWAYS VISIBLE) */}
                {/* Removed condition checking activeLayers to force visibility */}
                {internalPlanes.map(p => (
                    <PlaneMarker
                        key={p.id}
                        p={p}
                        isSelected={false}
                    />
                ))}

            </MapContainer>
        </div>
    );
}
