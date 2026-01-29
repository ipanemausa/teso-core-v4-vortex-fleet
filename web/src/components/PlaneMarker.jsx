import React, { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { planeDivIcon, parkedPlaneIcon } from '../utils/mapIcons';

export const PlaneMarker = ({ p, isSelected }) => {
    const markerRef = useRef(null);

    // Force open popup if selected
    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        } else if (!isSelected && markerRef.current) {
            markerRef.current.closePopup();
        }
    }, [isSelected]);

    return (
        <Marker
            ref={markerRef}
            position={[p.lat, p.lng]}
            icon={p.status === 'LANDED' ? parkedPlaneIcon : planeDivIcon(p.heading)}
            zIndexOffset={isSelected ? 1000 : 0} // Bring to front if selected
        >
            <Popup className="glass-popup" closeButton={true} closeOnClick={false} autoPan={true}>
                <div style={{ padding: '8px 12px', minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                        <span style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '13px' }}>✈ {p.id}</span>
                        <span style={{ fontSize: '10px', color: '#ccc' }}>{p.status}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', color: '#ccc' }}>
                        <div>
                            <div style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Altitud</div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>{p.alt ? p.alt.toLocaleString() : '---'} ft</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>Velocidad</div>
                            <div style={{ color: '#39FF14', fontWeight: 'bold' }}>{p.spd ? p.spd : '---'} kts</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #333', fontSize: '10px', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>{p.from}</span>
                            <span style={{ color: '#00F0FF' }}>➔</span>
                            <span>MDE</span>
                        </div>
                        <div style={{ color: '#00F0FF', fontSize: '16px' }}>☁</div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};
