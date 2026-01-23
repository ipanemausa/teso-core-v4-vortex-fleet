from datetime import datetime
import pandas as pd

def evaluate_scenario(services_data, cash_flow_events, expenses_data, initial_cash=0):
    """
    Runs Deep Agent Verification Protocol on provided simulation data.
    Returns a dictionary with scores, flags, and analysis.
    """
    
    analysis = {
        "score": 100,
        "status": "SECURE",
        "flags": [],
        "metrics": {
            "min_cash_position": 0,
            "insolvency_risk": "NONE",
            "unit_economics_validity": "UNKNOWN"
        }
    }
    
    # 1. VERIFY UNIT ECONOMICS (The Core Truth)
    ue_errors = 0
    total_checks = 0
    
    for svc in services_data:
        # Robust parsing
        try:
            fare_raw = str(svc.get('fare', '0')).replace('$', '').replace(',', '')
            fare = float(fare_raw)
        except:
            continue
            
        fin = svc.get('financials', {})
        revenue = fin.get('netRevenue', 0)
        driver = fin.get('driverPayment', 0)
        toll = fin.get('toll', 0)
        
        # Check 1: 20% Commission (+/- 1.0 rounding)
        expected_rev = fare * 0.20
        if abs(revenue - expected_rev) > 2.0:
            ue_errors += 1
            
        # Check 2: Driver Payment Integrity
        expected_pay = fare - revenue - toll
        if abs(driver - expected_pay) > 2.0:
            ue_errors += 1
            
        total_checks += 1
        
    if total_checks > 0:
        validity = ((total_checks - ue_errors) / total_checks) * 100
        analysis["metrics"]["unit_economics_validity"] = f"{validity:.1f}%"
        if validity < 99.0:
            analysis["score"] -= 20
            analysis["flags"].append(f"Unit Economics Mismatch ({100-validity:.1f}% error rate)")
    
    # 2. CASH FLOW SOLVENCY (The Survival Check)
    # Reconstruct running balance from Detailed Events
    running_balance = initial_cash
    min_cash = initial_cash
    insolvency_date = None
    
    # Ensure sorted by date
    # Convert dates to objects for sorting
    events_sorted = sorted(cash_flow_events, key=lambda x: x['FECHA'])
    
    for event in events_sorted:
        amount = event['MONTO']
        running_balance += amount
        
        if running_balance < min_cash:
            min_cash = running_balance
            
        if running_balance < 0 and insolvency_date is None:
            insolvency_date = event['FECHA']

    analysis["metrics"]["min_cash_position"] = min_cash
    
    if min_cash < 0:
        analysis["status"] = "CRITICAL"
        analysis["score"] = 0
        analysis["metrics"]["insolvency_risk"] = "HIGH"
        analysis["flags"].append(f"INSOLVENCY DETECTED on {insolvency_date}. Min Cash: ${min_cash:,.0f}")
    elif min_cash < 50000000: # Low buffer warning (e.g. 50M COP)
        analysis["status"] = "WARNING"
        analysis["score"] -= 30
        analysis["metrics"]["insolvency_risk"] = "MODERATE"
        analysis["flags"].append("Low Liquidity Buffer (< 50M COP)")
        
    return analysis
