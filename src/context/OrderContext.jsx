import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
            *,
            items:order_items(
                *,
                product:products(image)
            )
          `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                } else {
                    setOrders(data || []);
                }
            };
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [user]);

    const addOrder = async (orderData) => {
        if (!user) return;

        try {
            // 1. Insert into orders table
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total: orderData.total,
                    status: 'Processing',
                    shipping_address: orderData.shippingAddress
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Insert into order_items table
            const itemsToInsert = orderData.items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            // 3. Update local state
            // We need to match the structure of the fetched data (with product relation)
            const itemsForState = orderData.items.map((item, index) => ({
                ...itemsToInsert[index],
                product: { image: item.image }
            }));

            const newOrder = {
                ...order,
                items: itemsForState
            };

            setOrders(prev => [newOrder, ...prev]);
            return newOrder;

        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
