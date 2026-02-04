from services.voice_system import VoiceSystem
import random

class DesignDirectorAgent:
    """
    AGENTE: VORTEX_DESIGN_DIRECTOR (Role: CDO - Chief Design Officer)
    ESPECIALIDAD: UX/UI Audit & Frontend Integrity
    """
    def __init__(self):
        self.identity = {
            "rol": "Director de Diseño y Experiencia de Usuario",
            "objetivo": "Garantizar fricción cero, interactividad total y estética premium.",
            "standard": "Pixel Perfect / Material Design 3.0 / Apple HIG"
        }
        self.voice_system = VoiceSystem()

    def run_ux_audit(self, frontend_state):
        """
        Simula una auditoría de código estático y estado visual.
        En producción real, esto se conectaría a herramientas como Cypress o Lighthouse.
        """
        # 1. PERCEIVE (Analyze visual components)
        issues = self._scan_visual_integrity(frontend_state)
        
        # 2. THINK (Evaluate Severity)
        verdict, score = self._evaluate_ux_score(issues)
        
        # 3. ACT (Formulate Recommendation)
        recommendation = self._formulate_design_fix(issues)
        
        return {
            "meta": {
                "agent": self.identity["rol"],
                "decision_id": f"UX-{random.randint(1000,9999)}"
            },
            "design_audit": {
                "score": score,
                "status": verdict,
                "critical_issues": issues,
                "recommendation": recommendation
            }
        }

    def _scan_visual_integrity(self, state):
        """
        Simulates scanning the DOM for broken interactions.
        """
        issues = []
        
        # Simulation Logic: Randomly detect "human errors" based on complexity
        # In this demo, we check if we fixed the buttons (simulated state check)
        
        # Simulated check for 'Ghost Buttons' (Buttons with no handlers)
        interactive_elements = state.get("interactive_nodes", 0)
        handlers = state.get("event_handlers", 0)
        
        if interactive_elements > handlers:
            issues.append("Possibility of Dead Clicks (Zombie Buttons detected).")
            
        # Check Contrast/Theme consistency
        if state.get("theme") == "DARK_MODE" and random.random() > 0.9:
             issues.append("Low contrast detected in secondary texts.")
             
        return issues

    def _evaluate_ux_score(self, issues):
        if not issues:
            return "IMPECCABLE", 100
        
        if len(issues) > 2:
            return "NEEDS_POLISH", 75
        else:
            return "OPTIMIZED", 92

    def _formulate_design_fix(self, issues):
        if not issues:
            return "UX Validada. Interacciones fluidas. Mantener estándar."
        
        return f"Detectados errores de interacción: {issues[0]} Se recomienda revisión de EventListeners."
