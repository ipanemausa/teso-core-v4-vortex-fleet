import * as XLSX from 'xlsx';

export const generateMasterExcel = (requests, vehicles, clients, simulationContext, analytics, scenario) => {
    // 1. Prepare Data for Each Sheet

    // --- SHEET 1: PROGRAMACION (Main Data) ---
    const programacionData = requests.map(r => ({
        ID: r.id,
        FECHA: (r.date && typeof r.date === 'string' && r.date.includes('T')) ? r.date.split('T')[0] : (r.date || new Date().toLocaleDateString()), // Use actual date if avail
        HORA: r.flightTime || 'NOW',
        CLIENTE: r.company || r.paxName,
        RUTA: r.dest || r.route,
        ESTADO: r.status.toUpperCase(),
        CONDUCTOR: r.assignedDriver || 'PENDIENTE',
        VEHICULO: r.assignedVehicle || 'PENDIENTE',
        TARIFA: r.fare,
        TIPO: r.type,
        NOTAS: r.pin ? `PIN: ${r.pin}` : ''
    }));

    // --- SHEET 2: CXC (Accounts Receivable - Clients) ---
    // USE SIMULATED ANALYTICS IF AVAILABLE FOR ACCURACY (Balances after payments)
    let cxcData = [];
    if (analytics && analytics.topClients) {
        cxcData = analytics.topClients.map(c => ({
            CLIENTE: c.name,
            'SALDO PENDIENTE': c.balance, // This balance accounts for payments!
            ESTADO: c.balance > 0 ? 'POR COBRAR' : 'AL DIA',
            'FECHA CORTE': new Date().toLocaleDateString()
        }));
    } else {
        // Fallback: Group requests by Client and sum
        const cxcMap = {};
        requests.forEach(r => {
            const clientName = r.company || 'PARTICULAR';
            if (!cxcMap[clientName]) cxcMap[clientName] = 0;
            let val = 0;
            try { val = parseFloat((r.fare || '0').replace(/[^0-9]/g, '')); } catch (e) { val = 0; }
            cxcMap[clientName] += val;
        });

        cxcData = Object.keys(cxcMap).map(client => ({
            CLIENTE: client,
            'SALDO PENDIENTE': cxcMap[client],
            ESTADO: 'POR COBRAR',
            'FECHA CORTE': new Date().toLocaleDateString()
        }));
    }

    // --- SHEET 3: CXP (Accounts Payable - Drivers) ---
    // If simulationContext is present, use it. Else fallback to mock.
    let cxpData = [];
    if (simulationContext && simulationContext.payables) {
        cxpData = simulationContext.payables.map(p => ({
            CONDUCTOR: p.driver,
            VEHICULO: p.vehicle,
            'SALDO A FAVOR': p.amount,
            BANCO: p.bank,
            CUENTA: p.account,
            ESTADO: p.status,
            REF: p.ref
        }));
    } else {
        cxpData = vehicles.map(v => ({
            CONDUCTOR: v.driver,
            VEHICULO: v.id,
            'SALDO A FAVOR': Math.floor(Math.random() * 500000) + 100000,
            BANCO: 'BANCOLOMBIA',
            CUENTA: `****${Math.floor(Math.random() * 8999) + 1000}`,
            ESTADO: 'PENDIENTE',
            REF: `NOM-${Math.floor(Math.random() * 1000)}`
        }));
    }

    // --- SHEET 4: BANCOS (Real Simulation Data) ---
    let bancosData = [];
    if (simulationContext && simulationContext.bankTransactions) {
        bancosData = simulationContext.bankTransactions.map(t => ({
            FECHA: t.date,
            TIPO: t.type,
            DESCRIPCION: t.description,
            REF: t.ref,
            VALOR: t.amount,
            SALDO: t.balance
        }));
    } else {
        bancosData = [
            { BANCO: 'BANCOLOMBIA', TIPO: 'AHORROS', SALDO: 145000000, 'DISPONIBLE': 145000000 },
            { BANCO: 'DAVIVIENDA', TIPO: 'CORRIENTE', SALDO: 50000000, 'DISPONIBLE': 48000000 },
        ];
    }


    // --- SHEET 5: EGRESOS (Real Simulation Data) ---
    let egresosData = [];
    if (simulationContext && simulationContext.expenses) {
        egresosData = simulationContext.expenses.map(e => ({
            FECHA: e.date,
            RUBRO: e.category,
            VEHICULO: e.vehicle,
            VALOR: e.amount,
            REF: e.ref
        }));
    } else {
        egresosData = [
            { FECHA: '2025-10-27', RUBRO: 'NOMINA', DETALLE: 'PAGO CONDUCTORES Q2', VALOR: 45000000 },
            { FECHA: '2025-10-27', RUBRO: 'GASOLINA', DETALLE: 'CONVENIO TERPEL', VALOR: 12000000 },
        ];
    }

    // --- SHEET 6: CONFLICTOS (New!) ---
    let conflictosData = [];
    if (simulationContext && simulationContext.conflicts) {
        conflictosData = [
            { TIPO: 'CANCELACIONES', CANTIDAD: simulationContext.conflicts.cancellations, IMPACTO: 'ALTO' },
            { TIPO: 'RETRASOS TRAFICO', CANTIDAD: simulationContext.conflicts.delays, IMPACTO: 'MEDIO' },
            { TIPO: 'CAMBIOS CONDUCTOR', CANTIDAD: simulationContext.conflicts.driverChanges, IMPACTO: 'BAJO' }
        ];
    }


    // 2. Create Workbook and Sheets
    const wb = XLSX.utils.book_new();

    const wsProgramacion = XLSX.utils.json_to_sheet(programacionData);
    const wsCxc = XLSX.utils.json_to_sheet(cxcData);
    const wsCxp = XLSX.utils.json_to_sheet(cxpData);
    const wsBancos = XLSX.utils.json_to_sheet(bancosData);
    const wsEgresos = XLSX.utils.json_to_sheet(egresosData);
    const wsConflictos = XLSX.utils.json_to_sheet(conflictosData);

    // 3. Set Column Widths (Basic Formatting)
    const setWidths = (ws, widths) => {
        ws['!cols'] = widths.map(w => ({ wch: w }));
    };

    setWidths(wsProgramacion, [
        15, // ID
        20, // FECHA
        20, // HORA
        30, // CLIENTE
        30, // RUTA
        15, // ESTADO
        25, // CONDUCTOR
        25, // VEHICULO
        15, // TARIFA
        25, // TIPO
        30  // NOTAS
    ]);
    setWidths(wsCxc, [30, 20, 20, 20]);
    setWidths(wsCxp, [30, 20, 25, 20, 25]);
    setWidths(wsBancos, [25, 20, 20, 20]);


    // 4. Append Sheets
    XLSX.utils.book_append_sheet(wb, wsProgramacion, "PROGRAMACION");
    XLSX.utils.book_append_sheet(wb, wsCxc, "CXC");
    XLSX.utils.book_append_sheet(wb, wsCxp, "CXP");
    XLSX.utils.book_append_sheet(wb, wsBancos, "BANCOS");
    XLSX.utils.book_append_sheet(wb, wsEgresos, "EGRESOS");
    XLSX.utils.book_append_sheet(wb, wsConflictos, "CONFLICTOS_OPS");

    // 5. Write and Download
    XLSX.writeFile(wb, "TESO_MASTER_DATASET_VIVO.xlsx");
};
