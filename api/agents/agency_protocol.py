from datetime import datetime
import uuid

class EventBus:
    """
    SISTEMA NERVIOSO CENTRAL (The Agency Backbone)
    Permite que los agentes se comuniquen asíncronamente (Pub/Sub)
    y reaccionen a eventos (Triggers).
    """
    def __init__(self):
        self.subscribers = {} # { event_type: [callback_agent_method] }
        self.history = []     # Black Box Log (Audit Trail)
        self.guardrails = []  # Reglas de Seguridad Globales

    def subscribe(self, event_type, agent_method):
        """Un agente se suscribe para 'escuchar' un tipo de evento"""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(agent_method)
        print(f"🔌 PROTOCOL: Agente suscrito a '{event_type}'")

    def publish(self, event_type, payload, source_agent="SYSTEM"):
        """Un agente 'grita' un evento al universo"""
        event = {
            "id": str(uuid.uuid4())[:8],
            "timestamp": datetime.now().isoformat(),
            "type": event_type,
            "source": source_agent,
            "payload": payload
        }
        
        # 1. GUARDRAIL CHECK (Security Layer)
        if not self._pass_guardrails(event):
            print(f"🛡️ GUARDRAIL INTERVENTION: Event {event_type} blocked.")
            return

        # 2. LOGGING (Transparency)
        self.history.append(event)
        print(f"📢 BROADCAST [{source_agent}]: {event_type}")

        # 3. TRIGGER REACTION (Orchestration)
        if event_type in self.subscribers:
            for callback in self.subscribers[event_type]:
                # In a real async system, this would be await callback(event)
                try:
                    callback(event) 
                except Exception as e:
                    print(f"❌ TRIGGER ERROR subscribers: {e}")

    def _pass_guardrails(self, event):
        """
        Global Logic Gates to prevent autonomous disaster.
        Ej: Si un agente intenta gastar > $100M, bloquear.
        Ej: Si un agente intenta borrar la base de datos, bloquear.
        """
        if event['type'] == 'AUTHORIZE_TRANSFER':
            amount = event['payload'].get('amount', 0)
            if amount > 50000000: # Límite duro de 50M
                print("🚨 ALERTA: Intento de transferencia no autorizado (Excede límite).")
                return False
                
        if event['type'] == 'DELETE_DATASET':
             print("🚨 ALERTA: Intento de borrado de memoria bloqueado.")
             return False
             
        return True

    def get_logs(self):
        return self.history

# SINGLETON INSTANCE
# Usamos una única instancia compartida para toda la app
VORTEX_BUS = EventBus()
