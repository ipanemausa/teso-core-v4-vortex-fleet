import L from 'leaflet';

// --- ICONS CONFIGURATION ---

// 1. Vehicle (Translucent Luminous Core)
export const vehicleIcon = new L.DivIcon({
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
export const passengerIcon = new L.DivIcon({
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

// 3. Custom Airplane Icon
export const planeDivIcon = (angle) => new L.DivIcon({
    className: 'plane-marker',
    html: `<div style="font-size: 32px; transform: rotate(${angle - 45}deg); text-shadow: 0 0 15px cyan; filter: drop-shadow(0 0 8px cyan) brightness(2);">✈️</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

// 4. Airport Icon Generator (Static Infrastructure)
export const getAirportIcon = (code) => new L.DivIcon({
    className: 'airport-marker',
    html: `<div style="display: flex; flex-direction: column; align-items: center;">
    <div style="
      font-size: 24px;
      background: rgba(5, 10, 20, 0.8);
      border: 2px solid #FF5722;
      border-radius: 50%;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 15px #FF5722;
    ">🏢</div>
    <div style="font-size: 0.6rem; color: #FF5722; background: rgba(0,0,0,0.8); padding: 2px 4px; border-radius: 4px; margin-top: 5px; border: 1px solid #FF5722;">${code}</div>
  </div>`,
    iconSize: [40, 70],
    iconAnchor: [20, 20]
});

// 5. Parked Plane Icon (Static Fleet)
export const parkedPlaneIcon = new L.DivIcon({
    className: 'parked-plane-marker',
    html: `<div style="font-size: 20px; transform: rotate(-45deg); filter: grayscale(100%) brightness(0.8);">🛩️</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});
