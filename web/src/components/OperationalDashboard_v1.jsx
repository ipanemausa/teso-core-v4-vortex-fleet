import React, { useState, useEffect } from 'react';

const OperationalDashboard = ({ vehicles, requests }) => {
    // Simulated Agent States
    const [agents, setAgents] = useState([
        { id: 'AG-01', name: 'DISPATCH_CORE', task: 'Monitoring Routes', status: 'IDLE', load: 12 },
        { id: 'AG-02', name: 'FINANCE_AUDIT', task: 'Verifying Transactions', status: 'WORKING', load: 45 },
        { id: 'AG-03', name: 'SECURITY_OP', task: 'GPS Heartbeat Scan', status: 'SCANNING', load: 88 },
        { id: 'AG-04', name: 'CLIENT_REL', task: 'Sentiment Analysis', status: 'IDLE', load: 5 }
    ]);

    // Live Metrics State
    const [metrics, setMetrics] = useState({
        efficiency: 94,
        avgResponse: 12,
        errorRate: 0
    });

    // Simulate Agent Activity
    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(agent => {
                if (Math.random() > 0.7) {
                    const newLoad = Math.floor(Math.random() * 100);
                    let newStatus = 'WORKING';
                    let newTask = agent.task;

                    if (agent.name === 'DISPATCH_CORE') {
                        const tasks = ['Re-routing Unit 45', 'Optimizing ETA', 'Idle Check'];
                        newTask = tasks[Math.floor(Math.random() * tasks.length)];
                    } else if (agent.name === 'FINANCE_AUDIT') {
                        const tasks = ['Invoice #992 Validation', 'Credits Check', 'Tax Calculation'];
                        newTask = tasks[Math.floor(Math.random() * tasks.length)];
                    }

                    if (newLoad < 10) newStatus = 'IDLE';

                    return { ...agent, load: newLoad, status: newStatus, task: newTask };
                }
                return agent;
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #050a10 0%, #001520 100%)',
            color: '#fff',
            zIndex: 100, // On top of map
            padding: '80px 40px 40px 40px', // Space for top nav if any
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Outfit', sans-serif"
        }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#fff', letterSpacing: '2px' }}>CORE OPERATIVO</h1>
                    <span style={{ color: 'var(--neon-green)', fontSize: '0.9rem', letterSpacing: '1px' }}>● SISTEMA AUTÓNOMO ACTIVO</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, color: '#00F0FF' }}>{requests.length}</div>
                    <small style={{ color: '#888' }}>ÓRDENES ACTIVAS</small>
                </div>
            </div>

            {/* MAIN GRID */}
            <div style={{ display: 'flex', gap: '30px', flex: 1 }}>

                {/* COL 1: AGENT HIVE (The Workforce) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,242,255,0.2)', borderRadius: '15px', padding: '20px', flex: 1 }}>
                        <h3 style={{ marginTop: 0, color: '#00F0FF', fontSize: '1.2rem' }}>🤖 AGENT HIVE</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            {agents.map(agent => (
                                <div key={agent.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderLeft: `4px solid ${agent.status === 'WORKING' ? 'var(--neon-green)' : agent.status === 'SCANNING' ? 'gold' : '#555'}`,
                                    padding: '15px', borderRadius: '5px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{agent.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{agent.task}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: agent.status === 'IDLE' ? '#555' : '#fff' }}>{agent.status}</div>
                                        <div style={{ width: '60px', height: '4px', background: '#333', marginTop: '5px', borderRadius: '2px' }}>
                                            <div style={{ width: `${agent.load}%`, height: '100%', background: agent.load > 80 ? 'red' : 'var(--neon-green)', borderRadius: '2px', transition: 'width 0.5s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COL 2: METRICS & GOALS */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* KPI CARDS */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>{metrics.efficiency}%</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', letterSpacing: '1px' }}>EFICIENCIA FLOTA</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{metrics.avgResponse}m</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', letterSpacing: '1px' }}>TIEMPO RESPUESTA</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'gold' }}>{metrics.errorRate}</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', letterSpacing: '1px' }}>ERRORES CRÍTICOS</div>
                        </div>
                    </div>

                    {/* LIVE FEED CONSOLE */}
                    <div style={{ flex: 1, background: '#000', border: '1px solid #333', borderRadius: '15px', padding: '20px', fontFamily: 'monospace', overflowY: 'auto', position: 'relative' }}>
                        <div style={{ position: 'sticky', top: 0, background: '#000', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px', color: '#00F0FF', fontWeight: 'bold' }}>
                            &gt; SYSTEM LOGS
                        </div>
                        {[{ time: '10:42:01', msg: 'System stable.' }, { time: '10:42:05', msg: 'Agent FINANCE_AUDIT process started.' }, { time: '10:42:15', msg: 'Vehicle TES-991 reporting GPS deviation (Minor).' }].map((log, i) => (
                            <div key={i} style={{ marginBottom: '5px', fontSize: '0.9rem' }}>
                                <span style={{ color: '#555' }}>[{log.time}]</span> <span style={{ color: '#ddd' }}>{log.msg}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OperationalDashboard;
