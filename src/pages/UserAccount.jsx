import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, CreditCard, ShoppingBag, Heart, Tag, Shield, Bell, Phone, LogOut,
    Edit2, MapPin, Mail, Lock, Smartphone, Save, X, Plus, Trash2
} from 'lucide-react';

const UserAccount = () => {
    const { user, logout, updateProfile, toggleWishlist } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Personal Data');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Payment Methods State
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        holder: '',
        expiry: '',
        cvc: ''
    });

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        postalCode: ''
    });

    // Initialize data from user object
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.user_metadata?.full_name || '',
                phone: user.user_metadata?.phone || '',
                address: user.user_metadata?.address || '',
                postalCode: user.user_metadata?.postal_code || ''
            });
            // Initialize payment methods from metadata
            setPaymentMethods(user.user_metadata?.payment_methods || []);
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await updateProfile({
                full_name: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                postal_code: formData.postalCode
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newMethod = {
                id: Date.now(), // Simple ID generation
                type: 'Credit Card',
                last4: newCard.number.slice(-4),
                holder: newCard.holder,
                expiry: newCard.expiry
            };

            const updatedMethods = [...paymentMethods, newMethod];

            await updateProfile({
                payment_methods: updatedMethods
            });

            setPaymentMethods(updatedMethods);
            setShowAddCard(false);
            setNewCard({ number: '', holder: '', expiry: '', cvc: '' });
            setMessage({ type: 'success', text: 'Payment method added successfully!' });
        } catch (error) {
            console.error('Error adding card:', error);
            setMessage({ type: 'error', text: 'Failed to add payment method.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id) => {
        if (!confirm('Are you sure you want to remove this card?')) return;

        setLoading(true);
        try {
            const updatedMethods = paymentMethods.filter(m => m.id !== id);
            await updateProfile({
                payment_methods: updatedMethods
            });
            setPaymentMethods(updatedMethods);
            setMessage({ type: 'success', text: 'Payment method removed.' });
        } catch (error) {
            console.error('Error removing card:', error);
            setMessage({ type: 'error', text: 'Failed to remove payment method.' });
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { name: 'Personal Data', icon: <User className="w-5 h-5" /> },
        { name: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
        { name: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, path: '/orders' },
        { name: 'Wish list', icon: <Heart className="w-5 h-5" /> },
        { name: 'Discounts', icon: <Tag className="w-5 h-5" /> },
        { name: 'Security & access', icon: <Shield className="w-5 h-5" /> },
        { name: 'Notification', icon: <Bell className="w-5 h-5" /> },
        { name: 'Contact us', icon: <Phone className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 bg-background min-h-screen">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-secondary mb-8">
                <span>Home</span>
                <span>&gt;</span>
                <span>Account</span>
                <span>&gt;</span>
                <span className="text-accent font-medium">{activeTab}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-4 p-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                            <User className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-primary truncate max-w-[150px]">{user?.user_metadata?.full_name || 'User'}</h3>
                            <p className="text-xs text-secondary">Member since {new Date(user?.created_at).getFullYear()}</p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => item.path ? navigate(item.path) : setActiveTab(item.name)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.name
                                    ? 'bg-accent/10 text-accent border-l-2 border-accent'
                                    : 'text-secondary hover:bg-white/5 hover:text-primary'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.name}</span>
                            </button>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-4"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium text-sm">Log out</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'Personal Data' && (
                        <div className="bg-surface rounded-2xl border border-white/5 p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary">Identification</h2>
                                    <p className="text-secondary">Verify your identity</p>
                                </div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-primary rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-background rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary">Full name</label>
                                    <div className={`flex items-center justify-between p-4 bg-background rounded-xl border ${isEditing ? 'border-accent/50' : 'border-white/5'} transition-colors`}>
                                        <div className="flex items-center gap-3 w-full">
                                            <User className="w-5 h-5 text-secondary" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="bg-transparent border-none focus:outline-none text-primary w-full font-medium"
                                                    placeholder="Enter full name"
                                                />
                                            ) : (
                                                <span className="text-primary font-medium">{formData.fullName || '-'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Email (Read Only) */}
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary">E-mail Address</label>
                                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-white/5 opacity-70 cursor-not-allowed">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-secondary" />
                                            <span className="text-primary font-medium">{user?.email}</span>
                                        </div>
                                        <Lock className="w-4 h-4 text-secondary" />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary">Phone number</label>
                                    <div className={`flex items-center justify-between p-4 bg-background rounded-xl border ${isEditing ? 'border-accent/50' : 'border-white/5'} transition-colors`}>
                                        <div className="flex items-center gap-3 w-full">
                                            <Smartphone className="w-5 h-5 text-secondary" />
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="bg-transparent border-none focus:outline-none text-primary w-full font-medium"
                                                    placeholder="Enter phone number"
                                                />
                                            ) : (
                                                <span className="text-primary font-medium">{formData.phone || '-'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Password (Placeholder) */}
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary">Password</label>
                                    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-white/5 opacity-70 cursor-not-allowed">
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-5 h-5 text-secondary" />
                                            <span className="text-primary font-medium tracking-widest">••••••••</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm text-secondary">Address</label>
                                    <div className={`flex items-center justify-between p-4 bg-background rounded-xl border ${isEditing ? 'border-accent/50' : 'border-white/5'} transition-colors`}>
                                        <div className="flex items-center gap-3 w-full">
                                            <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="bg-transparent border-none focus:outline-none text-primary w-full font-medium"
                                                    placeholder="Enter address"
                                                />
                                            ) : (
                                                <span className="text-primary font-medium truncate">{formData.address || '-'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Postal Code */}
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary">Postal code</label>
                                    <div className={`flex items-center justify-between p-4 bg-background rounded-xl border ${isEditing ? 'border-accent/50' : 'border-white/5'} transition-colors`}>
                                        <div className="flex items-center gap-3 w-full">
                                            <MapPin className="w-5 h-5 text-secondary" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.postalCode}
                                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                    className="bg-transparent border-none focus:outline-none text-primary w-full font-medium"
                                                    placeholder="Enter postal code"
                                                />
                                            ) : (
                                                <span className="text-primary font-medium">{formData.postalCode || '-'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Payment' && (
                        <div className="bg-surface rounded-2xl border border-white/5 p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary">Payment Methods</h2>
                                    <p className="text-secondary">Manage your saved cards</p>
                                </div>
                                <button
                                    onClick={() => setShowAddCard(!showAddCard)}
                                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-background rounded-lg transition-colors text-sm font-medium"
                                >
                                    {showAddCard ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {showAddCard ? 'Cancel' : 'Add New Card'}
                                </button>
                            </div>

                            {showAddCard && (
                                <form onSubmit={handleAddCard} className="mb-8 p-6 bg-background rounded-xl border border-white/5 animate-in slide-in-from-top-4">
                                    <h3 className="font-bold text-primary mb-4">Add Credit/Debit Card</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm text-secondary">Card Number</label>
                                            <input
                                                required
                                                type="text"
                                                value={newCard.number}
                                                onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                placeholder="0000 0000 0000 0000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-secondary">Card Holder</label>
                                            <input
                                                required
                                                type="text"
                                                value={newCard.holder}
                                                onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                                                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-secondary">Expiry</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={newCard.expiry}
                                                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                                    className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-secondary">CVC</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={newCard.cvc}
                                                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.slice(0, 3) })}
                                                    className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-6 w-full bg-accent text-background py-3 rounded-xl font-bold hover:bg-accent/80 transition-colors"
                                    >
                                        {loading ? 'Adding...' : 'Save Card'}
                                    </button>
                                </form>
                            )}

                            <div className="space-y-4">
                                {paymentMethods.length === 0 ? (
                                    <div className="text-center py-12 text-secondary">
                                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No saved payment methods.</p>
                                    </div>
                                ) : (
                                    paymentMethods.map((method) => (
                                        <div key={method.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-white/5 hover:border-accent/50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                                                    <div className="flex gap-1">
                                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 -ml-1.5"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary">•••• •••• •••• {method.last4}</p>
                                                    <p className="text-sm text-secondary">Expires {method.expiry}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteCard(method.id)}
                                                className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Wish list' && (
                        <div className="bg-surface rounded-2xl border border-white/5 p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary">My Wishlist</h2>
                                    <p className="text-secondary">Items you've saved for later</p>
                                </div>
                            </div>

                            {!user?.user_metadata?.wishlist?.length ? (
                                <div className="text-center py-12 text-secondary">
                                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Your wishlist is empty.</p>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="mt-4 text-accent hover:underline"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {user.user_metadata.wishlist.map((item) => (
                                        <div key={item.id} className="bg-background rounded-xl border border-white/5 overflow-hidden group hover:border-accent/50 transition-all">
                                            <div className="relative aspect-square bg-white/5 p-4">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                <button
                                                    onClick={() => toggleWishlist(item)}
                                                    className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-primary truncate">{item.name}</h3>
                                                <p className="text-accent font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                                                <button
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                    className="w-full mt-4 py-2 bg-white/5 hover:bg-accent hover:text-background text-primary rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab !== 'Personal Data' && activeTab !== 'Payment' && activeTab !== 'Wish list' && (
                        <div className="bg-surface rounded-2xl border border-white/5 p-16 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-secondary" />
                            </div>
                            <h2 className="text-xl font-bold text-primary mb-2">Coming Soon</h2>
                            <p className="text-secondary">This feature is currently under development.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAccount;
