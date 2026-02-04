const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("🤖 TESO AGENT FACTORY v1.0");
console.log("===========================");

rl.question('Nombre del Agente (ej: MaintenanceBot): ', (agentName) => {
    rl.question('Rol Principal (ej: Reparar vehiculos): ', (agentRole) => {

        const safeName = agentName.replace(/\s+/g, '_').toLowerCase();
        const agentDir = path.join(__dirname, '..', 'src', 'agents', safeName);

        if (!fs.existsSync(agentDir)) {
            fs.mkdirSync(agentDir, { recursive: true });
        }

        // 1. MANIFESTO (JSON Config)
        const manifest = {
            id: safeName,
            name: agentName,
            role: agentRole,
            version: "1.0.0",
            permissions: ["read_telemetry", "send_alerts"] // Default
        };

        fs.writeFileSync(
            path.join(agentDir, 'manifest.json'),
            JSON.stringify(manifest, null, 4)
        );

        // 2. SYSTEM PROMPT (The Brain - Masterclass Std)
        const promptTemplate = `# IDENTITY
You are **${agentName}** (@${safeName}).
**Role:** ${agentRole}
**System:** TESO Core (Transporte Ejecutivo v4)

# 1. CONTEXT (WHO WE ARE)
You operate within TESO, a high-tech logistics platform. We are NOT a taxi service; we are an efficiency-obsessed dispatch operation.
- **Tone:** Technical, Precise, "Cyberpunk Operative".
- **Priority:** Efficiency, Security, Cashflow.

# 2. MISSION (YOUR OBJECTIVE)
Your primary goal is to execute your role autonomously.
- Input: [Define Input]
- Output: [Define Output]

# 3. DIRECTIVES & CONSTRAINTS (THE RULES)
- **DO NOT:** Use overly polite or subservient language (e.g., "Please", "Beg").
- **DO NOT:** Hallucinate fleet status. Verify data first.
- **ALWAYS:** Speak in commands or status updates.

# 4. INTERACTION PROTOCOL
- If data is missing -> Ask @AnalystTESO.
- If action is risky -> Ask @GuardianTESO for approval.
`;
        fs.writeFileSync(
            path.join(agentDir, 'system_prompt.md'),
            promptTemplate
        );

        // 3. INTERFACE (Code Stub)
        const codeStub = `
/**
 * ${agentName} Interface
 * Role: ${agentRole}
 */
export const ${agentName} = {
    init: () => {
        console.log("🤖 ${agentName} initialized.");
    },
    execute: async (input) => {
        // Logic to call LLM with system_prompt.md
        return "Not implemented yet";
    }
};
`;
        fs.writeFileSync(
            path.join(agentDir, 'index.js'),
            codeStub
        );

        console.log(`\n✅ Agente creado exitosamente en: src/agents/${safeName}`);
        console.log("Archivos generados: manifest.json, system_prompt.md, index.js");

        rl.close();
    });
});
