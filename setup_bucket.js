import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function setupSimple() {
    console.log('Attempting to create bucket "products"...');
    const { data, error } = await supabase.storage.createBucket('products', {
        public: true
    });

    if (error) {
        console.error('Error creating bucket (might already exist or permission denied):', error);
    } else {
        console.log('Bucket created:', data);
    }
}

setupSimple();
