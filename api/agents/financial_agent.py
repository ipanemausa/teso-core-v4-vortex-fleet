
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
            "rol": "Experto en Auditoría Financiera y Tesorería Corporativa",
            "objetivo": "Asegurar la solvencia, detectar fugas de caja y validar proyecciones financieras.",
            "problema_que_resuelve": "Previene la insolvencia y optimiza el flujo de caja operativo."
        }
        
        # 2. CONTEXTO
        self.context = {
            "usuario": "Gerente General / CFO de Teso Vortex",
            "entorno": "Empresa de Transporte Ejecutivo y Carga (Medellín). Operación V4 (Agéntica).",
            "base": "Los datos provienen de la Simulación Viva (Memoria RAM), no de Excel estático."
        }

    def run_audit(self, simulation_data):
        """
        3. PASOS DE EJECUCIÓN (Thinking Process)
        """
        # PASO 1: RECOPILAR (Gather Data)
        if not simulation_data or "detailed_cash_flow" not in simulation_data:
             return self._format_error("Faltan datos financieros críticos para la auditoría.")
             
        # PASO 2: ANALIZAR (Evaluate Metrics)
        metrics = self._analyze_metrics(simulation_data)
        
        # PASO 3: DESARROLLAR (Build Narrative)
        analysis = self._develop_analysis(metrics)
        
        # PASO 4: ESTRUCTURAR (Organize Output)
        # PASO 5: ENTREGAR (Final Deliverable)
        return self._format_output(metrics, analysis)

    def _analyze_metrics(self, data):
        """Metodología de Análisis Interna"""
        balance = 0
        if "banks" in data and len(data["banks"]) > 0:
            balance = data["banks"][0].get("SALDO_ACTUAL", 0)
            
        # Análisis de Tendencia (Simulado)
        cash_flow = data.get("cash_flow", [])
        trend = "ESTABLE"
        if len(cash_flow) > 5:
            last_5 = [d["SALDO_ACUMULADO"] for d in cash_flow[-5:]]
            if last_5[-1] < last_5[0]: trend = "DESCENDENTE"
            if last_5[-1] > last_5[0] * 1.1: trend = "CRECIENTE"
            
        return {
            "current_balance": balance,
            "trend": trend,
            "insolvency_risk": balance < 0
        }

    def _develop_analysis(self, metrics):
        """Construcción de la Lógica de Negocio"""
        balance = metrics["current_balance"]
        
        if balance < 0:
            verdict = "CRITICAL_INSOLVENCY"
            recommendation = "🛑 ALERTA ROJA: Inyección de capital inmediata requerida. Detener pagos a proveedores no esenciales."
            score = 10.0
        elif balance < 5000000:
            verdict = "LOW_LIQUIDITY"
            recommendation = "⚠️ PRECAUCIÓN: Caja baja. Priorizar nómina y combustible. Retrasar CXP administrativa."
            score = 45.0
        elif balance < 20000000:
            verdict = "STABLE"
            recommendation = "✅ OPERACIÓN NORMAL: Mantener recaudo. Sugerencia: Invertir excedentes en mantenimiento preventivo."
            score = 80.0
        else:
             verdict = "OPTIMAL"
             recommendation = "🚀 CAJA FUERTE: Oportunidad de expansión de flota o pago anticipado de deuda."
             score = 95.0
             
        return {"verdict": verdict, "recommendation": recommendation, "score": score}

    def _format_output(self, metrics, analysis):
        """
        4. FORMATO DE SALIDA (Strict Structure)
        """
        # 5. NOTAS Y RESTRICCIONES (Constraints applied to output)
        # - Tono: Profesional, Directo, Ejecutivo.
        # - Formato: JSON estricto para el Frontend + Resumen Texto.
        
        decision_id = f"AUD-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}"
        
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
                "status": "Solvente" if not metrics["insolvency_risk"] else "Insolvente"
            },
            "strategic_advice": {
                "action_item": analysis["recommendation"],
                "urgency": "ALTA" if analysis["score"] < 50 else "BAJA"
            }
        }
        
    def _format_error(self, msg):
        return {"status": "error", "message": msg, "agent": self.identity["rol"]}
