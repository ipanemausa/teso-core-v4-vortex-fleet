import React, { useState, useEffect } from "react";
import { AiTaskForce } from "./AiTaskForce";
import ErrorBoundary from "../components/ErrorBoundary";

const DEFAULT_CARS = 15;
const DEFAULT_TRIPS_PER_DAY = 40;

export function CoreOperativo({ onClose, onHome }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLiveEvents, setShowLiveEvents] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Today');
    const [displayRows, setDisplayRows] = useState([]);

    useEffect(() => {
        runSimulation();
    }, [activeFilter]);

    async function runSimulation() {
        setLoading(true);
        setError(null);
        try {
            // Determine days based on filter
            let daysToSimulate = 1;
            if (activeFilter === '7D') daysToSimulate = 7;
            if (activeFilter === '30D') daysToSimulate = 30;
            if (activeFilter === '90D') daysToSimulate = 90;
            if (activeFilter === 'ALL') daysToSimulate = 360;

            const apiUrl = 'https://teso-api-dev.fly.dev';
            const resp = await fetch(
                `${apiUrl}/api/simulate/core-v4`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cars: DEFAULT_CARS,
                        avg_trips_per_day: DEFAULT_TRIPS_PER_DAY,
                        days: daysToSimulate
                    }),
                }
            );
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const result = await resp.json();

            // V4 Logic: Generate rows strictly based on the Model * Days
            const dailyTrips = result.operational?.avg_trips_per_day || 40;
            const totalTripsForPeriod = result.operational?.annual_trips || (dailyTrips * daysToSimulate);
            const carsCount = result.operational?.cars || 15;

            const generatedRows = Array.from({ length: totalTripsForPeriod }).map((_, i) => {
                const carIdx = (i % carsCount) + 1;
                const dayOffset = Math.floor(i / dailyTrips);
                const date = new Date();
                date.setDate(date.getDate() - dayOffset);

                return {
                    id: `ORD-${8000 + i}`,
                    fecha: date.toLocaleDateString('en-US'),
                    hora: "NOW",
                    cliente: i % 4 === 0 ? "Bancolombia S.A." : "Grupo Argos",
                    ruta: "Ruta Óptima",
                    estado: "COMPLETED",
                    conductor: `Conductor ${carIdx}`,
                    vehiculo: `TES-${100 + carIdx}`,
                    tarifa: 125000,
                    pin: (Math.random().toString(36).substr(2, 4)).toUpperCase()
                };
            });

            setData(result);
            setDisplayRows(generatedRows);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div style={{ padding: 40, color: "#fff", background: "#000", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Simulando V4 ({activeFilter})...</div>;
    if (error) return <div style={{ padding: 40, color: "#ff6b6b", background: "#000", height: "100vh" }}>Error: {error}</div>;
    if (!data) return null;

    if (showLiveEvents) {
        return (
            <ErrorBoundary>
                <AiTaskForce onClose={() => setShowLiveEvents(false)} />
            </ErrorBoundary>
        );
    }

    const fmtMoney = (n) => `$ ${n?.toLocaleString('es-CO') || '0'}`;

    return (
        <div style={{ padding: "0", background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            {/* COMPONENT HEADER */}
            <div style={{ height: "60px", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", background: "#0B1120" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px", color: "#fff" }}>CORE OPERATIVO</h1>
                    <div style={{ fontSize: "0.7rem", color: "#00ff80", fontWeight: "bold" }}>● SISTEMA ACTIVO</div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button onClick={() => setShowLiveEvents(true)} style={{ background: "#222", border: "1px solid #444", color: "#ccc", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}>LIVE EVENTS</button>
                    <button style={{ background: "#FFD700", border: "none", color: "#000", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>SHEET ANALYTICS</button>

                    {/* Date Filters */}
                    <div style={{ display: "flex", background: "#111", borderRadius: "4px", border: "1px solid #333", overflow: "hidden" }}>
                        {['Today', '7D', '30D', '90D', 'ALL'].map((f) => (
                            <div
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                style={{
                                    padding: "6px 10px",
                                    fontSize: "0.7rem",
                                    cursor: "pointer",
                                    background: activeFilter === f ? "#00ff80" : "transparent",
                                    color: activeFilter === f ? "#000" : "#888",
                                    fontWeight: "bold",
                                    transition: "all 0.2s"
                                }}
                            >
                                {f}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => setShowLiveEvents(true)} style={{ background: "rgba(255, 69, 0, 0.15)", border: "1px solid #FF4500", color: "#FF4500", padding: "6px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>+ WAR ROOM</button>

                    <button onClick={onHome} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid #fff", color: "#fff", padding: "6px 12px", borderRadius: "14px", fontSize: "0.75rem", fontWeight: "bold", marginLeft: "10px", cursor: "pointer" }}>🏠 INICIO</button>
                    <button onClick={onClose} style={{ background: "transparent", border: "1px solid #ff4444", color: "#ff4444", padding: "6px 12px", borderRadius: "14px", fontSize: "0.75rem", fontWeight: "bold", marginLeft: "10px", cursor: "pointer" }}>✖ SALIR (MAPA)</button>

                    <div style={{ marginLeft: "15px", textAlign: "right", lineHeight: "1" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#00f2ff" }}>{displayRows.length.toLocaleString()}</div>
                        <div style={{ fontSize: "0.6rem", color: "#666" }}>SVC</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {/* KPI CARDS ROW */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.2fr 1.2fr 0.8fr", gap: "15px", marginBottom: "20px" }}>
                    {/* CARD 1: REVENUE */}
                    <div style={{ background: "#0B1120", padding: "15px", borderRadius: "8px", border: "1px solid #333", borderLeft: "4px solid #00f2ff", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#00f2ff", fontWeight: "bold", marginBottom: "4px" }}>INGRESOS BRUTOS (REVENUE)</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#fff" }}>{fmtMoney(data.financial?.gmv)}</div>
                        <div style={{ fontSize: "0.7rem", color: "#666" }}>Proyección cierre de mes ↑ 12%</div>
                    </div>

                    {/* CARD 2: MARGIN */}
                    <div style={{ background: "#0B1120", padding: "15px", borderRadius: "8px", border: "1px solid #333", borderLeft: "4px solid #FFD700", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#FFD700", fontWeight: "bold", marginBottom: "4px" }}>MARGEN OPERATIVO</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#fff" }}>{fmtMoney(data.financial?.ebitda)} <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>({data.financial?.margin_percent}%)</span></div>
                        <div style={{ fontSize: "0.7rem", color: "#666" }}>Post-Comisiones y Gasolina</div>
                    </div>

                    {/* CARD 3: CXC */}
                    <div style={{ background: "#0B1120", padding: "15px", borderRadius: "8px", border: "1px solid #333", borderLeft: "4px solid #F97316", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#F97316", fontWeight: "bold", marginBottom: "4px" }}>CXC (CARTERA CLIENTES)</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#fff" }}>{fmtMoney(data.financial?.gmv * 0.35)}</div>
                        <div style={{ fontSize: "0.7rem", color: "#666" }}>Pendiente de Facturación</div>
                    </div>

                    {/* CARD 4: CXP */}
                    <div style={{ background: "#0B1120", padding: "15px", borderRadius: "8px", border: "1px solid #333", borderLeft: "4px solid #3B82F6", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
                        <div style={{ fontSize: "0.7rem", color: "#3B82F6", fontWeight: "bold", marginBottom: "4px" }}>CXP (NÓMINA DRIVERS)</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#fff" }}>{fmtMoney(data.financial?.gmv * 0.60)}</div>
                        <div style={{ fontSize: "0.7rem", color: "#666" }}>Corte Quincenal: VIERNES</div>
                    </div>

                    {/* CARD 5: CONFLICTS */}
                    <div style={{ background: "#111", padding: "15px", borderRadius: "8px", border: "1px solid #333", boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}>
                        <div style={{ fontSize: "0.65rem", color: "#ff6b6b", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>CONFLICTOS OPS</div>
                        <div style={{ fontSize: "0.7rem", color: "#ccc", display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid #222", paddingBottom: "2px" }}><span>🚫 Cancelados:</span> <span style={{ color: "#ff6b6b", fontWeight: "bold" }}>55</span></div>
                        <div style={{ fontSize: "0.7rem", color: "#ccc", display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid #222", paddingBottom: "2px" }}><span>⚠️ Retrasos:</span> <span style={{ color: "#F97316", fontWeight: "bold" }}>12</span></div>
                        <div style={{ fontSize: "0.7rem", color: "#ccc", display: "flex", justifyContent: "space-between" }}><span>🔄 Cambios:</span> <span style={{ color: "#00f2ff", fontWeight: "bold" }}>4</span></div>
                    </div>
                </div>

                {/* TABLE CONTAINER */}
                <div style={{ background: "#0B1120", borderRadius: "8px", border: "1px solid #333", overflow: "hidden" }}>
                    {/* TABLE HEADER */}
                    <div style={{ padding: "10px 15px", background: "#1F2937", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "1.2rem" }}>📊</span>
                            <span style={{ fontWeight: "700", color: "#fff", fontSize: "0.85rem", letterSpacing: "0.5px" }}>LIBRO: TESO_EDGE_DOCUMENT_VIVO.xlsx</span>
                            <span style={{ background: "#00ff80", color: "#000", padding: "2px 6px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: "bold" }}>● AUTOGUARDADO: ON</span>
                        </div>
                        <button style={{ background: "#10B981", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold", cursor: "pointer" }}>EDGE DOCUMENT VIVO</button>
                    </div>

                    {/* TABLE */}
                    <div style={{ overflowX: "auto", maxHeight: "500px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", color: "#ccc" }}>
                            <thead style={{ position: "sticky", top: 0, background: "#111827", zIndex: 10 }}>
                                <tr style={{ borderBottom: "1px solid #333", textAlign: "left", color: "#6B7280", textTransform: "uppercase" }}>
                                    {['ID', 'FECHA', 'HORA', 'CLIENTE (PAX)', 'RUTA DESTINO', 'ESTADO', 'CONDUCTOR', 'VEHÍCULO', 'TARIFA', 'PIN SEGURIDAD'].map(h => (
                                        <th key={h} style={{ padding: "12px 15px", fontWeight: "600", fontSize: "0.7rem" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayRows.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid #1F2937", background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                                        <td style={{ padding: "10px 15px", fontFamily: "monospace", color: "#fff" }}>{row.id}</td>
                                        <td style={{ padding: "10px 15px" }}>{row.fecha}</td>
                                        <td style={{ padding: "10px 15px", color: "#F97316", fontWeight: "bold" }}>{row.hora}</td>
                                        <td style={{ padding: "10px 15px", fontWeight: "600", color: "#fff" }}>{row.cliente}</td>
                                        <td style={{ padding: "10px 15px" }}>{row.ruta}</td>
                                        <td style={{ padding: "10px 15px" }}>
                                            <span style={{ border: "1px solid #059669", color: "#059669", padding: "2px 8px", borderRadius: "4px", fontSize: "0.65rem", background: "rgba(5, 150, 105, 0.1)", fontWeight: "bold" }}>{row.estado}</span>
                                        </td>
                                        <td style={{ padding: "10px 15px" }}>{row.conductor}</td>
                                        <td style={{ padding: "10px 15px", color: "#00f2ff" }}>{row.vehiculo}</td>
                                        <td style={{ padding: "10px 15px", fontWeight: "bold", color: "#fff" }}>{fmtMoney(row.tarifa)}</td>
                                        <td style={{ padding: "10px 15px", fontFamily: "monospace" }}>{row.pin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* BOTTOM TABS */}
                    <div style={{ padding: "0 15px", background: "#1F2937", borderTop: "1px solid #333", display: "flex", gap: "1px" }}>
                        <div style={{ background: "#111827", color: "#00f2ff", padding: "10px 15px", borderTop: "2px solid #00f2ff", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>PROGRAMACION</div>
                        <div style={{ background: "#222", color: "#666", padding: "10px 15px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>CXC</div>
                        <div style={{ background: "#222", color: "#666", padding: "10px 15px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>CXP</div>
                        <div style={{ background: "#222", color: "#666", padding: "10px 15px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>BANCOS</div>
                        <div style={{ background: "#222", color: "#666", padding: "10px 15px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>EGRESOS</div>
                        <div style={{ background: "#222", color: "#666", padding: "10px 15px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}>+</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
