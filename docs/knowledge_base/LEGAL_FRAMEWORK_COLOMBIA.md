# MARCO LEGAL Y TRIBUTARIO (COLOMBIA 2026)
> **Uso:** Base de Conocimiento para `@AnalystTESO` y `@GuardianTESO`.
> **Fuente:** Normativa vigente MinTransporte y DIAN.

---

## 1. NORMATIVA DE TRANSPORTE (MinTransporte)

### A. Documentación Obligatoria (Bloqueo de Despacho)
El Agente `@Dispatch` NO puede asignar viaje si falta:
1.  **SOAT:** Vigente (Renovación anual).
2.  **RTM:** Revisión Técnico Mecánica (Anual > 6 años antigüedad, Bianual < 6).
3.  **Tarjeta de Operación:** Vinculada a empresa de Transporte Especial legalmente constituida.
4.  **Pólizas RCE y RCC:** Responsabilidad Civil Contractual y Extracontractual (D.U.R. 1079 de 2015).
    *   *Regla:* La póliza debe cubrir al 100% de pasajeros.

### B. FUEC (Formulario Único de Extracto de Contrato)
*   Todo servicio "Especial" debe portar el FUEC digital o físico.
*   **Acción del Agente:** Generar PDF del FUEC automáticamente al crear el viaje.

---

## 2. REGULACIÓN TRIBUTARIA (DIAN)

### A. Facturación Electrónica (Sistema RADIAN)
*   **Obligatoriedad:** Toda transacción > 5 UVT debe ser facturada electrónicamente.
*   **IVA (Impuesto al Valor Agregado):**
    *   Servicio de Transporte Público de Pasajeros: **EXCLUIDO de IVA** (Art. 476 ET).
    *   *Ojo:* Si cobramos "Comisión por uso de plataforma" (SaaS), esa comisión **SÍ lleva IVA del 19%**.
*   **Retención en la Fuente:**
    *   Aplicar Retefuente por Servicios (generalmente 4% o 1% según base gravable) a proveedores (conductores propietarios).

### B. Seguridad Social de Conductores
*   El sistema debe exigir prueba de pago de **Seguridad Social (Planilla PILA)** vigente mes a mes.
*   *Riesgo Legal:* Solidaridad laboral si el conductor se accidenta sin ARL.

---

## 3. CHECKLIST DE VALIDACIÓN AUTOMÁTICA
Antes de cualquier despacho, `@Guardian` ejecuta:
1.  ¿SOAT Expirado? -> **BLOQUEAR**.
2.  ¿Conductor sin ARL este mes? -> **BLOQUEAR**.
3.  ¿FUEC Generado? -> **PERMITIR**.

> *Nota Legal:* Los valores de UVT y porcentajes de Retención se actualizan anualmente. `@Analyst` debe leer la tabla `finance_params.json` actualizada al 2026.
