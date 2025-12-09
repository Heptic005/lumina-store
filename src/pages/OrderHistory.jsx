import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

const OrderHistory = () => {
    const { orders } = useOrder();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

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
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
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
                                                <img src={item.image || "https://via.placeholder.com/150"} alt={item.product_name} className="w-full h-full object-cover opacity-80" />
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

                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                                    <div className="text-sm text-secondary">
                                        Total Pembayaran
                                    </div>
                                    <div className="text-xl font-bold text-accent">
                                        Rp {order.total.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
