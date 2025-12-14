import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Package, Truck, MapPin, User, Calendar, CreditCard, Save } from 'lucide-react';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            // Fetch Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();

            if (orderError) throw orderError;
            setOrder(orderData);
            setStatus(orderData.status);

            // Fetch Order Items
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', id);

            if (itemsError) throw itemsError;
            setOrderItems(itemsData);

        } catch (error) {
            console.error('Error fetching order details:', error);
            alert('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            alert('Order status updated successfully');
            setOrder(prev => ({ ...prev, status }));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-secondary">Order not found.</div>;

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/admin/orders" className="p-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
                        Order #{order.id.slice(0, 8)}
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                    order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        order.status === 'Return Requested' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            order.status === 'Returned' ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-secondary text-sm flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        Placed on {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Package className="text-accent" size={20} />
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-white/5">
                                    <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                                        {/* Placeholder for item image if available */}
                                        <Package className="text-secondary" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-primary">{item.product_name}</h3>
                                        <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary">Rp {item.price.toLocaleString('id-ID')}</div>
                                        <div className="text-xs text-secondary">Total: Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-secondary">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Truck className="text-accent" size={20} />
                            Update Status
                        </h2>
                        <div className="flex gap-4">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                            >
                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned', 'Return Rejected'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updating || status === order.status}
                                className="px-6 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Save size={18} />
                                {updating ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <User className="text-accent" size={20} />
                            Customer
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-secondary">Name</div>
                                <div className="font-medium text-primary">
                                    {order.shipping_address ? `${order.shipping_address.firstName} ${order.shipping_address.lastName}` : 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Email</div>
                                <div className="font-medium text-primary">{order.user?.email || 'Email hidden'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Phone</div>
                                <div className="font-medium text-primary">{order.shipping_address?.phone || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <MapPin className="text-accent" size={20} />
                            Shipping Address
                        </h2>
                        {order.shipping_address ? (
                            <div className="space-y-1 text-sm text-secondary">
                                <p className="text-primary font-medium">{order.shipping_address.fullName}</p>
                                <p>{order.shipping_address.address}</p>
                                <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                                <p>{order.shipping_address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-secondary italic">No shipping address provided.</p>
                        )}
                    </div>

                    {/* Payment Info (Placeholder) */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <CreditCard className="text-accent" size={20} />
                            Payment
                        </h2>
                        <div className="flex justify-between items-center">
                            <span className="text-secondary">Method</span>
                            <span className="font-medium text-primary">Credit Card</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-secondary">Status</span>
                            <span className="text-green-500 font-bold text-sm">PAID</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
