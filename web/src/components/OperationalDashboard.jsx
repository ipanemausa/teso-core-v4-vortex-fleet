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
import LiveOpsMap from './dashboard/LiveOpsMap'; // NEW IMPORT
import GeminiConsultantArtifact from './dashboard/GeminiConsultantArtifact';
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

const OperationalDashboard = ({ vehicles, requests, planes, initialViewMode = 'LIVE_OPS', onRowClick, simulationData: propSimulationData, onClose, onHome, onRegenerate, onSimulateStress, onRunMacro }) => {

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
            console.log("📡 CONNECTING TO TESO OPS V4 (MASTER DATA CLOUD)...");
            setLoading(true);
            try {
                const apiUrl = ''; // Relative path for unified deployment (Hugging Face / Docker)

                // 1. GET REAL MASTER DATA (From Python Backend)
                // Use GET /api/simulation/data which returns the Global Cache (Excel/DB data)
                const res = await fetch(`${apiUrl}/api/simulation/data`);

                if (!res.ok) throw new Error("Ops Engine Offline");
                const v4Result = await res.json();
                console.log("✅ OPS CONNECTED:", v4Result);

                let services = [];
                let bankTransactions = [];

                // 2. CHECK IF BACKEND RETURNED REAL SERVICES (Master Dataset)
                if (v4Result.services && v4Result.services.length > 0) {
                    console.log(`⚡ HYBRID ENGINE: Loading ${v4Result.services.length} rows from Backend...`);

                    // ADAPTER: Backend (Spanish/Excel) -> Frontend (English/React)
                    services = v4Result.services.map((s, i) => ({
                        id: s.ID || `TRIP-${i}`,
                        date: s.FECHA || s.date, // Tries both
                        // Chaos Coords (Medellin Center + Noise)
                        lat: 6.24 + (Math.random() * 0.08 - 0.04),
                        lng: -75.58 + (Math.random() * 0.08 - 0.04),
                        status: s.status || s.ESTADO || 'COMPLETED',
                        financials: s.financials || {
                            totalValue: s.TARIFA || 0,
                            driverPayment: (s.TARIFA || 0) * 0.7, // Approx
                            netRevenue: (s.TARIFA || 0) * 0.2 // Approx
                        },
                        plate: s.VEHICULO || s.plate || 'TBA',
                        driver_name: s.CONDUCTOR || s.driver_name || 'Desconocido',
                        company: s.CLIENTE || s.company || 'PARTICULAR',
                        source: 'MASTER_DATASET' // Flag for UI
                    }));

                    // Map Bank Tx
                    if (v4Result.detailed_cash_flow) {
                        bankTransactions = v4Result.detailed_cash_flow.map(tx => ({
                            date: tx.FECHA,
                            amount: tx.MONTO,
                            type: tx.MONTO > 0 ? 'INCOME' : 'EXPENSE',
                            description: tx.DETALLE || tx.TIPO
                        }));
                    }

                } else {
                    // FALLBACK: CLIENT SIDE GENERATION (Legacy)
                    console.warn("⚠️ BACKEND EMPTY. GENERATING SYNTHETIC FALLBACK.");
                    const totalTrips = 14400;
                    const cars = 15;
                    const baseDate = new Date();
                    baseDate.setDate(baseDate.getDate() - 360);

                    services = new Array(totalTrips);
                    for (let i = 0; i < totalTrips; i++) {
                        const carId = (i % cars) + 1;
                        const dayOffset = Math.floor(i / 40);
                        const tripDate = new Date(baseDate);
                        tripDate.setDate(tripDate.getDate() + dayOffset);

                        services[i] = {
                            id: `TRIP-${i}`,
                            date: tripDate.toISOString(),
                            lat: 6.24 + (Math.random() * 0.08 - 0.04),
                            lng: -75.58 + (Math.random() * 0.08 - 0.04),
                            status: 'COMPLETED',
                            financials: { totalValue: 125000, driverPayment: 82000, netRevenue: 25000 },
                            plate: `TES-${100 + carId}`,
                            driver_name: `Cond. ${carId}`,
                            source: 'SYNTHETIC_FALLBACK'
                        };
                    }
                }

                // 3. GENERATE LIVE PLANES (LAYER 2 ASSETS) - Always Synthetic for now
                const planes = Array.from({ length: 8 }).map((_, i) => ({
                    id: `FL-${500 + i}`,
                    lat: 6.24 + (Math.random() * 0.1 - 0.05),
                    lng: -75.58 + (Math.random() * 0.1 - 0.05),
                    heading: Math.floor(Math.random() * 360),
                    alt: 8000 + Math.floor(Math.random() * 5000),
                    spd: 240 + Math.floor(Math.random() * 40),
                    status: Math.random() > 0.3 ? 'AIRBORNE' : 'LANDED',
                    from: ['MIA', 'BOG', 'CLO', 'JFK', 'MAD'][Math.floor(Math.random() * 5)]
                }));

                setSimulationData({
                    ...v4Result,
                    services: services, // Populates Map & Table
                    planes: planes,     // Populates Map (Layer 2)
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
            // FIX: Transparency for Map Visibility (No Glass Overlay)
            background: viewMode === 'LIVE_OPS' ? 'transparent' : 'var(--color-bg-app)',
            backdropFilter: viewMode === 'LIVE_OPS' ? 'none' : 'blur(20px)',
            boxShadow: viewMode === 'LIVE_OPS' ? 'none' : '0 0 50px rgba(0,0,0,0.5)',
            border: viewMode === 'LIVE_OPS' ? 'none' : '1px solid var(--color-border-subtle)',
            // Enable interaction in both modes now, relying on z-index
            pointerEvents: 'auto',
            color: 'var(--color-text-primary)', // Tokenized
            zIndex: 100,
            padding: viewMode === 'LIVE_OPS' ? 0 : 'var(--spacing-xl)', // REMOVED PADDING FOR FULLSCREEN MAP
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "var(--font-main)" // Tokenized
        }}>


            {/* MODULAR ARCHITECTURE (v4) */}
            {viewMode === 'LIVE_OPS' ? (
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    <LiveOpsMap
                        opsCommand={opsCommand}
                        simulationData={{
                            ...simulationData,
                            // MERGE PROPS: Use App.jsx real-time state if available, fallback to simulationData
                            services: requests || simulationData?.services,
                            vehicles: vehicles || simulationData?.vehicles
                        }}
                        // PASS PLANES DIRECTLY (Bypass simulationData for Radar)
                        planes={planes}
                    />
                </div>
            ) : (
                <>
                    {/* --- ANALYTICS & STRATEGY VIEW --- */}

                    {/* 1. HEADER & NAVIGATION */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', pointerEvents: 'auto' }}>
                        <NeonNavbar
                            activeTab={activeSheet}
                            onTabChange={setActiveSheet}
                            tabs={[
                                { id: 'PROGRAMACION', label: 'AGENDA', icon: '📅' },
                                { id: 'FINANCE', label: 'FINANZAS', icon: '💰' },
                                { id: 'CLIENTS', label: 'CLIENTES', icon: '🏢' },
                                { id: 'MARKETING', label: 'MERCADO', icon: '📢' },
                                { id: 'WAR_ROOM', label: 'WAR ROOM', icon: '⚔️' }
                            ]}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <TesoButton
                                label={isAuditMode ? "🔓 EXIT AUDIT" : "🔒 AUDIT MODE"}
                                active={isAuditMode}
                                onClick={() => setIsAuditMode(!isAuditMode)}
                                variant="secondary"
                            />
                            <TesoButton label="✖ CLOSE" onClick={onClose} variant="danger" />
                        </div>
                    </div>

                    {/* 2. CEO INTELLIGENCE PANEL */}
                    <div style={{ pointerEvents: 'auto' }}>
                        <CeoPanel />
                    </div>

                    {/* 3. SUB-VIEW ROUTER */}
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', pointerEvents: 'auto' }}>

                        {/* A. AGENDA (PROGRAMACION) */}
                        {activeSheet === 'PROGRAMACION' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                {/* KPIS */}
                                <div className="glass-panel" style={{ padding: '20px' }}>
                                    <h3>METRICAS OPERATIVAS</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <div className="label">Eficiencia</div>
                                            <div className="value-lg" style={{ color: 'var(--color-kpi-positive)' }}>{metrics.efficiency}%</div>
                                        </div>
                                        <div>
                                            <div className="label">Conflictos</div>
                                            <div className="value-lg" style={{ color: metrics.errorRate > 0 ? 'var(--color-kpi-danger)' : 'var(--color-text-secondary)' }}>
                                                {simulationData?.conflicts?.cancellations || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* WORKFORCE VISUALIZER */}
                                <div className="glass-panel" style={{ padding: '20px', gridColumn: 'span 2' }}>
                                    <h3>ORQUESTADOR DE IA (WORKFORCE)</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                        {workforce.nodes.map((node, i) => (
                                            <div key={node.id} style={{ textAlign: 'center', opacity: node.status === 'IDLE' ? 0.4 : 1, width: '18%' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '10px', filter: node.status === 'WORKING' ? 'drop-shadow(0 0 8px cyan)' : 'none' }}>
                                                    {node.icon}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{node.label}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#aaa', height: '15px' }}>{node.status === 'WORKING' ? node.logs[0] : node.status}</div>
                                                {/* Progress Bar */}
                                                <div style={{ height: '4px', background: '#333', marginTop: '5px', borderRadius: '2px' }}>
                                                    <div style={{ width: `${node.load}%`, height: '100%', background: node.id === 'DISPATCH' ? '#10b981' : '#06b6d4', transition: 'width 0.2s' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* SYSTEM LOG */}
                                    <div style={{ marginTop: '20px', background: '#000', padding: '10px', borderRadius: '4px', height: '100px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', color: '#39FF14' }}>
                                        {systemLogs.map((log, i) => (
                                            <div key={i}>[{log.time}] {log.msg}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* B. FINANZAS */}
                        {activeSheet === 'FINANCE' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
                                {/* SIDEBAR METRICS */}
                                <div className="glass-panel" style={{ padding: '20px' }}>
                                    <h2>CAJA: {formatCurrency(analytics.margin)}</h2>
                                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div><div className="label">Ingresos Totales</div><div className="value">{formatCurrency(analytics.totalRevenue)}</div></div>
                                        <div><div className="label">Costos Operativos</div><div className="value" style={{ color: '#ef4444' }}>{formatCurrency(analytics.totalCost)}</div></div>
                                        <div><div className="label">Margen Neto</div><div className="value" style={{ color: '#39FF14' }}>{analytics.marginPercent}%</div></div>
                                        <hr style={{ borderColor: '#333' }} />
                                        <div><div className="label">CxC Pendiente</div><div className="value" style={{ color: '#f59e0b' }}>{formatCurrency(analytics.cxcPending)}</div></div>
                                        <div><div className="label">CxP Drivers</div><div className="value" style={{ color: '#6366f1' }}>{formatCurrency(analytics.cxpPending)}</div></div>
                                    </div>
                                    <div style={{ marginTop: '30px' }}>
                                        <TesoButton label="🔍 AUDITAR CAJA" onClick={handleAuditClick} />
                                    </div>
                                </div>

                                {/* MAIN GRAPH AREA */}
                                <div className="glass-panel" style={{ padding: '20px' }}>
                                    <h3>PROYECCIÓN DE FLUJO DE CAJA (STRESS TEST)</h3>
                                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2px', paddingBottom: '20px', borderBottom: '1px solid #333', position: 'relative' }}>
                                        {/* SVG GRAPH RENDERER */}
                                        {stressResult && stressResult.graphPath && (
                                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                {/* Grid */}
                                                <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeDasharray="2" strokeWidth="0.5" />
                                                {/* Data Path */}
                                                <path d={stressResult.graphPath} fill="none" stroke={stressResult.status === 'INSOLVENT' ? '#ef4444' : '#39FF14'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                                                {/* Fill Gradient */}
                                                <path d={`${stressResult.graphPath} L 100 100 L 0 100 Z`} fill={stressResult.status === 'INSOLVENT' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(57, 255, 20, 0.1)'} stroke="none" />
                                            </svg>
                                        )}
                                        {/* Scenario Indicator */}
                                        <div style={{ position: 'absolute', top: 10, right: 10, textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>RUNWAY ACTUAL</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stressResult?.runway === '∞' ? '#39FF14' : '#ef4444' }}>{stressResult?.runway}</div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                                        * Proyección basada en {analytics.cxcPending > 0 ? 'ciclo de cobro actual' : 'datos históricos'}.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* C. WAR ROOM (CONTROL) */}
                        {activeSheet === 'WAR_ROOM' && (
                            <div className="glass-panel" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                                <h2 style={{ color: '#ef4444' }}>⚔️ COMMAND CENTER (WAR ROOM) ⚔️</h2>
                                <p>Ajuste parámetros globales de simulación. Use con precaución.</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                                    <div>
                                        <h4>ESCENARIO DE ESTRÉS</h4>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label>Días de Cartera (CxC)</label>
                                            <input
                                                type="range" min="0" max="120"
                                                value={scenario.cxcDays}
                                                onChange={(e) => setScenario({ ...scenario, cxcDays: e.target.value })}
                                                style={{ width: '100%' }}
                                            />
                                            <div style={{ textAlign: 'right', color: '#39FF14' }}>{scenario.cxcDays} Días</div>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label>Frecuencia Nómina</label>
                                            <select
                                                value={scenario.cxpFreq}
                                                onChange={(e) => setScenario({ ...scenario, cxpFreq: parseInt(e.target.value) })}
                                                style={{ width: '100%', background: '#000', color: '#fff', padding: '5px' }}
                                            >
                                                <option value={15}>Quincenal (15)</option>
                                                <option value={30}>Mensual (30)</option>
                                                <option value={7}>Semanal (7)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                                        <TesoButton
                                            label="🚨 SIMULAR QUIEBRA (STRESS TEST)"
                                            variant="danger"
                                            onClick={() => {
                                                setScenario({ cxcDays: 90, cxpFreq: 7, growth: 0.5 }); // Killer scenario
                                                alert("Simulando escenario 'Perfect Storm'...");
                                            }}
                                        />
                                        <TesoButton
                                            label="📄 DESCARGAR REPORTE PDF"
                                            variant="primary"
                                            onClick={handleDownloadReport}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* E. GEMINI ARTIFACT */}
                        {activeSheet === 'ARTEFACTO' && (
                            <GeminiConsultantArtifact onClose={() => setActiveSheet('PROGRAMACION')} />
                        )}

                        {/* F. CLIENTS & OTHERS (Placeholder) */}
                        {['CLIENTS', 'MARKETING'].includes(activeSheet) && (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                                <h1>MÓDULO {activeSheet}</h1>
                                <p>Datos en vivo conectando con API v4...</p>
                            </div>
                        )}

                    </div>
                </>
            )}
        </div>
    )
};

export default OperationalDashboard;