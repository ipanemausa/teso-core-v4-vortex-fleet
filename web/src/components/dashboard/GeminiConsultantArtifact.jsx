import React, { useState } from 'react';

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

    const handleSimulate = (agent) => {
        setSimulationStatus('ANALYZING');
        // Mock delay for simulation effect
        setTimeout(() => {
            setSimulationStatus('DONE');
        }, 2000);
    };

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
            flexDirection: 'column',
            padding: '40px',
            fontFamily: 'var(--font-main)',
            color: '#fff'
        }}>
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
                    style={{ background: 'transparent', border: '1px solid #334155', color: '#fff', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' }}
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
                                            background: selectedAgent.color,
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer'
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
        </div>
    );
};

export default GeminiConsultantArtifact;
