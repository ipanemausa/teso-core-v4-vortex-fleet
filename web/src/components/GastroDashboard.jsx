import React, { useState, useEffect } from 'react';

// --- MOCK DATA FOR SIMULATION ---
const BRANDS = [
    { id: 'ALL', name: 'GRUPO MUNCHER (GLOBAL)', color: '#fff' },
    { id: 'FR', name: 'FRANCO', color: '#FF5722' },
    { id: 'NM', name: 'NIMIS', color: '#E91E63' },
    { id: 'OS', name: 'OH MY SANDWICH', color: '#FFC107' },
    { id: 'CK', name: 'CHIKI CHIKI', color: '#8BC34A' },
    { id: 'MO', name: 'MOOI', color: '#03A9F4' }
];

const PLATFORMS = [
    { id: 'RAPPI', name: 'Rappi', fee: 0.28 },
    { id: 'UBER', name: 'UberEats', fee: 0.30 },
    { id: 'DIDI', name: 'DidiFood', fee: 0.25 },
    { id: 'OWN', name: 'Propio', fee: 0.05 } // Pasarela pagos
];

const GastroDashboard = ({ onClose }) => {
    const [activeBrand, setActiveBrand] = useState(BRANDS[0]);
    const [transactions, setTransactions] = useState([]);
    const [cashFlow, setCashFlow] = useState({ gross: 45000000, net: 28500000, pending: 5200000 });
    const [alerts, setAlerts] = useState([]);

    // --- SIMULATION LOOP ---
    useEffect(() => {
        const interval = setInterval(() => {
            // Create a random transaction
            const brand = BRANDS[Math.floor(Math.random() * (BRANDS.length - 1)) + 1];
            const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
            const amount = Math.floor(Math.random() * 80000) + 20000;
            const isMatch = Math.random() > 0.1; // 10% discrepancy simulation

            const newTx = {
                id: `ORD-${Math.floor(Math.random() * 99999)}`,
                brand: brand.name,
                platform: platform.name,
                time: new Date().toLocaleTimeString(),
                amount: amount,
                net: Math.floor(amount * (1 - platform.fee)),
                status: isMatch ? '✅ CONCILIADO' : '⚠️ DESCUADRE',
                type: isMatch ? 'success' : 'warning'
            };

            setTransactions(prev => [newTx, ...prev].slice(0, 12));

            // Update totals
            setCashFlow(prev => ({
                gross: prev.gross + amount,
                net: prev.net + (isMatch ? amount * (1 - platform.fee) : 0),
                pending: prev.pending + (isMatch ? 0 : amount)
            }));

            // Random Alerts
            if (!isMatch) {
                setAlerts(prev => [`⚠️ ${brand.name}: Retención inusual en orden ${newTx.id} (${platform.name})`, ...prev].slice(0, 5));
            }

        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            width: '100vw', height: '100vh', background: '#0a0b10', color: '#fff',
            fontFamily: '"Inter", sans-serif', padding: '20px', boxSizing: 'border-box',
            display: 'grid', gridTemplateRows: '60px 1fr', gap: '20px'
        }}>

            {/* HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '2rem' }}>👨‍🍳</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>KITCHEN CORE™ OS</h1>
                        <small style={{ color: '#888' }}>FINANCIAL COMMAND CENTER v1.0</small>
                    </div>
                </div>

                {/* BRAND SELECTOR */}
                <div style={{ display: 'flex', gap: '5px' }}>
                    {BRANDS.map(b => (
                        <button
                            key={b.id}
                            onClick={() => setActiveBrand(b)}
                            style={{
                                background: activeBrand.id === b.id ? b.color : 'transparent',
                                color: activeBrand.id === b.id ? '#000' : '#888',
                                border: `1px solid ${b.color}`,
                                padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {b.name}
                        </button>
                    ))}
                </div>

                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </header>

            {/* MAIN CONTENT GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>

                {/* LEFT COLUMN: KPI & VISUALS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* BIG METRICS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <MetricCard title="VENTA BRUTA (POS)" value={`$${(cashFlow.gross / 1000000).toFixed(2)}M`} color="#fff" />
                        <MetricCard title="NETO BANCARIO (REAL)" value={`$${(cashFlow.net / 1000000).toFixed(2)}M`} color="#4CAF50" sub="Disponible Ahora" />
                        <MetricCard title="EN DISPUTA (APPS)" value={`$${(cashFlow.pending / 1000000).toFixed(2)}M`} color="#FF5722" sub="Requiere Acción" />
                    </div>

                    {/* MAIN VISUAL: CASH FLOW RIVER */}
                    <div style={{ flex: 1, background: '#111', borderRadius: '15px', border: '1px solid #333', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                        <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>MATRIZ DE CONCILIACIÓN EN VIVO</h3>

                        {/* TABLE HEADER */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
                            <div>HORA</div>
                            <div>MARCA</div>
                            <div>PLATAFORMA</div>
                            <div>MONTO</div>
                            <div>ESTADO</div>
                        </div>

                        {/* LIVE ROWS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {transactions.map(tx => (
                                <div key={tx.id} style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                                    padding: '10px', borderRadius: '8px',
                                    background: tx.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 87, 34, 0.1)',
                                    borderLeft: `4px solid ${tx.type === 'success' ? '#4CAF50' : '#FF5722'}`,
                                    fontSize: '0.9rem', alignItems: 'center', animation: 'fadeIn 0.5s'
                                }}>
                                    <div style={{ fontFamily: 'monospace' }}>{tx.time}</div>
                                    <div style={{ fontWeight: 'bold' }}>{tx.brand}</div>
                                    <div>{tx.platform}</div>
                                    <div>${tx.amount.toLocaleString()}</div>
                                    <div style={{ color: tx.type === 'success' ? '#4CAF50' : '#FF5722', fontWeight: 'bold' }}>{tx.status}</div>
                                </div>
                            ))}
                        </div>

                        {/* BACKGROUND ANIMATION EFFECT (Subtle) */}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.1, fontSize: '10rem', pointerEvents: 'none' }}>💸</div>
                    </div>
                </div>

                {/* RIGHT COLUMN: ALERTS & ACTIONS */}
                <div style={{ background: '#111', borderRadius: '15px', border: '1px solid #333', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* ALERTS SECTION */}
                    <div>
                        <h3 style={{ margin: '0 0 15px 0', color: '#FF5722' }}>⚠️ ALERTAS DE TESORERÍA</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {alerts.length === 0 && <div style={{ color: '#666', fontStyle: 'italic' }}>Sistema 100% Conciliado</div>}
                            {alerts.map((alert, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', padding: '10px', background: 'rgba(255, 87, 34, 0.05)', border: '1px solid #FF5722', borderRadius: '5px', color: '#ffccbc' }}>
                                    {alert}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PROFITABILITY BY BRAND (Mini Graph Simulation) */}
                    <div style={{ marginTop: 'auto' }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>RENTABILIDAD (EBITDA)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { name: 'FRANCO', val: 85, color: '#FF5722' },
                                { name: 'NIMIS', val: 62, color: '#E91E63' },
                                { name: 'CHIKI', val: 92, color: '#8BC34A' }
                            ].map(b => (
                                <div key={b.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                                        <span>{b.name}</span>
                                        <span>{b.val}%</span>
                                    </div>
                                    <div style={{ height: '6px', width: '100%', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${b.val}%`, background: b.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button style={{
                        marginTop: '20px', padding: '15px', background: '#2196F3', color: '#fff',
                        border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)'
                    }}>
                        EXPORTAR REPORTE DIAN (XML) 📄
                    </button>

                </div>
            </div>

        </div>
    );
};

const MetricCard = ({ title, value, color, sub }) => (
    <div style={{ background: '#1a1d24', padding: '20px', borderRadius: '15px', borderTop: `4px solid ${color}` }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.8rem', color: color, marginTop: '5px' }}>{sub}</div>}
    </div>
);

export default GastroDashboard;
