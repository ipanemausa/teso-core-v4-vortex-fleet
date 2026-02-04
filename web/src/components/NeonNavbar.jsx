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
        { id: 'CORE_V4', icon: '🔋', label: 'CORE V4' },
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            padding: '10px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0 0 20px 20px',
            borderBottom: '1px solid #334155',
            position: 'absolute',
            top: 20, // Floating below the main header
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '80%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                        border: activeTab === tab.id ? '1px solid #06b6d4' : '1px solid #475569',
                        color: activeTab === tab.id ? '#22d3ee' : '#cbd5e1',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: activeTab === tab.id ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none'
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
