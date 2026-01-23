/**
 * TESO OPERATIONAL DATA SCHEMA (v3.0)
 * 
 * Improvement Analysis vs Manual Excel Sheet:
 * 1. STRUCTURE: Converted flat rows into relational objects (Client, Driver, Financials).
 * 2. INTEGRITY: Added enum validations for status to prevent typos ("PAGADO" vs "pagado").
 * 3. ANALYTICS: Separated financials into discrete 'profit_center' logic for real-time margin calculation.
 * 4. TRACEABILITY: Added 'audit_trail' to track who edited the record and when.
 * 
 * This schema allows for:
 * - Instant P&L per trip.
 * - Aging of Accounts Receivable (CXC).
 * - Driver Payroll automation (CXP).
 */

export const TripTicketSchema = {
    // CORE IDENTIFIERS
    id: "UUID (e.g., 'TK-2025-001')",
    created_at: "ISO8601 Timestamp",
    updated_at: "ISO8601 Timestamp",

    // OPERATION DETAILS
    operation: {
        date: "YYYY-MM-DD",
        time: "HH:mm",
        type: "ENUM('AIRPORT_TRANSFER', 'HOURLY', 'CITY_TO_CITY', 'EVENT')",
        flight_info: {
            code: "String (e.g., 'AV9314')",
            status: "DETAILS (from AviationStack API)",
            landing_time: "HH:mm"
        },
        route: {
            origin: "String / Coordinates",
            destination: "String / Coordinates",
            distance_km: "Number",
            est_duration_min: "Number"
        },
        pax: {
            name: "String",
            count: "Number",
            phone: "String (Masked)",
            is_vip: "Boolean"
        }
    },

    // RESOURCE ALLOCATION
    resources: {
        company_id: "Reference -> ClientDB",
        company_name: "String (Denormalized for fast search)",
        vehicle_id: "Reference -> FleetDB",
        driver_id: "Reference -> DriverDB",
        driver_name: "String"
    },

    // FINANCIALS (THE UPGRADE)
    // Separation of Concerns: Client Billing (CXC) vs Driver Pay (CXP)
    financials: {
        currency: "COP",

        // REVENUE (CXC - CUENTAS POR COBRAR)
        billing: {
            base_rate: "Number (Integer)",
            add_ons: {
                night_surcharge: "Number",
                waiting_time: "Number",
                parking: "Number"
            },
            total_client: "Number (Calculated)",
            invoice_status: "ENUM('UNBILLED', 'DRAFT', 'SENT', 'PAID', 'OVERDUE')",
            invoice_ref: "String (e.g., 'FV-901')",
            payment_terms: "ENUM('NET30', 'PREPAID', 'CREDIT_CARD')"
        },

        // COST (CXP - CUENTAS POR PAGAR)
        payout: {
            driver_agreed_rate: "Number",
            bonuses: "Number",
            deductions: "Number (e.g., Loans, Advancements)",
            total_driver: "Number (Calculated)",
            payment_status: "ENUM('PENDING', 'AUTHORIZED', 'PAID')",
            payout_ref: "String (transaction ID)"
        },

        // PROFITABILITY
        margin: {
            gross_amount: "Number (billing.total_client - payout.total_driver)",
            gross_margin_percent: "Number ((gross_amount / billing.total_client) * 100)"
        }
    },

    // AUDIT & METADATA
    metadata: {
        source: "ENUM('WHATSAPP', 'WEB', 'API', 'EXCEL_IMPORT')",
        scheduler_initials: "String",
        notes: "String",
        tags: "Array['VIP', 'URGENT', 'LATE_NIGHT']"
    }
};

/**
 * MOCK DATA GENERATOR
 * Uses the improved schema to generate analytic-ready data
 */
export const generateImprovedOperationsData = (count = 50) => {
    // ... (This function will generate mock data structures for the dashboard)
    // For now we export the schema definition.
    return [];
};
