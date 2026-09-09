const SUPABASE_URL = "https://xiqulvndqnkgctsnpmrw.supabase.co";
const SUPABASE_KEY = "sb_publishable_f56veAlSzxeML997gmnk5g_KHnL9PbF";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function testDatabase() {
    const { data, error } = await db
        .from("recipes")
        .select("*");

    if (error) {
        console.error("Supabase-feil:", error);
    } else {
        console.log("Oppskrifter fra Supabase:", data);
    }
}

testDatabase();