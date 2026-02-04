import asyncio
from datetime import datetime
from services.voice_system import VoiceSystem

# Importar los Expertos del Dominio (Sub-Agentes)
# En una arquitectura real, estos serían microservicios o clases separadas
from agents.financial_agent import FinancialAgent
from agents.logistics_agent import LogisticsAgent
# from agents.design_ai import DesignDirectorAgent (Future)
# from agents.hr_control_agent import HRControlAgent (Future)

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
        self.cfo_agent = FinancialAgent() # Control Financiero
        self.coo_agent = LogisticsAgent() # Dirección Operativa
        # self.cdo_agent = DesignDirectorAgent() # Organización y Diseño
        
        self.memory = [] # Memoria Corporativa

    async def execute_strategic_cycle(self, simulation_data):
        """
        Ciclo Administrativo Completo: Planear -> Organizar -> Dirigir -> Controlar
        """
        # 1. PERCEPCIÓN GLOBAL (Big Picture)
        global_state = self._perceive_global_state(simulation_data)
        
        # 2. CONSULTA A EXPERTOS (Delegación)
        # El CEO no micromanagea, pide reportes a sus directores.
        
        # A) Finanzas (Control)
        financial_report = self.cfo_agent._format_output({}, {"verdict": "ANALYZING", "recommendation": "Pending", "score": 0}) 
        if hasattr(self.cfo_agent, 'analyze_metrics'): # Si existiera el método avanzado
             financial_report = self.cfo_agent.analyze_metrics(simulation_data)

        # B) Logística (Dirección)
        ops_report = self.coo_agent.run_dispatch_analysis(simulation_data)
        
        # 3. SÍNTESIS ESTRATÉGICA (La Decisión del CEO)
        final_verdict = self._synthesize_strategy(financial_report, ops_report)
        
        # 4. ORQUESTACIÓN DE ACCIÓN (Ejecución)
        return self._format_executive_summary(final_verdict)

    def _perceive_global_state(self, data):
        return {
            "timestamp": datetime.now(),
            "market_mood": "VOLATILE", # Simulado
            "resource_availability": "HIGH"
        }

    def _synthesize_strategy(self, fin, ops):
        """
        Cruza Finanzas vs Operaciones para tomar decisiones de alto nivel.
        Ej: Si Operaciones dice "Expandir" pero Finanzas dice "Sin Caja", el CEO frena.
        """
        fin_score = fin.get('executive_summary', {}).get('score', 50)
        ops_status = ops.get('dispatch_summary', {}).get('status', 'NORMAL')
        
        decision = "MAINTAIN_COURSE"
        rationale = "Operación estable. Sin conflictos mayores."
        
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
            "ops_input": ops
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
