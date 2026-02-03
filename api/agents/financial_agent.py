
from datetime import datetime
import hashlib

class FinancialAgent:
    """
    Agente Financiero Autónomo (The Accountant).
    Responsable de auditar la salud financiera, detectar insolvencia
    y proyectar flujos de caja.
    """
    
    def __init__(self, name="FinBot-01"):
        self.name = name
        self.role = "VORTEX_FINANCIAL_AUDITOR"

    def audit_system(self, simulation_data):
        """
        Realiza una auditoría en tiempo real basada en los datos vivos de la simulación.
        Retorna un veredicto y un score de salud.
        """
        json_data = simulation_data
        balance = 0
        
        # 1. Extract Balance
        if json_data and "banks" in json_data and len(json_data["banks"]) > 0:
            balance = json_data["banks"][0].get("SALDO_ACTUAL", 0)
            
        # 2. Analyze Health
        health_score = 100.0
        verdict = "HEALTHY"
        recommendation = "Maintain current operations."
        
        if balance < 0:
            health_score = 10.0
            verdict = "CRITICAL_INSOLVENCY"
            recommendation = "IMMEDIATE CAPITAL INJECTION REQUIRED. STOP NON-ESSENTIAL PAYMENTS."
        elif balance < 5000000:
            health_score = 45.0
            verdict = "LOW_LIQUIDITY"
            recommendation = "Monitor cash flow closely. Delay high-value CXP if possible."
        elif balance < 20000000:
             health_score = 80.0
             verdict = "STABLE"
             recommendation = "Operations normal. Reserve accumulation recommended."
            
        # 3. Create Decision Record
        decision_id = f"AUD-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}"
        
        return {
            "agent": self.name,
            "role": self.role,
            "decision_id": decision_id,
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "health_score": health_score,
                "current_balance": balance,
                "verdict": verdict
            },
            "analysis": {
                "status": verdict,
                "risk_level": "HIGH" if health_score < 50 else "LOW",
                "message": f"Audit complete. System is {verdict}.",
                "recommendation": recommendation
            }
        }
