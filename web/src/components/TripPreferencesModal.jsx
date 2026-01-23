import React, { useState } from 'react';

const TripPreferencesModal = ({ onClose, onConfirm }) => {
    const [conversation, setConversation] = useState('neutral');
    const [temp, setTemp] = useState('neutral');
    const [luggage, setLuggage] = useState(false);
    const [flightNumber, setFlightNumber] = useState('');

    const optionStyle = (selected) => ({
        flex: 1,
        padding: '12px',
        background: selected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: selected ? '1px solid #00F0FF' : '1px solid #333',
        color: selected ? '#00F0FF' : '#888',
        borderRadius: '6px',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '0.85rem',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px'
    });

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(5, 10, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: '90%', maxWidth: '420px',
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                color: '#fff',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>
                        PREFERENCIAS DE VIAJE
                    </h2>
                    <div style={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}>
                        BUSINESS CLASS
                    </div>
                </div>

                {/* 1. Conversation Mode */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Modo de Conversación
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={optionStyle(conversation === 'silent')} onClick={() => setConversation('silent')}>
                            <span style={{ fontSize: '1.2rem' }}>🤫</span>
                            Quiet Mode
                        </button>
                        <button style={optionStyle(conversation === 'neutral')} onClick={() => setConversation('neutral')}>
                            <span style={{ fontSize: '1.2rem' }}>💬</span>
                            Eficiente
                        </button>
                        <button style={optionStyle(conversation === 'chatty')} onClick={() => setConversation('chatty')}>
                            <span style={{ fontSize: '1.2rem' }}>🗣️</span>
                            Sociable
                        </button>
                    </div>
                </div>

                {/* 2. Temperature */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Temperatura Cabina
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={optionStyle(temp === 'cool')} onClick={() => setTemp('cool')}>
                            <span style={{ fontSize: '1.2rem' }}>❄️</span>
                            Fresco
                        </button>
                        <button style={optionStyle(temp === 'neutral')} onClick={() => setTemp('neutral')}>
                            <span style={{ fontSize: '1.2rem' }}>🌡️</span>
                            Neutro
                        </button>
                        <button style={optionStyle(temp === 'warm')} onClick={() => setTemp('warm')}>
                            <span style={{ fontSize: '1.2rem' }}>☀️</span>
                            Cálido
                        </button>
                    </div>
                </div>

                {/* 3. Flight Tracking (The Global Feature) */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Conexión de Vuelo (Flight Tracking)
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>✈️</span>
                        <input
                            type="text"
                            placeholder="Ej: AV9314, AA1123..."
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 45px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '1rem',
                                letterSpacing: '1px'
                            }}
                        />
                        {flightNumber && (
                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#39FF14', fontSize: '0.8rem' }}>
                                ● LIVE
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '15px',
                            background: 'transparent',
                            border: '1px solid #334155',
                            color: '#ccc',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        CANCELAR
                    </button>
                    <button
                        onClick={() => onConfirm({ conversation, temp, flightNumber })}
                        style={{
                            flex: 2, padding: '15px',
                            background: 'linear-gradient(90deg, #00F0FF, #0077FF)',
                            border: 'none',
                            color: '#000',
                            fontWeight: '900',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            letterSpacing: '1px',
                            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
                        }}
                    >
                        CONFIRMAR SOLICITUD
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(50px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default TripPreferencesModal;
