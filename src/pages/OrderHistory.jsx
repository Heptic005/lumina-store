import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Package, Calendar, ChevronRight, Truck, X, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const OrderHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items (
                        *,
                        product:products (
                            image,
                            name
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to ensure image structure is consistent
            const processedOrders = data.map(order => ({
                ...order,
                items: order.items.map(item => ({
                    ...item,
                    product_name: item.product?.name || 'Product',
                    image: item.product?.image
                }))
            }));

            setOrders(processedOrders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const handleReturnRequest = async () => {
        if (!selectedOrder) return;

        // Removed confirm to ensure button works
        // const confirmReturn = window.confirm("Apakah Anda yakin ingin mengajukan pengembalian untuk pesanan ini?");
        // if (!confirmReturn) return;

        console.log("Requesting return for:", selectedOrder.id);

        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ status: 'Return Requested' })
                .eq('id', selectedOrder.id)
                .select();

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            console.log("Return requested success:", data);
            alert("Pengajuan pengembalian berhasil dikirim!");

            // Update local state
            setSelectedOrder(prev => ({ ...prev, status: 'Return Requested' }));
            // Refresh orders list check
            window.location.reload();
        } catch (error) {
            console.error('Error requesting return:', error);
            alert(`Gagal mengajukan pengembalian: ${error.message || error.details || 'Unknown error'}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
            <h1 className="text-3xl font-bold text-primary mb-8">Riwayat Pesanan</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-surface rounded-2xl border border-white/5 shadow-sm">
                    <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <ShoppingBag className="w-10 h-10 text-secondary" />
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">Belum ada pesanan</h2>
                    <p className="text-secondary mb-8">Anda belum melakukan transaksi apapun.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-accent text-background px-8 py-3 rounded-full font-semibold hover:bg-accent/80 transition-colors"
                    >
                        Mulai Belanja
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-surface rounded-2xl border border-white/5 shadow-sm overflow-hidden hover:shadow-md hover:shadow-accent/5 transition-shadow">
                            <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                        <Package className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary">No. Pesanan</p>
                                        <p className="font-bold text-primary">{order.id.slice(0, 8)}...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-sm text-secondary flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Tanggal
                                        </p>
                                        <p className="font-medium text-primary">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                                                order.status === 'Return Requested' ? 'bg-orange-500/10 text-orange-500' :
                                                    order.status === 'Returned' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-white/10 text-secondary'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-background rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                                                <img src={item.product?.image || item.image || "https://via.placeholder.com/150"} alt={item.product_name} className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-primary text-sm">{item.product_name}</h4>
                                                <p className="text-secondary text-xs">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="font-bold text-primary text-sm">
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-secondary">Total Pembayaran</p>
                                        <p className="text-xl font-bold text-accent">Rp {order.total.toLocaleString('id-ID')}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="px-6 py-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm font-semibold text-primary"
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-surface z-10">
                            <h2 className="text-xl font-bold text-primary">Detail Pesanan</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full text-secondary hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-secondary mb-1">No. Pesanan</p>
                                    <p className="font-bold text-primary">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary mb-1">Tanggal</p>
                                    <p className="font-medium text-primary">
                                        {new Date(selectedOrder.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedOrder.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                                        selectedOrder.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                                            selectedOrder.status === 'Return Requested' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-white/10 text-secondary'
                                        }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary mb-1">Total</p>
                                    <p className="font-bold text-accent text-lg">Rp {selectedOrder.total.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            {/* Shipping Address (Mockup if not in DB, but usually is) */}
                            {selectedOrder.shipping_address && (
                                <div className="bg-background rounded-xl p-4 border border-white/5">
                                    <p className="text-sm text-secondary mb-2 flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> Alamat Pengiriman
                                    </p>
                                    <p className="text-primary">{selectedOrder.shipping_address.street}</p>
                                    <p className="text-secondary text-sm">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}</p>
                                </div>
                            )}

                            {/* Items List */}
                            <div>
                                <h3 className="font-bold text-primary mb-4">Produk</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-start bg-background p-4 rounded-xl border border-white/5">
                                            <div className="w-20 h-20 bg-surface rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                                                <img src={item.product?.image || item.image || "https://via.placeholder.com/150"} alt={item.product_name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-primary mb-1">{item.product_name}</h4>
                                                <div className="text-sm text-secondary mb-2">
                                                    {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                                                </div>
                                                {selectedOrder.status === 'Delivered' && (
                                                    <button
                                                        onClick={() => navigate(`/products/${item.product_id}?tab=reviews`)}
                                                        className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent/80 transition-colors"
                                                    >
                                                        <MessageSquare className="w-3 h-3" /> Tulis Review
                                                    </button>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-primary">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-between items-center">
                            {selectedOrder.status === 'Delivered' && (
                                <button
                                    onClick={handleReturnRequest}
                                    className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-bold"
                                >
                                    Ajukan Pengembalian
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-surface border border-white/10 rounded-lg hover:bg-white/5 text-primary transition-colors ml-auto"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
