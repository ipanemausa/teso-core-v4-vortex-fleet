import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// --- ICONS (Reused for consistency but standalone for public view) ---
const carIcon = new L.DivIcon({
    className: 'share-car-icon',
    html: `<div style="
    font-size: 24px;
    filter: drop-shadow(0 0 10px #00F0FF);
    transform: rotate(0deg); /* Dynamic rotation would go here */
  ">🚗</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const destIcon = new L.DivIcon({
    html: '<div style="font-size: 24px;">🏁</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const SharedRideView = ({ rideData, onClose }) => {
    // Mock live progression
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(rideData?.eta || 15);

    useEffect(() => {
        // Simulate slight movement / data refresh
        const interval = setInterval(() => {
            setProgress(p => (p < 100 ? p + 1 : 0));
            setEta(prev => (prev > 1 ? prev - 1 : 1)); // Decreasing ETA mock
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#fff', // Public view is often cleaner/lighter or distinct
            zIndex: 20000,
            display: 'flex', flexDirection: 'column',
            fontFamily: "'Outfit', sans-serif"
        }}>

            {/* HEADER: TRUST & BRANDING */}
            <div style={{
                padding: '15px 20px',
                background: '#0B1120',
                color: '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '35px', height: '35px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #00F0FF 0%, #0077FF 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '900', color: '#fff'
                    }}>T</div>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>TESO SECURE LINK</div>
                        <div style={{ fontSize: '0.65rem', color: '#00F0FF' }}>● ENCRIPTADO E2E</div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                        padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem'
                    }}
                >
                    Cerrar Vista
                </button>
            </div>

            {/* MAIN MAP AREA */}
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer
                    key={rideData ? `map-${rideData.id || 'default'}` : 'map-empty'}
                    center={rideData?.lat ? [rideData.lat, rideData.lng] : [6.20, -75.57]}
                    zoom={14}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    {/* Vehicle */}
                    <Marker position={rideData?.lat ? [rideData.lat, rideData.lng] : [6.20, -75.57]} icon={carIcon} />

                    {/* Destination (Mocked offset) */}
                    <Marker position={[6.23, -75.59]} icon={destIcon} />
                </MapContainer>

                {/* FLOATING STATUS CARD */}
                <div style={{
                    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                    width: '90%', maxWidth: '400px',
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    zIndex: 1000
                }}>
                    {/* Status Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <div style={{ color: '#0077FF', fontWeight: 'bold' }}>EN RUTA</div>
                        <div style={{ fontWeight: '900', color: '#333' }}>ETA: {eta} min</div>
                    </div>

                    {/* Driver Profile */}
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: '#eee',
                            backgroundImage: `url(https://ui-avatars.com/api/?name=${rideData?.driverName || 'Driver'}&background=0D8ABC&color=fff)`,
                            backgroundSize: 'cover'
                        }}></div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>{rideData?.driverName || 'Conductor Teso'}</h3>
                            <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>
                                {rideData?.vehicleType || 'Business Sedan'} • <span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{rideData?.vehicleId || 'TES-999'}</span>
                            </div>
                            <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '4px' }}>⭐ 4.98 Rating</div>
                        </div>
                    </div>

                    {/* Safety Footer */}
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #f0f0f0', color: '#888', fontSize: '0.7rem', textAlign: 'center' }}>
                        Este enlace expirará al finalizar el viaje.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedRideView;
