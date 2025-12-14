import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, category, price');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const counts = {};
    data.forEach(p => {
        counts[p.name] = (counts[p.name] || 0) + 1;
    });

    let output = `Total Products: ${data.length}\n`;
    data.forEach(p => {
        output += `${p.id} | ${p.name}\n`;
    });
    fs.writeFileSync('key_products.txt', output);
    console.log('Done writing to key_products.txt');
}

listProducts();
