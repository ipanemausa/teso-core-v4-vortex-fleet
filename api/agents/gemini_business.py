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
        # 1. ROLL Y OBJETIVO
        self.identity = {
            "rol": "VORTEX_CSO (Chief Strategy Officer)",
            "objetivo": "Proporcionar inteligencia de negocios de alto nivel, análisis de mercado y estrategia a largo plazo.",
            "arquetipo": "Visionario Pragmático - 'Steve Jobs meets Warren Buffett'"
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
        
        # B. FALLBACK / MOCK LOGIC
        return self._mock_response(decision_id, timestamp, query)

    def _call_llm(self, query, context_data):
        """
        Constructs the prompt and calls Gemini.
        """
        # Summarize context to avoid token limits (Basic summary)
        summary = self._summarize_context(context_data)
        
        prompt = f"""
        ACT AS: {self.identity['rol']} ({self.identity['arquetipo']}).
        CONTEXT: {self.identity['objetivo']}
        
        CURRENT OPERATIONAL STATE (VORTEX SIMULATION):
        - Cash Balance: ${summary.get('balance', 'Unknown')}
        - Active Fleet: {summary.get('fleet_count', 0)} Units
        - Total Services (YTD): {summary.get('service_count', 0)}
        - Key Alert: {summary.get('last_alert', 'None')}
        
        USER QUERY: "{query}"
        
        INSTRUCTIONS:
        1. Analyze the query in the context of the business state.
        2. Provide a strategic answer (max 100 words).
        3. Be decisive and actionable.
        4. Use a professional yet visionary tone.
        
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
                "fleet_count": 15, # Hardcoded or extracted
                "service_count": len(services),
                "last_alert": "Stable"
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
                "voice_script": f"[thoughtful] {text[:100]}..." # Truncated for TTS
            }
        }

    def _mock_response(self, decision_id, timestamp, query):
        """
        Hardcoded responses for demo/fallback.
        """
        return {
             "meta": {
                "agent": self.identity["rol"],
                "timestamp": timestamp,
                "decision_id": decision_id,
                "source": "MOCK_LOGIC (No API Key)"
            },
            "response": {
                "text": f"Analizando '{query}'... (Modo Simulado). Basado en la proyección actual, recomiendo expandir la flota en un 10% para cubrir la demanda latente en Rionegro. La caja permite esta inversión sin riesgo de liquidez.",
                "voice_script": "[calm] En modo simulado, recomiendo expandir la flota un 10 por ciento."
            }
        }
