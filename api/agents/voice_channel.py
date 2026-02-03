
import os
import requests

# CONFIGURACIÓN ELEVENLABS
# EN PRODUCCIÓN: Esto debe ir en variables de entorno (os.environ.get)
# POR AHORA: Lo dejaremos listo para que inyectes tu Key.
ELEVEN_API_KEY = os.environ.get("ELEVEN_API_KEY", "TU_API_KEY_AQUI")
DEFAULT_VOICE_ID = "ErXwobaYiN019PkySvjV" # Voz: "Antoni" (Autoridad, Noticias)

def text_to_speech_stream(text: str, voice_id: str = DEFAULT_VOICE_ID):
    """
    Convierte texto a audio usando ElevenLabs API (Stream).
    Retorna los chunks de audio para ser reproducidos o guardados.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_API_KEY
    }
    
    # Optimización de latencia y estabilidad
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    
    response = requests.post(url, json=data, headers=headers, stream=True)
    
    if response.status_code != 200:
        print(f"❌ ELEVENLABS ERROR: {response.text}")
        return None
        
    return response.content

def save_audio_file(text: str, filename: str = "output.mp3"):
    """
    Genera el audio y lo guarda en disco (Para caché).
    """
    audio_data = text_to_speech_stream(text)
    
    if audio_data:
        # Asegurar directorio temp
        out_path = os.path.join("data", "audio_cache")
        os.makedirs(out_path, exist_ok=True)
        
        full_path = os.path.join(out_path, filename)
        
        with open(full_path, "wb") as f:
            f.write(audio_data)
        print(f"🎙️ AUDIO GENERADO: {full_path}")
        return full_path
    return None
