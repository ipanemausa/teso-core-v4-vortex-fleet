import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- STYLES ---
const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        background: '#0B1120', // Dark Navy
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif",
        color: '#fff'
    },
    topBar: {
        padding: '15px 20px',
        background: '#000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333'
    },
    statCard: {
        background: '#1F2937',
        borderRadius: '8px',
        padding: '10px 15px',
        minWidth: '80px',
        textAlign: 'center'
    },
    mapArea: {
        flex: 1,
        position: 'relative',
        zIndex: 1
    },
    onlineToggle: {
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 500,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(5px)',
        padding: '5px',
        borderRadius: '30px',
        display: 'flex',
        border: '1px solid #333'
    },
    toggleBtn: {
        padding: '10px 30px',
        borderRadius: '25px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    incomingCard: {
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '400px',
        background: '#000',
        border: '1px solid #39FF14',
        boxShadow: '0 0 30px rgba(57, 255, 20, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        zIndex: 1000,
        animation: 'slideUp 0.3s ease-out'
    }
};

const carIcon = new L.DivIcon({
    html: '<div style="font-size: 30px; transform: rotate(-90deg);">🚙</div>', // Pointing up
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

export default function DriverDashboard({ onBack }) {
    const [isOnline, setIsOnline] = useState(false);
    const [request, setRequest] = useState(null);

    // Simulate incoming request when online
    useEffect(() => {
        let timer;
        if (isOnline) {
            timer = setTimeout(() => {
                setRequest({
                    id: 'REQ-001',
                    pickup: 'Centro Empresarial El Poblado',
                    dropoff: 'Aeropuerto JMC',
                    fare: '$95.000',
                    rating: 4.8,
                    pax: 'Ejecutivo Sura'
                });
                // Play sound sound here
            }, 4000);
        } else {
            setRequest(null);
        }
        return () => clearTimeout(timer);
    }, [isOnline]);

    return (
        <div style={styles.container}>
            {/* STATS HEADER */}
            <div style={styles.topBar}>
                <button
                    onClick={onBack}
                    style={{
                        background: '#333',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ⮌ SALIR
                </button>
                <div style={styles.statCard}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Ganancias</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#39FF14' }}>$240k</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Viajes</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>3</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Rating</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'gold' }}>5.0</div>
                </div>
            </div>

            {/* MAP */}
            <div style={styles.mapArea}>
                {/* ONLINE TOGGLE OVERLAY */}
                <div style={styles.onlineToggle}>
                    <button
                        onClick={() => setIsOnline(false)}
                        style={{
                            ...styles.toggleBtn,
                            background: !isOnline ? '#333' : 'transparent',
                            color: !isOnline ? '#fff' : '#aaa'
                        }}
                    >
                        OFFLINE
                    </button>
                    <button
                        onClick={() => setIsOnline(true)}
                        style={{
                            ...styles.toggleBtn,
                            background: isOnline ? '#39FF14' : 'transparent',
                            color: isOnline ? '#000' : '#aaa',
                            boxShadow: isOnline ? '0 0 15px rgba(57, 255, 20, 0.5)' : 'none'
                        }}
                    >
                        ONLINE
                    </button>
                </div>

                <MapContainer center={[6.20, -75.57]} zoom={14} style={{ width: '100%', height: '100%' }} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; Dark Matter'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={[6.20, -75.57]} icon={carIcon} />
                </MapContainer>
            </div>

            {/* INCOMING REQUEST MODAL */}
            {request && (
                <div style={styles.incomingCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ color: '#39FF14', fontWeight: 'bold', animation: 'flash 1s infinite' }}>● NUEVA SOLICITUD</div>
                        <div style={{ color: '#fff' }}>2.5 km (5 min)</div>
                    </div>

                    <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#fff' }}>{request.fare}</h2>
                    <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>{request.pax} • ⭐ {request.rating}</div>

                    <div style={{ background: '#111', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ color: '#39FF14' }}>⏺</span>
                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>{request.pickup}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ color: 'red' }}>📍</span>
                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>{request.dropoff}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => { setRequest(null); alert('Viaje Aceptado'); }}
                        style={{
                            width: '100%', padding: '15px',
                            background: '#39FF14', color: '#000',
                            border: 'none', borderRadius: '8px',
                            fontWeight: '900', fontSize: '1.2rem',
                            textTransform: 'uppercase', cursor: 'pointer',
                            boxShadow: '0 0 20px #39FF14'
                        }}
                    >
                        ACEPTAR VIAJE
                    </button>

                    <style>{`
                        @keyframes slideUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                        @keyframes flash { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
                    `}</style>
                </div>
            )}
        </div>
    );
}
