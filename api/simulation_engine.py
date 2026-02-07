import pandas as pd
import random
from datetime import datetime, timedelta
from faker import Faker
import io
import os
from sqlalchemy.orm import Session
from database import get_db, engine
import models

fake = Faker('es_CO')

def apply_chaos_logic(service_data, stress_mode=False):
    """
    Apply Chaos Probability.
    If stress_mode=True, probabilities are amplified (WAR ROOM SCENARIO).
    """
    roll = random.random()
    
    # WAR ROOM LOGIC
    # If Stress Mode is ON, we want to see RED.
    prob_cancellation = 0.30 if stress_mode else 0.05
    prob_delay = 0.50 if stress_mode else 0.08
    prob_noshow = 0.60 if stress_mode else 0.10
    
    if roll < prob_cancellation: # Cancellation
        service_data['status'] = 'CANCELLED'
        service_data['financials']['netRevenue'] = 0
        service_data['financials']['driverPayment'] = 0
        service_data['financials']['toll'] = 0
        service_data['financials']['totalValue'] = 0 # No income
    elif roll < prob_delay: # Delay
        service_data['status'] = 'DELAYED'
        # Cost increases (Recovery)
        service_data['financials']['driverPayment'] *= 1.2 
        service_data['financials']['netRevenue'] -= (service_data['financials']['driverPayment'] * 0.2)
    elif roll < prob_noshow: # No Show
        service_data['status'] = 'NO_SHOW'
        # Penalty Fee (50% charge)
        service_data['financials']['totalValue'] *= 0.5
        service_data['financials']['driverPayment'] *= 0.2 # Small compensation
        service_data['financials']['netRevenue'] = service_data['financials']['totalValue'] - service_data['financials']['driverPayment']
    else:
        service_data['status'] = 'COMPLETED'
    
    return service_data


def seed_database_from_excel(db: Session, excel_path: str):
    """
    ONE-TIME MIGRATION: Reads legacy Excel and populates Postgres Tables.
    """
    if not os.path.exists(excel_path):
        print(f"[WARN] SEED FAILED: Excel file not found at {excel_path}")
        return False

    try:
        print(f"[INFO] SEEDING DATABASE FROM: {excel_path}")
        df = pd.read_excel(excel_path, sheet_name=0)
        
        # 1. OPTIMIZED: Bulk Insert Companies to avoid duplicates
        # CHANGED: 'EMPRESAS' -> 'CLIENTE' based on Teso_Restored_Ledger
        col_companies = 'CLIENTE' if 'CLIENTE' in df.columns else 'EMPRESAS'
        unique_companies = df[col_companies].dropna().unique().tolist()
        existing_companies = {c.name: c for c in db.query(models.Company).all()}
        
        for comp_name in unique_companies:
            if comp_name not in existing_companies:
                new_comp = models.Company(name=str(comp_name))
                db.add(new_comp)
                existing_companies[comp_name] = new_comp # Cache it
        db.commit()

        # 2. Insert Services
        for _, row in df.iterrows():
            # DATE PARSING FIX
            raw_date = row['FECHA']
            try:
                r_date = pd.to_datetime(raw_date).to_pydatetime()
            except:
                continue
                
            if pd.isnull(r_date): continue
            
            # CHANGED: 'EMPRESAS' -> col_companies logic
            comp_name = str(row[col_companies]) if not pd.isnull(row[col_companies]) else "PARTICULAR"
            comp = existing_companies.get(comp_name)
            
            # Simple Fare Logic (Same as before)
            fare = 125000.0
            
            svc = models.Service(
                date=r_date,
                company_id=comp.id if comp else None,
                passenger_name=str(row['USUARIOS']) if not pd.isnull(row['USUARIOS']) else "Usuario",
                fare_amount=fare,
                toll_amount=18000.0,
                teso_commission_pct=0.20,
                status="COMPLETED",
                source="EXCEL_IMPORT"
            )
            db.add(svc)
        
        db.commit()
        print("[INFO] SEEDING COMPLETE.")
        return True

    except Exception as e:
        print(f"[ERROR] SEEDING ERROR: {e}")
        db.rollback()
        return False

def generate_financial_simulation(days: int = 360, traffic_growth: float = 1.0, cxc_days: int = 30, cxp_freq: int = 7, stress_mode: bool = False, base_daily_services: int = 40, drivers_count: int = 45):
    """
    HYBRID ENGINE: DB First -> Excel Fallback
    """
    print("--- [INFO] STARTING CLOUD NATIVE ENGINE ---")
    
    # SETUP
    start_date = datetime.now()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # --- PROTOCOLO TESO MASTER ESTRICTO ---
    # 1. Definir rutas según el estándar
    DATA_DIR = os.path.join(base_dir, "data") # Runtime data
    SEED_DIR = os.path.join(base_dir, "seed_data") # Static seed
    
    VIVO_PATH = os.path.join(DATA_DIR, "TESO_MASTER_DATASET_VIVO.xlsx")
    SEED_PATH = os.path.join(SEED_DIR, "TESO_MASTER_DATASET.xlsx")
    
    # 2. Lógica de Selección de Fuente (VIVO > SEED)
    real_data_path = SEED_PATH # Default safe fallback
    
    if os.path.exists(VIVO_PATH):
        # Verificar integridad basica
        print(f"[INFO] LEYENDO DATASET VIVO: {VIVO_PATH}")
        real_data_path = VIVO_PATH
    elif os.path.exists(SEED_PATH):
        print(f"[INFO] LEYENDO SEMILLA ESTATICA (VIVO NO ENCONTRADO): {SEED_PATH}")
        real_data_path = SEED_PATH
    else:
        print("[WARN] ALERTA CRITICA: NO SE ENCUENTRA NI EL VIVO NI LA SEMILLA.")
        # Fallback de emergencia a generador (se mantiene lógica abajo)

    # OUTPUT CONTAINERS
    services_data = []
    cxc_data = {}
    cxp_data = []
    cash_flow_events = []
    expenses_data = []
    conflicts_data = []
    
    # FIXED EXPENSES (Hardcoded Business Logic)
    fixed_expenses = [
        {"desc": "INFRAESTRUCTURA AWS & SERVIDORES", "amount": 2500000, "freq": 30, "day": 5},
        {"desc": "OFICINA & ADMINISTRACION", "amount": 4500000, "freq": 30, "day": 1},
        {"desc": "PERSONAL DE SOPORTE (NOMINA)", "amount": 12000000, "freq": 15, "day": 15}
    ]

    # --- PHASE 1: TRY DATABASE CONNECTION ---
    db_generator = get_db()
    db = next(db_generator, None) if db_generator else None

    use_db = False
    
    if db:
        # Check if we need to seed
        try:
            # Create Tables if not exist (Dev convenience)
            models.Base.metadata.create_all(bind=engine)
            
            svc_count = db.query(models.Service).count()
            if svc_count == 0:
                print("[INFO] DB EMPTY. ATTEMPTING SEED...")
                seed_success = seed_database_from_excel(db, real_data_path)
                use_db = seed_success
            else:
                print(f"[INFO] DB CONNECTED. FOUND {svc_count} RECORDS.")
                use_db = True
        except Exception as e:
            print(f"⚠️ DB INIT ERROR: {e}. FALLING BACK TO LEGACY.")
            use_db = False
    
    # --- PHASE 2: DATA FETCHING ---
    if use_db:
        # FETCH FROM POSTGRES
        print("[INFO] FETCHING FROM CLOUD SQL...")
        services_models = db.query(models.Service).all() # Simple 'select *' for now
        
        for svc in services_models:
            # Reconstruct Logic for JSON/Financials
            fare = svc.fare_amount
            toll = svc.toll_amount
            revenue = fare * svc.teso_commission_pct
            driver_pay = fare - revenue - toll
            
            # Add to Services List
            # Add to Services List
            # ADAPTER FIX: Match App.jsx keys (Spanish UPPERCASE)
            mock_plate = f"EQO-{random.randint(100,999)}"
            mock_driver = f"Conductor {random.randint(1,50)}"
            
            status_map = {
                "COMPLETED": "FINALIZADO",
                "CANCELLED": "CANCELADO", 
                "DELAYED": "RETRASADO",
                "NO_SHOW": "NO_SHOW"
            }
            
            svc_dict = {
                "ID": svc.id,
                "FECHA": svc.date.isoformat(),
                "CLIENTE": svc.company.name if svc.company else "PARTICULAR",
                "CONDUCTOR": svc.driver.name if svc.driver else mock_driver, # Mock if DB empty
                "VEHICULO": svc.driver.vehicle_plate if svc.driver else mock_plate,
                "ESTADO": status_map.get(svc.status, "EN_PROGRESO"),
                "TARIFA": fare,
                "TIPO": "VAN" if svc.company_id else "AUTO", # Maps to CORPORATE / ONDEMAND in UI
                "NOTAS": "Simulated Cloud Event",
                "RUTA": "Ruta Optimizada",
                # Legacy keys kept for safety (optional)
                "status": svc.status
            }
            
            # INJECT CHAOS (The War Room Factor)
            svc_dict = apply_chaos_logic(svc_dict, stress_mode=stress_mode)
            
            services_data.append(svc_dict)
            
            # Cash Flow Events (Calculated on the fly from DB data)
            # LOGIC FIX: T+0 for On-Demand (No Company) vs T+30 for Corporate
            is_corporate = svc.company_id is not None
            days_offset = 30 if is_corporate else 0
            
            inflow_date = svc.date + timedelta(days=days_offset) # Dynamic Logic
            cash_flow_events.append({
                "FECHA": inflow_date,
                "TIPO": "INGRESO_COMISION",
                "MONTO": revenue,
                "DETALLE": f"Comisión Cloud - {svc.company.name if svc.company else 'ON-DEMAND'}"
            })
             # ... (Add other events similarly if needed)
            
            # CXC Aggregation
            c_name = svc.company.name if svc.company else "Particular"
            if c_name not in cxc_data: cxc_data[c_name] = 0
            cxc_data[c_name] += fare

    else:
        # V4 REDUCED GENERATION LOGIC (Synthetic) OR EXCEL LOADING
        df_real = pd.DataFrame()
        
        # TRY LOADING EXCEL MASTER FIRST
        if os.path.exists(real_data_path):
             print(f"[INFO] CARGANDO MASTER DATASET DE: {real_data_path}")
             try:
                 df_real = pd.read_excel(real_data_path)
                 print(f"[INFO] EXCEL CARGADO: {len(df_real)} Registros Encontrados.")
             except Exception as e:
                 print(f"[WARN] ERROR LEYENDO EXCEL: {e}. USANDO GENERADOR SINTETICO.")
        
        if df_real.empty:
            print(f"[INFO] GENERANDO DATASET V4 SINTETICO ({days} DIAS, {base_daily_services} OPS/DIA)...")
            
            # Generator Config
            companies = [f"EMPRESA_{i}" for i in range(1, 21)] # 20 Corporates
            drivers = [f"COND-{i:03d}" for i in range(1, drivers_count + 1)] # 45 Drivers
            
            current_date = start_date - timedelta(days=days) # Start from past
            
            for d in range(days):
                daily_date = current_date + timedelta(days=d)
                # Daily variance +/- 20%
                daily_ops = int(base_daily_services * (0.8 + 0.4 * random.random()))
                
                for _ in range(daily_ops):
                    # 90% Corporate, 10% On-Demand
                    is_corporate = random.random() < 0.90
                    client = random.choice(companies) if is_corporate else "PARTICULAR"
                    tipo = "VAN" if is_corporate else "AUTO"
                    
                    # Logic: Fare
                    fare = 125000
                    toll = 18000
                    comm = fare * 0.20
                    driver_pay = fare - comm - toll
                    
                    svc = {
                         "ID": random.randint(100000, 999999),
                         "FECHA": daily_date.isoformat(),
                         "CLIENTE": client,
                         "CONDUCTOR": random.choice(drivers),
                         "VEHICULO": f"TES-{random.randint(100,999)}",
                         "ESTADO": "FINALIZADO",
                         "TARIFA": fare,
                         "TIPO": tipo,
                         "NOTAS": "Simulated V4 Event",
                         "RUTA": "Ruta Optimizada",
                         "status": "COMPLETED",
                         "financials": {
                            "totalValue": fare,
                            "driverPayment": driver_pay,
                            "toll": toll,
                            "netRevenue": comm
                         }
                    }
                    
                    # Apply V4 Chaos Logic
                    svc = apply_chaos_logic(svc, stress_mode=stress_mode)
                    
                    # Sync Status back to Spanish for Excel
                    status_map = {"COMPLETED": "FINALIZADO", "CANCELLED": "CANCELADO", "DELAYED": "RETRASADO", "NO_SHOW": "NO_SHOW"}
                    svc["ESTADO"] = status_map.get(svc.get("status", "COMPLETED"), "FINALIZADO")
                    
                    services_data.append(svc)
                    
                    # Cash Flow Events
                    days_offset = 30 if is_corporate else 0
                    inflow_date = daily_date + timedelta(days=days_offset)
                    
                    cash_flow_events.append({
                        "FECHA": inflow_date,
                        "TIPO": "INGRESO_COMISION",
                        "MONTO": comm,
                        "DETALLE": f"Comisión - {client}"
                    })
                    
                    # CXC
                    if client not in cxc_data: cxc_data[client] = 0
                    cxc_data[client] += fare
    
            print(f"[INFO] V4 GENERATION COMPLETE: {len(services_data)} Services Created.")
            
        
        # Fallback Check (For Excel Loading Logic)
        # If df_real was loaded, we process it here. If it was empty, we skipped this block implicitly?
        # WAIT: The code below processes df_real. If we generated synthetic data above, df_real is empty, so we skip the block below.
        # But we ALREADY populated services_data in the block above!
        # So we only need to populate services_data from df_real IF df_real is NOT empty AND services_data IS empty.
        
        if not df_real.empty and not services_data: 

            print(f"[INFO] PROCESSING {len(df_real)} ROWS FROM EXCEL...")
            try:
                # To keep it functional, we replicate the basic loop:
                skipped_count = 0
                processed_count = 0
                
                for idx, row in df_real.iterrows():
                     # (Simplified version of original loop)
                     # DATE PARSING FIX
                     raw_date = row.get('FECHA')
                     try:
                        if pd.isnull(raw_date):
                             skipped_count += 1
                             continue
                        r_date = pd.to_datetime(raw_date).to_pydatetime()
                     except Exception as date_err:
                        print(f"[WARN] Date Parse Error Row {idx}: {raw_date} -> {date_err}")
                        skipped_count += 1
                        continue
                        
                     fare = 125000
                     
                     # 1. Company Handling (Robust)
                     # Fix: Check columns explicitly
                     comp_val = row.get('CLIENTE') or row.get('EMPRESAS') or 'PARTICULAR'
                     
                     svc = {
                        "ID": row.get('ID') or random.randint(10000, 99999),
                        "FECHA": r_date.isoformat(),
                        "CLIENTE": str(comp_val),
                        "CONDUCTOR": str(row.get('CONDUCTOR') or f"Cond-{random.randint(1,10)}"),
                        "VEHICULO": str(row.get('VEHICULO') or f"TES-{random.randint(100,999)}"),
                        "ESTADO": str(row.get('ESTADO') or "FINALIZADO"),
                        "TARIFA": float(row.get('TARIFA') or fare),
                        "TIPO": str(row.get('TIPO') or ("VAN" if str(comp_val) != 'PARTICULAR' else "AUTO")),
                        "NOTAS": str(row.get('NOTAS') or "Excel Fallback"),
                        "RUTA": str(row.get('RUTA') or "Pendiente")
                     }
                     services_data.append(svc)
                     processed_count += 1
                     
                     # LOGIC FIX: T+0 / T+30 based on TIPO
                     type_check = svc["TIPO"]
                     is_ondemand = (type_check == 'AUTO')
                     days_offset = 0 if is_ondemand else 30
                     
                     # Cash Flow Event
                     inflow_date = r_date + timedelta(days=days_offset)
                     cash_flow_events.append({
                        "FECHA": inflow_date,
                        "TIPO": "INGRESO_COMISION",
                        "MONTO": svc["TARIFA"]*0.2, # Use actual tariff
                        "DETALLE": f"Comisión Excel - {comp_val}"
                     })

                     # Add to flow...
                     if str(comp_val) not in cxc_data: cxc_data[str(comp_val)] = 0
                     cxc_data[str(comp_val)] += svc["TARIFA"]
                
                print(f"[INFO] EXCEL PROCESSED: {processed_count} OK, {skipped_count} SKIPPED.")
            except Exception as e:
                print(f"[ERROR] FALLBACK CRITICAL ERROR: {e}")
                import traceback
                traceback.print_exc()


    # --- PHASE 3: PROJECTION & FINANCIALS (Common Logic) ---
    # Apply Expenses (Same as before)
    # This logic runs REGARDLESS of data source (DB or Excel)
    
    # 1. Generate Expense Events
    if services_data:
        dates = [datetime.fromisoformat(s["FECHA"]) for s in services_data]
        min_date = min(dates)
        max_date = max(dates)
        curr = min_date
        while curr <= max_date:
            for exp in fixed_expenses:
                if curr.day == exp["day"] or (exp["freq"] == 15 and curr.day == 30):
                    expenses_data.append({
                        "FECHA": curr.strftime("%Y-%m-%d"),
                        "CATEGORIA": "GASTOS_FIJOS",
                        "DESCRIPCION": exp["desc"],
                        "MONTO": -exp["amount"],
                        "RESPONSABLE": "OPS MANAGER"
                    })
                    cash_flow_events.append({
                        "FECHA": curr,
                        "TIPO": "EGRESO_FIJO",
                        "MONTO": -exp["amount"],
                        "DETALLE": exp["desc"]
                    })
            curr += timedelta(days=1)

    # 2. Build Daily Cash Flow Table
    cash_flow_events.sort(key=lambda x: x["FECHA"] if isinstance(x["FECHA"], datetime) else datetime.now()) # Safety sort
    
    cash_flow_df = []
    # Initial Balance Rule
    daily_ops_cost_est = 240 * (82000 + 18000)
    start_cash_rule = (daily_ops_cost_est * 30) 
    running_balance = start_cash_rule
    
    daily_agg = {}
    for ev in cash_flow_events:
        d_str = ev["FECHA"].strftime("%Y-%m-%d") if isinstance(ev["FECHA"], datetime) else str(ev["FECHA"])[:10]
        if d_str not in daily_agg: daily_agg[d_str] = 0
        daily_agg[d_str] += ev["MONTO"]
        
    for d_str in sorted(daily_agg.keys()):
        net = daily_agg[d_str]
        running_balance += net
        cash_flow_df.append({
            "FECHA": d_str,
            "INGRESO NETO": net if net > 0 else 0,
            "EGRESO NETO": net if net < 0 else 0,
            "SALDO_ACUMULADO": running_balance,
            "ESTADO_CAJA": "INSOLVENTE" if running_balance < 0 else "SOLVENTE"
        })

    # 3. CXC & CXP Dictionaries to List
    cxc_list = [{"CLIENTE": k, "SALDO": v} for k,v in cxc_data.items()]
    cxp_list = [{"CONDUCTOR": f"COND-{i}", "SALDO": 1000000} for i in range(10)] # Simplified Mock

    # --- PHASE 4: EXPORT ---
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        pd.DataFrame(services_data).to_excel(writer, sheet_name='PROGRAMACION', index=False)
        pd.DataFrame(cxc_list).to_excel(writer, sheet_name='CXC', index=False)
        pd.DataFrame(cxp_list).to_excel(writer, sheet_name='CXP', index=False)
        pd.DataFrame(cash_flow_df).to_excel(writer, sheet_name='FLUJO_CAJA', index=False)
        
    output.seek(0)
    
    # JSON Response
    # Serializing events for API
    api_events = []
    for ev in cash_flow_events:
        safe_ev = ev.copy()
        if isinstance(safe_ev["FECHA"], datetime):
            safe_ev["FECHA"] = safe_ev["FECHA"].isoformat()
        api_events.append(safe_ev)

    raw_data = {
        "summary": {
            "total_services": len(services_data),
            "source": "POSTGRES_DB" if use_db else "LEGACY_EXCEL_OR_MOCK"
        },
        "services": services_data,
        "cash_flow": cash_flow_df,
        "detailed_cash_flow": api_events,
        "banks": [{"BANCO": "BANCOLOMBIA", "SALDO_ACTUAL": running_balance}]
    }
    
    return output, raw_data
