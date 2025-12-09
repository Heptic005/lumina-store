import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-background min-h-screen">
                <h2 className="text-2xl font-bold text-primary mb-4">Keranjang Belanja Kosong</h2>
                <p className="text-secondary mb-8">Anda belum menambahkan produk apapun.</p>
                <Link to="/products" className="inline-block bg-accent text-background px-8 py-3 rounded-full font-semibold hover:bg-accent/80 transition-colors">
                    Mulai Belanja
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
            <h1 className="text-3xl font-bold text-primary mb-8">Keranjang Belanja</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-6 p-6 bg-surface rounded-2xl border border-white/5 shadow-sm">
                            <div className="w-24 h-24 bg-background rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-primary text-lg">{item.name}</h3>
                                        <p className="text-secondary text-sm">{item.category}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-secondary hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/5">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 hover:bg-white/10 text-primary rounded-md transition-colors disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-medium text-primary w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 hover:bg-white/10 text-primary rounded-md transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="font-bold text-lg text-primary">
                                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm sticky top-24">
                        <h3 className="font-bold text-xl text-primary mb-6">Ringkasan Belanja</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-secondary">
                                <span>Total Harga</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Ongkos Kirim</span>
                                <span className="text-green-500 font-medium">Gratis</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg text-primary">
                                <span>Total Bayar</span>
                                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            className="w-full bg-accent text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20"
                        >
                            Checkout <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
