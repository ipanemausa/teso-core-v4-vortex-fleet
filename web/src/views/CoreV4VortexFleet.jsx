import React, { useState } from "react";

const DEFAULT_CARS = 35;
const DEFAULT_TRIPS_PER_DAY = 80;
const DEFAULT_DAYS = 365;

export function CoreV4VortexFleet() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function runSimulation() {
        setLoading(true);
        setError(null);
        try {
            // Production Endpoint (Hugging Face Spaces)
            // NOTE: Ensure this matches your deployed Space name/user
            const apiUrl = 'https://GuillermoHoyos-teso.hf.space';

            const resp = await fetch(
                `${apiUrl}/api/simulate/core-v4`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cars: DEFAULT_CARS,
                        avg_trips_per_day: DEFAULT_TRIPS_PER_DAY,
                        days: DEFAULT_DAYS,
                    }),
                }
            );
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "24px", color: "#e0f7ff" }}>
            <h2>TESO Core V4 – Vortex Fleet (35 / 80)</h2>
            <p style={{ fontSize: "0.9rem", maxWidth: 500 }}>
                Simulación de operación con 35 carros y 80 viajes/día (~29 000 servicios/año).
            </p>

            <button
                onClick={runSimulation}
                disabled={loading}
                style={{
                    marginTop: "12px",
                    padding: "10px 28px",
                    background: "#00f2ff",
                    color: "#000",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                }}
            >
                {loading ? "Simulando..." : "Simular operación V4"}
            </button>

            {error && (
                <p style={{ marginTop: "12px", color: "#ff6b6b" }}>
                    Error al simular: {error}
                </p>
            )}

            {result && (
                <div style={{ marginTop: "20px", fontSize: "0.9rem" }}>
                    <div>Carros: {result.cars}</div>
                    <div>Viajes/día: {result.avg_trips_per_day}</div>
                    <div>Días: {result.days}</div>
                    <div>Servicios/año: {result.annual_trips}</div>
                    <div>Viajes por carro/día: {result.trips_per_car_per_day}</div>
                    <div>Utilización promedio: {result.utilization_percent}%</div>
                </div>
            )}
        </div>
    );
}
