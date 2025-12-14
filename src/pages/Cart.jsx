import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            // Fetch 4 random products as recommendations
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(4);

            if (!error && data) {
                setRecommendedProducts(data);
            }
        };

        fetchRecommendations();
    }, []);

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">Keranjang Belanja Kosong</h2>
                <p className="text-secondary mb-8 max-w-md">Sepertinya Anda belum menambahkan produk apapun. Jelajahi koleksi kami dan temukan produk impian Anda.</p>
                <Link to="/products" className="inline-flex items-center gap-2 bg-accent text-background px-8 py-3 rounded-xl font-bold hover:bg-accent/80 transition-colors">
                    Mulai Belanja <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    const shippingCost = 22500; // Fixed shipping cost for demo
    const discount = 111870; // Fixed discount for demo
    const grandTotal = totalPrice + shippingCost - discount;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 bg-background min-h-screen">
            {/* Stepper */}
            <div className="flex justify-center mb-16">
                <div className="flex items-center w-full max-w-2xl">
                    {/* Step 1: Cart (Active) */}
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-14 h-14 rounded-full bg-background border-2 border-accent text-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="text-accent font-bold mt-3 text-sm tracking-wide uppercase">Cart</span>
                    </div>

                    {/* Connector 1 */}
                    <div className="flex-1 h-[2px] bg-white/10 -mx-4 mb-6"></div>

                    {/* Step 2: Checkout (Inactive) */}
                    <div className="flex flex-col items-center relative z-10 opacity-60">
                        <div className="w-14 h-14 rounded-full bg-surface text-white flex items-center justify-center border border-white/5">
                            <Truck className="w-6 h-6" />
                        </div>
                        <span className="text-secondary font-medium mt-3 text-sm tracking-wide uppercase">Checkout</span>
                    </div>

                    {/* Connector 2 */}
                    <div className="flex-1 h-[2px] bg-white/10 -mx-4 mb-6"></div>

                    {/* Step 3: Payment (Inactive) */}
                    <div className="flex flex-col items-center relative z-10 opacity-60">
                        <div className="w-14 h-14 rounded-full bg-surface text-white flex items-center justify-center border border-white/5">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="text-secondary font-medium mt-3 text-sm tracking-wide uppercase">Payment</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-surface rounded-2xl border border-white/5 shadow-sm hover:border-white/10 transition-colors group">
                            <div className="w-full sm:w-32 h-32 bg-background rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-primary text-xl mb-1">{item.name}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            {item.selectedVariants?.Color && (
                                                <div className="flex items-center gap-1 text-xs text-secondary bg-white/5 px-2 py-1 rounded-md">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedVariants.Color.hex }}></div>
                                                    {item.selectedVariants.Color.name}
                                                </div>
                                            )}
                                            {item.selectedVariants?.Storage && (
                                                <div className="text-xs text-secondary bg-white/5 px-2 py-1 rounded-md">
                                                    {item.selectedVariants.Storage.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs text-secondary">
                                            <div className="flex items-center gap-1 text-blue-400">
                                                <Truck className="w-3 h-3" /> Free Delivery
                                            </div>
                                            <div className="flex items-center gap-1 text-green-400">
                                                <ShieldCheck className="w-3 h-3" /> Guaranteed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-secondary line-through mb-1">
                                            Rp {(item.price * 1.2).toLocaleString('id-ID')}
                                        </div>
                                        <div className="font-bold text-lg text-primary">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center gap-3 bg-background rounded-xl p-1 border border-white/5">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-secondary hover:text-primary rounded-lg transition-colors disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-primary w-8 text-center text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-secondary hover:text-primary rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm sticky top-24">
                        <h3 className="font-bold text-xl text-primary mb-6">Payment Details</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-secondary text-sm">
                                <span>Subtotal</span>
                                <span className="font-medium text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-secondary text-sm">
                                <span>Discount</span>
                                <span className="font-medium text-red-400">-Rp {discount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-secondary text-sm">
                                <span>Shipment Cost</span>
                                <span className="font-medium text-primary">Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                                <span className="font-bold text-primary">Grand Total</span>
                                <span className="font-bold text-2xl text-primary">Rp {grandTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            className="w-full bg-accent text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20 active:scale-95 transform duration-200"
                        >
                            Proceed to checkout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {recommendedProducts.length > 0 && (
                <div className="mt-20">
                    <h2 className="text-xl font-bold text-primary mb-8">Customers who viewed items in your browsing history also viewed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedProducts.map((product) => (
                            <Link key={product.id} to={`/products/${product.id}`} className="group bg-surface rounded-2xl border border-white/5 overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
                                <div className="relative aspect-square bg-background p-6 flex items-center justify-center">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-primary mb-1 truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-bold text-accent">Rp {product.price.toLocaleString('id-ID')}</span>
                                        <div className="flex text-yellow-500 text-xs gap-1 items-center">
                                            <span className="font-bold">4.8</span> <CheckCircle className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
