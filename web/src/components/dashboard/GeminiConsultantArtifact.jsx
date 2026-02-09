import React, { useState } from 'react';
import Presentation from '../Presentation';

// --- DATA: GEMINI BUSINESS AGENTS KNOWLEDGE BASE ---
// This acts as the "Content" of the Artifact
const AGENT_CATALOG = [
    {
        id: 'MEET_PREP',
        name: 'Meeting Preparer',
        icon: '🗣️',
        role: 'Optimización de Reuniones',
        description: 'Prepara resúmenes, agendas y detecta tareas pendientes antes de la junta.',
        problem: 'Reuniones improductivas o sin agenda clara.',
        impact: 'Ahorra 15 min/reunión',
        color: '#fbbf24' // Amber
    },
    {
        id: 'INFO_HUNT',
        name: 'Information Hunter',
        icon: '🕵️',
        role: 'Gestión Documental',
        description: 'Rastrea información específica (facturas, contratos) en Drive y Gmail.',
        problem: 'Pérdida de tiempo buscando archivos dispersos.',
        impact: 'Recuperación inmediata de activos',
        color: '#34d399' // Emerald
    },
    {
        id: 'TRUST_WRITE',
        name: 'Trustworthy Writer',
        icon: '✍️',
        role: 'Calidad de Comunicación',
        description: 'Redacta correos y comunicados con tono corporativo y sin errores.',
        problem: 'Comucación inconsistente o informal con clientes.',
        impact: 'Mejora de imagen de marca',
        color: '#8b5cf6' // Violet
    }
];

const GeminiConsultantArtifact = ({ onClose }) => {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [simulationStatus, setSimulationStatus] = useState('IDLE'); // IDLE, ANALYZING, DONE
    const [activeSidebarItem, setActiveSidebarItem] = useState('VISION'); // Default to Vision/Gemini View

    const handleSimulate = (agent) => {
        setSimulationStatus('ANALYZING');
        // Mock delay for simulation effect
        setTimeout(() => {
            setSimulationStatus('DONE');
        }, 2000);
    };

    const sidebarItems = [
        { id: 'RADAR', label: 'RADAR JMC', icon: '📡', style: 'purple' },
        { id: 'VISION', label: 'VISIÓN IA', icon: '🧠', style: 'pink' },
        { id: 'NARANJA', label: 'NARANJA', icon: '🍊', style: 'orange' }, // NEW ITEM
        { id: 'OPTIMIZE', label: 'OPTIMIZE', icon: '📈', style: 'default' },
        { id: 'PEDIDOS', label: 'PEDIDOS', icon: '🔥', style: 'orange' },
        { id: 'FLOTA', label: 'FLOTA V4', icon: '🚚', style: 'green' },
        { id: 'PITCH', label: 'PITCH DECK', icon: '📢', style: 'purple-gradient' },
        { id: 'WHATSAPP', label: 'WHATSAPP', icon: '💬', style: 'default' },
        { id: 'GIT', label: 'SOURCE GIT', icon: '👾', style: 'default' }
    ];

    const handleSidebarClick = (id) => {
        if (id === 'RADAR') {
            onClose(); // Exit the artifact view
        } else {
            setActiveSidebarItem(id);
        }
    };

    // Render Presentation Mode
    if (activeSidebarItem === 'PITCH') {
        return <Presentation onClose={() => setActiveSidebarItem('VISION')} />;
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(5, 10, 20, 0.98)', // Deep dark background
            backdropFilter: 'blur(20px)',
            zIndex: 3000,
            display: 'flex',
            fontFamily: 'var(--font-main)',
            color: '#fff'
        }}>
            {/* SIDEBAR NAVIGATION */}
            <div style={{
                width: '90px',
                height: '100%',
                borderRight: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '20px',
                gap: '20px',
                background: 'rgba(0,0,0,0.3)',
                zIndex: 3010
            }}>
                {/* AVATAR / PROFILE */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #ff00cc, #333399)',
                    marginBottom: '10px',
                    boxShadow: '0 0 15px rgba(255, 0, 204, 0.5)',
                    border: '2px solid rgba(255,255,255,0.2)'
                }} />

                {sidebarItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => handleSidebarClick(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            opacity: activeSidebarItem === item.id ? 1 : 0.5,
                            transform: activeSidebarItem === item.id ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                    >
                        {/* Active Indicator Line */}
                        {activeSidebarItem === item.id && (
                            <div style={{
                                position: 'absolute', left: '-22px', top: '50%', transform: 'translateY(-50%)',
                                height: '25px', width: '3px', background: '#fff', borderRadius: '0 4px 4px 0'
                            }}></div>
                        )}

                        <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.5)', // Dark glass for neon contrast
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.4rem',
                            // NEON BORDER LOGIC
                            border: activeSidebarItem === item.id
                                ? `1px solid ${item.style === 'purple' ? '#a855f7' : item.style === 'pink' ? '#ec4899' : item.style === 'green' ? '#10b981' : item.style === 'orange' ? '#f97316' : '#fff'}`
                                : '1px solid #334155',
                            // NEON GLOW LOGIC
                            boxShadow: activeSidebarItem === item.id
                                ? `0 0 15px ${item.style === 'purple' ? '#a855f7' : item.style === 'pink' ? '#ec4899' : item.style === 'green' ? '#10b981' : item.style === 'orange' ? '#f97316' : '#fff'}80`
                                : 'none',
                            color: activeSidebarItem === item.id ? '#fff' : '#94a3b8',
                            transition: 'all 0.3s ease'
                        }}>
                            {item.icon}
                        </div>
                        <span style={{ fontSize: '0.6rem', marginTop: '6px', fontWeight: 'bold', maxWidth: '60px', textAlign: 'center', lineHeight: 1.1 }}>
                            {item.label}
                        </span>
                    </div>
                ))}

                {/* BOTTOM ROBOT ICON */}
                <div style={{ marginTop: 'auto', marginBottom: '20px', fontSize: '2rem', cursor: 'pointer', opacity: 0.7 }}>
                    🤖
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', overflowY: 'auto' }}>

                {activeSidebarItem === 'VISION' ? (
                    <>
                        {/* HEADER */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ fontSize: '3rem' }}>🧠</div>
                                <div>
                                    <h1 style={{ margin: 0, background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        GEMINI BUSINESS: ARTEFACTO CONSULTOR
                                    </h1>
                                    <p style={{ margin: 0, color: '#94a3b8' }}>Catálogo Interactivo de Agentes LHU • Integración TESO Core</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #00F0FF',
                                    color: '#00F0FF',
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.6)';
                                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.2)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                CERRAR ARTEFACTO ✖
                            </button>
                        </div>

                        {/* MAIN CONTENT GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', height: '100%' }}>

                            {/* LEFT: SELECTION MENU (THE "FLOW") */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ color: '#00F0FF', borderBottom: '1px solid #333', paddingBottom: '10px' }}>1. SELECCIONA UN DESAFÍO</h3>

                                {AGENT_CATALOG.map(agent => (
                                    <div
                                        key={agent.id}
                                        onClick={() => { setSelectedAgent(agent); setSimulationStatus('IDLE'); }}
                                        style={{
                                            padding: '20px',
                                            background: selectedAgent?.id === agent.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                                            border: selectedAgent?.id === agent.id ? `1px solid ${agent.color}` : '1px solid transparent',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px'
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem' }}>{agent.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: agent.color }}>{agent.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Soluciona: {agent.problem}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT: INTERACTIVE SIMULATION */}
                            <div style={{
                                background: '#0f172a',
                                borderRadius: '20px',
                                border: '1px solid #1e293b',
                                padding: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {!selectedAgent ? (
                                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>👆</div>
                                        <h2>Selecciona un Agente a la izquierda para ver su arquitectura.</h2>
                                    </div>
                                ) : (
                                    <div style={{ width: '100%', maxWidth: '600px' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>{selectedAgent.icon}</div>
                                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{selectedAgent.name}</h2>
                                            <p style={{ color: selectedAgent.color, fontWeight: 'bold' }}>{selectedAgent.role}</p>
                                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#cbd5e1', marginTop: '20px' }}>
                                                {selectedAgent.description}
                                            </p>
                                        </div>

                                        {/* ACTION AREA */}
                                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '16px', border: '1px dashed #475569' }}>
                                            {simulationStatus === 'IDLE' && (

                                                <button
                                                    onClick={() => handleSimulate(selectedAgent)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '15px',
                                                        background: 'transparent',
                                                        color: selectedAgent.color,
                                                        border: `1px solid ${selectedAgent.color}`,
                                                        borderRadius: '30px',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                        cursor: 'pointer',
                                                        boxShadow: `0 0 15px ${selectedAgent.color}40`,
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={e => {
                                                        e.currentTarget.style.boxShadow = `0 0 25px ${selectedAgent.color}80`;
                                                        e.currentTarget.style.background = `${selectedAgent.color}10`;
                                                    }}
                                                    onMouseOut={e => {
                                                        e.currentTarget.style.boxShadow = `0 0 15px ${selectedAgent.color}40`;
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    ▶ SIMULAR FLUJO DE TRABAJO
                                                </button>
                                            )}

                                            {simulationStatus === 'ANALYZING' && (
                                                <div style={{ textAlign: 'center' }}>
                                                    <div className="spinner" style={{ marginBottom: '15px' }}>⏳</div>
                                                    <div style={{ color: selectedAgent.color }}>Conectando con Gemini Business...</div>
                                                </div>
                                            )}

                                            {simulationStatus === 'DONE' && (
                                                <div style={{ animation: 'scanline 0.5s ease-out' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#39FF14', marginBottom: '15px' }}>
                                                        <span>✅</span>
                                                        <strong>IMPACTO PROYECTADO:</strong>
                                                    </div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                                        {selectedAgent.impact}
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                                        Este agente se puede desplegar hoy usando la infraestructura de TESO Core v3 conectada a la API de Vertex AI.
                                                    </div>
                                                    <button
                                                        onClick={() => setSimulationStatus('IDLE')}
                                                        style={{ marginTop: '20px', background: 'transparent', border: '1px solid #475569', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        Reiniciar Simulación
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </>
                ) : activeSidebarItem === 'NARANJA' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ marginBottom: '40px', color: '#ff8c00', letterSpacing: '4px', textTransform: 'uppercase' }}>
                            Naranja Furcado // USA Experience
                        </h2>

                        <div
                            className="product-card"
                            style={{
                                width: '400px', // Enlarged for better detail visibility
                                height: '600px',
                                position: 'relative',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                background: '#fff'
                            }}
                        >
                            {/* --- LAYER 1: MODEL REVEAL (Original Photo) --- */}
                            {/* TODO: Replace src with the REAL model photo URL provided by the client */}
                            <img
                                src="https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&w=800&q=90"
                                alt="Model Wearing Green Bikini"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 1
                                }}
                            />

                            {/* --- LAYER 2: PRODUCT ISOLATION (Clean PNG) --- */}
                            <div
                                className="product-png-layer"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    background: '#fff', // Pure white background standard
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)' // Smooth luxury transition
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0'} // Reveal Model
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'} // Return to Product
                            >
                                {/* 
                                    PLACEHOLDER SHAPES - REPLICATING "LIME GREEN" COLOR FIDELITY 
                                    TODO: Replace these divs with an <img src="PRODUCT_ONLY_TRANSPARENT.png" /> 
                                */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', transform: 'scale(1.2)' }}>
                                    {/* TOP */}
                                    <div style={{
                                        width: '180px',
                                        height: '90px',
                                        background: '#39FF14', // EXACT NEON LIME HEX
                                        borderRadius: '10px 10px 90px 90px',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)', // Soft volume shadow
                                        position: 'relative'
                                    }}>
                                        {/* Straps simulation */}
                                        <div style={{ position: 'absolute', top: -30, left: 20, width: '5px', height: '40px', background: '#39FF14' }}></div>
                                        <div style={{ position: 'absolute', top: -30, right: 20, width: '5px', height: '40px', background: '#39FF14' }}></div>
                                    </div>

                                    {/* BOTTOM */}
                                    <div style={{
                                        width: '160px',
                                        height: '80px',
                                        background: '#39FF14', // EXACT NEON LIME HEX
                                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)', // Triangle shape
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }}></div>
                                </div>

                                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                                    <h4 style={{ color: '#000', margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '900', letterSpacing: '2px' }}>ALEXXIA KNOT</h4>
                                    <p style={{ color: '#666', fontSize: '1rem', fontFamily: 'serif' }}>Lime Green • $120.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                        <div>
                            <h1>🚧 Módulo {sidebarItems.find(i => i.id === activeSidebarItem)?.label}</h1>
                            <p>En construcción bajo arquitectura V4.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeminiConsultantArtifact;
