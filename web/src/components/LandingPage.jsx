import React, { useState, useEffect, lazy, Suspense } from 'react';
import UserRegistration from './onboarding/UserRegistration';
import DriverRegistration from './onboarding/DriverRegistration';

// import landingBg from '../assets/landing_bg.png'; // REMOVED: Using CSS Gradient for stability

export default function LandingPage({ onEnter }) {
    const [isEntering, setIsEntering] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [registrationMode, setRegistrationMode] = useState(null); // 'user' | 'driver' | null

    const handleRegistrationComplete = (data) => {
        setRegistrationMode(null);
        // Auto-login after registration
        // Pass user data up to App.jsx via onEnter if supported, or just enter for now
        // For demo purposes, we treat it as valid entry
        const roleParam = data.role === 'driver' ? 'driver' : 'client';

        // Update URL to reflect role without reload (simulated navigation)
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('role', roleParam);
        window.history.pushState({}, '', newUrl);

        handleEnter();
    };

    // Automatic entry effect (The "Wow" factor)
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true); // "Lowers" the presentation into the first plane
        }, 1000); // 1 Second delay to admire the background (Second Plane)
        return () => clearTimeout(timer);
    }, []);

    const handleEnter = () => {
        setIsEntering(true);
        setTimeout(() => {
            onEnter();
        }, 2000);
    };

    // Toggle for "Navigation Bar" (Manual control of planes)
    const toggleView = () => setMounted(!mounted);

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh', // Ensuring full height but allowing scroll
            // backgroundImage: `url(${landingBg})`, // REMOVED
            background: 'radial-gradient(circle at center, #1a2a3a 0%, #000000 100%)', // CYBERPUNK CSS FALLBACK
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed', // Fix background during scroll
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Push content apart
            alignItems: 'center',
            fontFamily: "'Outfit', 'Segoe UI', sans-serif",
            padding: '40px 20px',
            position: 'relative',
            overflowY: 'auto', // Allow vertical scrolling if content overflows
            overflowX: 'hidden'
        }}>

            {/* --- VERSION INDICATOR (FIXED TOP RIGHT) --- */}
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 9999,
                background: 'rgba(0,0,0,0.7)',
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #39FF14',
                color: '#39FF14',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                fontFamily: 'monospace'
            }}>
                v4.7 LIVE
            </div>

            {/* --- GLOBAL STYLES --- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;700;900&display=swap');
                
                :root {
                    --neon-green: #39FF14;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                
                @keyframes glowPulse {
                    0% { box-shadow: 0 0 5px #00f2ff, 0 0 10px #00f2ff inset; }
                    50% { box-shadow: 0 0 20px #00f2ff, 0 0 40px #00f2ff inset; }
                    100% { box-shadow: 0 0 5px #00f2ff, 0 0 10px #00f2ff inset; }
                }

                @keyframes scanline {
                    0% { top: -100%; }
                    100% { top: 200%; }
                }

                .glass-panel {
                    background: rgba(10, 20, 30, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 242, 255, 0.3);
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                }
            `}</style>

            {/* --- CYBERPUNK DYNAMIC BACKGROUND (CODE ONLY - NO IMAGES) --- */}

            {/* 1. Deep Space Base */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at center top, #1a0b2e 0%, #000000 80%)',
                zIndex: 0
            }} />

            {/* 2. Moving 3D Grid (The "Runway" Feel) */}
            <div style={{
                position: 'absolute', inset: 0,
                perspective: '1000px',
                overflow: 'hidden',
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '0', left: '-50%', right: '-50%', bottom: '0',
                    background: `
                        linear-gradient(rgba(0, 242, 255, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 242, 255, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px, 100px 100px',
                    transform: 'rotateX(60deg)',
                    transformOrigin: 'top center',
                    animation: 'gridMove 10s linear infinite',
                    boxShadow: '0 0 100px rgba(0, 242, 255, 0.2) inset'
                }} />
            </div>

            {/* 3. Horizon Glow */}
            <div style={{
                position: 'absolute', top: '0', left: '0', right: '0', height: '60%',
                background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
                zIndex: 1
            }} />

            <style>{`
                @keyframes gridMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 100px; }
                }
            `}</style>

            {/* --- LEFT NAVIGATION BAR (The "Barra que permite navegar") --- */}
            <div style={{
                position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 999
            }}>
                {/* Button 1: Background View (Second Plane) */}
                <button
                    onClick={() => setMounted(false)}
                    style={{
                        width: '10px', height: '40px', background: !mounted ? '#00f2ff' : 'rgba(255,255,255,0.1)',
                        border: '1px solid #00f2ff', borderRadius: '10px', cursor: 'pointer',
                        transition: 'all 0.3s', boxShadow: !mounted ? '0 0 15px #00f2ff' : 'none'
                    }}
                    title="Ver Segundo Plano (Fondo)"
                />
                {/* Button 2: Foreground View (First Plane) */}
                <button
                    onClick={() => setMounted(true)}
                    style={{
                        width: '10px', height: '40px', background: mounted ? 'gold' : 'rgba(255,255,255,0.1)',
                        border: '1px solid gold', borderRadius: '10px', cursor: 'pointer',
                        transition: 'all 0.3s', boxShadow: mounted ? '0 0 15px gold' : 'none'
                    }}
                    title="Ver Primer Plano (Presentación)"
                />
            </div>

            {/* --- HEADER CONTENT (TOP) --- */}
            <div style={{
                zIndex: 10,
                textAlign: 'center',
                marginTop: '4vh',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(-150px)',
                transition: 'all 1s ease-out'
            }}>
                <h1 style={{
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    margin: '0',
                    lineHeight: 0.9,
                    background: 'linear-gradient(180deg, #fff 0%, #00f2ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '8px',
                    fontWeight: '900',
                    filter: 'drop-shadow(0 0 20px rgba(0, 242, 255, 0.5))'
                }}>
                    TESO
                </h1>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                    marginTop: '10px'
                }}>
                    <div style={{ height: '1px', width: '50px', background: '#00f2ff' }}></div>
                    <p style={{
                        fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
                        color: '#b0e0e6',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        fontWeight: '300',
                        margin: 0
                    }}>
                        Transporte Ejecutivo Sostenible & Operativo
                    </p>
                    <div style={{ height: '1px', width: '50px', background: '#00f2ff' }}></div>
                </div>
            </div>

            {/* --- CENTER VISUALIZATION (THE "WOW" PART) --- */}
            <div style={{
                zIndex: 10,
                width: '100%',
                maxWidth: '1200px', // WIDENED
                height: '45vh', // TALLER
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible', // Allow planes to fly out
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s'
            }}>

                {/* --- ANIMATION CANVAS --- */}
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>

                    {/* Glowing Horizon Line (Road) - LOWERED */}
                    <div style={{
                        position: 'absolute', bottom: '10%', left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(0, 242, 255, 0.3), transparent)',
                        boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)'
                    }}></div>

                    {/* Nodes - WIDENED & LOWERED */}
                    <LocationNode side="left" icon="🛫" label="AEROPUERTO JMC" delay="0s" color="#00f2ff" />
                    <LocationNode side="right" icon="🏢" label="CORP. CENTER" delay="2s" color="#ffd700" />

                    {/* REALISTIC LANDING PLANE */}
                    <div style={{
                        position: 'absolute',
                        animation: 'planeLand 12s infinite linear'
                    }}>
                        <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 0 12px rgba(0, 242, 255, 0.8))' }}>✈️</div>

                        {/* LANDING LIGHT BEAM (Fuselage/Wing Root) - Adjusted between nose and wing */}
                        <div style={{
                            position: 'absolute',
                            top: '60%', left: '65%', /* Between nose and wing */
                            width: '110px', height: '45px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                            transformOrigin: 'left center',
                            transform: 'rotate(15deg)',
                            clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
                            filter: 'blur(5px)',
                            animation: 'beamPulse 2s infinite ease-in-out',
                            zIndex: -1
                        }}></div>

                        {/* Navigation Lights (Tiny & Realistic) */}
                        {/* Red (Port/Left Wing) */}
                        <div style={{
                            position: 'absolute', top: '55%', left: '25%', width: '3px', height: '3px',
                            background: '#ff0000', borderRadius: '50%',
                            boxShadow: '0 0 8px #ff0000',
                            animation: 'blink 2s infinite', animationDelay: '0.1s'
                        }}></div>

                        {/* Green (Starboard/Right Wing) */}
                        <div style={{
                            position: 'absolute', top: '35%', left: '60%', width: '3px', height: '3px',
                            background: '#00ff00', borderRadius: '50%',
                            boxShadow: '0 0 8px #00ff00',
                            opacity: 0.8
                        }}></div>

                        {/* White Strobe (Tail/Rear) - Flashing sharply */}
                        <div style={{
                            position: 'absolute', top: '65%', left: '75%', width: '4px', height: '4px',
                            background: '#ffffff', borderRadius: '50%',
                            boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff',
                            animation: 'blink 1.2s infinite ease-out'
                        }}></div>
                    </div>

                    {/* REALISTIC TAKEOFF PLANE */}
                    <div style={{
                        position: 'absolute',
                        animation: 'planeTakeoff 12s infinite ease-in',
                        animationDelay: '6s'
                    }}>
                        <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 0 12px rgba(0, 242, 255, 0.8))' }}>✈️</div>

                        {/* TAKEOFF LIGHT BEAM (Fuselage/Wing Root) - Adjusted between nose and wing */}
                        <div style={{
                            position: 'absolute',
                            top: '60%', left: '65%', /* Between nose and wing */
                            width: '110px', height: '45px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                            transformOrigin: 'left center',
                            transform: 'rotate(15deg)',
                            clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
                            filter: 'blur(5px)',
                            animation: 'beamPulse 2s infinite ease-in-out',
                            zIndex: -1
                        }}></div>

                        {/* Navigation Lights */}
                        <div style={{
                            position: 'absolute', top: '55%', left: '25%', width: '3px', height: '3px',
                            background: '#ff0000', borderRadius: '50%',
                            boxShadow: '0 0 8px #ff0000',
                            opacity: 0.8
                        }}></div>
                        <div style={{
                            position: 'absolute', top: '35%', left: '60%', width: '3px', height: '3px',
                            background: '#00ff00', borderRadius: '50%',
                            boxShadow: '0 0 8px #00ff00',
                            animation: 'blink 2s infinite', animationDelay: '0.5s'
                        }}></div>
                        <div style={{
                            position: 'absolute', top: '65%', left: '75%', width: '4px', height: '4px',
                            background: '#ffffff', borderRadius: '50%',
                            boxShadow: '0 0 10px #ffffff',
                            animation: 'blink 1s infinite'
                        }}></div>
                    </div>

                    {/* DETAILED SUV VEHICLE (LOWERED to bottom 10%) */}
                    <div style={{
                        position: 'absolute', bottom: '10%', left: '50%',
                        transform: 'translate(-50%, 50%)', /* Center on road line */
                        width: '120px', height: '45px',
                        zIndex: 20,
                        animation: 'carShuttle 12s infinite ease-in-out'
                    }}>
                        {/* Car Icon SVG - Detailed SUV */}
                        <svg viewBox="0 0 140 50" style={{ width: '100%', filter: 'drop-shadow(0 0 8px var(--neon-green))' }}>
                            {/* Body */}
                            <path d="M10,35 L15,20 L35,12 L85,12 L120,20 L130,35 L130,42 L10,42 Z" fill="#050505" stroke="var(--neon-green)" strokeWidth="1.5" />

                            {/* Windows (Side) */}
                            <path d="M38,15 L82,15 L82,22 L36,22 Z" fill="#333" stroke="var(--neon-green)" strokeWidth="0.5" opacity="0.9" />
                            <path d="M86,15 L115,20 L112,22 L86,22 Z" fill="#333" stroke="var(--neon-green)" strokeWidth="0.5" opacity="0.9" />

                            {/* Windshield */}
                            <path d="M18,22 L32,15 L35,22 Z" fill="#444" stroke="var(--neon-green)" strokeWidth="0.5" opacity="0.7" />

                            {/* Wheels */}
                            <circle cx="30" cy="42" r="6" fill="#000" stroke="var(--neon-green)" strokeWidth="1.5" />
                            <circle cx="110" cy="42" r="6" fill="#000" stroke="var(--neon-green)" strokeWidth="1.5" />

                            {/* Headlights */}
                            <circle cx="128" cy="38" r="1.5" fill="#fff" filter="blur(1px)" />
                        </svg>

                        <div style={{
                            position: 'absolute', top: '55px', width: '100%', textAlign: 'center',
                            fontSize: '0.9rem', color: 'var(--neon-green)', letterSpacing: '2px', fontWeight: '900',
                            textShadow: '0 0 10px var(--neon-green)'
                        }}>TESO VIP</div>
                    </div>
                </div>

                {/* Status Overlay in Corner */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', fontSize: '0.7rem', color: '#888' }}>
                    <span style={{ color: '#00f2ff' }}>● ONLINE</span>
                    <span>LATency: 12ms</span>
                </div>
            </div>


            {/* --- BOTTOM ACTION AREA --- */}
            <div style={{
                zIndex: 100, // Ensure high z-index to be clickable above animations
                marginBottom: '5vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(100px)',
                transition: 'all 1s ease-out 0.6s'
            }}>

                {/* MAIN LOGIN (ADMIN/EXISTING) */}
                <button
                    onClick={handleEnter}
                    disabled={isEntering}
                    style={{
                        background: isEntering ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid #00f2ff',
                        color: isEntering ? 'transparent' : '#00f2ff',
                        padding: '18px 60px',
                        fontSize: '1rem',
                        letterSpacing: '3px',
                        borderRadius: '0',
                        clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)',
                        cursor: isEntering ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        position: 'relative',
                        animation: isEntering ? 'none' : 'glowPulse 3s infinite',
                        minWidth: '300px',
                        backdropFilter: 'blur(3px)'
                    }}
                    onMouseEnter={(e) => {
                        if (!isEntering) {
                            e.currentTarget.style.background = '#00f2ff';
                            e.currentTarget.style.color = '#000';
                            e.currentTarget.style.boxShadow = '0 0 30px #00f2ff';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isEntering) {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.color = '#00f2ff';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    {isEntering ? '' : 'INGRESAR AL HUB'}

                    {/* Loading State Spinner */}
                    {isEntering && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '24px', height: '24px', border: '3px solid #00f2ff', borderRadius: '50%',
                            borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                        }}></div>
                    )}
                </button>

                {/* REGISTRATION OPTIONS */}
                {!isEntering && (
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <button
                            onClick={() => setRegistrationMode('user')}
                            style={{
                                background: 'transparent', border: '1px solid #ffd700', color: '#ffd700',
                                padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '1px',
                                fontSize: '0.8rem', transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 10px #ffd700'}
                            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                        >
                            Soy Pasajero
                        </button>
                        <button
                            onClick={() => setRegistrationMode('driver')}
                            style={{
                                background: 'transparent', border: '1px solid #39FF14', color: '#39FF14',
                                padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '1px',
                                fontSize: '0.8rem', transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 10px #39FF14'}
                            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                        >
                            Soy Conductor
                        </button>
                        <button
                            onClick={() => setRegistrationMode('admin')}
                            style={{
                                background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff',
                                padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '1px',
                                fontSize: '0.8rem', transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 10px #00f2ff'}
                            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                        >
                            Admin
                        </button>
                    </div>
                )}

                <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '1px' }}>
                    SECURE CONNECTION v4.2 (ORCHESTRA) | MEDELLÍN
                </div>
            </div>

            {/* --- MODALS --- */}
            {registrationMode === 'admin' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.9)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#111', border: '1px solid #00f2ff', padding: '30px',
                        display: 'flex', flexDirection: 'column', gap: '15px', width: '300px'
                    }}>
                        <h3 style={{ color: '#00f2ff', margin: 0 }}>ACCESO CLASIFICADO</h3>
                        <input
                            type="password"
                            placeholder="CÓDIGO DE ACCESO"
                            style={{
                                background: '#222', border: '1px solid #333', color: '#fff',
                                padding: '10px', outline: 'none'
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (e.target.value === 'TESO2026') {
                                        handleRegistrationComplete({ role: 'admin' });
                                    } else {
                                        alert('ACCESO DENEGADO');
                                    }
                                }
                            }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setRegistrationMode(null)}
                                style={{ flex: 1, padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
                            >CANCELAR</button>
                        </div>
                    </div>
                </div>
            )}
            {registrationMode === 'user' && (
                <UserRegistration
                    onComplete={handleRegistrationComplete}
                    onCancel={() => setRegistrationMode(null)}
                />
            )}
            {registrationMode === 'driver' && (
                <DriverRegistration
                    onComplete={handleRegistrationComplete}
                    onCancel={() => setRegistrationMode(null)}
                />
            )}

            {/* --- KEYFRAMES --- */}
            <style>{`
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes strobe {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.5); }
                }

                @keyframes cityPulse {
                    0% { filter: drop-shadow(0 0 5px #ffd700) brightness(1); }
                    50% { filter: drop-shadow(0 0 20px #ffd700) brightness(1.3); }
                    100% { filter: drop-shadow(0 0 5px #ffd700) brightness(1); }
                }

                 @keyframes neonFlicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                        text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;
                        opacity: 1;
                    }
                    20%, 24%, 55% {
                        text-shadow: none;
                        opacity: 0.5;
                    }
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }

                @keyframes flicker {
                    0% { opacity: 0.1; }
                    5% { opacity: 1; }
                    10% { opacity: 0.1; }
                    15% { opacity: 1; }
                    20% { opacity: 0.1; }
                    100% { opacity: 0.1; }
                }

                @keyframes beamPulse {
                    0% { opacity: 0.4; height: 60px; }
                    50% { opacity: 0.7; height: 80px; }
                    100% { opacity: 0.4; height: 60px; }
                }
                
                /* LANDING: Controlled Stable Approach (Glide Slope)
                   Emoji ✈️ defaults to pointing NE (45°).
                   Rotate(45deg) makes it point East (Level).
                   Rotate(60deg) makes it point slightly Down (Descent).
                   Rotate(35deg) makes it point slightly Up (Flare).
                */
                @keyframes planeLand {
                    0% { left: -10%; top: 10%; transform: rotate(60deg) scale(0.6); opacity: 0; } /* Start gentle descent */
                    10% { opacity: 1; }
                    50% { left: 40%; top: 55%; transform: rotate(60deg) scale(0.9); } /* Steady glide */
                    60% { left: 45%; top: 65%; transform: rotate(45deg) scale(1); } /* Level out */
                    70% { left: 50%; top: 65%; transform: rotate(35deg) scale(1); opacity: 1; } /* Flare (Nose up) & Touchdown */
                    80% { left: 60%; top: 65%; transform: rotate(35deg) scale(1); opacity: 0; } /* Rollout & Vanish */
                    100% { left: 60%; top: 65%; opacity: 0; }
                }

                /* TAKEOFF: Matches 'Airplane Departure' 🛫 icon orientation.
                   Start: Rotate(45deg) = Level/East (Runway Roll).
                   Climb: Rotate(0deg) = Natural NE (Standard Departure Angle).
                */
                @keyframes planeTakeoff {
                    0% { left: 50%; top: 65%; transform: rotate(45deg) scale(1); opacity: 0; }
                    1% { left: 50%; top: 65%; transform: rotate(45deg) scale(1); opacity: 1; } /* Appear Level */
                    20% { left: 65%; top: 65%; transform: rotate(45deg) scale(1); } /* Roll Level */
                    30% { left: 70%; top: 55%; transform: rotate(20deg) scale(1); } /* Rotate/Lift */
                    100% { left: 120%; top: -10%; transform: rotate(0deg) scale(0.8); opacity: 0; } /* Climb Out NE */
                }

                @keyframes carShuttle {
                    0% { left: 2%; transform: translate(0, 50%) scaleX(1); opacity: 0; }
                    5% { opacity: 1; }
                    45% { left: 85%; transform: translate(0, 50%) scaleX(1); } /* Arrive Right (Wider) */
                    50% { left: 85%; transform: translate(0, 50%) scaleX(-1); } /* Turn */
                    90% { left: 2%; transform: translate(0, 50%) scaleX(-1); } /* Arrive Left (Wider) */
                    95% { opacity: 1; }
                    100% { left: 2%; transform: translate(0, 50%) scaleX(1); opacity: 0; } /* Reset */
                }
            `}</style>
        </div>
    );
};

// Sub-component for locations
const LocationNode = ({ side, icon, label, delay, color }) => (
    <div style={{
        position: 'absolute', bottom: '15%',
        [side]: '0%',
        textAlign: side === 'left' ? 'left' : 'right',
        animation: `float 6s ease-in-out infinite ${delay}`
    }}>
        <div style={{
            fontSize: '3.5rem',
            filter: `drop-shadow(0 0 15px ${color})`,
            marginBottom: '10px',
            animation: side === 'right' ? 'cityPulse 4s infinite' : 'none' // Add city pulse only to Corp
        }}>{icon}</div>
        <div style={{
            fontSize: '0.8rem', fontWeight: 'bold', color: color,
            textTransform: 'uppercase', letterSpacing: '1px',
            animation: side === 'right' ? 'neonFlicker 4s infinite' : 'none',
            textShadow: side === 'right' ? `0 0 10px ${color}` : 'none'
        }}>{label}</div>
        <div style={{
            width: '40px', height: '2px', background: color,
            margin: side === 'left' ? '0' : '0 0 0 auto',
            boxShadow: `0 0 10px ${color}`
        }}></div>
    </div>
);


