import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const { addOrder } = useOrder();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Redirect if not logged in
    if (!user) {
        // You might want to use useEffect for this to avoid render issues, 
        // but for now let's just show a message or redirect.
        // Better to handle this in useEffect or return a redirect component.
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            addOrder({
                items: cart,
                total: totalPrice,
                shippingAddress: {
                    // In a real app, capture form data here
                    firstName: e.target[0].value,
                    lastName: e.target[1].value,
                    address: e.target[2].value,
                    city: e.target[3].value,
                    zipCode: e.target[4].value,
                },
                paymentMethod: 'Virtual Account' // Simplified
            });

            setLoading(false);
            setSuccess(true);
            clearCart();
        }, 2000);
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-background">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">Pembayaran Berhasil!</h2>
                <p className="text-secondary mb-8 max-w-md">
                    Terima kasih telah berbelanja di Lumina. Pesanan Anda sedang diproses dan akan segera dikirim.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-accent text-background px-8 py-3 rounded-full font-semibold hover:bg-accent/80 transition-colors"
                >
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
            <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm">
                            <h3 className="font-bold text-xl text-primary mb-6">Informasi Pengiriman</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary">Nama Depan</label>
                                    <input required type="text" className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary">Nama Belakang</label>
                                    <input required type="text" className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:outline-none" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-secondary">Alamat Lengkap</label>
                                    <textarea required rows="3" className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:outline-none"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary">Kota</label>
                                    <input required type="text" className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary">Kode Pos</label>
                                    <input required type="text" className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg text-primary focus:ring-2 focus:ring-accent focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm">
                            <h3 className="font-bold text-xl text-primary mb-6">Metode Pembayaran</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-4 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-accent transition-colors">
                                    <input type="radio" name="payment" className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10" defaultChecked />
                                    <span className="font-medium text-primary">Transfer Bank (Virtual Account)</span>
                                </label>
                                <label className="flex items-center gap-4 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-accent transition-colors">
                                    <input type="radio" name="payment" className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10" />
                                    <span className="font-medium text-primary">Kartu Kredit / Debit</span>
                                </label>
                                <label className="flex items-center gap-4 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-accent transition-colors">
                                    <input type="radio" name="payment" className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10" />
                                    <span className="font-medium text-primary">Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-background py-4 rounded-xl font-bold text-lg hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memproses...' : `Bayar Rp ${totalPrice.toLocaleString('id-ID')}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-surface p-8 rounded-2xl border border-white/5 sticky top-24">
                        <h3 className="font-bold text-xl text-primary mb-6">Ringkasan Pesanan</h3>
                        <div className="space-y-4 mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-background rounded-lg overflow-hidden border border-white/5">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                                        <p className="text-secondary text-xs">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="font-bold text-primary text-sm">
                                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-4 space-y-2">
                            <div className="flex justify-between text-secondary">
                                <span>Subtotal</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Ongkos Kirim</span>
                                <span className="text-green-500 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-primary pt-2">
                                <span>Total</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
