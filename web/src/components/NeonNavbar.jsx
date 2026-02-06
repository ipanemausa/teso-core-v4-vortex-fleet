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
            flexWrap: 'wrap',
            gap: '6px',
            padding: '5px'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: activeTab === tab.id
                            ? 'linear-gradient(180deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.05) 100%)'
                            : 'linear-gradient(180deg, rgba(71, 85, 105, 0.2) 0%, rgba(15, 23, 42, 0.4) 100%)', // Degradado Humo Super Transparente
                        backdropFilter: 'blur(8px)', // Slightly reduced blur for cleaner look
                        border: activeTab === tab.id ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: activeTab === tab.id ? '#00ffff' : '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '900', // Max Bold
                        textShadow: '0 2px 4px #000000, 0 0 2px #000000', // Double Shadow for Readability
                        transition: 'all 0.2s',
                        boxShadow: activeTab === tab.id ? '0 0 15px rgba(6, 182, 212, 0.3)' : '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
