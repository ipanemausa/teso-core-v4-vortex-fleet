from abc import ABC, abstractmethod
import time
import uuid

# --- AGENTIC FRAMEWORK (LEVEL 2/3) ---

class AgentTool:
    """
    Representa una 'mano' del agente.
    Ejemplo: 'consultar_saldo_bancario', 'enviar_alerta_slack'
    """
    def __init__(self, name, func, description):
        self.name = name
        self.func = func
        self.description = description

    def execute(self, **kwargs):
        print(f"   [TOOL USE] 🛠️ {self.name} executing with {kwargs}...")
        return self.func(**kwargs)

class AgenticEntity(ABC):
    """
    Clase Base para Agentes Autónomos (ReAct Architecture).
    Reemplaza la lógica 'If/Else' manual con un bucle de Pensamiento.
    """
    def __init__(self, role, goal, tools=[]):
        self.id = str(uuid.uuid4())[:8]
        self.role = role
        self.goal = goal
        self.tools = {t.name: t for t in tools}
        self.memory = [] # Context Window

    def perceive(self, environment_data):
        """Paso 1: Ver el Entorno"""
        self.memory.append({"role": "system", "content": f"OBSERVATION: {environment_data}"})
        return environment_data

    def think(self):
        """
        Paso 2: Cerebro (Simulación de LLM / GPT-4)
        En producción, aquí llamarías a openai.chat.completions.create()
        """
        # AQUI OCURRE LA MAGIA AGÉNTICA
        # El modelo decide: ¿Tengo suficiente info? -> Respondo
        # ¿Me falta info? -> Uso una Herramienta
        pass 

    def act(self, tool_name, params):
        """Paso 3: Usar Herramientas"""
        if tool_name in self.tools:
            result = self.tools[tool_name].execute(**params)
            self.memory.append({"role": "function", "name": tool_name, "content": str(result)})
            return result
        else:
            return "Error: Tool not found"

class MockGPTBrain:
    """
    Simulador de decisiones para desarrollo local sin gastar API Tokens.
    Permite diseñar la arquitectura agéntica antes de conectar GPT-4.
    """
    @staticmethod
    def decide_next_step(agent, context):
        # Lógica heurística que simula ser una IA
        if "insolvencia" in str(context).lower() and "auditoria" not in agent.memory:
             return "USE_TOOL", "full_audit_scan", {}
        return "FINISH", None, "Reporte generado."
