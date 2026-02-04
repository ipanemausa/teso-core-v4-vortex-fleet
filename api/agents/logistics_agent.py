from datetime import datetime
import hashlib
import random
from services.voice_system import VoiceSystem

# --- MIGRACION A AGENTE HIBRIDO (NIVEL 1.5) ---
# Este agente mantiene la estructura legacy para compatibilidad
# pero incorpora la logica de "Thinking" del nuevo framework.

class LogisticsAgent:
    """
    AGENTE: VORTEX_LOGISTICS_DISPATCHER (LogiBot-02 Enhanced)
    FRAMEWORK: ReAct (Reasoning + Acting) Simulation
    """
    
    def __init__(self):
        # 1. PERSONA
        self.identity = {
            "rol": "Jefe de Despacho y Logística de Transporte (AI)",
            "objetivo": "Optimizar flota y detectar cuellos de botella.",
            "mode": "AUTONOMOUS_MONITOR"
        }
        self.voice_system = VoiceSystem() # Conexión a sistema de voz

    def run_dispatch_analysis(self, simulation_data):
        """
        Bucle de Pensamiento Simulado (ReAct Loop)
        """
        # --- PERCEPTION ---
        scene = self._perceive_environment(simulation_data)
        
        # --- THINKING (The Brain) ---
        # Simula el razonamiento que haría un LLM con Chain of Thought
        thoughts, decision = self._reason_about_scene(scene)
        
        # --- ACTION ---
        action_result = self._execute_decision(decision, scene)
        
        # --- OUTPUT ---
        return self._format_final_response(scene, thoughts, action_result)

    def _perceive_environment(self, simulation_data):
        """Gather raw operational data"""
        if not simulation_data or "services" not in simulation_data:
             return None
             
        services = simulation_data.get("services", [])
        total = len(services)
        active = len([s for s in services if s.get("status") in ["IN_PROGRESS", "EN_PROGRESO"]])
        delayed = len([s for s in services if s.get("status") in ["DELAYED", "RETRASADO"]])
        
        # Simulación de clima y tráfico (Variables exógenas)
        weather = "LLUVIA_INTENSA" if random.random() > 0.8 else "SOLEADO"
        traffic = "CONGESTION" if active > 30 else "FLUIDO"
        
        return {
            "services_raw": services,
            "metrics": {
                "total": total,
                "active": active,
                "delayed": delayed,
                "saturation": (active / 45) * 100
            },
            "environment": {
                "weather": weather,
                "traffic": traffic
            }
        }

    def _reason_about_scene(self, scene):
        """
        Simula el 'System 2' thinking.
        Devuelve: (ThinkingChain, FinalDecision)
        """
        if not scene: 
            return [], "NO_DATA"
            
        metrics = scene["metrics"]
        env = scene["environment"]
        thoughts = []
        
        # Thought 1: Check Saturation
        thoughts.append(f"Saturation is {metrics['saturation']:.1f}%. Threshold is 80%.")
        
        # Thought 2: Check Environment Impact
        if env["weather"] == "LLUVIA_INTENSA":
            thoughts.append("Weather is bad. Reducing effective fleet capacity by 20%.")
            adjusted_capacity = 45 * 0.8
            effective_saturation = (metrics['active'] / adjusted_capacity) * 100
            thoughts.append(f"Effective saturation (adjusted for rain) is {effective_saturation:.1f}%.")
            metrics["saturation"] = effective_saturation # Update mental model
        else:
            thoughts.append("Weather is good. Capacity is nominal.")

        # FINAL DECISION LOGIC
        if metrics["saturation"] > 90:
            return thoughts, "CRITICAL_OVERLOAD"
        elif metrics["delayed"] > 2:
            thoughts.append(f"Detected {metrics['delayed']} delayed units. Needs intervention.")
            return thoughts, "RESOLVE_DELAYS"
        else:
            return thoughts, "OPTIMIZE_IDLE"

    def _execute_decision(self, decision, scene):
        """
        Ejecuta la 'Tool' correspondiente a la decisión.
        """
        if decision == "CRITICAL_OVERLOAD":
            return {
                "action": "BROADCAST_ALERT",
                "params": {"msg": "¡Atención Flota! Saturación crítica. Cierre de reservas nuevas.", "priority": "URGENT"}
            }
        elif decision == "RESOLVE_DELAYS":
            # Simulation of re-routing
            return {
                "action": "REROUTE_UNITS",
                "params": {"count": scene["metrics"]["delayed"], "strategy": "FASTEST_ROUTE"}
            }
        elif decision == "OPTIMIZE_IDLE":
             return {
                 "action": "STANDBY_MODE",
                 "params": {"msg": "Operación nominal. Mantener posiciones estratégicas."}
             }
        return {"action": "WAIT", "params": {}}

    def _format_final_response(self, scene, thoughts, action_result):
        if not scene:
             return {"status": "error", "message": "No data"}

        decision_id = f"LOG-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}"
        
        # Generate Dynamic Voice Script based on 'Thinking'
        # Esto le da la personalidad 'inteligente'
        
        # Voice Tags Mapping
        emotion = "neutral"
        if action_result["action"] == "BROADCAST_ALERT": emotion = "urgent"
        if scene["environment"]["weather"] == "LLUVIA_INTENSA": emotion = "serious"
        
        voice_script = f"[{emotion}] Análisis completo. "
        voice_script += f"Condiciones: {scene['environment']['weather']}. "
        voice_script += f"Decisión: {action_result['action']}. "
        
        if emotion == "urgent":
             voice_script += " [loud] Requiere atención inmediata."
        
        return {
            "meta": {
                "agent": self.identity["rol"],
                "timestamp": datetime.now().isoformat(),
                "decision_id": decision_id,
                "ai_thoughts": thoughts # EXPOSE THINKING TO UI
            },
            "dispatch_summary": {
                "status": action_result["action"],
                "saturation": f"{scene['metrics']['saturation']:.1f}%",
                "weather_impact": scene['environment']['weather'] == "LLUVIA_INTENSA"
            },
            "voice_script": voice_script,
            "tactical_order": {
                "instruction": str(action_result["params"]),
                "execute_by": "AI_AUTO_DISPATCHER"
            }
        }
