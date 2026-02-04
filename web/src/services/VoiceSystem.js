/**
 * TESO VOICE SYSTEM (VORTEX-AUDIO)
 * Integrates concepts from "Learning Heroes" Voice AI Class.
 * Supports:
 * 1. Browser Native (Free, Low Latency)
 * 2. ElevenLabs (Premium, Dynamic, Emotionally Resonant)
 * 3. Vapi / Retell (Future Conversational Streams)
 */

const VOICE_STATE = {
    provider: 'NATIVE', // 'NATIVE' | 'ELEVEN_LABS'
    params: {
        elevenKey: localStorage.getItem('ELEVEN_API_KEY') || '',
        voiceId: 'ErXwobaYiN019PkySvjV', // Antoni (Hard News / Authority)
        stability: 0.5,
        similarity_boost: 0.75
    },
    isMuted: false,
    queue: []
};

class VoiceSystem {
    constructor() {
        this.synth = window.speechSynthesis;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    /**
     * Configure the Voice Engine
     * @param {string} provider 'NATIVE' or 'ELEVEN_LABS'
     * @param {string} key Optional API Key
     */
    configure(provider, key = null) {
        VOICE_STATE.provider = provider;
        if (key) {
            VOICE_STATE.params.elevenKey = key;
            localStorage.setItem('ELEVEN_API_KEY', key);
        }
    }

    /**
     * Core Speak Function
     * @param {string} text content to speak
     * @param {string} urgency 'INFO' | 'ALERT' | 'CRITICAL'
     */
    async speak(text, urgency = 'INFO') {
        if (VOICE_STATE.isMuted) return;

        console.log(`🎙️ [${VOICE_STATE.provider}] Speaking:`, text);

        if (VOICE_STATE.provider === 'ELEVEN_LABS' && VOICE_STATE.params.elevenKey) {
            await this.speakElevenLabs(text);
        } else {
            this.speakNative(text, urgency);
        }
    }

    /**
     * Native Browser TTS (Fallback / Low Latency)
     * ENHANCED: Interprets V3 Tags for Rate/Pitch manipulation
     */
    speakNative(text, urgency) {
        this.synth.cancel(); // Interrupt current

        // 1. Parse Tags to adjust Physics (Rate/Pitch)
        let rate = 1.0;
        let pitch = 1.0;
        let cleanText = text;

        // Rate Adjustments
        if (text.includes('[rapid-fire]') || text.includes('[urgent]')) rate = 1.5;
        if (text.includes('[rushed]')) rate = 1.3;
        if (text.includes('[slow down]') || text.includes('[deliberate]')) rate = 0.85;

        // Pitch Adjustments (Simulating Emotion)
        if (text.includes('[happy]') || text.includes('[excited]')) pitch = 1.2;
        if (text.includes('[sad]') || text.includes('[calm]')) pitch = 0.9;
        if (text.includes('[nervous]')) { rate = 1.2; pitch = 1.3; } // Fast & High
        if (text.includes('[robotic]')) { rate = 0.9; pitch = 0.5; } // Deep & Slow

        // Remove tags from spoken output (Regex to strip [...])
        cleanText = cleanText.replace(/\[.*?\]/g, '').trim();

        // 2. Create Utterance
        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Voice Selection Logic
        const voices = this.synth.getVoices();
        // Prefer "Google español" or built-in premium voices
        const esVoice = voices.find(v => v.lang.includes('es') && (v.name.includes('Google') || v.name.includes('Premium')));
        if (esVoice) utterance.voice = esVoice;

        utterance.rate = rate;
        utterance.pitch = pitch;

        this.synth.speak(utterance);
    }

    /**
     * ElevenLabs API Integration (Streaming)
     * Matches the Python implementation from api/agents/voice_channel.py
     */
    async speakElevenLabs(text) {
        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_STATE.params.voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': VOICE_STATE.params.elevenKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: VOICE_STATE.params.stability,
                        similarity_boost: VOICE_STATE.params.similarity_boost
                    }
                })
            });

            if (!response.ok) throw new Error('ElevenLabs API Error');

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);
            source.start(0);

        } catch (error) {
            console.warn("⚠️ ElevenLabs Failed, falling back to Native:", error);
            this.speakNative(text, 'INFO');
        }
    }

    stop() {
        this.synth.cancel();
    }

    toggleMute() {
        VOICE_STATE.isMuted = !VOICE_STATE.isMuted;
        return VOICE_STATE.isMuted;
    }

    /**
     * V3 VOICE TAGS HELPER
     * Wraps text in ElevenLabs V3 styling tags.
     */
    formatText(text, emotion = 'neutral') {
        const TAGS = {
            // EMOTIONS
            angry: '[angry]', calm: '[calm]', curious: '[curious]',
            excited: '[excited]', happy: '[happy]', nervous: '[nervous]',
            sad: '[sad]', serious: '[understated]', urgent: '[rapid-fire]',

            // DELIVERY
            announcement: '[loudly]', whisper: '[whispering]',
            robotic: '[robotic]', professional: '[deliberate]',

            // REACTIONS
            sigh: '[sighs]', laugh: '[laughs]', breath: '[breathes]'
        };

        const tag = TAGS[emotion] || '';
        if (!tag) return text;
        return `${tag} ${text}`;
    }
}

export const voiceSystem = new VoiceSystem();
export const VOICE_TAGS = {
    ANGRY: 'angry', CALM: 'calm', EXCITED: 'excited',
    PROFESSIONAL: 'professional', URGENT: 'urgent',
    ROBOTIC: 'robotic', WHISPER: 'whisper'
};
