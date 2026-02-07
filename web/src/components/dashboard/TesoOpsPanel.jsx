import React, { useState, useEffect, useRef } from 'react';

// --- ENRICHED CYBER-OPS THEME ---
const theme = {
    bg: 'rgba(5, 7, 10, 0.95)', // Deep Space Blue/Black (Original Rich)
    panelBg: 'rgba(15, 23, 42, 0.6)', // Translucent Slate
    border: '#1e293b', // Slate 800
    textMain: '#e2e8f0', // Slate 200
    textDim: '#64748b', // Slate 500
    accent: '#06b6d4', // Cyan 500 (Teso Brand)
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#ef4444', // Red 500
    fontMono: '"JetBrains Mono", "Fira Code", monospace',
    fontSans: '"Inter", system-ui, sans-serif',
};

// --- ANIMATIONS ---
const keyframes = `
@keyframes blink { 50% { opacity: 0; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); } 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); } }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const TesoOpsPanel = ({ simulationData, activeView, onDispatch }) => {
    const [activeTab, setActiveTab] = useState('OPS');
    const [searchTerm, setSearchTerm] = useState('');
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

    const tabs = [
        { id: 'OPS', label: 'OPERACIONES', icon: '⚡' },
        { id: 'LOGS', label: 'SYSTEM LOGS', icon: '📠' },
        { id: 'DATA', label: 'DATASET', icon: '💾' }
    ];

    // Stats
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

            {/* 1. RICH HEADER */}
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
                        ● LIVE
                    </div>
                </div>

                {/* STATS ROW (User Liked This) */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: theme.textDim, fontFamily: theme.fontMono }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>UNIDADES:</span>
                        <span style={{ color: theme.textMain, fontWeight: 700 }}>{totalUnits}</span>
                    </div>
                    <div style={{ width: '1px', background: theme.border, height: '14px' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>ACTIVAS:</span>
                        <span style={{ color: theme.accent, fontWeight: 700 }}>{activeUnits}</span>
                    </div>
                </div>
            </div>

            {/* 2. PILL TABS */}
            <div style={{
                display: 'flex', padding: '10px 15px', gap: '8px', borderBottom: `1px solid ${theme.border}`,
                background: 'rgba(0,0,0,0.2)'
            }}>
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px', // Pill Shape
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                transition: 'all 0.2s',
                                border: isActive ? `1px solid ${theme.accent}60` : '1px solid transparent',
                                background: isActive ? `${theme.accent}15` : 'transparent',
                                color: isActive ? theme.accent : theme.textDim
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* 3. CONTENT AREA */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* VIEW: OPS (Main Control) */}
                {activeTab === 'OPS' && (
                    <div style={{ padding: '20px', animation: 'slideIn 0.3s ease-out' }}>

                        {/* SEARCH (Enriched) */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '0.8rem', opacity: 0.5 }}>🔍</div>
                            <input
                                type="text"
                                placeholder="Buscar Unidad, Orden o Cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', background: 'rgba(30, 41, 59, 0.3)', border: `1px solid ${theme.border}`,
                                    borderRadius: '8px', padding: '10px 10px 10px 35px', color: theme.textMain, fontSize: '0.8rem',
                                    outline: 'none', fontFamily: theme.fontSans, transition: 'border 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = theme.accent}
                                onBlur={(e) => e.target.style.borderColor = theme.border}
                            />
                        </div>

                        {/* ACTIONS LIST */}
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '8px', border: `1px solid ${theme.accent}40`,
                                    background: `linear-gradient(90deg, ${theme.accent}10 0%, transparent 100%)`,
                                    color: theme.accent, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    marginBottom: '10px', transition: 'all 0.2s'
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = `${theme.accent}20`; }}
                                onMouseOut={e => { e.currentTarget.style.background = `linear-gradient(90deg, ${theme.accent}10 0%, transparent 100%)`; }}
                                onClick={() => onDispatch && onDispatch({ type: 'KICKOFF' })}
                            >
                                <span>▶</span> INICIAR SIMULACIÓN V4
                            </button>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button style={{
                                    padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`,
                                    background: 'rgba(255,255,255,0.03)', color: theme.textDim, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                                }}>
                                    📡 RADAR SCAN
                                </button>
                                <button style={{
                                    padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`,
                                    background: 'rgba(255,255,255,0.03)', color: theme.textDim, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                                }}>
                                    📊 EXPORTAR
                                </button>
                            </div>
                        </div>

                        {/* CONSOLE (Now integrated as a "HUD Element") */}
                        <div style={{ marginBottom: '10px', fontSize: '0.7rem', color: theme.textDim, fontWeight: 700, letterSpacing: '0.5px' }}>
                            EVENT STREAM
                        </div>
                        <div style={{
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

                {/* VIEW: DATA/DEPLOYMENTS (List) */}
                {(activeTab === 'DATA' || activeTab === 'LOGS') && (
                    <div style={{ padding: '0', animation: 'slideIn 0.3s ease-out' }}>
                        {(simulationData?.services || []).slice(0, 30).map((u, i) => (
                            <div key={i} style={{
                                padding: '12px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                cursor: 'pointer', transition: 'background 0.2s', background: 'transparent'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                onClick={() => onDispatch && onDispatch({ type: 'FLY_TO', payload: u })}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: u.status === 'COMPLETED' ? theme.success : theme.warning,
                                        boxShadow: u.status === 'COMPLETED' ? `0 0 8px ${theme.success}60` : 'none'
                                    }}></div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: theme.textMain }}>{u.plate || u.id}</div>
                                        <div style={{ fontSize: '0.7rem', color: theme.textDim }}>{u.driver_name || 'System Auto-Pilot'}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: theme.textDim, fontFamily: theme.fontMono }}>
                                    {u.financials?.totalValue ? `$${(u.financials.totalValue / 1000).toFixed(0)}k` : '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default TesoOpsPanel;
