# ARQUITECTURA DE DATOS: MODELO DE TESORERÍA "PANAX-STYLE" PARA COLOMBIA

Este documento define la estructura de datos agnóstica necesaria para replicar el modelo de "Gestión Financiera en Tiempo Real" (como Panax) para cualquier empresa en Colombia (Restaurantes, Joyerías, Servicios), cumpliendo con la normativa DIAN y bancaria local.

---

## 1. ESQUEMA DE BASES DE DATOS (Relational & NoSQL)

El núcleo del sistema no es solo registrar gastos, sino **CONCILIAR** y **PREDECIR**.

### A. MÓDULO BANCARIO ("Bank Core")
Conexión con APIs bancarias (Bancolombia, Davivienda) o lectura de extractos.
*   **`transactions_bank`**
    *   `id` (UUID)
    *   `bank_account_id` (Relación cuenta)
    *   `transaction_date` (Timestamp)
    *   `amount` (Decimal)
    *   `direction` (INFLOW/OUTFLOW)
    *   `description_raw` (Texto original del banco: "COMPRA POS 231...")
    *   `merchant_normalized` (Normalizado por IA: "Makro")
    *   `category_ai` (Categorizado por IA: "Insumos/Vegetales")
    *   `status` (PENDING, RECONCILED)

### B. MÓDULO ERP / FACTURACIÓN ("Invoice Core")
Conexión con DIAN (Facturación Electrónica).
*   **`invoices_dian`**
    *   `cufe` (ID único DIAN)
    *   `issuer_nit` (NIT Emisor)
    *   `payment_status` (PAID/UNPAID/PARTIAL)

### C. MÓDULO DELIVERY APPS (El Dolor de Muncher)
Este es el conciliador crítico. Cruza la venta bruta vs. lo que realmente pagan las apps.
*   **`delivery_payouts`**
    *   `platform_name` (Rappi, UberEats, Didi)
    *   `order_id` (ID Pedido)
    *   `sale_gross` (Venta Bruta Platos)
    *   `commission_fee` (Comisión Plataforma -30%)
    *   `tax_retention` (Retenciones)
    *   `net_deposit` (Lo que entra al banco)
    *   `dispute_status` (Si hubo devoluciones/cancelaciones)

### D. MÓDULO OPERATIVO ("Business Logic")
Datos específicos del negocio (Ej: Restaurante).
*   **`daily_sales_pos`** (Ventas diarias por punto físico)
    *   `pos_id`
    *   `date`
    *   `total_sales`
    *   `cash_amount` (Efectivo en caja)
    *   `card_amount` (Tarjetas - Se cruza con Banco)
    *   `tips_amount` (Propinas)

---

## 2. EL "BRAZO ARMADO": MOTORES DE IA (RAG)

Para que el sistema sea inteligente y no un simple Excel, necesitamos estos modelos:

### A. MOTOR DE CONCILIACIÓN (The Matcher)
*   **Input:** Extracto Bancario vs. Facturas DIAN vs. Cierre POS.
*   **Lógica:** "Si veo un ingreso de $100.000 en Banco y una venta POS de $100.000 (menos comisión), entonces -> `MATCH`".
*   **Output:** `reconciliation_score` (Confianza del cruce).

### B. MOTOR DE FLUJO DE CAJA (The Prophet)
*   **Input:** Cuentas por Pagar (Vencimientos DIAN) + Histórico de Ventas.
*   **Lógica:** "¿Tendré dinero el viernes para pagar la nómina según la venta promedio de los martes?"
*   **Salida:** Alerta de Liquidez ("Peligro: Déficit proyectado en 4 días").

---

## 3. ARCHIVOS Y REPORTES CLAVE (Output para Gerencia)

El sistema debe generar automáticamente lo que hoy hacen 3 contadores:

1.  **`CASH_FLOW_DIARIO.json` / `.pdf`:**
    *   Saldo Inicial (Bancos + Caja)
    *   (+) Ventas del Día (Conciliadas)
    *   (-) Pagos Realizados
    *   (=) Saldo Disponible REAL (No contable, sino de liquidez).

2.  **`P_L_TIEMPO_REAL.pdf` (Estado de Resultados):**
    *   Ventas vs. Costo de Venta (Food Cost) en vivo.
    *   Margen Bruto diario.

3.  **`ALERTA_FRAUDE.msg`:**
    *   "Se detectó un pago a proveedor no registrado en DIAN."
    *   "La caja menor reporta $50k pero el arqueo dice $40k."

---

## 4. ESTRATEGIA DE ESCALAMIENTO (El "SaaS" Colombiano)

Al tener esta estructura estandarizada, podemos conectar cualquier empresa:

*   **Paso 1 (Ingesta):** Subir extractos bancarios + Token DIAN.
*   **Paso 2 (Procesamiento):** La IA clasifica todo (Luz, Arriendo, Insumos).
*   **Paso 3 (Visualización):** Dashboard tipo Teso ("Videojuego Financiero").

**Conclusión:**
La base de datos central es un **"Ledger Universal"** (Libro Mayor) que cruza:
`LO QUE TENGO (Bancos)` vs `LO QUE DEBO (DIAN)` vs `LO QUE VENDO (POS)`.

Ese es el Santo Grial de la administración moderna.
