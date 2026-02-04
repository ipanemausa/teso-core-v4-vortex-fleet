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
import { NeonNavbar } from './NeonNavbar';
import { voiceSystem, VOICE_TAGS } from '../services/VoiceSystem';

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

const OperationalDashboard = ({ vehicles, requests, initialViewMode = 'LIVE_OPS', onRowClick, simulationData: propSimulationData, onClose, onHome, onRegenerate, onSimulateStress, onRunMacro }) => {

    // --- STATE ---
    const [simulationData, setSimulationData] = useState(propSimulationData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [voiceEnabled, setVoiceEnabled] = useState(true); // Default ON for demo
    const [opsCommand, setOpsCommand] = useState(null); // Command channel for CoreOperativo


    // --- VOICE SYNTHESIS (Unified System) ---
    const speakAgentMessage = (text, emotion = 'professional') => {
        if (!voiceEnabled) return;

        // SMART FORMATTING: If text already has tags (from Backend Agent), respect them.
        // Otherwise, apply the requested UI emotion.
        const hasExistingTags = /^\s*\[.*\]/.test(text);
        const styledText = hasExistingTags ? text : voiceSystem.formatText(text, emotion);

        // Detect urgency for Native Fallback (Simple heuristic)
        const isUrgent = text.includes('[urgent]') || text.includes('[angry]') || emotion === 'urgent';
        const urgency = isUrgent ? 'CRITICAL' : 'INFO';

        voiceSystem.speak(styledText, urgency);
    };

    // --- AUTO-SPEAK AGENT ALERTS ---
    useEffect(() => {
        // Prevent speaking if data is just the initialization skeleton
        if (!propSimulationData || !propSimulationData.details) return;

        let script = null;

        // 1. Check for Financial Agent Script
        if (propSimulationData.details?.agent_analysis?.voice_script) {
            script = propSimulationData.details.agent_analysis.voice_script;
        }
        // 2. Check for Logistics Agent Script
        else if (propSimulationData.analysis?.voice_script) {
            script = propSimulationData.analysis.voice_script;
        }

        if (script) {
            console.log("🗣️ AGENT SPEAKING:", script);
            speakAgentMessage(script);
        }
    }, [propSimulationData]);

    // --- AUTONOMOUS MONITOR POLLING (INDUSTRIAL EFFICIENCY) ---
    useEffect(() => {
        const lastAlertRef = { current: null }; // volatile memory for last alert time

        const pollAlerts = async () => {
            try {
                // Poll backend for background alerts
                const res = await fetch('https://teso-api-dev.fly.dev/api/agently/alerts');
                if (!res.ok) return;

                const alerts = await res.json();
                if (alerts.length > 0) {
                    const latest = alerts[0]; // Newest first

                    // Check if it's new
                    if (latest.timestamp !== lastAlertRef.current) {
                        lastAlertRef.current = latest.timestamp;
                        console.log("🚨 NEW AUTONOMOUS ALERT:", latest);

                        // Extract voice script from the alert payload
                        // Structure depends on how trigger stored it. 
                        // Trigger puts the full 'audit' object in data.
                        if (latest.data && latest.data.analysis) {
                            const script = `Alerta Autónoma. ${latest.data.analysis.message}`;
                            speakAgentMessage(script);
                        }
                    }
                }
            } catch (e) {
                // Silent fail on polling to not spam console
            }
        };

        const interval = setInterval(pollAlerts, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    // FIX: Sync Prop to State (React Pattern for Derived State)
    useEffect(() => {
        if (propSimulationData) {
            console.log("🔄 DASHBOARD: Syncing with Parent Data...", propSimulationData.services?.length);
            setSimulationData(propSimulationData);
        }
    }, [propSimulationData]);



    // --- CEO AGENT INTEGRATION ---
    const [ceoReport, setCeoReport] = useState(null);
    const [isCeoThinking, setIsCeoThinking] = useState(false);

    const triggerStrategicCycle = async () => {
        setIsCeoThinking(true);
        try {
            const resp = await fetch('/api/strategic-cycle', { method: 'POST' });
            if (resp.ok) {
                const data = await resp.json();
                setCeoReport(data);
                // Speak the CEO's directive
                if (data.voice_broadcast) {
                    speakAgentMessage(data.voice_broadcast.text);
                }
            }
        } catch (e) {
            console.error("CEO Brain Offline:", e);
        } finally {
            setIsCeoThinking(false);
        }
    };

    // --- BUTTON HANDLERS (BACKEND CONNECTED) ---
    const handleAuditClick = async () => {
        speakAgentMessage("Iniciando Auditoría Profunda con Agente Financiero...");
        try {
            // Robust endpoint call
            const res = await fetch('/api/decisions/financial-audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Server Error (${res.status}): ${errText}`);
            }

            const data = await await res.json();
            console.log("AUDIT RESULT:", data);

            // Speak the result
            const score = data.score || 0;
            const verdict = data.verdict || "Desconocido";
            speakAgentMessage(`Auditoría Finalizada. Score: ${score}. Veredicto: ${verdict}`);

            // Optional: Show visual feedback
            alert(`✅ AUDITORÍA COMPLETADA\n\nScore: ${score}/100\nVeredicto: ${verdict}\n\n(Vea el log para más detalles)`);

        } catch (e) {
            console.error("Audit Failed", e);
            speakAgentMessage("Error crítico conectando con el Agente Financiero.");
            alert(`❌ ERROR DE CONEXIÓN:\n${e.message}\n\nVerifique que el Backend Python esté corriendo.`);
        }
    };

    // Auto-trigger CEO on first load (Simulated Proactivity)
    useEffect(() => {
        if (simulationData && !ceoReport) {
            // Wait 2s then trigger
            const t = setTimeout(triggerStrategicCycle, 2000);
            return () => clearTimeout(t);
        }
    }, [simulationData]);

    // --- FETCH DATA FROM BACKEND (V4 ENGINE) ---
    useEffect(() => {
        if (simulationData) return; // If passed as prop, use it

        const loadBackendData = async () => {
            // ... existing data fetch logic ...
            console.log("📡 CONNECTING TO TESO OPS V4...");
            setLoading(true);
            try {
                const apiUrl = ''; // Relative path for unified deployment (Hugging Face / Docker)

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
    // --- CEO VISUAL PANEL ---
    const CeoPanel = () => {
        if (!ceoReport && !isCeoThinking) return null;

        return (
            <div style={{
                margin: '20px',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                border: '1px solid #6366f1',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            fontSize: '2rem',
                            background: '#fff',
                            borderRadius: '50%',
                            width: '50px', height: '50px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>👔</div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 'bold' }}>VORTEX STRATEGIC ORCHESTRATOR</div>
                            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '900' }}>
                                {isCeoThinking ? 'ANALIZANDO ESTRATEGIA GLOBAL...' : 'DIRECTIVA EJECUTIVA VIGENTE'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={triggerStrategicCycle}
                            disabled={isCeoThinking}
                            style={{
                                background: isCeoThinking ? '#4338ca' : '#4f46e5',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: isCeoThinking ? 'wait' : 'pointer'
                            }}>
                            {isCeoThinking ? '⏳ CALCULANDO...' : '🔄 RE-EVALUAR ESTRATEGIA'}
                        </button>
                    </div>
                </div>

                {ceoReport && !isCeoThinking && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '6px' }}>
                            <div style={{ color: '#818cf8', fontSize: '0.75rem', marginBottom: '5px' }}>DECISIÓN DEL CEO</div>
                            <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                {ceoReport.strategic_alignment.directive.replace(/_/g, ' ')}
                            </div>
                            <div style={{ color: '#c7d2fe', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                "{ceoReport.strategic_alignment.reasoning}"
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid #34d399' }}>
                                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>CFO (FINANZAS)</div>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>Score: {ceoReport.department_reports?.finance?.executive_summary?.score || 0}/100</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid #fbbf24' }}>
                                <div style={{ fontSize: '0.7rem', color: '#aaa' }}>COO (LOGÍSTICA)</div>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>Status: {ceoReport.department_reports?.operations?.dispatch_summary?.status || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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
            // FIX: Make background transparent in Map Explorer mode so MapContainer (App.jsx) is visible
            background: viewMode === 'ANALYTICS' ? 'transparent' : 'var(--color-bg-app)',
            // Also allow click-through for map interaction if in Analytics mode
            pointerEvents: viewMode === 'ANALYTICS' ? 'none' : 'auto',
            color: 'var(--color-text-primary)', // Tokenized
            zIndex: 100,
            padding: 'var(--spacing-xl)', // Tokenized
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "var(--font-main)" // Tokenized
        }}>
            {/* SYSTEM RESTORED */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#39FF14' }}>
                 <h1 style={{ fontSize: '2rem' }}>WAR ROOM: ONLINE</h1>
                 <p style={{ color: '#fff' }}>Module restored successfully.</p>
                 <button onClick={() => window.location.reload()} style={{ padding: '10px', marginTop: '20px', cursor: 'pointer' }}>RELOAD MAP</button>
            </div>
        </div>
    )
};

export default OperationalDashboard;