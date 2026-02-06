import React, { useState, useEffect } from 'react';
import { CoreOperativo } from '../../views/CoreOperativo';
import { NeonNavbar } from '../NeonNavbar';
import ClientDashboard from '../ClientDashboard';
// Lazy load artifact
const GeminiConsultantArtifact = React.lazy(() => import('../dashboard/GeminiConsultantArtifact'));

// --- SUB-COMPONENT: LEFT DOCK (Extracted for Stability) ---
const V6Dock = ({ activeLayers, onToggle }) => {
    const handleDockClick = (item) => {
        if (item.id === 'C_GIT') return window.open('https://github.com/GuillermoHoyos/teso_core', '_blank');
        if (item.id === 'PITCH') return window.dispatchEvent(new Event('SHOW_PITCH'));
        if (item.id === 'WHATSAPP') return window.open('https://wa.me/573001234567?text=Hola%20TESO%20AI', '_blank');
        onToggle(item.id);
    };

    return (
        <div style={{
            position: 'absolute', top: '75px', left: '20px', bottom: '100px',
            display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 400, overflowY: 'auto', scrollbarWidth: 'none'
        }}>
            {[
                { id: 'RADAR', label: 'RADAR JMC', icon: '📡', color: '#a855f7' },
                { id: 'VISION', label: 'VISIÓN IA', icon: '🧠', color: '#ec4899' },
                { id: 'OPTIMIZE', label: 'OPTIMIZE', icon: '📈', color: '#f59e0b' },
                { id: 'JOBS', label: 'PEDIDOS', icon: '🔥', color: '#ef4444' },
                { id: 'FLEET', label: 'FLOTA V4', icon: '🚙', color: '#39FF14' },
                { id: 'PITCH', label: 'PITCH DECK', icon: '📢', color: '#ec4899' },
                { id: 'WHATSAPP', label: 'WHATSAPP', icon: '💬', color: '#22c55e' },
                { id: 'C_GIT', label: 'SOURCE GIT', icon: '👾', color: '#64748b' }
            ].map((item, i) => {
                const isActive = activeLayers.includes(item.id);
                return (
                    <div key={i} onClick={() => handleDockClick(item)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                            opacity: isActive || ['PITCH', 'WHATSAPP', 'C_GIT'].includes(item.id) ? 1 : 0.8,
                            transition: 'all 0.2s',
                            // Updated Glass Style (Compact & Consistent)
                            background: isActive
                                ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.05) 100%)'
                                : 'rgba(15, 23, 42, 0.5)',
                            backdropFilter: 'blur(8px)',
                            border: isActive ? `1px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            padding: '6px 10px', // More compact
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            width: 'fit-content',
                            marginBottom: '6px'
                        }}>
                        <div style={{
                            fontSize: '1rem', // Smaller Icon
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            filter: `drop-shadow(0 0 5px ${item.color})`
                        }}>
                            {item.icon}
                        </div>
                        <div style={{
                            color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', // Smaller Font
                            letterSpacing: '0.5px', fontFamily: 'var(--font-main)',
                            textShadow: '0 2px 4px #000'
                        }}>
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- SUB-COMPONENT: RIGHT PANEL (Extracted for Stability) ---
const TesoOpsPanel = ({ simulationData, activeView, onDispatch }) => {
    const [agentMetrics, setAgentMetrics] = useState(null);
    const [hoveredOrder, setHoveredOrder] = useState(null);

    useEffect(() => {
        // Poll logic remains same
        const pollAgents = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://teso-api-dev.fly.dev';
                const res = await fetch(`${apiUrl}/api/strategic-cycle`, { method: 'POST' });
                const data = await res.json();
                setAgentMetrics(data);
            } catch (err) { /* silent */ }
        };
        pollAgents();
        const interval = setInterval(pollAgents, 10000); // 10s Poll
        return () => clearInterval(interval);
    }, []);

    // DYNAMIC CONTENT SWITCHER
    const renderContent = () => {
        switch (activeView) {
            case 'FINANZAS':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', padding: '15px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#06b6d4', marginBottom: '5px' }}>INGRESOS HOY</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>$12.5M</div>
                            <div style={{ fontSize: '0.7rem', color: '#39FF14' }}>▲ 15% vs Ayer</div>
                        </div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '5px' }}>COSTOS OPERATIVOS</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>$8.2M</div>
                            <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>▼ 5% Optimizado</div>
                        </div>
                        <div style={{ height: '150px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            {[40, 60, 45, 80, 55, 70, 90].map((h, i) => (
                                <div key={i} style={{ width: '10%', height: `${h}%`, background: i === 6 ? '#39FF14' : '#334155', borderRadius: '4px 4px 0 0' }}></div>
                            ))}
                        </div>
                        <button style={{ background: '#06b6d4', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>DESCARGAR REPORTE</button>
                    </div>
                );
            case 'MERCADO':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold' }}>TOP CLIENTES</div>
                        {['ARGOS', 'NUTRESA', 'BANCOLOMBIA', 'SURA'].map((c, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                                <span style={{ color: '#fff' }}>{c}</span>
                                <span style={{ color: '#f59e0b' }}>{(40 - i * 5)}% Share</span>
                            </div>
                        ))}
                        <div style={{ marginTop: '20px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'bold' }}>CAMPAÑAS ACTIVAS</div>
                        <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', borderRadius: '6px' }}>
                            <div style={{ color: '#a855f7', fontWeight: 'bold' }}>RETORNO EJECUTIVOS</div>
                            <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '5px' }}>Impacto: 1,200 Usuarios</div>
                        </div>
                    </div>
                );
            case 'ORDENES':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {simulationData?.services?.slice(0, 50).map((s, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: 'rgba(255,255,255,0.03)', borderLeft: s.status === 'completed' ? '3px solid #39FF14' : '3px solid #f59e0b', borderRadius: '6px', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                                        {s.company || s.client || s.paxName || s.clientId || 'Cliente Corporativo'}
                                    </span>
                                    <span style={{ color: '#bef264', fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(190, 242, 100, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                        {s.time || 'PEND'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ color: '#64748b' }}>#{s.id}</span>
                                        <span>•</span>
                                        <span>{s.route || 'Zona Metropolitana'}</span>
                                    </span>
                                    <span style={{ color: s.status === 'completed' ? '#39FF14' : '#f59e0b', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {s.status === 'completed' ? 'FINALIZADO' : 'EN CURSO'}
                                    </span>
                                </div>
                            </div>
                        )) || <div style={{ color: '#64748b', padding: '20px', textAlign: 'center' }}>No hay ordenes activas en este momento.</div>}
                    </div>
                );
            case 'FLOTA':
            default:
                return (
                    <>
                        {/* DISPATCH CONTROLS */}
                        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button style={{
                                background: 'transparent',
                                border: '1px solid #06b6d4',
                                color: '#06b6d4',
                                padding: '10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)',
                                transition: 'all 0.2s'
                            }} onClick={() => console.log('⏸ SIMULATION PAUSED (Visual Layer)')}>
                                ⏸ PAUSAR SIMULACIÓN
                            </button>
                            <button style={{
                                background: '#06b6d4',
                                border: 'none',
                                color: '#000',
                                padding: '10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
                                transition: 'all 0.2s'
                            }} onClick={onDispatch}>
                                ⚡ DESPACHO INTELIGENTE
                            </button>
                        </div>
                        {/* AUTONOMOUS GUARDRAILS */}
                        {agentMetrics && (
                            <div style={{ marginBottom: '20px', border: '1px solid #334155', borderRadius: '8px', padding: '10px', background: 'rgba(15, 23, 42, 0.5)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>🛡️ AUTONOMOUS GUARDRAILS</div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }}></div>
                                </div>
                                <div style={{ marginBottom: '10px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', borderRadius: '0 4px 4px 0' }}>
                                    <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem' }}>CEO DIRECTIVE:</div>
                                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{agentMetrics.strategic_alignment?.directive || "ANALYZING..."}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '4px', fontStyle: 'italic' }}>"{agentMetrics.strategic_alignment?.reasoning}"</div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                                    {['finance', 'ops', 'design'].map(dept => {
                                        const score = dept === 'finance' ? agentMetrics.department_reports?.finance?.executive_summary?.score :
                                            dept === 'ops' ? 100 : agentMetrics.department_reports?.design_input?.design_audit?.score;
                                        const label = dept === 'finance' ? 'FIN' : dept === 'ops' ? 'OPS' : 'UX';
                                        const icon = dept === 'finance' ? '💰' : dept === 'ops' ? '🚚' : '🎨';
                                        return (
                                            <div key={dept} style={{ background: '#020617', padding: '8px', borderRadius: '4px', textAlign: 'center', border: '1px solid #1e293b' }}>
                                                <div style={{ fontSize: '1.2rem' }}>{icon}</div>
                                                <div style={{ fontSize: '0.6rem', fontWeight: 'bold', marginTop: '2px', color: (score || 0) < 70 ? '#ef4444' : '#22c55e' }}>{label} {score || 'ON'}%</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* SEARCH & FILTER */}
                        <div style={{ marginBottom: '20px', position: 'relative' }}>
                            <input type="text" placeholder="Buscar Orden, Unidad, Cliente [ENTER]" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', outline: 'none' }} />
                            <span style={{ position: 'absolute', right: '10px', top: '8px', color: '#64748b' }}>🔍</span>
                        </div>

                        {/* UNITS LIST */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>UNIDADES EN LÍNEA</div>
                            {simulationData?.services?.slice(0, 10).map((u, i) => (
                                <div
                                    key={i}
                                    onMouseEnter={() => setHoveredOrder(u)}
                                    onMouseLeave={() => setHoveredOrder(null)}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)', padding: '8px',
                                        marginBottom: '5px', borderRadius: '4px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        cursor: 'pointer', transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                >
                                    <div style={{ color: '#fff', fontSize: '0.8rem' }}>{u.plate || u.vehiclePlate || 'TSO-000'}</div>
                                    <div style={{ color: '#39FF14', fontSize: '0.7rem' }}>{u.status}</div>
                                </div>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div style={{
            width: '350px', background: 'rgba(9, 9, 11, 0.95)', borderLeft: '1px solid #334155',
            display: 'flex', flexDirection: 'column', padding: '20px', zIndex: 50,
            boxShadow: '-10px 0 40px rgba(0,0,0,0.8)', height: '100%', overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#ef4444', fontFamily: 'monospace', fontSize: '1.2rem' }}>TESO {activeView}</h2>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>PANEL DE CONTROL INTELIGENTE</div>
                </div>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', cursor: 'pointer' }}>🏠</div>
            </div>

            {renderContent()}

            {/* HOVER DETAIL CARD (Fly.io Parity) */}
            {hoveredOrder && (
                <div style={{
                    position: 'fixed', top: '20%', right: '370px', width: '300px',
                    background: 'rgba(9, 9, 11, 0.98)', border: '1px solid #39FF14', borderRadius: '8px',
                    padding: '20px', zIndex: 1000, boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)',
                    backdropFilter: 'blur(10px)', pointerEvents: 'none'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '1.2rem' }}>📄</div>
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>DETALLE DE ORDEN</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: '#ccc' }}>
                        <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>ID OPERACIÓN</span>
                            <span style={{ color: '#39FF14', fontWeight: 'bold' }}>#{hoveredOrder.id}</span>
                        </div>
                        <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>ESTADO</span>
                            <span style={{ color: hoveredOrder.status === 'completed' ? '#22c55e' : '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {hoveredOrder.status === 'completed' ? 'FINALIZADO' : (hoveredOrder.status || 'EN CURSO')}
                            </span>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>PASAJERO</span>
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{hoveredOrder.paxName || hoveredOrder.client || 'N/A'}</span>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>EMPRESA</span>
                            <span style={{ color: '#fff' }}>{hoveredOrder.company || 'PARTICULAR'}</span>
                        </div>

                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #333', gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                            <div>
                                <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>CONDUCTOR</span>
                                <span style={{ color: '#fff' }}>{hoveredOrder.driverName || 'PENDIENTE'}</span>
                            </div>
                            <div>
                                <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>VEHÍCULO</span>
                                <span style={{ color: '#fff' }}>{hoveredOrder.vehiclePlate || 'TBA'}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '10px', gridColumn: 'span 2', background: 'rgba(57, 255, 20, 0.05)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(57, 255, 20, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                <span style={{ color: '#39FF14' }}>PIN SEGURIDAD:</span>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>{hoveredOrder.pin || 'A-1234'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LiveOpsMap = ({ opsCommand, simulationData, planes }) => {

    const [activeTab, setActiveTab] = useState('FLOTA');
    const [activeLayers, setActiveLayers] = useState(['FLEET', 'JOBS', 'RADAR']);
    const [showQueryMenu, setShowQueryMenu] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const toggleLayer = (layerId) => {
        setActiveLayers(prev => {
            if (prev.includes(layerId)) return prev.filter(l => l !== layerId);
            return [...prev, layerId];
        });
    };

    // INTERNAL STATE FOR COMMANDS
    const [internalCommand, setInternalCommand] = useState(null);

    // --- MAIN RETURN: LAYOUT ---
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>

            {/* 1. MAP LAYER */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {activeTab !== 'ORDENES' && activeTab !== 'CLIENTES' && activeTab !== 'ARTEFACTO' && (
                    <CoreOperativo command={internalCommand || opsCommand} simulationData={simulationData} activeLayers={activeLayers} planes={planes} />
                )}
                {activeTab === 'CLIENTES' && <ClientDashboard />}
                {activeTab === 'ARTEFACTO' && (
                    <React.Suspense fallback={<div>Cargando...</div>}><GeminiConsultantArtifact onClose={() => setActiveTab('FLOTA')} /></React.Suspense>
                )}
            </div>

            {/* 2. UI OVERLAYS */}
            <div style={{ position: 'absolute', top: 5, left: 60, zIndex: 1000 }}>
                <NeonNavbar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <V6Dock activeLayers={activeLayers} onToggle={toggleLayer} />

            {/* 3. RIGHT PANEL */}
            {(activeTab !== 'ARTEFACTO') && (
                <div style={{
                    position: 'absolute', top: 0, right: 0, height: '100%', width: isPanelOpen ? '350px' : '0px',
                    zIndex: 500, transition: 'width 0.3s ease-in-out', display: 'flex'
                }}>
                    <div onClick={() => setIsPanelOpen(!isPanelOpen)} style={{
                        position: 'absolute', left: '-30px', top: '50%', width: '30px', height: '60px',
                        background: 'rgba(9, 9, 11, 0.9)', border: '1px solid #334155', borderRadius: '8px 0 0 8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#06b6d4', zIndex: 501
                    }}>{isPanelOpen ? '▶' : '◀'}</div>

                    <div style={{ width: '350px', height: '100%', transform: isPanelOpen ? 'translateX(0)' : 'translateX(350px)', transition: 'transform 0.3s' }}>
                        <TesoOpsPanel simulationData={simulationData} activeView={activeTab} onDispatch={() => setInternalCommand({ type: 'DISPATCH_WAVE', ts: Date.now() })} />
                    </div>
                </div>
            )}

            {/* 4. AI AGENT BUTTON */}
            <div onClick={() => setShowQueryMenu(!showQueryMenu)} style={{
                position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #06b6d4', borderRadius: '50px', padding: '10px 25px', cursor: 'pointer'
            }}>
                <div style={{ fontSize: '1.5rem' }}>🤖</div>
                {showQueryMenu && <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>CONSULTOR IA</div>}
            </div>

            {/* AI MENU */}
            {showQueryMenu && (
                <div style={{
                    position: 'absolute', bottom: '80px', left: '20px', width: '350px',
                    background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)',
                    border: '1px solid #334155', borderRadius: '16px', padding: '15px', zIndex: 2000
                }}>
                    <div style={{ color: '#94a3b8', marginBottom: '10px' }}>Panel de Inteligencia Activo</div>
                    {['Analizar Situación Financiera', 'Optimizar Rutas', 'Recomendar Agentes'].map(q => (
                        <div key={q} onClick={() => {
                            // Quick Action Logic - Non-blocking UI update
                            console.log(`🤖 AI AGENT ACTIVATED: ${q}`);
                            const consoleDiv = document.getElementById('teso-console-log');
                            if (consoleDiv) {
                                const msg = document.createElement('div');
                                msg.style.color = '#06b6d4';
                                msg.innerText = `[${new Date().toLocaleTimeString()}] 🤖 EXECUTING: ${q}...`;
                                consoleDiv.appendChild(msg);
                                consoleDiv.scrollTop = consoleDiv.scrollHeight;
                            }
                        }} style={{ padding: '8px', borderBottom: '1px solid #333', cursor: 'pointer', color: '#fff' }}>• {q}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveOpsMap;
