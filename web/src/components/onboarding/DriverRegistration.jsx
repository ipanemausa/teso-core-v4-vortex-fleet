import React, { useState } from 'react';

export default function DriverRegistration({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        vehiclePlate: '',
        brand: '',
        model: '',
        year: '',
        licenseNumber: ''
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
            onComplete({ ...formData, role: 'driver', status: 'pending_approval' });
        }, 2000);
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        marginBottom: '15px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(0, 242, 255, 0.3)',
        borderRadius: '4px',
        color: '#fff',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        color: '#00f2ff',
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
                width: '90%', maxWidth: '500px',
                background: 'rgba(10, 20, 30, 0.95)',
                border: '1px solid #00f2ff',
                boxShadow: '0 0 30px rgba(0, 242, 255, 0.2)',
                padding: '30px',
                borderRadius: '8px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
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
                    textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 10px #00f2ff'
                }}>
                    Registro de Conductor
                </h2>
                <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '30px', fontSize: '0.9rem' }}>
                    Únete a la flota Teso. Tu vehículo será verificado antes de activar tu cuenta.
                </p>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <h3 style={{ color: '#39FF14', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                1. Datos Personales
                            </h3>
                            <div>
                                <label style={labelStyle}>Nombre Completo</label>
                                <input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} type="text" placeholder="Ej. Juan Pérez" />
                            </div>
                            <div>
                                <label style={labelStyle}>Teléfono Móvil</label>
                                <input required name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} type="tel" placeholder="Ej. 300 123 4567" />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input required name="email" value={formData.email} onChange={handleChange} style={inputStyle} type="email" placeholder="contacto@ejemplo.com" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!formData.fullName || !formData.phone}
                                style={{
                                    width: '100%', padding: '15px', marginTop: '10px',
                                    background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff',
                                    textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >Siguiente: Vehículo</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 style={{ color: '#39FF14', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                2. Datos del Vehículo
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Placa</label>
                                    <input required name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} style={{ ...inputStyle, textTransform: 'uppercase' }} type="text" placeholder="ABC-123" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Modelo (Año)</label>
                                    <input required name="year" value={formData.year} onChange={handleChange} style={inputStyle} type="number" placeholder="2023" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Marca</label>
                                    <input required name="brand" value={formData.brand} onChange={handleChange} style={inputStyle} type="text" placeholder="Renault" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Línea</label>
                                    <input required name="model" value={formData.model} onChange={handleChange} style={{ ...inputStyle }} type="text" placeholder="Duster" />
                                </div>
                            </div>

                            <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(57, 255, 20, 0.1)', borderLeft: '3px solid #39FF14', fontSize: '0.8rem', color: '#ccc' }}>
                                ℹ️ Al enviar, tus datos pasarán a revisión de seguridad. Recibirás una alerta cuando tu vehículo sea habilitado para recibir despachos automáticos.
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{
                                        flex: 1, padding: '15px', marginTop: '10px',
                                        background: 'transparent', border: '1px solid #555', color: '#aaa',
                                        textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer'
                                    }}
                                >Atrás</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 2, padding: '15px', marginTop: '10px',
                                        background: isSubmitting ? '#333' : '#00f2ff',
                                        border: 'none',
                                        color: isSubmitting ? '#aaa' : '#000',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer',
                                        boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(0, 242, 255, 0.4)'
                                    }}
                                >
                                    {isSubmitting ? 'Procesando...' : 'Enviar Solicitud'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
