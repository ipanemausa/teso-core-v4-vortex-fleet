import React, { useState } from 'react';

export default function DriverRegistration({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        cedula: '',
        vehiclePlate: '',
        brand: '',
        model: '',
        year: '',
        licenseNumber: '',
        docs: {
            licencia: null,
            tarjetaPropiedad: null,
            soat: null,
            tecno: null
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate upload
            setUploadProgress(prev => ({ ...prev, [docType]: 0 }));
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                setUploadProgress(prev => ({ ...prev, [docType]: progress }));
                if (progress >= 100) {
                    clearInterval(interval);
                    setFormData(prev => ({
                        ...prev,
                        docs: { ...prev.docs, [docType]: file.name }
                    }));
                }
            }, 200);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API verification delay (Accreditation Study)
        setTimeout(() => {
            setIsSubmitting(false);
            // Driver enters as PENDING_APPROVAL
            onComplete({ ...formData, role: 'driver', status: 'pending_approval' });
            alert("Solicitud Enviada Exitosamente.\n\nTu perfil está bajo estudio de seguridad y acreditación.\nTe notificaremos vía SMS cuando tu vehículo sea habilitado.");
        }, 2500);
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

    const fileInputStyle = {
        ...inputStyle,
        padding: '8px',
        fontSize: '0.8rem'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: '90%', maxWidth: '600px',
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

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{
                        color: '#fff', margin: '0 0 5px 0',
                        textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 10px #00f2ff'
                    }}>
                        Alta de Conductor (Partners)
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', fontSize: '0.8rem', color: '#666' }}>
                        <span style={{ color: step >= 1 ? '#00f2ff' : '#444' }}>1. PERFIL</span>
                        <span>&gt;</span>
                        <span style={{ color: step >= 2 ? '#00f2ff' : '#444' }}>2. VEHÍCULO</span>
                        <span>&gt;</span>
                        <span style={{ color: step >= 3 ? '#00f2ff' : '#444' }}>3. DOCUMENTACIÓN</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* STEP 1: PERSONAL DATA */}
                    {step === 1 && (
                        <>
                            <h3 style={{ color: '#39FF14', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                1. Datos Personales
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Nombre Completo</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} type="text" placeholder="Como en la Cédula" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Cédula (C.C.)</label>
                                    <input required name="cedula" value={formData.cedula} onChange={handleChange} style={inputStyle} type="text" placeholder="Documento ID" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Teléfono Móvil</label>
                                    <input required name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} type="tel" placeholder="300 123 4567" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input required name="email" value={formData.email} onChange={handleChange} style={inputStyle} type="email" placeholder="contacto@ejemplo.com" />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!formData.fullName || !formData.phone || !formData.cedula}
                                style={{
                                    width: '100%', padding: '15px', marginTop: '10px',
                                    background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff',
                                    textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >Siguiente: Vehículo &gt;</button>
                        </>
                    )}

                    {/* STEP 2: VEHICLE DATA */}
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
                                    <input required name="year" value={formData.year} onChange={handleChange} style={inputStyle} type="number" placeholder="2024" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Marca</label>
                                    <input required name="brand" value={formData.brand} onChange={handleChange} style={inputStyle} type="text" placeholder="Renault" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Línea / Referencia</label>
                                    <input required name="model" value={formData.model} onChange={handleChange} style={{ ...inputStyle }} type="text" placeholder="Duster Zen" />
                                </div>
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
                                >&lt; Atrás</button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!formData.vehiclePlate || !formData.brand}
                                    style={{
                                        flex: 2, padding: '15px', marginTop: '10px',
                                        background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff',
                                        textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer'
                                    }}
                                >Documentación &gt;</button>
                            </div>
                        </>
                    )}

                    {/* STEP 3: DOCUMENTATION (COMPLIANCE) */}
                    {step === 3 && (
                        <>
                            <h3 style={{ color: '#39FF14', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                3. Acreditación Legal (Obligatorio)
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {/* LICENCIA */}
                                <div>
                                    <label style={labelStyle}>Licencia de Conducción</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'licencia')} style={fileInputStyle} accept="image/*,.pdf" />
                                        {uploadProgress['licencia'] > 0 && uploadProgress['licencia'] < 100 && (
                                            <div style={{ height: '2px', background: '#00f2ff', width: `${uploadProgress['licencia']}%`, transition: 'width 0.2s' }}></div>
                                        )}
                                        {formData.docs.licencia && <div style={{ color: '#00f2ff', fontSize: '0.7rem' }}>✅ {formData.docs.licencia}</div>}
                                    </div>
                                </div>

                                {/* TARJETA PROPIEDAD */}
                                <div>
                                    <label style={labelStyle}>Tarjeta de Propiedad</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'tarjetaPropiedad')} style={fileInputStyle} accept="image/*,.pdf" />
                                        {formData.docs.tarjetaPropiedad && <div style={{ color: '#00f2ff', fontSize: '0.7rem' }}>✅ Cargado</div>}
                                    </div>
                                </div>

                                {/* SOAT */}
                                <div>
                                    <label style={labelStyle}>SOAT Vigente</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'soat')} style={fileInputStyle} accept="image/*,.pdf" />
                                        {formData.docs.soat && <div style={{ color: '#00f2ff', fontSize: '0.7rem' }}>✅ Cargado</div>}
                                    </div>
                                </div>

                                {/* TECNO */}
                                <div>
                                    <label style={labelStyle}>Rev. Técnico-Mecánica</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'tecno')} style={fileInputStyle} accept="image/*,.pdf" />
                                        {formData.docs.tecno && <div style={{ color: '#00f2ff', fontSize: '0.7rem' }}>✅ Cargado</div>}
                                    </div>
                                </div>
                            </div>

                            <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(57, 255, 20, 0.1)', borderLeft: '3px solid #39FF14', fontSize: '0.8rem', color: '#ccc' }}>
                                ℹ️ Al enviar, aceptas la consulta de tus antecedentes judiciales y validación en RUNT. <br />
                                <strong style={{ color: '#fff' }}>Proceso de Estudio: 24-48 horas.</strong>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    style={{
                                        flex: 1, padding: '15px', marginTop: '10px',
                                        background: 'transparent', border: '1px solid #555', color: '#aaa',
                                        textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer'
                                    }}
                                >&lt; Atrás</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.docs.licencia || !formData.docs.soat}
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
                                    {isSubmitting ? 'Validando en RUNT...' : 'Enviar a Estudio'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
