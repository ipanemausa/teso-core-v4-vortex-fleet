export const logAuditEvent = async (user, action, details) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                action,
                details
            })
        });
        console.log(`[AUDIT] Logged: ${action}`);
    } catch (err) {
        console.warn("[AUDIT] Failed to log event", err);
    }
};
