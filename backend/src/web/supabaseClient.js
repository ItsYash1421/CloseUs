const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Using the key provided in .env (which is the secret key)

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
