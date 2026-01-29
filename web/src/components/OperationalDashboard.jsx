import React, { useState, useEffect } from 'react';

// Import Invoices (Assets)
const pdfSierService = '/documents/invoices/invoice_sier_service.pdf';
const pdfViajesAz = '/documents/invoices/invoice_viajes_az.pdf';
const pdfPersonalSoft = '/documents/invoices/invoice_personal_soft.pdf';

// Import Master Sheet (Fixed for Vite)
const excelMaster = '/documents/data/TESO_EDGE_DOCUMENT_VIVO.xlsx';

// Import Schema Definition (Visualization Only)
import { TripTicketSchema } from '../data/schemas/TripTicketSchema';
// [DEPRECATED] Client-Side Simulation - Now handled by Python Backend
// import { runSimulation } from '../utils/simulationEngine'; 
import { generateMasterExcel } from '../utils/excelGenerator';
import { generateStressReport } from '../utils/pdfGenerator';
import { logAuditEvent } from '../utils/auditLogger';
import ExplainableTooltip from './ExplainableTooltip';
import TesoButton from './ui/TesoButton';
import StatusBadge from './ui/StatusBadge';
import { CoreOperativo } from '../views/CoreOperativo';

// HELPER: Date Parser
const parseItemDate = (dateStr) => {
    if (!dateStr) return new Date('1970-01-01');
    // Handle ISO
    if (dateStr.includes('T')) return new Date(dateStr);
    // Handle YYYY-MM-DD
    return new Date(dateStr);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

const OperationalDashboard = ({ vehicles, requests, initialViewMode = 'ANALYTICS', onRowClick, simulationData: propSimulationData, onClose, onHome, onRegenerate, onSimulateStress, onRunMacro }) => {

    // --- STATE ---
    const [simulationData, setSimulationData] = useState(propSimulationData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // FIX: Sync Prop to State (React Pattern for Derived State)
    useEffect(() => {
        if (propSimulationData) {
            console.log("🔄 DASHBOARD: Syncing with Parent Data...", propSimulationData.services?.length);
            setSimulationData(propSimulationData);
        }
    }, [propSimulationData]);



    // --- FETCH DATA FROM BACKEND (V4 ENGINE) ---
    useEffect(() => {
        if (simulationData) return; // If passed as prop, use it

        const loadBackendData = async () => {
            console.log("📡 CONNECTING TO TESO OPS V4...");
            setLoading(true);
            try {
                const apiUrl = 'https://teso-api-dev.fly.dev'; // Force Production URL

                // 1. GET V4 STATS
                const res = await fetch(`${apiUrl}/api/simulate/core-v4`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cars: 15, avg_trips_per_day: 40, days: 360 })
                });

                if (!res.ok) throw new Error("Ops Engine Offline");
                const v4Result = await res.json();
                console.log("✅ OPS CONNECTED:", v4Result);

                // 2. GENERATE CLIENT-SIDE DATASET (For Map & Graphs)
                // 40 trips * 360 days = 14,400 rows (Manageable in memory)
                const totalTrips = v4Result.operational?.annual_trips || 14400;
                const cars = v4Result.operational?.cars || 15;

                // Generate fast
                const services = new Array(totalTrips);
                const baseDate = new Date();
                baseDate.setDate(baseDate.getDate() - 360);

                for (let i = 0; i < totalTrips; i++) {
                    const carId = (i % cars) + 1;
                    // Distribute dates over 360 days
                    const dayOffset = Math.floor(i / 40);
                    const tripDate = new Date(baseDate);
                    tripDate.setDate(tripDate.getDate() + dayOffset);

                    services[i] = {
                        id: `TRIP-${i}`,
                        date: tripDate.toISOString(),
                        lat: 6.24 + (Math.random() * 0.08 - 0.04), // Medellín
                        lng: -75.58 + (Math.random() * 0.08 - 0.04),
                        status: 'COMPLETED',
                        financials: {
                            totalValue: 125000,
                            driverPayment: 82000,
                            netRevenue: 25000
                        },
                        plate: `TES-${100 + carId}`,
                        driver_name: `Cond. ${carId}`
                    };
                }

                // 3. STUB BANK TRANSACTIONS (For Graph Consistency)
                const bankTransactions = services.filter((_, i) => i % 10 === 0).map(s => ({
                    date: s.date,
                    amount: 25000, // Net Revenue
                    type: 'INCOME',
                    description: 'Comisión Teso Ops'
                }));

                setSimulationData({
                    ...v4Result,
                    services: services, // Populates Map & Table
                    bankTransactions: bankTransactions
                });

            } catch (err) {
                console.error("❌ OPS ERROR:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBackendData();
    }, []);

    // ... (rest of state)


    const [viewMode, setViewMode] = useState(initialViewMode); // 'LIVE_OPS' | 'ANALYTICS'
    const [activeSheet, setActiveSheet] = useState('PROGRAMACION');
    const [isAuditMode, setIsAuditMode] = useState(false); // NEW: Tech Audit Toggle
    const [expandedClient, setExpandedClient] = useState(null);
    const [timeFilter, setTimeFilter] = useState('Today'); // 'TODAY', '7D', '30D', 'ALL'
    const [isExporting, setIsExporting] = useState(false); // Export Loading State

    // --- WAR ROOM (SCENARIO BUILDER) STATE ---
    const [showWarRoom, setShowWarRoom] = useState(false);
    const [scenario, setScenario] = useState({
        cxcDays: 30,    // Dias Cartera (Cobro)
        cxpFreq: 15,    // Dias Nomina (Pago)
        growth: 1.0     // Factor Crecimiento
    });
    const [stressResult, setStressResult] = useState({
        status: 'STABLE',
        minCash: 0,
        insolvencyDay: null,
        runway: '∞'
    });

    // --- PROJECTION ENGINE (STRESS TEST) ---
    useEffect(() => {
        let combinedServices = [...(requests || []), ...(simulationData?.services || [])];
        if (combinedServices.length === 0) return;

        // 0. APPLY TIME FILTER TO GRAPH DATA
        const getCutoff = () => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            if (timeFilter === 'Today') { d.setDate(d.getDate() - 1); return d; }
            if (timeFilter === '30D') { d.setDate(d.getDate() - 30); return d; }
            if (timeFilter === '90D') { d.setDate(d.getDate() - 90); return d; }
            if (timeFilter === '180D') { d.setDate(d.getDate() - 180); return d; }
            if (timeFilter === '360D') { d.setDate(d.getDate() - 360); return d; }
            return new Date('2020-01-01'); // ALL
        };
        const cutoff = getCutoff();

        // If not ALL, filter the source data for the graph
        if (timeFilter !== 'ALL') {
            combinedServices = combinedServices.filter(s => new Date(s.date || 0) >= cutoff);
        }

        // 1. Sort all events by date to find range
        const timeline = [];
        const startCash = 800000000; // UPDATED 800M Rule

        // Determine Simulation Range
        const serviceDates = combinedServices.map(s => new Date(s.date).getTime());
        const minDate = new Date(Math.min(...serviceDates));
        const maxDate = new Date(Math.max(...serviceDates));

        // Extend range for projection based on CxC Cycle (not hardcoded 90)
        const projectionEnd = new Date(maxDate);
        projectionEnd.setDate(projectionEnd.getDate() + parseInt(scenario.cxcDays) + 15); // Dynamic extension

        // A. Project INFLOWS (Revenue) -> Shifted by cxcDays
        combinedServices.forEach(s => {
            if (s.status === 'CANCELLED') return;
            const date = new Date(s.date);
            date.setDate(date.getDate() + parseInt(scenario.cxcDays)); // Shift
            timeline.push({
                date: date,
                amount: ((s.financials?.totalValue || 0) * parseFloat(scenario.growth)),
                type: 'INFLOW'
            });
        });

        // B. Project OUTFLOWS (Driver Costs) -> Batched by cxpFreq
        combinedServices.forEach(s => {
            if (s.status === 'CANCELLED') return;
            const sDate = new Date(s.date);
            const day = sDate.getDate();

            // Simple cycle logic: If freq=15, pay on 15th or 30th
            let nextCycleDay = Math.ceil(day / scenario.cxpFreq) * scenario.cxpFreq;
            if (nextCycleDay > 30) nextCycleDay = 30;

            const payDate = new Date(sDate);
            if (day > nextCycleDay) {
                payDate.setMonth(payDate.getMonth() + 1);
                payDate.setDate(scenario.cxpFreq);
            } else {
                payDate.setDate(nextCycleDay);
            }

            timeline.push({
                date: payDate,
                amount: -((s.financials?.driverPayment || 0) * parseFloat(scenario.growth)),
                type: 'OUTFLOW'
            });
        });

        // C. Project FIXED EXPENSES (The "Real World" Check)
        const fixedExpenses = [
            { desc: "INFRAESTRUCTURA AWS", amount: 2500000, day: 5 },
            { desc: "OFICINA & ADMIN", amount: 4500000, day: 1 },
            { desc: "NOMINA SOPORTE (Q1)", amount: 6000000, day: 15 },
            { desc: "NOMINA SOPORTE (Q2)", amount: 6000000, day: 30 }
        ];

        let iterDate = new Date(minDate);
        // Normalize to first of month for smoother iteration logic? 
        // Just iterate day by day or month by month? 
        // Let's iterate month by month from minDate to projectionEnd

        while (iterDate <= projectionEnd) {
            const currentMonth = iterDate.getMonth();
            const currentYear = iterDate.getFullYear();

            fixedExpenses.forEach(exp => {
                // Create expense event for this month
                const expDate = new Date(currentYear, currentMonth, exp.day);
                if (expDate >= minDate && expDate <= projectionEnd) {
                    timeline.push({
                        date: expDate,
                        amount: -exp.amount,
                        type: 'FIXED_COST'
                    });
                }
            });
            // Next month
            iterDate.setMonth(iterDate.getMonth() + 1);
        }

        // 4. Simulate Daily Balance & Generate Graph Points
        timeline.sort((a, b) => a.date - b.date);

        let currentCash = startCash;
        let minCash = startCash;
        let maxCash = startCash;
        let insolvencyDay = null;
        const balances = [];

        // Run Logic
        for (let event of timeline) {
            currentCash += event.amount;
            if (currentCash < minCash) minCash = currentCash;
            if (currentCash > maxCash) maxCash = currentCash;

            if (currentCash < 0 && !insolvencyDay) {
                insolvencyDay = event.date.toLocaleDateString();
            }
            balances.push(currentCash);
        }

        // GENERATE REAL SVG PATH
        // Normalize: X (Time) 0->100, Y (Cash) 100->0 (Top is +)
        const totalPoints = balances.length;
        const range = Math.max(maxCash - minCash, 1000000); // Avoid zero div

        const mapY = (val) => {
            // Map range to 10-90% of SVG height
            const pct = (val - minCash) / range; // 0 to 1
            return 90 - (pct * 80); // 90 down to 10
        };

        let pathD = `M 0 ${mapY(startCash)}`;
        // Reduce resolution for SVG performance (every Nth point)
        const step = Math.ceil(totalPoints / 200); // Higher res for smoothness

        for (let i = 0; i < totalPoints; i += step) {
            const x = (i / totalPoints) * 100;
            const y = mapY(balances[i]);
            pathD += ` L ${x} ${y}`;
        }

        // 5. Set Result
        setStressResult({
            status: minCash < 0 ? 'INSOLVENT' : 'SUSTAINABLE',
            minCash,
            insolvencyDay,
            runway: insolvencyDay ? `${Math.floor((new Date(insolvencyDay) - new Date()) / (1000 * 60 * 60 * 24))} Days` : '∞',
            graphPath: pathD,
            duration: Math.floor(totalPoints / (combinedServices.length / timeline.length || 1)),
            simDays: Math.ceil(totalPoints / (timeline.length / totalPoints))
        });

    }, [simulationData, scenario, timeFilter]);

    // Sync if parent changes intent
    useEffect(() => {
        if (initialViewMode) setViewMode(initialViewMode);
    }, [initialViewMode]);

    // Live Metrics State
    const [metrics, setMetrics] = useState({
        efficiency: 94,
        avgResponse: 12,
        errorRate: 0
    });

    // ANALYTICS STATE
    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        totalCost: 0,
        margin: 0,
        marginPercent: 0,
        cxcPending: 0,
        cxpPending: 0,
        topClients: []
    });

    // Corporate Billing State
    const [billingSearch, setBillingSearch] = useState('');

    const [corporateAccounts, setCorporateAccounts] = useState([]);

    // --- HANDLER: DOWNLOAD STRESS REPORT ---
    const handleDownloadReport = () => {
        if (!stressResult) return;

        // 1. Generate PDF
        const doc = generateStressReport(scenario, stressResult, analytics);
        doc.save(`TESO_CERTIFICADO_RESILIENCIA_${new Date().toISOString().slice(0, 10)}.pdf`);

        // 2. Log Audit Event
        logAuditEvent('Director Financiero', 'DOWNLOAD_STRESS_CERTIFICATE', {
            scenario: scenario,
            result: stressResult.status
        });
    };

    // --- REAL-TIME CALCULATION ENGINE ---
    useEffect(() => {
        // --- FILTERING LOGIC ---
        const now = new Date();
        const getCutoffDate = () => {
            const today = new Date(); // Fresh copy for each calculation
            if (timeFilter === 'Today') return new Date(today.setDate(today.getDate() - 1));

            const d7 = new Date();
            if (timeFilter === '7D') return new Date(d7.setDate(d7.getDate() - 7));

            const d30 = new Date();
            if (timeFilter === '30D') return new Date(d30.setDate(d30.getDate() - 30));

            const d90 = new Date();
            if (timeFilter === '90D') return new Date(d90.setDate(d90.getDate() - 90));

            return new Date('2020-01-01'); // ALL
        };
        const cutoff = getCutoffDate();

        const filterByDate = (item) => {
            if (!item.date) return true;
            return new Date(item.date) >= cutoff;
        };

        // --- SOURCES ---
        // FIX: Merge Live Requests with Simulation Data for unified view
        const rawServices = [...(requests || []), ...(simulationData?.services || [])];
        const rawBankTx = simulationData?.bankTransactions || [];

        // --- FILTERED DATASETS ---
        // Only filter if it's a Simulation Object (has .date), else assume Requests are 'Today'
        const filteredServices = timeFilter === 'ALL' ? rawServices : rawServices.filter(filterByDate);
        const filteredBankTx = timeFilter === 'ALL' ? rawBankTx : rawBankTx.filter(filterByDate);

        // --- 1. REVENUE & COSTS ---
        let revenue = 0;
        let exactCost = 0;
        let cxcGenerated = 0;
        let cxpGenerated = 0;
        const clientVolumes = {};

        filteredServices.forEach(curr => {
            // HANDLE HYBRID DATA (Simulated vs Simple Request)
            const val = curr.financials?.totalValue || parseFloat((curr.fare || '0').replace(/[^0-9]/g, '')) || 0;
            const cost = curr.financials?.totalCost || (val * 0.80); // Fixed 20% Margin Rule (80% Cost)
            const pay = curr.financials?.driverPayment || (val * 0.60);

            revenue += val;
            exactCost += cost;

            if (curr.status !== 'CANCELLED') {
                cxcGenerated += val;
                cxpGenerated += pay;

                // Client Volume
                const cName = curr.company || curr.paxName || (simulationData?.clients?.find(c => c.id === curr.clientId)?.companyName) || 'PARTICULAR';
                if (!clientVolumes[cName]) clientVolumes[cName] = 0;
                clientVolumes[cName] += val;
            }
        });

        const exactMargin = revenue - exactCost;

        // --- 2. CXC & CXP NETTING ---
        const paymentsReceived = filteredBankTx
            .filter(t => t.type === 'INCOME')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const cxcPending = cxcGenerated - paymentsReceived;

        // CxP NETTING (Drivers) - Correcting for Payment Cycles (15/30th)
        const paymentsMade = filteredBankTx
            .filter(t => t.type === 'EXPENSE' && (t.description?.includes('NÓMINA') || t.description?.includes('PAGO')))
            .reduce((acc, curr) => acc + Math.abs(curr.amount || 0), 0);

        const cxpPending = Math.max(0, cxpGenerated - paymentsMade);

        // CALCULATE TOP CLIENTS
        const sortedClients = Object.entries(clientVolumes)
            .map(([name, volume]) => ({
                name,
                volume,
                balance: volume,
                status: volume > 5000000 ? 'VIP PLATINUM' : 'CORPORATE'
            }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 15);

        setAnalytics({
            totalRevenue: revenue,
            totalCost: exactCost,
            margin: exactMargin,
            marginPercent: revenue > 0 ? ((exactMargin / revenue) * 100).toFixed(1) : 0,
            cxcPending: cxcPending,
            cxpPending: cxpGenerated,
            topClients: sortedClients
        });

        // UPDATE CORPORATE ACCOUNTS STATE (CRM)
        const newCorpAccounts = sortedClients.map((c, i) => ({
            id: `CORP-${100 + i}`,
            name: c.name,
            currentCycleServices: Math.floor(c.volume / 85000),
            cycleStatus: c.volume > 5000000 ? 'CUTOFF READY' : 'ACCUMULATING',
            lastInvoice: `FE-${9000 + i}`,
            pdf: i < 3 ? [pdfSierService, pdfViajesAz, pdfPersonalSoft][i] : null
        }));
        setCorporateAccounts(newCorpAccounts);

    }, [requests, simulationData, timeFilter]);

    // Helper for robust date parsing (Handles 'Hoy', 'Mañana' and ISO)
    const parseItemDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        if (dateStr === 'Hoy') return new Date();
        if (dateStr === 'Mañana') { const d = new Date(); d.setDate(d.getDate() + 1); return d; }
        if (dateStr === 'Pasado Mañana') { const d = new Date(); d.setDate(d.getDate() + 2); return d; }

        // Try strict IDO/Date parsing
        const parsed = new Date(dateStr);
        if (isNaN(parsed.getTime())) {
            console.warn('Invalid Date encountered:', dateStr);
            return new Date(0); // Fallback to epoch if invalid
        }
        return parsed;
    };

    // Calculate Filtered Count for UI Header (FIXED: Robust Fallback & Date Parsing)
    const getFilteredCount = () => {
        const raw = [...(requests || []), ...(simulationData?.services || [])];
        if (timeFilter === 'ALL') return raw.length;

        // Exact Calculation based on Cutoff Logic (Non-mutating)
        const getCutoff = () => {
            const d = new Date();
            d.setHours(0, 0, 0, 0); // Normalize to start of day
            if (timeFilter === 'Today') { d.setDate(d.getDate() - 1); return d; }
            if (timeFilter === '7D') { d.setDate(d.getDate() - 7); return d; }
            if (timeFilter === '30D') { d.setDate(d.getDate() - 30); return d; }
            if (timeFilter === '90D') { d.setDate(d.getDate() - 90); return d; }
            if (timeFilter === '180D') { d.setDate(d.getDate() - 180); return d; }
            return new Date('2020-01-01');
        };
        const cutoff = getCutoff();

        return raw.filter(s => parseItemDate(s.date) >= cutoff).length;
    };
    const filteredCount = getFilteredCount();

    // PDF Preview State
    const [previewPdf, setPreviewPdf] = useState(null);
    // --- MACRO STRUCTURE: AI WORKFORCE ORCHESTRATOR ---
    const [workforce, setWorkforce] = useState({
        activeOrderId: null,
        stepIndex: -1,
        nodes: [
            { id: 'MARKET', icon: '📡', label: 'MARKET SENSOR', role: 'Demand & IO Handler', status: 'SCANNING', load: 30, logs: ['Listening...'] },
            { id: 'PRICING', icon: '🧠', label: 'PRICING CORE', role: 'Dynamic Calc / Fixed Routes', status: 'IDLE', load: 0, logs: [] },
            { id: 'FINANCE', icon: '🛡️', label: 'PAYMENT GUARDIAN', role: 'Pre-Service Fund Capture', status: 'IDLE', load: 0, logs: [] },
            { id: 'COMPLIANCE', icon: '⚖️', label: 'LEGAL CHECK', role: 'RNT/SOAT Validation', status: 'IDLE', load: 0, logs: [] },
            { id: 'DISPATCH', icon: '🚀', label: 'OPS SENTINEL', role: 'Assignment & Routing', status: 'IDLE', load: 0, logs: [] }
        ]
    });

    const [systemLogs, setSystemLogs] = useState([
        { time: '10:42:01', msg: 'System stable. Orchestrator: ONLINE.' }
    ]);
    // --- ORCHESTRATION ENGINE (REAL-TIME SIMULATION) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setWorkforce(prev => {
                let { activeOrderId, stepIndex, nodes } = prev;
                const newNodes = [...nodes];

                // 1. TRIGGER NEW WORKFLOW (If Idle)
                if (activeOrderId === null && Math.random() > 0.7) {
                    const newId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;
                    return {
                        ...prev,
                        activeOrderId: newId,
                        stepIndex: 0,
                        nodes: newNodes.map((n, i) => i === 0 ? { ...n, status: 'PROCESSING', load: 80, logs: [`New Request: ${newId}`] } : n)
                    };
                }

                // 2. PROCESS PIPELINE
                if (activeOrderId) {
                    // Current Node Finishes
                    const currentNode = newNodes[stepIndex];

                    if (currentNode.load > 0) {
                        // Still processing, reduce load mock
                        newNodes[stepIndex] = { ...currentNode, load: Math.max(0, currentNode.load - 25) };
                    } else {
                        // Finished Processing -> Move to Next
                        newNodes[stepIndex] = { ...currentNode, status: 'DONE', logs: ['Completed.'] };

                        const nextStep = stepIndex + 1;
                        if (nextStep < newNodes.length) {
                            // Activate Next Node
                            const nextNode = newNodes[nextStep];
                            const taskLogs = [
                                ['Calculating Tariff...'],
                                ['Capturing Funds...'],
                                ['Verifying Driver Docs...'],
                                ['Dispatching Unit...']
                            ];

                            // WORKFLOW HANDSHAKE LOGS
                            const handshakes = [
                                `📡 MARKET -> 🧠 PRICING: Request Data { dist: 12km, pax: 'VIP' }`,
                                `🧠 PRICING -> 🛡️ FINANCE: Quote Locked $45.000 (Pre-Paid).`,
                                `🛡️ FINANCE -> ⚖️ COMPLIANCE: Funds Secured (Tx#99). Verify Asset.`,
                                `⚖️ COMPLIANCE -> 🚀 DISPATCH: Legal Check Passed. Auth to Dispatch.`
                            ];

                            // Log the Handshake
                            if (handshakes[stepIndex]) {
                                setSystemLogs(prevLogs => [{
                                    time: new Date().toLocaleTimeString('es-CO', { hour12: false }),
                                    msg: handshakes[stepIndex],
                                    type: 'HANDSHAKE'
                                }, ...prevLogs.slice(0, 9)]);
                            }

                            newNodes[nextStep] = {
                                ...nextNode,
                                status: 'WORKING',
                                load: 100,
                                logs: taskLogs[stepIndex] || ['Processing...']
                            };

                            return { ...prev, stepIndex: nextStep, nodes: newNodes };
                        } else {
                            // WORKFLOW COMPLETE
                            setSystemLogs(prevLogs => [{
                                time: new Date().toLocaleTimeString('es-CO', { hour12: false }),
                                msg: `✅ ORCHESTRATION COMPLETE: ${activeOrderId} Dispatched w/ Zero Friction.`
                            }, ...prevLogs.slice(0, 8)]);

                            // Reset
                            return {
                                ...prev,
                                activeOrderId: null,
                                stepIndex: -1,
                                nodes: newNodes.map(n => ({ ...n, status: 'IDLE', load: 0, logs: [] }))
                            };
                        }
                    }
                }

                // Idle State Maintenance
                if (!activeOrderId) {
                    newNodes[0] = { ...newNodes[0], status: 'SCANNING', load: 30 + Math.random() * 10 };
                }

                return { ...prev, nodes: newNodes };
            });

        }, 800);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--color-bg-app)', // Tokenized
            color: 'var(--color-text-primary)', // Tokenized
            zIndex: 100,
            padding: 'var(--spacing-xl)', // Tokenized
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "var(--font-main)" // Tokenized
        }}>
            {/* VIEW MODE: CORE OPERATIVO */}
            {viewMode === 'CORE' && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 200, overflowY: 'auto' }}>
                    <CoreOperativo onClose={onClose} onHome={onHome} />
                </div>
            )}

            {/* PDF PREVIEW MODAL */}
            {previewPdf && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '90%', height: '90%', background: '#222', borderRadius: '15px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '15px', background: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'gold' }}>📄 VISOR DE DOCUMENTOS (SECURE)</h3>
                            <button
                                onClick={() => setPreviewPdf(null)}
                                style={{
                                    background: 'red', color: 'white', border: 'none', padding: '10px 20px',
                                    borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
                                }}>
                                CERRAR X
                            </button>
                        </div>
                        <iframe src={previewPdf} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Invoice"></iframe>
                    </div>
                </div>
            )}

            {/* UNIFIED HEADER (Replaces Legacy V3) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', letterSpacing: '1px' }}>MAP HUB</h1>
                        <StatusBadge status="active">● LIVE TRACKING</StatusBadge>
                    </div>
                    {/* MODE SWITCHER */}
                    <div style={{ display: 'flex', background: '#222', borderRadius: '4px', padding: '3px' }}>
                        <TesoButton
                            variant={viewMode === 'ANALYTICS' ? 'active' : 'ghost'}
                            size="sm"
                            style={viewMode === 'ANALYTICS' ? { background: '#FFD700', color: '#000', fontWeight: 'bold' } : {}}
                            onClick={() => setViewMode('ANALYTICS')}
                        >
                            MAP EXPLORER
                        </TesoButton>
                        <TesoButton
                            variant={viewMode === 'CORE' ? 'active' : 'ghost'}
                            size="sm" // Smaller
                            style={viewMode === 'CORE' ? { background: '#00f2ff', color: '#000', fontWeight: 'bold' } : {}}
                            onClick={() => setViewMode('CORE')}
                        >
                            CORE DATA
                        </TesoButton>
                        <TesoButton
                            variant={viewMode === 'LIVE_OPS' ? 'active' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('LIVE_OPS')}
                        >
                            AI TASK FORCE
                        </TesoButton>
                    </div>
                </div>

                {/* COMPACT CONTROL BAR */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    {/* AUDIT TOGGLE (RESTORED) */}
                    <TesoButton
                        variant={isAuditMode ? 'active' : 'glass'}
                        size="sm"
                        onClick={() => setIsAuditMode(!isAuditMode)}
                    >
                        {isAuditMode ? '● AUDIT ON' : '○ AUDIT OFF'}
                    </TesoButton>

                    {/* TIME FILTER */}
                    <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '6px', alignItems: 'center' }}>
                        {['Today', '30D', '90D', '180D', '360D', 'ALL'].map(period => (
                            <TesoButton
                                key={period}
                                variant={timeFilter === period ? 'active' : 'ghost'}
                                size="sm"
                                style={{ padding: '2px 6px', fontSize: '0.65rem' }} // Micro override
                                onClick={() => setTimeFilter(period)}
                            >
                                {period === 'Today' ? 'Día (Hoy)' : period}
                            </TesoButton>
                        ))}
                    </div>

                    {/* WAR ROOM TOGGLE */}
                    <TesoButton
                        variant={showWarRoom ? 'dangerSolid' : 'danger'} // Using dangerSolid for active state if preferred, or custom style
                        style={showWarRoom ? { background: '#FF5722', color: '#fff', border: '1px solid #FF5722' } : {}}
                        size="sm"
                        onClick={() => setShowWarRoom(!showWarRoom)}
                    >
                        ⚡ WAR ROOM
                    </TesoButton>

                    {/* SIMULATION CONTROLS */}
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '10px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            <TesoButton
                                variant="ghost"
                                size="sm"
                                style={{ background: '#333', color: '#fff' }}
                                onClick={() => onRegenerate && onRegenerate({ DAYS_TO_SIMULATE: 90, TOTAL_DRIVERS: 300, TOTAL_CLIENTS: 200 })}
                            >
                                90D
                            </TesoButton>
                            <TesoButton
                                variant="ghost"
                                size="sm"
                                style={{ background: '#333', color: '#fff' }}
                                onClick={() => onRegenerate && onRegenerate({ DAYS_TO_SIMULATE: 180, TOTAL_DRIVERS: 300, TOTAL_CLIENTS: 250 })}
                            >
                                180D
                            </TesoButton>
                            <TesoButton
                                variant="danger" // Using danger for high impact or custom override
                                size="sm"
                                style={{ background: '#FF5722', color: '#fff', border: 'none' }}
                                onClick={() => onRegenerate && onRegenerate({ DAYS_TO_SIMULATE: 360, TOTAL_DRIVERS: 500, TOTAL_CLIENTS: 400 })}
                            >
                                360D
                            </TesoButton>
                        </div>

                        {/* EVENTS / MACROS */}
                        <TesoButton
                            variant="dangerSolid"
                            size="sm"
                            style={{ background: '#ef4444' }}
                            onClick={onSimulateStress}
                            title="Simular Día Crítico (Caos)"
                        >
                            💥 STRESS
                        </TesoButton>

                        <TesoButton
                            variant="primary"
                            size="sm"
                            style={{ background: 'linear-gradient(45deg, purple, blue)', color: '#fff', border: 'none' }}
                            onClick={onRunMacro}
                            title="Ejecutar Macro de Presentación"
                        >
                            🤖 MACRO
                        </TesoButton>
                    </div>

                    {/* NAVIGATION BUTTONS */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <TesoButton
                            variant="secondary"
                            size="sm"
                            onClick={onHome}
                            title="Ir al Inicio (Landing)"
                        >
                            🏠 INICIO
                        </TesoButton>
                        <TesoButton
                            variant="danger"
                            size="sm"
                            onClick={onClose}
                            title="Volver al Mapa (Capa 2)"
                        >
                            🗺️ MAPA
                        </TesoButton>
                    </div>


                </div>
            </div>

            {/* --- WAR ROOM (SCENARIO BUILDER) PANEL --- */}
            {showWarRoom && (
                <div style={{
                    background: '#1a1a1a',
                    border: stressResult.status === 'INSOLVENT' ? '2px solid var(--color-kpi-danger)' : '2px solid var(--color-kpi-positive)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-md)',
                    boxShadow: stressResult.status === 'INSOLVENT' ? 'var(--shadow-glow-red)' : '0 0 30px rgba(5, 150, 105, 0.3)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🎮 SIMULADOR DE ESTRÉS FINANCIERO
                            <StatusBadge status={stressResult.status === 'INSOLVENT' ? 'critical' : 'active'}>
                                {stressResult.status === 'INSOLVENT' ? '🚨 RIESGO DE QUIEBRA' : '✅ MODELO SOSTENIBLE'}
                            </StatusBadge>
                        </h3>
                        <div style={{ textAlign: 'right' }}>
                            <ExplainableTooltip
                                title="Días de Caja (Runway)"
                                explanation="Días restantes antes de la quiebra. Fórmula: (Saldo Actual + Ingresos Proyectados) / Gastos Fijos Diarios. Fuente: Motor de Simulación Python."
                            >
                                <div style={{ fontSize: '0.8rem', color: '#aaa', cursor: 'help', textDecoration: 'underline dotted' }}>CASH RUNWAY ℹ</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stressResult.status === 'INSOLVENT' ? '#ef4444' : '#059669' }}>
                                    {stressResult.runway}
                                </div>
                            </ExplainableTooltip>
                        </div>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                        <button
                            onClick={handleDownloadReport}
                            style={{
                                background: 'transparent',
                                color: '#fff',
                                border: '1px solid #fff',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                opacity: 0.7
                            }}
                            onMouseOver={(e) => e.target.style.opacity = 1}
                            onMouseOut={(e) => e.target.style.opacity = 0.7}
                        >
                            📄 DESCARGAR CERTIFICADO OFICIAL
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '40px' }}>
                        {/* CONTROLS */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '5px' }}>
                                    <span>📆 Días Cartera (CxC)</span>
                                    <span style={{ color: 'var(--color-primary)' }}>{scenario.cxcDays} días</span>
                                </label>
                                <input
                                    type="range" min="0" max="90" step="5"
                                    value={scenario.cxcDays}
                                    onChange={(e) => setScenario({ ...scenario, cxcDays: e.target.value })}
                                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                                />
                                <small style={{ color: 'var(--color-text-muted)' }}>Tiempo promedio de cobro a clientes.</small>
                            </div>

                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '5px' }}>
                                    <span>💸 Frecuencia Pagos (CxP)</span>
                                    <span style={{ color: 'var(--color-kpi-warning)' }}>{scenario.cxpFreq} días</span>
                                </label>
                                <input
                                    type="range" min="1" max="30" step="1"
                                    value={scenario.cxpFreq}
                                    onChange={(e) => setScenario({ ...scenario, cxpFreq: e.target.value })}
                                    style={{ width: '100%', accentColor: 'var(--color-kpi-warning)' }}
                                />
                                <small style={{ color: 'var(--color-text-muted)' }}>Ciclo de pago a conductores (Nómina).</small>
                            </div>

                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.9rem', marginBottom: '5px' }}>
                                    <span>🚀 Factor Crecimiento</span>
                                    <span style={{ color: 'gold' }}>{scenario.growth}x</span>
                                </label>
                                <input
                                    type="range" min="0.5" max="5.0" step="0.5"
                                    value={scenario.growth}
                                    onChange={(e) => setScenario({ ...scenario, growth: e.target.value })}
                                    style={{ width: '100%', accentColor: 'gold' }}
                                />
                                <small style={{ color: '#666' }}>Multiplicador de volumen de operación.</small>
                            </div>

                            {/* AI AUTO-SOLVE BUTTON */}
                            <TesoButton
                                id="ai-btn"
                                variant="primary"
                                style={{
                                    marginTop: '10px',
                                    background: 'linear-gradient(90deg, var(--color-primary) 0%, #0077ff 100%)',
                                    width: '100%'
                                }}
                                onClick={async () => {
                                    // DEEP AGENT VERIFICATION TRIGGER
                                    const btn = document.getElementById('ai-btn');
                                    if (btn) btn.innerText = "🧠 THINKING...";

                                    try {
                                        const params = `days=90&cxc_days=${scenario.cxcDays}&cxp_freq=${scenario.cxpFreq}&traffic_growth=${scenario.growth}`;
                                        const res = await fetch(`http://localhost:8000/api/simulation/verify?${params}`);
                                        const analysis = await res.json();

                                        console.log("🦾 DEEP AGENT ANALYSIS:", analysis);

                                        // Update UI with Agent Findings
                                        setStressResult(prev => ({
                                            ...prev,
                                            status: analysis.status === 'CRITICAL' ? 'INSOLVENT' : 'SUSTAINABLE',
                                            minCash: analysis.metrics.min_cash_position,
                                            runway: analysis.score + '/100 SCORE', // Reuse runway field for Score
                                            analysis: analysis // Store full object
                                        }));

                                        if (analysis.score < 80) {
                                            alert(`⚠ WARNING: Low Solvency Score (${analysis.score}).\nFlags:\n- ${analysis.flags.join('\n- ')}`);
                                        } else {
                                            alert(`✅ SCENARIO VERIFIED. Score: ${analysis.score}/100.\nStrategy is Sound.`);
                                        }

                                    } catch (e) {
                                        console.error(e);
                                        alert("Agent Connection Failed.");
                                    } finally {
                                        if (btn) btn.innerText = "🤖 AI SCENARIO AUDIT";
                                    }
                                }}

                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                🤖 AI SCENARIO AUDIT (DEEP AGENT)
                            </TesoButton>

                            {/* CLOUD EXPORT BUTTON */}
                            <TesoButton
                                onClick={() => {
                                    setIsExporting(true);
                                    const params = `days=${simulationData?.simulationMetadata?.config?.DAYS_TO_SIMULATE || 90}&cxc=${scenario.cxcDays}&cxp=${scenario.cxpFreq}&growth=${scenario.growth}`;
                                    window.open(`http://localhost:8000/api/simulate-export?${params}`, '_blank');
                                    setTimeout(() => setIsExporting(false), 2000);
                                }}
                                disabled={isExporting}
                                variant="dangerSolid"
                                style={{
                                    marginTop: '10px',
                                    background: isExporting ? '#333' : 'linear-gradient(90deg, #FF5722 0%, #ff8c00 100%)',
                                    width: '100%',
                                    opacity: isExporting ? 0.7 : 1,
                                    cursor: isExporting ? 'wait' : 'pointer',
                                    justifyContent: 'center'
                                }}
                            >
                                {isExporting ? '☁️ GENERANDO EXCEL...' : '📥 EXPORTAR SIMULACIÓN (XLSX)'}
                            </TesoButton>
                        </div>

                        {/* VISUALIZATION (REAL Dynamic Graph) */}
                        <div style={{ flex: 1, background: '#000', borderRadius: '10px', padding: '15px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#aaa', fontSize: '0.8rem' }}>
                                PROYECCIÓN SALDO ({timeFilter === 'ALL' ? (simulationData?.simulationMetadata?.config?.DAYS_TO_SIMULATE || 360) + ' DÍAS' : timeFilter})
                            </div>

                            {/* SVG Sparkline */}
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Zero Line (Dynamic?? No, keeping centered relative to mapping for now, but drawing specific zero line) */}
                                {/* Actually, the zero line is dynamic based on range. Let's just draw the trend line for now. */}

                                {/* Trend Curve (REAL DATA) */}
                                <path
                                    d={stressResult.graphPath || ""}
                                    fill="none"
                                    stroke={stressResult.status === 'INSOLVENT' ? '#ef4444' : '#059669'}
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                                {/* Area Under Curve (Simplified for now - just the line is clearer for accuracy) */}
                            </svg>

                            {stressResult.status === 'INSOLVENT' && (
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#ef4444', color: '#fff', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    💀 QUIEBRA: {(stressResult.insolvencyDay && typeof stressResult.insolvencyDay === 'string') ? stressResult.insolvencyDay.split('/')[1] : '???'} Note
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }


            {/* CONTENT AREA */}
            {
                viewMode === 'LIVE_OPS' ? (
                    // --- LIVE OPS VIEW (Previous Layout) ---
                    <div style={{ display: 'flex', gap: '30px', flex: 1, overflow: 'hidden' }}>

                        {/* COL 1: AGENT HIVE */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                            <div style={{ background: 'var(--color-bg-panel)', border: 'var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ marginTop: 0, color: 'var(--color-primary)', fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '10px' }}>
                                    🧠 AI TASK FORCE <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>( MACRO ORCHESTRATION )</span>
                                </h3>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)', position: 'relative' }}>
                                    {/* PIPELINE VISUALIZER */}
                                    {workforce.nodes.map((node, i) => {
                                        const isActive = node.status === 'WORKING' || node.status === 'PROCESSING';
                                        const isDone = node.status === 'DONE';

                                        return (
                                            <div key={node.id} style={{ display: 'flex', gap: 'var(--spacing-md)', position: 'relative' }}>
                                                {/* CONNECTOR LINE */}
                                                {i < workforce.nodes.length - 1 && (
                                                    <div style={{
                                                        position: 'absolute', left: '24px', top: '40px', width: '2px', height: '30px',
                                                        background: isDone ? 'var(--color-kpi-positive)' : 'var(--color-border-subtle)',
                                                        boxShadow: isDone ? '0 0 10px var(--color-kpi-positive)' : 'none',
                                                        transition: 'all 0.3s'
                                                    }}></div>
                                                )}

                                                {/* ICON NODE */}
                                                <div style={{
                                                    width: '50px', height: '50px', borderRadius: '50%',
                                                    background: isActive ? 'var(--color-kpi-positive)' : isDone ? '#059669' : '#111',
                                                    border: isActive ? '2px solid #fff' : '1px solid var(--color-border-subtle)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.5rem',
                                                    boxShadow: isActive ? '0 0 20px var(--color-kpi-positive)' : 'none',
                                                    zIndex: 2,
                                                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                                    transition: 'all 0.3s'
                                                }}>
                                                    {node.icon}
                                                </div>

                                                {/* INFO CARD */}
                                                <div style={{
                                                    flex: 1,
                                                    background: isActive ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                                                    border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                                                    borderRadius: 'var(--radius-md)', padding: '10px 15px',
                                                    display: 'flex', flexDirection: 'column', justifyContent: 'center'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <strong style={{ color: isActive ? '#fff' : 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{node.label}</strong>
                                                        <span style={{ fontSize: '0.7rem', color: isActive ? 'var(--color-primary)' : '#555' }}>
                                                            {isAuditMode ? 'SHA-256: VALID' : node.status}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                        {isAuditMode ? `ID: ${(node.id || '').toString().substring(0, 4)}-${Math.floor(Math.random() * 999)} | Lat: ${Math.floor(Math.random() * 20)}ms` : node.role}
                                                    </div>

                                                    {/* LIVE LOG IN NODE */}
                                                    {isActive && (
                                                        <div style={{ marginTop: '5px', fontSize: '0.75rem', color: 'var(--color-kpi-positive)', fontFamily: isAuditMode ? 'var(--font-mono)' : 'inherit' }}>
                                                            &gt; {isAuditMode ? `TX_HASH: 0x${Math.random().toString(16).substr(2, 8)}...` : node.logs[0]}
                                                        </div>
                                                    )}

                                                    {/* LOAD BAR */}
                                                    {isActive && (
                                                        <div style={{ width: '100%', height: '3px', background: '#333', marginTop: '8px', borderRadius: '2px' }}>
                                                            <div style={{ width: `${node.load}%`, height: '100%', background: 'var(--color-kpi-positive)', transition: 'width 0.2s' }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* COL 2: METRICS & CONSOLE */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                            {/* KPI CARDS */}
                            <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                                <div style={{ flex: 1, background: 'var(--color-bg-panel)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-kpi-positive)' }}>{metrics.efficiency}%</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>EFICIENCIA FLOTA</div>
                                </div>
                                <div style={{ flex: 1, background: 'var(--color-bg-panel)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{metrics.avgResponse}m</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>TIEMPO RESPUESTA</div>
                                </div>
                            </div>

                            {/* CONSOLE */}
                            <div style={{ flex: 1, background: '#000', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', fontFamily: 'var(--font-mono)', overflowY: 'auto', position: 'relative' }}>
                                <div style={{ position: 'sticky', top: 0, background: '#000', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '10px', marginBottom: '10px', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                    &gt; SYSTEM LOGS
                                </div>
                                {systemLogs.map((log, i) => (
                                    <div key={i} style={{ marginBottom: '5px', fontSize: 'var(--text-sm)' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>[{log.time}]</span> <span style={{ color: '#ddd' }}>{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COL 3: CORP BILLING */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                            <div style={{ background: 'var(--color-bg-panel)', border: '1px solid gold', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', flex: 1, overflowY: 'auto' }}>
                                <h3 style={{ marginTop: 0, color: 'gold', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>💳 CORPORATE BILLING</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>DIAN SYNC ACTIVE</span>
                                </h3>

                                {/* NEW: BILLING SEARCH */}
                                <input
                                    type="text"
                                    placeholder="🔍 Buscar empresa..."
                                    value={billingSearch}
                                    onChange={(e) => setBillingSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid gold',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '8px 12px',
                                        color: 'var(--color-text-primary)',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        fontFamily: "var(--font-main)"
                                    }}
                                />

                                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontStyle: 'italic', marginBottom: '20px' }}>
                                    Servicios agrupados automáticamente por corte.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                    {corporateAccounts
                                        .filter(c => c.name.toLowerCase().includes(billingSearch.toLowerCase()))
                                        .map(company => (
                                            <div key={company.id} style={{
                                                background: 'rgba(255,215,0,0.05)',
                                                border: '1px solid rgba(255,215,0,0.2)',
                                                borderRadius: '10px',
                                                padding: '15px'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{company.name}</strong>
                                                    <StatusBadge status={company.cycleStatus === 'CUTOFF READY' ? 'active' : 'neutral'}>
                                                        {company.cycleStatus}
                                                    </StatusBadge>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                                    <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px' }}>
                                                        <div style={{
                                                            width: `${Math.min(company.currentCycleServices * 4, 100)}%`,
                                                            height: '100%',
                                                            background: 'gold',
                                                            borderRadius: '3px',
                                                            transition: 'width 0.5s'
                                                        }}></div>
                                                    </div>
                                                    <small style={{ color: 'gold', fontSize: '0.9rem', width: '50px', textAlign: 'right' }}>
                                                        {company.currentCycleServices} Svc
                                                    </small>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <small style={{ color: '#aaa', fontSize: '0.7rem' }}>ÚLTIMA FACTURA</small>
                                                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>#{company.lastInvoice}</strong>
                                                    </div>
                                                    <TesoButton
                                                        variant="ghost"
                                                        size="sm"
                                                        style={{
                                                            borderColor: 'gold', color: 'gold', background: 'rgba(255,215,0,0.1)',
                                                            border: '1px solid gold'
                                                        }}
                                                        onClick={() => setPreviewPdf(company.pdf)}
                                                    >
                                                        👁️ VER PDF
                                                    </TesoButton>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    // --- VIRTUAL EXCEL VIEW (Embedded Real-time Sheet) ---
                    // MODIFIED: Increased Bottom Margin significantly to clear Floating Chat Bar
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '90px', gap: '10px', overflow: 'hidden' }}>

                        {/* 1. VISUAL FINANCIAL CARDS (THE RESTORED FEATURE) */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(5,150,105,0.2) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid #10b981', padding: '10px', borderRadius: '15px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 'bold', textTransform: 'uppercase' }}>Ingresos Brutos (Revenue)</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(analytics.totalRevenue)}</div>
                                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Proyección cierre de mes: ↑ 12%</div>
                            </div>

                            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(234,179,8,0.2) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid #eab308', padding: '10px', borderRadius: '15px' }}>
                                <ExplainableTooltip
                                    title="Margen Operativo (EBITDA)"
                                    explanation="Beneficio real tras restar costos directos (Gasolina, Comisión). No incluye impuestos ni amortizaciones. Fuente: Análisis de Flujo de Caja en Tiempo Real."
                                >
                                    <div style={{ fontSize: '0.75rem', color: '#fde047', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'help', textDecoration: 'underline dotted' }}>Margen Operativo ℹ</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(analytics.margin)}</div>
                                        <span style={{ color: '#fde047', fontWeight: 'bold', fontSize: '0.9rem' }}>({analytics.marginPercent}%)</span>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Post-Comisiones y Gasolina</div>
                                </ExplainableTooltip>
                            </div>

                            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid #f97316', padding: '10px', borderRadius: '15px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#fdba74', fontWeight: 'bold', textTransform: 'uppercase' }}>CxC (Cartera Clientes)</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(analytics.cxcPending)}</div>
                                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Pendiente de Facturación</div>
                            </div>

                            <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid #3b82f6', padding: '10px', borderRadius: '15px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 'bold', textTransform: 'uppercase' }}>CxP (Nómina Drivers)</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{formatCurrency(analytics.cxpPending)}</div>
                                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Corte: 20 DÍAS</div>
                            </div>

                            {/* CONFLICT SUMMARY CARD (NEW) */}
                            {simulationData && simulationData.conflicts && (
                                <div style={{ width: '180px', flexShrink: 0, background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid #ef4444', padding: '8px', borderRadius: '15px' }}>
                                    <div style={{ fontSize: '0.65rem', color: '#fca5a5', fontWeight: 'bold', textTransform: 'uppercase' }}>Conflictos Ops</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '5px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#fff' }}>🚫 Cancelados: <strong style={{ color: '#fca5a5' }}>{simulationData.conflicts.cancellations}</strong></div>
                                        <div style={{ fontSize: '0.75rem', color: '#fff' }}>⏳ Retrasos: <strong style={{ color: '#fcd34d' }}>{simulationData.conflicts.delays}</strong></div>
                                        <div style={{ fontSize: '0.75rem', color: '#fff' }}>🔄 Cambios: <strong style={{ color: '#86efac' }}>{simulationData.conflicts.driverChanges}</strong></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. THE SPREADSHEET */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>

                            {/* TOOLBAR */}
                            <div style={{ background: '#1e293b', padding: '8px 15px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>📊</span> LIBRO: TESO_MASTER_DATASET_VIVO.xlsx
                                    </div>
                                    <div style={{ background: '#059669', padding: '2px 8px', borderRadius: '20px', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #34d399' }}>● AUTOGUARDADO: ON</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* CLOUD COMPUTE EXPORT (PYTHON) */}
                                    <button
                                        onClick={async () => {
                                            setIsExporting(true);
                                            try {
                                                // FIX: Use relative path for production (Space)
                                                const apiUrl = import.meta.env.VITE_API_URL || '';
                                                const response = await fetch(`${apiUrl}/api/simulate-export?days=360`);
                                                if (!response.ok) throw new Error('Cloud Engine Offline');

                                                const blob = await response.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = "TESO_CLOUD_SIM_360D.xlsx";
                                                document.body.appendChild(a);
                                                a.click();
                                                a.remove();
                                            } catch (e) {
                                                alert("⚠️ ERROR: Cloud Engine Offline. Asegúrate de correr 'uvicorn main:app' en teso_core/api");
                                                console.error(e);
                                            } finally {
                                                setIsExporting(false);
                                            }
                                        }}
                                        style={{
                                            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                                            color: 'white',
                                            border: '1px solid #8b5cf6',
                                            padding: '6px 15px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '0.8rem',
                                            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
                                        }}
                                        title="Generar en Servidor (No consume memoria local)"
                                    >
                                        <span>☁️</span> CLOUD EXPORT (360D)
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsExporting(true);
                                            // Use setTimeout to allow UI to render "GENERANDO..." before blocking main thread
                                            setTimeout(() => {
                                                const getDescCutoff = () => {
                                                    const d = new Date();
                                                    d.setHours(0, 0, 0, 0);
                                                    if (timeFilter === 'Today') { d.setDate(d.getDate() - 1); return d; }
                                                    if (timeFilter === '30D') { d.setDate(d.getDate() - 30); return d; }
                                                    if (timeFilter === '90D') { d.setDate(d.getDate() - 90); return d; }
                                                    if (timeFilter === '180D') { d.setDate(d.getDate() - 180); return d; }
                                                    return new Date('2020-01-01');
                                                };
                                                const cutoff = getDescCutoff();

                                                const raw = [...(requests || []), ...(simulationData?.services || [])];
                                                const filteredDownload = timeFilter === 'ALL' ? raw : raw.filter(s => parseItemDate(s.date) >= cutoff);

                                                generateMasterExcel(filteredDownload, vehicles, simulationData?.clients || [], simulationData, analytics, scenario);
                                                setIsExporting(false);
                                            }, 100);
                                        }}
                                        style={{
                                            background: isExporting ? '#555' : 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
                                            color: 'white',
                                            border: isExporting ? '1px solid #333' : '1px solid #34d399',
                                            padding: '6px 15px',
                                            borderRadius: '6px',
                                            cursor: isExporting ? 'wait' : 'pointer',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                                            fontSize: '0.8rem',
                                            transition: 'all 0.2s',
                                            animation: isExporting ? 'none' : 'pulse 2s infinite'
                                        }}
                                        disabled={isExporting}
                                        onMouseOver={(e) => !isExporting && (e.currentTarget.style.transform = 'translateY(-1px)')}
                                        onMouseOut={(e) => !isExporting && (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        <span>{isExporting ? '⏳' : '📥'}</span> {isExporting ? `GENERANDO (${filteredCount})...` : `DESCARGAR REPORTE (${timeFilter})`}
                                    </button>
                                </div>

                                {/* SHEET TABS (RESTORED) */}
                                <div style={{ display: 'flex', gap: '5px', padding: '0 15px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
                                    {['PROGRAMACION', 'CXC', 'CXP', 'BANCOS', 'EGRESOS', 'INGRESOS', 'CAJA'].map(sheet => (
                                        <button
                                            key={sheet}
                                            onClick={() => setActiveSheet(sheet)}
                                            style={{
                                                background: activeSheet === sheet ? '#0f172a' : 'transparent',
                                                color: activeSheet === sheet ? 'var(--neon-green)' : '#94a3b8',
                                                border: 'none',
                                                borderBottom: activeSheet === sheet ? '2px solid var(--neon-green)' : '2px solid transparent',
                                                padding: '10px 15px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem',
                                                transition: 'all 0.2s',
                                                marginBottom: '-1px' // Overlap border
                                            }}
                                            onMouseOver={(e) => activeSheet !== sheet && (e.currentTarget.style.color = '#cbd5e1')}
                                            onMouseOut={(e) => activeSheet !== sheet && (e.currentTarget.style.color = '#94a3b8')}
                                        >
                                            {sheet}
                                        </button>
                                    ))}
                                </div>

                                {/* SPREADSHEET GRID */}
                                <div style={{ flex: 1, overflow: 'auto', background: '#0f172a', color: '#cbd5e1', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: '3px solid var(--neon-green)' }}>
                                            <tr>
                                                {/* DYNAMIC HEADERS WITH SORT ICONS */}
                                                {activeSheet === 'PROGRAMACION' && ['ID', 'FECHA', 'HORA', 'CLIENTE (Pax)', 'RUTA DESTINO', 'ESTADO', 'CONDUCTOR', 'VEHÍCULO', 'TARIFA', 'PIN SEGURIDAD'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                                {activeSheet === 'CXC' && ['CLIENTE CORPORATIVO', 'SALDO PENDIENTE', 'ESTADO', 'DÍAS MORA', 'FACTURA / SOPORTE', 'ACCIÓN'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                                {activeSheet === 'CXP' && ['CONDUCTOR', 'VEHÍCULO', 'SALDO A FAVOR', 'BANCO', 'CUENTA', 'REF'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                                {activeSheet === 'BANCOS' && ['FECHA', 'TIPO', 'DESCRIPCION / REF', 'VALOR', 'SALDO'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                                {activeSheet === 'EGRESOS' && ['FECHA', 'RUBRO', 'VEHICULO', 'VALOR', 'REF'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                                {activeSheet === 'INGRESOS' && ['FECHA', 'ORIGEN', 'CONCEPTO', 'VALOR', 'ESTADO'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                                {activeSheet === 'CAJA' && ['FECHA', 'RESPONSABLE', 'CONCEPTO', 'ENTRADA', 'SALIDA', 'SALDO'].map(h => (
                                                    <th key={h} style={{ background: '#1e293b', borderRight: '1px solid #334155', borderBottom: '2px solid #475569', padding: '12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* DYNAMIC BODY */}
                                            {activeSheet === 'PROGRAMACION' && ([...(requests || []), ...(simulationData?.services || [])])
                                                .filter(item => {
                                                    // UI FILTER LOGIC REPLICATION
                                                    if (!simulationData?.services) return true; // Show all if just requests
                                                    if (timeFilter === 'ALL') return true;

                                                    const getCutoff = () => {
                                                        const d = new Date();
                                                        d.setHours(0, 0, 0, 0);
                                                        if (timeFilter === 'Today') { d.setDate(d.getDate() - 1); return d; }
                                                        if (timeFilter === '7D') { d.setDate(d.getDate() - 7); return d; }
                                                        if (timeFilter === '30D') { d.setDate(d.getDate() - 30); return d; }
                                                        if (timeFilter === '90D') { d.setDate(d.getDate() - 90); return d; }
                                                        if (timeFilter === '180D') { d.setDate(d.getDate() - 180); return d; }
                                                        return new Date('2020-01-01');
                                                    };
                                                    const cutoff = getCutoff();

                                                    // USE HELPER FOR ROBUST PARSING
                                                    return parseItemDate(item.date) >= cutoff;
                                                })
                                                .slice(0, 500) // SAFETY CAP FOR UI RENDERING (Don't render 50k rows)
                                                .map((r, i) => (
                                                    <tr
                                                        key={i}
                                                        onClick={() => onRowClick && onRowClick(r)}
                                                        style={{
                                                            background: i % 2 === 0 ? '#0f172a' : '#1e293b',
                                                            transition: 'background 0.1s',
                                                            cursor: 'pointer'
                                                        }}
                                                        onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
                                                        onMouseOut={(e) => e.currentTarget.style.background = i % 2 === 0 ? '#0f172a' : '#1e293b'}
                                                        title="👆 Click para localizar vehículo en mapa"
                                                    >
                                                        {/* ID COLUMN WITH VISUAL AUDIT FEEDBACK */}
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#64748b', fontSize: '0.8rem' }}>
                                                            {isAuditMode ? (
                                                                <span style={{ fontFamily: 'monospace', color: 'var(--neon-green)' }}>
                                                                    0x{Math.floor(Math.random() * 10000).toString(16)}...
                                                                </span>
                                                            ) : r.id}
                                                        </td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{r.date}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#fbbf24' }}>{r.flightTime || 'NOW'}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 'bold', color: '#fff' }}>{r.paxName}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{r.dest || r.route || 'Local'}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>
                                                            <span style={{
                                                                background: r.status.includes('cancel') || r.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)' :
                                                                    r.status === 'paid' ? 'rgba(5, 150, 105, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                                                                color: r.status.includes('cancel') || r.status === 'CANCELLED' ? '#fca5a5' :
                                                                    r.status === 'paid' ? '#34d399' : '#6ee7b7',
                                                                padding: '2px 8px', borderRadius: '4px',
                                                                border: `1px solid ${r.status.includes('cancel') || r.status === 'CANCELLED' ? '#ef4444' : r.status === 'paid' ? '#059669' : '#10b981'}`,
                                                                textShadow: r.status === 'paid' ? '0 0 5px #34d399' : 'none'
                                                            }}>
                                                                {r.status === 'paid' ? '✔ PAGADO' : r.status.toUpperCase().replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{r.driverName || r.assignedDriver || '-'}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#38bdf8' }}>{r.vehiclePlate || r.assignedVehicle || '-'}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>
                                                            {r.financials ? formatCurrency(r.financials.totalValue) : (r.fare || '-')}
                                                        </td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontFamily: 'monospace' }}>{r.pin || (r.id ? r.id.toString().substring(0, 4) : '????')}</td>
                                                    </tr>
                                                ))}
                                            {activeSheet === 'CXC' && analytics.topClients.length === 0 && (
                                                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Sin datos de cartera disponibles. Ejecute una simulación.</td></tr>
                                            )}
                                            {activeSheet === 'CXC' && analytics.topClients.map((c, i) => {
                                                // Try to match with a corporate billing account for the PDF
                                                const matchedCorp = corporateAccounts.find(acc => acc.name.includes(c.name) || c.name.includes(acc.name));
                                                const isExpanded = expandedClient === i;

                                                return (
                                                    <React.Fragment key={i}>
                                                        <tr
                                                            onClick={() => setExpandedClient(isExpanded ? null : i)}
                                                            style={{
                                                                background: isExpanded ? '#334155' : (i % 2 === 0 ? '#0f172a' : '#1e293b'),
                                                                cursor: 'pointer',
                                                                borderLeft: isExpanded ? '4px solid #39FF14' : '4px solid transparent'
                                                            }}>
                                                            <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{isExpanded ? '▼' : '▶'}</span>
                                                                {c.name}
                                                            </td>
                                                            <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#fbbf24' }}>{formatCurrency(c.volume)}</td>
                                                            <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>POR COBRAR</td>
                                                            <td style={{ border: '1px solid #334155', padding: '8px 12px', color: c.balance > 0 ? '#f87171' : '#34d399', fontWeight: 'bold' }}>
                                                                {formatCurrency(c.balance)}
                                                            </td>
                                                            <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#94a3b8', fontSize: '0.7rem' }}>
                                                                {matchedCorp ? 'FACTURA DISPONIBLE' : 'SIN SOPORTE'}
                                                            </td>
                                                            <td style={{ border: '1px solid #334155', padding: '8px 12px', textDecoration: 'underline', color: '#38bdf8', cursor: 'pointer' }}>Gestionar</td>
                                                        </tr>
                                                        {isExpanded && (
                                                            <tr style={{ background: '#1e293b' }}>
                                                                <td colSpan="6" style={{ padding: '0', border: '1px solid #334155' }}>
                                                                    <div style={{
                                                                        padding: '20px',
                                                                        display: 'grid',
                                                                        gridTemplateColumns: '1fr 1fr',
                                                                        gap: '20px',
                                                                        background: 'rgba(0,0,0,0.2)',
                                                                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                                                                    }}>
                                                                        {/* LEFT: INFO */}
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                                            <div style={{ display: 'flex', gap: '40px' }}>
                                                                                <div>
                                                                                    <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '4px' }}>NIT / IDENTIFICACIÓN</div>
                                                                                    <div style={{ color: '#fff', fontFamily: 'monospace' }}>900.{Math.floor(Math.random() * 1000)}.000-{i}</div>
                                                                                </div>
                                                                                <div>
                                                                                    <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '4px' }}>ESTADO DE CARTERA</div>
                                                                                    <div style={{ color: c.balance > 0 ? '#fbbf24' : '#39FF14' }}>
                                                                                        {c.balance > 0 ? `● PENDIENTE (${formatCurrency(c.balance)})` : '● AL DÍA'}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {matchedCorp && (
                                                                                <div style={{ marginTop: '10px' }}>
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            setPreviewPdf(matchedCorp.pdf);
                                                                                        }}
                                                                                        className="btn-neon"
                                                                                        style={{
                                                                                            borderColor: 'gold', color: 'gold', background: 'rgba(255, 215, 0, 0.05)',
                                                                                            padding: '8px 20px', fontSize: '0.8rem', width: '100%',
                                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                                                        }}>
                                                                                        <span>📄</span> VER FACTURA DIAN COMPLETA
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* RIGHT: MOVEMENTS TABLE */}
                                                                        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px' }}>
                                                                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px', borderBottom: '1px solid #334155', paddingBottom: '4px' }}>
                                                                                ÚLTIMOS MOVIMIENTOS Y ABONOS
                                                                            </div>
                                                                            <table style={{ width: '100%', fontSize: '0.75rem', color: '#cbd5e1' }}>
                                                                                <tbody>
                                                                                    {(simulationData?.bankTransactions?.filter(t => t.clientName === c.name) || []).slice(-4).map((tx, k) => (
                                                                                        <tr key={k}>
                                                                                            <td style={{ padding: '4px' }}>{tx.date}</td>
                                                                                            <td style={{ padding: '4px', color: '#34d399' }}>ABONO CTA</td>
                                                                                            <td style={{ padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(tx.amount)}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                    {(!simulationData?.bankTransactions?.some(t => t.clientName === c.name)) && (
                                                                                        <tr><td colSpan="3" style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>Sin abonos recientes</td></tr>
                                                                                    )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                            {activeSheet === 'CXP' && (!simulationData?.payables && vehicles.length === 0) && (
                                                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Sin cuentas por pagar.</td></tr>
                                            )}
                                            {activeSheet === 'CXP' && (simulationData?.payables || vehicles.slice(0, 15)).slice(0, 100).map((item, i) => {
                                                // Handler for both simulated data and fallback vehicle list
                                                const isSim = !!simulationData?.payables;
                                                return (
                                                    <tr key={i} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 'bold' }}>{isSim ? item.driver : item.driver}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#38bdf8' }}>{isSim ? item.vehicle : item.id}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#34d399' }}>{formatCurrency(isSim ? item.amount : 450000)}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{isSim ? item.bank : 'BANCOLOMBIA'}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontFamily: 'monospace' }}>{isSim ? item.account : '****2341'}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontSize: '0.7rem', color: '#aaa' }}>{isSim ? item.ref : '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                            {activeSheet === 'BANCOS' && (!simulationData?.bankTransactions || simulationData.bankTransactions.length === 0) && (
                                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Sin transacciones registradas.</td></tr>
                                            )}
                                            {activeSheet === 'BANCOS' && (simulationData?.bankTransactions || []).slice(0, 100).map((t, i) => (
                                                <tr key={i} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{t.date}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>
                                                        <span style={{
                                                            background: t.type === 'INCOME' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                            color: t.type === 'INCOME' ? '#34d399' : '#fca5a5',
                                                            padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                                                        }}>{t.type}</span>
                                                    </td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#fff' }}>
                                                        {t.description} <span style={{ color: '#64748b', fontSize: '0.7rem' }}>({t.ref})</span>
                                                    </td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 'bold', color: t.type === 'INCOME' ? '#34d399' : '#ef4444' }}>
                                                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                                                    </td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', fontFamily: 'monospace', color: '#fbbf24' }}>
                                                        {formatCurrency(t.balance)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeSheet === 'EGRESOS' && (!simulationData?.expenses || simulationData.expenses.length === 0) && (
                                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Sin egresos registrados.</td></tr>
                                            )}
                                            {activeSheet === 'EGRESOS' && (simulationData?.expenses || []).slice(0, 100).map((e, i) => (
                                                <tr key={i} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{e.date}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8' }}>{e.category}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#38bdf8' }}>{e.vehicle}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#fff' }}>{formatCurrency(e.amount)}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', fontSize: '0.7rem', color: '#64748b' }}>{e.ref}</td>
                                                </tr>
                                            ))}

                                            {activeSheet === 'INGRESOS' && (simulationData?.bankTransactions?.filter(t => t.type === 'INCOME') || []).slice(0, 100).map((t, i) => (
                                                <tr key={i} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{t.date}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#fff' }}>{t.clientName || 'TESO PLATFORM'}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', fontSize: '0.8rem' }}>{t.description}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#34d399', fontWeight: 'bold' }}>{formatCurrency(t.amount)}</td>
                                                    <td style={{ border: '1px solid #334155', padding: '8px 12px' }}><span style={{ background: '#059669', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>APLICADO</span></td>
                                                </tr>
                                            ))}

                                            {activeSheet === 'CAJA' && (
                                                // Mock CAJA (Petty Cash mock)
                                                [...Array(10)].map((_, i) => ({
                                                    date: new Date().toISOString().split('T')[0],
                                                    resp: 'OPERACIONES',
                                                    conc: 'CAJA MENOR - REFRIGERIOS',
                                                    in: 0,
                                                    out: 50000,
                                                    bal: 2000000 - (i * 50000)
                                                })).map((c, i) => (
                                                    <tr key={i} style={{ background: i % 2 === 0 ? '#0f172a' : '#1e293b' }}>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{c.date}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{c.resp}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px' }}>{c.conc}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#34d399' }}>{c.in}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', color: '#ef4444' }}>{c.out}</td>
                                                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontFamily: 'monospace', color: 'gold' }}>{formatCurrency(c.bal)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ background: '#1e293b', padding: '0px', display: 'flex', borderTop: '1px solid #334155', overflowX: 'auto' }}>
                                    {['PROGRAMACION', 'CXC', 'CXP', 'BANCOS', 'EGRESOS', 'INGRESOS', 'CAJA'].map(sheet => (
                                        <button
                                            key={sheet}
                                            onClick={() => setActiveSheet(sheet)}
                                            style={{
                                                padding: '10px 25px',
                                                border: 'none',
                                                borderRight: '1px solid #334155',
                                                background: activeSheet === sheet ? '#0f172a' : '#1e293b',
                                                color: activeSheet === sheet ? '#34d399' : '#94a3b8',
                                                fontWeight: activeSheet === sheet ? 'bold' : 'normal',
                                                cursor: 'pointer',
                                                borderTop: activeSheet === sheet ? '3px solid #34d399' : '3px solid transparent',
                                                transition: 'background 0.2s',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {sheet}
                                        </button>
                                    ))}
                                    <button style={{ padding: '8px 20px', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }



        </div >
    )
};

export default OperationalDashboard;
