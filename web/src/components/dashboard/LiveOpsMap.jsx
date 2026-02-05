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

    // --- MODULE RENDERER ---
    const renderContent = () => {
        switch (activeTab) {
            case 'CLIENTES':
                return (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50 }}>
                        <ClientDashboard />
                    </div>
                );
            case 'ORDENES':
                return (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, background: '#f4f6f8' }}>
                        {/* Logistics uses simulationData for its grid */}
                        <LogisticsDashboard simulationData={simulationData} />
                    </div>
                );
            case 'FLOTA':
            case 'VUELOS':
            default:
                // Default Layout: Map + Right Panel
                return (
                    <>
                        {/* B. MAP VIEW */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <CoreOperativo command={opsCommand} simulationData={simulationData} />
                        </div>

                        {/* C. RIGHT PANEL (Glassmorphism) */}
                        <div style={{
                            width: '320px', /* Slightly narrower */
                            background: 'rgba(9, 9, 11, 0.85)', /* Translucent */
                            backdropFilter: 'blur(12px)',
                            borderLeft: '1px solid #334155',
                            display: 'flex', flexDirection: 'column',
                            padding: '20px',
                            zIndex: 50,
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#39FF14', borderRadius: '50%', boxShadow: '0 0 5px #39FF14' }}></div>
                                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1rem', letterSpacing: '2px' }}>TESO OPS</h2>
                                </div>
                                <div style={{ color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>⚙️</div>
                            </div>

                            <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', overflowY: 'auto' }}>
                                <div style={{
                                    color: '#06b6d4',
                                    fontWeight: 'bold',
                                    marginBottom: '15px',
                                    fontSize: '0.8rem',
                                    borderBottom: '1px solid #1e293b',
                                    paddingBottom: '5px'
                                }}>SYSTEM LOGS</div>

                                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: '#39FF14' }}>[OK] Grid operational.</div>
                                    <div style={{ color: '#94a3b8' }}>Scanning sectors...</div>

                                    {simulationData?.planes && (
                                        <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d4', borderRadius: '4px', color: '#06b6d4' }}>
                                            ✈️ {simulationData.planes.length} Active Flights
                                        </div>
                                    )}
                                </div>

                                <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '20px', textAlign: 'center' }}>
                                    LiveOpsMap v1.2 (Stable)
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    // --- REFINED LAYOUT: NAVBAR LEFT, PANEL GLASS ---
    return (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', height: '100%' }}>

            {/* A. FLOATING NAVBAR (Docked Left to avoid Panel collision) */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20, /* Moved from Center to Left */
                zIndex: 1000,
                width: 'auto'
            }}>
                <NeonNavbar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* MAIN CONTENT AREA */}
            {renderContent()}

        </div>
    );
};



export default LiveOpsMap;
