import React, { useState, useEffect } from 'react';
import { CoreOperativo } from '../../views/CoreOperativo';
import { NeonNavbar } from '../NeonNavbar';
import ClientDashboard from '../ClientDashboard';
import LogisticsDashboard from '../LogisticsDashboard';

// If any sub-components were defined inline in OperationalDashboard, we move them here.
// Based on previous reads, NeonNavbar and CoreOperativo are imported. 
// TesoOpsPanel seemed to be inline in the 'restored' version or imported.
// I will assume for now they are imports or I will recreate the structure found in the 'restored' version.

const LiveOpsMap = ({ opsCommand, simulationData }) => {

    // This component encapsulates the "Map View" logic.
    const [activeTab, setActiveTab] = useState('FLOTA');

    // LAYER CONTROL STATE (The "Subcapas" Logic)
    const [activeLayers, setActiveLayers] = useState(['FLEET', 'JOBS']); // Default layers

    const toggleLayer = (layerId) => {
        setActiveLayers(prev => {
            if (prev.includes(layerId)) return prev.filter(l => l !== layerId);
            return [...prev, layerId];
        });
    };

    // --- FLY.IO LAYOUT RECONSTRUCTION ---
    // (Based on user screenshots: Left Dock, Full Right Panel, Bottom Bar)

    // A. LEFT DOCK COMPONENT (Interactive)
    const V6Dock = ({ activeLayers, onToggle }) => (
        <div style={{
            position: 'absolute', top: '100px', left: '20px', bottom: '100px',
            display: 'flex', flexDirection: 'column', gap: '15px',
            zIndex: 400
        }}>
            {[
                { id: 'RADAR', label: 'RADAR JMC', icon: '📡', color: '#a855f7' },
                { id: 'VISION', label: 'VISIÓN IA', icon: '🧠', color: '#ec4899' },
                { id: 'OPTIMIZE', label: 'OPTIMIZE', icon: '📈', color: '#f59e0b' },
                { id: 'JOBS', label: 'PEDIDOS', icon: '🔥', color: '#ef4444' }, // Renamed SIMULACRO -> PEDIDOS (Layer intent)
                { id: 'FLEET', label: 'FLOTA V4', icon: '🚙', color: '#39FF14' } // Added Fleet Toggle
            ].map((item, i) => {
                const isActive = activeLayers.includes(item.id);
                return (
                    <div key={i}
                        onClick={() => onToggle(item.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', opacity: isActive ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: isActive ? `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.2)` : 'rgba(15, 23, 42, 0.9)',
                            border: `1px solid ${item.color}`,
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem',
                            boxShadow: isActive ? `0 0 15px ${item.color}` : 'none'
                        }}>
                            {item.icon}
                        </div>
                        <div style={{
                            color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px',
                            textShadow: '0 2px 4px #000', fontFamily: 'monospace'
                        }}>
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // B. FULL RIGHT PANEL COMPONENT (Restored)
    const TesoOpsPanel = () => (
        <div style={{
            width: '350px',
            background: 'rgba(9, 9, 11, 0.95)',
            borderLeft: '1px solid #334155',
            display: 'flex', flexDirection: 'column',
            padding: '20px',
            zIndex: 50,
            boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
            height: '100%'
        }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#ef4444', fontFamily: 'monospace', fontSize: '1.2rem' }}>TESO OPS</h2>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>UNIDADES: {simulationData?.services?.length || 15} | OPS ACTIVAS: {simulationData?.services?.filter(s => s.status !== 'COMPLETED').length || 60}</div>
                </div>
                <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ea580c',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', cursor: 'pointer'
                }}>🏠</div>
            </div>

            {/* SEARCH */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <input type="text" placeholder="Buscar Orden, Unidad, Cliente [ENTER]"
                    style={{
                        width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '4px',
                        padding: '8px 10px', color: '#fff', fontSize: '0.8rem', outline: 'none'
                    }}
                />
                <span style={{ position: 'absolute', right: '10px', top: '8px', color: '#64748b' }}>🔍</span>
            </div>

            {/* CONTROLS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <button style={{
                    background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', color: '#06b6d4',
                    padding: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontWeight: 'bold', fontSize: '0.8rem'
                }}>
                    ▶ INICIAR SIMULACIÓN
                </button>
                <button style={{
                    background: 'rgba(234, 88, 12, 0.1)', border: '1px solid #ea580c', color: '#ea580c',
                    padding: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    fontWeight: 'bold', fontSize: '0.8rem'
                }}>
                    ⚡ DESPACHO INTELIGENTE
                </button>
            </div>

            {/* CONSOLE */}
            <div style={{
                background: '#000', border: '1px solid #1e293b', borderRadius: '4px', padding: '10px',
                marginBottom: '20px', height: '120px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.7rem'
            }}>
                <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '5px' }}>CONSOLE.LOG :: SYSTEM EVENTS</div>
                <div style={{ color: '#39FF14' }}>[{new Date().toLocaleTimeString('en-US')}] 🟩 CORE v4 ONLINE: Grid operational.</div>
                <div style={{ color: '#fff' }}>[{new Date().toLocaleTimeString('en-US')}] ☁️ CONNECTING: Syncing with VORTEX Node...</div>
                <div style={{ color: '#ef4444' }}>[{new Date().toLocaleTimeString('en-US')}] 🚀 SYSTEM STARTUP: Orchestrator Active</div>
            </div>

            {/* UNITS LIST */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>
                    UNIDADES EN LÍNEA ({simulationData?.services?.length || 15})
                </div>
                {[
                    { id: 'TSO-128', status: 'DISPONIBLE', cond: 'COND-021' },
                    { id: 'TSO-160', status: 'DISPONIBLE', cond: 'COND-248' },
                    { id: 'TSO-109', status: 'DISPONIBLE', cond: 'COND-142' }
                ].map((u, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)', padding: '8px', marginBottom: '5px', borderRadius: '4px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.8rem' }}>{u.id}</div>
                            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Cond: {u.cond}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#39FF14' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39FF14' }}></div>
                            {u.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- REFINED LAYOUT: NAVBAR TOP, LEFT DOCK, RIGHT PANEL ---
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', display: 'flex' }}>

            {/* A. FLOATING NAVBAR (Top Center) */}
            <div style={{
                position: 'absolute',
                top: 20, /* Restored to generic top position */
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                width: 'auto'
            }}>
                <NeonNavbar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* B. LEFT DOCK (V6 Style) */}
            <V6Dock activeLayers={activeLayers} onToggle={toggleLayer} />

            {/* C. BOTTOM BAR (Robot Icon) */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#0f172a', border: '1px solid #06b6d4', borderRadius: '50px',
                padding: '10px 20px', boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
            }}>
                <div style={{ fontSize: '1.5rem' }}>🤖</div>
                <div style={{ color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace' }}>Consultar Operaciones...</div>
                <div style={{ color: '#06b6d4' }}>🎤</div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* MAP RENDERS HERE IN LIVE OPS MODE */}
                {activeTab !== 'ORDENES' && activeTab !== 'CLIENTES' && (
                    <CoreOperativo command={opsCommand} simulationData={simulationData} activeLayers={activeLayers} />
                )}
                {/* OTHER TABS */}
                {activeTab === 'CLIENTES' && <ClientDashboard />}
                {activeTab === 'ORDENES' && <div style={{ padding: '50px', color: '#fff' }}>Logistics View (Active)</div>}
            </div>

            {/* D. RIGHT PANEL (Always Visible in default view) */}
            {(activeTab === 'FLOTA' || activeTab === 'VUELOS' || activeTab === 'AGENDA') && (
                <div style={{ height: '100%', zIndex: 100 }}>
                    <TesoOpsPanel />
                </div>
            )}

        </div>
    );
};


export default LiveOpsMap;
