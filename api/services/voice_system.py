
class VoiceSystem:
    """
    Simulated Voice System for Backend Agents.
    In production, this would connect to ElevenLabs or similar via 'voice_channel.py'.
    For now, it logs intents to be consumed by the Frontend Voice System.
    """
    def __init__(self):
        pass

    def speak(self, text, urgency="INFO"):
        """
        Logs a speech directive.
        """
        print(f"🗣️ [VOICE SYSTEM] ({urgency}): {text}")

    def broadcast(self, message, priority="INFO"):
        self.speak(message, priority)
