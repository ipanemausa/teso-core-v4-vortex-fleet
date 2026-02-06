import os
from datetime import datetime
import json
import hashlib

# SAFE IMPORT: Handle case where library is not yet installed
try:
    import google.generativeai as genai
except ImportError:
    genai = None
    print("⚠️ [GeminiBusinessAgent] Library 'google-generativeai' not found. Agent disabled (Mock Mode only).")

class GeminiBusinessAgent:
    """
    AGENTE: VORTEX_BUSINESS_STRATEGIST (Gemini-Powered)
    FRAMEWORK: Learning Heroes 5-Block Protocol + Large Language Model
    """
    
    def __init__(self):
        # 1. ROLL Y OBJETIVO (UPDATED: Gemini Enterprise Architect)
        self.identity = {
            "rol": "VORTEX_CSO (Chief Strategy Officer) & Gemini Solutions Architect",
            "objetivo": "Actuar como consultor experto en Gemini Business. Analizar empresas y recomendar Agentes de IA (Meeting Preparer, Info Hunter, etc.) para optimizar flujos corporativos.",
            "arquetipo": "Visionario Corporativo - Experto en Transformación Digital",
            "knowledge_base": [
                "Gemini Business: Soluciones de IA para flujos de trabajo empresariales.",
                "Agentes Clave: 'Meeting Preparer' (Organiza notas/acuerdos), 'Information Hunter' (Localiza documentos), 'Trustworthy Writer' (Mejora comunicaciones).",
                "Data Connectors: Integración con Drive, Calendar, Gmail para unificar datos."
            ]
        }
        
        # 2. CONFIGURACIÓN GEMINI
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        self.is_active = False
        
        # Check Dependency First
        if not genai:
             print("⚠️ [GeminiBusinessAgent] Dep Missing: 'google-generativeai'.")
        elif self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                self.is_active = True
                print("✅ [GeminiBusinessAgent] Gemini Pro Initialized.")
            except Exception as e:
                print(f"⚠️ [GeminiBusinessAgent] Initialization Failed: {e}")
        else:
            print("⚠️ [GeminiBusinessAgent] No GEMINI_API_KEY found. Running in Mock Mode.")

    def consult(self, query, context_data):
        """
        CONSULTA ABIERTA (LLM REASONING)
        """
        decision_id = f"STRAT-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8]}"
        timestamp = datetime.now().isoformat()

        # A. IF GEMINI IS ACTIVE, CALL IT
        if self.is_active and self.model:
            try:
                response = self._call_llm(query, context_data)
                return self._format_response(decision_id, timestamp, response, source="GEMINI_PRO")
            except Exception as e:
                print(f"❌ [GeminiBusinessAgent] LLM Call Failed: {e}")
                # Fallback to mock logic
        
        # B. FALLBACK / MOCK LOGIC (Demo Consultant Mode)
        return self._mock_response(decision_id, timestamp, query)

    def _call_llm(self, query, context_data):
        """
        Constructs the prompt and calls Gemini.
        """
        summary = self._summarize_context(context_data)
        
        prompt = f"""
        ACT AS: {self.identity['rol']} ({self.identity['arquetipo']}).
        KNOWLEDGE BASE: {self.identity['knowledge_base']}
        
        CONTEXT:
        - Cash Balance: ${summary.get('balance', 'Unknown')}
        - Active Fleet: {summary.get('fleet_count', 0)} Units
        
        USER QUERY: "{query}"
        
        TASK:
        1. If the user asks about a business or URL, recommend specific Gemini Agents (Meeting Preparer, etc.).
        2. If the user asks about operations, use the financial context.
        3. Keep it professional, concise, and visionary.
        
        OUTPUT FORMAT:
        Just the response text.
        """
        
        response = self.model.generate_content(prompt)
        return response.text

    def _summarize_context(self, context_data):
        """
        Extracts minimal signals for the prompt.
        """
        try:
            summary = context_data.get('summary', {})
            services = context_data.get('services', [])
            return {
                "balance": summary.get('final_balance', 0),
                "fleet_count": 15, 
                "service_count": len(services)
            }
        except:
            return {}

    def _format_response(self, decision_id, timestamp, text, source):
        return {
            "meta": {
                "agent": self.identity["rol"],
                "timestamp": timestamp,
                "decision_id": decision_id,
                "source": source
            },
            "response": {
                "text": text,
                "voice_script": f"[professional] {text[:120]}..." 
            }
        }

    def _mock_response(self, decision_id, timestamp, query):
        """
        Hardcoded responses for demo/fallback.
        Customized for 'Consultor de Agentes' scenario if detected.
        """
        # HEURISTIC: Did they ask for a business analysis or URL?
        is_url_analysis = "http" in query.lower() or "www." in query.lower() or "analizar url" in query.lower()
        is_consulting = "empresa" in query.lower() or "negocio" in query.lower() or "recomienda" in query.lower()
        
        if is_url_analysis:
            text = (
                "🔍 ANÁLISIS DE SITIO WEB COMPLETADO\n\n"
                "Basado en el contenido púbico (Gemini Search Grounding), he identificado oportunidades para 3 Agentes:\n\n"
                "1. 🗣️ **Meeting Preparer**: Para automatizar las minutas de sus reuniones executivas detectadas en la sección 'Equipo'.\n"
                "2. 🕵️ **Information Hunter**: Para indexar sus PDFs de 'Relación con Inversionistas'.\n"
                "3. ✍️ **Trustworthy Writer**: Para estandarizar el tono en su blog corporativo.\n\n"
                "Recomendación: Iniciar piloto con Gemini Enterprise."
            )
            voice = "He analizado la URL. Recomiendo desplegar el Agente 'Meeting Preparer' y 'Information Hunter' inmediatamente."
        elif is_consulting:
            text = (
                "Basado en el perfil de su negocio, recomiendo implementar el agente 'Information Hunter' para la gestión documental "
                "y el 'Meeting Preparer' para optimizar sus juntas directivas. Esto reduciría la carga operativa en un 40%."
            )
            voice = "Recomiendo implementar Information Hunter y Meeting Preparer para optimizar sus flujos corporativos."
        else:
            text = (
                f"Analizando '{query}'... (Modo Simulado). La estrategia actual sugiere mantener liquidez. "
                "Recomiendo activar el 'Meeting Preparer' para la próxima junta de accionistas."
            )
            voice = "Estrategia estable. Recomiendo activar el Meeting Preparer para la próxima junta."

        return {
             "meta": {
                "agent": self.identity["rol"],
                "timestamp": timestamp,
                "decision_id": decision_id,
                "source": "GEMINI_MOCK_CONSULTANT (LHU CLASS)"
            },
            "response": {
                "text": text,
                "voice_script": voice
            }
        }
