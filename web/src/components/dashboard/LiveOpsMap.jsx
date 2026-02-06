import React, { useState, useEffect } from 'react';
import { CoreOperativo } from '../../views/CoreOperativo';
import { NeonNavbar } from '../NeonNavbar';
import ClientDashboard from '../ClientDashboard';
import LogisticsDashboard from '../LogisticsDashboard';

// If any sub-components were defined inline in OperationalDashboard, we move them here.
// Based on previous reads, NeonNavbar and CoreOperativo are imported. 
// TesoOpsPanel seemed to be inline in the 'restored' version or imported.
// I will assume for now they are imports or I will recreate the structure found in the 'restored' version.

const LiveOpsMap = ({ opsCommand, simulationData, planes }) => { // Accept planes prop

    // This component encapsulates the "Map View" logic.
    const [activeTab, setActiveTab] = useState('FLOTA');

    // ... inside JSX ...
    // MAIN CONTENT AREA
    // ...
    {
        activeTab !== 'ORDENES' && activeTab !== 'CLIENTES' && activeTab !== 'ARTEFACTO' && (
            <CoreOperativo
                command={opsCommand}
                simulationData={simulationData}
                activeLayers={activeLayers}
                planes={planes} // Pass planes to CoreOperativo
            />
        )
    }

    // LAYER CONTROL STATE (The "Subcapas" Logic)
    const [activeLayers, setActiveLayers] = useState(['FLEET', 'JOBS', 'RADAR']); // Default layers (RADAR ON by default)
    const [showQueryMenu, setShowQueryMenu] = useState(false); // New Menu State

    const toggleLayer = (layerId) => {
        setActiveLayers(prev => {
            if (prev.includes(layerId)) return prev.filter(l => l !== layerId);
            return [...prev, layerId];
        });
    };

    // --- FLY.IO LAYOUT RECONSTRUCTION ---
    // (Based on user screenshots: Left Dock, Full Right Panel, Bottom Bar)

    // A. LEFT DOCK COMPONENT (Interactive)
    const V6Dock = ({ activeLayers, onToggle }) => {
        const handleDockClick = (item) => {
            // EXTERNAL ACTIONS
            if (item.id === 'C_GIT') return window.open('https://github.com/GuillermoHoyos/teso_core', '_blank');
            if (item.id === 'PITCH') return window.dispatchEvent(new Event('SHOW_PITCH')); // Internal Presentation Trigger
            if (item.id === 'WHATSAPP') return window.open('https://wa.me/573001234567?text=Hola%20TESO%20AI', '_blank');

            // LAYER TOGGLES (Internal)
            onToggle(item.id);
        };

        return (
            <div style={{
                position: 'absolute', top: '75px', left: '20px', bottom: '100px',
                display: 'flex', flexDirection: 'column', gap: '8px',
                zIndex: 400,
                overflowY: 'auto',
                scrollbarWidth: 'none'
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
                        <div key={i}
                            onClick={() => handleDockClick(item)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', opacity: isActive || ['PITCH', 'WHATSAPP', 'C_GIT'].includes(item.id) ? 1 : 0.5, transition: 'opacity 0.2s' }}>
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
    };

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

            {/* A. FLOATING NAVBAR (Top Left - "Barra Superior Izquierda") */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 90, /* Moved Right to clear Dock */
                zIndex: 1000,
                width: 'auto',
                pointerEvents: 'none' // Prevent container from blocking map clicks
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <NeonNavbar activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
            </div>

            {/* B. LEFT DOCK (V6 Style) */}
            <V6Dock activeLayers={activeLayers} onToggle={toggleLayer} />

            {/* C. BOTTOM BAR (Robot Icon) */}
            {/* C. INTELLIGENCE HUB (Active AI Interface) */}
            {/* 1. QUERY MENU POPUP */}
            {activeTab === 'FLOTA' && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '20px',
                    width: '350px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #334155',
                    borderRadius: '16px',
                    padding: '15px',
                    display: showQueryMenu ? 'block' : 'none', // Toggle visibility
                    zIndex: 2000,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        SELECT ANALYSIS PROTOCOL
                    </div>

                    {[
                        {
                            category: "📖 DATA STORYTELLING",
                            questions: [
                                "Genera una narrativa sobre el estado actual de la operación",
                                "Explica las anomalías recientes como una historia",
                                "¿Cuál es el 'clímax' operativo de hoy?"
                            ],
                            color: '#fbbf24'
                        },
                        {
                            category: "⚖️ ANÁLISIS DE SESGOS (BIAS)",
                            questions: [
                                "¿Detectas sesgo algorítmico en la asignación?",
                                "¿Hay distribución inequitativa por zonas?",
                                "Analiza la equidad de ingresos entre conductores"
                            ],
                            color: '#f87171'
                        },
                        {
                            category: "🚀 CONSULTOR LHU (Clase Gemini)",
                            questions: [
                                "Analizar URL de empresa (Simular)",
                                "Recomendar Agentes para Pyme Logística",
                                "¿Cómo usar 'Meeting Preparer' aquí?"
                            ],
                            color: '#e879f9' // Fuchsia
                        },
                        {
                            category: "📊 BUSINESS INTELLIGENCE",
                            questions: [
                                "Resumen ejecutivo de KPIs en tiempo real",
                                "Predicción de demanda (Próxima Hora)",
                                "Identifica cuellos de botella críticos"
                            ],
                            color: '#34d399' // Emerald
                        },
                        {
                            category: "🏢 ESTRATEGIA CORPORATIVA (Gemini/Copilot)",
                            questions: [
                                "Auditoría de eficiencia Cloud vs On-Premise",
                                "Evaluación de Riesgos de Expansión LATAM",
                                "Proyección de Crecimiento (Forecast Q4)"
                            ],
                            color: '#8b5cf6' // Violet
                        }
                    ].map((group, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ color: group.color, fontSize: '0.9rem', marginBottom: '5px', fontWeight: 'bold' }}>
                                {group.category}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {group.questions.map((q, j) => (
                                    <button
                                        key={j}
                                        onClick={() => {
                                            setShowQueryMenu(false); // Close menu
                                            console.log("🗣️ User Query:", q);

                                            // INTELLIGENT ROUTING: STRATEGY -> GEMINI BUSINESS
                                            const isStrategy = group.category.includes('ESTRATEGIA');
                                            const endpoint = isStrategy ? '/api/agently/business/gemini' : '/api/agently/command';
                                            const payload = isStrategy
                                                ? { query: q }
                                                : { intent: 'CUSTOM_QUERY', query: q, context: { view: 'LIVE_MAP' } };

                                            alert(`🤖 CONTACTANDO AGENTE [${isStrategy ? 'GEMINI BUSINESS' : 'ORCHESTRATOR'}]...\n\n"${q}"`);

                                            // Real Backend Call
                                            fetch(endpoint, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(payload)
                                            })
                                                .then(res => res.json())
                                                .then(data => {
                                                    // Handle Unified Response Format
                                                    const story = data.response?.text || data.narrative || "Análisis completado. Datos enviados a consola.";
                                                    const voice = data.response?.voice_script;

                                                    alert(`📊 RESPUESTA DE AGENTE:\n\n${story}`);

                                                    // Optional: Log technical details
                                                    console.log("Agent Telemetry:", data.meta || data);
                                                })
                                                .catch(err => alert(`Error de conexión con ${endpoint}: ${err.message}`));
                                        }}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            color: '#e2e8f0',
                                            textAlign: 'left',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        • {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const custom = prompt("Escribe tu consulta personalizada:");
                            if (custom) {
                                setShowQueryMenu(false); // Close menu after prompt
                                console.log("🗣️ User Query:", custom);
                                alert(`🤖 PROCESANDO CONSULTA CON LLM/MCP...\n\n"${custom}"\n\n(Conectando con Backend Python...)`);

                                fetch('/api/agently/command', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ intent: 'CUSTOM_QUERY', query: custom, context: { view: 'LIVE_MAP' } })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        const story = data.narrative || "Análisis completado. Datos enviados a consola.";
                                        alert(`📊 REPORTE DE INTELIGENCIA:\n\n${story}`);
                                    })
                                    .catch(err => alert("Error de conexión (Backend Offline)."));
                            }
                        }}
                        style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px dashed #475569', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        + Escribir consulta manual...
                    </button>
                </div>
            )}

            <div
                onClick={() => setShowQueryMenu(!showQueryMenu)} // Toggle Menu
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 1000,
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #06b6d4',
                    borderRadius: '50px',
                    padding: '10px 25px',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{ fontSize: '1.5rem' }}>🤖</div>
                <div style={{ color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {showQueryMenu ? 'CERRAR PANEL DE INTELIGENCIA' : 'CONSULTAR INTELLIGENCE (LLM)'}
                </div>
                <div style={{ color: '#06b6d4' }}>{showQueryMenu ? '⬇️' : '⬆️'}</div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* MAP RENDERS HERE IN LIVE OPS MODE */}
                {activeTab !== 'ORDENES' && activeTab !== 'CLIENTES' && activeTab !== 'ARTEFACTO' && (
                    <CoreOperativo
                        command={opsCommand}
                        simulationData={simulationData}
                        activeLayers={activeLayers}
                        planes={planes}
                    />
                )}
                {/* OTHER TABS */}
                {activeTab === 'CLIENTES' && <ClientDashboard />}
                {activeTab === 'ORDENES' && <div style={{ padding: '50px', color: '#fff' }}>Logistics View (Active)</div>}
                {/* ARTEFACTO RENDER */}
                {activeTab === 'ARTEFACTO' && (
                    <React.Suspense fallback={<div>Cargando Artefacto...</div>}>
                        <GeminiConsultantArtifact onClose={() => setActiveTab('FLOTA')} />
                    </React.Suspense>
                )}
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

// Lazy Import for Artifact to avoid bundle bloat
const GeminiConsultantArtifact = React.lazy(() => import('./GeminiConsultantArtifact'));

export default LiveOpsMap;
