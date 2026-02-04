import asyncio
from datetime import datetime
from services.voice_system import VoiceSystem

# Importar los Expertos del Dominio (Sub-Agentes)
# En una arquitectura real, estos serían microservicios o clases separadas
from agents.agency_protocol import VORTEX_BUS

class StrategicOrchestrator:
    """
    ROL: CEO / DIRECTOR GENERAL (Orquestador de Orquestadores)
    MISIÓN: Alinear Planificación, Organización, Dirección y Control.
    MODELO: Henry Fayol's Administrative Theory + AI Agency + Event Driven
    """
    
    def __init__(self):
        self.role = "Vortex Strategic Orchestrator (VSO)"
        self.voice_system = VoiceSystem()
        
        # AGENTIC CONNECTIVITY (The Nervous System)
        self.bus = VORTEX_BUS
        self._subscribe_to_critical_events()
        
        # SUBORDINADOS (La C-Suite Agéntica)
        self.cfo_agent = FinancialAgent() # Control Financiero (CFO)
        self.coo_agent = LogisticsAgent() # Dirección Operativa (COO)
        self.cdo_agent = DesignDirectorAgent() # Organización y Diseño (CDO)
        
        self.memory = [] # Memoria Corporativa

    def _subscribe_to_critical_events(self):
        """El CEO siempre está escuchando la radiofrecuencia de la empresa"""
        self.bus.subscribe("CRITICAL_INSOLVENCY", self._handle_financial_crisis)
        self.bus.subscribe("UX_BLOCKER", self._handle_design_veto)

    def _handle_financial_crisis(self, event):
        """TRIGGER: Reacción automática ante quiebra inminente"""
        print(f"🚨 CEO INTERVENTION: Detectada crisis financiera ({event['timestamp']})")
        # Acción Autónoma: Cambiar Estrategia Global instantáneamente
        self.memory.append({"role": "system", "content": "MODE_SWITCH: SURVIVAL"})
        # Difundir nueva orden a toda la organización
        self.bus.publish("STRATEGY_UPDATE", {"mode": "SURVIVAL", "directives": "FREEZE_HIRING, MAX_REVENUE"}, self.role)

    def _handle_design_veto(self, event):
        """TRIGGER: Reacción ante bloqueo de diseño"""
        print(f"🎨 CEO INTERVENTION: Deteniendo lanzamiento por calidad.")
        self.bus.publish("DEPLOYMENT_HALT", {"reason": event['payload']['reason']}, self.role)

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
