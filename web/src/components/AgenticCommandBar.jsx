import React, { useState, useEffect } from 'react';

const AgenticCommandBar = ({ onCommand }) => {
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [suggestions, setSuggestions] = useState([
        { label: 'Optimize Routes', cmd: 'optimize_routes' },
        { label: 'Financial Audit', cmd: 'audit_finance' },
        { label: 'Security Scan', cmd: 'scan_security' }
    ]);

    const handleSend = (overrideInput) => {
        const cmd = overrideInput || input;
        if (!cmd) return;
        setIsThinking(true);
        // Simulate processing
        setTimeout(() => {
            onCommand(cmd);
            setIsThinking(false);
            if (!overrideInput) setInput('');
        }, 800);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setInput('🎤 Escuchando...');

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setTimeout(() => {
                handleSend(transcript);
            }, 500);
        };

        recognition.onerror = (event) => {
            console.error("Speech error:", event.error);
            setInput('');
        };

        recognition.start();
    };

    const handleSuggestion = (cmd, label) => {
        setInput(label);
        setIsThinking(true);
        setTimeout(() => {
            onCommand(cmd);
            setIsThinking(false);
            setInput('');
        }, 800);
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px', // Decreased bottom padding
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            maxWidth: '90%',
            zIndex: 100000, // Significantly increased Z-index
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'auto' // Ensure clickable
        }}>
            {/* Input Bar */}
            <div style={{
                position: 'relative',
                background: 'rgba(10, 20, 30, 0.9)',
                border: '1px solid #00f2ff',
                borderRadius: '50px',
                padding: '5px 5px 5px 20px',
                boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                backdropFilter: 'blur(10px)'
            }}>
                <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>🤖</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                        if (e.key === 'Tab' && suggestions.length > 0) {
                            e.preventDefault();
                            // Simple logic: Autocomplete with the first suggestion's label if input matches start?
                            // Or better: If user wants "Autocompletion", we usually need a specific 'suggestion' state.
                            // For now, based on "tomarla con una sola letra", let's assume they want to pick the first suggestion relative to what they typed.
                            // Simplified: Just set input to the first matching suggestion.
                            const match = suggestions.find(s => s.label.toLowerCase().startsWith(input.toLowerCase()));
                            if (match) setInput(match.label);
                        }
                    }}
                    placeholder={isThinking ? "Agent processing..." : "Ask Teso Operations AI..."}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1rem',
                        flex: 1,
                        outline: 'none',
                        fontFamily: "'Outfit', sans-serif"
                    }}
                />

                {/* VOICE MICROPHONE ICON */}
                <button
                    onClick={startListening}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        marginRight: '10px',
                        color: '#00F0FF',
                        transition: 'transform 0.2s'

                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Activar Voz"
                >
                    🎙️
                </button>
                <button
                    onClick={() => handleSend()}
                    style={{
                        background: '#00f2ff',
                        color: '#000',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        transition: 'transform 0.2s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    ➤
                </button>
            </div>

            {/* Suggestions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleSuggestion(s.cmd, s.label)}
                        style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(0, 242, 255, 0.3)',
                            color: '#00f2ff',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 242, 255, 0.2)';
                            e.currentTarget.style.border = '1px solid #00f2ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                            e.currentTarget.style.border = '1px solid rgba(0, 242, 255, 0.3)';
                        }}
                    >
                        ✨ {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AgenticCommandBar;
