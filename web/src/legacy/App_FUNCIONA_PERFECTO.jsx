import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LandingPage from './LandingPage';

// --- ICONS CONFIGURATION (Safe Setup) ---
const vehicleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const passengerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
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
  const NAMES = ['Argos', 'Nutresa', 'Bancolombia', 'EPM', 'Sura', 'Exito', 'Corona', 'Postobón', 'Coltejer', 'Familia'];
  const TYPES = ['Textiles', 'Inversiones', 'Constructora', 'Grupo', 'Banca', 'Logística', 'Consultoría'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `NIT-900.${100 + i}`,
    name: i < 5 ? NAMES[i] : `${TYPES[i % TYPES.length]} Empresa ${i}`,
    type: i < 5 ? 'PLATINUM' : 'CORPORATIVO',
    tier: i < 5 ? 'PLATINUM' : 'GOLD',
    budget: `$${10 + Math.floor(Math.random() * 200)}M/mes`
  }));
};

const generateFutureBookings = (count, companies) => {
  const DATES = ['Hoy', 'Mañana', 'Pasado Mañana'];
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
      status: 'PROGRAMADO'
    };
  });
};

const FLIGHT_DATA = [
  { id: 'AA9314', from: 'MIA', status: 'ON TIME', eta: '18:30', pax: 5, luggage: '2 Maletas' },
  { id: 'AV0142', from: 'MAD', status: 'DELAYED', eta: '20:15', pax: 12, luggage: '1 Maleta' },
  { id: 'LA4050', from: 'BOG', status: 'LANDED', eta: '17:55', pax: 8, luggage: 'Mano' },
];

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('FLOTA');
  const [isLive, setIsLive] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [isHeatmap, setIsHeatmap] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: '', nit: '', type: 'CORPORATIVO', budget: '' });

  const [routes, setRoutes] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setVehicles(generateVehicles(65));
    const initialClients = generateCompanies(1250);
    setClients(initialClients);
    setFutureBookings(generateFutureBookings(70, initialClients));
    addLog('SISTEMA INICIADO. 65 UNIDADES EN LÍNEA.');
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 50));
  };

  // --- LOGIC RESTORED ---
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
    addLog(`👔 VALIDANDO CREDENCIALES: ${client.name}...`);
    setTimeout(() => {
      addLog(`💎 NIVEL ${client.tier} CONFIRMADO. PRIORIDAD: MÁXIMA.`);
      addLog(`🚀 "SALTO DE FILA" ACTIVADO. ASIGNANDO BLINDADA...`);

      const vipReq = {
        id: `VIP-${client.name}`,
        lat: 6.20 + (Math.random() * 0.01),
        lng: -75.57 + (Math.random() * 0.01),
        dest: 'Aeropuerto JMC',
        paxName: `Ejecutivo ${client.name}`
      };
      setRequests(prev => [vipReq, ...prev]);

      setTimeout(() => {
        if (vehicles.length > 0) {
          const driver = vehicles[0];
          const newRoute = [[driver.lat, driver.lng], [vipReq.lat, vipReq.lng]];
          setRoutes(prev => [...prev, newRoute]);
          addLog(`✅ UNIDAD ${driver.id} EN CAMINO A EJECUTIVO DE ${client.name}`);
        }
      }, 1000);
    }, 800);
  };

  const simulateFlightLanding = (flight) => {
    addLog(`✈️ VUELO ${flight.id} ATERRIZÓ. GENERANDO ${flight.pax} BOOKINGS...`);
    const newRequests = Array.from({ length: flight.pax }).map((_, i) => ({
      id: `BK-${flight.id}-${100 + i}`,
      flightId: flight.id,
      lat: 6.17 + (Math.random() * 0.02),
      lng: -75.53 + (Math.random() * 0.02),
      dest: 'Hotel San Fernando',
      paxName: `Ejecutivo ${i + 1}`,
      details: `${flight.luggage} | Clase Ejecutiva`
    }));
    setRequests(prev => [...prev, ...newRequests]);
  };

  const simulateEafitOrder = () => {
    const eafitLoc = { lat: 6.2005, lng: -75.5785, id: 'EAFIT-VIP', dest: 'Rectoría', paxName: 'Rectoría EAFIT' };
    addLog('🚨 SOLICITUD PRIORITARIA DETECTADA: EAFIT');
    setRequests(prev => [...prev, eafitLoc]);

    setTimeout(() => {
      const available = vehicles.filter(v => v.status === 'available');
      if (available.length > 0) {
        const driver = available[0];
        addLog(`✅ UNIDAD ${driver.id} DESPACHADA A EAFIT (0.5km)`);
        const newRoute = [[driver.lat, driver.lng], [eafitLoc.lat, eafitLoc.lng]];
        setRoutes(prev => [...prev, newRoute]);
        setVehicles(prev => prev.map(v => v.id === driver.id ? { ...v, status: 'busy' } : v));
        setRequests(prev => prev.filter(r => r.id !== 'EAFIT-VIP'));
      } else {
        addLog('⚠️ NO HAY UNIDADES CERCANAS DISPONIBLES.');
      }
    }, 1500);
  };

  const simularLlegadaMasiva = () => {
    addLog('⚠️ ALERTA: 3 VUELOS CHARTER DETECTADOS.');
    addLog('🌊 OLA DE DEMANDA INICIADA. +20 SOLICITUDES.');

    const newRequests = Array.from({ length: 20 }).map((_, i) => ({
      id: `ONDEMAND-${8800 + i}`,
      lat: 6.17 + (Math.random() * 0.03),
      lng: -75.53 + (Math.random() * 0.03),
      dest: 'El Poblado',
      paxName: `Turista ${i + 1}`,
      details: 'Equipaje Ligero'
    }));

    setRequests(prev => [...prev, ...newRequests]);
    setTimeout(() => {
      addLog('⚡ RECOMENDACIÓN: EJECUTAR DESPACHO INTELIGENTE.');
    }, 1000);
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

    addLog(`🤖 IA: EMPAREJANDO ${requests.length} SOLICITUDES...`);
    let assignedCount = 0;
    let newRoutes = [...routes];
    const availVehicles = vehicles.filter(v => v.status === 'available');
    const unmatched = [];

    requests.forEach((req, i) => {
      if (i < availVehicles.length) {
        const vehicle = availVehicles[i];
        newRoutes.push([[vehicle.lat, vehicle.lng], [req.lat, req.lng]]);
        vehicle.status = 'busy';
        assignedCount++;
      } else {
        unmatched.push(req);
      }
    });

    setRoutes(newRoutes);
    setRequests(unmatched);
    addLog(`✅ DESPACHO COMPLETADO. ${assignedCount} VIAJES INICIADOS.`);
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '70% 30%', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* LEFT SECTION (MAP) */}
      <section id="map-container" style={{ position: 'relative', background: '#0a0f1a', height: '100%' }}>

        {/* MAP */}
        <MapContainer center={[6.23, -75.58]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
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
              <Circle center={[h.lat, h.lng]} radius={h.r} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3, stroke: false }} />
            </React.Fragment>
          ))}

          {/* ROUTES & MARKERS */}
          {routes.map((r, i) => <Polyline key={i} positions={r} pathOptions={{ color: '#39FF14', weight: 3, opacity: 0.7 }} />)}

          {vehicles.map(v => (
            <Marker key={v.id} position={[v.lat, v.lng]} icon={vehicleIcon}>
              <Popup><strong>{v.id}</strong><br />{v.driver}</Popup>
            </Marker>
          ))}
          {requests.map(r => (
            <Marker key={r.id} position={[r.lat, r.lng]} icon={passengerIcon}>
              <Popup><strong>{r.paxName}</strong><br />Dest: {r.dest}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* TOP NAV */}
        <div style={{ position: 'absolute', top: 20, left: 50, zIndex: 1000, display: 'flex', gap: 10, background: 'rgba(5,10,20,0.9)', padding: '10px', borderRadius: '8px', border: '1px solid #00F0FF' }}>
          {['FLOTA', 'VUELOS', 'CLIENTES', 'AGENDA'].map(tab => (
            <button key={tab} className={`btn-neon ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {/* BOTTOM BUTTONS */}
        <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000 }}>
          <button className="btn-neon" onClick={() => setActiveTab('IMPACTO SOCIAL')} style={{ borderColor: '#39FF14', color: '#39FF14', background: 'rgba(0,0,0,0.8)' }}>
            📊 IMPACTO SOCIAL - VER MÉTRICAS
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}>
          <button className={`btn-neon ${isHeatmap ? 'active' : ''}`} onClick={() => setIsHeatmap(!isHeatmap)} style={{ borderColor: '#A020F0', color: isHeatmap ? '#fff' : '#A020F0', background: 'rgba(0,0,0,0.8)' }}>
            🧠 VISIÓN IA
          </button>
        </div>
      </section>

      {/* RIGHT SECTION (SIDEBAR) */}
      <aside style={{ background: '#050A14', padding: '20px', borderLeft: '1px solid #333', color: '#fff', overflowY: 'auto' }}>
        <h1 style={{ color: '#FF5722' }}>TESO OPS</h1>
        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#888' }}>
          UNIDADES: {vehicles.length} | PENDIENTES: {requests.length}
        </div>

        {/* CONTENT TABS */}
        <div style={{ flex: 1 }}>

          {activeTab === 'FLOTA' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className={`btn-neon ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
                {isLive ? '⏸ PAUSAR' : '▶ INICIAR'}
              </button>
              <button className="btn-neon" onClick={autoAssign} disabled={requests.length === 0}>
                ⚡ DESPACHO INTELIGENTE
              </button>
              <button className="btn-neon btn-alert" onClick={simulateEafitOrder}>🎓 ORDEN EAFIT</button>

              <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                <h4 style={{ color: '#666' }}>LOGS</h4>
                {logs.map((l, i) => <div key={i} style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '4px' }}><span style={{ color: '#00F0FF' }}>{l.time}</span> {l.msg}</div>)}
              </div>
            </div>
          )}

          {activeTab === 'VUELOS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-neon btn-alert" style={{ borderColor: 'red', color: 'red' }} onClick={simularLlegadaMasiva}>🚨 GOLPE DE DEMANDA</button>
              {FLIGHT_DATA.map(f => (
                <div key={f.id} className="flight-card" style={{ border: '1px solid #333', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#00F0FF' }}>{f.id}</strong> <small>{f.status}</small></div>
                  <button className="btn-neon" style={{ width: '100%', marginTop: '5px', fontSize: '0.7rem' }} onClick={() => simulateFlightLanding(f)}>SIMULAR ATERRIZAJE</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'CLIENTES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input placeholder="Buscar..." style={{ flex: 1, background: '#111', border: '1px solid #333', color: '#fff', padding: '5px' }} onChange={e => setClientSearch(e.target.value)} />
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
              <button className="btn-neon btn-alert" onClick={simulateFlightDisruption}>⚠️ SIMULAR CONFLICTO</button>
              {futureBookings.map(b => (
                <div key={b.id} style={{ border: '1px solid #333', padding: '5px', fontSize: '0.8rem', background: b.status.includes('CANCEL') ? 'rgba(255,0,0,0.2)' : 'transparent' }}>
                  <div style={{ color: '#00F0FF' }}>{b.time} - {b.flight}</div>
                  <div>{b.client}</div>
                  <div style={{ fontStyle: 'italic', color: b.status.includes('RETRASADO') ? 'orange' : b.status.includes('CANCEL') ? 'red' : '#888' }}>{b.status}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'IMPACTO SOCIAL' && (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ color: '#39FF14', fontSize: '2.5rem', margin: '10px 0' }}>$45.2M</h1>
              <p style={{ color: '#888' }}>RECAUDO IMPUESTOS LOCALES</p>
              <hr style={{ borderColor: '#333' }} />
              <h2 style={{ color: '#fff' }}>100%</h2>
              <p style={{ color: '#888' }}>SEGURIDAD VERIFICADA</p>
            </div>
          )}
        </div>
      </aside>

    </main>
  );
}

export default App;
