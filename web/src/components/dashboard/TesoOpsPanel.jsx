import React, { useState, useEffect, useRef } from 'react';

// --- ENRICHED CYBER-OPS THEME ---
const theme = {
    bg: 'rgba(5, 7, 10, 0.95)', // Deep Space Blue/Black (Original Rich)
    panelBg: 'rgba(15, 23, 42, 0.6)', // Translucent Slate
    border: '#1e293b', // Slate 800
    textMain: '#e2e8f0', // Slate 200
    textDim: '#64748b', // Slate 500
    accent: '#06b6d4', // Cyan 500 (Legacy)
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#ef4444', // Red 500
    fontMono: '"JetBrains Mono", "Fira Code", monospace',
    fontSans: '"Inter", system-ui, sans-serif',
    // NEON PALETTE
    neonCyan: '#00F0FF',
    neonPink: '#FF003C',
    neonYellow: '#FNEE38',
    neonGreen: '#39FF14'
};

// --- ANIMATIONS ---
const keyframes = `
@keyframes blink { 50% { opacity: 0; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(0, 240, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0); } }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const TesoOpsPanel = ({ simulationData, activeView, planes, onDispatch }) => {
    // INTERNAL TABS (Sub-navigation for complex views)
    const [flightTab, setFlightTab] = useState('ARRIVALS'); // 'ARRIVALS' | 'DEPARTURES'
    const [searchTerm, setSearchTerm] = useState('');

    // CONSOLE STATE
    const [consoleLogs, setConsoleLogs] = useState([
        { timestamp: new Date().toLocaleTimeString(), msg: 'TESO_CORE_V4 Initialized.', type: 'INFO' },
        { timestamp: new Date().toLocaleTimeString(), msg: 'Awaiting Simulation Stream...', type: 'WAITING' }
    ]);
    const consoleEndRef = useRef(null);

    // Auto-scroll console
    useEffect(() => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [consoleLogs]);

    // Data Sync Log
    useEffect(() => {
        if (simulationData?.services) {
            const time = new Date().toLocaleTimeString();
            setConsoleLogs(prev => [...prev.slice(-50), { timestamp: time, msg: `SYNC: ${simulationData.services.length} Operations Loaded.`, type: 'SUCCESS' }]);
        }
    }, [simulationData]);

    // LOGIC: Map activeView (from NeonNavbar) to Content
    // 'FLOTA', 'ORDENES', 'VUELOS', 'CLIENTES', 'AGENDA', 'FINANZAS', 'MERCADO', 'CORE_V4'

    // Stats Logic
    const totalUnits = simulationData?.services?.length || 0;
    const activeUnits = simulationData?.services?.filter(s => s.status !== 'COMPLETED').length || 0;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: theme.bg,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: theme.fontSans,
            color: theme.textMain,
            overflow: 'hidden',
            borderLeft: `1px solid ${theme.border}`,
            backdropFilter: 'blur(10px)'
        }}>
            <style>{keyframes}</style>

            {/* 1. RICH HEADER (GLOBAL) */}
            <div style={{
                padding: '15px 20px',
                borderBottom: `1px solid ${theme.border}`,
                background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4))'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px', color: theme.textMain }}>
                        TESO <span style={{ color: theme.accent }}>OPS</span>
                    </div>
                    <div style={{
                        fontSize: '0.7rem', color: theme.success, border: `1px solid ${theme.success}40`,
                        padding: '2px 8px', borderRadius: '12px', background: `${theme.success}10`, fontWeight: 700,
                        animation: 'pulse 3s infinite'
                    }}>
                        {activeView ? activeView : '● LIVE'}
                    </div>
                </div>

                {/* STATS ROW */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: theme.textDim, fontFamily: theme.fontMono }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>UNIDADES:</span>
                        <span style={{ color: theme.textMain, fontWeight: 700 }}>{totalUnits}</span>
                    </div>
                    <div style={{ width: '1px', background: theme.border, height: '14px' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>OPS ACTIVAS:</span>
                        <span style={{ color: theme.accent, fontWeight: 700 }}>{activeUnits}</span>
                    </div>
                </div>
            </div>

            {/* 2. CONTENT AREA (SWITCHABLE) */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* --- VIEW: VUELOS (FLIGHTS) --- */}
                {activeView === 'VUELOS' && (
                    <div style={{ padding: '20px', animation: 'slideIn 0.3s ease-out' }}>

                        {/* SEARCH */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '0.8rem', opacity: 0.5 }}>🔍</div>
                            <input
                                type="text"
                                placeholder="Buscar Vuelo, Ciudad..."
                                style={{
                                    width: '100%', background: 'rgba(30, 41, 59, 0.3)', border: `1px solid ${theme.border}`,
                                    borderRadius: '8px', padding: '10px 10px 10px 35px', color: theme.textMain, fontSize: '0.8rem',
                                    outline: 'none', fontFamily: theme.fontSans
                                }}
                            />
                        </div>

                        {/* --- NEON TOGGLES (REQUESTED FEATURE) --- */}
                        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px', marginBottom: '20px', border: `1px solid ${theme.border}` }}>
                            {/* BTN: ARRIVALS */}
                            <button
                                onClick={() => setFlightTab('ARRIVALS')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                    fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    // ACTIVE STATE:
                                    background: flightTab === 'ARRIVALS' ? `rgba(0, 240, 255, 0.15)` : 'transparent',
                                    color: flightTab === 'ARRIVALS' ? theme.neonCyan : theme.textDim,
                                    border: flightTab === 'ARRIVALS' ? `1px solid ${theme.neonCyan}` : '1px solid transparent',
                                    boxShadow: flightTab === 'ARRIVALS' ? `0 0 10px ${theme.neonCyan}40, inset 0 0 5px ${theme.neonCyan}20` : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                🛫 LLEGADAS
                            </button>

                            {/* BTN: DEPARTURES */}
                            <button
                                onClick={() => setFlightTab('DEPARTURES')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                    fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    // ACTIVE STATE:
                                    background: flightTab === 'DEPARTURES' ? `rgba(240, 240, 255, 0.15)` : 'transparent', // Slightly distinct? Or keep Cyan?
                                    color: flightTab === 'DEPARTURES' ? theme.neonCyan : theme.textDim,
                                    border: flightTab === 'DEPARTURES' ? `1px solid ${theme.neonCyan}` : '1px solid transparent', // Consistent Neon Cyan
                                    boxShadow: flightTab === 'DEPARTURES' ? `0 0 10px ${theme.neonCyan}40, inset 0 0 5px ${theme.neonCyan}20` : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                🛫 SALIDAS
                            </button>
                        </div>

                        {/* FLIGHT LIST (MOCK/SIM DATA) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', fontSize: '0.65rem', color: theme.textDim, fontWeight: 700, padding: '0 10px', marginBottom: '5px' }}>
                                <div>HORA</div>
                                <div>VUELO</div>
                                <div>PUERTA</div>
                                <div style={{ textAlign: 'right' }}>ESTADO</div>
                            </div>

                            {/* DYNAMIC LIST */}
                            {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                <div key={i} style={{
                                    display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr',
                                    background: 'rgba(255,255,255,0.02)', padding: '12px 10px', borderRadius: '6px',
                                    alignItems: 'center', borderBottom: `1px solid ${theme.border}`,
                                    fontSize: '0.8rem', color: theme.textMain
                                }}>
                                    <div style={{ fontFamily: theme.fontMono }}>{14 + i}:30</div>
                                    <div style={{ fontWeight: 700, color: theme.accent }}>
                                        {flightTab === 'ARRIVALS' ? 'AV' : 'LA'}9{300 + i * 10}
                                        <div style={{ fontSize: '0.65rem', color: theme.textDim, fontWeight: 400 }}>
                                            {flightTab === 'ARRIVALS' ? 'MIA -> MDE' : 'MDE -> BOG'}
                                        </div>
                                    </div>
                                    <div>{Math.floor(Math.random() * 10) + 1}</div>
                                    <div style={{ textAlign: 'right', fontWeight: 700, color: i % 3 === 0 ? theme.warning : theme.success, fontSize: '0.7rem' }}>
                                        {i % 3 === 0 ? 'RETRASADO' : 'A TIEMPO'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIEW: ORDENES / OPS (DEFAULT) --- */}
                {(activeView === 'ORDENES' || activeView === 'FLOTA' || !activeView || activeView === 'OPS') && (
                    <div style={{ padding: '20px', animation: 'slideIn 0.3s ease-out' }}>

                        {/* SEARCH */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '0.8rem', opacity: 0.5 }}>🔍</div>
                            <input
                                type="text"
                                placeholder="Buscar Orden, Unidad, Cliente [ENTER]"
                                style={{
                                    width: '100%', background: 'rgba(30, 41, 59, 0.3)', border: `1px solid ${theme.border}`,
                                    borderRadius: '8px', padding: '10px 10px 10px 35px', color: theme.textMain, fontSize: '0.8rem',
                                    outline: 'none', fontFamily: theme.fontSans
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.75rem', color: theme.textDim, marginBottom: '6px', cursor: 'pointer' }}>
                                ↩ Volver a Operaciones
                            </div>
                        </div>

                        {/* ACTIONS LIST */}
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '40px', // Capsule
                                    border: `1px solid ${theme.error}`,
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    boxShadow: `0 0 10px ${theme.error}40, inset 0 0 5px ${theme.error}10`,
                                    color: theme.error, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    marginBottom: '10px', transition: 'all 0.2s', textShadow: `0 0 5px ${theme.error}80`
                                }}
                                onClick={() => onDispatch && onDispatch({ type: 'KICKOFF' })}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🚨</span> SIMULACRO: DÍA CRÍTICO (60 OPS)
                            </button>
                        </div>

                        {/* CONSOLE */}
                        <div style={{ marginBottom: '10px', fontSize: '0.7rem', color: theme.textDim, fontWeight: 700, letterSpacing: '0.5px' }}>
                            EVENT STREAM
                        </div>
                        <div id="teso-console-log" style={{
                            background: '#000', border: `1px solid ${theme.border}`, borderRadius: '6px', padding: '12px',
                            fontFamily: theme.fontMono, fontSize: '0.7rem', height: '180px', overflowY: 'auto',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                        }}>
                            {consoleLogs.map((log, i) => (
                                <div key={i} style={{ marginBottom: '6px', display: 'flex', gap: '8px', opacity: 0.9 }}>
                                    <span style={{ color: '#444' }}>{log.timestamp}</span>
                                    <span style={{ color: log.type === 'SUCCESS' ? theme.success : log.type === 'WARNING' ? theme.warning : theme.textMain }}>
                                        {log.type === 'WAITING' && <span style={{ animation: 'blink 1s infinite' }}>_ </span>}
                                        {log.msg}
                                    </span>
                                </div>
                            ))}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                )}

                {/* --- FALLBACK FOR OTHER VIEWS --- */}
                {['CLIENTES', 'AGENDA', 'FINANZAS', 'MERCADO', 'CORE_V4'].includes(activeView) && (
                    <div style={{ padding: '40px', textAlign: 'center', animation: 'slideIn 0.3s ease-out', color: theme.textDim }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚧</div>
                        <h3>MÓDULO {activeView}</h3>
                        <p style={{ fontSize: '0.8rem' }}>Conectando con Backend V4...</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TesoOpsPanel;
