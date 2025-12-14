import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Search, Filter, Eye, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (statusFilter !== 'All') {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Return Requested': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Returned': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
            case 'Return Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-surface text-secondary border-white/10';
        }
    };

    // Filter by search term
    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shipping_address?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.shipping_address?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Orders</h1>
                    <p className="text-secondary text-sm">Manage and track customer orders</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 bg-surface border border-white/5 p-4 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned', 'Return Rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-accent text-white'
                                : 'bg-background border border-white/10 text-secondary hover:text-primary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-sm font-medium text-secondary">Order ID</th>
                                <th className="p-4 text-sm font-medium text-secondary">Customer</th>
                                <th className="p-4 text-sm font-medium text-secondary">Date</th>
                                <th className="p-4 text-sm font-medium text-secondary">Total</th>
                                <th className="p-4 text-sm font-medium text-secondary">Status</th>
                                <th className="p-4 text-sm font-medium text-secondary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-secondary">Loading orders...</td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-secondary">No orders found.</td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-primary font-mono text-sm">#{order.id.slice(0, 8)}</td>
                                        <td className="p-4">
                                            <div className="text-primary font-medium">
                                                {order.shipping_address ? `${order.shipping_address.firstName} ${order.shipping_address.lastName}` : 'Unknown'}
                                            </div>
                                            <div className="text-xs text-secondary">{order.user?.email || 'Email hidden'}</div>
                                        </td>
                                        <td className="p-4 text-secondary text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-primary font-bold">
                                            Rp {order.total?.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="inline-flex p-2 text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                            >
                                                <Eye size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-sm text-secondary">
                            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-white/10 text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-white/10 text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
