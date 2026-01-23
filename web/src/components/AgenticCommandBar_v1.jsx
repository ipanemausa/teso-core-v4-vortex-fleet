import React, { useState, useEffect } from 'react';

const AgenticCommandBar = ({ onCommand }) => {
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [suggestions, setSuggestions] = useState([
        { label: 'Optimize Routes', cmd: 'optimize_routes' },
        { label: 'Financial Audit', cmd: 'audit_finance' },
        { label: 'Security Scan', cmd: 'scan_security' }
    ]);

    const handleSend = () => {
        if (!input) return;
        setIsThinking(true);
        // Simulate processing
        setTimeout(() => {
            onCommand(input);
            setIsThinking(false);
            setInput('');
        }, 800);
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
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            maxWidth: '90%',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
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
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
                <button
                    onClick={handleSend}
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
        </div>
    );
};

export default AgenticCommandBar;
