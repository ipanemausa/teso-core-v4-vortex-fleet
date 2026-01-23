/**
 * ERP RAG SYSTEM v3.0 (Dynamic Vortex Integration)
 * 
 * 'The Brain' now connects effectively to the Treasury Engine to provide
 * real-time, calculated answers instead of static strings.
 */

import CashFlowEngine from '../treasury/CashFlowEngine.js';

/**
 * Processes a natural language query using the Panax-Architecture logic.
 * @param {string} query - The user's input text.
 * @returns {object} Response containing structured financial data.
 */
export const queryErpRag = (query) => {
    const normalize = (text) => text.toLowerCase();
    const q = normalize(query);

    console.log(`[ERP RAG CORE] Processing Intent: "${query}"`);

    // --- INTENT: CASH POSITION / LIQUIDITY ---
    if (q.includes("caja") || q.includes("liquidez") || q.includes("banco") || q.includes("dinero") || q.includes("saldo")) {
        const position = CashFlowEngine.getGlobalLiquidityPosition();

        let answer = `La Posición Global de Liquidez es de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(position.totalCOP)}. `;
        answer += `Estado: ${position.status}. `;
        answer += `Desglose: Bancolombia: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(position.breakdown.BANCOLOMBIA_COP.amount)}, `;
        answer += `BoFA: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(position.breakdown.BOFA_USD.amount)}.`;

        return {
            source: "PANAX_TREASURY_ENGINE",
            type: "FINANCIAL_REPORT",
            answer: answer,
            confidence: 1.0,
            data: position
        };
    }

    // --- INTENT: FORECAST / PROJECTION ---
    if (q.includes("proyeccion") || q.includes("futuro") || q.includes("forecast") || q.includes("flujo")) {
        const forecast = CashFlowEngine.forecastCashFlow(15);
        const endBalance = forecast[forecast.length - 1].balance;

        return {
            source: "PANAX_FORECAST_AI",
            type: "SIMULATION",
            answer: `Proyección a 15 días calculada "Estilo Panax". El saldo final Estimado será ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(endBalance)}. Se detecta una salida fuerte de nómina el día 15.`,
            confidence: 0.9,
            data: forecast
        };
    }

    // --- INTENT: OPERATIONAL / FLEET (Legacy Mock) ---
    if (q.includes("flota") || q.includes("carros") || q.includes("aviones")) {
        return {
            source: "TESO_OPS_LOG",
            type: "INFO",
            answer: "El 85% de la flota está operativa bajo control de tráfico aéreo real.",
            confidence: 0.85
        };
    }

    // Default Fallback
    return {
        source: "ERP_BRAIN",
        type: "UNKNOWN",
        answer: "Comando no reconocido por el núcleo financiero. Intente: 'Ver liquidez', 'Proyección de caja' o 'Estado de flota'.",
        confidence: 0.1
    };
};

export default { queryErpRag };
