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
            flexWrap: 'wrap', // Allow wrapping for safety
            gap: '6px', // Reduced gap
            padding: '5px', // Reduced padding
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
                        background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.4)', // Glassy Dark
                        backdropFilter: 'blur(12px)', // Strong Blur
                        border: activeTab === tab.id ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: activeTab === tab.id ? '#00ffff' : '#ffffff', // Ultra Bright White & Cyan
                        padding: '6px 12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textShadow: '0 2px 4px rgba(0,0,0,1)', // Maximum Contrast Shadow
                        transition: 'all 0.2s',
                        boxShadow: activeTab === tab.id ? '0 0 15px rgba(6, 182, 212, 0.4)' : '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
