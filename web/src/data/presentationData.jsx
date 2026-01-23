import React from 'react';

// Responsive helper styles (Recalibrated for safety)
export const titleStyle = {
    fontSize: 'clamp(1.8rem, 4.5vh, 3.5rem)', // Reduced from 5.5vh/4.5rem to prevent overflow
    margin: 0,
    textShadow: '0 0 30px rgba(0,240,255,0.3)',
    fontWeight: '800',
    lineHeight: 1.1,
    color: '#fff'
};

export const subtitleStyle = {
    color: '#00F0FF',
    letterSpacing: 'clamp(2px, 0.3vw, 4px)',
    marginBottom: '1.5vh',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 'clamp(1rem, 2.5vh, 1.5rem)' // Increased for better proportion
};

export const textStyle = {
    fontSize: 'clamp(0.8rem, 1.6vh, 1.1rem)', // Reduced to prevent text spilling
    lineHeight: '1.5',
    color: '#ddd'
};

export const getSlides = ({ onClose, onStartDemo, handleCardClick, roadmapStep, setRoadmapStep }) => [
    {
        id: 0,
        title: "TESO",
        subtitle: "THE FUTURE OF CORPORATE MOBILITY",
        bgImage: "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh', marginTop: '2vh' }}>
                <div className="diamond-anim" style={{ fontSize: 'clamp(8rem, 22vh, 12rem)', marginBottom: '2vh', filter: 'drop-shadow(0 0 60px rgba(0,240,255,0.6))' }}>💎</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vh, 3.5rem)', fontWeight: '900', letterSpacing: '8px', margin: 0 }}>TRANSPORTE EJECUTIVO</h2>
                    <h2 style={{ color: 'var(--neon-green)', fontSize: 'clamp(2rem, 5vh, 3.5rem)', fontWeight: '900', letterSpacing: '8px', margin: 0 }}>SOSTENIBLE & OPERATIVO</h2>
                </div>
                <p style={{ ...textStyle, fontSize: 'clamp(1.1rem, 2.5vh, 1.6rem)', fontWeight: '300', margin: 0, marginTop: '2vh' }}>La primera plataforma de movilidad B2B verificada de LatAm.</p>
            </div>
        )
    },
    {
        id: 1,
        title: "EL MURO OPERATIVO",
        subtitle: "EL PROBLEMA ACTUAL",
        bgImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80", // Intense Blue/Red Neon Geometric
        content: (
            <div style={{ display: 'flex', gap: '2.5vw', justifyContent: 'center', alignItems: 'stretch', width: '100%', maxWidth: '1300px', height: '100%' }}>

                {/* CARD 1 */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        icon: '🛑',
                        title: 'CAOS MANUAL',
                        desc: 'Dependencia absoluta de WhatsApp y Excel.',
                        detail: 'La gestión fragmentada actual genera una "Caja Negra". Los despachadores pierden 4 horas diarias coordinando chats, sin trazabilidad real ni responsables claros cuando ocurren fallos.'
                    })}
                    style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', padding: '3vh', borderRadius: '25px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                    <div style={{ fontSize: '5vh', marginBottom: '2vh', background: 'rgba(0,0,0,0.3)', padding: '2vh', borderRadius: '50%' }}>🛑</div>
                    <h3 style={{ color: '#fff', fontSize: '2.2vh', fontWeight: 'bold', marginBottom: '1vh' }}>CAOS MANUAL</h3>
                    <p style={{ ...textStyle, fontSize: '1.4vh' }}>Dependencia absoluta de WhatsApp y Excel. Un simple retraso rompe toda la cadena.</p>
                    <small style={{ color: 'var(--neon-green)', marginTop: 'auto', opacity: 0.9, fontSize: '1.2vh', fontWeight: 'bold' }}>(Click +)</small>
                </div>

                {/* CARD 2 */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        icon: '📉',
                        title: 'ESCALABILIDAD CERO',
                        desc: 'Imposible crear ecosistemas de afiliados.',
                        detail: 'El crecimiento actual requiere más "fuerza bruta" humana. Agregar vehículos aumenta la complejidad administrativa exponencialmente. Sin tecnología, escalar significa colapsar.'
                    })}
                    style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', padding: '3vh', borderRadius: '25px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                    <div style={{ fontSize: '5vh', marginBottom: '2vh', background: 'rgba(0,0,0,0.3)', padding: '2vh', borderRadius: '50%' }}>📉</div>
                    <h3 style={{ color: '#fff', fontSize: '2.2vh', fontWeight: 'bold', marginBottom: '1vh' }}>ESCALABILIDAD CERO</h3>
                    <p style={{ ...textStyle, fontSize: '1.4vh' }}>Imposible crear ecosistemas de afiliados. La operación está limitada a la memoria humana.</p>
                    <small style={{ color: 'var(--neon-green)', marginTop: 'auto', opacity: 0.9, fontSize: '1.2vh', fontWeight: 'bold' }}>(Click +)</small>
                </div>

                {/* CARD 3 */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        icon: '💸',
                        title: 'FUGA DE CAPITAL',
                        desc: 'Baja rentabilidad y sobrecostos.',
                        detail: 'Sin auditoría digital en tiempo real, las empresas pagan hasta un 15% de sobrecostos anuales por "servicios fantasma", rutas ineficientes y tiempos de espera no verificados.'
                    })}
                    style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', padding: '3vh', borderRadius: '25px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                    <div style={{ fontSize: '5vh', marginBottom: '2vh', background: 'rgba(0,0,0,0.3)', padding: '2vh', borderRadius: '50%' }}>💸</div>
                    <h3 style={{ color: '#fff', fontSize: '2.2vh', fontWeight: 'bold', marginBottom: '1vh' }}>FUGA DE CAPITAL</h3>
                    <p style={{ ...textStyle, fontSize: '1.4vh' }}>Baja rentabilidad por errores administrativos y falta de control en cancelaciones.</p>
                    <small style={{ color: 'var(--neon-green)', marginTop: 'auto', opacity: 0.9, fontSize: '1.2vh', fontWeight: 'bold' }}>(Click +)</small>
                </div>

            </div>
        )
    },
    {
        id: 2,
        title: "LA SOLUCIÓN",
        subtitle: "ECOSISTEMA INTEGRAL 360°",
        bgImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: '30px', marginTop: '2.5vh', maxWidth: '1400px', margin: '0 auto', alignItems: 'stretch' }}>
                    {[
                        { icon: '🛡️', title: 'FLOTA BLINDADA', desc: 'Seguridad Nivel III.', detail: 'Estándar Teso: Seguridad Nivel III o superior. Conductores entrenados en manejo defensivo, primeros auxilios y protocolo VIP. Verificación de antecedentes penales y pruebas psicotécnicas rigurosas.' },
                        { icon: '💻', title: 'CONTROL TOTAL', desc: 'Dashboard B2B en vivo.', detail: 'Panel de control centralizado para gestores de viajes corporativos. Trazabilidad GPS en vivo, centros de costos automatizados, facturación electrónica mensual y reportes de auditoría exportables.' },
                        { icon: '🤖', title: 'AI DISPATCH', desc: 'Predicción de tráfico.', detail: 'Integración con APIs aéreas (AviationStack) para monitorear aterrizajes en tiempo real. Nuestro algoritmo despacha el vehículo automáticamente para que esté esperando justo cuando el ejecutivo sale, minimizando tiempos muertos.' },
                        { icon: '🛠️', title: 'DRIVER HUB', desc: 'Ecosistema Integral.', detail: 'Más que una app para conducir. Ofrecemos alianzas exclusivas para mantenimiento preventivo, asesoría legal 24/7, seguros colectivos y acceso a créditos blandos para renovación de flota.' }
                    ].map(item => (
                        <div
                            key={item.title}
                            className="card-hover"
                            onClick={() => handleCardClick(item)}
                            style={{
                                cursor: 'pointer',
                                flex: 1,
                                background: 'rgba(0,0,0,0.25)',
                                backdropFilter: 'blur(12px)',
                                padding: '4vh 2vh',
                                borderRadius: '25px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>

                            <div>
                                <div style={{ fontSize: '4.5rem', marginBottom: '2vh', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3))' }}>{item.icon}</div>
                                <h3 style={{ color: 'var(--neon-green)', fontSize: '1.4rem', marginBottom: '1vh', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.title}</h3>
                                <p style={{ color: '#ddd', fontSize: '1.1rem', lineHeight: '1.4', maxWidth: '90%' }}>{item.desc}</p>
                            </div>

                            <small style={{
                                color: 'var(--neon-green)',
                                background: 'transparent',
                                border: '1px solid var(--neon-green)',
                                marginTop: '3vh',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                padding: '8px 20px',
                                borderRadius: '30px',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 10px rgba(57, 255, 20, 0.1)'
                            }}>
                                [ + INFO ]
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        )
    },
    {
        id: 3,
        title: "ARQUITECTURA DE PODER",
        subtitle: "RAG ACTIVO: EL MOTOR DEL ECOSISTEMA",
        bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4vh' }}>

                {/* TECH CARDS CONTAINER */}
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', width: '100%', alignItems: 'stretch' }}>

                    {/* CARD 1: ACTIVE RAG */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '🧠',
                            title: 'ACTIVE RAG CORE',
                            desc: 'Inteligencia Contextual Viva.',
                            detail: 'El corazón del sistema es nuestro "Active RAG" (Retrieval-Augmented Generation). A diferencia de un software estático, este núcleo ingesta constantemente datos históricos y en tiempo real. "Lee" cada factura, "escucha" cada chat de WhatsApp y "siente" el tráfico, creando un contexto vivo que nunca se apaga.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '4vh 3vh', borderRadius: '25px', border: '1px solid #00F0FF', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)' }}>
                        <div style={{ fontSize: '6vh', marginBottom: '2vh' }}>🧠</div>
                        <h3 style={{ color: '#00F0FF', fontSize: '2.5vh', marginBottom: '1vh', letterSpacing: '1px' }}>ACTIVE RAG CORE</h3>
                        <p style={{ ...textStyle, fontSize: '1.6vh' }}>Generación Aumentada por Recuperación: El cerebro que nunca duerme.</p>
                        <small style={{ color: '#00F0FF', marginTop: 'auto', opacity: 0.9, fontSize: '1.2vh', fontWeight: 'bold' }}>(Ver Arquitectura)</small>
                    </div>

                    {/* CARD 2: THE WEAPONS (ERP, BI, CRM) */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '⚔️',
                            title: 'ARMAS POTENCIADAS',
                            desc: 'ERP + BI + CRM Unificados.',
                            detail: (
                                <div>
                                    <p>El RAG Activo convierte herramientas estándar en armas estratégicas:</p>
                                    <ul style={{ textAlign: 'left', marginTop: '15px' }}>
                                        <li style={{ marginBottom: '10px' }}><strong style={{ color: 'gold' }}>ERP (Finanzas):</strong> Auditoría invisible. El RAG cruza GPS vs Facturación para detectar fugas de dinero al instante.</li>
                                        <li style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--neon-green)' }}>CRM (Ventas):</strong> No es un chatbot. Es un asistente que conoce el historial emocional y logístico de cada ejecutivo.</li>
                                        <li><strong style={{ color: '#00F0FF' }}>BI (Estrategia):</strong> Business Intelligence que predice el futuro, no solo reporta el pasado.</li>
                                    </ul>
                                </div>
                            )
                        })}
                        style={{ cursor: 'pointer', flex: 1.2, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '4vh 3vh', borderRadius: '25px', border: '1px solid var(--neon-green)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)' }}>
                        <div style={{ fontSize: '6vh', marginBottom: '2vh' }}>⚔️</div>
                        <h3 style={{ color: 'var(--neon-green)', fontSize: '2.5vh', marginBottom: '1vh', letterSpacing: '1px' }}>ERP • CRM • BI</h3>
                        <p style={{ ...textStyle, fontSize: '1.6vh' }}>Armas de alto calibre potenciadas por IA para dominar el mercado.</p>
                        <small style={{ color: 'var(--neon-green)', marginTop: 'auto', opacity: 0.9, fontSize: '1.2vh', fontWeight: 'bold' }}>(Ver Integración)</small>
                    </div>

                </div>

                {/* STATUS FOOTER */}
                <div style={{ background: 'rgba(0,0,0,0.8)', padding: '1.5vh 4vw', borderRadius: '50px', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', fontSize: '1.4vh', letterSpacing: '1px', display: 'flex', gap: '20px' }}>
                    <span style={{ color: '#00F0FF' }}>RAG STATUS: <b className="blink">ACTIVE</b></span>
                    <span style={{ color: '#666' }}>|</span>
                    <span style={{ color: 'gold' }}>ERP: LINKED</span>
                    <span style={{ color: '#666' }}>|</span>
                    <span style={{ color: 'var(--neon-green)' }}>BI: PREDICTING</span>
                </div>
            </div>
        )
    },
    {
        id: 4,
        title: "MERCADO (LATAM)",
        subtitle: "OPORTUNIDAD MULTIMILLONARIA",
        bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3vw', height: 'auto', width: '100%', paddingBottom: '2vh', maxWidth: '1200px' }}>

                {/* SOM BAR */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'SOM: $5M (MEDELLÍN)',
                        desc: 'Estrategia de Dominancia Local.',
                        detail: 'Nuestra cabeza de playa. La meta es capturar el 30% del transporte turístico y corporativo de Medellín en 18 meses, asegurando contratos exclusivos con los 10 hoteles más importantes y agencias de eventos.'
                    })}
                    style={{ cursor: 'pointer', width: '25%', minWidth: '180px', height: '30vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid #555', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '15px 15px 0 0', padding: '2vh', borderBottom: '6px solid #fff' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vh, 3rem)', margin: 0, color: '#fff' }}>$5M</h2>
                    <small style={{ fontSize: 'clamp(0.8rem, 1.5vh, 1.2rem)', color: '#aaa', marginTop: '0.5vh', fontWeight: 'bold' }}>SOM (Medellín)</small>
                    <div style={{ fontSize: '1.2vh', color: '#fff', marginTop: '1vh', opacity: 0.7 }}>(Ver Estrategia)</div>
                </div>

                {/* SAM BAR */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'SAM: $120M (COLOMBIA)',
                        desc: 'Expansión Nacional.',
                        detail: 'Replicar el modelo en Bogotá (El Dorado) y Cartagena. Alianzas nacionales con cadenas hoteleras (ej. Marriott, Hilton) para ser su proveedor de movilidad preferente en todo el país. Estandarización del servicio.'
                    })}
                    style={{ cursor: 'pointer', width: '25%', minWidth: '180px', height: '42vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid #888', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '15px 15px 0 0', padding: '2vh', borderBottom: '6px solid gold' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vh, 4rem)', margin: 0, color: 'gold' }}>$120M</h2>
                    <small style={{ fontSize: 'clamp(0.8rem, 1.5vh, 1.2rem)', color: '#aaa', marginTop: '0.5vh', fontWeight: 'bold' }}>SAM (Colombia)</small>
                    <div style={{ fontSize: '1.2vh', color: 'gold', marginTop: '1vh', opacity: 0.7 }}>(Ver Estrategia)</div>
                </div>

                {/* TAM BAR */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'TAM: $2.5B (LATAM)',
                        desc: 'Plataforma Regional.',
                        detail: 'La visión final. Ser el "Blacklane de LatAm". Expansión a Ciudad de México y São Paulo, mercados con inmensa necesidad de seguridad corporativa. Consolidadción como la única plataforma B2B regional verificada.'
                    })}
                    style={{ cursor: 'pointer', width: '30%', minWidth: '220px', height: '55vh', background: 'rgba(57, 255, 20, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid var(--neon-green)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 0 40px rgba(57, 255, 20, 0.3)', borderRadius: '15px 15px 0 0', padding: '3vh', borderBottom: '8px solid var(--neon-green)' }}>
                    <h2 style={{ fontSize: 'clamp(4rem, 7vh, 6rem)', fontWeight: 'bold', margin: '0', color: 'var(--neon-green)', lineHeight: 1 }}>$2.5B</h2>
                    <small style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 2vh, 1.5rem)', color: '#fff', marginTop: '1vh' }}>TAM (LatAm)</small>
                    <div style={{ fontSize: '1.4vh', marginTop: '2vh', background: 'var(--neon-green)', padding: '1vh 2vh', borderRadius: '30px', color: '#000', fontWeight: 'bold' }}>VER VISIÓN 🚀</div>
                </div>

            </div>
        )
    },
    {
        id: 5,
        title: "MODELO DE NEGOCIO",
        subtitle: "ECONOMÍA COLABORATIVA PURA (IA)",
        bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ display: 'flex', gap: '2vw', maxWidth: '1200px', margin: '0 auto', width: '100%', height: '100%', alignItems: 'stretch' }}>

                {/* COL 1: ZERO FRICTION DRIVERS */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'AFILIACIÓN GRATUITA',
                        desc: 'Ganar-Ganar para el conductor.',
                        detail: 'El conductor NO paga por entrar. Al contrario: por pertenecer a nuestra red accede a repuestos, seguros y trámites más baratos gracias a nuestro poder de negociación masiva. Cero fricción para que se unan los mejores.'
                    })}
                    style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '2vh', borderTop: '4px solid var(--neon-green)', borderRadius: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>1. CONDUCTOR</h3>
                    <p style={{ ...textStyle, fontSize: '1.2vh' }}>Entrada $0 + Beneficios de Red (Repuestos/Seguros).</p>
                    <h2 style={{ color: 'var(--neon-green)', fontSize: 'clamp(1.5rem, 3vh, 2.2rem)', marginTop: '1vh' }}>ZERO COST</h2>
                    <small style={{ color: '#aaa' }}>Cero costo de entrada.</small>
                </div>

                {/* COL 2: ZERO MARKETING COST */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'MERCADEO ORGÁNICO',
                        desc: 'Costo de Adquisición Cero.',
                        detail: 'No gastamos en publicidad masiva. Nuestra IA conecta la oferta (conductores) con la demanda (empresas ya captadas) de forma directa. El "Network Effect" y los convenios corporativos llenan los cupos sin quemar dinero en ads.'
                    })}
                    style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '2vh', borderTop: '4px solid gold', borderRadius: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>2. CAC ≈ $0</h3>
                    <p style={{ ...textStyle, fontSize: '1.2vh' }}>Mercadeo reemplazado por IA y Alianzas B2B.</p>
                    <h2 style={{ color: 'gold', fontSize: 'clamp(1.5rem, 3vh, 2.2rem)', marginTop: '1vh' }}>SIN ADS</h2>
                    <small style={{ color: '#aaa' }}>Crecimiento Orgánico.</small>
                </div>

                {/* COL 3: MONETIZATION */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'COMISIÓN SIMPLE',
                        desc: 'Solo ganamos si ellos ganan.',
                        detail: 'Nuestro modelo es transparente: Cobramos el 20% de cada servicio completado. Sin cuotas ocultas, sin mensualidades fijas. Es un modelo de rendimiento puro basado en la eficiencia de nuestra asignación por IA.'
                    })}
                    style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '2vh', borderTop: '4px solid #00F0FF', borderRadius: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>3. TAKE RATE</h3>
                    <p style={{ ...textStyle, fontSize: '1.2vh' }}>Comisión única por servicio exitoso.</p>
                    <h2 style={{ color: '#00F0FF', fontSize: 'clamp(1.5rem, 4vh, 2.5rem)' }}>20% FLAT</h2>
                    <small style={{ color: '#aaa' }}>Ingreso Recurrente.</small>
                </div>
            </div>
        )
    },
    {
        id: 6,
        title: "VALIDACIÓN & TESTIMONIOS",
        subtitle: "TRANSFORMACIÓN REAL: DE EXCEL A PHANTOM CORE",
        bgImage: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', width: '100%', alignItems: 'stretch', justifyContent: 'center', height: '100%' }}>

                {/* LEFT: THE PAIN (BEFORE) - Interactive */}
                <div
                    className="card-hover"
                    onClick={() => handleCardClick({
                        title: 'EL CAOS OPERATIVO (ANTES)',
                        desc: 'La barrera del crecimiento.',
                        detail: 'Antes de TESO, la operación dependía de la memoria de los despachadores y hojas de cálculo desconectadas. Esto causaba: 1) Servicios olvidados (pérdida de clientes), 2) Facturación tardía (problemas de flujo de caja), y 3) Imposibilidad de escalar más allá de 15 vehículos sin contratar más personal administrativo.'
                    })}
                    style={{ cursor: 'pointer', flex: 4, background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.5)', borderRadius: '25px', padding: '3vh', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                    <div>
                        <h3 style={{ color: '#FF5722', borderBottom: '2px solid #FF5722', paddingBottom: '1.5vh', marginBottom: '2vh', fontSize: '1.8rem', fontWeight: '900' }}>🚫 ANTES (MANUAL)</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#fff', fontSize: '1.3rem', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
                            <li style={{ display: 'flex', gap: '10px' }}><span>📉</span> <strong>Estrés Operativo:</strong> "Llamadas a las 3 AM y excels infinitos."</li>
                            <li style={{ display: 'flex', gap: '10px' }}><span>⏳</span> <strong>Pérdida de Tiempo:</strong> 4 horas/día coordinando chats.</li>
                            <li style={{ display: 'flex', gap: '10px' }}><span>💸</span> <strong>Errores Costosos:</strong> Servicios duplicados o no cobrados.</li>
                        </ul>
                    </div>

                    <small style={{ color: '#FF5722', fontWeight: 'bold', fontSize: '1rem', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '15px', textAlign: 'center', marginTop: '2vh' }}>[ + VER PROBLEMA REAL ]</small>
                </div>

                {/* RIGHT: THE GLORY (AFTER) - TESTIMONIALS - Interactive */}
                <div style={{ flex: 6, display: 'flex', flexDirection: 'column', gap: '3vh' }}>

                    {/* Testimonial 1 */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'CASO DE ÉXITO: FAMILIA',
                            desc: 'Eficiencia Operativa.',
                            detail: '"Lo que antes nos tomaba toda la mañana en Excel, ahora Teso lo hace en segundos." - Implementar Teso redujo la carga administrativa en un 70%. El equipo operativo pasó de "apagar incendios" a enfocarse en la calidad del servicio y la atención al cliente VIP.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(57, 255, 20, 0.15)', border: '1px solid var(--neon-green)', borderRadius: '25px', padding: '3vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', top: -20, left: 30, background: '#000', padding: '0 15px', color: 'var(--neon-green)', fontSize: '3rem' }}>❝</div>
                        <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '1.5rem', lineHeight: '1.4', marginBottom: '2vh' }}>
                            "El sistema 'Phantom' eliminó el error humano y nos devolvió la vida."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👩‍💼</div>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--neon-green)', fontSize: '1.1rem' }}>Jefe de Operaciones</strong>
                                    <small style={{ color: '#aaa', fontSize: '0.9rem' }}>Sector Logística</small>
                                </div>
                            </div>
                            <small style={{ color: 'var(--neon-green)', fontWeight: 'bold', fontSize: '0.9rem', border: '1px solid var(--neon-green)', padding: '5px 15px', borderRadius: '20px' }}>[ + LEER HISTORIA ]</small>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'VALIDACIÓN DE MERCADO',
                            desc: 'Satisfacción del Cliente.',
                            detail: 'La validación con usuarios reales fue clave. Nuestros clientes corporativos (Hoteles, Ejecutivos) reportaron un aumento inmediato en la percepción de seguridad y puntualidad gracias al seguimiento por GPS en tiempo real que les ofrecemos.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00F0FF', borderRadius: '25px', padding: '3vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', top: -20, left: 30, background: '#000', padding: '0 15px', color: '#00F0FF', fontSize: '3rem' }}>❝</div>
                        <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '1.5rem', lineHeight: '1.4', marginBottom: '2vh' }}>
                            "Ver cómo el algoritmo asigna rutas solas es magia. Pura eficiencia."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🚀</div>
                                <div>
                                    <strong style={{ display: 'block', color: '#00F0FF', fontSize: '1.1rem' }}>Gerente de Expansión</strong>
                                    <small style={{ color: '#aaa', fontSize: '0.9rem' }}>Equipo Teso</small>
                                </div>
                            </div>
                            <small style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '0.9rem', border: '1px solid #00F0FF', padding: '5px 15px', borderRadius: '20px' }}>[ + LEER HISTORIA ]</small>
                        </div>
                    </div>
                </div>

            </div>
        )
    },
    {
        id: 7,
        title: "IMPACTO & ECOSISTEMA PAÍS",
        subtitle: "MÁS QUE UNA APP, UN MOTOR DE DESARROLLO",
        bgImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1920&q=80", // Social/Community image
        content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4vh', maxWidth: '1200px', width: '100%', height: '100%', justifyContent: 'center' }}>

                {/* PILLAR 1: LEGAL EMPLOYMENT */}
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'right', color: 'gold', fontSize: 'clamp(2rem, 4vh, 3rem)', fontWeight: 'bold' }}>
                        ⚖️ LEGALIDAD
                    </div>
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'LEGALIDAD VS CAOS',
                            desc: 'Formalización de la industria.',
                            detail: 'En un sector dominado por la informalidad, TESO se posiciona como el estándar ético y legal. Garantizamos que cada conductor tribute, tenga seguridad social y opere bajo el marco legal de transporte especial.'
                        })}
                        style={{ cursor: 'pointer', flex: 3, padding: '3vh', borderRadius: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderLeft: '4px solid gold' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1vh' }}>Gran Motor de Empleo Legal</h3>
                        <p style={{ ...textStyle, fontSize: '1.1rem', margin: 0 }}>Formalizamos la industria, garantizando seguridad social y tributación.</p>
                        <small style={{ color: 'gold', marginTop: '1.5vh', display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>[ + AMPLIR INFO ]</small>
                    </div>
                </div>

                {/* PILLAR 2: SOCIAL FABRIC */}
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'right', color: 'var(--neon-green)', fontSize: 'clamp(2rem, 4vh, 3rem)', fontWeight: 'bold' }}>
                        🤝 TEJIDO
                    </div>
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'TEJIDO SOCIAL',
                            desc: 'Reconstrucción de confianza.',
                            detail: 'Conectamos sectores vitales. Al asegurar el transporte corporativo y turístico, inyectamos dinamismo económico y seguridad percibida en la ciudad, atrayendo más inversión extranjera.'
                        })}
                        style={{ cursor: 'pointer', flex: 3, padding: '3vh', borderRadius: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderLeft: '4px solid var(--neon-green)' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1vh' }}>Reconstrucción de Confianza</h3>
                        <p style={{ ...textStyle, fontSize: '1.1rem', margin: 0 }}>Conectamos Educación, Gobierno e Inversión para reactivar la economía local.</p>
                        <small style={{ color: 'var(--neon-green)', marginTop: '1.5vh', display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>[ + AMPLIR INFO ]</small>
                    </div>
                </div>

                {/* PILLAR 3: STRATEGIC VERTICALS */}
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'right', color: '#00F0FF', fontSize: 'clamp(2rem, 4vh, 3rem)', fontWeight: 'bold' }}>
                        🚀 FUTURO
                    </div>
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'VÉRTICES DE FUTURO',
                            desc: 'Turismo, Educación y Gobierno.',
                            detail: 'Nuestra tecnología habilita verticales de alto valor: Turismo de lujo con guías bilingües, Transporte escolar seguro con monitoreo parental y soluciones de movilidad para funcionarios públicos.'
                        })}
                        style={{ cursor: 'pointer', flex: 3, padding: '3vh', borderRadius: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #00F0FF' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1vh' }}>Nuevas Verticales de Valor</h3>
                        <p style={{ ...textStyle, fontSize: '1.1rem', margin: 0 }}>Turismo de Lujo • Transporte Escolar • Soluciones Gobierno</p>
                        <small style={{ color: '#00F0FF', marginTop: '1.5vh', display: 'block', fontSize: '0.9rem', fontWeight: 'bold' }}>[ + AMPLIR INFO ]</small>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2vh', fontStyle: 'italic', color: '#aaa', fontSize: '1.2rem', letterSpacing: '1px' }}>
                    "Acabamos con la ilegalidad creando oportunidades reales."
                </div>
            </div>
        )
    },
    {
        id: 8,
        title: "PROPUESTA DE VALOR: GOBIERNO",
        subtitle: "ALIADO ESTRATÉGICO SECRETARÍA DE MOVILIDAD",
        bgImage: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh', width: '100%', maxWidth: '1200px', height: '100%', justifyContent: 'center' }}>

                {/* HEADER CONCEPT */}
                <div style={{ textAlign: 'center', marginBottom: '2vh' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vh, 2.5rem)', color: '#fff', margin: 0 }}>LA SOLUCIÓN AL TRANSPORTE ILEGAL</h2>
                    <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '800px', margin: '1vh auto', lineHeight: '1.4' }}>
                        No somos el enemigo. Somos la herramienta que centraliza y valida la legalidad en tiempo real.
                    </p>
                </div>

                {/* THE 3 PILLARS OF GOV ALLIANCE */}
                <div style={{ display: 'flex', gap: '30px', width: '100%', justifyContent: 'center', alignItems: 'stretch' }}>

                    {/* PILLAR 1: DIGITAL CONTROL */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'DASHBOARD UNIFICADO',
                            desc: 'Control total para la Secretaría.',
                            detail: 'Unificación de controles. En lugar de tener datos dispersos en 10 secretarías del Valle de Aburrá, TESO ofrece un Dashboard Unificado para Envigado y el Área Metropolitana. Visualización de flota legal en tiempo real.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', padding: '3vh', borderRadius: '15px', border: '1px solid var(--neon-green)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>🏛️</div>
                            <h3 style={{ color: 'var(--neon-green)', fontSize: '1.5rem', marginBottom: '1vh' }}>CENTRALIZACIÓN</h3>
                            <p style={{ ...textStyle, fontSize: '1.1rem' }}>Dashboard Unificado para control de flota en tiempo real.</p>
                        </div>
                        <small style={{ color: 'var(--neon-green)', marginTop: '2vh', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid var(--neon-green)', padding: '5px 10px', borderRadius: '20px', display: 'inline-block' }}>[ + AMPLIAR INFO ]</small>
                    </div>

                    {/* PILLAR 2: THE FUEC */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'FUEC 100% DIGITAL',
                            desc: 'Adiós al papel y al fraude.',
                            detail: 'Generación automática y en tiempo real del Extracto de Contrato (FUEC). El agente de tránsito escanea un QR y ve: Contrato Vigente + Seguros al Día + Ruta Autorizada. Ilegalidad Cero.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', padding: '3vh', borderRadius: '15px', border: '1px solid #00F0FF', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>📄</div>
                            <h3 style={{ color: '#00F0FF', fontSize: '1.5rem', marginBottom: '1vh' }}>FUEC DIGITAL</h3>
                            <p style={{ ...textStyle, fontSize: '1.1rem' }}>Validación QR inmediata. Contratos y seguros verificados al instante.</p>
                        </div>
                        <small style={{ color: '#00F0FF', marginTop: '2vh', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #00F0FF', padding: '5px 10px', borderRadius: '20px', display: 'inline-block' }}>[ + AMPLIAR INFO ]</small>
                    </div>

                    {/* PILLAR 3: REAL DATA */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            title: 'DATA PARA PLANEACIÓN',
                            desc: 'Movilidad inteligente.',
                            detail: 'Entregamos data anonimizada de movilidad corporativa y turística para la planeación urbana. A cambio, proponemos "Carriles Preferenciales Digitales" y trámites express para nuestros afiliados.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', padding: '3vh', borderRadius: '15px', border: '1px solid gold', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>📊</div>
                            <h3 style={{ color: 'gold', fontSize: '1.5rem', marginBottom: '1vh' }}>DATA URBANA</h3>
                            <p style={{ ...textStyle, fontSize: '1.1rem' }}>Inteligencia de movilidad compartida para mejorar la ciudad.</p>
                        </div>
                        <small style={{ color: 'gold', marginTop: '2vh', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid gold', padding: '5px 10px', borderRadius: '20px', display: 'inline-block' }}>[ + AMPLIAR INFO ]</small>
                    </div>

                </div>

                <div style={{ marginTop: '2vh', padding: '1.5vh 3vh', background: 'rgba(0,240,255,0.1)', borderRadius: '50px', border: '1px dashed #00F0FF', color: '#fff', fontSize: '1rem' }}>
                    🤝 PROPUESTA: "PILOTO ENVIGADO - CIUDAD MODELO DE TRANSPORTE DIGITAL"
                </div>

            </div>
        )
    },
    {
        id: 9,
        title: "TRACCIÓN Y ROADMAP",
        subtitle: "HACIA LA EXPANSIÓN NACIONAL",
        bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: '1400px', height: '100%' }}>

                {/* LEFT: ROADMAP ACCORDION */}
                <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
                    {[
                        {
                            id: 0,
                            phase: '2024 Q4: VALIDACIÓN',
                            status: '✅ COMPLETADO',
                            color: '#fff',
                            text: 'Validación técnica completada. Realizamos 500 viajes de prueba con 5 empresas aliadas, ajustando el algoritmo de despacho y la app de conductores. Feedback positivo del 98%.'
                        },
                        {
                            id: 1,
                            phase: '2025 Q1: LANZAMIENTO',
                            status: '📍 EN PROCESO',
                            color: 'gold',
                            text: 'Go-to-Market agresivo. Equipo de ventas B2B activado para cerrar contratos con las 50 empresas top de Medellín. Objetivo: $50k MRR en los primeros 3 meses.'
                        },
                        {
                            id: 2,
                            phase: '2025 Q3: BOGOTÁ',
                            status: '🔜 PRÓXIMAMENTE',
                            color: 'var(--neon-green)',
                            text: 'Réplica del modelo en la capital. Alianzas estratégicas con hoteles cercanos al aeropuerto El Dorado y operadores de turismo corporativo. Flota proyectada: 200 vehículos.'
                        },
                        {
                            id: 3,
                            phase: '2026: INTERNACIONAL',
                            status: '🔮 VISIÓN',
                            color: '#00F0FF',
                            text: 'Escalabilidad regional. Estudios de mercado en CDMX y Sao Paulo para implementar el modelo de "Movilidad Corporativa Blindada".'
                        }
                    ].map((item) => (
                        <div
                            key={item.id}
                            className="card-hover"
                            onClick={() => setRoadmapStep(roadmapStep === item.id ? null : item.id)}
                            style={{
                                cursor: 'pointer',
                                padding: '2vh 3vh',
                                borderRadius: '15px',
                                background: roadmapStep === item.id ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)',
                                border: `1px solid ${roadmapStep === item.id ? item.color : 'rgba(255,255,255,0.1)'}`,
                                borderLeft: `6px solid ${item.color}`,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fff', fontWeight: 'bold' }}>{item.phase}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: item.color, opacity: 0.9 }}>{item.status}</span>
                                    <span style={{
                                        fontSize: '1.2rem', fontWeight: 'bold',
                                        background: roadmapStep === item.id ? item.color : '#333',
                                        color: roadmapStep === item.id ? '#000' : '#fff',
                                        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                                    }}>
                                        {roadmapStep === item.id ? '−' : '+'}
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                maxHeight: roadmapStep === item.id ? '200px' : '0',
                                overflow: 'hidden',
                                opacity: roadmapStep === item.id ? 1 : 0,
                                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                                marginTop: roadmapStep === item.id ? '2vh' : '0'
                            }}>
                                <p style={{ margin: 0, color: '#ddd', fontSize: '1.1rem', lineHeight: '1.6', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: METRICS */}
                <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '2.5vh' }}>
                    <div style={{ paddingBottom: '1vh', borderBottom: '1px solid #444', marginBottom: '1vh' }}>
                        <h3 style={{ color: '#00F0FF', fontSize: '2.5vh', margin: 0, letterSpacing: '2px' }}>METRICS TODAY</h3>
                    </div>

                    <div
                        className="card-hover"
                        style={{ flex: 1, padding: '3vh', borderRadius: '20px', background: 'rgba(57, 255, 20, 0.08)', border: '1px solid var(--neon-green)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '5vh', marginBottom: '1vh' }}>🚀</div>
                        <h2 style={{ fontSize: '5vh', fontWeight: 'bold', color: '#fff', margin: 0 }}>15+</h2>
                        <h4 style={{ color: 'var(--neon-green)', margin: '0.5vh 0', fontSize: '2vh' }}>EMPRESAS EN WAITLIST</h4>
                        <p style={{ color: '#aaa', fontSize: '1.6vh', margin: 0 }}>Cartas de intención (LOI) firmadas.</p>
                    </div>

                    <div
                        className="card-hover"
                        style={{ flex: 1, padding: '3vh', borderRadius: '20px', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid #00F0FF', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '5vh', marginBottom: '1vh' }}>👨‍✈️</div>
                        <h2 style={{ fontSize: '5vh', fontWeight: 'bold', color: '#fff', margin: 0 }}>450+</h2>
                        <h4 style={{ color: '#00F0FF', margin: '0.5vh 0', fontSize: '2vh' }}>CONDUCTORES VERIFICADOS</h4>
                        <p style={{ color: '#aaa', fontSize: '1.6vh', margin: 0 }}>Vehículos 2022+ listos para operar.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 10,
        title: "THE ASK",
        subtitle: "ANGEL / PRE-SEED ROUND",
        bgImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80",
        content: (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh', width: '100%' }}>

                {/* HEADER TOTAL */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vh, 2.5rem)', margin: 0, color: '#fff', letterSpacing: '3px' }}>RONDA DE EFICIENCIA</h2>
                    <h1 style={{ fontSize: 'clamp(4rem, 10vh, 8rem)', color: 'var(--neon-green)', margin: 0, textShadow: '0 0 60px var(--neon-green)', lineHeight: 1 }}>$200K USD</h1>
                    <p style={{ fontSize: 'clamp(1.1rem, 2vh, 1.5rem)', color: '#aaa', marginTop: '1vh' }}>18 Meses de Runway • Validación Low-Cost</p>
                </div>

                {/* INTERACTIVE CARDS */}
                <div style={{ display: 'flex', gap: '2vw', justifyContent: 'center', width: '100%', maxWidth: '1200px', flex: 1, alignItems: 'stretch' }}>

                    {/* CARD 1: SUPPLY (ZERO COST) */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '🚗',
                            title: 'MODELO DE AFILIACIÓN',
                            desc: 'Activos de terceros.',
                            detail: 'Modelo Asset-Light. No somos dueños de los vehículos. Afiliamos a propietarios de transporte especial que ya tienen sus permisos al día. Ellos ponen el activo y el mantenimiento; nosotros ponemos la inteligencia y la demanda.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '3vh', borderRadius: '20px', border: '1px solid var(--neon-green)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>🚗</div>
                            <h3 style={{ color: 'var(--neon-green)', fontSize: '1.4rem', fontWeight: 'bold' }}>AFILIADOS</h3>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '1vh 0', color: '#fff' }}>60+ ACTIVOS</div>
                            <p style={{ color: '#aaa', fontSize: '1rem' }}>Modelo Asset-Light puro.</p>
                        </div>
                        <small style={{ color: 'var(--neon-green)', background: 'transparent', border: '1px solid var(--neon-green)', fontSize: '0.9rem', fontWeight: 'bold', padding: '8px 20px', borderRadius: '20px', marginTop: '2vh' }}>[ + INFO ]</small>
                    </div>

                    {/* CARD 2: TECH (LOW COST) */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '🧩',
                            title: 'OPTIMIZACIÓN VS GASTO',
                            desc: 'Escala Controlada.',
                            detail: 'Nuestra base de datos inicial es manejable: ~70 empresas y ~100 vehículos afiliados. No necesitamos servidores masivos ni IA costosa. El capital es para herramientas ágiles que "afinan" la operación al milímetro, preparando el terreno para escalar sin fricción más adelante.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '3vh', borderRadius: '20px', border: '1px solid #00F0FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>🧩</div>
                            <h3 style={{ color: '#00F0FF', fontSize: '1.4rem', fontWeight: 'bold' }}>OPTIMIZACIÓN</h3>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '1vh 0', color: '#fff' }}>FINE-TUNING</div>
                            <p style={{ color: '#aaa', fontSize: '1rem' }}>Base tecnológica eficiente.</p>
                        </div>
                        <small style={{ color: '#00F0FF', background: 'transparent', border: '1px solid #00F0FF', fontSize: '0.9rem', fontWeight: 'bold', padding: '8px 20px', borderRadius: '20px', marginTop: '2vh' }}>[ + INFO ]</small>
                    </div>

                    {/* CARD 3: GROWTH */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '📈',
                            title: 'GROWTH B2B',
                            desc: 'Cierre de Ventas.',
                            detail: 'Con el MVP listo y la flota conectada, el capital se enfoca en la gestión comercial. Cerrar contratos con empresas no es difícil cuando el producto funciona y ahorra costos. El dinero es para acelerar este cierre.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '3vh', borderRadius: '20px', border: '1px solid gold', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>📈</div>
                            <h3 style={{ color: 'gold', fontSize: '1.4rem', fontWeight: 'bold' }}>EXPANSIÓN</h3>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '1vh 0', color: '#fff' }}>VENTAS</div>
                            <p style={{ color: '#aaa', fontSize: '1rem' }}>Onboarding Corporativo.</p>
                        </div>
                        <small style={{ color: 'gold', background: 'transparent', border: '1px solid gold', fontSize: '0.9rem', fontWeight: 'bold', padding: '8px 20px', borderRadius: '20px', marginTop: '2vh' }}>[ + INFO ]</small>
                    </div>

                </div>

                <div style={{ marginTop: '1vh', color: '#888', fontSize: '1.3vh', fontFamily: 'monospace', maxWidth: '80%' }}>
                    * TESIS: "CONECTAR LO QUE YA EXISTE USANDO INTELIGENCIA ACCESIBLE."
                </div>

                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        padding: '1.5vh 4vw', fontSize: '1.2rem', fontWeight: 'bold',
                        borderRadius: '50px', cursor: 'pointer', boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s',
                        marginTop: '1vh'
                    }}>
                    HABLEMOS 🚀
                </button>
            </div>
        )
    },
    {
        id: 11,
        title: "CORE OPERATIVO",
        subtitle: "SEGURIDAD • EFICIENCIA • AUTONOMÍA",
        bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80", // Cyber Security / Data Center
        content: (
            <div style={{ width: '100%', maxWidth: '1400px', height: '100%', display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'center' }}>

                {/* TOP BAR: SYSTEM STATUS */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(0, 20, 40, 0.8)', padding: '20px 40px', borderRadius: '15px',
                    border: '1px solid rgba(0, 242, 255, 0.3)', backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#aaa', fontSize: '0.8rem', letterSpacing: '2px' }}>SYSTEM STATUS</span>
                            <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="blink" style={{ width: '10px', height: '10px', background: 'var(--neon-green)', borderRadius: '50%' }}></span>
                                ONLINE (SECURE)
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#aaa', fontSize: '0.8rem', letterSpacing: '2px' }}>UPTIME</span>
                            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>99.998%</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#aaa', fontSize: '0.8rem', letterSpacing: '2px' }}>THREATS BLOCKED</span>
                            <span style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '1.2rem' }}>24/24 (100%)</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            background: 'rgba(57, 255, 20, 0.1)', border: '1px solid var(--neon-green)',
                            color: 'var(--neon-green)', padding: '5px 15px', borderRadius: '5px',
                            fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px'
                        }}>
                            🛡️ ZERO-ERROR PROTOCOL ACTIVE
                        </div>
                    </div>
                </div>

                {/* MAIN DASHBOARD GIRD */}
                <div style={{ display: 'flex', gap: '30px', height: '60%' }}>

                    {/* LEFT: AUTONOMOUS AGENTS (THE WORKFORCE) */}
                    <div style={{ flex: 2, background: 'rgba(0,0,0,0.5)', border: '1px solid #444', borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 20px 0', borderBottom: '1px solid #444', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>🤖 FUERZA LABORAL IA</span>
                            <span style={{ fontSize: '0.9rem', color: '#888' }}>ACTIVE AGENTS: 4</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                            {[
                                { name: 'DISPATCHER_01', task: 'Optimizando Ruta: Pablado -> JMC', status: 'WORKING', color: '#00F0FF' },
                                { name: 'FINANCE_BOT', task: 'Auditando Factura #9921', status: 'VERIFYING', color: 'gold' },
                                { name: 'SECURITY_CORE', task: 'Monitoreo GPS - Flota 100%', status: 'SCANNING', color: 'var(--neon-green)' },
                                { name: 'CRM_ASSIST', task: 'Agendando Pickup VIP (Marriott)', status: 'ACTIVE', color: '#ff00ff' }
                            ].map((agent, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${agent.color}`
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{agent.name}</strong>
                                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{agent.task}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 'bold', color: agent.color,
                                        border: `1px solid ${agent.color}`, padding: '2px 8px', borderRadius: '4px'
                                    }}>
                                        {agent.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: LIVE GOALS (THE NUMBERS) */}
                    <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* EFFICIENCY METER */}
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid #444', borderRadius: '20px', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: '#00F0FF' }}>94%</div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa', letterSpacing: '1px' }}>FLOTA UTILIZADA</div>
                            </div>
                            <div style={{ width: '1px', height: '60%', background: '#444' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--neon-green)' }}>12m</div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa', letterSpacing: '1px' }}>TIEMPO RESPUESTA PROMEDIO</div>
                            </div>
                            <div style={{ width: '1px', height: '60%', background: '#444' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'gold' }}>0%</div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa', letterSpacing: '1px' }}>TASA DE ERROR CRÍTICO</div>
                            </div>
                        </div>

                        {/* GOALS TABLE */}
                        <div style={{ flex: 2, background: 'rgba(0,0,0,0.5)', border: '1px solid #444', borderRadius: '20px', padding: '30px' }}>
                            <h3 style={{ color: '#fff', margin: '0 0 20px 0', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
                                🎯 OBJETIVOS Q1-2025 (LIVE TRACKING)
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ddd' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #555', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                        <th style={{ padding: '10px' }}>Métrica</th>
                                        <th style={{ padding: '10px' }}>Meta</th>
                                        <th style={{ padding: '10px' }}>Actual</th>
                                        <th style={{ padding: '10px' }}>Delta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { m: 'SATISFACCIÓN (NPS)', t: '90', c: '92', d: '+2', col: 'var(--neon-green)' },
                                        { m: 'MARGEN OPERATIVO', t: '25%', c: '28%', d: '+3%', col: 'var(--neon-green)' },
                                        { m: 'TIEMPO PICKUP', t: '<15m', c: '12m', d: '-3m', col: 'var(--neon-green)' },
                                        { m: 'INCIDENTES SEGURIDAD', t: '0', c: '0', d: '0', col: '#fff' },
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{row.m}</td>
                                            <td style={{ padding: '15px 10px', color: '#aaa' }}>{row.t}</td>
                                            <td style={{ padding: '15px 10px', color: '#fff', fontWeight: 'bold' }}>{row.c}</td>
                                            <td style={{ padding: '15px 10px', color: row.col, fontWeight: 'bold' }}>{row.d}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                {/* ANIMATION STYLES */}
                <style>{`
                    .blink { animation: blinker 2s linear infinite; }
                    @keyframes blinker { 50% { opacity: 0; } }
                `}</style>
            </div>
        )
    },
    {
        id: 12,
        title: "SOLIDEZ TÉCNICA",
        subtitle: "AUDITABLE • SCALABLE • ERROR-FREE",
        bgImage: "https://images.unsplash.com/photo-1558494949-efdeb6bf80d1?auto=format&fit=crop&w=1920&q=80", // Server Room / Code
        content: (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4vh', width: '100%', maxWidth: '1200px', height: '100%', justifyContent: 'center' }}>

                {/* INTRO TEXT */}
                <div style={{ textAlign: 'center', maxWidth: '900px' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#fff', margin: 0 }}>INGENIERÍA DE PRECISIÓN</h2>
                    <p style={{ fontSize: '1.2rem', color: '#aaa', marginTop: '1vh', lineHeight: '1.5' }}>
                        Arquitectura diseñada para resistir el escrutinio técnico más riguroso (EAFIT / Auditores Externos).
                        Cada transacción es inmutable, cada despacho es trazable.
                    </p>
                </div>

                {/* THE 3 TECHNICAL PILLARS */}
                <div style={{ display: 'flex', gap: '30px', width: '100%', justifyContent: 'center', alignItems: 'stretch' }}>

                    {/* PILLAR 1: ZERO-TRUST */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '🔒',
                            title: 'ZERO-TRUST SECURITY',
                            desc: 'Validación Criptográfica.',
                            detail: 'Ningún componente confía ciegamente en otro. Cada "Handshake" entre Agentes (Pricing -> Finance -> Dispatch) está firmado criptográficamente (SHA-256). Si un dato es alterado, la cadena se rompe y bloquea la operación preventivamente.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', padding: '3vh', borderRadius: '20px', border: '1px solid #00F0FF', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>🔒</div>
                            <h3 style={{ color: '#00F0FF', fontSize: '1.5rem', marginBottom: '1vh' }}>ZERO-TRUST</h3>
                            <p style={{ ...textStyle, fontSize: '1.1rem' }}>Arquitectura de seguridad paranoica. Nada pasa sin firma digital.</p>
                        </div>
                        <small style={{ color: '#00F0FF', marginTop: '2vh', fontWeight: 'bold' }}>[ VER PROTOCOLO ]</small>
                    </div>

                    {/* PILLAR 2: IMMUTABLE AUDIT */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '📜',
                            title: 'AUDITORÍA INMUTABLE',
                            desc: 'Logs indestructibles.',
                            detail: 'Superamos el "Excel manipulable". Nuestro sistema genera logs de auditoría secuenciales que no pueden ser borrados ni modificados por administradores. Ideal para Due Diligence y Revisiones Fiscales automatizadas.'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', padding: '3vh', borderRadius: '20px', border: '1px solid gold', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>📜</div>
                            <h3 style={{ color: 'gold', fontSize: '1.5rem', marginBottom: '1vh' }}>TRAZABILIDAD</h3>
                            <p style={{ ...textStyle, fontSize: '1.1rem' }}>Logs inmutables para compliance financiero y legal.</p>
                        </div>
                        <small style={{ color: 'gold', marginTop: '2vh', fontWeight: 'bold' }}>[ VER LOGS ]</small>
                    </div>

                    {/* PILLAR 3: ELASTIC SCALE */}
                    <div
                        className="card-hover"
                        onClick={() => handleCardClick({
                            icon: '⚡',
                            title: 'ESCALA ELÁSTICA',
                            desc: 'Microservicios Serverless.',
                            detail: 'Infraestructura "Stateless" que crece con la demanda. Si pasamos de 100 a 10,000 viajes/hora, el sistema instancia nuevos "Agentes Fantasma" automáticamente. Cero caídas, latencia mínima garantizada (<50ms).'
                        })}
                        style={{ cursor: 'pointer', flex: 1, background: 'rgba(0,0,0,0.6)', padding: '3vh', borderRadius: '20px', border: '1px solid var(--neon-green)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1vh' }}>⚡</div>
                            <h3 style={{ color: 'var(--neon-green)', fontSize: '1.5rem', marginBottom: '1vh' }}>LATENCIA 0</h3>
                            <p style={{ ...textStyle, fontSize: '1.1rem' }}>Arquitectura Serverless lista para escalar a millones.</p>
                        </div>
                        <small style={{ color: 'var(--neon-green)', marginTop: '2vh', fontWeight: 'bold' }}>[ VER MÉTRICAS ]</small>
                    </div>

                </div>

                <button
                    onClick={onStartDemo}
                    style={{
                        marginTop: '4vh',
                        background: 'var(--neon-green)', color: '#000', border: 'none',
                        padding: '1.5vh 3vw', fontSize: '1.2rem', fontWeight: 'bold',
                        borderRadius: '50px', cursor: 'pointer', boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)',
                        transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                    <span>🎬</span> INICIAR DEMOSTRACIÓN
                </button>
            </div>
        )
    }
];
