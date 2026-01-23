import React, { useEffect, useRef, useState } from 'react';

const WebcamOverlay = ({ isVisible }) => {
    const videoRef = useRef(null);
    const [position, setPosition] = useState('bottom-right'); // bottom-right, top-right, bottom-left
    const [streamActive, setStreamActive] = useState(false);

    useEffect(() => {
        if (isVisible) {
            startWebcam();
        } else {
            stopWebcam();
        }
        return () => stopWebcam();
    }, [isVisible]);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setStreamActive(false);
        }
    };

    if (!isVisible) return null;

    const getPositionStyle = () => {
        switch (position) {
            case 'top-right': return { top: '20px', right: '20px' };
            case 'bottom-left': return { bottom: '20px', left: '20px' };
            case 'top-left': return { top: '20px', left: '20px' };
            case 'bottom-right': default: return { bottom: '20px', right: '20px' };
        }
    };

    return (
        <div style={{
            position: 'fixed',
            zIndex: 999999,
            ...getPositionStyle(),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.5s ease'
        }}>
            {/* VIDEO BUBBLE */}
            <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--neon-green)',
                boxShadow: '0 0 20px rgba(0, 242, 255, 0.5)',
                background: '#000',
                position: 'relative'
            }}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)' // Mirror effect
                    }}
                />
            </div>

            {/* CONTROLS */}
            <div className="webcam-controls" style={{
                display: 'flex', gap: '5px', opacity: 0.5, transition: 'opacity 0.3s'
            }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
            >
                <button onClick={() => setPosition('bottom-left')} style={btnStyle}>↙</button>
                <button onClick={() => setPosition('top-right')} style={btnStyle}>↗</button>
                <button onClick={() => setPosition('bottom-right')} style={btnStyle}>↘</button>
            </div>

            {/* NAMETAG */}
            <div style={{
                background: 'rgba(0,0,0,0.7)',
                padding: '5px 15px',
                borderRadius: '15px',
                border: '1px solid var(--neon-green)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                marginTop: '-5px'
            }}>
                PRESENTER
            </div>
        </div>
    );
};

const btnStyle = {
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default WebcamOverlay;
