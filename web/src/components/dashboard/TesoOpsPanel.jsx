import React, { useState, useEffect, useRef } from 'react';

// --- VERCEL / DOCKER INSPIRED THEME ---
const theme = {
    bg: '#000000',
    panelBg: '#0a0a0a',
    border: '#333333',
    textMain: '#ffffff',
    textDim: '#888888',
    accent: '#0070f3', // Vercel Blue
    success: '#50e3c2', // Teal/Green
    warning: '#f5a623', // Amber
    error: '#ff0000',
    fontMono: '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace',
    fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const TesoOpsPanel = ({ simulationData, activeView, onDispatch }) => {
    const [activeTab, setActiveTab] = useState('TERMINAL');
    const [searchTerm, setSearchTerm] = useState('');
    const [consoleLogs, setConsoleLogs] = useState([
        { timestamp: new Date().toLocaleTimeString(), msg: 'System initialized.', type: 'INFO' },
        { timestamp: new Date().toLocaleTimeString(), msg: 'Waiting for simulation stream...', type: 'WAITING' }
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
            setConsoleLogs(prev => [...prev.slice(-50), { timestamp: time, msg: `Synced ${simulationData.services.length} entities.`, type: 'SUCCESS' }]);
        }
    }, [simulationData]);

    const tabs = ['TERMINAL', 'DEPLOYMENTS', 'LOGS', 'SETTINGS'];

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
            borderLeft: `1px solid ${theme.border}`
        }}>
            {/* 1. WINDOW HEADER (Mac/VSCode Style) */}
            <div style={{
                height: '40px',
                background: theme.panelBg,
                borderBottom: `1px solid ${theme.border}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: theme.textDim, fontWeight: 500, letterSpacing: '0.5px' }}>
                    TESO_OPS: {activeView}
                </div>
                <div style={{ fontSize: '0.8rem', color: theme.textDim }}>☰</div>
            </div>

            {/* 2. TABS ROW */}
            <div style={{
                display: 'flex',
                borderBottom: `1px solid ${theme.border}`,
                background: theme.panelBg,
                height: '35px'
            }}>
                {tabs.map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0 15px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: activeTab === tab ? theme.textMain : theme.textDim,
                            borderBottom: activeTab === tab ? `2px solid ${theme.accent}` : '2px solid transparent',
                            background: activeTab === tab ? 'rgba(255,255,255,0.05)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* 3. SCROLLABLE CONTENT AREA */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column' }}>

                {/* VIEW: TERMINAL (Overview) */}
                {activeTab === 'TERMINAL' && (
                    <div style={{ padding: '20px' }}>
                        {/* PROJECT STATUS CARD */}
                        <div style={{
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            background: '#000',
                            padding: '15px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Production Deployment</div>
                                    <div style={{ fontSize: '0.7rem', color: theme.textDim }}>teso-core-v4-8f2a1c</div>
                                </div>
                                <div style={{
                                    padding: '4px 10px', borderRadius: '12px', background: `${theme.success}20`, color: theme.success,
                                    fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${theme.success}40`, height: 'fit-content'
                                }}>
                                    ● READY
                                </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: theme.textDim, marginBottom: '5px' }}>
                                <span style={{ color: theme.textMain }}>git commit:</span> feat(ui): master dataset loaded (10m ago)
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button style={{
                                    flex: 1, padding: '8px', background: theme.textMain, color: '#000', border: 'none', borderRadius: '4px',
                                    fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer'
                                }} onClick={() => onDispatch && onDispatch({ type: 'KICKOFF' })}>
                                    Visit
                                </button>
                                <button style={{
                                    flex: 1, padding: '8px', background: 'transparent', color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: '4px',
                                    fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer'
                                }} onClick={() => onDispatch && onDispatch({ type: 'DISPATCH_ALL' })}>
                                    Manage
                                </button>
                            </div>
                        </div>

                        {/* CONSOLE OUTPUT */}
                        <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: theme.textDim, fontWeight: 700 }}>BUILD LOGS</div>
                        <div style={{
                            background: '#000', border: `1px solid ${theme.border}`, borderRadius: '6px', padding: '15px',
                            fontFamily: theme.fontMono, fontSize: '0.7rem', height: '200px', overflowY: 'auto'
                        }}>
                            {consoleLogs.map((log, i) => (
                                <div key={i} style={{ marginBottom: '6px', display: 'flex', gap: '10px' }}>
                                    <span style={{ color: '#444' }}>{log.timestamp}</span>
                                    <span style={{ color: log.type === 'SUCCESS' ? theme.success : log.type === 'WARNING' ? theme.warning : theme.textMain }}>
                                        {log.type === 'WAITING' && <span className="blink">_ </span>}
                                        {log.msg}
                                    </span>
                                </div>
                            ))}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                )}

                {/* VIEW: DEPLOYMENTS (Units/Fleet) */}
                {activeTab === 'DEPLOYMENTS' && (
                    <div>
                        {/* SEARCH BAR */}
                        <div style={{ padding: '15px', borderBottom: `1px solid ${theme.border}` }}>
                            <input
                                type="text"
                                placeholder="Search deployments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', background: '#000', border: `1px solid ${theme.border}`, borderRadius: '5px',
                                    padding: '8px 12px', color: '#fff', fontSize: '0.8rem', outline: 'none'
                                }}
                            />
                        </div>

                        {/* LIST */}
                        <div style={{ padding: '0' }}>
                            {(simulationData?.services || []).slice(0, 20).map((u, i) => (
                                <div key={i} style={{
                                    padding: '12px 15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    cursor: 'pointer', transition: 'background 0.2s', background: 'transparent'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => onDispatch && onDispatch({ type: 'FLY_TO', payload: u })}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '2px' }}>{u.plate || u.id}</div>
                                        <div style={{ fontSize: '0.7rem', color: theme.textDim }}>{u.driver_name || 'Automatic Deployment'}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: '0.7rem', color: u.status === 'COMPLETED' ? theme.success : theme.warning, fontWeight: 500 }}>
                                            {u.status === 'COMPLETED' ? '● Ready' : '◌ Building'}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#444' }}>10m ago</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 4. FOOTER STATUS */}
            <div style={{
                height: '30px', borderTop: `1px solid ${theme.border}`, background: theme.panelBg,
                display: 'flex', alignItems: 'center', padding: '0 10px', justifyContent: 'space-between',
                fontSize: '0.7rem', color: theme.textDim, fontFamily: theme.fontMono
            }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <span>Main</span>
                    <span><span style={{ color: theme.textMain }}>{simulationData?.services?.length || 0}</span> Units</span>
                </div>
                <div>
                    v4.8.2-beta
                </div>
            </div>
        </div>
    );
};

export default TesoOpsPanel;
