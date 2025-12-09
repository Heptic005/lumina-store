import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
    {
        name: "Lumina X1 Pro",
        price: 12999000,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Flagship",
        description: "Smartphone flagship dengan kamera AI revolusioner dan performa tanpa batas.",
        stock: 50,
        specs: {
            "Processor": "Lumina A18 Bionic",
            "RAM": "12GB LPDDR5X",
            "Storage": "256GB / 512GB",
            "Camera": "200MP Main + 50MP Ultra-wide",
            "Battery": "5000mAh",
            "Display": "6.8 inch OLED 120Hz"
        }
    },
    {
        name: "Lumina Air 5",
        price: 8499000,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b2191392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Mid-Range",
        description: "Desain ultra-tipis dengan daya tahan baterai sepanjang hari.",
        stock: 100,
        specs: {
            "Processor": "Lumina A17",
            "RAM": "8GB",
            "Storage": "128GB / 256GB",
            "Camera": "64MP Main",
            "Battery": "4500mAh",
            "Display": "6.1 inch OLED 90Hz"
        }
    },
    {
        name: "Lumina Buds Pro",
        price: 1999000,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Accessories",
        description: "TWS dengan Active Noise Cancellation terbaik di kelasnya.",
        stock: 200,
        specs: {
            "Audio": "Active Noise Cancellation",
            "Battery": "Up to 30 hours",
            "Connectivity": "Bluetooth 5.3",
            "Water Resistance": "IPX4"
        }
    },
    {
        name: "Lumina Watch GT",
        price: 3499000,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Accessories",
        description: "Smartwatch elegan dengan fitur pemantauan kesehatan lengkap.",
        stock: 75,
        specs: {
            "Display": "1.4 inch AMOLED",
            "Sensors": "Heart Rate, SpO2, GPS",
            "Battery": "Up to 14 days",
            "Water Resistance": "5 ATM"
        }
    },
    {
        name: "Lumina Pad 11",
        price: 7999000,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Tablet",
        description: "Tablet produktivitas dengan layar 120Hz yang memukau.",
        stock: 30,
        specs: {
            "Processor": "Lumina M1",
            "Display": "11 inch Liquid Retina 120Hz",
            "Storage": "256GB",
            "Battery": "8000mAh"
        }
    },
    {
        name: "Lumina Case Ultra",
        price: 299000,
        image: "https://images.unsplash.com/photo-1603351154351-5cf99bc32f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Accessories",
        description: "Perlindungan maksimal dengan desain minimalis.",
        stock: 500,
        specs: {
            "Material": "Polycarbonate + TPU",
            "Compatibility": "Lumina X1 Pro",
            "Features": "MagSafe Compatible"
        }
    }
];

async function seedProducts() {
    console.log('Seeding products...');

    const { error } = await supabase
        .from('products')
        .insert(products);

    if (error) {
        console.error('Error seeding products:', error);
    } else {
        console.log('Products seeded successfully!');
    }
}

seedProducts();
