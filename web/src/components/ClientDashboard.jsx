import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- STYLES ---
// Using strict CSS-in-JS to match the "Premium" look of Teso
const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        background: '#0B1120',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif"
    },
    header: {
        padding: '20px',
        background: 'linear-gradient(180deg, rgba(11, 17, 32, 0.95) 0%, rgba(11, 17, 32, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333'
    },
    logo: {
        color: '#ffd700', // Gold for Clients
        fontSize: '1.5rem',
        fontWeight: '900',
        letterSpacing: '2px'
    },
    mapContainer: {
        flex: 1,
        position: 'relative'
    },
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        background: '#111827',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        zIndex: 1000,
        boxShadow: '0 -5px 30px rgba(0,0,0,0.5)',
        padding: '25px',
        boxSizing: 'border-box'
    },
    input: {
        width: '100%',
        padding: '15px',
        background: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem',
        marginBottom: '20px',
        boxSizing: 'border-box'
    },
    typeCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px',
        background: '#1F2937',
        borderRadius: '12px',
        marginBottom: '10px',
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    button: {
        width: '100%',
        padding: '18px',
        background: 'linear-gradient(90deg, #ffd700 0%, #ffcc00 100%)',
        border: 'none',
        borderRadius: '12px',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
    }
};

const userIcon = new L.DivIcon({
    html: '<div style="font-size: 24px; filter: drop-shadow(0 0 5px white);">📍</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
});

// Map Re-centerer
function Recenter({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.flyTo([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
}

export default function ClientDashboard({ onBack }) {
    const [destination, setDestination] = useState('');
    const [selectedType, setSelectedType] = useState('vip');
    const [status, setStatus] = useState('idle'); // idle, searching, confirmed
    const [currentPos, setCurrentPos] = useState({ lat: 6.20, lng: -75.57 });

    // Mock geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.log('Location access denied'),
                { timeout: 10000 }
            );
        }
    }, []);

    const handleRequest = () => {
        if (!destination) return alert("Por favor ingresa un destino");
        setStatus('searching');
        // Mock search delay
        setTimeout(() => setStatus('confirmed'), 3000);
    };

    return (
        <div style={styles.container}>
            {/* TOP BAR */}
            <div style={styles.header}>
                <div style={styles.logo}>TESO VIP</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'transparent',
                            border: '1px solid #333',
                            color: '#aaa',
                            padding: '5px 15px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        ⮌ VOLVER
                    </button>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#333', border: '1px solid #ffd700' }}></div>
                </div>
            </div>

            {/* MAP AREA */}
            <div style={styles.mapContainer}>
                <MapContainer center={[currentPos.lat, currentPos.lng]} zoom={15} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; Dark Matter'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={[currentPos.lat, currentPos.lng]} icon={userIcon} />
                    <Recenter lat={currentPos.lat} lng={currentPos.lng} />
                </MapContainer>
            </div>

            {/* ACTION PANEL */}
            <div style={styles.bottomPanel}>
                {status === 'idle' && (
                    <>
                        <h3 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '1.2rem' }}>¿A dónde vamos hoy?</h3>
                        <input
                            style={styles.input}
                            placeholder="Ingresar destino..."
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />

                        {/* VEHICLE TYPES */}
                        <div
                            style={{ ...styles.typeCard, border: selectedType === 'vip' ? '1px solid #ffd700' : '1px solid transparent' }}
                            onClick={() => setSelectedType('vip')}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '2rem' }}>🚙</span>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 'bold' }}>TESO VIP</div>
                                    <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Camionetas cerradas blindadas</div>
                                </div>
                            </div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>$45k</div>
                        </div>

                        <div
                            style={{ ...styles.typeCard, border: selectedType === 'van' ? '1px solid #ffd700' : '1px solid transparent' }}
                            onClick={() => setSelectedType('van')}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '2rem' }}>🚐</span>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 'bold' }}>TESO VAN</div>
                                    <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Grupos hasta 7 pax</div>
                                </div>
                            </div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>$70k</div>
                        </div>

                        <button style={styles.button} onClick={handleRequest}>
                            SOLICITAR AHORA
                        </button>
                    </>
                )}

                {status === 'searching' && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '3rem', animation: 'pulse 1s infinite' }}>📡</div>
                        <h3 style={{ color: '#ffd700' }}>Localizando unidades VIP...</h3>
                        <p style={{ color: '#888' }}>Priorizando conductores con calificación 4.9+</p>
                        <style>{`@keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }`}</style>
                    </div>
                )}

                {status === 'confirmed' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' }}>EN CAMINO</div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>ETA: 4 min</div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#1F2937', padding: '15px', borderRadius: '10px' }}>
                            <div style={{ width: 60, height: 60, background: '#333', borderRadius: '50%' }}></div> {/* Avatar placeholder */}
                            <div>
                                <div style={{ color: '#fff', fontWeight: 'bold' }}>Carlos Ruiz</div>
                                <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Toyota Prado • TZX-992</div>
                                <div style={{ color: '#ffd700', fontSize: '0.8rem' }}>⭐ 5.0 Platinum Driver</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button style={{ flex: 1, padding: '10px', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px' }}>Cancelar</button>
                            <button style={{ flex: 1, padding: '10px', background: '#39FF14', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Contactar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
