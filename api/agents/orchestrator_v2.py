import asyncio
from datetime import datetime
from services.voice_system import VoiceSystem

# Importar los Expertos del Dominio (Sub-Agentes)
# En una arquitectura real, estos serían microservicios o clases separadas
from agents.financial_agent import FinancialAgent
from agents.logistics_agent import LogisticsAgent
from agents.design_agent import DesignDirectorAgent

class StrategicOrchestrator:
    """
    ROL: CEO / DIRECTOR GENERAL (Orquestador de Orquestadores)
    MISIÓN: Alinear Planificación, Organización, Dirección y Control.
    MODELO: Henry Fayol's Administrative Theory + AI Agency
    """
    
    def __init__(self):
        self.role = "Vortex Strategic Orchestrator (VSO)"
        self.voice_system = VoiceSystem()
        
        # SUBORDINADOS (La C-Suite Agéntica)
        self.cfo_agent = FinancialAgent() # Control Financiero (CFO)
        self.coo_agent = LogisticsAgent() # Dirección Operativa (COO)
        self.cdo_agent = DesignDirectorAgent() # Organización y Diseño (CDO)
        
        self.memory = [] # Memoria Corporativa

    async def execute_strategic_cycle(self, simulation_data):
        """
        Ciclo Administrativo Completo: Planear -> Organizar -> Dirigir -> Controlar
        """
        # 1. PERCEPCIÓN GLOBAL (Big Picture)
        global_state = self._perceive_global_state(simulation_data)
        
        # 2. CONSULTA A EXPERTOS (Delegación)
        
        # A) Finanzas (Control)
        financial_report = self.cfo_agent.run_audit(simulation_data)

        # B) Logística (Dirección)
        ops_report = self.coo_agent.run_dispatch_analysis(simulation_data)
        
        # C) Diseño (Organización/UX)
        design_report = self.cdo_agent.run_ux_audit({"interactive_nodes": 50, "event_handlers": 50}) # Mock Simulation State
        
        # 3. SÍNTESIS ESTRATÉGICA (La Decisión del CEO)
        final_verdict = self._synthesize_strategy(financial_report, ops_report, design_report)
        
        # 4. ORQUESTACIÓN DE ACCIÓN (Ejecución)
        return self._format_executive_summary(final_verdict)

    def _synthesize_strategy(self, fin, ops, design):
        """
        Cruza Finanzas vs Operaciones vs Diseño
        """
        fin_score = fin.get('executive_summary', {}).get('score', 50)
        ops_status = ops.get('dispatch_summary', {}).get('status', 'NORMAL')
        ux_score = design.get('design_audit', {}).get('score', 100)
        
        decision = "MAINTAIN_COURSE"
        rationale = "Operación estable. Sin conflictos mayores."
        
        # UX VETO POWER (Si el diseño falla, detenemos lanzamientos)
        if ux_score < 80:
             return {
                 "ceo_decision": "HALT_DEPLOYMENT",
                 "rationale": f"Bloqueo de Calidad. El CDO reporta problemas de UX ({ux_score}/100). Prioridad: Arreglar Interfaz.",
                 "financial_input": fin,
                 "ops_input": ops,
                 "design_input": design
             }

        # CONFLICT RESOLUTION LOGIC
        if ops_status == "CRITICAL_OVERLOAD" and fin_score > 80:
            decision = "AGGRESSIVE_EXPANSION"
            rationale = "Operaciones saturadas y tenemos caja fuerte. ¡Invertir en flota ya!"
        elif ops_status == "CRITICAL_OVERLOAD" and fin_score < 40:
            decision = "EMERGENCY_TRIAGE"
            rationale = "Saturación crítica pero sin dinero. Activar protocolo de supervivencia (Subir tarifas)."
            
        return {
            "ceo_decision": decision,
            "rationale": rationale,
            "financial_input": fin,
            "ops_input": ops,
            "design_input": design
        }

    def _format_executive_summary(self, strategy):
        return {
            "meta": {
                "agent": self.role,
                "timestamp": datetime.now().isoformat()
            },
            "strategic_alignment": {
                "directive": strategy["ceo_decision"],
                "reasoning": strategy["rationale"]
            },
            "voice_broadcast": {
                "text": f"[calm] Atención equipo. Decisión Estratégica: {strategy['ceo_decision']}. {strategy['rationale']}",
                "priority": "HIGH"
            },
            "department_reports": {
                "finance": strategy["financial_input"],
                "operations": strategy["ops_input"]
            }
        }
