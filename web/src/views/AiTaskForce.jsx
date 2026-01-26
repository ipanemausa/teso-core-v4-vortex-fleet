import React, { useState, useEffect } from 'react';

export function AiTaskForce({ onClose }) {
    const [logs, setLogs] = useState([
        { time: 'INIT', module: 'SYSTEM', msg: 'Orchestrator Online. Listening...', icon: '🟢' }
    ]);
    const [agents, setAgents] = useState([
        { name: 'MARKET SENSOR', id: 'MARK-712', status: 'SCANNING', icon: '📡', active: true },
        { name: 'PRICING CORE', id: 'PRIC-95', status: 'IDLE', icon: '🧠', active: false },
        { name: 'PAYMENT GUARDIAN', id: 'FINA-277', status: 'IDLE', icon: '🛡️', active: false },
        { name: 'LEGAL CHECK', id: 'COMP-343', status: 'IDLE', icon: '⚖️', active: false },
        { name: 'OPS SENTINEL', id: 'DISP-431', status: 'IDLE', icon: '🚀', active: false },
    ]);
    const [kpi1, setKpi1] = useState(94);
    const [kpi2, setKpi2] = useState(12);

    // DYNAMIC SIMULATION ENGINE
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().toLocaleTimeString('es-CO', { hour12: false });

            // Randomly trigger events
            const roll = Math.random();
            let newLog = null;
            let activeIndex = -1;

            if (roll > 0.7) {
                newLog = { time: now, module: 'MARKET', msg: 'New Demand Signal: Pax VIP (Dist: 12km) detected.', icon: '📡' };
                activeIndex = 0;
            } else if (roll > 0.5) {
                newLog = { time: now, module: 'PRICING', msg: 'Quote Generated: $45.000 COP (Dynamic Tariff).', icon: '🧠' };
                activeIndex = 1;
            } else if (roll > 0.3) {
                newLog = { time: now, module: 'FINANCE', msg: 'Payment Captured: Auth_X99201. Funds Secured.', icon: '🛡️' };
                activeIndex = 2;
            } else if (roll > 0.1) {
                newLog = { time: now, module: 'COMPLIANCE', msg: 'Driver Docs Validated. SOAT Active. Assigning...', icon: '⚖️' };
                activeIndex = 3;
            } else {
                newLog = { time: now, module: 'OPS', msg: 'Unit Dispatched. ETA 4 mins.', icon: '🚀' };
                activeIndex = 4;
            }

            if (newLog) {
                setLogs(prev => [newLog, ...prev].slice(0, 14)); // Keep last 14 logs

                // Animate Agents
                setAgents(prev => prev.map((a, i) => ({
                    ...a,
                    active: i === activeIndex,
                    status: i === activeIndex ? 'PROCESSING' : 'IDLE'
                })));

                // Jiggle KPIs
                if (Math.random() > 0.5) setKpi1(prev => Math.min(99, Math.max(90, prev + (Math.random() > 0.5 ? 1 : -1))));
                if (Math.random() > 0.5) setKpi2(prev => Math.min(15, Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1))));
            }

        }, 800); // Fast updates (0.8s)

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#020617', zIndex: 9999, color: '#fff', padding: '20px', fontFamily: "'Inter', monospace" }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', letterSpacing: '1px' }}>CORE OPERATIVO</h1>
                    <div style={{ background: '#00ff80', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>LIVE EVENTS</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>SHEET ANALYTICS</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ background: '#00ff80', color: '#000', padding: '5px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>● AUDIT ON</div>
                    <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>X SALIR</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 350px', gap: '20px', height: 'calc(100vh - 100px)' }}>

                {/* LEFT COLUMN: AI AGENTS */}
                <div>
                    <h3 style={{ color: '#00f2ff', fontSize: '1rem', marginBottom: '20px' }}>🧠 AI TASK FORCE <span style={{ fontSize: '0.7rem', color: '#666' }}>(MACRO ORCHESTRATION)</span></h3>

                    {agents.map(agent => (
                        <div key={agent.name} style={{
                            background: agent.active ? 'rgba(0, 242, 255, 0.1)' : '#0F172A',
                            border: agent.active ? '1px solid #00f2ff' : '1px solid #333',
                            padding: '15px', marginBottom: '10px', borderRadius: '8px', position: 'relative',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.5rem' }}>{agent.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: agent.active ? '#fff' : '#888' }}>{agent.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#666' }}>ID: {agent.id} | {agent.status}</div>
                                </div>
                            </div>
                            {agent.active && <div style={{ height: '2px', width: '100%', background: '#00ff80', marginTop: '10px', boxShadow: '0 0 10px #00ff80' }}></div>}
                        </div>
                    ))}
                </div>

                {/* CENTER COLUMN: METRICS & LOGS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* KPI TOP */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, background: '#0F172A', border: '1px solid #333', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00ff80' }}>{kpi1}%</div>
                            <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px' }}>EFICIENCIA FLOTA</div>
                        </div>
                        <div style={{ flex: 1, background: '#0F172A', border: '1px solid #333', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>{kpi2}m</div>
                            <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px' }}>TIEMPO RESPUESTA</div>
                        </div>
                    </div>

                    {/* CONSOLE */}
                    <div style={{ flex: 1, background: '#000', border: '1px solid #333', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', overflowY: 'auto' }}>
                        <div style={{ color: '#00f2ff', marginBottom: '10px', fontSize: '0.8rem' }}>&gt; SYSTEM LOGS (LIVE STREAM)</div>
                        {logs.map((L, i) => (
                            <div key={i} style={{ marginBottom: '8px', fontSize: '0.85rem', borderBottom: '1px solid #111', paddingBottom: '4px' }}>
                                <span style={{ color: '#666' }}>[{L.time}]</span> <span style={{ marginLeft: '10px' }}>{L.icon}</span> <span style={{ color: '#fff' }}>{L.module}</span> <span style={{ color: '#888' }}>-&gt;</span> <span style={{ color: '#ccc' }}>{L.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: BILLING */}
                <div style={{ background: '#0F172A', border: '1px solid #FFD700', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#FFD700' }}>💳 CORPORATE BILLING</h3>
                        <div style={{ fontSize: '0.6rem', color: '#FFD700' }}>DIAN SYNC ACTIVE</div>
                    </div>

                    <input placeholder="Buscar empresa..." style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginBottom: '20px' }} />

                    {[
                        { name: 'PARTICULAR', inv: '#FE-9000', svc: 9, progress: 30 },
                        { name: 'BBVA', inv: '#FE-9001', svc: 0, progress: 5 },
                        { name: 'Grupo Financiero Global 21', inv: '#FE-9002', svc: 0, progress: 0 },
                        { name: 'Salud Global 35', inv: '#FE-9003', svc: 0, progress: 0 }
                    ].map(corp => (
                        <div key={corp.name} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                <span>{corp.name}</span>
                                <span style={{ fontSize: '0.7rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>ACCUMULATING</span>
                            </div>
                            <div style={{ height: '4px', background: '#333', marginTop: '8px', borderRadius: '2px' }}>
                                <div style={{ height: '100%', width: `${corp.progress}%`, background: '#FFD700' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#888' }}>ÚLTIMA FACTURA<br /><strong style={{ color: '#fff' }}>{corp.inv}</strong></div>
                                <button style={{ background: 'transparent', border: '1px solid #FFD700', color: '#FFD700', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>👁️ VER PDF</button>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}
