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
        { id: 'CORE_V4', icon: '🔋', label: 'CORE v4.2 LIGHT' },
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            padding: '10px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px', // Fully rounded for better floating look
            borderBottom: '1px solid #334155',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)', // Glassy inactive
                        backdropFilter: 'blur(4px)',
                        border: activeTab === tab.id ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: activeTab === tab.id ? '#22d3ee' : '#94a3b8',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        boxShadow: activeTab === tab.id ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'inset 0 0 10px rgba(0,0,0,0.2)'
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
