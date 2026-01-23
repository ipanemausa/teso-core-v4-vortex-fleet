
import { supabase } from '../lib/supabaseClient';
import { PILOT_CLIENT } from '../data/pilotConfig';

// --- FALLBACK GENERATORS (Imported here to keep logic central) ---
// Ideally we import these from a separate file, but for now we'll accept passed generators or move them here?
// To avoid circular deps, we will accept the generator functions as arguments or expect the caller to handle the "fallback" generation if this returns null.


export const fetchOrSeedClients = async (fallbackGenerator) => {
    if (!supabase) return fallbackGenerator();

    try {
        const { data, error } = await supabase.from('clients').select('*').limit(2000);

        if (error) throw error;

        if (data && data.length > 0) {
            console.log(`📦 LOADED: ${data.length} Clients from Supabase.`);
            return data;
        } else {
            console.log('🌱 DB EMPTY: Seeding Clients...');
            const generated = fallbackGenerator();

            // Seed in chunks to avoid payload limits
            const chunkSize = 100;
            for (let i = 0; i < generated.length; i += chunkSize) {
                const chunk = generated.slice(i, i + chunkSize);
                // Simplified schema mapping if necessary
                await supabase.from('clients').insert(chunk).select();
            }
            return generated;
        }
    } catch (err) {
        console.error('⚠️ SYNC ERROR (Clients):', err.message);
        return fallbackGenerator();
    }
};

export const fetchOrSeedOrders = async (fallbackGenerator) => {
    if (!supabase) return fallbackGenerator();

    try {
        const { data, error } = await supabase.from('orders').select('*').limit(500);

        if (error) throw error;

        if (data && data.length > 0) {
            console.log(`📦 LOADED: ${data.length} Orders from Supabase.`);
            return data;
        } else {
            console.log('🌱 DB EMPTY: Seeding Orders...');
            const generated = fallbackGenerator();
            // Only seed a subset to start? No, seed all initial demo orders.
            await supabase.from('orders').insert(generated).select();
            return generated;
        }
    } catch (err) {
        console.error('⚠️ SYNC ERROR (Orders):', err.message);
        return fallbackGenerator();
    }
};
