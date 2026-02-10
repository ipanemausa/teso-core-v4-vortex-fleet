from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from simulation_engine import generate_financial_simulation
import io
import os
import json
import hashlib
from datetime import datetime
from pydantic import BaseModel

app = FastAPI(
    title="Teso Cloud Platform API (V3 Vortex)",
    version="3.0.0",
    description="Backend Core for Teso Logistics & Financial Engine. Handles Server-Side Compute with MEANINGFUL PERSISTENCE."
)

# --- DYNAMIC IMPORT FIX ---
try:
    from teso_core.simulation.core_v4 import simulate_core_v4
    print("✅ LOADED: teso_core.simulation.core_v4")
except ImportError as e:
    print(f"⚠️ WARNING: Could not import 'teso_core.simulation.core_v4': {e}")
    print("ℹ️ RUNNING IN FALLBACK MODE: Simulation endpoints may trigger errors.")
    # Define a dummy function to prevent NameError later
    def simulate_core_v4(**kwargs):
        return {"status": "error", "message": "Simulation Core not loaded."}

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MEMORY PERSISTENCE (THE "LIVE" STATE) ---
# Stores the result of the last simulation so all users see the same "Truth"
GLOBAL_CACHE = {
    "excel_bytes": None,
    "json_data": None,
    "last_updated": None
}

# PERSISTENCE LAYER
PERSISTENCE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "persistence")
DATA_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(PERSISTENCE_DIR, exist_ok=True)
os.makedirs(DATA_ROOT, exist_ok=True)

SIM_JSON_PATH = os.path.join(PERSISTENCE_DIR, "latest_simulation.json")
# STRICT MASTER PROTOCOL: Excel persistence is the VIVO dataset
SIM_EXCEL_PATH = os.path.join(DATA_ROOT, "TESO_MASTER_DATASET_VIVO.xlsx")

def save_simulation_state(json_data, excel_bytes):
    try:
        # Save JSON
        with open(SIM_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, default=str) # Handle datetime serialization
            
        # Save Excel
        with open(SIM_EXCEL_PATH, 'wb') as f:
            f.write(excel_bytes)
            
        print(f"✅ STATE PERSISTED to {PERSISTENCE_DIR}")
        return True
    except Exception as e:
        print(f"❌ PERSISTENCE FAILURE: {e}")
        return False

def load_simulation_state():
    """Attempts to load the last saved simulation state from disk."""
    if os.path.exists(SIM_JSON_PATH) and os.path.exists(SIM_EXCEL_PATH):
        try:
            print(f"📂 LOADING STATE from {PERSISTENCE_DIR}...")
            with open(SIM_JSON_PATH, 'r', encoding='utf-8') as f:
                json_data = json.load(f)
            
            with open(SIM_EXCEL_PATH, 'rb') as f:
                excel_bytes = f.read()
                
            return json_data, excel_bytes
        except Exception as e:
            print(f"⚠️ LOAD FAILURE: {e}")
    return None, None

    return {
        "status": "operational", 
        "compute_node": "PYTHON_FASTAPI_V3_VORTEX",
        "has_cached_sim": GLOBAL_CACHE["last_updated"] is not None
    }

@app.post("/api/simulation/generate")
def run_simulation(days: int = 360, stress: bool = False):
    """
    FORCES a new simulation run (Wipe & Reset).
    Updates the Global Cache.
    """
    print(f"--- RUNNING NEW SIMULATION ({days} DAYS, STRESS={stress}) ---")
    try:
        excel_file, raw_data = generate_financial_simulation(days=days, stress_mode=stress)
        
        # Update Persistence (Memory)
        GLOBAL_CACHE["excel_bytes"] = excel_file.getvalue()
        GLOBAL_CACHE["json_data"] = raw_data
        GLOBAL_CACHE["last_updated"] = datetime.now().isoformat()
        
        # Update Persistence (Disk)
        save_simulation_state(raw_data, excel_file.getvalue())
        
        return {"status": "success", "message": f"Simulation regenerated for {days} days.", "summary": raw_data["summary"]}
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ SIMULATION CRASH: {error_details}")
        # Return a 200 OK with error payload so frontend can display it instead of 500
        return {
            "status": "error", 
            "message": "Simulation Engine Failed", 
            "details": str(e),
            "trace": error_details 
        }

@app.post("/api/simulate/core-v4")
def simulate_core_v4_endpoint(payload: dict):
    return simulate_core_v4(
        cars=payload.get("cars", 35),
        avg_trips_per_day=payload.get("avg_trips_per_day", 80),
        days=payload.get("days", 365),
    )

@app.get("/api/simulation/verify")
def verify_simulation_scenario(days: int = 60, traffic_growth: float = 1.0, cxc_days: int = 30, cxp_freq: int = 7):
    # 1. Run Simulation in-memory
    output, raw_data = generate_financial_simulation(
        days=days, 
        traffic_growth=traffic_growth, 
        cxc_days=cxc_days, 
        cxp_freq=cxp_freq
    )
    
    # 2. Run Deep Verification
    import verifier
    
    analysis = verifier.evaluate_scenario(
        raw_data['services'], 
        raw_data['detailed_cash_flow'], 
        raw_data['expenses'],
        initial_cash=800000000 # 800M Rule
    )
    
    return analysis

@app.get("/api/simulation/data")
def get_simulation_data():
    """
    Returns the JSON data of the CURRENT active simulation.
    If no simulation exists, it auto-generates one (Default 360 days).
    """
    if GLOBAL_CACHE["json_data"] is None:
        print("No cache found. Auto-generating default simulation...")
        run_simulation(days=360)
        
    return GLOBAL_CACHE["json_data"]

@app.on_event("startup")
def load_cache_on_startup():
    """Try to load disk persistence into memory on startup"""
    j_data, x_bytes = load_simulation_state()
    if j_data and x_bytes:
        GLOBAL_CACHE["json_data"] = j_data
        GLOBAL_CACHE["excel_bytes"] = x_bytes
        GLOBAL_CACHE["last_updated"] = "RESTORED_FROM_DISK"
        print("✅ SYSTEM RESTORED: Previous simulation loaded.")
    else:
        print("ℹ️ SYSTEM CLEAN: No previous simulation found. 🔥 IGNITING VORTEX ENGINE...")
        run_simulation(days=360) # Force initial generation
        print("🚀 VORTEX ENGINE: Initial Simulation Complete.")

@app.get("/api/simulation/export")
def download_excel():
    """
    Downloads the Excel file of the CURRENT active simulation.
    Ensures consistency between what is seen on screen (JSON) and what is downloaded.
    """
    if GLOBAL_CACHE["excel_bytes"] is None:
        run_simulation(days=360)
        
    headers = {
        'Content-Disposition': 'attachment; filename="TESO_MASTER_DATASET_VIVO.xlsx"'
    }
    
    return Response(content=GLOBAL_CACHE["excel_bytes"], media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)

@app.get("/api/simulate-export")
def simulate_export(days: int = 90, cxc: int = 30, cxp: int = 15, growth: float = 1.0):
    """
    On-Demand Simulation for Export (Does NOT update global cache, just returns file).
    Used by War Room to export scenarios.
    """
    print(f"--- GENERATING CUSTOM EXPORT (Days={days}, CxC={cxc}, CxP={cxp}, Growth={growth}) ---")
    excel_file, _ = generate_financial_simulation(days=days, traffic_growth=growth, cxc_days=cxc, cxp_freq=cxp)
    
    headers = {
        'Content-Disposition': f'attachment; filename="TESO_SCENARIO_D{days}_G{growth}.xlsx"'
    }
    return Response(content=excel_file.getvalue(), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)

    return Response(content=excel_file.getvalue(), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)

@app.on_event("startup")
async def startup_event():
    """
    ZERO-STRESS PROTOCOL:
    On Startup, we run a self-audit and log it.
    This ensures the 'Flight Recorder' file is always created and active.
    """
    print("--- 🛡️ TESO SYSTEM SELF-AUDIT: INITIATING ---")
    # Log the startup
    try:
        timestamp = datetime.now().isoformat()
        entry = {
            "timestamp": timestamp,
            "user": "SYSTEM",
            "action": "SYSTEM_STARTUP",
            "details": {"status": "ONLINE", "mode": "CALM_ZERO_STRESS"}
        }
        # Hash & Write (Manual call since we can't call endpoint easily from within)
        entry_str = json.dumps(entry, sort_keys=True)
        entry_hash = hashlib.sha256(entry_str.encode()).hexdigest()
        final_record = {"meta": entry, "hash": entry_hash}
        
        with open(AUDIT_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(final_record) + "\n")
        print(f"--- ✅ AUDIT LOG ACTIVE: {entry_hash[:8]} ---")
    except Exception as e:
        print(f"--- ⚠️ AUDIT INIT FAILED: {e} ---")

# --- FLIGHT RECORDER (AUDIT LOGS) ---
AUDIT_LOG_FILE = os.getenv("AUDIT_LOG_FILE", "data/audit_log.jsonl")

# Ensure data directory exists (Runtime check)
os.makedirs(os.path.dirname(AUDIT_LOG_FILE), exist_ok=True)

class AuditRequest(BaseModel):
    user: str
    action: str
    details: dict

@app.post("/api/audit")
def log_audit_event(request: AuditRequest):
    """
    FLIGHT RECORDER: Immutable log of critical system actions.
    Appends a hashed entry to audit_log.jsonl
    """
    timestamp = datetime.now().isoformat()
    
    # Create the entry payload
    entry = {
        "timestamp": timestamp,
        "user": request.user,
        "action": request.action,
        "details": request.details
    }
    
    # Generate Cryptographic Hash (Proof of Integrity)
    # We hash the string representation of the entry to ensure content hasn't changed
    entry_str = json.dumps(entry, sort_keys=True)
    entry_hash = hashlib.sha256(entry_str.encode()).hexdigest()
    
    final_record = {
        "meta": entry,
        "hash": entry_hash
    }
    
    # Append to File (Immutable Append-Only)
    try:
        with open(AUDIT_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(final_record) + "\n")
        return {"status": "logged", "hash": entry_hash}
    except Exception as e:
        print(f"AUDIT FAILURE: {e}")
        # In a real flight recorder, we might panic here. 
        # For now, we return error but don't crash the plane.
        raise HTTPException(status_code=500, detail="Audit Log Failed")



# --- ANALYTICS 3.0: DECISION ENGINE ENDPOINTS ---

class DecisionResponse(BaseModel):
    decision_id: str
    score: float
    verdict: str
    details: dict
    timestamp: str

@app.post("/api/decisions/optimize-routes", response_model=DecisionResponse)
def optimize_routes_decision():
    """
    Simulates a Route Optimization Model (ORION-style).
    Uses deterministic logic based on day-of-week to simulate traffic patterns.
    """
    # Deterministic Logic based on ISO Weekday (1-7)
    iso_day = datetime.now().isoweekday()
    
    # Traffic factor: High on Friday (5), Low on Sunday (7)
    traffic_factors = {1: 1.1, 2: 1.2, 3: 1.2, 4: 1.3, 5: 1.5, 6: 1.4, 7: 0.8}
    current_factor = traffic_factors.get(iso_day, 1.0)
    
    # Base efficiency gain inversely proportional to traffic (more traffic = more potential savings via rerouting)
    base_gain = 0.15 * current_factor 
    
    saved_km = int(base_gain * 3500) # Assumes 3500km daily fleet travel
    
    return {
        "decision_id": f"OPT-{datetime.now().strftime('%Y%m%d')}-{iso_day}",
        "score": round(base_gain * 100, 1),
        "verdict": "OPTIMIZATION_RECOMMENDED" if base_gain > 0.15 else "TRAFFIC_NORMAL",
        "details": {
            "saved_km": saved_km,
            "fuel_savings_cop": saved_km * 4200,
            "impact": "HIGH" if base_gain > 0.2 else "MODERATE"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/decisions/financial-audit", response_model=DecisionResponse)
def financial_audit_decision():
    """
    Real-time Financial Health Check.
    Analyzes current simulation cache for insolvency risks.
    """
    json_data = GLOBAL_CACHE["json_data"]
    balance = 0
    if json_data and "banks" in json_data and len(json_data["banks"]) > 0:
        balance = json_data["banks"][0].get("SALDO_ACTUAL", 0)
        
    health_score = 100.0
    verdict = "HEALTHY"
    
    if balance < 0:
        health_score = 10.0
        verdict = "CRITICAL_INSOLVENCY"
    elif balance < 5000000:
        health_score = 45.0
        verdict = "LOW_LIQUIDITY"
        
    return {
        "decision_id": f"AUD-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}",
        "score": health_score,
        "verdict": verdict,
        "details": {
            "current_balance": balance,
            "action_required": "IMMEDIATE_FUNDING" if balance < 0 else "NONE"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/decisions/security-scan", response_model=DecisionResponse)
def security_scan_decision():
    """
    Fraud & Anomaly Detection Model.
    Analyzes 'conflicts' in the Global Cache (Soporte/Cancellations).
    """
    json_data = GLOBAL_CACHE.get("json_data", {})
    conflicts = json_data.get("conflicts", [])
    
    # Real logic: Count conflicts that are 'security' related (or just total for now)
    security_events = [c for c in conflicts if "SOPORTE" in str(c.get("TIPO", "")).upper()]
    anomaly_count = len(security_events)
    
    if anomaly_count == 0:
        threat_level = "LOW"
        score = 98.5
    elif anomaly_count < 3:
        threat_level = "MEDIUM"
        score = 85.0
    else:
        threat_level = "HIGH"
        score = 65.0
    
    return {
        "decision_id": f"SEC-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}",
        "score": score,
        "verdict": f"THREAT_LEVEL_{threat_level}",
        "details": {
            "active_nodes": 65, # Fixed fleet size for now
            "anomalies_detected": anomaly_count,
            "recent_events": [c.get("TIPO") for c in security_events[:3]]
        },
        "timestamp": datetime.now().isoformat()
    }


# --- FRONTEND STATIC SERVING (UNIFIED DEPLOYMENT) ---
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse

# Mount the 'static' folder (where React build will live)
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

@app.get("/")
async def serve_root():
    """
    Explicit Root Handler to prevent 404s on the home page.
    """
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse(content="<h1>TESO SYSTEM STARTING... (Building Assets)</h1>", status_code=200)

@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_frontend(path: str):
    """
    Catch-all route to serve the React Single Page Application (SPA).
    If the file exists in static, serve it. Otherwise, serve index.html.
    """
    # 1. API routes are already handled above.
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API Endpoint Not Found")
        
    # 2. Check if a specific static file exists (e.g. favicon.ico, manifest.json)
    file_path = os.path.join(STATIC_DIR, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # 3. Default: Serve index.html (React Router handles the rest)
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
            
    return "<h1>TESO SYSTEM STARTING... (Please Refresh)</h1>"
