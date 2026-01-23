/**
 * CASH FLOW ENGINE (PANAX CORE REPLICA)
 * 
 * This module replicates the core functionality of Panax:
 * 1. Centralized Cash Visibility (Banks + Accounts)
 * 2. Automated Forecasting
 * 3. Liquidity Gap Detection
 */

// Simulated Live Bank Balances
let BANK_BALANCES = {
    'BANCOLOMBIA_COP': { amount: 150000000, currency: 'COP', type: 'Checking' },
    'DAVIVIENDA_COP': { amount: 50000000, currency: 'COP', type: 'Savings' },
    'BOFA_USD': { amount: 25000, currency: 'USD', type: 'Checking' },
    'STRIPE_PENDING': { amount: 5000, currency: 'USD', type: 'Gateway' }
};

const FORECAST_RULES = {
    PAYROLL_DAY: 15,
    PAYROLL_COST: 45000000, // COP
    SERVER_COST: 500, // USD
    AVG_DAILY_SALES: 2500000 // COP
};

/**
 * Returns the Consolidated Liquidity Index (CLI)
 * Aggregates all global positions into a single base currency (COP).
 */
export const getGlobalLiquidityPosition = (exchangeRateUsdCop = 4100) => {
    let totalLiquidityCOP = 0;

    Object.entries(BANK_BALANCES).forEach(([bank, data]) => {
        if (data.currency === 'USD') {
            totalLiquidityCOP += data.amount * exchangeRateUsdCop;
        } else {
            totalLiquidityCOP += data.amount;
        }
    });

    return {
        totalCOP: totalLiquidityCOP,
        breakdown: BANK_BALANCES,
        status: totalLiquidityCOP > 100000000 ? 'HEALTHY' : 'CRITICAL'
    };
};

/**
 * Simulates a Cash Flow Forecast for N days.
 * "Panax AI Prediction" Style
 */
export const forecastCashFlow = (days = 30) => {
    let projection = [];
    let currentBalance = getGlobalLiquidityPosition().totalCOP;

    for (let i = 1; i <= days; i++) {
        // Daily Inflow (Sales)
        // Add some "simulation noise/randomness" to make it realistic
        const dailySales = FORECAST_RULES.AVG_DAILY_SALES * (0.8 + Math.random() * 0.4);
        currentBalance += dailySales;

        // Scheduled Outflows
        if (i === 15 || i === 30) { // Paydays
            currentBalance -= FORECAST_RULES.PAYROLL_COST;
        }

        projection.push({
            day: i,
            balance: Math.floor(currentBalance),
            flow: Math.floor(dailySales)
        });
    }

    return projection;
};

export default {
    getGlobalLiquidityPosition,
    forecastCashFlow
};
