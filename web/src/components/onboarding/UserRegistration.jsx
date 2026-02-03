import React, { useState } from 'react';

export default function UserRegistration({ onComplete, onCancel }) {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        paymentMethod: 'credit_card', // or 'corporate_code'
        cardNumber: '',
        corpCode: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API verification delay
        setTimeout(() => {
            setIsSubmitting(false);
            onComplete({ ...formData, role: 'client', status: 'active' });
        }, 1500);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        marginBottom: '15px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 215, 0, 0.3)', // Gold for clients
        borderRadius: '4px',
        color: '#fff',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        color: '#ffd700', // Gold
        fontSize: '0.9rem',
        letterSpacing: '1px'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: '90%', maxWidth: '450px',
                background: 'rgba(10, 20, 30, 0.95)',
                border: '1px solid #ffd700',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
                padding: '30px',
                borderRadius: '8px',
                position: 'relative'
            }}>
                <button
                    onClick={onCancel}
                    style={{
                        position: 'absolute', top: '15px', right: '15px',
                        background: 'transparent', border: 'none', color: '#555', fontSize: '1.5rem', cursor: 'pointer'
                    }}
                >×</button>

                <h2 style={{
                    color: '#fff', textAlign: 'center', marginBottom: '10px',
                    textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 10px #ffd700'
                }}>
                    Registro de Usuario
                </h2>
                <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '30px', fontSize: '0.9rem' }}>
                    Agenda viajes VIP y corporativos en segundos.
                </p>

                <form onSubmit={handleSubmit}>

                    <div>
                        <label style={labelStyle}>Nombre Completo</label>
                        <input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} type="text" placeholder="Tu Nombre" />
                    </div>
                    <div>
                        <label style={labelStyle}>Teléfono Móvil</label>
                        <input required name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} type="tel" placeholder="300 123 4567" />
                    </div>
                    <div>
                        <label style={labelStyle}>Método de Pago Principal</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} style={inputStyle}>
                            <option value="credit_card">Tarjeta de Crédito / Débito</option>
                            <option value="corporate_code">Código Corporativo</option>
                        </select>
                    </div>

                    {formData.paymentMethod === 'credit_card' ? (
                        <div>
                            <label style={labelStyle}>Número de Tarjeta (Seguro)</label>
                            <input required name="cardNumber" value={formData.cardNumber} onChange={handleChange} style={inputStyle} type="text" placeholder="**** **** **** 1234" maxLength="19" />
                        </div>
                    ) : (
                        <div>
                            <label style={labelStyle}>Código de Empresa</label>
                            <input required name="corpCode" value={formData.corpCode} onChange={handleChange} style={inputStyle} type="text" placeholder="Ej. TESO-CORP-001" />
                        </div>
                    )}

                    <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(255, 215, 0, 0.1)', borderLeft: '3px solid #ffd700', fontSize: '0.8rem', color: '#ccc' }}>
                        ℹ️ Teso garantiza conductores verificados y monitoreo 24/7 en todos tus viajes.
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%', padding: '15px', marginTop: '10px',
                            background: isSubmitting ? '#333' : '#ffd700',
                            border: 'none',
                            color: isSubmitting ? '#aaa' : '#000',
                            fontWeight: 'bold',
                            textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer',
                            boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(255, 215, 0, 0.4)'
                        }}
                    >
                        {isSubmitting ? 'Creando Cuenta...' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
}
