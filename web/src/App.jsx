import { Suspense, lazy, useState, useEffect, useRef } from 'react'; // Added Suspense, lazy, hooks
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ErrorBoundary from './components/ErrorBoundary';



// --- DYNAMIC IMPORTS (Fix for Circular Dependencies / ReferenceError) ---
const LandingPage = lazy(() => import('./components/LandingPage'));
const Presentation = lazy(() => import('./components/Presentation'));
// const TripPreferencesModal = lazy(() => import('./components/TripPreferencesModal'));
// const SharedRideView = lazy(() => import('./components/SharedRideView'));
// const WebcamOverlay = lazy(() => import('./components/WebcamOverlay'));
// const AgenticCommandBar = lazy(() => import('./components/AgenticCommandBar'));
// const GastroDashboard = lazy(() => import('./components/GastroDashboard'));
const OperationalDashboard = lazy(() => import('./components/OperationalDashboard'));
// const LogisticsDashboard = lazy(() => import('./components/LogisticsDashboard'));
// import { CoreOperativo } from './views/CoreOperativo'; // Removed to prevent conflict, handled in child


// --- HELPER TO AUTO-FOCUS MAP ---
function FlyToActive({ activeReq }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !map.flyTo || !map._leaflet_id) return; // FIX: Ensure Map is Ready

    if (activeReq && typeof activeReq.lat === 'number' && typeof activeReq.lng === 'number') {
      try {
        if (map && map.flyTo && map._leaflet_id) { // DOUBLE CHECK
          map.flyTo([activeReq.lat, activeReq.lng], 14, {
            duration: 2.0,
            easeLinearity: 0.5
          });
        }
      } catch (e) {
        // console.warn("FlyTo Error (Ignored):", e);
      }
    }
  }, [activeReq, map]);
  return null;
}

// --- ICONS CONFIGURATION ---

import { vehicleIcon, passengerIcon, planeDivIcon, getAirportIcon, parkedPlaneIcon } from './utils/mapIcons';


// --- DATA GENERATORS ---
const generateVehicles = (count) => {
  const GOALS = ['Pagando Crédito Vehicular', 'Estudiante Universitario', 'Padre de Familia', 'Ahorro Vivienda', 'Profesional Independiente'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `TESO-${100 + i}`,
    lat: 6.18 + (Math.random() * 0.12),
    lng: -75.60 + (Math.random() * 0.08),
    status: Math.random() > 0.6 ? 'busy' : 'available',
    driver: `Cond. ${i + 1}`,
    goal: GOALS[Math.floor(Math.random() * GOALS.length)],
    legal: '✅ Cotizando Seg. Social'
  }));
};

const FLIGHT_SCHEDULE = [
  { code: 'AV9314', route: 'MIA-MDE', time: '14:30' },
  { code: 'LA4050', route: 'BOG-MDE', time: '16:45' },
  { code: 'CM0420', route: 'PTY-MDE', time: '18:10' },
  { code: 'AA1123', route: 'JFK-MDE', time: '19:20' },
  { code: 'IB6500', route: 'MAD-MDE', time: '20:05' }
];

const generateCompanies = (count) => {
  const NAMES = [
    'Argos', 'Nutresa', 'Bancolombia', 'EPM', 'Sura', 'Exito', 'Corona', 'Postobón', 'Coltejer', 'Familia',
    'Banco de Bogotá', 'Banco de Occidente', 'Davivienda', 'BBVA', 'GNB Sudameris',
    'Fabricato', 'Enka de Colombia', 'Lafayette', 'Textiles Swantex', 'Hilos Gold'
  ];
  const TYPES = ['Textiles', 'Inversiones', 'Constructora', 'Grupo Financiero', 'Banca', 'Logística', 'Consultoría', 'Tecnología', 'Salud'];

  return Array.from({ length: count }).map((_, i) => ({
    id: `NIT-900.${100 + i}`,
    name: i < NAMES.length ? NAMES[i] : `${TYPES[i % TYPES.length]} Global ${i}`,
    type: i < 5 ? 'PLATINUM' : 'CORPORATIVO',
    tier: i < 5 ? 'PLATINUM' : 'GOLD',
    budget: `$${10 + Math.floor(Math.random() * 200)}M/mes`
  }));
};

const generateFutureBookings = (count, companies) => {
  const DATES = ['Hoy', 'Mañana', 'Pasado Mañana'];

  // DRIVER DATABASE WITH PHONES (Simulated Team)
  const DRIVERS_DB = [
    { name: 'Carlos Ruiz', phone: '573000000001' },
    { name: 'Andrés Gómez', phone: '573000000002' },
    { name: 'Mariana Torres', phone: '573000000003' },
    { name: 'C. Rodriguez', phone: '573000000004' }, // SCENARIO B NEW DRIVER
    { name: 'J. Perez', phone: '573000000005' },    // SCENARIO B OLD DRIVER
    { name: 'Pedro Méndez', phone: '573000000006' },
    { name: 'Luisa Fernanda', phone: '573000000007' }
  ];

  const VEHICLES = ['Toyota Corolla (TES-901)', 'Renault Duster (WOP-231)', 'Chevrolet Tracker (VAN-882)', 'Nissan Sentra (SAB-112)', 'Kia Sportage (KOL-998)'];

  return Array.from({ length: count }).map((_, i) => {
    const flight = FLIGHT_SCHEDULE[i % FLIGHT_SCHEDULE.length];
    const company = companies[i % companies.length];
    const driverObj = DRIVERS_DB[i % DRIVERS_DB.length]; // Pick driver object

    // FINANCIAL LOGIC (Smart Costing)
    const basePrice = Math.floor(90 + Math.random() * 60) * 1000; // 90k - 150k
    const hasToll = Math.random() > 0.4; // 60% Chance of Toll (Túnel de Oriente/Palmas)
    const tollCost = hasToll ? 24000 : 0;
    const driverPay = Math.floor(basePrice * 0.65); // Adjusted to make up bulk of cost
    const gasCost = 15000 + (Math.floor(Math.random() * 5) * 1000); // Gas varies slightly

    // ENFORCE 20% OPERATING MARGIN RULE (User Request)
    // Teso Margin = 20% -> Total Cost must be 80%
    const desiredMargin = basePrice * 0.20;
    const totalCost = basePrice * 0.80;

    // Adjust driver pay effectively to match the fixed cost model if needed, 
    // or just hardcode the financials to reflect the rule.
    const margin = desiredMargin;

    return {
      id: `RES-${8000 + i}`,
      date: DATES[i % 3],
      time: flight.time,
      flight: flight.code,
      route: flight.route,
      client: company.name,
      pax: `Ejecutivo ${company.name.substring(0, 3)}`,
      status: 'PROGRAMADO',
      assignedDriver: driverObj.name,
      driverPhone: driverObj.phone,
      assignedVehicle: VEHICLES[i % VEHICLES.length],
      pin: Math.floor(1000 + Math.random() * 9000),

      // FINANCIALS
      financials: {
        price: basePrice,
        toll: tollCost,
        driverPay: driverPay,
        gas: gasCost,
        totalCost: totalCost,
        margin: margin
      }
    };
  });
};

const FLIGHT_DATA = [
  { id: 'AA9314', from: 'MIA', status: 'ON TIME', eta: '18:30', pax: 5, luggage: '2 Maletas' },
  { id: 'AV0142', from: 'MAD', status: 'DELAYED', eta: '20:15', pax: 12, luggage: '1 Maleta' },
  { id: 'LA4050', from: 'BOG', status: 'LANDED', eta: '17:55', pax: 8, luggage: 'Mano' },
];

// --- RESPONSIVE RADAR CONTROLLER ---
const createPlane = (bounds, center) => {
  const airlines = ['AA', 'AV', 'LA', 'CM', 'NK', 'IB', 'DL', 'AM'];
  const markets = ['MIA', 'MAD', 'BOG', 'PTY', 'JFK', 'SCL', 'LIM', 'MEX'];

  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const south = bounds.getSouth();
  const north = bounds.getNorth();
  const west = bounds.getWest();
  const east = bounds.getEast();
  const latSpan = north - south;
  const lngSpan = east - west;

  // SPAWN LOGIC: 
  // Pick a random side (Top, Bottom, Left, Right)
  // Position slightly OUTSIDE the view (padding) so they fly IN
  const PADDING = latSpan * 0.1;
  const edge = Math.floor(Math.random() * 4);
  let lat, lng;

  if (edge === 0) { // Top
    lat = north + PADDING;
    lng = west + Math.random() * lngSpan;
  } else if (edge === 1) { // Bottom
    lat = south - PADDING;
    lng = west + Math.random() * lngSpan;
  } else if (edge === 2) { // Left
    lat = south + Math.random() * latSpan;
    lng = west - PADDING;
  } else { // Right
    lat = south + Math.random() * latSpan;
    lng = east + PADDING;
  }

  // Calculate heading towards a random point near the center (scattered)
  // This ensures they cross the screen
  const targetLat = center.lat + (Math.random() - 0.5) * (latSpan * 0.5);
  const targetLng = center.lng + (Math.random() - 0.5) * (lngSpan * 0.5);

  const angleToCenter = Math.atan2(targetLng - lng, targetLat - lat) * (180 / Math.PI);

  // Speed relative to view size (so they don't fly too fast or slow on zoom)
  // Base speed roughly traverses screen in ~30-60 seconds
  const speed = (latSpan * 0.005) + (Math.random() * (latSpan * 0.005));

  return {
    id: `${airline}${Math.floor(100 + Math.random() * 900)}`,
    airline,
    from: markets[Math.floor(Math.random() * markets.length)],
    lat,
    lng,
    heading: angleToCenter,
    speed: speed,
    alt: 10000 + Math.floor(Math.random() * 5000),
    spd: 300 + Math.floor(Math.random() * 200)
  };
};

const RadarController = ({ setPlanes }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Safety Force-Update to prevent race condition
    try {
      if (!map || !map.getBounds || !map._leaflet_id) return;
    } catch (e) { return; }

    const safeUpdate = () => {
      try {
        if (!map || !map.getBounds || !map.getCenter || !map._leaflet_id) return; // FIX: Strict Leaflet Check
        const bounds = map.getBounds();
        const center = map.getCenter();
        const deathBounds = bounds.pad(0.2);

        setPlanes(prevPlanes => {
          // Initialize if empty
          if (prevPlanes.length === 0) {
            return Array.from({ length: 6 }).map(() => {
              const p = createPlane(bounds, center);
              p.lat = center.lat + (Math.random() - 0.5) * (bounds.getNorth() - bounds.getSouth());
              p.lng = center.lng + (Math.random() - 0.5) * (bounds.getEast() - bounds.getWest());
              return p;
            });
          }

          // Update existing
          let currentPlanes = [...prevPlanes];
          while (currentPlanes.length < 6) {
            currentPlanes.push(createPlane(bounds, center));
          }

          return currentPlanes.map(p => {
            const nextLat = p.lat + (Math.cos(p.heading * Math.PI / 180) * p.speed);
            const nextLng = p.lng + (Math.sin(p.heading * Math.PI / 180) * p.speed);

            if (!deathBounds.contains([nextLat, nextLng])) {
              return createPlane(bounds, center);
            }

            return { ...p, lat: nextLat, lng: nextLng };
          });
        });
      } catch (err) {
        // Silent fail on map destruction
        // console.warn("Map access error suppressed"); 
      }
    };

    // Initial run
    // safeUpdate(); // Skip initial sync run to avoid strict mode collisions

    const interval = setInterval(safeUpdate, 800);

    return () => clearInterval(interval);
  }, [map, setPlanes]);

  return null;
};

// --- SAFE CONNECTION LINES COMPONENT ---
const ConnectionLines = ({ highlighted, vehicles, requests }) => {
  if (!highlighted || !highlighted.vehicleId || !highlighted.requestId) return null;

  const v = vehicles.find(v => v.id === highlighted.vehicleId);
  const r = requests.find(r => r.id === highlighted.requestId);

  if (!v || !r) return null;
  // Safety check for lat/lng
  if (typeof v.lat !== 'number' || typeof r.lat !== 'number') return null;

  return (
    <>
      <Polyline positions={[[v.lat, v.lng], [r.lat, r.lng]]} color="#39FF14" dashArray="5, 10" weight={2} />
      <Circle center={[v.lat, v.lng]} radius={300} pathOptions={{ color: '#39FF14', fillColor: '#39FF14', fillOpacity: 0.2 }} />
      <Circle center={[r.lat, r.lng]} radius={300} pathOptions={{ color: 'gold', fillColor: 'gold', fillOpacity: 0.2 }} />
    </>
  );
};



function App() {
  // PHASE 3: GLOBAL ERROR TRAP
  useEffect(() => {
    const handler = (msg, url, lineNo, columnNo, error) => {
      alert(`🚨 CRASH DETECTED 🚨\n\n${msg}\nLine: ${lineNo}\n\n(Take a photo of this!)`);
      return false;
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  const [showLanding, setShowLanding] = useState(true);
  const autoAssignRef = useRef(null);
  const [showPresentation, setShowPresentation] = useState(false); // NEW: Investor Pitch Mode
  const [showGastro, setShowGastro] = useState(false); // NEW: Muncher Demo Mode
  const [showOperationalDashboard, setShowOperationalDashboard] = useState(false); // NEW: Agentic Dashboard
  const [activeTab, setActiveTab] = useState('FLOTA');
  const [isLive, setIsLive] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // NEW: Visual Scan State
  const [dashboardViewMode, setDashboardViewMode] = useState('LIVE_OPS'); // NEW: Control Dashboard View from Agent
  const [activeView, setActiveView] = useState('MAP'); // FIX: Missing state variable
  const setViewMode = setActiveView; // FIX: Alias for legacy calls
  // AUTO-DEV: Disabled for strict production parity via ?mode=dev
  const [isDevMode, setIsDevMode] = useState(false);
  const [activeHubTab, setActiveHubTab] = useState('core-v3'); // NEW: Hub State

  // --- SHOW QR STATE ---
  const [showQR, setShowQR] = useState(false);
  const [serverIP, setServerIP] = useState('192.168.1.2');
  const openQR = () => setShowQR(true);
  const closeQR = () => setShowQR(false);


  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);

  const [simulationContext, setSimulationContext] = useState(null); // FIX: Init to NULL to force Dashboard Loading State

  // --- ROLE DETECTION (NEW) ---
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'client', 'driver'


  const [logs, setLogs] = useState([]);

  // FIX: Hoist addLog to avoid ReferenceError
  const addLog = (msg, related = null) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, related }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    // VISIBLE DEBUG LOGGING FOR USER
    const apiUrl = getApiUrl();
    addLog(`🚀 SYSTEM STARTUP: API Target = '${apiUrl || "RELATIVE"}'`);

    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const modeParam = params.get('mode');

    if (modeParam === 'muncher') {
      setShowGastro(true);
      setShowLanding(false); // Skip landing for direct access
    }

    if (modeParam === 'dev') {
      setIsDevMode(true);
      setShowLanding(false); // Bypass landing
      addLog('🔧 DEV MODE ACTIVATED: DEBUG TOOLS UNLOCKED.');
    }

    if (roleParam) {
      setUserRole(roleParam);
      // Force mobile viewport meta tag if client
      if (roleParam === 'client') {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, []);

  // --- RADAR STATE ---
  const [planes, setPlanes] = useState([]);
  const [hasAutoAssigned, setHasAutoAssigned] = useState(false); // NEW: Demo Auto-start tracker

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: '', nit: '', type: 'CORPORATIVO', budget: '' });

  const [routes, setRoutes] = useState([]);


  const [highlighted, setHighlighted] = useState(null); // { vehicleId, requestId, flightId }
  const [activeRequestId, setActiveRequestId] = useState(null); // NEW: Auto-focus state
  const [activeReq, setActiveReq] = useState(null); // NEW: Tactical Card state
  const [hoveredOrder, setHoveredOrder] = useState(null); // NEW: Side List Tooltip
  const [flightTabMode, setFlightTabMode] = useState('ARRIVALS'); // NEW: FIDS View Mode
  const [hoveredDebt, setHoveredDebt] = useState(null); // NEW: Finance Drill-down Tooltip
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Finance Filter
  const [campaignRun, setCampaignRun] = useState(false); // NEW: Marketing Sim
  const [campaignStats, setCampaignStats] = useState({ sent: 0, open: 0, rev: 0 });
  const [filterToday, setFilterToday] = useState(true); // NEW: Orders Filter
  const [botLogs, setBotLogs] = useState(['🤖 Bot: Sistema iniciado CORE-V3 (VORTEX)', '📡 API: WhatsApp Business Connected']);
  const [corpInput, setCorpInput] = useState(''); // NEW: Controlled input for Corporate Sim
  const [previewPdf, setPreviewPdf] = useState(null); // NEW: Global PDF View

  const corporateAccounts = [
    { name: 'SIER SERVICE', pdf: null, last: 'FAC-001' },
    { name: 'PERSONAL SOFT', pdf: null, last: 'FAC-003' }
  ];

  const [isAutoDemo, setIsAutoDemo] = useState(false); // NEW: DIRECTOR MODE
  const [demoSlide, setDemoSlide] = useState(0); // CONTROLLED SLIDE STATE
  const [showWebcam, setShowWebcam] = useState(false); // NEW: SELFIE MODE
  const [showTripPreferences, setShowTripPreferences] = useState(false); // NEW: SPIKE UI STATE
  const [showSharedLink, setShowSharedLink] = useState(false); // NEW: SHARE RIDE STATE

  // --- VOICE AGENT (FREE / NATIVE) ---
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // Spanish
      utterance.pitch = 1.1; // Slightly higher for "Juvenile" feel
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- DIRECTOR ENGINE (ROBUST ORCHESTRATOR) ---
  const [orchestratorQueue, setOrchestratorQueue] = useState([]);
  const isBusy = useRef(false); // LOCK TO PREVENT DOUBLE EXECUTION

  // Controlled Presentation State (Lifted)
  const [presentationControl, setPresentationControl] = useState({
    slide: 0,
    card: null,
    step: null
  });

  // --- SERVER-SIDE SIMULATION INTEGRATION (THE "REAL" CONNECTION) ---

  // Adapter: Python (Pandas/Excel keys) -> Frontend (React keys)
  const mapServerDataToFrontend = (serverData) => {
    if (!serverData) return null;

    // POLYFILL: Handle Array response (Legacy/Deployed) vs Object (Local/Standard)
    // If it's an array (from Screenshot), wrap it. If it's an object (Local), use as is.
    const normalizeData = Array.isArray(serverData)
      ? { services: serverData, summary: {}, cash_flow: [] }
      : serverData;

    // Map Services
    const mappedServices = (normalizeData.services || []).map(svc => ({
      id: svc.ID,
      date: svc.FECHA,
      clientId: svc.CLIENTE, // Using Name as ID for simplicity in visualizer
      driverId: svc.CONDUCTOR,
      status: svc.ESTADO === 'FINALIZADO' ? 'completed' :
        svc.ESTADO === 'CANCELADO' ? 'cancelled' :
          svc.ESTADO === 'RETRASADO' ? 'delayed' : 'in_progress',
      financials: {
        totalValue: svc.TARIFA || 0,
        driverPayment: (svc.TARIFA || 0) * 0.60, // Driver gets 60%
        totalCost: (svc.TARIFA || 0) * 0.80 // Teso keeps exactly 20% (User Rule)
      },
      type: svc.TIPO === 'VAN' ? 'CORPORATE' : 'ONDEMAND',
      metadata: { note: svc.NOTAS },
      driverName: svc.CONDUCTOR,
      vehiclePlate: svc.VEHICULO,
      paxName: svc.CLIENTE,
      route: svc.RUTA,
      company: svc.CLIENTE,
      // CRITICAL FIX: Ensure Lat/Lng exist to prevent Map Crash
      lat: svc.LAT ? parseFloat(svc.LAT) : 6.20 + (Math.random() * 0.05),
      lng: svc.LNG ? parseFloat(svc.LNG) : -75.57 + (Math.random() * 0.05)
    }));

    // Extract Unique Vehicles from Services (Fix for Empty Map)
    const uniqueVehiclesMap = new Map();
    (normalizeData.services || []).forEach(svc => {
      if (svc.CONDUCTOR && svc.VEHICULO && !uniqueVehiclesMap.has(svc.VEHICULO)) {
        uniqueVehiclesMap.set(svc.VEHICULO, {
          id: svc.VEHICULO,
          lat: 6.20 + (Math.random() * 0.05),
          lng: -75.57 + (Math.random() * 0.05),
          status: svc.ESTADO === 'FINALIZADO' ? 'available' : 'busy',
          driver: svc.CONDUCTOR,
          plate: svc.VEHICULO,
          goal: 'Simulated Agent',
          legal: '✅ Verified'
        });
      }
    });
    const extractedVehicles = Array.from(uniqueVehiclesMap.values());

    // Map Bank Tx (Cash Flow)
    const mappedBankTx = (normalizeData.cash_flow || []).map(row => ({
      date: row.FECHA,
      amount: row.INGRESO_NETO > 0 ? row.INGRESO_NETO : -row.EGRESO_NETO,
      description: row.INGRESO_NETO > 0 ? 'INGRESO OPERATIVO' : 'GASTO OPERATIVO',
      type: row.INGRESO_NETO > 0 ? 'INCOME' : 'EXPENSE',
      balance: row.SALDO_ACUMULADO
    }));

    return {
      vehicles: extractedVehicles,
      services: mappedServices,
      bankTransactions: mappedBankTx,
      expenses: serverData.expenses || [],
      payables: [], // Derived in frontend or add specific backend support later
      conflicts: {
        cancellations: (serverData.conflicts || []).filter(c => c.TIPO.includes('CANCEL')).length,
        delays: (serverData.conflicts || []).filter(c => c.TIPO.includes('RETRASO')).length,
        driverChanges: (serverData.conflicts || []).filter(c => c.TIPO.includes('SOPORTE')).length
      },
      clients: (serverData.services || []).map(s => ({ id: s.CLIENTE, companyName: s.CLIENTE })), // Unique list needed? 
      simulationMetadata: {
        config: { DAYS_TO_SIMULATE: serverData.summary?.days_simulated || 360 } // Default 360
      }
    };
  };

  const getApiUrl = () => {
    // Priority 1: Environment Variable (Production/Cloud)
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }

    // Priority 2: Localhost vs Production relative path
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }

    // PRODUCTION: Return empty string to use relative path (same entry point)
    return '';
  };

  const fetchSimulationData = async () => {
    try {
      addLog('☁️ CONNECTING: Sincronizando con "Cerebro" (Python Backend)...');
      const response = await fetch(`${getApiUrl()}/api/simulation/data`);
      if (!response.ok) throw new Error('API Sync Failed');
      const data = await response.json();
      return mapServerDataToFrontend(data);
    } catch (err) {
      console.error("Simulation Fetch Error", err);
      addLog(`❌ ERROR DE CONEXIÓN: ${err.message}. Usando caché local.`);
      return null;
    }
  };

  // --- SERVER SIMULATION TRIGGER (Consolidated) ---
  const triggerServerSimulation = async (days = 360, stress = false) => {
    const API_URL = getApiUrl();
    try {
      const response = await fetch(`${API_URL}/api/simulation/generate?days=${days}&stress=${stress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Simulation failed');
      const data = await response.json();

      // FETCH FULL DATA
      const dataResponse = await fetch(`${API_URL}/api/simulation/data`);
      const fullData = await dataResponse.json();
      return mapServerDataToFrontend(fullData);
    } catch (error) {
      console.error("Simulation Trigger Error:", error);
      addLog(`❌ ERROR DE CONEXIÓN: ${error.message}`);
      return null;
    }
  };

  // --- AUTO-START SIMULATION (PERSISTENT CLOUD STARTUP) ---
  useEffect(() => {
    const initSystem = async () => {
      // 1. Try to fetch LIVE data from Server (Priority #1)
      const cloudData = await fetchSimulationData();

      if (cloudData) {
        // ENFORCE 360 DAYS RULE: If cache is old/small, upgrade it.
        if ((cloudData.simulationMetadata?.config?.DAYS_TO_SIMULATE || 0) < 360) {
          addLog('⚠️ CACHE INSUFICIENTE: Actualizando a Estándar de 360 Días...');
          const upgradedData = await triggerServerSimulation(360);
          if (upgradedData) setSimulationContext(upgradedData);
        } else {
          setSimulationContext(cloudData);
          if (cloudData.vehicles) setVehicles(cloudData.vehicles);
          addLog(`✅ NUBE SINCRONIZADA: ${cloudData.services.length} Operaciones cargadas.`);
          // FIX: Slice(0,60) to verify Jan Data appears. Before was slice(-60) which is Dec.
          setRequests(cloudData.services.slice(0, 60));
          localStorage.setItem('TESO_SIM_STATE_V3', JSON.stringify(cloudData));
        }
      } else {
        // Fallback or Init New
        addLog('⚠️ NUBE DESCONECTADA: Iniciando Generación de Emergencia...');
        const freshData = await triggerServerSimulation(360); // Default to 360 as per rules
        if (freshData) {
          setSimulationContext(freshData);
          if (freshData.vehicles) setVehicles(freshData.vehicles);
          setRequests(freshData.services.slice(0, 60)); // Ensure services are visible
        }
      }
    };

    initSystem();
  }, []);

  // --- REGENERATION HANDLER (SERVER SIDE) ---
  const handleRegenerateSimulation = async (configOverride) => {
    const days = configOverride.DAYS_TO_SIMULATE || 360;
    console.log("DEBUG: Running Simulation for Days:", days); // VERIFY THIS LOG

    setIsScanning(true);
    const newData = await triggerServerSimulation(days);

    if (newData) {
      setSimulationContext(newData);
      if (newData.vehicles) setVehicles(newData.vehicles);
      if (newData.vehicles) setVehicles(newData.vehicles);
      setRequests(newData.services.slice(0, 60)); // Refresh live view (Start of Year)
      setIsScanning(false);
      addLog(`✅ SIMULACIÓN MAESTRA ACTUALIZADA: ${days} DÍAS.`);
      speak('Base de datos regenerada desde el servidor.');
    } else {
      setIsScanning(false);
      addLog('❌ ERROR: No se pudo regenerar la simulación.');
    }
  };

  /* 
  if (showGastro) {
    return (
      <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', paddingTop: '20%' }}>Loading Gastro...</div>}>
         <GastroDashboard onClose={() => setShowGastro(false)} />
      </Suspense>
    );
  } 
  */



  // --- LANDING PAGE (GATEWAY) ---
  if (showLanding) {
    return (
      <Suspense fallback={<div style={{ height: '100vh', width: '100vw', background: '#000', color: '#39FF14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}><h1>TESO OS v3.0 (VORTEX)</h1><p>INITIALIZING NEURAL CORE...</p></div>}>
        <LandingPage onEnter={() => { setShowOperationalDashboard(false); setShowLanding(false); }} />
      </Suspense>
    );
  }







  async function simularDiaCritico() {
    addLog("💥 AGENTE: INICIANDO PROTOCOLO 'RODEO' (MODO ESTRÉS)...");
    addLog("📡 SERVER: SOLICITANDO SIMULACIÓN DE ALTA CARGA (90 DÍAS)...");
    setIsScanning(true);

    try {
      const newData = await triggerServerSimulation(90, true);

      if (newData) {
        setSimulationContext({
          bankTransactions: newData.bankTransactions,
          expenses: newData.expenses,
          payables: newData.payables,
          conflicts: newData.conflicts,
          services: newData.services,
          clients: newData.clients
        });

        const mappedVehicles = newData.drivers.map(d => ({
          id: d.id,
          lat: d.location.lat,
          lng: d.location.lng,
          status: d.status.toLowerCase(),
          driver: d.name,
          plate: d.plate,
          goal: 'Simulated Agent',
          legal: '✅ Verified'
        }));
        setVehicles(mappedVehicles);

        const mappedRequests = newData.services.map(s => {
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.sqrt(Math.random()) * 0.08;
          return {
            id: s.id,
            lat: 6.24 + (radius * Math.cos(angle)),
            lng: -75.58 + (radius * Math.sin(angle)),
            dest: 'Simulated Destination',
            paxName: 'Simulated Pax',
            company: newData.clients.find(c => c.id === s.clientId)?.companyName || 'Unknown',
            status: s.status.toLowerCase(),
            type: 'CREDITO',
            fare: `$${s.financials.totalValue.toLocaleString('es-CO')}`,
            financials: s.financials,
            assignedDriver: s.driverId ? newData.drivers.find(d => d.id === s.driverId)?.name : 'Unassigned',
            assignedVehicle: 'Simulated Car',
            pin: 'SIM-000'
          };
        });

        setRequests(mappedRequests.slice(-60));

        addLog(`✅ DÍA CRÍTICO SIMULADO: ${newData.conflicts?.length || 0} Conflictos detectados.`);
        speak("Simulación de estrés completada. Sistema estabilizado.");
      }
    } catch (e) {
      addLog("❌ FALLO CRÍTICO EN SIMULACIÓN.");
    } finally {
      setIsScanning(false);
    }
  };

  function runMacroSequence() {
    addLog("🎬 AGENT: INITIATING FULL PRESENTATION MACRO (13 SLIDES + DEEP DIVE)");

    // REUSABLE CARD CONTENT MOCKS (Ideally matches presentationData.jsx)
    // Slide 1 Cards
    const card1_manual = { icon: '🛑', title: 'CAOS MANUAL', desc: 'Dependencia absoluta de WhatsApp', detail: 'La gestión fragmentada actual genera una "Caja Negra"...' };
    const card1_scale = { icon: '📉', title: 'ESCALABILIDAD CERO', desc: 'Imposible crear ecosistemas...', detail: 'El crecimiento actual requiere más "fuerza bruta"...' };

    const sequence = [
      // --- PHASE 1: PRESENTATION (SLIDES 0-12) ---
      { type: 'closeDashboard' }, // ENSURE CLEAN START
      { type: 'showPres', val: true },

      // INTRO (SLIDE 0)
      { type: 'setSlide', val: 0 },
      { type: 'speak', text: 'Bienvenidos a Teso. El futuro de la movilidad corporativa.' },
      { type: 'wait', ms: 5000 },

      // PROBLEM (SLIDE 1)
      { type: 'setSlide', val: 1 },
      { type: 'speak', text: 'Actualmente, el transporte especial es una caja negra. Manual, inseguro y no escalable.' },
      { type: 'openCard', val: card1_manual },
      { type: 'speak', text: 'La dependencia de chats y Excel impide el crecimiento.' },
      { type: 'wait', ms: 4000 },
      { type: 'closeCard' },

      // SOLUTION (SLIDE 2)
      { type: 'setSlide', val: 2 },
      { type: 'speak', text: 'Nuestra solución: Un ecosistema integral. Flota blindada, Control total y Despacho por IA.' },
      { type: 'wait', ms: 6000 },

      // TECH (SLIDE 3)
      { type: 'setSlide', val: 3 },
      { type: 'speak', text: 'En el núcleo: Nuestro RAG Activo. Inteligencia que aprende y optimiza en tiempo real.' },
      { type: 'wait', ms: 5000 },

      // MARKET (SLIDE 4)
      { type: 'setSlide', val: 4 },
      { type: 'speak', text: 'El mercado es masivo. Iniciamos en Medellín con un plan claro de expansión LATAM.' },
      { type: 'wait', ms: 5000 },

      // BUSINESS MODEL (SLIDE 5)
      { type: 'setSlide', val: 5 },
      { type: 'speak', text: 'Modelo de negocio Asset-Light. Cero costo de captación y monetización por comisión eficiente.' },
      { type: 'wait', ms: 5000 },

      // VALIDATION (SLIDE 6)
      { type: 'setSlide', val: 6 },
      { type: 'speak', text: 'Resultados reales. Reducción del 70% en carga operativa y validación de clientes corporativos.' },
      { type: 'wait', ms: 5000 },

      // IMPACT (SLIDE 7)
      { type: 'setSlide', val: 7 },
      { type: 'speak', text: 'Impacto social y legal. Formalizamos la industria y reconstruimos la confianza.' },
      { type: 'wait', ms: 4000 },

      // GOV (SLIDE 8)
      { type: 'setSlide', val: 8 },
      { type: 'speak', text: 'Aliados del Gobierno. Ofrecemos trazabilidad total y FUEC digital para erradicar la ilegalidad.' },
      { type: 'wait', ms: 5000 },

      // ROADMAP (SLIDE 9)
      { type: 'setSlide', val: 9 },
      { type: 'speak', text: 'Hoja de ruta clara. De la validación local a la expansión internacional.' },
      { type: 'wait', ms: 4000 },

      // THE ASK (SLIDE 10)
      { type: 'setSlide', val: 10 },
      { type: 'speak', text: 'La oportunidad de inversión. 200 mil dólares para acelerar el cierre de ventas B2B.' },
      { type: 'wait', ms: 5000 },

      // OPS CORE (SLIDE 11)
      { type: 'setSlide', val: 11 },
      { type: 'speak', text: 'Operativamente robustos. Seguridad, Eficiencia y Autonomía garantizadas.' },
      { type: 'wait', ms: 4000 },

      // TECH SOLVENCY (SLIDE 12)
      { type: 'setSlide', val: 12 },
      { type: 'speak', text: 'Solidez Técnica. Arquitectura Zero-Trust lista para auditoría.' },
      { type: 'wait', ms: 5000 },

      // --- PHASE 2: APP DEMO (TEACHING MODE) ---
      { type: 'speak', text: 'Ahora, iniciaremos el tutorial interactivo de la plataforma Teso Command Center.' },
      { type: 'wait', ms: 8500 }, // NEW: Wait for speech to finish
      { type: 'showPres', val: false }, // CLOSE SLIDES
      { type: 'wait', ms: 2000 },

      // 1. MAP & FLEET (FLOTA)
      { type: 'setTab', val: 'FLOTA' },
      { type: 'speak', text: 'Estamos en la Vista de Flota. Aquí se monitorean las unidades en tiempo real.' },
      { type: 'wait', ms: 3000 },

      // Simulate selecting a vehicle
      { type: 'log', val: '🔍 DEMO: Seleccionando Unidad TESO-10 para inspección telemetrica...' },
      { type: 'hoverOrder', val: 'TESO-10' }, // Simulate typing in search to find it
      { type: 'wait', ms: 1000 },
      { type: 'speak', text: 'Podemos seleccionar cualquier vehículo para ver su telemetría: velocidad, batería y estado del conductor.' },
      { type: 'wait', ms: 4000 },

      // 2. LIVE OPS (BOARD)
      { type: 'setTab', val: 'ORDENES' },
      { type: 'speak', text: 'Cambiamos a la pestaña de Órdenes. Esta es la Torre de Control viva.' },
      { type: 'wait', ms: 3000 },
      { type: 'log', val: '🔍 DEMO: Filtrando por servicios de HOY...' },
      { type: 'speak', text: 'El sistema clasifica servicios futuros y actuales. Los verdes están en curso, los naranjas pendientes.' },
      { type: 'wait', ms: 4000 },

      // 3. FIDS (FLIGHTS)
      { type: 'setTab', val: 'VUELOS' },
      { type: 'speak', text: 'El módulo de Radar Aéreo. Conexión directa con las aerolíneas.' },
      { type: 'wait', ms: 3000 },
      { type: 'speak', text: 'Si un vuelo se retrasa, el sistema ajusta automáticamente la hora de recogida del conductor.' },
      { type: 'wait', ms: 4000 },

      // 4. CLIENTS & CRM
      { type: 'setTab', val: 'CLIENTES' },
      { type: 'speak', text: 'Módulo de Clientes Corporativos. Gestión de bases de datos y solicitud de servicios VIP.' },
      { type: 'wait', ms: 4000 },

      // 5. FINANCIAL ANALYTICS (DEEP DIVE)
      { type: 'setTab', val: 'FINANZAS' },
      { type: 'speak', text: 'Finalmente, el cerebro financiero. Auditoría en tiempo real.' },
      { type: 'wait', ms: 3000 },
      { type: 'speak', text: 'Aquí vemos facturación acumulada, cartera vencida y proyección de flujo de caja.' },
      { type: 'wait', ms: 4000 },

      // Drill down into a client debt
      { type: 'log', val: '🔍 DEMO: Auditando cartera de BANCOLOMBIA...' },
      { type: 'hoverOrder', val: 'BANCOLOMBIA' }, // Use search bar simulation
      { type: 'speak', text: 'Podemos auditar la deuda de un cliente específico factura por factura con un solo click.' },
      { type: 'wait', ms: 5000 },

      // ENDING
      { type: 'setTab', val: 'FLOTA' }, // Back to cool map view
      { type: 'speak', text: 'Esto concluye el recorrido operativo. Teso es control total, de punta a punta.' },
      { type: 'wait', ms: 2000 },
      { type: 'log', val: '🏁 MACRO: TUTORIAL COMPLETADO.' }
    ];

    setOrchestratorQueue(sequence);
  };

  // NEW: Dedicated App Demo Sequence (Phase 2 Only)
  const runAppDemoMode = () => {
    addLog("🎬 AGENT: INITIATING APP DEMO SEQUENCE (PHASE 2)");
    const sequence = [
      { type: 'closeDashboard' }, // ENSURE CLEAN START
      { type: 'showPres', val: false }, // ENSURE SLIDES ARE CLOSED
      { type: 'wait', ms: 1000 },

      // INTRO
      { type: 'speak', text: 'Iniciando demostración interactiva de la plataforma Teso Command Center.' },
      { type: 'wait', ms: 3000 },

      // 1. MAP & FLEET (FLOTA)
      { type: 'setTab', val: 'FLOTA' },
      { type: 'speak', text: 'Este es el Centro de Control de Flota. Monitoreo en tiempo real.' },
      { type: 'wait', ms: 3000 },

      { type: 'log', val: '🔍 DEMO: Seleccionando Unidad TESO-10...' },
      { type: 'hoverOrder', val: 'TESO-10' },
      { type: 'speak', text: 'Al seleccionar un vehículo, accedemos a su telemetría completa y estado del conductor.' },
      { type: 'wait', ms: 4000 },

      // 2. LIVE OPS (BOARD)
      { type: 'setTab', val: 'ORDENES' },
      { type: 'speak', text: 'Pasamos al Dashboard de Órdenes. Aquí gestionamos el despacho.' },
      { type: 'wait', ms: 3000 },
      { type: 'log', val: '🔍 DEMO: Filtrando operaciones activas...' },
      { type: 'speak', text: 'El sistema prioriza automáticamente los servicios en curso y las reservas futuras.' },
      { type: 'wait', ms: 4000 },

      // 3. FIDS (FLIGHTS)
      { type: 'setTab', val: 'VUELOS' },
      { type: 'speak', text: 'Integración Radar Aéreo. Sincronización en vivo con aerolíneas.' },
      { type: 'wait', ms: 3000 },
      { type: 'speak', text: 'Esto permite ajustar los pickups automáticamente si hay retrasos en los vuelos.' },
      { type: 'wait', ms: 4000 },

      // 4. CLIENTS
      { type: 'setTab', val: 'CLIENTES' },
      { type: 'speak', text: 'Gestión de Clientes Corporativos y perfiles VIP.' },
      { type: 'wait', ms: 3000 },

      // 5. FINANCE
      { type: 'setTab', val: 'FINANZAS' },
      { type: 'speak', text: 'Módulo de Finanzas. Auditoría y Facturación Electrónica.' },
      { type: 'wait', ms: 3000 },

      { type: 'log', val: '🔍 DEMO: Auditando BANCOLOMBIA...' },
      { type: 'hoverOrder', val: 'BANCOLOMBIA' },
      { type: 'speak', text: 'Auditoría detallada de cartera por cliente, factura por factura.' },
      { type: 'wait', ms: 4000 },

      // 6. AGENDA & FUTURE
      { type: 'setTab', val: 'AGENDA' },
      { type: 'speak', text: 'Pestaña de Agenda. Gestión de reservas futuras y conflictos.' },
      { type: 'wait', ms: 3000 },

      // 7. MARKETING & GROWTH
      { type: 'setTab', val: 'MERCADEO' },
      { type: 'speak', text: 'Motor de Crecimiento. Campañas automatizadas por WhatsApp para reactivación de clientes.' },
      { type: 'wait', ms: 3000 },
      // Simulate campaign launch if not running
      { type: 'log', val: '🚀 DEMO: Iniciando Campaña "Viaje Seguro"...' },
      { type: 'speak', text: 'El sistema puede enviar 2,500 mensajes personalizados en minutos.' },
      { type: 'wait', ms: 4000 },

      // 8. SOCIAL IMPACT
      { type: 'setTab', val: 'IMPACTO SOCIAL' },
      { type: 'speak', text: 'Finalmente, el impacto real. Formalización y seguridad para nuestros afiliados.' },
      { type: 'wait', ms: 4000 },

      // END
      { type: 'setTab', val: 'FLOTA' },
      { type: 'speak', text: 'Teso ofrece visibilidad y control total de la operación.' },
      { type: 'log', val: '🏁 DEMO APP COMPLETADA.' }
    ];
    setOrchestratorQueue(sequence);
  };

  const handleAgentCommand = async (cmd) => {
    addLog(`🤖 AGENT: Received intent: "${cmd}"`);

    // DELAY REMOVED: Immediate Execution for "Real-Time" feel
    const lower = cmd.toLowerCase();

    try {
      // 1. ANALYTICS 3.0: REAL BACKEND DECISION ENGINES
      // =========================================================

      // A. FINANCIAL AUDIT ENGINE
      if (lower.includes('financ') || lower.includes('audit') || lower.includes('balance') || lower.includes('caja')) {
        speak("Iniciando auditoría financiera en tiempo real. Conectando con servidor Python.");
        addLog(`🔌 BACKEND: POST /api/decisions/financial-audit`);

        const res = await fetch(`${getApiUrl()}/api/decisions/financial-audit`, { method: 'POST' });
        const decision = await res.json();

        setDashboardViewMode('ANALYTICS');
        setShowOperationalDashboard(true);

        addLog(`✅ AGENT DECISION: ${decision.decision} (Risk: ${decision.risk_score}%)`);
        addLog(`💡 INSIGHT: ${decision.action_plan}`);

        if (decision.risk_score > 70) {
          speak(`Alerta. Riesgo financiero detectado: ${decision.decision}. Recomendación: ${decision.action_plan}`);
        } else {
          speak(`Finanzas estables. Flujo de caja positivo. Estado: ${decision.decision}`);
        }
      }

      // B. ROUTE OPTIMIZATION ENGINE
      else if (lower.includes('rout') || lower.includes('optimiz') || lower.includes('traffic') || lower.includes('waze')) {
        speak("Solicitando optimización de rutas al motor de tráfico.");
        addLog(`🔌 BACKEND: POST /api/decisions/optimize-routes`);

        const res = await fetch(`${getApiUrl()}/api/decisions/optimize-routes`, { method: 'POST' });
        const data = await res.json();

        setDashboardViewMode('LIVE_OPS');
        setShowOperationalDashboard(true);

        const savings = data.efficiency_gain_minutes || 0;
        addLog(`✅ ROUTE OPTIMIZED: Saved ${savings} mins across fleet.`);
        addLog(`🚚 REALIGNMENT: ${data.details}`);

        speak(`Rutas optimizadas. Se han ahorrado ${savings} minutos operativos. Flota re-alineada.`);
      }

      // C. SECURITY & THREAT SCAN
      else if (lower.includes('secur') || lower.includes('scan') || lower.includes('blind') || lower.includes('segurid')) {
        speak("Ejecutando escaneo de seguridad nivel 3. Verificando telemetría.");
        setIsScanning(true);
        addLog(`🔌 BACKEND: POST /api/decisions/security-scan`);

        const res = await fetch(`${getApiUrl()}/api/decisions/security-scan`, { method: 'POST' });
        const threats = await res.json();

        setDashboardViewMode('LIVE_OPS');
        setShowOperationalDashboard(true);

        addLog(`🛡️ SECURITY REPORT: Level ${threats.threat_level}`);
        addLog(`⚠️ ANOMALIES: ${threats.anomalies_detected} detected.`);

        setTimeout(() => setIsScanning(false), 5000);

        if (threats.anomalies_detected > 0) {
          speak(`Atención. Detectadas ${threats.anomalies_detected} anomalías de seguridad. Nivel de amenaza: ${threats.threat_level}.`);
        } else {
          speak("Escaneo completado. Sin amenazas activas. Perímetro seguro.");
        }
      }

      // 2. LEGACY SIMULATION & UTILITIES (FRONTEND ONLY)
      // =================================================
      else if (lower.includes('excel') || lower.includes('planilla')) {
        addLog(`📊 AGENT: Generando Planilla Master...`);
        setDashboardViewMode('ANALYTICS');
        setShowOperationalDashboard(true);
        speak("Generando Planilla Máster. Datos sincronizados.");
      }
      else if (lower.includes('demo') || lower.includes('iniciar')) {
        runAppDemoMode();
      }
      else if (lower.includes('auto') || lower.includes('complete')) {
        runMacroSequence();
        setShowWebcam(prev => !prev);
      }
      else if (lower.includes('rodeo') || lower.includes('stress')) {
        addLog(`💥 AGENT: INICIANDO PROTOCOLO "RODEO" (STRESS TEST)...`);
        speak("Iniciando Protocolo Rodeo. Simulando carga masiva.");
        const simData = runSimulation();
        // ... (Keep existing injection logic simplified for minimal complexity) ...
        const mappedVehicles = simData.drivers.map(d => ({
          id: d.id, lat: d.location.lat, lng: d.location.lng, status: d.status.toLowerCase(),
          driver: d.name, plate: d.plate, goal: 'Agent', legal: '✅'
        }));
        // Simplification: Just load it
        setVehicles(mappedVehicles);
        setRequests(simData.services.map(s => ({
          id: s.id, lat: 6.2 + Math.random() * 0.1, lng: -75.5 + Math.random() * 0.1,
          status: s.status.toLowerCase(), client: s.clientId, type: 'CORP', fare: '$50k',
          financials: s.financials
        })));
        setTimeout(() => {
          setDashboardViewMode('ANALYTICS');
          setShowOperationalDashboard(true);
          speak("Simulación Rodeo finalizada.");
        }, 2000);
      }

      // 3. FALLBACK: ERP RAG BRAIN
      // =================================================
      else {
        const ragResponse = queryErpRag(cmd);
        if (ragResponse.type !== 'UNKNOWN') {
          addLog(`🧠 ERP RAG: ${ragResponse.answer}`);
          speak(ragResponse.answer);
        } else {
          addLog(`⚠️ AGENT: Command not recognized by Agentic Core.`);
          speak("Comando no reconocido. Intente 'Optimizar Rutas', 'Auditoría' o 'Seguridad'.");
        }
      }

    } catch (err) {
      console.error("Agent Error:", err);
      addLog(`❌ AGENT ERROR: ${err.message}`);
      speak("Error de conexión con el núcleo de inteligencia. Revise la consola.");
    }
  };





  // --- DASHBOARD ACTION: TACTICAL DRILL DOWN ---
  const handleDashboardDrillDown = (req) => {
    const vehicle = vehicles.find(v => v.id === req.assignedVehicle);
    if (vehicle) {
      setShowOperationalDashboard(false);
      setActiveReq({
        ...req,
        lat: vehicle.lat,
        lng: vehicle.lng,
        driverName: vehicle.driver,
        vehicleId: vehicle.id,
        vehicleType: vehicle.type
      });
      addLog(`🚁 AGENT: Iniciando vuelo táctico a Unidad ${vehicle.id} - ${vehicle.driver}`);
    } else {
      addLog(`⚠️ AGENT: La orden ${req.id} está en proceso de asignación. No hay telemetría activa.`);
    }
  };

  // --- RADAR LOOP ---
  // LOGIC MOVED TO RadarController COMPONENT (See line ~140)



  const handleGlobalSearch = (e, val = null) => {
    if (e.key === 'Enter') {
      const q = (val || searchTerm).toLowerCase();
      if (!q) return;

      // 1. Search Orders (Highest Priority)
      const foundOrder = requests.find(r =>
        r.id.toLowerCase().includes(q) ||
        r.paxName.toLowerCase().includes(q) ||
        (r.company && r.company.toLowerCase().includes(q)) ||
        (r.assignedVehicle && r.assignedVehicle.toLowerCase().includes(q)) ||
        (r.assignedDriver && r.assignedDriver.toLowerCase().includes(q))
      );

      if (foundOrder) {
        setActiveRequestId(foundOrder.id);
        setActiveTab('FLOTA');
        addLog(`🔍 BÚSQUEDA: OBJETIVO LOCALIZADO - ORDEN ${foundOrder.id}`);
        setSearchTerm('');
        return;
      }

      // 2. Search Vehicles Direct
      // Improved Logic: Handle "120", "TESO 120", "TESO-120"
      const numbers = q.replace(/\D/g, ''); // Extract just digits "120"
      const foundVehicle = vehicles.find(v => {
        const normId = v.id.toLowerCase().replace(/[^a-z0-9]/g, ''); // "teso120"
        const normQ = q.replace(/[^a-z0-9]/g, ''); // "teso120"

        // Match if exact alphanumeric match OR if the typed numbers match the ID (e.g. 120 matches TESO-120)
        return (normQ.length > 2 && normId.includes(normQ)) || (numbers.length >= 2 && v.id.includes(numbers));
      });

      if (foundVehicle) {
        setActiveTab('FLOTA');
        setHighlighted({ vehicleId: foundVehicle.id }); // TRIGGER SORT TO TOP

        if (foundVehicle.currentOrderId) {
          setActiveRequestId(foundVehicle.currentOrderId);
          addLog(`🔍 UNIDAD ${foundVehicle.id} ENCONTRADA CON SERVICIO ACTIVO.`);
        } else {
          addLog(`🔍 UNIDAD ${foundVehicle.id} LOCALIZADA. ESTADO: DISPONIBLE.`);
        }
        setSearchTerm('');
        return;
      }

      // 3. Search Clients
      const foundClient = clients.find(c => c.name.toLowerCase().includes(q));
      if (foundClient) {
        setActiveTab('CLIENTES');
        setClientSearch(foundClient.name);
        addLog(`🔍 CLIENTE ${foundClient.name} ENCONTRADO EN BASE DE DATOS.`);
        setSearchTerm('');
        return;
      }

      addLog(`⚠️ BÚSQUEDA: SIN RESULTADOS PARA "${searchTerm}"`);
    }
  };

  const handleRegisterClient = () => {
    if (!newClientForm.name || !newClientForm.nit) return;
    addLog(`📝 RECIBIDA SOLICITUD DE INSCRIPCIÓN: ${newClientForm.name.toUpperCase()}`);
    addLog(`🔍 CONSULTANDO RUES Y CÁMARA DE COMERCIO...`);

    setTimeout(() => {
      addLog(`✅ NIT ${newClientForm.nit} VALIDADO. ESTADO: ACTIVO.`);
      addLog(`🏢 EMPRESA "${newClientForm.name.toUpperCase()}" INGRESADA A BASE DE DATOS.`);

      const newCompany = {
        id: `NIT-${newClientForm.nit}`,
        name: newClientForm.name.toUpperCase(),
        type: newClientForm.type.toUpperCase(),
        tier: 'SILVER (NUEVO)',
        budget: `$${newClientForm.budget}M/mes`
      };

      setClients(prev => [newCompany, ...prev]);
      setShowRegisterForm(false);
      setNewClientForm({ name: '', nit: '', type: 'CORPORATIVO', budget: '' });
      setClientSearch(newCompany.name);
    }, 1500);
  };

  const simulateVipRequest = (client) => {
    // 1. IMMEDIATE: CREATE REQUEST IN 'VERIFYING' STATE
    addLog(`👔 RECIBIDA ORDEN DE: ${client.name}. INICIANDO PROTOCOLO.`);

    const vipReq = {
      id: `VIP-${client.name}-${Math.floor(Math.random() * 1000)}`,
      lat: 6.20 + (Math.random() * 0.01),
      lng: -75.57 + (Math.random() * 0.01),
      dest: 'Aeropuerto JMC',
      paxName: `Ejecutivo ${client.name}`,
      company: client.name, // NEW
      type: 'VIP DIAMANTE',
      fare: '$85.000',
      status: 'verifying', // NEW STATE
      pin: null
    };

    setRequests(prev => [vipReq, ...prev]);
    setActiveRequestId(vipReq.id); // AUTO FOCUS IMMEDIATELY

    // 2. SIMULATE CXC/PAYMENT VALIDATION (2 Seconds)
    setTimeout(() => {
      addLog(`💳 VALIDANDO MÉTODO DE PAGO: CUENTA CORPORATIVA (CXC)...`);

      setTimeout(() => {
        const pinCode = Math.floor(1000 + Math.random() * 9000);
        addLog(`📜 DIAN: PRE-FACTURA ELECTRÓNICA GENERADA (FE-${Math.floor(Math.random() * 10000)}).`);
        addLog(`✅ TRANSACCIÓN APROBADA. CARGADO A NIT ${client.id}. PIN: ${pinCode}`);
        addLog(`🚀 ASIGNANDO BLINDADA...`);

        if (vehicles.length > 0) {
          const driver = vehicles[0];
          setRequests(prev => prev.map(r =>
            r.id === vipReq.id
              ? {
                ...r,
                assignedVehicle: driver.id,
                assignedDriver: driver.driver,
                eta: 5,
                status: 'assigned',
                pin: pinCode // ASSIGN PIN
              }
              : r
          ));
        }
      }, 2000);
    }, 1000);
  };

  const simulateFlightLanding = (flight) => {
    addLog(`✈️ VUELO ${flight.id} ATERRIZÓ. GENERANDO ${flight.pax} BOOKINGS...`, { flightId: flight.id });
    const newRequests = Array.from({ length: flight.pax }).map((_, i) => ({
      id: `BK-${flight.id}-${100 + i}`,
      flightId: flight.id,
      lat: 6.17 + (Math.random() * 0.02),
      lng: -75.53 + (Math.random() * 0.02),
      dest: 'Hotel San Fernando',
      paxName: `Ejecutivo ${i + 1}`,
      type: 'AEROPUERTO VIP',
      fare: '$45.000'
    }));
    setRequests(prev => [...prev, ...newRequests]);
  };

  const simulateEafitOrder = () => {
    const eafitLoc = { lat: 6.2005, lng: -75.5785, id: 'EAFIT-VIP', dest: 'Rectoría', paxName: 'Rectoría EAFIT', type: 'INSTITUCIONAL', fare: '$12.000' };
    addLog('🚨 SOLICITUD PRIORITARIA DETECTADA: EAFIT');
    setRequests(prev => [...prev, eafitLoc]);

    setTimeout(() => {
      const available = vehicles.filter(v => v.status === 'available');
      if (available.length > 0) {
        const driver = available[0];
        addLog(`✅ UNIDAD ${driver.id} DESPACHADA A EAFIT (0.5km)`, { vehicleId: driver.id, requestId: 'EAFIT-VIP' });
        setVehicles(prev => prev.map(v => v.id === driver.id ? { ...v, status: 'busy' } : v));
        setRequests(prev => prev.map(r => r.id === 'EAFIT-VIP' ? { ...r, assignedVehicle: driver.id, assignedDriver: driver.driver, eta: 2 } : r));
      } else {
        addLog('⚠️ NO HAY UNIDADES CERCANAS DISPONIBLES.');
      }
    }, 1500);
  };



  /* --- INTELLIGENT DISPATCH CORE --- */
  const simulateFlightDisruption = () => {
    // 1. SELECT TARGET
    const targetIndex = Math.floor(Math.random() * futureBookings.length);
    const target = futureBookings[targetIndex];
    if (!target) return;

    // 2. DETERMINE SCENARIO (Delay vs Cancellation)
    const isCancelled = Math.random() > 0.7; // 30% Chance of full cancellation
    const newStatus = isCancelled ? '🔴 CANCELADO' : '🟠 RETRASADO (+1h)';

    // VISUAL ALERT
    addLog(`⚠️ ALERTA TORRE DE CONTROL: VUELO ${target.flight} REPORTA ${isCancelled ? 'CANCELACIÓN' : 'RETRASO SEVERO'}.`);

    if (isCancelled) {
      // SCENARIO A: CANCELLATION
      setTimeout(() => addLog(`🤖 IA DISPATCH: ANALIZANDO COSTO DE OPORTUNIDAD...`), 800);
      setTimeout(() => addLog(`❌ ORDEN ${target.id} ANULADA. UNIDAD ${target.assignedVehicle || 'PEND'} RE-ENRUTADA A ZONA DE ALTA DEMANDA.`), 1600);

      setFutureBookings(prev => prev.map((b, i) => {
        if (i === targetIndex) return { ...b, status: '🔴 CANCELADO (AI)', color: '#FF0000' };
        return b;
      }));

    } else {
      // SCENARIO B: DELAY (THE TETRIS MOVE)
      const newTime = '23:15';
      const newDriver = 'C. Rodriguez';

      setTimeout(() => addLog(`🤖 IA DISPATCH: VUELO RETRASADO. RE-EVALUANDO ASIGNACIÓN...`), 800);
      setTimeout(() => addLog(`🚫 CONFLICTO: J. PEREZ (ACTUAL) NO PUEDE CUBRIR NUEVO HORARIO.`), 1800);
      setTimeout(() => addLog(`✅ SWAP EJECUTADO: ASIGNADO A ${newDriver}. NOTIFICACIÓN DE ALERTAS EN PROCESO...`), 3000);

      // GENERATE REAL WHATSAPP LINK
      const whatsappMsg = `🚨 *TESO ALERT* %0AHola ${newDriver}, servicio REPROGRAMADO por retraso de vuelo. %0A%0A✈️ Vuelo: ${target.flight}%0A🕒 Nueva Hora: ${newTime}%0A📍 Ruta: ${target.route}%0A%0APor favor confirmar con 'OK'.`;

      // LOOKUP PHONE FOR DEMO
      const PHONE_BOOK = {
        'C. Rodriguez': '573000000004', // REPLACE WITH REAL NUMBER
        'J. Perez': '573000000005'      // REPLACE WITH REAL NUMBER
      };
      const driverPhone = PHONE_BOOK[newDriver] || '573000000000';

      setTimeout(() => {
        addLog(`📲 [CLICK PARA NOTIFICAR] -> https://wa.me/${driverPhone}?text=${whatsappMsg}`);
      }, 3500);

      setFutureBookings(prev => prev.map((b, i) => {
        if (i === targetIndex) return {
          ...b,
          status: '🟠 REPROG (AI)',
          time: `${newTime} (Nuevo)`,
          assignedDriver: newDriver, // SWAP
          assignedVehicle: 'TESO-99 (Backup)' // SWAP
        };
        return b;
      }));
    }
  };

  const autoAssign = () => {
    // Keep ref updated for external calls
    autoAssignRef.current = autoAssign;

    if (requests.length === 0) {
      addLog('NO HAY SOLICITUDES PENDIENTES.');
      return;
    }

    addLog(`🤖 IA: ANALIZANDO ${requests.length} VARIABLES DE ASIGNACIÓN...`);

    setTimeout(() => {
      let assignedCount = 0;
      let availVehicleIndex = 0;
      const availVehicles = vehicles.filter(v => v.status === 'available');
      const updatedVehicles = [...vehicles];

      const updatedRequests = requests.map((req) => {
        // If request is unassigned AND we still have vehicles left
        if (!req.assignedVehicle && availVehicleIndex < availVehicles.length) {
          const vehicle = availVehicles[availVehicleIndex];
          availVehicleIndex++; // Move to next available vehicle

          // Update vehicle status to busy
          const vehicleToUpdate = updatedVehicles.find(v => v.id === vehicle.id);
          if (vehicleToUpdate) {
            vehicleToUpdate.status = 'busy';
            vehicleToUpdate.currentOrderId = req.id; // AUDIT LINK
            vehicleToUpdate.currentClient = req.paxName; // AUDIT LINK
          }

          assignedCount++;
          return {
            ...req,
            assignedVehicle: vehicle.id,
            assignedDriver: vehicle.driver,
            eta: Math.floor(Math.random() * 5 + 2)
          };
        }
        return req;
      });

      setRoutes([]);
      setRequests(updatedRequests);
      setVehicles(updatedVehicles);

      addLog(`✅ PROCESO FINALIZADO: ${assignedCount} ÓRDENES VINCULADAS.`);
      addLog(`📂 AUDITORÍA: CADA ORDEN TIENE SU TRAZABILIDAD (VER EN MAPA).`);
    }, 1000);
  };






  if (showLanding && userRole === 'admin') {
    return (
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#00F0FF' }}>LOADING SYSTEM...</div>}>
        <LandingPage onEnter={() => setShowLanding(false)} />
      </Suspense>
    );
  }

  if (userRole === 'client') {
    return <ClientExperience />;
  }

  // --- RENDER PRESENTATION WITH LIVE DATA ---
  if (showPresentation) {
    return (
      <Presentation
        onClose={() => setShowPresentation(false)}
        systemData={{
          vehicles,
          requests,
          clients,
          logs,
          kpis: {
            activeOps: requests.length,
            onlineUnits: vehicles.length,
            avgEta: '4 min', // Dynamic calculation could go here
            ragStatus: 'ACTIVE_LEARNING'
          }
        }}
      />
    );
  }
  return (
    <main className="app-container">
      {/* --- LAYER 3: OPERATIONAL DASHBOARD (OVERLAY, MAP ALIVE BENEATH) --- */}
      {showOperationalDashboard && (
        <div className="hub-root" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden',
          zIndex: 99999 // HIGHEST Z-INDEX
        }}>
          {/* HUB NAVIGATION */}
          <nav style={{ padding: '0 20px', background: '#0B1120', borderBottom: '1px solid #00f2ff', display: 'flex', gap: '10px', alignItems: 'center', height: '60px', boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' }}>
            <div style={{ fontWeight: '900', color: '#00f2ff', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>TESO OPS</div>
            <div style={{ width: '1px', height: '20px', background: '#333' }}></div>
            <div style={{ color: '#fff', fontSize: '0.9rem', letterSpacing: '1px' }}>OPERACIÓN 35 / 80</div>

            <div style={{ marginLeft: 'auto' }}>
              <button onClick={() => setShowOperationalDashboard(false)} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>EXIT</button>
            </div>
          </nav>

          {/* CONTENT - SINGLE VIEW */}
          <div style={{ flex: 1, position: 'relative', overflow: 'auto', background: '#0B1120' }}>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#00F0FF' }}>LOADING DASHBOARD...</div>}>
              <OperationalDashboard
                vehicles={vehicles}
                requests={requests}
                simulationData={simulationContext}
                initialViewMode={dashboardViewMode}
                onRowClick={(row) => setActiveReq(row)}
                onSimulateStress={simularDiaCritico}
                onRunMacro={runMacroSequence}
                onClose={() => setShowOperationalDashboard(false)}
                onHome={() => { setShowLanding(true); setShowOperationalDashboard(false); }}
              />
            </Suspense>
          </div>
        </div>
      )}
      {/* GLOBAL PDF MODAL */}
      {previewPdf && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '90%', height: '90%', background: '#222', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px', background: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'gold', fontWeight: 'bold' }}>📄 VISOR DE FACTURA DIAN</span>
              <button onClick={() => setPreviewPdf(null)} style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' }}>CERRAR</button>
            </div>
            <iframe src={previewPdf} style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
          </div>
        </div>
      )}

      {/* VIEW SERVICE DETAIL MODAL (RESTORED) */}
      {activeReq && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
        }} onClick={() => setActiveReq(null)}>
          <div style={{
            background: '#0B1120', border: '1px solid #00f2ff', borderRadius: '12px',
            width: '500px', maxWidth: '90%', padding: '25px',
            boxShadow: '0 0 30px rgba(0, 242, 255, 0.3)', position: 'relative'
          }} onClick={e => e.stopPropagation()}>

            <button
              onClick={() => setActiveReq(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
            >✖</button>

            <h2 style={{ margin: '0 0 20px 0', color: '#00f2ff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              📝 DETALLE DE SERVICIO
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', color: '#ccc' }}>
              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>ID OPERACIÓN</small>
                <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '1.2rem' }}>{activeReq.id}</div>
              </div>
              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>PIN DE SEGURIDAD</small>
                <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>{activeReq.pin || '####'}</div>
              </div>

              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>EMPRESA / CLIENTE</small>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{activeReq.client || activeReq.paxName || 'N/A'}</div>
              </div>
              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>PASAJERO</small>
                <div style={{ color: '#fff' }}>{activeReq.pax || activeReq.paxName}</div>
              </div>

              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>CONDUCTOR ASIGNADO</small>
                <div style={{ color: '#39FF14' }}>{activeReq.assignedDriver || activeReq.driverName || 'Por Asignar'}</div>
              </div>
              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>VEHÍCULO</small>
                <div style={{ color: '#38bdf8' }}>{activeReq.assignedVehicle || activeReq.vehiclePlate || '---'}</div>
              </div>

              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>RUTA / DESTINO</small>
                <div style={{ color: '#fff' }}>{activeReq.route || activeReq.dest}</div>
              </div>
              <div>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>VUELO ASOCIADO</small>
                <div style={{ color: '#fbbf24' }}>{activeReq.flight || activeReq.flightId || 'N/A'}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#aaa' }}>VALOR SERVICIO</span>
                <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(activeReq.financials?.totalValue || activeReq.fare || 0)}
                </span>
              </div>
              <div style={{ height: '1px', background: '#333', margin: '10px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#aaa' }}>PAGO CONDUCTOR (80%)</span>
                <span style={{ color: '#39FF14' }}>
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(activeReq.financials?.driverPay || (activeReq.fare || 0) * 0.8)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, background: '#00f2ff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                📍 VER EN MAPA
              </button>
              <button style={{ flex: 1, background: '#333', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                📄 GENERAR VOUCHER
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQR && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 9999, background: 'rgba(0,0,0,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <h2 style={{ color: '#39FF14', marginBottom: '20px', fontFamily: 'Courier New' }}>📱 ESCANEA PARA ENTRAR</h2>
          <div style={{ background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 0 50px rgba(57, 255, 20, 0.4)' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://${serverIP}:5173/?role=client`} alt="QR Conexión" style={{ display: 'block' }} />
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', color: '#ccc' }}>
            <p>1. Conecta tu celular al WiFi.</p>
            <p>2. Abre la Cámara y escanea.</p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6 }}>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>IP Servidor:</span>
            <input
              value={serverIP}
              onChange={(e) => setServerIP(e.target.value)}
              style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '5px', width: '120px', textAlign: 'center' }}
            />
          </div>

          <button onClick={closeQR} className="btn-neon" style={{ marginTop: '30px', borderColor: 'red', color: 'red' }}>
            CERRAR ✖
          </button>
        </div>
      )}

      {/* LEFT SECTION (MAP) */}
      <section id="map-container" style={{ position: 'relative', background: '#0a0f1a', height: '100%' }}>

        {/* RADAR STATUS BADGE - REPOSITIONED */}
        <div className="map-ui-radar-badge" style={{ top: '60px', right: '20px', fontSize: '0.7rem' }}>
          📡 RADAR JMC: <span style={{ color: '#39FF14' }}>ONLINE</span>
        </div>

        {/* 4. BOTTOM CENTER COMMANDS (OPTIMIZE, AUDIT, SECURITY) */}
        {!showOperationalDashboard && !showLanding && (
          <div style={{
            position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '15px', zIndex: 999
          }}>
            {[
              { label: 'Optimize Routes', icon: '✨', color: '#00F0FF' },
              { label: 'Financial Audit', icon: '✨', color: '#FFD700' },
              { label: 'Security Scan', icon: '✨', color: '#39FF14' }
            ].map(btn => (
              <button key={btn.label} style={{
                background: 'rgba(0,0,0,0.8)', border: `1px solid ${btn.color}`, color: btn.color,
                padding: '10px 20px', borderRadius: '30px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.8rem',
                boxShadow: `0 0 10px ${btn.color}40`, backdropFilter: 'blur(4px)'
              }}>
                <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* 5. CHAT BAR (Ask Teso Operations AI...) */}
        {!showOperationalDashboard && !showLanding && (
          <div style={{
            position: 'absolute', bottom: '90px', right: '370px', zIndex: 999,
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.8)', border: '1px solid #00F0FF', borderRadius: '50px',
              padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px',
              width: '400px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
            }}>
              <span>🤖</span>
              <input
                placeholder="abre el excel de programacion..."
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
              />
              <span>🎤</span>
              <button style={{ background: '#00F0FF', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>➤</button>
            </div>
          </div>
        )}

        {/* 6. TOP LEFT BUTTONS (VISION IA, CONECTAR MOVIL) */}
        {!showOperationalDashboard && !showLanding && (
          <div style={{
            position: 'absolute', top: '100px', left: '20px', zIndex: 999,
            display: 'flex', flexDirection: 'column', gap: '15px'
          }}>
            <button style={{
              background: 'rgba(255, 0, 255, 0.1)', border: '1px solid #FF00FF', color: '#FF00FF',
              padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)'
            }}>
              🧠 VISIÓN IA
            </button>
            <button onClick={() => openQR()} style={{
              background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', color: '#fff',
              padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              📱 CONECTAR MÓVIL
            </button>
          </div>
        )}


        {/* --- LAYER 2: MAP HUB INTERFACE --- */}

        {/* 1. TOP NAVIGATION (GLASS TABS) */}
        {!showOperationalDashboard && !showLanding && (
          <div style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex', gap: '8px',
            maxWidth: '98%',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '5px'
          }}>
            {[
              { id: 'FLOTA', icon: '🚙' },
              { id: 'ORDENES', icon: '📦' },
              { id: 'VUELOS', icon: '✈️' },
              { id: 'CLIENTES', icon: '🏢' },
              { id: 'AGENDA', icon: '📅' },
              { id: 'FINANZAS', icon: '💰' },
              { id: 'MERCADEO', icon: '📢' },
              { id: 'CORE V4', icon: '🔋', action: () => { setShowOperationalDashboard(true); setDashboardViewMode('CORE'); addLog('🔋 CORE V4: SISTEMA CENTRAL ACTIVADO.'); } }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={tab.action || (() => setActiveTab(tab.id))}
                style={{
                  background: activeTab === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === tab.id ? '#00F0FF' : 'rgba(255, 255, 255, 0.85)',
                  border: activeTab === tab.id ? '1px solid #00F0FF' : '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 15px',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: activeTab === tab.id ? '0 0 15px rgba(0, 240, 255, 0.2)' : '0 2px 10px rgba(0,0,0,0.1)',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1.2em' }}>{tab.icon}</span>
                {tab.id}
              </button>
            ))}
          </div>
        )}

        {/* 2. RIGHT PANEL (TESO OPS CONSOLE) */}
        {!showOperationalDashboard && !showLanding && (
          <div style={{
            position: 'absolute', top: '0', right: '0', bottom: '0', width: '350px',
            background: 'rgba(5, 10, 20, 0.95)', borderLeft: '1px solid #333',
            zIndex: 1000, overflowY: 'auto', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', fontFamily: 'Courier New' }}>TESO OPS</h2>
                <small style={{ color: '#666', fontSize: '0.7rem' }}>UNIDADES: {vehicles.length} | OPS: {requests.length}</small>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button title="Home" onClick={() => setShowLanding(true)} style={{ background: '#333', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>🏠</button>
                <button title="Stress Mode" onClick={simularDiaCritico} style={{ background: '#333', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: 'red' }}>⚡</button>
              </div>
            </div>

            {/* SEARCH */}
            <input
              placeholder="🔍 Buscar Orden, Unidad, Cliente [ENTER]"
              onKeyDown={handleGlobalSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '4px', width: '100%' }}
            />

            {/* ACTION BUTTONS (BIG) */}
            <button onClick={() => runMacroSequence()} className="btn-neon" style={{ width: '100%', padding: '15px' }}>▶ INICIAR</button>
            <button onClick={() => autoAssignRef.current && autoAssignRef.current()} className="btn-neon" style={{ width: '100%', padding: '15px', color: '#39FF14', borderColor: '#39FF14' }}>⚡ DESPACHO INTELIGENTE</button>

            {/* CORPORATE INPUT (RESTORED) */}
            <div style={{ display: 'flex', gap: '5px' }}>
              <input
                placeholder="🏢 Escriba Empresa ("
                value={corpInput}
                onChange={(e) => setCorpInput(e.target.value)}
                style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', flex: 1, borderRadius: '4px' }}
              />
              <button
                onClick={() => {
                  addLog(`🚀 DEPLOY: Iniciando protocolo para ${corpInput || 'CLIENTE_GENERICO'}`);
                  if (corpInput.toLowerCase().includes('argos')) speak('Iniciando protocolo Argos. Despliegue de flota prioritario.');
                }}
                style={{ background: 'linear-gradient(45deg, #FF4444, #990000)', border: 'none', color: 'white', fontWeight: 'bold', padding: '0 15px', borderRadius: '4px', cursor: 'pointer' }}
              >
                🚀 DESPLEGAR
              </button>
            </div>

            {/* CONSOLE LOGS */}
            <div style={{ background: '#000', padding: '10px', borderRadius: '4px', height: '150px', overflowY: 'auto', border: '1px solid #00F0FF', fontSize: '0.7rem', fontFamily: 'monospace' }}>
              <strong style={{ color: '#00F0FF', display: 'block', marginBottom: '5px' }}>CONSOLE.LOG :: SYSTEM EVENTS</strong>
              {logs.map((l, i) => (
                <div key={i} style={{ marginBottom: '3px' }}>
                  <span style={{ color: '#666' }}>[{l.time}]</span> <span style={{ color: '#fff' }}>{l.msg}</span>
                </div>
              ))}
            </div>

            {/* LIST: VEHICLES (Simplified) */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <h3 style={{ color: '#333', borderBottom: '1px solid #333', fontSize: '0.8rem' }}>UNIDADES EN LÍNEA ({vehicles.filter(v => v.status === 'available').length})</h3>
              {vehicles.slice(0, 10).map(v => (
                <div key={v.id} style={{ padding: '8px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff' }}>{v.id}</span>
                  <span style={{ color: v.status === 'available' ? '#39FF14' : 'orange', fontSize: '0.7rem' }}>● {v.status.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* PITCH DECK & SOURCE FOOTER BUTTONS */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.open('https://github.com/ipanemausa/teso_core', '_blank')}
                style={{
                  flex: 1, padding: '12px',
                  background: '#1a1a1a', color: '#fff', fontWeight: 'bold',
                  border: '1px solid #333', borderRadius: '50px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                  fontSize: '0.8rem'
                }}
              >
                👾 SOURCE (GIT)
              </button>
              <button
                onClick={() => setShowPresentation(true)}
                style={{
                  flex: 1, padding: '12px',
                  background: '#FFD700', color: '#000', fontWeight: 'bold',
                  border: 'none', borderRadius: '50px',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                }}
              >
                ✨ PITCH DECK
              </button>
            </div>

          </div>
        )}

        {/* 3. V6 COMMAND DOCK (Floating Bottom) - KEEPING AS REQUESTED "WITH ALL BUTTONS" */}
        {!showOperationalDashboard && !showLanding && (
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            zIndex: 9999,
            padding: '12px 40px',
            borderRadius: '24px',
            background: 'rgba(10, 15, 30, 0.85)',
            border: '1px solid rgba(0, 242, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0, 242, 255, 0.1)',
            backdropFilter: 'blur(12px)'
          }}>


            {/* 1. HOME (Landing) */}
            <button
              onClick={() => setShowLanding(true)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                color: '#fff', transition: 'all 0.2s', width: '50px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#00f2ff'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#fff'; }}
              title="Volver al Inicio"
            >
              <div style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 5px rgba(0,242,255,0.5))' }}>🏠</div>
            </button>

            {/* 2. FIRE (Stress Mode - The "Red Button") */}
            <button
              onClick={simularDiaCritico}
              style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid #ff4444',
                borderRadius: '50%',
                width: '60px', height: '60px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ff4444', transition: 'all 0.2s',
                boxShadow: '0 0 15px rgba(255, 68, 68, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.background = 'rgba(255, 68, 68, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 68, 68, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.2)';
              }}
              title="SIMULACRO DÍA CRÍTICO (Stress Test)"
            >
              <div style={{ fontSize: '2rem' }}>🔥</div>
            </button>

            {/* 3. CORE (Dashboard/Table) */}
            <button
              onClick={() => setShowOperationalDashboard(true)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                color: '#fff', transition: 'all 0.2s', width: '50px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#ffd700'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#fff'; }}
              title="Abrir CORE V4 (Sistema Central)"
            >
              <div style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 5px rgba(0, 255, 128, 0.5))' }}>🔋</div>
            </button>

          </div>
        )}

        {/* MAP CONTAINER (RESTORED) */}
        <ErrorBoundary>
          <MapContainer key="teso-map-v1" center={[6.23, -75.58]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              className="cyberpunk-map-tiles"
              attribution='© Osm'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* ATOMIC MAP: ALL CHILDREN REMOVED FOR DEBUGGING */}
          </MapContainer>
        </ErrorBoundary>





        <div className="map-ui-top-left" style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className={`btn-neon ${isHeatmap ? 'active' : ''}`} onClick={() => setIsHeatmap(!isHeatmap)} style={{ borderColor: '#A020F0', color: isHeatmap ? '#fff' : '#A020F0' }}>
            🧠 VISIÓN IA
          </button>


          <button className="btn-neon" onClick={openQR} style={{ borderColor: '#fff', color: '#fff', fontSize: '0.8rem' }}>
            📱 CONECTAR MÓVIL
          </button>
        </div>

        {/* AGENTIC NAVIGATION BAR - MOVED INSIDE MAP FOR BETTER CENTERING */}
        <Suspense fallback={null}>
          {/* <AgenticCommandBar onCommand={handleAgentCommand} /> */}
        </Suspense>
      </section >

      {/* RIGHT SECTION (SIDEBAR) */}
      < aside style={{ background: '#050A14', padding: '20px', borderLeft: '1px solid #333', color: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column' }
      }>
        {/* HEADER WITH SEARCH AND BACK BUTTONS */}
        < div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h1 style={{ color: '#FF5722', margin: 0 }}>TESO OPS</h1>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>
                UNIDADES: {vehicles.length} | OPS ACTIVAS: {requests.length}
              </div>
            </div>
            <button title="Volver al Inicio" onClick={() => setShowLanding(true)} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)', border: '1px solid #FF5722', color: '#FF5722', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏠</button>
          </div>

          {/* SEARCH BAR */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="🔍 Buscar Orden, Unidad, Cliente [ENTER]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleGlobalSearch}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '4px',
                border: '1px solid #333', background: 'rgba(255,255,255,0.05)', color: '#fff'
              }}
            />

            {/* SEARCH AUTOCOMPLETE DROPDOWN */}
            {searchTerm.length >= 3 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#050A14', border: '1px solid #39FF14',
                zIndex: 20000, maxHeight: '300px', overflowY: 'auto', // Increased Z-Index
                boxShadow: '0 4px 20px rgba(0,0,0,0.8)', borderRadius: '0 0 4px 4px'
              }}>
                {/* 1. ORDERS */}
                <div style={{ padding: '5px 10px', background: '#222', color: '#aaa', fontSize: '0.65rem', fontWeight: 'bold' }}>ORDENES DE SERVICIO (OPS)</div>
                {requests.filter(r => r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.company?.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
                  <div key={r.id}
                    onClick={() => { setActiveRequestId(r.id); setActiveTab('FLOTA'); setSearchTerm(''); }}
                    style={{ padding: '8px', borderBottom: '1px solid #222', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#222'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.8rem' }}>📦 {r.id}</div>
                      <div style={{ color: '#888', fontSize: '0.7rem' }}>{r.company} • {r.paxName}</div>
                    </div>
                    <div style={{ color: r.status === 'assigned' ? '#39FF14' : 'orange', fontSize: '0.7rem' }}>{r.status}</div>
                  </div>
                ))}

                {/* 2. VEHICLES */}
                <div style={{ padding: '5px 10px', background: '#222', color: '#aaa', fontSize: '0.65rem', fontWeight: 'bold', borderTop: '1px solid #333' }}>UNIDADES / CONDUCTORES</div>
                {vehicles.filter(v => v.id.toLowerCase().includes(searchTerm.toLowerCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                  <div key={v.id}
                    onClick={() => { setHighlighted({ vehicleId: v.id }); setActiveTab('FLOTA'); setSearchTerm(''); addLog(`🔍 UNIDAD ${v.id} SELECCIONADA.`); }}
                    style={{ padding: '8px', borderBottom: '1px solid #222', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', background: '#0a0f1a' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#222'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0a0f1a'}>
                    <div>
                      <div style={{ color: '#00F0FF', fontSize: '0.8rem' }}>🚙 {v.id}</div>
                      <div style={{ color: '#666', fontSize: '0.7rem' }}>{v.driver}</div>
                    </div>
                    <div style={{ color: v.status === 'available' ? '#39FF14' : 'orange', fontSize: '0.7rem' }}>{v.status}</div>
                  </div>
                ))}

                {/* 3. CLIENTS/COMPANIES */}
                <div style={{ padding: '5px 10px', background: '#222', color: '#aaa', fontSize: '0.65rem', fontWeight: 'bold', borderTop: '1px solid #333' }}>BASE DE DATOS CLIENTES</div>
                {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => {
                  const matchedCorp = corporateAccounts.find(acc => acc.name.includes(c.name) || c.name.includes(acc.name));
                  return (
                    <div key={c.id}
                      onClick={() => { setActiveTab('CLIENTES'); setClientSearch(c.name); setSearchTerm(''); }}
                      style={{ padding: '8px', borderBottom: '1px solid #222', cursor: 'pointer', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#222'}
                      onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                      <div>
                        <div style={{ color: 'gold', fontSize: '0.8rem' }}>🏢 {c.name}</div>
                        <div style={{ color: '#888', fontSize: '0.7rem' }}>{c.type} • {c.tier}</div>
                        {matchedCorp && <div style={{ color: '#39FF14', fontSize: '0.65rem' }}>● Al día • {matchedCorp.last}</div>}
                      </div>

                      {matchedCorp ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Don't close search
                            setPreviewPdf(matchedCorp.pdf);
                            setSearchTerm(''); // Close search
                          }}
                          style={{
                            background: 'rgba(255, 215, 0, 0.1)', border: '1px solid gold', color: 'gold',
                            fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1
                          }}>
                          <span style={{ fontSize: '0.9rem' }}>📄</span>
                          <span>DIAN</span>
                        </button>
                      ) : (
                        <div style={{ color: '#444', fontSize: '0.6rem' }}>--</div>
                      )}
                    </div>
                  );
                })}

                {/* 4. FLIGHTS (LIVE & BOOKINGS) */}
                <div style={{ padding: '5px 10px', background: '#222', color: '#aaa', fontSize: '0.65rem', fontWeight: 'bold', borderTop: '1px solid #333' }}>VUELOS EN RADAR</div>
                {planes.filter(p => p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.airline.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                  <div key={p.id}
                    onClick={() => { setActiveTab('FLOTA'); setSearchTerm(''); addLog(`✈️ RADAR: VUELO ${p.id} EN SEGUIMIENTO.`); }}
                    style={{ padding: '8px', borderBottom: '1px solid #222', cursor: 'pointer', background: '#050A10' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#222'}
                    onMouseLeave={e => e.currentTarget.style.background = '#050A10'}>
                    <div style={{ color: '#00F0FF', fontSize: '0.8rem' }}>✈️ {p.id} ({p.airline})</div>
                    <div style={{ color: '#888', fontSize: '0.7rem' }}>Alt: {p.alt}ft • Spd: {p.spd}kts</div>
                  </div>
                ))}

                {searchTerm.length >= 3 &&
                  ![...requests, ...vehicles, ...clients, ...planes].some(i => (i.id || i.name || '').toLowerCase().includes(searchTerm.toLowerCase())) && (
                    <div style={{ padding: '10px', color: '#666', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center' }}>
                      No se encontraron resultados
                    </div>
                  )}
              </div>
            )}
          </div>
        </div >

        {/* TOP BACK BUTTON (Redundant visibility) */}
        {
          activeTab !== 'FLOTA' && (
            <button
              onClick={() => setActiveTab('FLOTA')}
              style={{
                background: 'transparent', border: '1px solid #333', color: '#aaa',
                padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '0.8rem', marginBottom: '15px', width: '100%', textAlign: 'left'
              }}
            >
              ↩ Volver a Operaciones
            </button>
          )
        }

        <div style={{ marginBottom: '10px' }}></div>

        {/* CONTENT TABS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {activeTab === 'FLOTA' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className={`btn-neon ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
                {isLive ? '⏸ PAUSAR' : '▶ INICIAR'}
              </button>
              <button className="btn-neon" onClick={autoAssign} disabled={requests.length === 0}>
                ⚡ DESPACHO INTELIGENTE
              </button>
              {/* CORPORATE SIMULATOR CONTROLS */}
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="text"
                  placeholder="🏢 Escriba Empresa (Ej: POSTOBON)"
                  value={corpInput}
                  onChange={(e) => setCorpInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') document.getElementById('btnDesplegar').click();
                  }}
                  style={{
                    flex: 1, background: '#111', color: '#fff', border: '1px solid #333',
                    padding: '8px', borderRadius: '4px'
                  }}
                />
                <button
                  id="btnDesplegar"
                  className="btn-neon btn-alert"
                  style={{ flex: 1, fontSize: '0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}
                  onClick={() => {
                    if (!corpInput) return;

                    const corp = corpInput.toUpperCase().trim();

                    const CORPORATE_LOCS = {
                      'EAFIT': { lat: 6.2005, lng: -75.5785, dest: 'Rectoría EAFIT' },
                      'BANCOLOMBIA': { lat: 6.2230, lng: -75.5750, dest: 'Dir. General Bancolombia' },
                      'ARGOS': { lat: 6.2050, lng: -75.5700, dest: 'Torre Argos - Santillana' },
                      'SURA': { lat: 6.2080, lng: -75.5680, dest: 'Casa Matriz SURA' },
                      'NUTRESA': { lat: 6.2110, lng: -75.5720, dest: 'Nutresa Santillana' },
                      'EXITO': { lat: 6.1750, lng: -75.5900, dest: 'Casa Matriz Grupo Éxito' },
                      'ISA': { lat: 6.1950, lng: -75.5600, dest: 'Sede ISA' }
                    };

                    let target;
                    if (CORPORATE_LOCS[corp]) {
                      target = CORPORATE_LOCS[corp];
                    } else {
                      // RANDOM GEOCODING SIMULATION FOR UNKNOWN COMPANIES
                      // Center roughly around chaotic business district (Poblado/Milla de Oro)
                      target = {
                        lat: 6.20 + (Math.random() * 0.03 - 0.015),
                        lng: -75.57 + (Math.random() * 0.03 - 0.015),
                        dest: `Sede Principal ${corp}`
                      };
                      addLog(`📡 GEO: NUEVA SEDE DETECTADA PARA ${corp}. COORDENADAS CALCULADAS.`);
                    }

                    const vipLoc = {
                      id: `${corp.substring(0, 3)}-VIP-${Math.floor(Math.random() * 1000)}`,
                      lat: target.lat,
                      lng: target.lng,
                      dest: target.dest,
                      paxName: `Ejecutivo ${corp}`,
                      company: corp, // Crucially sets company for analysis
                      type: 'INSTITUCIONAL VIP',
                      fare: '$35.000',
                      status: 'verifying'
                    };

                    addLog(`🚨 ALERTA CORPORATIVA: ${corp} REQUIERE MOVILIDAD.`);
                    setRequests(prev => [vipLoc, ...prev]);

                    setTimeout(() => {
                      const available = vehicles.filter(v => v.status === 'available');
                      if (available.length > 0) {
                        const driver = available[0];
                        addLog(`✅ UNIDAD ${driver.id} ASIGNADA A ${corp}.`, { vehicleId: driver.id, requestId: vipLoc.id });
                        setVehicles(prev => prev.map(v => v.id === driver.id ? { ...v, status: 'busy', currentOrderId: vipLoc.id, currentClient: corp } : v));
                        setRequests(prev => prev.map(r => r.id === vipLoc.id ? { ...r, status: 'assigned', assignedVehicle: driver.id, assignedDriver: driver.driver, eta: 3, pin: Math.floor(1000 + Math.random() * 9000) } : r));
                      } else {
                        addLog('⚠️ TRAMANDO RECURSOS EXTERNOS (SISTEMA SATURADO).');
                      }
                    }, 1000);

                    setCorpInput(''); // Clear controlled input
                  }}
                >
                  🚀 DESPLEGAR
                </button>
              </div>


              <div style={{ marginTop: '10px', background: '#000', border: '1px solid #333', padding: '10px', height: '150px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.7rem', color: '#ccc' }}>
                <div style={{ color: '#00F0FF', marginBottom: '5px', borderBottom: '1px solid #333' }}>CONSOLE.LOG :: SYSTEM EVENTS</div>
                {logs.map((l, i) => (
                  <div key={i} style={{ marginBottom: '2px' }}>
                    <span style={{ color: '#666' }}>[{l.time}]</span> {l.msg}
                  </div>
                ))}
                {logs.length === 0 && <div style={{ color: '#444' }}>_ Esperando eventos...</div>}
              </div>

              <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                <h4 style={{ color: '#666' }}>UNIDADES EN LÍNEA ({vehicles.length})</h4>
                <div style={{ flex: 1, overflowY: 'auto', minHeight: '300px' }}>
                  {[...vehicles] // Create a copy to avoid mutating state
                    .sort((a, b) => {
                      // 1. Highlighted moves to TOP
                      if (highlighted?.vehicleId === a.id) return -1;
                      if (highlighted?.vehicleId === b.id) return 1;
                      // 2. Busy status moves UP (Secondary priority)
                      if (a.status === 'busy' && b.status !== 'busy') return -1;
                      if (a.status !== 'busy' && b.status === 'busy') return 1;
                      // 3. Alphabetical ID
                      return a.id.localeCompare(b.id);
                    })
                    .map(v => (
                      <div
                        key={v.id}
                        onMouseEnter={(e) => {
                          if (v.status === 'busy' && v.currentOrderId) {
                            const req = requests.find(r => r.id === v.currentOrderId);
                            if (req) {
                              setHoveredOrder({ ...req, x: e.clientX, y: e.clientY });
                              // REMOVED AUTO-HIGHLIGHT TO PREVENT LIST RE-ORDERING JUMPS
                            }
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredOrder(null);
                        }}
                        style={{
                          borderLeft: v.status === 'available' ? '3px solid #39FF14' : '3px solid orange',
                          // Visual cue for highlighted item
                          background: highlighted?.vehicleId === v.id ? '#222' : '#111',
                          border: highlighted?.vehicleId === v.id ? '1px solid #00F0FF' : 'none',
                          padding: '8px', marginBottom: '8px', fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: highlighted?.vehicleId === v.id ? '#00F0FF' : '#fff' }}>{v.id}</strong>
                          <span style={{ color: v.status === 'available' ? '#39FF14' : 'orange' }}>
                            {v.status === 'available' ? '● DISPONIBLE' : '● EN RUTA'}
                          </span>
                        </div>
                        <div style={{ color: '#ccc' }}>Cond: {v.driver}</div>

                        {/* EXPANDED LIVE CONTROL CENTER */}
                        {highlighted?.vehicleId === v.id && (
                          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(5, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px' }}>

                            {/* TELEMETRY HEADER */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                              <small style={{ color: '#00F0FF', letterSpacing: '1px' }}>📡 TELEMETRÍA EN VIVO</small>
                              <span style={{ fontSize: '0.6rem', background: 'red', color: 'white', padding: '2px 6px', borderRadius: '4px', animation: 'pulse 1s infinite' }}>● LIVE</span>
                            </div>

                            {/* DATA GRID */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', marginBottom: '15px' }}>
                              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '4px' }}>
                                <div style={{ color: '#aaa', fontSize: '0.6rem' }}>VELOCIDAD</div>
                                <div style={{ color: '#fff' }}>{Math.floor(20 + Math.random() * 40)} km/h</div>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '4px' }}>
                                <div style={{ color: '#aaa', fontSize: '0.6rem' }}>BATERÍA / GAS</div>
                                <div style={{ color: '#39FF14' }}>84%</div>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '4px' }}>
                                <div style={{ color: '#aaa', fontSize: '0.6rem' }}>UBICACIÓN</div>
                                <div style={{ color: '#fff' }}>Poblado, Cra 43A</div>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '4px' }}>
                                <div style={{ color: '#aaa', fontSize: '0.6rem' }}>TURNO</div>
                                <div style={{ color: 'gold' }}>05:12h Activo</div>
                              </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button className="btn-neon" style={{ flex: 1, fontSize: '0.65rem', padding: '8px' }}>
                                📹 CAM
                              </button>
                              <button className="btn-neon" style={{ flex: 1, fontSize: '0.65rem', padding: '8px', borderColor: '#39FF14', color: '#39FF14' }}>
                                📞 LLAMAR
                              </button>
                              <button className="btn-neon" style={{ flex: 1, fontSize: '0.65rem', padding: '8px', borderColor: 'gold', color: 'gold' }}>
                                📋 PERFIL
                              </button>
                            </div>

                            {/* ADMIN DOCUMENTATION */}
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #333', fontSize: '0.65rem', color: '#666', textAlign: 'center' }}>
                              DOCS: SOAT (Vigente) • RTM (Vigente) • JUDICIAL (Clean)
                            </div>
                          </div>
                        )}

                        {v.status === 'busy' && v.currentClient && (
                          <div style={{ marginTop: '4px', padding: '4px', background: 'rgba(255, 165, 0, 0.1)', border: '1px dashed orange', borderRadius: '4px' }}>
                            <div style={{ color: 'orange', fontSize: '0.7rem' }}>ORDEN ACTIVA:</div>
                            <div style={{ color: '#fff' }}>{v.currentClient}</div>
                            {v.currentOrderId && <div style={{ color: '#888', fontSize: '0.7rem' }}>REF: {v.currentOrderId.split('-').pop()}</div>}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ORDENES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* ORDERS TOOLBAR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>PLANILLA DE VIAJES (MASTER)</h3>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => setFilterToday(!filterToday)}
                    className="btn-neon"
                    style={{
                      fontSize: '0.7rem', padding: '5px 10px',
                      borderColor: filterToday ? '#39FF14' : '#555',
                      color: filterToday ? '#39FF14' : '#888',
                      background: filterToday ? 'rgba(57, 255, 20, 0.1)' : 'transparent'
                    }}>
                    {filterToday ? '📅 MOSTRANDO: HOY' : '📅 MOSTRANDO: TODO'}
                  </button>
                </div>
              </div>

              {/* ORDERS SEARCH */}
              <input
                type="text"
                placeholder="🔍 Buscar Orden, Pax, Empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleGlobalSearch}
                style={{
                  background: '#000', border: '1px solid #333',
                  color: '#fff', padding: '6px 10px', borderRadius: '4px',
                  fontSize: '0.8rem', width: '100%', marginBottom: '5px'
                }}
              />

              {/* LIST CONTAINER */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(() => {
                  // 1. UNIFY LISTS
                  // Current Requests (Assume TODAY)
                  const liveOrders = requests.map(r => ({ ...r, dateSort: 0, timeSort: r.flightTime || 'Now', source: 'LIVE', dateLabel: 'HOY' }));
                  // Future Bookings
                  const futureOrders = futureBookings.map(b => ({
                    ...b,
                    paxName: b.pax, // Normalize fields
                    dest: b.route,
                    fare: 'Por Cotizar',
                    dateSort: b.date === 'Mañana' ? 1 : b.date === 'Pasado Mañana' ? 2 : 0,
                    timeSort: b.time,
                    source: 'FUTURE',
                    dateLabel: b.date
                  }));

                  // 2. FILTER & SORT
                  let allOrders = [...liveOrders, ...futureOrders];

                  // Filter Completed/Cancelled (User requirement: "Executed disappear")
                  allOrders = allOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled_client');

                  if (filterToday) {
                    allOrders = allOrders.filter(o => o.dateSort === 0);
                  }

                  // 3. SEARCH FILTER
                  if (searchTerm) {
                    const lowerTerm = searchTerm.toLowerCase();
                    allOrders = allOrders.filter(o =>
                      o.id.toLowerCase().includes(lowerTerm) ||
                      (o.paxName && o.paxName.toLowerCase().includes(lowerTerm)) ||
                      (o.company && o.company.toLowerCase().includes(lowerTerm))
                    );
                  }

                  // 3. ADAPTIVE ROLE FILTER
                  // ADMIN: Sees EVERYTHING (Master Database)
                  // OTHERS: See only relevant orders (Simplified)
                  if (userRole !== 'admin') {
                    // For regular users (Drivers/Clients), keep it simple or filtered
                    // Reverting to standard view logic for non-admins if needed, 
                    // but for now, we assume this advanced panel is the "Dispatch View" itself.
                    // If we want to hide it completely for drivers, we can return null,
                    // but likely dispatchers share this view. 
                    // Let's keep it visible but maybe clearer it's the master list.
                  }

                  // Sort: Date asc, then Time asc
                  allOrders.sort((a, b) => {
                    if (a.dateSort !== b.dateSort) return a.dateSort - b.dateSort;
                    // Parse times for correct hour sort (e.g. 14:30 vs 08:00)
                    const timeA = a.timeSort || '00:00';
                    const timeB = b.timeSort || '00:00';
                    return timeA.localeCompare(timeB);
                  });

                  if (allOrders.length === 0) return <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>NO HAY ÓRDENES PENDIENTES</div>;

                  return allOrders.map(r => (
                    <div
                      key={r.id}
                      style={{
                        borderLeft: r.source === 'LIVE' ? (r.status === 'assigned' ? '3px solid #39FF14' : '3px solid orange') : '3px solid #00F0FF',
                        background: '#111', padding: '10px', position: 'relative', cursor: 'pointer',
                        opacity: r.source === 'FUTURE' ? 0.8 : 1
                      }}
                      onMouseEnter={(e) => r.source === 'LIVE' && setHoveredOrder({ ...r, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setHoveredOrder(null)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ color: '#fff' }}>#{r.id.split('-').pop()}</strong>
                          <span style={{ fontSize: '0.7rem', background: '#222', padding: '2px 6px', borderRadius: '4px', color: '#ccc' }}>
                            {r.dateLabel} - {r.timeSort || 'ASAP'}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          color: r.status === 'assigned' ? '#39FF14' : r.status === 'PROGRAMADO' ? '#00F0FF' : 'orange',
                          border: `1px solid ${r.status === 'assigned' ? '#39FF14' : r.status === 'PROGRAMADO' ? '#00F0FF' : 'orange'}`,
                          padding: '2px 5px', borderRadius: '4px'
                        }}>
                          {r.status === 'assigned' ? '● EN RUTA' : r.status === 'verifying' ? '⏳ VERIF.' : r.status}
                        </span>
                      </div>

                      <div style={{ color: '#ccc', fontSize: '0.9rem' }}>👤 {r.paxName}</div>
                      <div style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>{r.dest}</div>

                      {/* FUTURE OR ASSIGNED DETAILS */}
                      {r.assignedDriver && (
                        <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#aaa' }}>
                          🚙 {r.assignedVehicle} ({r.assignedDriver})
                        </div>
                      )}

                      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                        {r.source === 'LIVE' ? (
                          <>
                            <button
                              className="btn-neon"
                              style={{ flex: 1, fontSize: '0.7rem', padding: '5px' }}
                              onClick={() => setActiveRequestId(r.id)}
                            >
                              📍 VER / MAPA
                            </button>
                            <button
                              className="btn-neon"
                              style={{ flex: 1, fontSize: '0.7rem', padding: '5px', borderColor: '#39FF14', color: '#39FF14' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const msg = `Orden ${r.id}: Unidad ${r.assignedVehicle || 'N/A'} en ruta. Info?`;
                                window.open(`https://wa.me/573000000000?text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                            >
                              📞 WA
                            </button>
                            <button
                              className="btn-neon"
                              style={{ flex: 1, fontSize: '0.7rem', padding: '5px', borderColor: '#FF5722', color: '#FF5722' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Mark as completed logic
                                addLog(`✅ SERVICIO ${r.id} FINALIZADO EXITOSAMENTE.`);
                                setRequests(prev => prev.filter(req => req.id !== r.id));
                              }}
                            >
                              ✅ FIN
                            </button>
                          </>
                        ) : (
                          <button className="btn-neon" style={{ width: '100%', fontSize: '0.7rem', padding: '5px', borderColor: '#aaa', color: '#aaa' }}>
                            🗓 GESTIONAR RESERVA
                          </button>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* 3. OPERATIONAL DASHBOARD (Overlay Layer) */}
          {activeTab === 'VUELOS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* OPERATIONAL CONTROLS */}
              <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '5px' }}>
                <button className="btn-neon btn-alert" style={{ width: '100%', borderColor: 'red', color: 'red', fontSize: '0.8rem' }} onClick={simularDiaCritico}>
                  🚨 SIMULACRO: DÍA CRÍTICO (60 OPS)
                </button>
              </div>

              {/* VUELOS SEARCH */}
              <input
                type="text"
                placeholder="🔍 Buscar Vuelo, Ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleGlobalSearch}
                style={{
                  background: '#000', border: '1px solid #333',
                  color: '#fff', padding: '6px 10px', borderRadius: '4px',
                  fontSize: '0.8rem', width: '100%'
                }}
              />

              {/* FIDS HEADER (TABS) */}
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => setFlightTabMode('ARRIVALS')}
                  style={{ flex: 1, padding: '8px', background: flightTabMode === 'ARRIVALS' ? '#00F0FF' : '#111', color: flightTabMode === 'ARRIVALS' ? '#000' : '#888', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  🛬 LLEGADAS
                </button>
                <button
                  onClick={() => setFlightTabMode('DEPARTURES')}
                  style={{ flex: 1, padding: '8px', background: flightTabMode === 'DEPARTURES' ? '#00F0FF' : '#111', color: flightTabMode === 'DEPARTURES' ? '#000' : '#888', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  🛫 SALIDAS
                </button>
              </div>

              {/* FIDS TABLE */}
              <div style={{ background: '#050A10', border: '1px solid #333', minHeight: '300px' }}>
                <div style={{ display: 'flex', padding: '5px 10px', color: '#666', fontSize: '0.7rem', borderBottom: '1px solid #333' }}>
                  <span style={{ width: '40px' }}>HORA</span>
                  <span style={{ width: '60px' }}>VUELO</span>
                  <span style={{ flex: 1 }}>{flightTabMode === 'ARRIVALS' ? 'ORIGEN' : 'DESTINO'}</span>
                  <span style={{ width: '30px' }}>PTA</span>
                  <span style={{ width: '80px', textAlign: 'right' }}>ESTADO</span>
                </div>

                <div style={{ overflowY: 'auto', maxHeight: '450px' }}>
                  {(() => {
                    const now = new Date();
                    const flights = [];
                    const CITIES = ['MIAMI', 'MADRID', 'BOGOTA', 'PANAMA', 'LIMA', 'MEXICO', 'NEW YORK', 'CANCUN', 'SANTIAGO', 'SAO PAULO'];
                    const AIRLINES = ['AA', 'AV', 'IB', 'CM', 'LA', 'DL', 'NK', 'AM'];

                    // Generate 18 Dynamic Flights (Mixed Arrivals/Departures)
                    for (let i = 0; i < 18; i++) {
                      const offset = (i * 8) - 20; // Start 20 mins ago, extend 2 hours
                      const flightTime = new Date(now.getTime() + offset * 60000);
                      const hours = flightTime.getHours().toString().padStart(2, '0');
                      const minutes = flightTime.getMinutes().toString().padStart(2, '0');
                      const timeStr = `${hours}:${minutes}`;

                      const isArrival = i % 2 === 0;
                      const type = isArrival ? 'ARRIVALS' : 'DEPARTURES';
                      const id = `${AIRLINES[i % AIRLINES.length]}${100 + Math.floor(Math.random() * 900)}`;
                      const city = CITIES[i % CITIES.length];
                      const gate = `${isArrival ? 'A' : 'B'}${1 + (i % 8)}`;

                      // Smart Status Logic
                      let status = 'PROGRAMADO';
                      let color = '#aaa';

                      if (offset < 0) {
                        status = isArrival ? 'ATERRIZÓ' : 'DESPEGÓ';
                        color = '#39FF14'; // Green
                      } else if (offset < 15) {
                        status = isArrival ? 'EN APROX' : 'EMBARCANDO';
                        color = '#00F0FF'; // Cyan
                      } else if (offset < 45) {
                        status = 'EN TIEMPO';
                        color = '#00F0FF';
                      } else if (i % 7 === 0) { // Random delay
                        status = 'RETRASADO';
                        color = 'red';
                      }

                      flights.push({ time: timeStr, id, city, gate, status, type, color });
                    }

                    return flights.filter(f =>
                      f.type === flightTabMode &&
                      (f.id.toLowerCase().includes(searchTerm.toLowerCase()) || f.city.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map((f, i) => {
                      const tesoOps = requests.filter(r => r.flightId === f.id).length; // Link to real ops
                      // Enhance with random Teso Ops if none match (for demo vibe)
                      const displayOps = tesoOps > 0 ? tesoOps : (i % 3 === 0 ? Math.floor(Math.random() * 4) + 1 : 0);

                      return (
                        <div key={i} className="fids-row" style={{
                          display: 'flex', padding: '8px 10px',
                          borderBottom: '1px solid #222',
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                            if (displayOps > 0) {
                              addLog(`✈️ VUELO ${f.id}: ${displayOps} OPS GESTIONADAS.`);
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
                          }}
                        >
                          <span style={{ width: '40px', color: '#fff' }}>{f.time}</span>
                          <span style={{ width: '60px', color: '#00F0FF', fontWeight: 'bold' }}>{f.id}</span>
                          <span style={{ flex: 1, color: '#ddd' }}>{f.city}</span>
                          <span style={{ width: '30px', color: '#aaa' }}>{f.gate}</span>
                          <span style={{ width: '80px', textAlign: 'right', color: f.color, fontWeight: 'bold' }}>
                            {f.status === 'RETRASADO' ? <span className="blink">{f.status}</span> : f.status}
                          </span>

                          {displayOps > 0 && (
                            <div style={{
                              position: 'absolute', right: '10px', marginTop: '20px',
                              background: 'orange', color: '#000', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold', zIndex: 10
                            }}>
                              OPS: {displayOps}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CLIENTES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input placeholder="Buscar..." style={{ flex: 1, background: '#111', border: '1px solid #333', color: '#fff', padding: '5px' }} onChange={e => setClientSearch(e.target.value)} onKeyDown={(e) => handleGlobalSearch(e, clientSearch)} />
                <button className="btn-neon" onClick={() => setShowRegisterForm(!showRegisterForm)}>+</button>
              </div>

              {showRegisterForm && (
                <div style={{ padding: '10px', border: '1px solid #00F0FF', background: 'rgba(0,0,50,0.5)' }}>
                  <h4>NUEVO CLIENTE</h4>
                  <input placeholder="Nombre" style={{ width: '100%', marginBottom: '5px' }} onChange={e => setNewClientForm({ ...newClientForm, name: e.target.value })} />
                  <input placeholder="NIT" style={{ width: '100%', marginBottom: '5px' }} onChange={e => setNewClientForm({ ...newClientForm, nit: e.target.value })} />
                  <button className="btn-neon" style={{ width: '100%' }} onClick={handleRegisterClient}>REGISTRAR</button>
                </div>
              )}

              {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map(c => (
                <div key={c.id} style={{ padding: '10px', background: '#111', borderLeft: '3px solid #39FF14' }}>
                  <strong>{c.name}</strong> <small style={{ color: 'gold' }}>{c.tier}</small>
                  <button className="btn-neon" style={{ width: '100%', fontSize: '0.7rem', marginTop: '5px', borderColor: 'gold', color: 'gold' }} onClick={() => simulateVipRequest(c)}>SOLICITAR VIP</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'AGENDA' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar Reserva..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleGlobalSearch}
                style={{
                  background: '#000', border: '1px solid #333',
                  color: '#fff', padding: '6px 10px', borderRadius: '4px',
                  fontSize: '0.8rem', width: '100%'
                }}
              />
              <button className="btn-neon btn-alert" onClick={simulateFlightDisruption}>⚠️ SIMULAR CONFLICTO</button>
              {futureBookings.filter(b => b.client.toLowerCase().includes(searchTerm.toLowerCase()) || b.flight.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                <div
                  key={b.id}
                  onMouseEnter={(e) => setHoveredOrder({
                    ...b,
                    paxName: b.client,
                    flightId: b.flight,
                    dest: `Ruta: ${b.route} -> MDE`,
                    assignedDriver: b.assignedDriver, // REAL DATA
                    assignedVehicle: b.assignedVehicle, // REAL DATA
                    pin: b.pin, // REAL DATA
                    x: e.clientX,
                    y: e.clientY
                  })}
                  onMouseLeave={() => setHoveredOrder(null)}
                  style={{
                    border: '1px solid #333', padding: '5px', fontSize: '0.8rem',
                    background: b.status.includes('CANCEL') ? 'rgba(255,0,0,0.2)' : '#111',
                    cursor: 'pointer', marginBottom: '5px', position: 'relative'
                  }}
                >
                  <div style={{ color: '#00F0FF' }}>{b.time} - {b.flight}</div>
                  <div>{b.client}</div>
                  <div style={{ fontStyle: 'italic', color: b.status.includes('RETRASADO') ? 'orange' : b.status.includes('CANCEL') ? 'red' : '#888' }}>{b.status}</div>
                </div>
              ))}
            </div>

          )}

          {activeTab === 'FINANZAS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ color: '#00F0FF', borderBottom: '1px solid #333', paddingBottom: '5px' }}>CONTROL FINANCIERO ERP</h3>

              {/* DYNAMIC METRICS CALCULATION */}
              {(() => {
                const baseBilling = 1450000000;
                const currentOpsValue = requests.length * 45000;
                const futureOpsValue = futureBookings.length * 85000;
                const totalBilling = baseBilling + currentOpsValue;
                const totalCXC = 280000000 + currentOpsValue + futureOpsValue;

                const fmt = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

                // 1. Aggregation Engine
                const companyStats = {};
                [...requests, ...futureBookings].forEach(r => {
                  const comp = r.company || 'PARTICULAR';
                  if (!companyStats[comp]) companyStats[comp] = { count: 0, active: 0 };
                  companyStats[comp].count++;
                  if (r.status === 'assigned' || r.status === 'verifying') companyStats[comp].active++;
                });

                // 2. Generate Advanced Financial Profiles
                const fullPortfolio = Object.entries(companyStats)
                  .map(([name, stats]) => {
                    const isGov = name.includes('ALCALDÍA') || name.includes('GOB');
                    const isBank = name.includes('BANCO') || name.includes('SUR');

                    // Base debt from historical + live ops
                    const rawDebt = 15000000 + (stats.count * 800000);

                    // Aging Logic Simulation
                    let c0_30 = 0;
                    let c30_plus = 0;

                    if (isBank) {
                      c0_30 = rawDebt * 0.95; // Banks pay well
                      c30_plus = rawDebt * 0.05;
                    } else if (isGov) {
                      c0_30 = rawDebt * 0.40; // Gov pays slow
                      c30_plus = rawDebt * 0.60;
                    } else {
                      c0_30 = rawDebt * 0.80; // General corp
                      c30_plus = rawDebt * 0.20;
                    }

                    return {
                      name: name,
                      total: rawDebt,
                      bucket1: c0_30,
                      bucket2: c30_plus,
                      risk: c30_plus > 20000000 ? 'ALTO' : 'BAJO'
                    };
                  })
                  .sort((a, b) => b.total - a.total); // Show ALL (No Limit)

                return (
                  <>
                    {/* 0. ACTIONS TOOLBAR */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                      <button
                        className="btn-neon"
                        style={{
                          padding: '10px', fontSize: '0.8rem', color: '#000', background: '#39FF14', fontWeight: 'bold'
                        }}
                        onClick={() => {
                          addLog(`📡 DIAN: CONECTANDO SERVIDOR FACTURACIÓN ELECTRÓNICA...`);
                          setTimeout(() => addLog(`✅ DIAN: LOTE #49923 EMITIDO (${fullPortfolio.length} FACTURAS). CUDE: x9923...`), 1500);
                        }}
                      >
                        📡 EMITIR DIAN
                      </button>
                      <button
                        className="btn-neon"
                        style={{
                          padding: '10px', fontSize: '0.8rem', color: '#fff', borderColor: '#FF5722'
                        }}
                        onClick={() => addLog(`📉 COSTOS: RECALCULANDO MÁRGENES OPERATIVOS...`)}
                      >
                        📉 AUDITAR COSTOS
                      </button>
                    </div>

                    {/* 1. FINANCIAL SUMMARY CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ background: 'rgba(57, 255, 20, 0.05)', padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>FACTURACIÓN MES</div>
                        <div style={{ fontSize: '1.2rem', color: '#39FF14' }}>{fmt(totalBilling)}</div>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>+ IVA: {fmt(totalBilling * 0.19)}</div>
                      </div>
                      <div style={{ background: 'rgba(255, 87, 34, 0.05)', padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>CXC VENCIDA (&gt;30)</div>
                        <div style={{ fontSize: '1.2rem', color: '#FF5722' }}>{fmt(totalCXC * 0.15)}</div>
                        <div style={{ fontSize: '0.65rem', color: '#666' }}>RIESGO: MEDIO</div>
                      </div>
                    </div>

                    {/* 2. DETAILED CLIENT TABLE */}
                    <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #333', borderRadius: '4px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                        <thead style={{ background: '#222', color: '#888', textAlign: 'left' }}>
                          <tr>
                            <th style={{ padding: '8px' }}>CLIENTE</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>SALDO TOTAL</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>0-30 DÍAS</th>
                            <th style={{ padding: '8px', textAlign: 'right', color: '#FF5722' }}>30+ DÍAS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fullPortfolio.map((cl, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #222', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                              <td style={{ padding: '8px' }}>
                                <div style={{ color: '#fff', fontWeight: 'bold' }}>{cl.name}</div>
                                <div style={{ fontSize: '0.65rem', color: '#666' }}>NIT: 900.{Math.floor(Math.random() * 900)}.123</div>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'right', color: '#00F0FF' }}>{fmt(cl.total)}</td>
                              <td style={{ padding: '8px', textAlign: 'right', color: '#ccc' }}>{fmt(cl.bucket1)}</td>
                              <td style={{ padding: '8px', textAlign: 'right', color: cl.bucket2 > 0 ? '#FF5722' : '#444' }}>{fmt(cl.bucket2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 3. EXPORT ACTIONS */}
                    <div style={{ marginTop: '15px' }}>
                      <button
                        className="btn-neon"
                        style={{ width: '100%', fontSize: '0.9rem', color: '#000', background: 'gold', fontWeight: 'bold' }}
                        onClick={() => {
                          const csvHeader = "EMPRESA,RIESGO,DEUDA TOTAL,CORRIENTE (0-30),VENCIDO (>30)\n";
                          const csvRows = fullPortfolio.map(p => `${p.name},${p.risk},${p.total},${p.bucket1},${p.bucket2}`).join("\n");
                          const csvContent = "data:text/csv;charset=utf-8," + encodeURI(csvHeader + csvRows);

                          const link = document.createElement("a");
                          link.setAttribute("href", csvContent);
                          link.setAttribute("download", `TESO_FINANZAS_${new Date().toISOString().slice(0, 10)}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);

                          addLog('💾 REPORTE FINANCIERO EXPORTADO A EXCEL/CSV.');
                        }}
                      >
                        💾 DESCARGAR BASE DE DATOS (CSV)
                      </button>
                    </div>

                    {/* 1. KEY METRICS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                      {[
                        { label: 'FACTURACIÓN MES', val: `$${(totalBilling / 1000000).toFixed(0)}M`, col: '#39FF14', icon: '💰' },
                        { label: 'CARTERA TOTAL', val: `$${(totalCXC / 1000000).toFixed(0)}M`, col: 'orange', icon: '📉' },
                        { label: 'EN RUTA (EJEC)', val: requests.filter(r => r.status === 'assigned').length, col: '#00F0FF', icon: '🚕' },
                        { label: 'RECAUDO EFECTIVO', val: '92%', col: '#39FF14', icon: '✅' }
                      ].map((m, i) => (
                        <div key={i} style={{
                          background: 'rgba(255,255,255,0.05)',
                          padding: '10px',
                          borderRadius: '5px',
                          border: `1px solid ${m.col}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px'
                        }}>
                          <div style={{ fontSize: '1.5rem' }}>{m.icon}</div>
                          <div>
                            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{m.val}</div>
                            <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{m.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 2. DETAILED AGING TABLE */}
                    <div style={{ background: '#050A10', border: '1px solid #333', overflow: 'hidden' }}>
                      <div style={{ background: '#111', padding: '10px', borderBottom: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ color: '#00F0FF', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>DETALLE CARTERA POR EMPRESA</div>

                        <input
                          type="text"
                          placeholder="🔍 Buscar cliente... [ENTER]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={handleGlobalSearch}
                          style={{
                            background: '#000', border: '1px solid #333',
                            color: '#fff', padding: '8px', borderRadius: '4px',
                            fontSize: '0.8rem', width: '100%'
                          }}
                        />
                      </div>

                      {/* Table Header */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '5px 10px', fontSize: '0.65rem', color: '#888', borderBottom: '1px solid #222' }}>
                        <div>EMPRESA</div>
                        <div style={{ textAlign: 'right' }}>TOTAL CXC</div>
                        <div style={{ textAlign: 'right' }}>0-30 DÍAS</div>
                        <div style={{ textAlign: 'right' }}>{'>'}30 DÍAS</div>
                      </div>

                      {/* Table Body */}
                      <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
                        {fullPortfolio.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((d, i) => (
                          <div key={i}
                            style={{
                              display: 'flex', flexDirection: 'column',
                              padding: '10px 15px',
                              borderBottom: '1px solid #333',
                              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                              cursor: 'help'
                            }}
                            onMouseEnter={(e) => {
                              const opsValue = requests.filter(r => (r.company || 'PARTICULAR') === d.realName).length * 45000;
                              // Use d.total for the raw total debt value
                              const totalDebtVal = d.total;

                              // Generate Invoice Breakdown
                              const invoices = [];

                              // 1. Live Consumption
                              if (opsValue > 0) {
                                invoices.push({ id: 'PRE-FACTURA', date: 'HOY (EN CURSO)', val: opsValue, status: 'VIVO', col: '#00F0FF' });
                              }

                              // 2. Historical Invoices (Simulated to fill the rest)
                              const remainder = Math.max(0, totalDebtVal - opsValue);
                              if (remainder > 0) {
                                const inv1Val = remainder * 0.4; // 40%
                                const inv2Val = remainder * 0.3; // 30%
                                const inv3Val = remainder * 0.3; // 30%

                                invoices.push({ id: 'FE-8921', date: '2025-11-30', val: inv1Val, status: 'CORRIENTE', col: '#39FF14' });
                                invoices.push({ id: 'FE-8540', date: '2025-10-15', val: inv2Val, status: d.status === 'CORRIENTE' ? 'PAGADO' : 'VENCIDO', col: d.status === 'CORRIENTE' ? '#888' : 'red' });
                                if (inv3Val > 0) {
                                  invoices.push({ id: 'FE-8105', date: '2025-09-01', val: inv3Val, status: d.status === 'CORRIENTE' ? 'PAGADO' : 'VENCIDO', col: d.status === 'CORRIENTE' ? '#888' : 'red' });
                                }
                              }

                              setHoveredDebt({
                                name: d.name,
                                x: e.clientX,
                                y: e.clientY,
                                items: invoices
                              });
                            }}
                            onMouseLeave={() => setHoveredDebt(null)}
                          >
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>
                              {d.name}
                            </div>

                            {/* BREAKDOWN METRICS GRID */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>

                              <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '1px' }}>TOTAL</div>
                                <div style={{ color: 'gold', fontWeight: 'bold' }}>{fmt(d.total)}</div>
                              </div>

                              <div style={{ background: 'rgba(57, 255, 20, 0.1)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '1px' }}>0-30 DÍAS</div>
                                <div style={{ color: '#39FF14' }}>{fmt(d.bucket1)}</div>
                              </div>

                              <div style={{ background: d.bucket2 > 0 ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '1px' }}>+30 DÍAS</div>
                                <div style={{ color: d.bucket2 > 0 ? '#ff4d4d' : '#666' }}>{fmt(d.bucket2)}</div>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Grand Total Footer */}
                      <div style={{ padding: '10px', borderTop: '1px solid #00F0FF', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#fff' }}>TOTAL GENERAL</strong>
                        <strong style={{ color: '#00F0FF' }}>{fmt(totalCXC)}</strong>
                      </div>
                    </div>

                    {/* 3. TREASURY & CASH */}
                    <div style={{ padding: '10px', background: 'rgba(57, 255, 20, 0.05)', border: '1px solid #39FF14', marginTop: '10px', borderRadius: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, color: '#39FF14', fontSize: '0.9rem' }}>TESORERÍA & CAJA</h4>
                        <span style={{ fontSize: '0.7rem', color: '#aaa' }}>BANCOS CONECTADOS: 3</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ borderRight: '1px solid #333', paddingRight: '10px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#ccc' }}>RECAUDO HOY (CASH IN)</div>
                          <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{fmt(totalBilling * 0.15)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#ccc' }}>SALDO EN BANCOS</div>
                          <div style={{ fontSize: '1.2rem', color: '#39FF14', fontWeight: 'bold' }}>{fmt(450000000 + (totalBilling * 0.05))}</div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'MERCADEO' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>

              {/* 1. CONNECTIVITY GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { name: 'WhatsApp API', status: 'ONLINE', ping: '24ms', col: '#39FF14' },
                  { name: 'DIAN (Fact)', status: 'SYNCED', ping: '110ms', col: '#00F0FF' },
                  { name: 'Wompi (Pagos)', status: 'ACTIVE', ping: '45ms', col: '#00F0FF' },
                  { name: 'FlightAware', status: 'LIVE', ping: '89ms', col: '#39FF14' }
                ].map((api, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px', border: `1px solid ${api.col}` }}>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{api.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fff' }}>{api.status}</strong>
                      <span style={{ fontSize: '0.6rem', color: '#666' }}>{api.ping}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. AGENTE IA AUTÓNOMO (The "Brain") */}
              <div style={{ flex: 1, background: '#050A10', border: '1px solid #333', borderRadius: '8px', padding: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'gold', fontWeight: 'bold' }}>🧠 AGENTE IA (SOPORTE B2B)</span>
                    <span style={{ fontSize: '0.65rem', color: '#00F0FF', border: '1px solid #00F0FF', padding: '2px 5px', borderRadius: '4px' }}>RAG ACTIVE</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#666', marginTop: '2px' }}>Modelo: GPT-4o ("Self-Instructed")</div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.7rem', fontFamily: 'monospace', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {botLogs.map((log, i) => (
                    <div key={i} style={{ borderLeft: '2px solid #333', paddingLeft: '8px' }}>{log}</div>
                  ))}
                  {/* Fake Stream Effect */}
                  <div style={{ color: 'var(--neon-green)', animation: 'pulse 1s infinite' }}>_ Esperando query...</div>
                </div>
              </div>

              {/* 3. CAMPAIGN BLASTER (Growth Engine) */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🚀 CAMPAÑA "VIAJE SEGURO"</h4>

                {!campaignRun ? (
                  <button
                    onClick={() => {
                      setCampaignRun(true);
                      let sent = 0;
                      const interval = setInterval(() => {
                        sent += 50;
                        const open = Math.floor(sent * 0.82);
                        const rev = Math.floor(open * 0.15) * 45000;
                        setCampaignStats({ sent, open, rev });

                        // Add AI logs dynamically
                        if (sent % 800 === 0) {
                          const newLog = `📡 MKT: Enviando bloque ${sent / 800} a Segmento VIP...`;
                          setBotLogs(prev => [...prev.slice(-4), newLog]);
                        }

                        if (sent >= 2500) {
                          clearInterval(interval);
                          setBotLogs(prev => [...prev.slice(-4), `✅ CAMPAÑA FINALIZADA. ROI: 450%`, `🧠 AI: Analizando sentimiento de respuestas...`]);
                        }
                      }, 100);
                    }}
                    style={{ width: '100%', background: 'var(--neon-green)', color: '#000', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px' }}
                  >
                    INICIAR BLASTER (2,500 CLIENTES)
                  </button>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#aaa' }}>ENVIADOS</div>
                      <div style={{ color: '#fff' }}>{campaignStats.sent}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#aaa' }}>LEÍDOS (82%)</div>
                      <div style={{ color: '#39FF14' }}>{campaignStats.open}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#aaa' }}>VENTAS (EST)</div>
                      <div style={{ color: 'gold' }}>${(campaignStats.rev / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'IMPACTO SOCIAL' && (
            <SocialImpactPanel />
          )}

          {/* GLOBAL BACK TO OPS BUTTON (If not in FLOTA) */}
          {activeTab !== 'FLOTA' && (
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #333' }}>
              <button
                className="btn-neon"
                onClick={() => setActiveTab('FLOTA')}
                style={{ width: '100%', borderColor: '#FF5722', color: '#FF5722' }}
              >
                ↩ VOLVER A OPERACIONES
              </button>
            </div>
          )}
        </div>
      </aside >

      {/* CENTRAL ORDER DETAIL MODAL */}
      {
        activeRequestId && (() => {
          const r = requests.find(req => req.id === activeRequestId);
          if (!r) return null;
          return (
            <div style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 11000, width: '700px', maxWidth: '95vw',
              background: 'linear-gradient(135deg, #050A10 90%, #001f3f 100%)', // Deeper, more "pro" background
              border: '1px solid #39FF14', borderRadius: '12px',
              boxShadow: '0 0 60px rgba(0,0,0,0.9), 0 0 15px rgba(57, 255, 20, 0.2)',
              padding: '0',
              backdropFilter: 'blur(15px)',
              animation: 'fadeInUp 0.3s ease-out',
              fontFamily: "'Outfit', sans-serif"
            }}>

              {/* HEADER: AUTOPILOT STYLE */}
              <div style={{ padding: '20px', background: 'rgba(57, 255, 20, 0.05)', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>ORDEN #{r.id.split('-').pop()}</h2>
                    <span style={{ fontSize: '0.7rem', background: '#333', color: '#fff', padding: '3px 8px', borderRadius: '4px' }}>DATA LIVE</span>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>{r.company}  Waitrose • {r.paxName}</div>
                </div>
                <button onClick={() => setActiveRequestId(null)} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
              </div>

              {/* MAIN ANALYTICS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>

                {/* LEFT: OPERATIONAL REALITY (The "Hard" Data) */}
                <div style={{ padding: '25px', borderRight: '1px solid #333' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#00F0FF', fontSize: '0.9rem', letterSpacing: '1px' }}>📡 TELEMETRÍA DE VIAJE</h4>

                  {/* 1. VEHICLE & DRIVER DEEP DIVE */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#ccc' }}>Unidad Blindada</span>
                      <strong style={{ color: '#fff' }}>{r.assignedVehicle || 'Buscando...'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
                      <span>Nivel Blindaje</span>
                      <span>IIIA (Certificado)</span>
                    </div>
                    <div style={{ marginTop: '10px', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: '#00F0FF' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '3px' }}>
                      <span style={{ color: '#00F0FF' }}>Combustible: 85%</span>
                      <span style={{ color: '#aaa' }}>Autonomía: 420km</span>
                    </div>
                  </div>

                  {/* 2. ROUTE ANALYTICS */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🗺️</span>
                      <div>
                        <div style={{ color: '#fff', fontSize: '0.9rem' }}>{r.dest}</div>
                        <div style={{ color: '#39FF14', fontSize: '0.8rem' }}>ETA: {r.eta} min (En tiempo)</div>
                      </div>
                    </div>
                    {/* Comparison Logic */}
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.7rem' }}>
                      <div style={{ flex: 1, textAlign: 'center', background: '#111', padding: '5px', borderRadius: '4px' }}>
                        <div style={{ color: '#888' }}>Promedio Histórico</div>
                        <div style={{ color: '#fff' }}>{r.eta + 4} min</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', background: 'rgba(57, 255, 20, 0.1)', padding: '5px', borderRadius: '4px', border: '1px solid #39FF14' }}>
                        <div style={{ color: '#39FF14' }}>Ahorro Actual</div>
                        <div style={{ fontWeight: 'bold' }}>▼ 4 min</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT: AI INSIGHTS ("GPT Analysis") */}
                <div style={{ padding: '25px', background: 'rgba(0,0,0,0.2)' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: 'gold', fontSize: '0.9rem', letterSpacing: '1px' }}>⚡ TESO AUTOPILOT ANALYSIS</h4>

                  {/* 1. RISK SCORE CARD */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      border: '4px solid #39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 0 15px rgba(57,255,20,0.2)'
                    }}>
                      98
                    </div>
                    <div>
                      <div style={{ color: '#ccc', fontSize: '0.9rem' }}>SCORE DE SEGURIDAD</div>
                      <div style={{ color: '#888', fontSize: '0.7rem' }}>Basado en 15 variables de entorno</div>
                    </div>
                  </div>

                  {/* 2. CHAT-STYLE INSIGHTS */}
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#bbb', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span>🧠</span>
                      <span>Analizando tráfico en tiempo real... Ruta segura Waze API validada.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span>👨‍✈️</span>
                      <span>Conductor {r.assignedDriver || 'N/A'}: Fatiga negativa (2h turno). Calificación 5.0 ⭐</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span>💳</span>
                      <span>Facturación: <span style={{ color: '#00F0FF' }}>Proyecto Margen 22%</span>. Cliente Premium.</span>
                      {(() => {
                        const matched = corporateAccounts.find(acc => acc.name.includes(r.company));
                        if (matched) return (
                          <button
                            onClick={() => setPreviewPdf(matched.pdf)}
                            title="Ver Factura DIAN"
                            style={{
                              background: 'rgba(255, 215, 0, 0.1)', border: '1px solid gold', color: 'gold',
                              fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer',
                              marginLeft: '5px', display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                          >
                            📄 DIAN
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {/* 3. FLIGHT CONNECTION INTELLIGENCE */}
                  {r.flightId && (
                    <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0, 240, 255, 0.05)', borderLeft: '4px solid #00F0FF' }}>
                      <div style={{ fontSize: '0.8rem', color: '#00F0FF', fontWeight: 'bold' }}>CONEXIÓN VUELO DETECTADA</div>
                      <div style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '2px' }}>
                        Vuelo {r.flightId} monitoreado. Si hay retraso &gt;15m, el sistema reprogramará automáticamente la unidad.
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div style={{ padding: '20px', borderTop: '1px solid #333', display: 'flex', gap: '15px' }}>
                <button
                  className="btn-neon"
                  style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
                  onClick={() => {
                    const msg = `Orden ${r.id}: Reporte de Autopilot. Unidad OK.`;
                    window.open(`https://wa.me/573000000000?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                >
                  📥 DESCARGAR REPORTE (XLS)
                </button>
                <button
                  className="btn-neon"
                  style={{ flex: 1, padding: '12px', fontSize: '0.9rem', borderColor: '#FF5722', color: '#FF5722' }}
                  onClick={() => {
                    addLog(`⚠️ ALERTA MANUAL ACTIVADA SOBRE ORDEN ${r.id}`);
                  }}
                >
                  ⚠ ACTIVAR INTERVENCIÓN HUMANA
                </button>
              </div>
            </div>
          )
        })()
      }

      {/* FLOATING TOOLTIP FOR SIDEBAR (Keep existing) */}
      {
        hoveredOrder && (
          <div style={{
            position: 'fixed',
            // SMART POSITIONING: If in bottom half of screen, show ABOVE cursor. Else BELOW.
            // SMART POSITIONING: If in bottom half of screen, show ABOVE cursor. Else BELOW.
            top: (hoveredOrder.y > window.innerHeight * 0.6) ? 'auto' : hoveredOrder.y - 50,
            bottom: (hoveredOrder.y > window.innerHeight * 0.6) ? (window.innerHeight - hoveredOrder.y + 20) : 'auto',
            // Responsive X positioning: If x is small (left side), show to RIGHT. If large (right side), show to LEFT.
            left: (hoveredOrder.x < window.innerWidth * 0.4) ? hoveredOrder.x + 20 : hoveredOrder.x - 320,
            right: 'auto',
            width: '300px',
            background: 'rgba(5, 10, 20, 0.95)',
            border: '1px solid #39FF14',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 30000, // NUCLEAR OPTION: Must be above AgenticBar (20000)
            boxShadow: '0 0 20px rgba(0,0,0,0.8)',
            pointerEvents: 'none', // Allow clicking through
            backdropFilter: 'blur(5px)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px', color: '#fff' }}>
              📄 DETALLE DE ORDEN
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: '#ccc' }}>
              <div><strong>ID:</strong> <span style={{ color: 'gold' }}>{hoveredOrder.id.split('-').pop()}</span></div>
              <div><strong>ESTADO:</strong> {hoveredOrder.status === 'assigned' ? '✅ ACTIVO' : '⏳ VERIF.'}</div>

              <div style={{ gridColumn: 'span 2' }}><strong>PASAJERO:</strong> {hoveredOrder.paxName}</div>

              {hoveredOrder.company && (
                <div style={{ gridColumn: 'span 2' }}><strong>EMPRESA:</strong> <span style={{ color: '#aaa', fontWeight: 'bold' }}>{hoveredOrder.company}</span></div>
              )}

              <div style={{ gridColumn: 'span 2' }}><strong>DESTINO:</strong> {hoveredOrder.dest.substring(0, 25)}...</div>

              {hoveredOrder.flightId && (
                <div style={{ gridColumn: 'span 2', color: '#00F0FF' }}>
                  ✈️ VUELO: {hoveredOrder.flightId}
                  {hoveredOrder.flightTime && <span style={{ color: '#fff', marginLeft: '10px' }}>🕒 {hoveredOrder.flightTime}</span>}
                </div>
              )}

              <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '4px' }}>
                <div><strong>COND:</strong> {hoveredOrder.assignedDriver || '--'}</div>
                <div><strong>AUTO:</strong> {hoveredOrder.assignedVehicle || '--'}</div>
                <div style={{ color: 'gold' }}><strong>PIN SEGURIDAD: {hoveredOrder.pin || 'PEND'}</strong></div>
              </div>

              <div style={{ gridColumn: 'span 2', fontSize: '0.7rem', color: '#666', marginTop: '5px', borderTop: '1px solid #333', paddingTop: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>FACTURA DIAN:</span>
                  <span style={{ color: ['PROGRAMADO', 'RETRASADO', 'CANCELADO'].includes(hoveredOrder.status) ? 'orange' : '#39FF14' }}>
                    {['PROGRAMADO', 'RETRASADO', 'CANCELADO'].includes(hoveredOrder.status)
                      ? '⏳ NO EMITIDA (PRE-AUTORIZACIÓN)'
                      : `✅ FE-${hoveredOrder.id.split('-')[1] || '9021'} (EMITIDA)`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PAGO:</span>
                  <span style={{ color: '#00F0FF' }}>CREDITO CORPORATIVO (30 DÍAS)</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* FLOATING TOOLTIP FOR FINANCE DEBT */}
      {
        hoveredDebt && (
          <div style={{
            position: 'fixed',
            top: Math.min(hoveredDebt.y - 50, window.innerHeight - 450), // Adjusted to account for max-height
            // Responsive X positioning
            left: (hoveredDebt.x < window.innerWidth * 0.4) ? hoveredDebt.x + 20 : hoveredDebt.x - 340,
            right: 'auto',
            width: '320px',
            maxHeight: '400px', // NEW: Prevent screen overflow
            overflowY: 'auto',   // NEW: internal scrolling
            background: 'rgba(5, 10, 20, 0.98)',
            border: '1px solid gold',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 10001,
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
            pointerEvents: 'auto' // Allow interaction for scrolling
          }}>
            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px', color: 'gold', position: 'sticky', top: 0, background: '#050A14', zIndex: 10 }}>
              🧾 SOPORTES: {hoveredDebt.name}
            </h4>
            <div style={{ fontSize: '0.7rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr', paddingBottom: '5px', color: '#666', borderBottom: '1px solid #333' }}>
                <div>FACTURA</div>
                <div>FECHA</div>
                <div style={{ textAlign: 'right' }}>VALOR</div>
                <div style={{ textAlign: 'right' }}>ESTADO</div>
              </div>
              {hoveredDebt.items.map((inv, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr', padding: '5px 0', borderBottom: '1px dashed #222', color: '#ccc' }}>
                  <div style={{ color: '#fff' }}>{inv.id}</div>
                  <div>{inv.date}</div>
                  <div style={{ textAlign: 'right', color: inv.col }}>${(inv.val / 1000000).toFixed(1)}M</div>
                  <div style={{ textAlign: 'right', fontSize: '0.65rem', color: inv.col }}>{inv.status}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '0.8rem', color: '#aaa', position: 'sticky', bottom: '-15px', background: '#050A14', padding: '10px 0', borderTop: '1px solid #333' }}>
              TOTAL PENDIENTE: <span style={{ color: 'gold', fontWeight: 'bold' }}>${(hoveredDebt.items.reduce((acc, curr) => acc + curr.val, 0) / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        )
      }

      {/* SOURCE CODE SECURE LINK */}
      <a
        href="https://github.com/ipanemausa/https-github.com-ipanemausa-teso"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '180px', // Left of Pitch Deck button
          zIndex: 9000,
          background: '#111',
          color: '#fff',
          border: '1px solid #333',
          padding: '10px 15px',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.2s'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>👾</span> SOURCE (GIT)
      </a>

      {/* PITCH MODE BUTTON (Fixed Overlay) */}
      <button
        onClick={() => setShowPresentation(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9000,
          background: 'gold',
          color: '#000',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '30px',
          fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        <span>📽️</span> PITCH DECK
      </button>

      {/* SPIKE TRIGGER BUTTON (Temporary) */}
      <button
        onClick={() => setShowTripPreferences(true)}
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '20px',
          zIndex: 9000,
          background: '#00F0FF',
          color: '#000',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '30px',
          fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        <span>✨</span> TEST BOOKING
      </button>

      {/* TRIP PREFERENCES MODAL (SPIKE) */}
      {
        showTripPreferences && (
          <Suspense fallback={null}>
            <TripPreferencesModal
              onClose={() => setShowTripPreferences(false)}
              onConfirm={(prefs) => {
                setShowTripPreferences(false);
                addLog(`✨ PREFERENCIAS CONFIRMADAS: ${prefs.conversation.toUpperCase()} | ${prefs.temp.toUpperCase()} | ${prefs.flightNumber || 'SIN VUELO'}`);
                speak('Preferencias de viaje guardadas. Asignando unidad con perfil compatible.');
              }}
            />
          </Suspense>
        )
      }

      {/* PRESENTATION LAYER */}
      {
        showPresentation && (
          <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', color: 'gold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LOADING PITCH DECK...</div>}>
            <Presentation
              onClose={() => setShowPresentation(false)}
              onStartDemo={() => runAppDemoMode()}
              controlledState={presentationControl}
              onStateChange={setPresentationControl}
              systemData={{
                vehicles,
                requests,
                clients,
                logs,
                kpis: {
                  activeOps: requests.length,
                  onlineUnits: vehicles.length,
                  avgEta: '4 min',
                  ragStatus: 'ACTIVE_LEARNING'
                }
              }} />
          </Suspense>
        )
      }

      {/* WEBCAM OVERLAY (GLOBAL) - DISABLED PENDING FIX
      <Suspense fallback={null}>
        <WebcamOverlay isVisible={showWebcam} />
      </Suspense>
      */}


      {/* TACTICAL CARD OVERLAY (Drill Down Info) */}
      {
        activeReq && !showOperationalDashboard && (
          <div
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #3b82f6',
              borderRadius: '12px', padding: '20px', width: '320px', zIndex: 1000,
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)', color: '#fff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#3b82f6' }}>FICHA TÁCTICA</h3>
              <button onClick={() => setActiveReq(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ width: '60px', height: '60px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px solid #fff' }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{activeReq.driverName}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>ID: {activeReq.vehicleId} • {activeReq.vehicleType}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ background: '#1e293b', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>CLIENTE</div>
                <div>{activeReq.paxName}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>ESTADO</div>
                <div style={{ color: activeReq.status === 'paid' ? '#34d399' : '#fbbf24', fontWeight: 'bold' }}>{activeReq.status ? activeReq.status.toUpperCase() : 'N/A'}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '8px', borderRadius: '6px', gridColumn: 'span 2' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>DESTINO / RUTA</div>
                <div>{activeReq.dest}</div>
              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, background: '#2563eb', border: 'none', padding: '8px', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>📞 LLAMAR</button>
              <button
                onClick={() => {
                  addLog(`🔗 ENLACE PÚBLICO GENERADO: teso.app/share/${activeReq.id}`);
                  speak('Enlace seguro generado. Abriendo vista pública.');
                  setShowSharedLink(true);
                }}
                style={{ flex: 1, background: '#00F0FF', border: 'none', padding: '8px', borderRadius: '6px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🔗 COMPARTIR
              </button>
              <button style={{ flex: 1, background: '#dc2626', border: 'none', padding: '8px', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🚨 SOS</button>
            </div>

          </div>
        )
      }

      {/* PUBLIC SHARED RIDE VIEW (OVERLAY SIMULATION) */}
      {
        showSharedLink && activeReq && (
          <Suspense fallback={null}>
            <SharedRideView
              rideData={activeReq}
              onClose={() => setShowSharedLink(false)}
            />
          </Suspense>
        )
      }


      {/* DASHBOARD LAYER (Toggle between OPS and WMS) */}
      {
        activeView === 'DASHBOARD' && (
          // FEATURE TOGGLE: Use new WMS by default for Analytics 3.0
          <Suspense fallback={<div style={{ color: '#00F0FF', padding: '20px' }}>Loading Logistics Dashboard...</div>}>
            <LogisticsDashboard
              activeReq={activeReq}
              onRowClick={(req) => {
                flyToReq(req);
                setActiveReq(req);
                setViewMode('MAP');
              }}
              simulationData={simulationContext}
            />
          </Suspense>
        )
      }

      {/* AGENTIC NAVIGATION BAR - MOVED UP */}

    </main >
  );
}

const SocialImpactPanel = () => {
  const [taxes, setTaxes] = useState(0);
  const [security, setSecurity] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 45.2;
    const duration = 4000; // 4 seconds for dramatic effect
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);

      setTaxes((end * ease).toFixed(1));
      setSecurity(Math.floor(100 * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div style={{ textAlign: 'center', animation: 'scanline 0.5s ease-out' }}>
      <h1 style={{ color: '#39FF14', fontSize: '3.5rem', margin: '10px 0', fontFamily: 'monospace' }}>
        ${taxes}M
      </h1>
      <p style={{ color: '#888', letterSpacing: '2px', fontSize: '0.8rem' }}>RECAUDO IMPUESTOS LOCALES</p>

      <hr style={{ borderColor: '#333', margin: '20px 0', opacity: 0.5 }} />

      <h2 style={{ color: '#fff', fontSize: '3rem', margin: '10px 0' }}>
        {security}%
      </h2>
      <p style={{ color: '#888', letterSpacing: '2px', fontSize: '0.8rem' }}>SEGURIDAD VERIFICADA</p>

      <div style={{ marginTop: '30px', border: '1px dashed #39FF14', padding: '10px', borderRadius: '5px', background: 'rgba(57, 255, 20, 0.05)' }}>
        <small style={{ color: '#39FF14' }}>● DATOS EN TIEMPO REAL</small>
      </div>
    </div>
  );
};

export default App;

// --- CLIENT EXPERIENCE COMPONENT ---
const ClientExperience = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0f1a', color: '#fff', position: 'relative', overflow: 'hidden' }}>

      {/* MAP (Simplified) */}
      <MapContainer center={[6.20, -75.57]} zoom={15} style={{ height: '80%', width: '100%' }} zoomControl={false}>
        <TileLayer
          className="cyberpunk-map-tiles"
          attribution='© Osm'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        <Marker position={[6.20, -75.57]} icon={new L.DivIcon({
          html: '<div style="font-size: 24px;">📍</div>',
          iconSize: [30, 30],
          className: 'user-marker'
        })} />

        {/* Approaching Car */}
        <Marker position={[6.205, -75.572]} icon={null} >
          <Tooltip permanent direction="top" offset={[0, -20]} opacity={1}>
            <div style={{ background: '#050A14', color: 'cyan', border: '1px solid cyan', padding: '2px 5px', borderRadius: '4px', fontSize: '0.7rem' }}>
              Carlos (3 min)
            </div>
          </Tooltip>
        </Marker>

        <Polyline positions={[[6.20, -75.57], [6.205, -75.572]]} color="#39FF14" dashArray="5, 10" />

      </MapContainer>

      {/* Bottom Card */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: '25%',
        background: '#111', borderTop: '2px solid #39FF14',
        borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
        padding: '20px', zIndex: 9999, boxShadow: '0 -5px 20px rgba(57, 255, 20, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#fff' }}>Llegando en 3 min</h2>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>Placa TES-921 • Toyota Corola Blindado</span>
          </div>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            👨‍✈️
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button className="btn-neon" style={{ flex: 1, fontSize: '0.9rem', padding: '10px' }}>📞 CONTACTAR</button>
          <button className="btn-neon" style={{ flex: 1, fontSize: '0.9rem', padding: '10px', borderColor: 'gold', color: 'gold' }}>🛡️ PÁNICO</button>
        </div>
      </div>
    </div >
  );
};
