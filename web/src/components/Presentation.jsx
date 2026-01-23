import React, { useState, useEffect } from 'react';
import { getSlides, titleStyle, subtitleStyle } from '../data/presentationData';

const Presentation = ({ onClose, onStartDemo, controlledState = null, onStateChange = null }) => {
    // Local State (Fallback)
    const [localSlide, setLocalSlide] = useState(0);
    const [localCard, setLocalCard] = useState(null);
    const [localRoadmapStep, setLocalRoadmapStep] = useState(null);

    // Determine Source of Truth
    const isControlled = controlledState !== null;

    const currentSlide = isControlled ? controlledState.slide : localSlide;
    const activeCard = isControlled ? controlledState.card : localCard;
    const roadmapStep = isControlled ? controlledState.step : localRoadmapStep;

    // Unified Setters
    const setCurrentSlide = (val) => {
        const newVal = typeof val === 'function' ? val(currentSlide) : val;
        if (isControlled && onStateChange) {
            onStateChange({ ...controlledState, slide: newVal });
        } else {
            setLocalSlide(newVal);
        }
    };

    const setActiveCard = (val) => {
        if (isControlled && onStateChange) {
            onStateChange({ ...controlledState, card: val });
        } else {
            setLocalCard(val);
        }
    };

    const setRoadmapStep = (val) => {
        if (isControlled && onStateChange) {
            onStateChange({ ...controlledState, step: val });
        } else {
            setLocalRoadmapStep(val);
        }
    };

    const handleCardClick = (data) => {
        setActiveCard(data);
    };

    const slides = getSlides({ onClose, onStartDemo, handleCardClick, roadmapStep, setRoadmapStep });

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
            if (e.key === 'ArrowLeft') setCurrentSlide(prev => Math.max(prev - 1, 0));
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: '#000', zIndex: 99999, color: '#fff',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <style>
                {`
                    @keyframes kenBurns {
                        0% { transform: scale(1); }
                        100% { transform: scale(1.15); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .ken-burns-bg {
                        animation: kenBurns 20s ease-in-out infinite alternate;
                    }
                    .animate-entry {
                        animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                    .card-hover {
                        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                        cursor: default;
                    }
                    .card-hover:hover {
                        transform: translateY(-8px) scale(1.02);
                        background: rgba(255, 255, 255, 0.15) !important;
                        box-shadow: 0 20px 50px rgba(0, 240, 255, 0.25) !important;
                        border-color: rgba(0, 240, 255, 0.6) !important;
                    }
                    /* Modal Animation */
                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .glass-modal {
                        animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    /* Pulse animation for key metrics */
                    @keyframes pulse-glow {
                        0% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.4); }
                        70% { box-shadow: 0 0 0 10px rgba(0, 240, 255, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0); }
                    }
                    /* Handshake/Agreement Animation for Slide 10 */
                    @keyframes handShake {
                        0% { transform: scale(1.15) translateY(0); }
                        50% { transform: scale(1.15) translateY(-10px); }
                        100% { transform: scale(1.15) translateY(0); }
                    }
                    .ken-burns-bg {
                        animation: kenBurns 20s ease-in-out infinite alternate;
                    }
                    .handshake-bg {
                        animation: handShake 3s ease-in-out infinite;
                    }
                    /* Diamond Animation */
                    @keyframes diamondFloat {
                        0% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 0 20px rgba(0,240,255,0.5)); }
                        50% { transform: translateY(-15px) rotate(5deg); filter: drop-shadow(0 0 50px rgba(0,240,255,0.9)); }
                        100% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 0 20px rgba(0,240,255,0.5)); }
                    }
                    .diamond-anim {
                        animation: diamondFloat 4s ease-in-out infinite;
                    }
                `}
            </style>

            {/* BACKGROUND IMAGE LAYER */}
            <div
                className={currentSlide === 9 ? "handshake-bg" : "ken-burns-bg"}
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${slides[currentSlide].bgImage})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: 0.85, // INCREASED BRIGHTNESS
                    transition: 'background-image 0.5s ease-in-out'
                }}></div>

            {/* DARK OVERLAY GRADIENT (LIGHTER) */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, rgba(5,10,20,0.7) 0%, rgba(5,10,20,0.4) 50%, rgba(5,10,20,0.85) 100%)'
            }}></div>

            {/* PROGRESS BAR */}
            <div style={{ position: 'relative', width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', zIndex: 10, flexShrink: 0 }}>
                <div style={{ width: `${((currentSlide + 1) / slides.length) * 100}%`, height: '100%', background: 'var(--neon-green)', transition: 'width 0.5s ease' }}></div>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div style={{
                position: 'relative',
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                zIndex: 10,
                // Removed display: flex here to allow normal block flow scroll behavior
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '1200px', // Restored width
                    minHeight: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div key={currentSlide} className="animate-entry" style={{
                        width: '100%',
                        flex: 1, // Allow this to grow/shrink
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center', // Center vertically if space allows
                        gap: '10px',
                        padding: 'clamp(20px, 3vh, 40px) 20px' // Optimized padding
                    }}>

                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <h4 style={subtitleStyle}>{slides[currentSlide].subtitle}</h4>
                            <h1 style={titleStyle}>{slides[currentSlide].title}</h1>
                        </div>

                        <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {slides[currentSlide].content}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL OVERLAY */}
            {activeCard && (
                <div
                    onClick={() => setActiveCard(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                        zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <div
                        className="glass-modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'rgba(20, 20, 30, 0.95)',
                            padding: '40px', borderRadius: '30px',
                            maxWidth: '600px', width: '100%',
                            border: '1px solid var(--neon-green)',
                            boxShadow: '0 0 50px rgba(57, 255, 20, 0.2)',
                            textAlign: 'center', position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setActiveCard(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                        >✕</button>

                        {activeCard.icon && <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{activeCard.icon}</div>}
                        <h2 style={{ color: 'var(--neon-green)', fontSize: '2rem', marginBottom: '10px' }}>{activeCard.title}</h2>
                        <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '20px' }}>{activeCard.desc}</p>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', color: '#fff', fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'left' }}>
                            {activeCard.detail}
                        </div>

                        <button
                            onClick={() => setActiveCard(null)}
                            style={{
                                marginTop: '30px', background: 'var(--neon-green)', color: '#000', border: 'none',
                                padding: '10px 30px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'
                            }}
                        >
                            ENTENDIDO
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER CONTROLS */}
            <div style={{ position: 'relative', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', color: '#888', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 10, background: 'rgba(0,0,0,0.9)', fontSize: '0.8rem', flexShrink: 0 }}>
                <div>TESO DECK v5.0</div>
                <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
                    <button onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px 30px', borderRadius: '20px' }}>←</button>
                    <span style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center' }}>{currentSlide + 1} / {slides.length}</span>
                    <button onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))} style={{ background: 'var(--neon-green)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer', padding: '10px 30px', borderRadius: '20px' }}>→</button>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', position: 'absolute', right: '20px', fontSize: '1.2rem' }}>✖</button>
            </div>
        </div>
    );
};

export default Presentation;
