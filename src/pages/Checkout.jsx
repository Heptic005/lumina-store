import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShoppingBag, Truck, CreditCard, ArrowRight, MapPin, User, Mail, Phone, Map, AlertCircle } from 'lucide-react';
import AddressMapModal from '../components/AddressMapModal';

const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const { addOrder } = useOrder();
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Map Modal State
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [saveAddress, setSaveAddress] = useState(true);
    const [addressData, setAddressData] = useState({
        address: '',
        city: '',
        zipCode: '',
        coordinates: null
    });

    // Pre-fill address from user profile
    useState(() => {
        if (user?.user_metadata) {
            setAddressData(prev => ({
                ...prev,
                address: user.user_metadata.address || '',
                city: '', // City might not be in metadata yet, or needs parsing
                zipCode: user.user_metadata.postal_code || ''
            }));
        }
    }, [user]);

    // Redirect if not logged in
    if (!user) {
        // Ideally handled by a protected route wrapper
    }

    const handleMapConfirm = (location) => {
        // Parse address components if available from Nominatim
        // This is a simplified mapping, might need adjustment based on actual API response structure
        const city = location.details?.city || location.details?.town || location.details?.village || location.details?.county || '';
        const zip = location.details?.postcode || '';

        setAddressData({
            address: location.address,
            city: city,
            zipCode: zip,
            coordinates: { lat: location.lat, lng: location.lng }
        });
        setIsMapOpen(false);
    };

    const handleInputChange = (e, field) => {
        setAddressData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            // e.target is now guaranteed to be the form element because of the form attribute on the button
            const formData = new FormData(e.target);
            const orderDetails = {
                items: cart,
                total: totalPrice,
                shippingAddress: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    address: addressData.address || formData.get('address'),
                    city: addressData.city || formData.get('city'),
                    zipCode: addressData.zipCode || formData.get('zipCode'),
                    coordinates: addressData.coordinates
                },
                paymentMethod: formData.get('payment') || 'Virtual Account'
            };

            // Simulate API delay if needed
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Race addOrder with a timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Please check your connection.")), 10000)
            );

            // Save address to profile if checked
            if (saveAddress) {
                try {
                    await updateProfile({
                        address: addressData.address || formData.get('address'),
                        postal_code: addressData.zipCode || formData.get('zipCode'),
                        // We could also save city/phone if we added them to metadata schema
                    });
                } catch (err) {
                    console.error("Failed to save address to profile:", err);
                    // Don't block checkout if profile update fails
                }
            }

            await Promise.race([addOrder(orderDetails), timeoutPromise]);

            setSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Checkout failed:", error);
            setErrorMessage(error.message || "Terjadi kesalahan saat memproses pesanan.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-bold text-primary mb-4">Pembayaran Berhasil!</h2>
                <p className="text-secondary mb-8 max-w-md text-lg">
                    Terima kasih telah berbelanja di Lumina. Pesanan Anda sedang diproses dan akan segera dikirim.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-accent text-background px-10 py-4 rounded-xl font-bold hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20"
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

    const shippingCost = 22500;
    const discount = 111870;
    const grandTotal = totalPrice + shippingCost - discount;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 bg-background min-h-screen">
            {/* Stepper */}
            <div className="flex justify-center mb-16">
                <div className="flex items-center w-full max-w-2xl">
                    {/* Step 1: Cart (Completed) */}
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-14 h-14 rounded-full bg-accent text-background flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="text-accent font-bold mt-3 text-sm tracking-wide uppercase">Cart</span>
                    </div>

                    {/* Connector 1 */}
                    <div className="flex-1 h-[2px] bg-accent -mx-4 mb-6"></div>

                    {/* Step 2: Checkout (Active) */}
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-14 h-14 rounded-full bg-background border-2 border-accent text-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <Truck className="w-6 h-6" />
                        </div>
                        <span className="text-accent font-bold mt-3 text-sm tracking-wide uppercase">Checkout</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Info */}
                        <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-xl text-primary">Informasi Pengiriman</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMapOpen(true)}
                                    className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors bg-accent/5 px-4 py-2 rounded-lg border border-accent/20 hover:bg-accent/10"
                                >
                                    <Map className="w-4 h-4" />
                                    Pilih Lewat Peta
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary ml-1">Nama Depan</label>
                                    <div className="relative">
                                        <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                                        <input required name="firstName" type="text" className="w-full pl-12 pr-4 py-3 bg-background border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="John" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary ml-1">Nama Belakang</label>
                                    <div className="relative">
                                        <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                                        <input required name="lastName" type="text" className="w-full pl-12 pr-4 py-3 bg-background border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-secondary ml-1">Alamat Lengkap</label>
                                    <div className="relative">
                                        <MapPin className="w-5 h-5 absolute left-4 top-4 text-secondary" />
                                        <textarea
                                            required
                                            name="address"
                                            rows="3"
                                            className="w-full pl-12 pr-4 py-3 bg-background border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
                                            value={addressData.address}
                                            onChange={(e) => handleInputChange(e, 'address')}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary ml-1">Kota</label>
                                    <input
                                        required
                                        name="city"
                                        type="text"
                                        className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="Jakarta"
                                        value={addressData.city}
                                        onChange={(e) => handleInputChange(e, 'city')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary ml-1">Kode Pos</label>
                                    <input
                                        required
                                        name="zipCode"
                                        type="text"
                                        className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="12345"
                                        value={addressData.zipCode}
                                        onChange={(e) => handleInputChange(e, 'zipCode')}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${saveAddress ? 'bg-accent border-accent' : 'border-white/20 bg-background group-hover:border-accent/50'}`}>
                                        {saveAddress && <CheckCircle className="w-3.5 h-3.5 text-background" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={saveAddress}
                                        onChange={(e) => setSaveAddress(e.target.checked)}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-secondary group-hover:text-primary transition-colors">Simpan alamat ini ke profil saya</span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-xl text-primary">Metode Pembayaran</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Saved Payment Methods */}
                                {user?.user_metadata?.payment_methods?.map((method) => (
                                    <label key={method.id} className="flex items-center gap-4 p-5 border border-white/10 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={`Saved Card ending in ${method.last4}`}
                                            className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10"
                                        />
                                        <div className="flex-grow flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-primary block group-hover:text-accent transition-colors">
                                                    Credit Card •••• {method.last4}
                                                </span>
                                                <span className="text-sm text-secondary">Expires {method.expiry}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80 -ml-1.5"></div>
                                            </div>
                                        </div>
                                    </label>
                                ))}

                                <label className="flex items-center gap-4 p-5 border border-white/10 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group">
                                    <input type="radio" name="payment" value="Virtual Account" className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10" defaultChecked={!user?.user_metadata?.payment_methods?.length} />
                                    <div className="flex-grow">
                                        <span className="font-bold text-primary block group-hover:text-accent transition-colors">Transfer Bank (Virtual Account)</span>
                                        <span className="text-sm text-secondary">BCA, Mandiri, BNI, BRI</span>
                                    </div>
                                    <CreditCard className="w-6 h-6 text-secondary group-hover:text-accent transition-colors" />
                                </label>

                                <label className="flex items-center gap-4 p-5 border border-white/10 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group">
                                    <input type="radio" name="payment" value="Credit Card" className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10" />
                                    <div className="flex-grow">
                                        <span className="font-bold text-primary block group-hover:text-accent transition-colors">New Credit / Debit Card</span>
                                        <span className="text-sm text-secondary">Visa, Mastercard, JCB</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 p-5 border border-white/10 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group">
                                    <input type="radio" name="payment" value="COD" className="w-5 h-5 text-accent focus:ring-accent bg-background border-white/10" />
                                    <div className="flex-grow">
                                        <span className="font-bold text-primary block group-hover:text-accent transition-colors">Cash on Delivery (COD)</span>
                                        <span className="text-sm text-secondary">Bayar saat barang sampai</span>
                                    </div>
                                    <Truck className="w-6 h-6 text-secondary group-hover:text-accent transition-colors" />
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-sm sticky top-24">
                        <h3 className="font-bold text-xl text-primary mb-6">Ringkasan Pesanan</h3>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="w-16 h-16 bg-background rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-bold text-primary text-sm truncate">{item.name}</h4>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.selectedVariants?.Color && (
                                                <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-secondary">{item.selectedVariants.Color.name}</span>
                                            )}
                                            {item.selectedVariants?.Storage && (
                                                <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-secondary">{item.selectedVariants.Storage.name}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-secondary">Qty: {item.quantity}</span>
                                            <span className="font-bold text-primary text-sm">
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-6 space-y-3">
                            <div className="flex justify-between text-secondary text-sm">
                                <span>Subtotal</span>
                                <span className="font-medium text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-secondary text-sm">
                                <span>Discount</span>
                                <span className="font-medium text-red-400">-Rp {discount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-secondary text-sm">
                                <span>Ongkos Kirim</span>
                                <span className="font-medium text-primary">Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                                <span className="font-bold text-primary">Total Bayar</span>
                                <span className="font-bold text-2xl text-accent">Rp {grandTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">{errorMessage}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className="w-full mt-8 bg-accent text-background py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 transform duration-200"
                        >
                            {loading ? (
                                'Memproses...'
                            ) : (
                                <>
                                    Bayar Sekarang <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            <AddressMapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={handleMapConfirm}
            />
        </div>
    );
};

export default Checkout;
