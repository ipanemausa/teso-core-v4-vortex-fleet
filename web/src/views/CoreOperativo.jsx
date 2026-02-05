import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { PlaneMarker } from '../components/PlaneMarker';

// --- CUSTOM FLEET ICONS ---
const carIcon = divIcon({
    html: `<div style="background-color: #39FF14; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 8px #39FF14;"></div>`,
    className: 'fleet-marker',
    iconSize: [12, 12]
});

const jobIcon = divIcon({
    html: `<div style="background-color: #06b6d4; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 15px cyan; border: 2px solid white; animation: pulse 1s infinite;"></div>`,
    className: 'job-marker',
    iconSize: [14, 14]
});

// Medellín Coordinates
const CENTER_LAT = 6.2442;
const CENTER_LNG = -75.5812;

export function CoreOperativo({ onClose, onHome, command, simulationData, activeLayers }) {
    const [fleet, setFleet] = useState([]);
    const [jobs, setJobs] = useState([]); // Active Passenger Requests
    const [planes, setPlanes] = useState([]); // Active Flights

    // 1. INITIALIZE FLEET & DATA FROM SIMULATION
    useEffect(() => {
        if (simulationData) {
            // Load Planes
            if (simulationData.planes) {
                setPlanes(simulationData.planes);
            }

            // Load Fleet (Derived from Active Services for visualization)
            // We take a slice of services to simulate "Active" cars on the map
            if (simulationData.services) {
                const activeServices = simulationData.services.slice(0, 15); // Top 15 active
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
            }
        } else {
            // Fallback: Random Stub
            const initialFleet = Array.from({ length: 15 }).map((_, i) => ({
                id: `V-0${i + 10}`,
                lat: CENTER_LAT + (Math.random() - 0.5) * 0.06,
                lng: CENTER_LNG + (Math.random() - 0.5) * 0.06,
                status: Math.random() > 0.6 ? 'ACTIVE' : 'IDLE',
                speed: 0,
                target: null
            }));
            setFleet(initialFleet);

            // Fallback: Random Planes
            const initialPlanes = Array.from({ length: 5 }).map((_, i) => ({
                id: `AV-${900 + i}`,
                lat: CENTER_LAT + (Math.random() - 0.5) * 0.1,
                lng: CENTER_LNG + (Math.random() - 0.5) * 0.1,
                heading: Math.floor(Math.random() * 360),
                speed: 300 + Math.floor(Math.random() * 200),
                alt: 15000,
                status: 'IN_AIR',
                from: 'MIA'
            }));
            setPlanes(initialPlanes);
        }
    }, [simulationData]);

    // 2. LISTEN FOR COMMANDS (The Brain Logic)
    useEffect(() => {
        if (command === 'DISPATCH_WAVE') {
            console.log("⚡ WAVE TRIGGERED: Spawning Jobs...");

            // Spawn 5 New Jobs (Cyan Dots)
            const newJobs = Array.from({ length: 5 }).map((_, i) => ({
                id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
                lat: CENTER_LAT + (Math.random() - 0.5) * 0.03, // Closer to center
                lng: CENTER_LNG + (Math.random() - 0.5) * 0.03,
                status: 'SEARCHING'
            }));
            setJobs(prev => [...prev, ...newJobs]);

            // Assign Idle Cars (Simple Dispatch Logic)
            setFleet(prevFleet => {
                return prevFleet.map(car => {
                    if (car.status === 'IDLE' && Math.random() > 0.4) {
                        return { ...car, status: 'DISPATCHED', speed: 45 };
                    }
                    return car;
                });
            });
        }
    }, [command]);

    // 3. LIVE ANIMATION LOOP (Fleet Physics)
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
        }, 1000); // 1 FPS update for smoothness
        return () => clearInterval(interval);
    }, []);

    // 4. PLANE ANIMATION LOOP (Radar Physics) 
    useEffect(() => {
        const interval = setInterval(() => {
            setPlanes(prev => prev.map(p => {
                // Motion math: Move based on heading
                const headingRad = (p.heading || 0) * (Math.PI / 180);
                const speedFactor = (p.speed || 300) * 0.000005; // Scale for map

                let newLat = p.lat + Math.cos(headingRad) * speedFactor;
                let newLng = p.lng + Math.sin(headingRad) * speedFactor;

                // Simple World Wrap (keep them in bounds roughly)
                if (Math.abs(newLat - CENTER_LAT) > 0.2) newLat = CENTER_LAT;
                if (Math.abs(newLng - CENTER_LNG) > 0.2) newLng = CENTER_LNG;

                return {
                    ...p,
                    lat: newLat,
                    lng: newLng
                };
            }));
        }, 100); // Smooth 10 FPS for planes
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>



            {/* THE MAP ITSELF */}
            <MapContainer
                center={[CENTER_LAT, CENTER_LNG]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false} // Hidden as per user request for clean UI
            >
                {/* DARK MODE MAP TILE (Fly.io Style - High Visibility) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    opacity={1.0} // FULL VISIBILITY: Reset to 1.0 to match Fly.io
                />

                {/* LAYER 1: FLEET VECTORS */}
                {(!activeLayers || activeLayers.includes('FLEET')) && fleet.map(car => (
                    <Marker key={car.id} position={[car.lat, car.lng]} icon={carIcon}>
                        <Popup>
                            <div style={{ color: '#000' }}>
                                <strong>{car.id}</strong><br />
                                Status: {car.status}<br />
                                Speed: {car.speed} km/h
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* LAYER 2: DEMAND/JOBS */}
                {(!activeLayers || activeLayers.includes('JOBS')) && jobs.map(job => (
                    <Marker key={job.id} position={[job.lat, job.lng]} icon={jobIcon}>
                        <Popup>
                            <div style={{ color: '#000' }}>
                                <strong>NEW REQUEST</strong><br />
                                {job.id}<br />
                                Status: {job.status}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* LAYER 3: AIRSPACE/RADAR */}
                {(!activeLayers || activeLayers.includes('RADAR')) && planes.map(p => (
                    <PlaneMarker key={p.id} p={p} isSelected={false} />
                ))}

            </MapContainer>
        </div>
    );
}
