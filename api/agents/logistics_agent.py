
from datetime import datetime
import hashlib
import random

class LogisticsAgent:
    """
    AGENTE: VORTEX_LOGISTICS_DISPATCHER (LogiBot-01)
    FRAMEWORK: Learning Heroes 5-Block Protocol
    """
    
    def __init__(self):
        # 1. ROL Y OBJETIVO
        self.identity = {
            "rol": "Jefe de Despacho y Logística de Transporte",
            "objetivo": "Optimizar la asignación de flota, minimizar tiempos muertos y garantizar cumplimiento de rutas.",
            "problema_que_resuelve": "Evita cuellos de botella operativos y retrasos en servicios críticos (Aeropuerto)."
        }
        
        # 2. CONTEXTO
        self.context = {
            "usuario": "Coordinador de Operaciones Teso",
            "entorno": "Medellín y Rionegro (JMC). Flota de Vans y Automóviles.",
            "base": "Datos en tiempo real de ubicación y estado de servicios."
        }

    def run_dispatch_analysis(self, simulation_data):
        """
        3. PASOS DE EJECUCIÓN (Thinking Process)
        """
        # PASO 1: RECOPILAR (Gather Data)
        if not simulation_data or "services" not in simulation_data:
             return self._format_error("No hay datos de servicios activos para analizar.")
             
        services = simulation_data.get("services", [])
        
        # PASO 2: ANALIZAR (Evaluate Metrics)
        metrics = self._analyze_fleet_status(services)
        
        # PASO 3: DESARROLLAR (Build Narrative)
        analysis = self._develop_plan(metrics)
        
        # PASO 4: ESTRUCTURAR (Organize Output) & 5. ENTREGAR
        return self._format_output(metrics, analysis)

    def _analyze_fleet_status(self, services):
        """Metodología de Análisis de Flota"""
        total = len(services)
        active = len([s for s in services if s.get("ESTADO") == "EN_PROGRESO" or s.get("status") == "IN_PROGRESS"])
        delayed = len([s for s in services if s.get("ESTADO") == "RETRASADO" or s.get("status") == "DELAYED"])
        available = 45 - active # Asumiendo flota total de 45 (hardcoded por ahora)
        
        # Simulación de saturación
        saturation = (active / 45) * 100
        
        return {
            "total_ops": total,
            "active_units": active,
            "delayed_units": delayed,
            "available_units": available if available > 0 else 0,
            "saturation_percentage": round(saturation, 1)
        }

    def _develop_plan(self, metrics):
        """Construcción de la Estrategia Logística"""
        sat = metrics["saturation_percentage"]
        delayed = metrics["delayed_units"]
        
        if sat > 90:
            verdict = "CRITICAL_OVERLOAD"
            recommendation = "🛑 ALERTA DE CAPACIDAD: Activar flota tercerizada inmediatamente. Detener reservas nuevas."
            priority = "URGENTE"
        elif delayed > 3:
            verdict = "DELAY_WARNING"
            recommendation = "⚠️ RETRASOS DETECTADOS: Reasignar servicios de baja prioridad para cubrir rutas críticas."
            priority = "ALTA"
        elif sat > 70:
             verdict = "HIGH_DEMAND"
             recommendation = "⚡ DEMANDA ALTA: Pre-posicionar unidades en zona Aeropuerto y El Poblado."
             priority = "MEDIA"
        else:
             verdict = "OPTIMAL_FLOW"
             recommendation = "✅ OPERACIÓN FLUIDA: Sugerencia: Programar mantenimientos preventivos para unidades libres."
             priority = "BAJA"
             
        return {"verdict": verdict, "recommendation": recommendation, "priority": priority}

    def _format_output(self, metrics, analysis):
        """
        4. FORMATO DE SALIDA
        """
        decision_id = f"LOG-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}"
        
        return {
            "meta": {
                "agent": self.identity["rol"],
                "timestamp": datetime.now().isoformat(),
                "decision_id": decision_id
            },
            "dispatch_summary": {
                "status": analysis["verdict"],
                "saturation": f"{metrics['saturation_percentage']}%",
                "active_fleet": f"{metrics['active_units']}/45"
            },
            "voice_script": f"Reporte de Flota. Estado: {analysis['verdict']}. Saturación al {int(metrics['saturation_percentage'])} por ciento. {metrics['delayed_services']} unidades reportan retraso. {analysis['recommendation']}",
            "alerts": {
                "delayed_services": metrics["delayed_units"],
                "level": analysis["priority"]
            },
            "tactical_order": {
                "instruction": analysis["recommendation"],
                "execute_by": "Inmediato" if analysis["priority"] == "URGENTE" else "Próxima Hora"
            }
        }
        
    def _format_error(self, msg):
        return {"status": "error", "message": msg, "agent": self.identity["rol"]}
