import React from 'react';

export function NeonNavbar({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'FLOTA', icon: '🚙', label: 'FLOTA' },
        { id: 'ORDENES', icon: '📦', label: 'ORDENES' },
        { id: 'VUELOS', icon: '✈️', label: 'VUELOS' },
        { id: 'CLIENTES', icon: '🏢', label: 'CLIENTES' },
        { id: 'AGENDA', icon: '📅', label: 'AGENDA' },
        { id: 'FINANZAS', icon: '💰', label: 'FINANZAS' },
        { id: 'MERCADO', icon: '📢', label: 'MERCADO' },
        { id: 'CORE_V4', icon: '🔋', label: 'CORE v4.8 LIVE' },
        { id: 'ARTEFACTO', icon: '🧬', label: 'LHU ARTEFACT' }, // New Tab
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            padding: '10px',
            // background: 'transparent', // Removed 'barra'
            // backdropFilter: 'none',
            // border: 'none',
            // boxShadow: 'none'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: activeTab === tab.id ? 'rgba(8, 145, 178, 0.3)' : 'rgba(15, 23, 42, 0.9)', // Solid Dark Background for Contrast
                        backdropFilter: 'blur(4px)',
                        border: activeTab === tab.id ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.2)',
                        color: activeTab === tab.id ? '#67e8f9' : '#f8fafc', // High Contrast White
                        padding: '8px 16px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '800', // Extra Bold
                        textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                        transition: 'all 0.2s',
                        boxShadow: activeTab === tab.id ? '0 0 15px rgba(6, 182, 212, 0.3)' : '0 4px 6px rgba(0,0,0,0.3)' // Shadow for lift
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
