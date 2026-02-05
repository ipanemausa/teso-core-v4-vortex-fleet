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

                        {/* C. RIGHT PANEL */}
                        <div style={{
                            width: '380px',
                            background: '#09090b',
                            borderLeft: '1px solid #334155',
                            display: 'flex', flexDirection: 'column',
                            padding: '20px',
                            zIndex: 50,
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.8)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0, color: '#ef4444', fontFamily: 'monospace' }}>TESO OPS</h2>
                                <div style={{ color: '#ea580c' }}>🏠</div>
                            </div>

                            <div style={{ flex: 1, background: '#000', border: '1px solid #1e293b', borderRadius: '4px', padding: '10px', overflowY: 'auto' }}>
                                <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '10px' }}>SYSTEM LOGS</div>
                                <div style={{ color: '#39FF14' }}>Scan complete.</div>
                                <div style={{ color: '#fff' }}>Grid operational.</div>
                                {simulationData?.planes && (
                                    <div style={{ marginTop: '10px', color: '#00F0FF' }}>
                                        ✈️ {simulationData.planes.length} Active Flights
                                    </div>
                                )}
                                <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '10px' }}>
                                    Running Module: LiveOpsMap v1.1 (Multi-View)
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', height: '100%' }}>

            {/* A. FLOATING NAVBAR (Always Visible) */}
            <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: 'auto' }}>
                <NeonNavbar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* MAIN CONTENT AREA */}
            {renderContent()}

        </div>
    );
};

export default LiveOpsMap;
