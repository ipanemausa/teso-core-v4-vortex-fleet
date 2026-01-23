import { runSimulation } from './src/utils/simulationEngine.js';

console.log("Running simulation verification...");
try {
    const data = runSimulation({ DAYS_TO_SIMULATE: 180 });
    console.log("Simulation finished.");
    console.log(`Services Generated: ${data.services.length}`);
    console.log(`Days Simulated: ${data.simulationMetadata.config.DAYS_TO_SIMULATE}`);
    console.log(`Financial Revenue: ${data.financialSummary.totalRevenue}`);

    if (data.services.length === 0) {
        console.error("FAIL: No services generated.");
        process.exit(1);
    }
    if (data.simulationMetadata.config.DAYS_TO_SIMULATE !== 180) {
        console.error("FAIL: Incorrect days count.");
        process.exit(1);
    }
    console.log("SUCCESS: Simulation Engine V2 is operational.");
} catch (e) {
    console.error("CRASH:", e);
    process.exit(1);
}
