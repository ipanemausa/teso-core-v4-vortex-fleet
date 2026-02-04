
from datetime import datetime
import hashlib

class FinancialAgent:
    """
    AGENTE: VORTEX_FINANCIAL_AUDITOR (FinBot-01)
    FRAMEWORK: Learning Heroes 5-Block Protocol
    """
    
    def __init__(self):
        # 1. ROL Y OBJETIVO
        self.identity = {
            "rol": "VORTEX_CFO (Financial Controller)",
            "objetivo": "Asegurar la solvencia, detectar fugas de caja y validar proyecciones financieras.",
            "arquetipo": "Auditor Implacable - 'The Wolf of Wall Street' (Legal)"
        }
        
        # 2. CONTEXTO
        self.context = {
            "usuario": "Strategic Orchestrator (CEO)",
            "entorno": "Empresa de Transporte Ejecutivo y Carga.",
            "base": "Simulación Viva (Memoria RAM)"
        }

    def run_audit(self, simulation_data):
        """
        AUDITORÍA FINANCIERA (CFO LOGIC)
        Implementing 'AGENCY_PROMPTS_MANIFESTO.md' Strict Constraints.
        """
        metrics = self._extract_key_metrics(simulation_data)
        
        # --- HARD CONSTRAINTS (Las reglas de 'Qué NO hacer') ---
        # Regla 1: Supervivencia Mínima (Runway < 30 días)
        if metrics['runway_days'] < 30:
            analysis = {
                "verdict": "CRITICAL_INSOLVENCY",
                "score": 20, 
                "recommendation": "HALT_SPENDING", 
                "rationale": "VIOLACIÓN DE REGLA F1: Runway inferior a 30 días. Riesgo inminente de quiebra. Se exige corte total de gastos.",
                "voice_tags": "[urgent] [angry]"
            }
            return self._format_output(metrics, analysis)

        # Regla 2: Salud de Cartera (CxC > 60 días)
        if metrics['cxc_days'] > 60:
             analysis = {
                "verdict": "WARNING_LIQUIDITY",
                "score": 45, 
                "recommendation": "AGGRESSIVE_COLLECTION", 
                "rationale": "VIOLACIÓN DE REGLA F2: Ciclo de cobro > 60 días. La operación financia a clientes. Inaceptable.",
                 "voice_tags": "[stern] [serious]"
            }
             return self._format_output(metrics, analysis)
            
        # Si pasa los filtros duros, análisis estándar
        analysis = self._develop_analysis(metrics)
        return self._format_output(metrics, analysis)

    def _extract_key_metrics(self, data):
        # Helper to parse the raw V4 engine output safely
        try:
             # Try to get real simulation data if available
             summary = data.get('summary', {})
             
             # Fallback logic if data is thin
             cash = summary.get('final_balance', 10000000)
             burn_rate = 5000000 # Estimated daily burn default
             
             # Calculate Runway
             runway = cash / burn_rate if burn_rate > 0 else 999
             
             # Get user scenarios inputs if present, else defaults
             cxc = int(data.get('simulationMetadata', {}).get('config', {}).get('cxc_days', 45))
             
             return {
                 "runway_days": runway,
                 "cxc_days": cxc,
                 "current_balance": cash,
                 "trend": "STABLE" # Default
             }
        except Exception:
            # Failsafe for empty states
            return {"runway_days": 0, "cxc_days": 90, "current_balance": 0, "trend": "UNKNOWN"}

    def _develop_analysis(self, metrics):
        """Construcción de la Lógica de Negocio Standard"""
        balance = metrics["current_balance"]
        
        if balance < 20000000:
            verdict = "STABLE"
            recommendation = "✅ OPERACIÓN NORMAL: Mantener recaudo. Sugerencia: Invertir excedentes en mantenimiento."
            score = 80.0
            voice_tags = "[calm] [deliberate]"
        else:
             verdict = "OPTIMAL"
             recommendation = "🚀 CAJA FUERTE: Oportunidad de expansión de flota o pago anticipado de deuda."
             score = 95.0
             voice_tags = "[happy] [excited]"
             
        return {
            "verdict": verdict, 
            "recommendation": recommendation, 
            "score": score, 
            "voice_tags": voice_tags,
            "rationale": "Indicadores saludables. Sin alertas de bloqueo."
        }

    def _format_output(self, metrics, analysis):
        """
        4. FORMATO DE SALIDA (Strict Structure)
        """
        decision_id = f"AUD-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}"
        
        # Construir script dinámico basado en las razones
        script = f"{analysis['voice_tags']} Atención Gerencia. {analysis['rationale']} Mi score es {int(analysis['score'])}."
        
        return {
            "meta": {
                "agent": self.identity["rol"],
                "timestamp": datetime.now().isoformat(),
                "decision_id": decision_id
            },
            "executive_summary": {
                "headline": f"Estado Financiero: {analysis['verdict']}",
                "score": analysis["score"],
                "trend": metrics["trend"]
            },
            "financial_context": {
                "current_cash_cop": metrics["current_balance"],
                "runway_days": int(metrics["runway_days"]),
                "cxc_days": metrics["cxc_days"]
            },
            "voice_script": script,
            "strategic_advice": {
                "action_item": analysis["recommendation"],
                "urgency": "ALTA" if analysis["score"] < 50 else "BAJA"
            }
        }

    def _format_error(self, msg):
        return {"status": "error", "message": msg, "agent": self.identity["rol"]}
