import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LandingPage from './components/LandingPage';
import Presentation from './components/Presentation';
import AgenticCommandBar from './components/AgenticCommandBar';

// --- HELPER TO AUTO-FOCUS MAP ---
function FlyToActive({ activeReq }) {
  const map = useMap();
  useEffect(() => {
    if (activeReq) {
      map.flyTo([activeReq.lat, activeReq.lng], 14, {
        duration: 2.0,
        easeLinearity: 0.5
      });
    }
  }, [activeReq, map]);
  return null;
}

// --- ICONS CONFIGURATION ---
// --- ICONS CONFIGURATION ---
// --- ICONS CONFIGURATION ---
// --- ICONS CONFIGURATION ---
// 1. Vehicle (Translucent Luminous Core)
const vehicleIcon = new L.DivIcon({
  className: 'glass-pin-vehicle',
  html: `<div style="
    background: rgba(224, 255, 255, 0.6); /* Translucent Luminous Center */
    border: 2px solid rgba(0, 240, 255, 0.9); /* Defined Blue Border */
    width: 12px; height: 12px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.6); /* Soft Glow */
    position: relative;
    backdrop-filter: blur(1px); /* Slight blur for glass effect */
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16]
});

// 2. Passenger (Translucent Luminous Core)
const passengerIcon = new L.DivIcon({
  className: 'glass-pin-passenger',
  html: `<div style="
    background: rgba(255, 250, 240, 0.6); /* Translucent Luminous Center */
    border: 2px solid rgba(255, 215, 0, 0.9); /* Defined Gold Border */
    width: 12px; height: 12px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); /* Soft Glow */
    position: relative;
    backdrop-filter: blur(1px); /* Slight blur for glass effect */
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16]
});

// Custom Airplane Icon
// Custom Airplane Icon
const planeDivIcon = (angle) => new L.DivIcon({
  className: 'plane-marker',
  html: `<div style="font-size: 32px; transform: rotate(${angle - 45}deg); text-shadow: 0 0 15px cyan; filter: drop-shadow(0 0 8px cyan) brightness(2);">✈️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

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

  const DRIVERS = ['Carlos Ruiz', 'Andrés Gómez', 'Mariana Torres', 'Fernando López', 'Valentina Ruiz', 'Pedro Méndez', 'Luisa Fernanda'];
  const VEHICLES = ['Toyota Corolla (TES-901)', 'Renault Duster (WOP-231)', 'Chevrolet Tracker (VAN-882)', 'Nissan Sentra (SAB-112)', 'Kia Sportage (KOL-998)'];

  return Array.from({ length: count }).map((_, i) => {
    const flight = FLIGHT_SCHEDULE[i % FLIGHT_SCHEDULE.length];
    const company = companies[i % companies.length];
    return {
      id: `RES-${8000 + i}`,
      date: DATES[i % 3],
      time: flight.time,
      flight: flight.code,
      route: flight.route,
      client: company.name,
      pax: `Ejecutivo ${company.name.substring(0, 3)}`,
      status: 'PROGRAMADO',
      assignedDriver: DRIVERS[i % DRIVERS.length],  // NEW
      assignedVehicle: VEHICLES[i % VEHICLES.length], // NEW
      pin: Math.floor(1000 + Math.random() * 9000) // NEW: Pre-assigned PIN
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
    // Initial spawn if empty (spawn scattered INSIDE view for immediate effect)
    setPlanes(prev => {
      if (prev.length === 0) {
        const bounds = map.getBounds();
        const center = map.getCenter();
        // Create 6 random planes inside
        return Array.from({ length: 6 }).map(() => {
          const p = createPlane(bounds, center);
          // Override spawn pos to be inside
          p.lat = center.lat + (Math.random() - 0.5) * (bounds.getNorth() - bounds.getSouth());
          p.lng = center.lng + (Math.random() - 0.5) * (bounds.getEast() - bounds.getWest());
          return p;
        });
      }
      return prev;
    });

    const interval = setInterval(() => {
      const bounds = map.getBounds();
      const center = map.getCenter();

      // Use extended bounds for "Death Zone" (so they disappear only when well off screen)
      const deathBounds = bounds.pad(0.2);

      setPlanes(prevPlanes => {
        let currentPlanes = [...prevPlanes];

        // 1. Respawn if count < 6
        while (currentPlanes.length < 6) {
          currentPlanes.push(createPlane(bounds, center));
        }

        // 2. Move & Check
        return currentPlanes.map(p => {
          const nextLat = p.lat + (Math.cos(p.heading * Math.PI / 180) * p.speed);
          const nextLng = p.lng + (Math.sin(p.heading * Math.PI / 180) * p.speed);

          if (!deathBounds.contains([nextLat, nextLng])) {
            // Respawn new plane entering from edge of CURRENT view
            return createPlane(bounds, center);
          }

          return {
            ...p,
            lat: nextLat,
            lng: nextLng
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [map, setPlanes]);

  return null;
};

import GastroDashboard from './components/GastroDashboard';
import OperationalDashboard from './components/OperationalDashboard';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showPresentation, setShowPresentation] = useState(false); // NEW: Investor Pitch Mode
  const [showGastro, setShowGastro] = useState(false); // NEW: Muncher Demo Mode
  const [showOperationalDashboard, setShowOperationalDashboard] = useState(false); // NEW: Agentic Dashboard
  const [activeTab, setActiveTab] = useState('FLOTA');
  const [isLive, setIsLive] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [isHeatmap, setIsHeatmap] = useState(false);

  // --- SHOW QR STATE ---
  const [showQR, setShowQR] = useState(false);
  const [serverIP, setServerIP] = useState('192.168.1.2');
  const openQR = () => setShowQR(true);
  const closeQR = () => setShowQR(false);


  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);

  // --- ROLE DETECTION (NEW) ---
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'client', 'driver'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const modeParam = params.get('mode');

    if (modeParam === 'muncher') {
      setShowGastro(true);
      setShowLanding(false); // Skip landing for direct access
    }

    if (roleParam) {
      setUserRole(roleParam);
      // Force mobile viewport meta tag if client
      if (roleParam === 'client') {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, []);

  // --- SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'p' || e.key === 'P') {
        setShowPresentation(prev => !prev);
      }
      if (e.key === 'g' || e.key === 'G') {
        setShowGastro(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (showGastro) {
    return <GastroDashboard onClose={() => setShowGastro(false)} />;
  }

  // --- RADAR STATE ---
  const [planes, setPlanes] = useState([]);
  const [hasAutoAssigned, setHasAutoAssigned] = useState(false); // NEW: Demo Auto-start tracker

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: '', nit: '', type: 'CORPORATIVO', budget: '' });

  const [routes, setRoutes] = useState([]);

  const [logs, setLogs] = useState([]);
  const [highlighted, setHighlighted] = useState(null); // { vehicleId, requestId, flightId }
  const [activeRequestId, setActiveRequestId] = useState(null); // NEW: Auto-focus state
  const [hoveredOrder, setHoveredOrder] = useState(null); // NEW: Side List Tooltip
  const [flightTabMode, setFlightTabMode] = useState('ARRIVALS'); // NEW: FIDS View Mode
  const [hoveredDebt, setHoveredDebt] = useState(null); // NEW: Finance Drill-down Tooltip
  const [searchTerm, setSearchTerm] = useState(''); // NEW: Finance Filter
  const [campaignRun, setCampaignRun] = useState(false); // NEW: Marketing Sim
  const [campaignStats, setCampaignStats] = useState({ sent: 0, open: 0, rev: 0 });
  const [filterToday, setFilterToday] = useState(true); // NEW: Orders Filter
  const [botLogs, setBotLogs] = useState(['🤖 Bot: Sistema iniciado B2B-v9.0', '📡 API: WhatsApp Business Connected']);
  const [corpInput, setCorpInput] = useState(''); // NEW: Controlled input for Corporate Sim

  const handleAgentCommand = (cmd) => {
    addLog(`🤖 AGENT: Received intent: "${cmd}"`);
    setTimeout(() => {
      addLog(`⚙️ AGENT: Executing autonomous workflow...`);

      const lower = cmd.toLowerCase();
      if (lower.includes('financ') || lower.includes('audit')) {
        setActiveTab('FINANCIERO');
        addLog(`✅ AGENT: Switched to Financial View. Running real-time audit.`);
      } else if (lower.includes('rout') || lower.includes('ops') || lower.includes('optimiz') || lower.includes('dashboard')) {
        setShowOperationalDashboard(true);
        addLog(`✅ AGENT: Accessing Operational Core Visualization...`);
        // Trigger a specific visualization if we had one, for now just log
      } else if (lower.includes('secur') || lower.includes('scan')) {
        addLog(`✅ AGENT: Security scan initiated. Verifying 65 units...`);
      } else {
        addLog(`✅ AGENT: Task "${cmd}" queued for autonomous execution.`);
      }
    }, 500);
  };

  const autoAssignRef = React.useRef(null); // Ref to access autoAssign inside useEffect

  useEffect(() => {
    setVehicles(generateVehicles(65));
    const initialClients = generateCompanies(1250);
    setClients(initialClients);
    setFutureBookings(generateFutureBookings(70, initialClients));

    // AUTO-POPULATE FOR DEMO (45 Active Orders)
    const DESTINOS = ['Hotel Dann Carlton', 'CC Santa Fe', 'Plaza Mayor', 'Aeropuerto JMC', 'Clinica Las Américas'];
    const initialRequests = Array.from({ length: 45 }).map((_, i) => {
      const isReserva = Math.random() > 0.4;
      return {
        id: isReserva ? `RES-${3000 + i}` : `OND-${7000 + i}`,
        lat: 6.15 + (Math.random() * 0.15),
        lng: -75.60 + (Math.random() * 0.10),
        dest: DESTINOS[Math.floor(Math.random() * DESTINOS.length)],
        paxName: isReserva ? `Ejecutivo ${initialClients[i % 50].name}` : `Pasajero Ocasional ${i}`,
        company: isReserva ? initialClients[i % 50].name : 'PARTICULAR',
        type: isReserva ? 'RESERVA CORPORATIVA' : 'ON-DEMAND',
        fare: `$${(20 + Math.random() * 40).toFixed(0)}.000`,
        status: 'verifying',
        flightId: isReserva ? FLIGHT_SCHEDULE[i % 5].code : null,
        flightTime: isReserva ? FLIGHT_SCHEDULE[i % 5].time : null,
        pin: null
      };
    });
    setRequests(initialRequests);
    addLog('🚀 SISTEMA INICIADO EN MODO DEMO: 45 ÓRDENES CARGADAS.');
    addLog('📡 65 UNIDADES EN LÍNEA Y REPORTANDO.');

    // Trigger Initial Assignment safely
    setTimeout(() => {
      if (autoAssignRef.current) autoAssignRef.current();
    }, 2000);


    // RADAR FLIGHTS - MANAGED BY RadarController
    // Initial state empty, letting controller populate based on view
    setPlanes([]);
  }, []);

  // --- RADAR LOOP ---
  // LOGIC MOVED TO RadarController COMPONENT (See line ~140)

  const addLog = (msg, related = null) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, related }, ...prev].slice(0, 50));
  };

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
      const foundVehicle = vehicles.find(v =>
        v.id.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q)
      );

      if (foundVehicle) {
        setActiveTab('FLOTA');
        if (foundVehicle.currentOrderId) {
          setActiveRequestId(foundVehicle.currentOrderId);
          addLog(`🔍 UNIDAD ${foundVehicle.id} ENCONTRADA CON SERVICIO ACTIVO.`);
        } else {
          addLog(`🔍 UNIDAD ${foundVehicle.id} LOCALIZADA. ESTADO: DISPONIBLE.`);
          setHighlighted({ vehicleId: foundVehicle.id });
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

  const simularDiaCritico = () => {
    addLog('⚠️ INICIANDO SIMULACIÓN DE ALTA CARGA (ESCENARIO DÍA CRÍTICO)...');
    addLog('🌊 IMPORTANDO 60 ÓRDENES MIXTAS (RESERVAS + ON-DEMAND)...');

    // CROSS-SYSTEM TRIGGER: AI REACTS TO OPS
    setBotLogs(prev => [...prev.slice(-4), '⚠️ ALERT: Sudden demand spike detected via Ops API.', '🔄 AI ACTION: Triggering "Surge Pricing" protocol...', '📢 BROADCAST: Apology coupons queued for delayed users.']);

    const DESTINOS = ['Hotel Dann Carlton', 'CC Santa Fe', 'Plaza Mayor', 'Aeropuerto JMC', 'Clinica Las Américas', 'Wework Poblado', 'Parque Lleras'];

    // 1. GENERAR CARGA MASIVA MIXTA
    const newRequests = Array.from({ length: 60 }).map((_, i) => {
      const isReserva = Math.random() > 0.4; // 40% Reservas
      return {
        id: isReserva ? `RES-${4000 + i}` : `OND-${8000 + i}`,
        lat: 6.15 + (Math.random() * 0.15),
        lng: -75.60 + (Math.random() * 0.10),
        dest: DESTINOS[Math.floor(Math.random() * DESTINOS.length)],
        paxName: isReserva ? `Ejecutivo ${generateCompanies(1)[0].name}` : `Pasajero Ocasional ${i}`,
        company: isReserva ? generateCompanies(1)[0].name : 'PARTICULAR', // NEW
        type: isReserva ? 'RESERVA CORPORATIVA' : 'ON-DEMAND',
        fare: `$${(20 + Math.random() * 40).toFixed(0)}.000`,
        status: 'verifying', // Start all verifying
        flightId: isReserva ? FLIGHT_SCHEDULE[i % 5].code : null,
        flightTime: isReserva ? FLIGHT_SCHEDULE[i % 5].time : null, // NEW
        pin: null
      };
    });

    setRequests(prev => [...prev, ...newRequests]);

    // 2. AUTO ASIGNACIÓN INICIAL
    setTimeout(() => {
      addLog('🤖 IA: INTENTANDO CUBRIR 60 ÓRDENES SIMULTÁNEAS...');
      autoAssign();
    }, 3000);

    // 3. CAOS: CANCELACIÓN DE CONDUCTORES (REASIGNACIÓN)
    setTimeout(() => {
      addLog('🚨 ALERTA CRÍTICA: 4 CONDUCTORES CANCELARON EL SERVICIO.');
      addLog('🔄 ACTIVANDO PROTOCOLO DE REASIGNACIÓN AUTOMÁTICA...');

      // Find affected vehicles IDs to release them
      let releasedVehicles = [];

      setRequests(prev => {
        const indicesToCancel = [2, 5, 12, 18]; // Specific orders to fail
        return prev.map((r, i) => {
          if (indicesToCancel.includes(i) && r.status === 'assigned') {
            if (r.assignedVehicle) releasedVehicles.push(r.assignedVehicle);
            return { ...r, status: 'cancelled_driver', assignedDriver: null, assignedVehicle: null };
          }
          return r;
        });
      });

      // SYNC DEPENDENCY: Free up the vehicles
      setVehicles(prev => prev.map(v => {
        if (releasedVehicles.includes(v.id)) {
          return { ...v, status: 'available', currentOrderId: null, currentClient: null };
        }
        return v;
      }));

    }, 8000);

    // 4. CAOS: CANCELACIÓN DE CLIENTES
    setTimeout(() => {
      addLog('❌ NOTIFICACIÓN: 5 CLIENTES CANCELARON SU ORDEN.');

      let vehiclesToLiberate = [];

      setRequests(prev => {
        const indicesToCancel = [8, 22, 35, 40, 42];
        return prev.map((r, i) => {
          if (indicesToCancel.includes(i)) {
            if (r.assignedVehicle) vehiclesToLiberate.push(r.assignedVehicle);
            return { ...r, status: 'cancelled_client' };
          }
          return r;
        });
      });

      // SYNC DEPENDENCY: Free up vehicles for these cancelled clients
      setVehicles(prev => prev.map(v => {
        if (vehiclesToLiberate.includes(v.id)) {
          addLog(`ℹ️ UNIDAD ${v.id} LIBERADA POR CANCELACIÓN DE CLIENTE.`);
          return { ...v, status: 'available', currentOrderId: null, currentClient: null };
        }
        return v;
      }));
    }, 12000);

    // 5. CAOS: RETRASOS DE TRÁFICO/VUELO
    setTimeout(() => {
      simulateFlightDisruption();
      addLog('⚠️ MONITOR DE TRÁFICO: ALTA CONGESTIÓN EN VÍA LAS PALMAS (+25min). SE REQUIERE RECALCULAR ETAS.');
    }, 16000);
  };

  const simulateFlightDisruption = () => {
    const targetIndex = Math.floor(Math.random() * 5);
    const target = futureBookings[targetIndex];
    if (!target) return;

    const isCancelled = Math.random() > 0.5;
    const newStatus = isCancelled ? '🔴 CANCELADO' : '🟠 RETRASADO (+2h)';

    addLog(`⚠️ ALERTA: VUELO ${target.flight} ${isCancelled ? 'CANCELADO' : 'RETRASADO'}.`);

    if (isCancelled) {
      addLog(`❌ ORDEN ${target.id} SUSPENDIDA. CONDUCTOR LIBERADO.`);
    } else {
      addLog(`🔄 ORDEN ${target.id} REPROGRAMADA PARA LAS 22:00.`);
    }

    setFutureBookings(prev => prev.map((b, i) => {
      if (i === targetIndex) return { ...b, status: newStatus, time: isCancelled ? '--:--' : '22:00 (Nuevo)' };
      return b;
    }));
  };

  const autoAssign = () => {
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

  // --- DEMO AUTO-START TRIGGER ---
  useEffect(() => {
    if (!hasAutoAssigned && requests.length > 0) {
      // Wait a brief moment for visual impact then assign
      const timer = setTimeout(() => {
        addLog('⚡ MODO DEMO DETECTADO: EJECUTANDO ASIGNACIÓN AUTOMÁTICA...');
        autoAssign();
        setHasAutoAssigned(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [requests, hasAutoAssigned]);

  // --- ACTIVE RAG INTELLIGENCE SIMULATION ---
  useEffect(() => {
    const ragEvents = [
      '🧠 RAG: Analizando sentimiento de chat de Cliente 45...',
      '🔄 ERP: Conciliando factura electrónica FE-9921...',
      '📊 BI: Detectando patrón de demanda en El Poblado (Prob: High)',
      '🛡️ CRM: Actualizando perfil de conductor "Andrés" - Calificación 5.0',
      '⚡ RAG: Ingestando datos de tráfico de Waze API...',
      '🏦 ERP: Verificando límite de crédito corporativo para NUTRESA',
      '🔮 PREDICCIÓN: Vuelo AV8534 adelantado 15 minutos.'
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const event = ragEvents[Math.floor(Math.random() * ragEvents.length)];
        // Add to main logs but with a special prefix or handled by the UI
        addLog(event);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (showLanding && userRole === 'admin') {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
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

        {/* TOP NAV - INDIVIDUAL GLASS BUTTONS */}
        {/* TOP NAV - HIDDEN FOR AGENTIC MODE */}
        {/* 
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
            { id: 'MERCADEO', icon: '📢' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
*/}

        {/* MAP CONTAINER (RESTORED) */}
        <MapContainer center={[6.23, -75.58]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          {/* AUTO FOCUS COMPONENT */}
          <FlyToActive activeReq={requests.find(r => r.id === activeRequestId)} />

          {/* RESPONSIVE RADAR CONTROLLER */}
          <RadarController setPlanes={setPlanes} />

          <TileLayer
            className="cyberpunk-map-tiles"
            attribution='© Osm'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* AI HEATMAP LAYERS */}
          {isHeatmap && [
            { lat: 6.208, lng: -75.566, r: 800 },
            { lat: 6.246, lng: -75.569, r: 600 },
            { lat: 6.200, lng: -75.578, r: 500 }
          ].map((h, i) => (
            <React.Fragment key={i}>
              <Circle center={[h.lat, h.lng]} radius={h.r} pathOptions={{ color: '#A020F0', fillColor: '#A020F0', fillOpacity: 0.6, stroke: false, className: 'ai-heat-pulse' }} />
            </React.Fragment>

          ))}

          {/* HIGHLIGHTED CONNECTION LINE */}
          {highlighted && highlighted.vehicleId && highlighted.requestId && (() => {
            const v = vehicles.find(v => v.id === highlighted.vehicleId);
            const r = requests.find(r => r.id === highlighted.requestId);
            if (v && r) {
              return (
                <>
                  <Polyline positions={[[v.lat, v.lng], [r.lat, r.lng]]} color="#39FF14" dashArray="5, 10" weight={2} />
                  <Circle center={[v.lat, v.lng]} radius={300} pathOptions={{ color: '#39FF14', fillColor: '#39FF14', fillOpacity: 0.2 }} />
                  <Circle center={[r.lat, r.lng]} radius={300} pathOptions={{ color: 'gold', fillColor: 'gold', fillOpacity: 0.2 }} />
                </>
              );
            }
          })()}

          {/* HIGHLIGHTED FLIGHT */}
          {highlighted && highlighted.flightId && (() => {
            const f = planes.find(p => p.id === highlighted.flightId);
            if (f) {
              return <Circle center={[f.lat, f.lng]} radius={2000} pathOptions={{ color: '#00F0FF', fillColor: '#00F0FF', fillOpacity: 0.1, dashArray: '10, 10' }} />;
            }
          })()}

          {/* VEHICLES (Blue - Supply) */}
          {vehicles.map(v => (
            <Marker key={v.id} position={[v.lat, v.lng]} icon={vehicleIcon}>
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <div style={{ textAlign: 'center', background: '#050A14', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #0078D7' }}>
                  <strong style={{ color: '#0078D7' }}>🚙 {v.id}</strong><br />
                  <span style={{ fontSize: '0.8rem' }}>{v.driver}</span><br />
                  <span style={{ fontSize: '0.7rem', color: v.status === 'available' ? '#39FF14' : 'orange' }}>{v.status === 'available' ? '● DISPONIBLE' : '● OCUPADO'}</span>
                </div>
              </Tooltip>
            </Marker>
          ))}

          {/* REQUESTS (Yellow - Demand) */}
          {requests.map((r, i) => (
            <Marker
              key={r.id}
              position={[r.lat, r.lng]}
              icon={passengerIcon}
              zIndexOffset={r.id === activeRequestId ? 1000 : 0}
              eventHandlers={{ click: () => setActiveRequestId(r.id) }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={r.id === activeRequestId}>
                <div style={{
                  textAlign: 'left',
                  background: '#050A14',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '6px',
                  border: r.status === 'assigned' ? '1px solid #39FF14' : '1px solid orange',
                  minWidth: '220px',
                  boxShadow: '0 0 15px rgba(0,0,0,0.8)'
                }}>

                  {/* HEADER */}
                  <div style={{
                    borderBottom: '1px solid #333',
                    paddingBottom: '5px', marginBottom: '8px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ color: r.status === 'assigned' ? 'gold' : '#aaa', fontWeight: 'bold' }}>ORDEN #{r.id.split('-').pop()}</span>
                    <span style={{ fontSize: '0.7rem', color: '#666' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* CONTENT BASED ON STATE */}
                  {r.status === 'verifying' ? (
                    <div style={{ animation: 'pulse 1s infinite', textAlign: 'center', padding: '10px 0' }}>
                      <div style={{ color: '#00F0FF', fontWeight: 'bold' }}>💳 VERIFICANDO CXC</div>
                      <small style={{ color: '#888' }}>Conectando con Pasarela...</small>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ marginBottom: '4px' }}><span style={{ color: '#888' }}>CLIENTE:</span> <strong style={{ color: '#fff' }}>{r.paxName}</strong></div>

                      {/* SHOW FLIGHT IF EXISTS */}
                      {r.flightId && (
                        <div style={{ marginBottom: '4px' }}><span style={{ color: '#888' }}>VUELO:</span> <span style={{ color: '#00F0FF' }}>{r.flightId}</span></div>
                      )}

                      <div style={{ marginBottom: '8px' }}><span style={{ color: '#888' }}>DESTINO:</span> {r.dest}</div>

                      {/* FINANCIAL AUDIT */}
                      <div style={{ marginBottom: '8px', borderTop: '1px solid #333', paddingTop: '4px', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>FACTURACIÓN:</span> <span style={{ color: '#aaa' }}>CREDITO CXC</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>REF DIAN:</span> <span style={{ color: '#00F0FF' }}>FE-{r.id.split('-')[1] || 'PEND'}</span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(57, 255, 20, 0.05)', padding: '8px', borderRadius: '4px', border: '1px dashed #333' }}>
                        {r.assignedVehicle ? (
                          <>
                            <div style={{ marginBottom: '2px' }}><span style={{ color: '#888' }}>ASIGNADO A:</span> <strong style={{ color: '#39FF14' }}>{r.assignedDriver}</strong></div>
                            <div style={{ marginBottom: '4px' }}><span style={{ color: '#888' }}>UNIDAD:</span> {r.assignedVehicle}</div>
                            <div style={{ borderTop: '1px solid #333', paddingTop: '4px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'gold', fontWeight: 'bold' }}>PIN: {r.pin}</span>
                              <span style={{ color: '#00F0FF' }}>ETA: {r.eta} min</span>
                            </div>
                          </>
                        ) : (
                          <span style={{ color: 'orange' }}>⏳ Buscando unidad...</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          ))}

          {/* PLANE RADAR MARKERS */}
          {planes.map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={planeDivIcon(p.heading)}>
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <div style={{ textAlign: 'center', background: '#050A14', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #00F0FF' }}>
                  <strong style={{ color: '#00F0FF', fontSize: '1rem' }}>✈️ {p.id}</strong><br />
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{p.airline} • {p.from}</span><br />
                  <hr style={{ borderColor: '#333', margin: '4px 0' }} />
                  <strong style={{ color: '#39FF14' }}>⇧ {p.alt} ft  |  🚀 {p.spd} kts</strong>
                </div>
              </Tooltip>
            </Marker>
          ))}

        </MapContainer>



        {/* BOTTOM BUTTONS */}
        {/* BOTTOM BUTTONS - HIDDEN FOR AGENTIC MODE */}
        {/*
        <div className="map-ui-bottom-left">
          <button className="btn-neon" onClick={() => setActiveTab('IMPACTO SOCIAL')} style={{ borderColor: '#39FF14', color: '#39FF14' }}>
            📊 IMPACTO SOCIAL - VER MÉTRICAS
          </button>
        </div>

        <div className="map-ui-bottom-right">
          <button className={`btn-neon ${isHeatmap ? 'active' : ''}`} onClick={() => setIsHeatmap(!isHeatmap)} style={{ borderColor: '#A020F0', color: isHeatmap ? '#fff' : '#A020F0' }}>
            🧠 VISIÓN IA
          </button>

          <button className="btn-neon" onClick={openQR} style={{ borderColor: '#fff', color: '#fff', fontSize: '0.8rem' }}>
            📱 CONECTAR MÓVIL
          </button>
        </div>
        */}
      </section>

      {/* RIGHT SECTION (SIDEBAR) */}
      <aside style={{ background: '#050A14', padding: '20px', borderLeft: '1px solid #333', color: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* HEADER WITH SEARCH AND BACK BUTTONS */}
        <div style={{ marginBottom: '10px' }}>
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
                zIndex: 10000, maxHeight: '300px', overflowY: 'auto',
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
                {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                  <div key={c.id}
                    onClick={() => { setActiveTab('CLIENTES'); setClientSearch(c.name); setSearchTerm(''); }}
                    style={{ padding: '8px', borderBottom: '1px solid #222', cursor: 'pointer', background: '#111' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#222'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                    <div style={{ color: 'gold', fontSize: '0.8rem' }}>🏢 {c.name}</div>
                    <div style={{ color: '#888', fontSize: '0.7rem' }}>{c.type} • {c.tier}</div>
                  </div>
                ))}

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
        </div>

        {/* TOP BACK BUTTON (Redundant visibility) */}
        {activeTab !== 'FLOTA' && (
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
        )}

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
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {vehicles.map(v => (
                    <div
                      key={v.id}
                      onMouseEnter={(e) => {
                        if (v.status === 'busy' && v.currentOrderId) {
                          const req = requests.find(r => r.id === v.currentOrderId);
                          if (req) {
                            setHoveredOrder({ ...req, x: e.clientX, y: e.clientY });
                            setHighlighted({ vehicleId: v.id, requestId: req.id });
                          }
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredOrder(null);
                        setHighlighted(null);
                      }}
                      style={{
                        borderLeft: v.status === 'available' ? '3px solid #39FF14' : '3px solid orange',
                        background: '#111', padding: '8px', marginBottom: '8px', fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#fff' }}>{v.id}</strong>
                        <span style={{ color: v.status === 'available' ? '#39FF14' : 'orange' }}>
                          {v.status === 'available' ? '● DISPONIBLE' : '● EN RUTA'}
                        </span>
                      </div>
                      <div style={{ color: '#ccc' }}>Cond: {v.driver}</div>

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
                <h3 style={{ margin: 0, color: '#fff' }}>GANTT DE DESPACHOS</h3>
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

                  // Sort: Date asc, then Time asc
                  allOrders.sort((a, b) => {
                    if (a.dateSort !== b.dateSort) return a.dateSort - b.dateSort;
                    return a.timeSort.localeCompare(b.timeSort);
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
                    <div style={{ marginBottom: '15px' }}>
                      <button
                        className="btn-neon"
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '0.9rem',
                          color: '#000',
                          background: '#39FF14',
                          borderColor: '#39FF14',
                          fontWeight: 'bold',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                        onClick={() => {
                          // CSV EXPORT LOGIC
                          let csvContent = "data:text/csv;charset=utf-8,";
                          csvContent += "EMPRESA,RIESGO,DEUDA TOTAL,CORRIENTE (0-30),VENCIDO (>30)\n";

                          fullPortfolio.forEach(p => {
                            const row = `${p.name},${p.risk},${p.total},${p.bucket1},${p.bucket2}`;
                            csvContent += row + "\n";
                          });

                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
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
                    {/* 1. KEY METRICS - VERTICAL STACK FOR SAFETY */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                          textAlign: 'center',
                          border: `1px solid ${m.col}`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%'
                        }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{m.icon}</div>
                          <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{m.val}</div>
                          <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{m.label}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '10px' }}>
                            <div style={{ fontSize: '1.5rem' }}>{m.icon}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                              <div style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '1px' }}>{m.label}</div>
                              <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{m.val}</div>
                            </div>
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
      </aside>

      {/* CENTRAL ORDER DETAIL MODAL */}
      {activeRequestId && (() => {
        const r = requests.find(req => req.id === activeRequestId);
        if (!r) return null;
        return (
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 11000, width: '400px', maxWidth: '90vw',
            background: 'rgba(5, 10, 20, 0.95)', border: '1px solid #39FF14', borderRadius: '12px',
            boxShadow: '0 0 50px rgba(0,0,0,0.8)', padding: '20px', backdropFilter: 'blur(10px)',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>📄 DETALLE DE ORDEN</h2>
              <button onClick={() => setActiveRequestId(null)} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#ccc', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>ID ORDEN</div>
                <div style={{ color: 'gold', fontWeight: 'bold' }}>{r.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>ESTADO</div>
                <div style={{ color: r.status === 'assigned' ? '#39FF14' : 'orange' }}>{r.status.toUpperCase()}</div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>CLIENTE / PASAJERO</div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{r.paxName}</div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{r.company}</div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>DESTINO</div>
                <div>{r.dest}</div>
              </div>

              {r.flightId && (
                <div style={{ gridColumn: 'span 2', background: 'rgba(0, 240, 255, 0.1)', padding: '8px', borderRadius: '4px' }}>
                  <div style={{ color: '#00F0FF', fontWeight: 'bold' }}>✈️ VUELO: {r.flightId}</div>
                  <div>Horario: {r.flightTime || '--:--'}</div>
                </div>
              )}

              {r.assignedVehicle ? (
                <div style={{ gridColumn: 'span 2', background: 'rgba(57, 255, 20, 0.1)', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>🚙 UNIDAD: <strong style={{ color: '#fff' }}>{r.assignedVehicle}</strong></span>
                    <span>ETA: <strong style={{ color: '#fff' }}>{r.eta} min</strong></span>
                  </div>
                  <div>CONDUCTOR: {r.assignedDriver}</div>
                  <div style={{ marginTop: '5px', borderTop: '1px dashed #555', paddingTop: '5px', color: 'gold', fontWeight: 'bold', textAlign: 'center' }}>
                    PIN DE SEGURIDAD: {r.pin}
                  </div>
                </div>
              ) : (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '15px', color: 'orange', fontStyle: 'italic' }}>
                  📡 Buscando unidad cercana...
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                className="btn-neon"
                style={{ flex: 1, fontSize: '0.8rem', padding: '10px' }}
                onClick={() => {
                  const msg = `Hola, necesito soporte para la Orden *${r.id}* (Cliente: ${r.paxName || 'Corporativo'}). Estado actual: ${r.status}.`;
                  window.open(`https://wa.me/573000000000?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                📞 CONTACTAR (WA)
              </button>
              <button
                className="btn-neon"
                style={{ flex: 1, fontSize: '0.8rem', padding: '10px', borderColor: '#FF5722', color: '#FF5722' }}
                onClick={() => {
                  window.location.href = `mailto:soporte@teso-agency.ai?subject=ALERTA ORDEN ${r.id}&body=Reportando incidencia con unidad ${r.assignedVehicle || 'N/A'}.`;
                }}
              >
                ⚠ REPORTAR (EMAIL)
              </button>
            </div>
          </div>
        );
      })()}

      {/* FLOATING TOOLTIP FOR SIDEBAR (Keep existing) */}
      {
        hoveredOrder && (
          <div style={{
            position: 'fixed',
            top: hoveredOrder.y - 50,
            left: hoveredOrder.x - 320, // Show to the left of the sidebar
            width: '300px',
            background: 'rgba(5, 10, 20, 0.95)',
            border: '1px solid #39FF14',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 10000,
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
            left: hoveredDebt.x - 340,
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

      {/* PITCH MODE BUTTON (Fixed Overlay) */}
      {/* PITCH MODE BUTTON - HIDDEN FOR AGENTIC MODE */}
      {/*
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
      */}

      {/* PRESENTATION LAYER */}
      {showPresentation && <Presentation onClose={() => setShowPresentation(false)}
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
        }} />}


      {/* OPERATIONAL DASHBOARD LAYER */}
      {showOperationalDashboard && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5000 }}>
          <button
            onClick={() => setShowOperationalDashboard(false)}
            style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 5001, background: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
          >
            CLOSE CORE
          </button>
          <OperationalDashboard vehicles={vehicles} requests={requests} />
        </div>
      )}

      {/* AGENTIC NAVIGATION BAR */}
      <AgenticCommandBar onCommand={handleAgentCommand} />

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
        <Marker position={[6.205, -75.572]} icon={vehicleIcon}>
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
    </div>
  );
};
