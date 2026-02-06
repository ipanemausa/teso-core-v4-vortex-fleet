import React, { useState, useEffect } from 'react';
import { CoreOperativo } from '../../views/CoreOperativo';
import { NeonNavbar } from '../NeonNavbar';
import ClientDashboard from '../ClientDashboard';
// Lazy load artifact
const GeminiConsultantArtifact = React.lazy(() => import('../dashboard/GeminiConsultantArtifact'));

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

    // --- SUB-COMPONENT: LEFT DOCK ---
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
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', opacity: isActive || ['PITCH', 'WHATSAPP', 'C_GIT'].includes(item.id) ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                background: isActive ? `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.2)` : 'rgba(15, 23, 42, 0.9)',
                                border: `1px solid ${item.color}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                boxShadow: isActive ? `0 0 15px ${item.color}` : 'none'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', textShadow: '0 2px 4px #000', fontFamily: 'monospace' }}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- SUB-COMPONENT: RIGHT PANEL (With Autonomous Guardrails) ---
    const TesoOpsPanel = () => {
        const [agentMetrics, setAgentMetrics] = useState(null);

        useEffect(() => {
            const pollAgents = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'https://teso-api-dev.fly.dev';
                    const res = await fetch(`${apiUrl}/api/strategic-cycle`, { method: 'POST' });
                    const data = await res.json();
                    setAgentMetrics(data);
                } catch (err) { console.error("Agent Poll Failed", err); }
            };
            const interval = setInterval(pollAgents, 10000); // 10s Poll
            pollAgents();
            return () => clearInterval(interval);
        }, []);

        return (
            <div style={{
                width: '350px', background: 'rgba(9, 9, 11, 0.95)', borderLeft: '1px solid #334155',
                display: 'flex', flexDirection: 'column', padding: '20px', zIndex: 50,
                boxShadow: '-10px 0 40px rgba(0,0,0,0.8)', height: '100%', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#ef4444', fontFamily: 'monospace', fontSize: '1.2rem' }}>TESO OPS</h2>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>UNIDADES: {simulationData?.services?.length || 15} | OPS ACTIVAS: {simulationData?.services?.filter(s => s.status !== 'COMPLETED').length || 60}</div>
                    </div>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', cursor: 'pointer' }}>🏠</div>
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

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <button style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', color: '#06b6d4', padding: '10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>▶ INICIAR SIMULACIÓN</button>
                    <button style={{ background: 'rgba(234, 88, 12, 0.1)', border: '1px solid #ea580c', color: '#ea580c', padding: '10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>⚡ DESPACHO INTELIGENTE</button>
                </div>

                {/* CONSOLE */}
                <div style={{ background: '#000', border: '1px solid #1e293b', borderRadius: '4px', padding: '10px', marginBottom: '20px', height: '120px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '5px' }}>CONSOLE.LOG :: SYSTEM EVENTS</div>
                    <div style={{ color: '#39FF14' }}>[{new Date().toLocaleTimeString()}] 🟩 CORE v4.7 (REALISTIC SPEED) ONLINE</div>
                    <div style={{ color: '#fff' }}>[{new Date().toLocaleTimeString()}] ☁️ CONNECTING: Syncing with VORTEX Node...</div>
                    <div style={{ color: '#facc15' }}>[{new Date().toLocaleTimeString()}] ⚠️ DEBUG MODE: RADAR FORCED ON</div>
                </div>

                {/* UNITS LIST */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>UNIDADES EN LÍNEA</div>
                    {simulationData?.services?.slice(0, 10).map((u, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', marginBottom: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: '#fff', fontSize: '0.8rem' }}>{u.plate}</div>
                            <div style={{ color: '#39FF14', fontSize: '0.7rem' }}>{u.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- MAIN RETURN: LAYOUT ---
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>

            {/* 1. MAP LAYER */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {activeTab !== 'ORDENES' && activeTab !== 'CLIENTES' && activeTab !== 'ARTEFACTO' && (
                    <CoreOperativo command={opsCommand} simulationData={simulationData} activeLayers={activeLayers} planes={planes} />
                )}
                {activeTab === 'CLIENTES' && <ClientDashboard />}
                {activeTab === 'ARTEFACTO' && (
                    <React.Suspense fallback={<div>Cargando...</div>}><GeminiConsultantArtifact onClose={() => setActiveTab('FLOTA')} /></React.Suspense>
                )}
            </div>

            {/* 2. UI OVERLAYS */}
            <div style={{ position: 'absolute', top: 10, left: 90, zIndex: 1000 }}>
                <NeonNavbar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <V6Dock activeLayers={activeLayers} onToggle={toggleLayer} />

            {/* 3. RIGHT PANEL */}
            {(activeTab === 'FLOTA' || activeTab === 'VUELOS' || activeTab === 'AGENDA') && (
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
                        <TesoOpsPanel />
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
                            // Quick Action Logic
                            alert(`Ejecutando: ${q}`);
                        }} style={{ padding: '8px', borderBottom: '1px solid #333', cursor: 'pointer', color: '#fff' }}>• {q}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveOpsMap;

// Helper Toast Component
const UpdateToast = () => {
    const [visible, setVisible] = useState(true);
    useEffect(() => { setTimeout(() => setVisible(false), 5000); }, []);
    if (!visible) return null;
    return (
        <div style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(34, 197, 94, 0.9)', color: '#000', padding: '10px 20px',
            borderRadius: '50px', fontWeight: 'bold', zIndex: 9999,
            boxShadow: '0 0 20px #22c55e'
        }}>
            ✅ SYSTEM UPDATED: v4.4 (LIVE)
        </div>
    );
};

// Add Toast to Main Component
// Note: We need to inject this into the main return, so we modify the component slightly
// But since I am replacing the export, I can't easily inject inside the function without replacing the whole function.
// Strategy: I will rely on the Console Log update for now to avoid breaking the file layout excessively,
// OR I can use a simpler approach: Just update the text I can target.

// ... actually, I'll just stick to the text update in the console area,
// injecting a toast is risky with replace_file_content on a large file.
// Let's just update the console log text.
