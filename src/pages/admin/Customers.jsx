import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Fetch all orders to aggregate customer data
            // In a real app with many users, this should be a dedicated 'profiles' table fetch
            // or a server-side aggregation. For now, client-side aggregation is fine.
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Aggregate data
            const customerMap = new Map();

            orders.forEach(order => {
                // Use user_id as key if available, otherwise fallback to phone or name
                // This is a heuristic since we don't have direct access to auth.users list
                const key = order.user_id || order.shipping_address?.phone || `${order.shipping_address?.firstName}-${order.shipping_address?.lastName}`;

                if (!key) return;

                if (!customerMap.has(key)) {
                    customerMap.set(key, {
                        id: key,
                        firstName: order.shipping_address?.firstName || 'Unknown',
                        lastName: order.shipping_address?.lastName || '',
                        email: order.shipping_address?.email || 'N/A', // Assuming email might be here or we can't get it
                        phone: order.shipping_address?.phone || 'N/A',
                        city: order.shipping_address?.city || 'N/A',
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrderDate: order.created_at,
                        orders: []
                    });
                }

                const customer = customerMap.get(key);
                customer.totalOrders += 1;
                customer.totalSpent += order.total || 0;
                customer.orders.push(order);
                // Keep earliest date? No, we want last order date. 
                // Since we iterate desc, the first one found is the last one.
                // Actually, let's just compare to be safe.
                if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
                    customer.lastOrderDate = order.created_at;
                }
            });

            setCustomers(Array.from(customerMap.values()));

        } catch (error) {
            console.error('Error fetching customers:', error);
            // alert('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    // Filter by search term
    const filteredCustomers = customers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    // Pagination
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-primary">Customers</h1>
                <p className="text-secondary text-sm">View and manage your customer base</p>
            </div>

            {/* Search */}
            <div className="bg-surface border border-white/5 p-4 rounded-2xl">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
                    />
                </div>
            </div>

            {/* Customers List */}
            {loading ? (
                <div className="text-center py-12 text-secondary">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-12 text-secondary bg-surface rounded-2xl border border-white/5">
                    No customers found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedCustomers.map((customer) => (
                        <div key={customer.id} className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-accent/50 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg group-hover:scale-110 transition-transform">
                                        {customer.firstName[0]}{customer.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary">{customer.firstName} {customer.lastName}</h3>
                                        <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                                            <MapPin size={12} />
                                            {customer.city}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-secondary">
                                    <Mail size={16} className="text-accent/70" />
                                    <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-secondary">
                                    <Phone size={16} className="text-accent/70" />
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-secondary">
                                    <Calendar size={16} className="text-accent/70" />
                                    <span>Last Order: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-background rounded-xl">
                                    <div className="text-xs text-secondary mb-1">Total Orders</div>
                                    <div className="font-bold text-primary text-lg">{customer.totalOrders}</div>
                                </div>
                                <div className="text-center p-3 bg-background rounded-xl">
                                    <div className="text-xs text-secondary mb-1">Total Spent</div>
                                    <div className="font-bold text-accent text-lg">
                                        Rp {(customer.totalSpent / 1000000).toFixed(1)}M
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg bg-surface border border-white/10 text-secondary hover:text-primary disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-secondary">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg bg-surface border border-white/10 text-secondary hover:text-primary disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Customers;
