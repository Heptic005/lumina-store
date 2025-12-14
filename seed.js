import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runCleanup() {
    const keepIds = [
        '6c816ba4-3f82-4075-bdb2-e13b645dda40', // Watch GT (Must keep)
        'f27c65e8-f73e-409a-b4a5-532e093fa512', // X1 Pro
        'f2097950-9b36-4669-b547-1e71ea9493db', // Air 5
        '1feb8c5e-020b-44ab-9a60-92dd03dd85ab', // Case Ultra
        'adfbe16e-ecaa-4b00-8808-8801e36b9c8e', // Pad 11
        '15cabb99-19ee-4ae1-9537-71f7cb1b9bf4', // Buds Pro
        '4e80b762-d3f8-4744-acde-8af3af88ccd9', // X1
        '964fbca0-af87-4ff7-ae38-76fe728282aa'  // Air 5 Pro
    ];

    console.log('Keeping IDs:', keepIds);

    // Fetch all IDs first
    const { data: allProducts, error: fetchError } = await supabase.from('products').select('id');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    const allIds = allProducts.map(p => p.id);
    const idsToDelete = allIds.filter(id => !keepIds.includes(id));

    console.log(`Found ${allIds.length} products. Deleting ${idsToDelete.length} duplicates...`);

    if (idsToDelete.length > 0) {
        const { error } = await supabase
            .from('products')
            .delete()
            .in('id', idsToDelete);

        if (error) {
            console.error('Error deleting:', error);
        } else {
            console.log('Successfully deleted duplicates.');
        }
    } else {
        console.log('No duplicates to delete.');
    }
}

runCleanup();
