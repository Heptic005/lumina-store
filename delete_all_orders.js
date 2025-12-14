import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function deleteAllOrders() {
    console.log('🗑️  Starting to delete all orders...\n');

    try {
        // 1. Delete all order_items first (foreign key constraint)
        console.log('Step 1: Deleting all order items...');
        const { error: itemsError, count: itemsCount } = await supabase
            .from('order_items')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (itemsError) {
            console.error('❌ Error deleting order_items:', itemsError);
            return;
        }
        console.log(`✅ Deleted ${itemsCount || 'all'} order items\n`);

        // 2. Delete all orders
        console.log('Step 2: Deleting all orders...');
        const { error: ordersError, count: ordersCount } = await supabase
            .from('orders')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (ordersError) {
            console.error('❌ Error deleting orders:', ordersError);
            return;
        }
        console.log(`✅ Deleted ${ordersCount || 'all'} orders\n`);

        console.log('🎉 All orders and order items have been deleted!');
        console.log('💡 Now you can:');
        console.log('   1. Clear your browser localStorage (run clear_cart.js in console)');
        console.log('   2. Start fresh with new orders using valid products');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

deleteAllOrders();
