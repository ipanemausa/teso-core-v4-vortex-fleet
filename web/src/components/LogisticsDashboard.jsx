import React, { useState, useEffect } from 'react';

const LogisticsDashboard = ({ activeReq, onRowClick, simulationData }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('INBOUND'); // INBOUND, OUTBOUND, INVENTORY
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    // --- MOCK DATA OR PROP DATA ---
    // If simulationData is present, we use it. Otherwise, we show empty state or loading.
    const services = simulationData?.services || [];

    // --- FILTER LOGIC ---
    const filteredData = services.filter(svc => {
        // Basic Search
        const searchStr = (svc.CLIENTE + svc.CONDUCTOR + svc.ID).toUpperCase();
        return searchStr.includes(searchTerm.toUpperCase());
    });

    // --- PAGINATION (Client Side for now, but ready for Server Side) ---
    const [page, setPage] = useState(1);
    const rowsPerPage = 20;
    const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // --- STYLES (WMS / Temu Inspired) ---
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            width: '100%',
            fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            backgroundColor: '#f4f6f8', // Clinical Grey
            color: '#333'
        },
        sidebar: {
            width: '240px',
            backgroundColor: '#1a2332', // Dark Navy (WMS Standard)
            color: '#ecf0f1',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 0',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        },
        mainContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        header: {
            height: '60px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #dfe6e9',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            justifyContent: 'space-between'
        },
        gridContainer: {
            flex: 1,
            padding: '20px',
            overflow: 'auto'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#ffffff',
            fontSize: '13px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        th: {
            backgroundColor: '#f8f9fa',
            color: '#637381',
            fontWeight: '600',
            textAlign: 'left',
            padding: '12px 16px',
            borderBottom: '2px solid #dfe6e9',
            position: 'sticky',
            top: 0
        },
        td: {
            padding: '10px 16px',
            borderBottom: '1px solid #eff2f5',
            color: '#212b36'
        },
        row: {
            cursor: 'pointer',
            transition: 'background 0.2s'
        },
        badge: {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
        }
    };

    // --- RENDER HELPERS ---
    const renderStatusBadge = (status) => {
        let color = '#999';
        let bg = '#eee';

        if (status === 'FINALIZADO' || status === 'COMPLETED') { color = '#00ab55'; bg = '#eafbf2'; }
        if (status === 'CANCELADO') { color = '#ff4842'; bg = '#ffecec'; }
        if (status === 'EN_PROGRESO') { color = '#1890ff'; bg = '#e6f7ff'; }

        return (
            <span style={{ ...styles.badge, color, backgroundColor: bg }}>
                {status}
            </span>
        );
    };

    return (
        <div style={styles.container}>
            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                <div style={{ padding: '0 20px 30px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    📦 TESO WMS
                </div>

                {['INBOUND', 'OUTBOUND', 'INVENTORY', 'RETURNS', 'REPORTS'].map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 20px',
                            cursor: 'pointer',
                            backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
                            borderLeft: activeTab === tab ? '4px solid #00ab55' : '4px solid transparent',
                            color: activeTab === tab ? '#fff' : '#919eab',
                            fontSize: '14px'
                        }}
                    >
                        {tab === 'INBOUND' ? 'Entradas / Aviso' :
                            tab === 'OUTBOUND' ? 'Despachos / Salida' :
                                tab === 'INVENTORY' ? 'Inventario / Stock' :
                                    tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT */}
            <div style={styles.mainContent}>
                {/* HEADER */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#1a2332' }}>{activeTab === 'INBOUND' ? 'Aviso de Llegada' : 'Gestión de Despachos'}</span>
                        <span style={{ fontSize: '12px', color: '#637381', backgroundColor: '#f4f6f8', padding: '2px 8px', borderRadius: '12px' }}>
                            Total: {filteredData.length}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="🔍 Buscar Orden, Cliente, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #dfe6e9',
                                borderRadius: '6px',
                                width: '300px',
                                outline: 'none'
                            }}
                        />
                        <button style={{
                            backgroundColor: '#1a2332',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px'
                        }}>
                            + NUEVO AVISO
                        </button>
                    </div>
                </div>

                {/* GRID TOOLBAR */}
                <div style={{ padding: '15px 20px', display: 'flex', gap: '10px', borderBottom: '1px solid #eff2f5' }}>
                    <button style={{ background: '#fff', border: '1px solid #dfe6e9', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>🖨️ Imprimir Etiquetas</button>
                    <button style={{ background: '#fff', border: '1px solid #dfe6e9', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>📥 Exportar Excel</button>
                    <button style={{ background: '#fff', border: '1px solid #dfe6e9', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>📧 Enviar Confirmación</button>
                </div>

                {/* DATA GRID */}
                <div style={styles.gridContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}><input type="checkbox" /></th>
                                <th style={styles.th}>ID ORDEN</th>
                                <th style={styles.th}>FECHA</th>
                                <th style={styles.th}>CLIENTE / PROVEEDOR</th>
                                <th style={styles.th}>ESTADO</th>
                                <th style={styles.th}>TIPO SERVICIO</th>
                                <th style={styles.th}>CONDUCTOR / RESOURCE</th>
                                <th style={styles.th}>TARIFA (COP)</th>
                                <th style={styles.th}>ACCION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((svc, idx) => (
                                <tr key={svc.ID || idx} style={styles.row} onClick={() => onRowClick && onRowClick(svc)}>
                                    <td style={styles.td}><input type="checkbox" /></td>
                                    <td style={{ ...styles.td, fontWeight: 'bold', color: '#1890ff' }}>{svc.ID}</td>
                                    <td style={styles.td}>{svc.FECHA?.substring(0, 10)}</td>
                                    <td style={{ ...styles.td, fontWeight: '600' }}>{svc.CLIENTE}</td>
                                    <td style={styles.td}>{renderStatusBadge(svc.ESTADO)}</td>
                                    <td style={styles.td}>{svc.TIPO}</td>
                                    <td style={styles.td}>{svc.CONDUCTOR}</td>
                                    <td style={{ ...styles.td, textAlign: 'right' }}>${svc.TARIFA?.toLocaleString()}</td>
                                    <td style={styles.td}>
                                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>⋮</button>
                                    </td>
                                </tr>
                            ))}

                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        No hay datos disponibles. Sincronizando con Vortex...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#637381' }}>Página {page} de {totalPages}</span>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            style={{ padding: '6px 12px', border: '1px solid #dfe6e9', background: '#fff', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            Anterior
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            style={{ padding: '6px 12px', border: '1px solid #dfe6e9', background: '#fff', borderRadius: '4px', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsDashboard;
