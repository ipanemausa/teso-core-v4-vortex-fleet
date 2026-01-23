import { v4 as uuidv4 } from 'uuid';

// --- CONFIGURACIÓN DE LA SIMULACIÓN - ACTIVO VIVO v3 ---
const DEFAULT_CONFIG = {
    DAYS_TO_SIMULATE: 180,         // Regla: 180 Días
    TOTAL_DRIVERS: 300,            // Regla: 300 Carros (Flota)
    TOTAL_CLIENTS: 300,            // Regla: 300 Empresas
    DAILY_SERVICES_TARGET: 240,    // Regla: 240 Servicios Diarios
    BASE_SERVICE_VALUE: 125000,    // Regla: $125.000 (Incluye Peaje)
    TOLL_PERCENTAGE: 0.18,         // Regla: 18% Peaje
    COMMISSION_RATE: 0.20,         // Regla: 20% Teso
    SPLIT_CORP: 0.90,              // Regla: 90% Corporativo
    SPLIT_ONDEMAND: 0.10,          // Regla: 10% On Demand
    CHAOS_RATE: 0.10,
};

// --- DATA GENERATORS ---

const generateDrivers = (config) => {
    const drivers = [];
    const names = ['Andrés', 'Felipe', 'María', 'Jorge', 'Sofía', 'Carlos', 'Ana', 'Luis', 'Pedro', 'Diana', 'Roberto', 'Lucía'];
    const lastNames = ['González', 'Rodríguez', 'Pérez', 'Gómez', 'López', 'Martínez', 'Sánchez', 'Díaz', 'Torres', 'Ramírez'];
    const banks = ['Bancolombia', 'Davivienda', 'BBVA', 'Nequi'];

    for (let i = 0; i < config.TOTAL_DRIVERS; i++) {
        drivers.push({
            id: `DRV-${1000 + i}`,
            name: `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
            plate: `TES-${Math.floor(Math.random() * 900) + 100}`,
            status: Math.random() > 0.2 ? 'BUSY' : 'AVAILABLE',
            location: { lat: 6.2442 + (Math.random() * 0.1 - 0.05), lng: -75.5812 + (Math.random() * 0.1 - 0.05) },
            bank: banks[Math.floor(Math.random() * banks.length)],
            account: `****${Math.floor(1000 + Math.random() * 9000)}`,
            rating: (4 + Math.random()).toFixed(1),
            paymentCycle: 'SEMANAL' // Regla: Pago Semanal
        });
    }
    return drivers;
};

const generateClients = (numClients) => {
    const clients = [];
    const companies = ['Bancolombia', 'Grupo Argos', 'Sura', 'Nutresa', 'EPM', 'Globant', 'Rappi', 'Isa', 'Celsia', 'Postobón'];

    for (let i = 0; i < numClients; i++) {
        const compName = companies[Math.floor(Math.random() * companies.length)];
        clients.push({
            id: `CLT-${2000 + i}`,
            companyName: compName + ` Div. ${Math.floor(Math.random() * 10)}`,
            contactName: `Gerente ${i}`,
            tier: Math.random() > 0.8 ? 'VIP' : 'STANDARD',
            nit: `900.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 9)}`,
            paymentTerms: 30, // Regla: Cortes cada 30 días
            balance: 0
        });
    }
    return clients;
};

const generateServices = (drivers, clients, config) => {
    const services = [];
    const today = new Date();

    // Financial Sheets Containers
    const bankTransactions = [];
    const expenses = [];
    const payables = [];

    // Ledger for Payroll (Accumulates driver payout)
    const driverLedger = {}; // { driverId: { totalPending: 0, bank: ..., name: ... } }

    // Ledger for Clients (Accumulates debt)
    const clientLedger = {}; // { clientId: { debt: 0, paid: 0, name: ... } }

    // Conflict Counters
    let conflicts = { delays: 0, cancellations: 0, driverChanges: 0 };

    // Initialization of ledgers
    drivers.forEach(d => driverLedger[d.id] = { totalPending: 0, bank: d.bank, account: d.account, name: d.name, plate: d.plate });
    clients.forEach(c => clientLedger[c.id] = { debt: 0, paid: 0, name: c.companyName });

    // --- SIMULATION LOOP ---
    for (let d = 0; d <= config.DAYS_TO_SIMULATE; d++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - (config.DAYS_TO_SIMULATE - d));
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfMonth = currentDate.getDate();
        const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat

        // --- 1. DAILY VOLUME CALCULATION ---
        // Rule: 240 services daily (approx)
        const baseVolume = config.DAILY_SERVICES_TARGET;
        // Small variance (+/- 5%) to feel "Alive" but strictly around 240
        const dailyVolume = Math.floor(baseVolume * (0.95 + Math.random() * 0.1));

        // --- 2. GENERATE SERVICES ---
        for (let s = 0; s < dailyVolume; s++) {
            const isChaos = Math.random() < config.CHAOS_RATE;
            let status = 'COMPLETED';
            let note = 'Servicio exitoso al Aeropuerto';

            if (isChaos) {
                const chaosType = Math.random();
                if (chaosType < 0.2) { status = 'CANCELLED'; note = 'Cancelado por cliente'; conflicts.cancellations++; }
                else if (chaosType < 0.6) { status = 'DELAYED'; note = 'Retraso en vía o vuelo'; conflicts.delays++; }
                else { status = 'DRIVER_CHANGE'; note = 'Reasignación operativa'; conflicts.driverChanges++; }
            }

            // Determine Type: Corporate vs On Demand
            const isCorporate = Math.random() < config.SPLIT_CORP; // 90%
            const serviceType = isCorporate ? 'CORPORATE' : 'ONDEMAND';

            // Financial Calculations
            const grossValue = status === 'CANCELLED' ? 0 : config.BASE_SERVICE_VALUE;

            // Deductions
            const tollValue = grossValue * config.TOLL_PERCENTAGE; // 18%
            const commissionValue = grossValue * config.COMMISSION_RATE; // 20%
            const driverNet = grossValue - tollValue - commissionValue;

            const drv = drivers[Math.floor(Math.random() * drivers.length)];
            const clt = isCorporate ? clients[Math.floor(Math.random() * clients.length)] : { id: 'GUEST', companyName: 'Cliente Ocasional', paymentTerms: 0 };
            const serviceId = uuidv4().substring(0, 8).toUpperCase();

            // Store Service
            services.push({
                id: serviceId,
                date: currentDate.toISOString(),
                clientId: clt.id,
                driverId: status === 'CANCELLED' ? null : drv.id,
                status: status,
                financials: {
                    totalValue: grossValue,
                    tesoRevenue: commissionValue, // Revenue is the 20% commission
                    driverPayment: driverNet,
                    tolls: tollValue
                },
                type: serviceType,
                metadata: { note: note, hasDispute: false },
                driverName: status === 'CANCELLED' ? `${drv.name} (X)` : drv.name,
                vehiclePlate: drv.plate,
                paxName: isCorporate ? clt.companyName : 'Pasajero App',
                route: 'Medellín -> JMC (Aeropuerto)' // Default route
            });

            if (status !== 'CANCELLED') {
                // HANDLE PAYMENTS / DEBT
                if (isCorporate) {
                    // Corporate: Goes to CXC (Client Debt)
                    if (clientLedger[clt.id]) {
                        clientLedger[clt.id].debt += grossValue;
                    }
                } else {
                    // On Demand: Immediate Payment (Gateway) -> Bank Inflow
                    // Maps to 'INGRESOS' tab effectively
                    bankTransactions.push({
                        date: dateStr,
                        description: `PAGO VIAJE APP - ONDEMAND (Ref: ${serviceId})`,
                        type: 'INCOME',
                        category: 'VENTA DIRECTA',
                        ref: serviceId,
                        amount: grossValue,
                        clientName: 'PASARELA PAGOS'
                    });
                }

                // DRIVER ACCRUAL (We always owe the driver their net share)
                driverLedger[drv.id].totalPending += driverNet;
            }
        }

        // --- 3. PAYROLL DISPERSION (WEEKLY) ---
        // Let's assume Fridays (Day 5) are payment days.
        if (dayOfWeek === 5) {
            Object.keys(driverLedger).forEach(drvId => {
                const ledger = driverLedger[drvId];
                if (ledger.totalPending > 0) {
                    const amountToPay = ledger.totalPending;

                    // Create Payable Record (CXP)
                    payables.push({
                        driver: ledger.name,
                        vehicle: ledger.plate,
                        bank: ledger.bank,
                        account: ledger.account,
                        amount: amountToPay,
                        status: 'PROCESSED',
                        payableAt: dateStr,
                        ref: `WEEKLY-PAY-${dateStr}-${drvId.substring(4)}`
                    });

                    // Deduct from Bank (Outflow) -> EGRESOS
                    bankTransactions.push({
                        date: dateStr,
                        description: `DISPERSIÓN SEMANAL CONDUCTORES - ${ledger.name}`,
                        type: 'EXPENSE',
                        category: 'NOMINA CONDUCTORES',
                        ref: `TR-PAY-${drvId}-${dayOfMonth}`,
                        amount: -amountToPay,
                        clientName: 'NOMINA FLOTA'
                    });

                    // Reset Pending
                    ledger.totalPending = 0;
                }
            });
        }

        // --- 4. CORPORATE INVOICING & PAYMENTS (MONTHLY) ---
        if (dayOfMonth === 30) {
            Object.keys(clientLedger).forEach(clientId => {
                const ledger = clientLedger[clientId];
                if (ledger.debt > 0) {
                    // Simulate Payment (Probability of payment on cutoff)
                    // For simulation "Living" feel, we pay 90% of debt on cut-off
                    const paymentAmount = Math.floor(ledger.debt * 0.9);

                    if (paymentAmount > 0) {
                        bankTransactions.push({
                            date: dateStr,
                            description: `PAGO FACTURA CORPORATIVA - ${ledger.name}`,
                            type: 'INCOME',
                            category: 'RECAUDO CARTERA',
                            ref: `FAC-DIAN-${Math.floor(Math.random() * 99999)}`,
                            amount: paymentAmount,
                            clientName: ledger.name
                        });

                        ledger.debt -= paymentAmount;
                        ledger.paid += paymentAmount;
                    }
                }
            });

            // --- 5. OPERATIONAL EXPENSES ---
            expenses.push({
                date: dateStr,
                category: 'INFRAESTRUCTURA',
                vehicle: 'AWS & PLATAFORMA',
                amount: 2500000,
                ref: `AWS-${dayOfMonth}`
            });
        }
    }

    // --- INITIAL CASH FLOW (LIQUIDITY) ---
    // 240 services * 125,000 * 30 days ~ 900,000,000 GTV/Month
    const initialCash = 900000000;

    // Calculate Running Balance
    let runningBalance = initialCash;
    bankTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    bankTransactions.forEach(t => {
        runningBalance += t.amount;
        t.balance = runningBalance;
    });

    return { services, bankTransactions, expenses, payables, conflicts };
};


// --- MOTOR PRINCIPAL ---
export const runSimulation = (configOverride = {}) => {
    // MERGE CONFIG USER OVERRIDES
    const FINAL_CONFIG = { ...DEFAULT_CONFIG, ...configOverride };

    // FORCE RULE CONSISTENCY
    FINAL_CONFIG.TOTAL_DRIVERS = 300;
    FINAL_CONFIG.TOTAL_CLIENTS = 300;
    FINAL_CONFIG.DAILY_SERVICES_TARGET = 240;

    console.log(`💥 INICIANDO SIMULACIÓN TESO | Operación: ${FINAL_CONFIG.TOTAL_DRIVERS} Móviles | Target Diario: ${FINAL_CONFIG.DAILY_SERVICES_TARGET}`);

    const drivers = generateDrivers(FINAL_CONFIG);
    const clients = generateClients(FINAL_CONFIG.TOTAL_CLIENTS);
    const { services, bankTransactions, expenses, payables, conflicts } = generateServices(drivers, clients, FINAL_CONFIG);

    // Calcular totales para el Dashboard
    const financialSummary = services.reduce((acc, curr) => {
        return {
            totalRevenue: acc.totalRevenue + curr.financials.totalValue,
            tesoNet: acc.tesoNet + curr.financials.tesoRevenue,
            totalPayables: acc.totalPayables + curr.financials.driverPayment,
            totalTrips: acc.totalTrips + 1,
            completedTrips: acc.completedTrips + (curr.status === 'COMPLETED' ? 1 : 0),
            cancelledTrips: acc.cancelledTrips + (curr.status === 'CANCELLED' ? 1 : 0)
        };
    }, { totalRevenue: 0, tesoNet: 0, totalPayables: 0, totalTrips: 0, completedTrips: 0, cancelledTrips: 0 });

    return {
        drivers,
        clients,
        services,
        bankTransactions,
        expenses,
        payables,
        conflicts,
        financialSummary,
        simulationMetadata: {
            generatedAt: new Date().toISOString(),
            config: FINAL_CONFIG
        }
    };
};
