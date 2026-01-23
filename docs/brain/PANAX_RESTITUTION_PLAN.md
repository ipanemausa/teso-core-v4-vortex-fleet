# PLAN DE REESTRUCTURACIÓN TESO: ARQUITECTURA "PANAX" + RAG ERP

Este documento detalla el plan para reestructurar la aplicación Teso siguiendo los principios de arquitectura limpia y modularidad observados en plataformas de tesorería líderes como Panax, reintegrando la capacidad crítica de **ERP RAG (Retrieval-Augmented Generation)**.

## 1. Misión: Recuperación de Facultades
El objetivo es descentralizar el código monolítico actual (`App.jsx`) y crear módulos especializados que operen de forma independiente pero integrada, simulando un entorno de "Enterprise Resource Planning" (ERP) real conectado a una IA.

## 2. Nueva Estructura de Directorios (Propuesta)

La aplicación pasará de un script gigante a una arquitectura de **Dominios**:

```text
src/
├── modules/               <-- NUEVO: Núcleo de la lógica de negocio
│   ├── treasury/          <-- Lógica financiera estilo Panax
│   │   ├── CashFlowEngine.js
│   │   ├── LiquidityManager.js
│   │   └── BankingConnector.js (Simulado)
│   ├── simulation/        <-- Motor de simulación operativa (Logística)
│   │   ├── TrafficController.js
│   │   └── FleetManager.js
│   └── rag_erp/           <-- "EL CEREBRO": Sistema RAG
│       ├── ErpRagCore.js  <-- Motor de consultas
│       ├── VectorDbMock.js <-- Base de conocimientos simulada
│       └── QueryParser.js
├── components/            <-- Componentes UI Visuales (sin lógica compleja)
│   ├── dashboard/
│   ├── maps/
│   └── console/
└── services/              <-- Conexiones externas (API wrappers)
```

## 3. Detalle del Módulo: ERP RAG (El "Cerebro" Perdido)

Esta es la prioridad inmediata. Implementaremos un sistema que intercepte comandos en lenguaje natural y "consulte" la base de datos simulada de la tesorería.

**Flujo de Trabajo del RAG:**
1.  **Input:** User pregunta "¿Cuál es el flujo de caja proyectado para la próxima semana?"
2.  **Retrieval (Recuperación):** El sistema busca en `CashFlowEngine` los datos relevantes.
3.  **Augmentation (Aumentación):** Combina la pregunta con los datos crudos.
4.  **Generation (Generación):** Genera una respuesta natural (e.g., "Basado en las cuentas por cobrar de EAFIT y FlyEmirates, proyectamos +$50M").

## 4. Ejecución Inmediata
1.  Crear carpeta `src/modules/rag_erp`.
2.  Implementar `ErpRagCore.js` con capacidades básicas de consulta financiera.
3.  Conectar este módulo a la consola de la UI actual para restaurar la "facultad".

---
*Documento generado por Antigravity - 2025*
