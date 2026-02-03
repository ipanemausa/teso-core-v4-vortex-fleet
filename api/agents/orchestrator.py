
from datetime import datetime
from .financial_agent import FinancialAgent
from .logistics_agent import LogisticsAgent

class OrchestratorAgent:
    """
    AGENTE: VORTEX_ORCHESTRATOR (The Boss)
    ROL: Análisis de Intención y Delegación de Tareas.
    CAPACIDAD: Decide qué agente experto debe resolver un problema.
    """
    
    def __init__(self):
        self.financial_bot = FinancialAgent()
        self.logistics_bot = LogisticsAgent()
        self.identity = {
            "rol": "Director de Operaciones (COO AI)",
            "objetivo": "Coordinar la respuesta de múltiples agentes especializados."
        }

    def route_request(self, intent, simulation_data):
        """
        DIRECTOR DE ORQUESTA:
        Recibe una intención (query o evento) y despacha al agente correcto.
        """
        plan = []
        results = {}
        
        # 1. ANÁLISIS DE INTENCIÓN (Rule-Based por ahora, LLM luego)
        # En el futuro, esto usará un clasificador semántico.
        
        needs_finance = any(k in intent.lower() for k in ['dinero', 'plata', 'caja', 'saldo', 'financiero', 'audit', 'bank'])
        needs_logistics = any(k in intent.lower() for k in ['flota', 'van', 'carro', 'tráfico', 'retraso', 'aeropuerto', 'logistica'])
        
        # 2. EJECUCIÓN PARALELA (Orquestación)
        if needs_finance or intent == "GLOBAL_AUDIT":
            print(f"👔 ORCHESTRATOR: Delegando tarea a {self.financial_bot.identity['rol']}...")
            results['finance'] = self.financial_bot.run_audit(simulation_data)
            plan.append("Analizado flujo de caja")
            
        if needs_logistics or intent == "GLOBAL_AUDIT":
            print(f"🚚 ORCHESTRATOR: Delegando tarea a {self.logistics_bot.identity['rol']}...")
            results['logistics'] = self.logistics_bot.run_dispatch_analysis(simulation_data)
            plan.append("Verificado estado de flota")

        # 3. SÍNTESIS DE RESULTADOS (The "One Answer")
        final_verdict = "OPERACIÓN MIXTA"
        voice_summary = "Atención. "
        
        if 'finance' in results:
            voice_summary += results['finance']['voice_script'] + " "
        
        if 'logistics' in results:
            voice_summary += results['logistics']['voice_script']
            
        return {
            "orchestrator_id": "ORC-001",
            "timestamp": datetime.now().isoformat(),
            "plan_executed": plan,
            "results": results,
            "synthesis": {
                "voice_script": voice_summary
            }
        }

    def check_triggers(self, simulation_data):
        """
        SISTEMA DE TRIGGERS AUTÓNOMOS (Perplexity Style):
        Revisa el estado silenciosamente y dispara alertas si es necesario.
        No espera a que el usuario pregunte.
        """
        triggers_fired = []
        
        # Trigger 1: Cash Panic
        balance = 0
        if "banks" in simulation_data and len(simulation_data["banks"]) > 0:
            balance = simulation_data["banks"][0].get("SALDO_ACTUAL", 0)
            
        if balance < 2000000: # Umbral de pánico
            print("🚨 TRIGGER ACTIVADO: Bajos Fondos -> Llamando a Finanzas")
            audit = self.financial_bot.run_audit(simulation_data)
            triggers_fired.append({"type": "FINANCIAL_ALERT", "data": audit})

        # Trigger 2: Logistic Collapse
        # ... logic ...
        
        return triggers_fired
