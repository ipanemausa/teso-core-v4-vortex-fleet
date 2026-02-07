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
// --- SUB-COMPONENT: RIGHT PANEL (Extracted for Stability) ---
import TesoOpsPanel from './TesoOpsPanel';

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
                {activeTab !== 'ARTEFACTO' && (
                    <CoreOperativo command={internalCommand || opsCommand} simulationData={simulationData} activeLayers={activeLayers} planes={planes} />
                )}
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
                        <TesoOpsPanel simulationData={simulationData} activeView={activeTab} planes={planes} onDispatch={(cmd) => setInternalCommand(cmd || { type: 'DISPATCH_WAVE', ts: Date.now() })} />
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
