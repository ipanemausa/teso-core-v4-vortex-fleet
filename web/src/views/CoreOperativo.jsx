import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import ErrorBoundary from "../components/ErrorBoundary";

// --- CUSTOM FLEET ICONS ---
const carIcon = divIcon({
    html: `<div style="background-color: #39FF14; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 8px #39FF14;"></div>`,
    className: 'fleet-marker',
    iconSize: [12, 12]
});

// Medellín Coordinates
const CENTER_LAT = 6.2442;
const CENTER_LNG = -75.5812;

export function CoreOperativo({ onClose, onHome }) {
    const [fleet, setFleet] = useState([]);

    // 1. INITIALIZE FLEET (Simulated positions around Medellín)
    useEffect(() => {
        const initialFleet = Array.from({ length: 15 }).map((_, i) => ({
            id: `V-0${i + 10}`,
            lat: CENTER_LAT + (Math.random() - 0.5) * 0.05,
            lng: CENTER_LNG + (Math.random() - 0.5) * 0.05,
            status: Math.random() > 0.2 ? 'ACTIVE' : 'IDLE',
            speed: Math.floor(Math.random() * 60)
        }));
        setFleet(initialFleet);

        // 2. LIVE ANIMATION LOOP
        const interval = setInterval(() => {
            setFleet(prev => prev.map(car => ({
                ...car,
                lat: car.lat + (Math.random() - 0.5) * 0.001, // Jitter movement
                lng: car.lng + (Math.random() - 0.5) * 0.001,
                speed: car.status === 'ACTIVE' ? Math.max(10, Math.floor(Math.random() * 80)) : 0
            })));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>

            {/* L2 ADMIN HUD (HEADS UP DISPLAY) */}
            <div style={{
                position: 'absolute', top: 20, left: 20, zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)',
                padding: '15px', borderRadius: '8px', border: '1px solid #334155',
                width: '300px', color: '#fff'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8' }}>CAPA 2: VORTEX LIVE</h3>
                    <div style={{ fontSize: '0.7rem', color: '#39FF14' }}>● SYSTEM ONLINE</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#1e293b', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ACTIVE FLEET</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{fleet.filter(c => c.status === 'ACTIVE').length} / {fleet.length}</div>
                    </div>
                    <div style={{ background: '#1e293b', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AVG VELOCITY</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>34 km/h</div>
                    </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <button style={{ width: '100%', padding: '8px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                        DEPLOY REINFORCEMENTS
                    </button>
                </div>
            </div>

            {/* THE MAP ITSELF */}
            <MapContainer
                center={[CENTER_LAT, CENTER_LNG]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                {/* DARK MODE MAP TILE */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* LIVE FLEET MARKERS */}
                {fleet.map(car => (
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
            </MapContainer>
        </div>
    );
}
