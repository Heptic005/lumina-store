import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Smartphone, User, ChevronRight, Laptop, Tablet, Watch, Headphones, Camera, Gamepad, Wifi, Sun, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Mobile Phones');
    const { totalItems, isAnimating } = useCart();
    const { user, logout } = useAuth();

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);

    const categories = [
        { name: 'Mobile Phones', icon: <Smartphone className="w-5 h-5" />, items: ['Flagship', 'Mid-Range', 'Entry Level', 'Gaming Phones', 'Foldables'] },
        { name: 'Laptops & Computers', icon: <Laptop className="w-5 h-5" />, items: ['Ultrabooks', 'Gaming Laptops', '2-in-1s', 'Workstations', 'Accessories'] },
        { name: 'Tablets', icon: <Tablet className="w-5 h-5" />, items: ['iPad', 'Android Tablets', 'E-Readers', 'Tablet Accessories'] },
        { name: 'Watches', icon: <Watch className="w-5 h-5" />, items: ['Smartwatches', 'Fitness Trackers', 'Hybrid Watches', 'Bands & Straps'] },
        { name: 'Audio', icon: <Headphones className="w-5 h-5" />, items: ['Headphones', 'Earbuds', 'Speakers', 'Soundbars'] },
        { name: 'Cameras', icon: <Camera className="w-5 h-5" />, items: ['DSLR', 'Mirrorless', 'Action Cameras', 'Drones'] },
        { name: 'Gaming', icon: <Gamepad className="w-5 h-5" />, items: ['Consoles', 'Controllers', 'VR Headsets', 'Gaming Chairs'] },
        { name: 'Networking', icon: <Wifi className="w-5 h-5" />, items: ['Routers', 'Mesh Systems', 'Modems', 'Network Adapters'] },
        { name: 'Accessories', icon: <Sun className="w-5 h-5" />, items: ['Cases', 'Chargers', 'Cables', 'Power Banks'] },
    ];

    // Mock featured products for mega menu
    const [featuredItems, setFeaturedItems] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data } = await supabase
                .from('products')
                .select('id, name, image, price')
                .limit(4);

            if (data) setFeaturedItems(data);
        };
        fetchFeatured();
    }, []);

    // Handle Search
    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery.trim().length === 0) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('name', `%${searchQuery}%`)
                    .limit(8);

                if (error) throw error;
                setSearchResults(data || []);
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isOpen ? 'bg-background' : 'bg-background/80 backdrop-blur-md border-b border-white/5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                            <img src="/logo.png" alt="Lumina Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-2xl font-bold text-primary tracking-tight">
                                Lumina
                            </span>
                        </Link>

                        {/* Desktop Search Bar - CENTERED */}
                        <div className="hidden md:block flex-1 max-w-2xl relative group">
                            <div className={`flex items-center bg-surface border rounded-full px-4 py-2.5 transition-all duration-300 ${isSearching || searchResults.length > 0 ? 'border-accent shadow-lg shadow-accent/5 ring-1 ring-accent/20' : 'border-white/10 group-hover:border-white/20'}`}>
                                <Search className={`w-5 h-5 mr-3 transition-colors ${isSearching ? 'text-accent' : 'text-secondary'}`} />
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    className="bg-transparent border-none focus:outline-none text-primary w-full placeholder:text-secondary/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    ref={searchInputRef}
                                />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="p-1 hover:bg-white/10 rounded-full text-secondary">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Search Dropdown Results */}
                            {searchQuery && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-top z-50">
                                    {isSearching ? (
                                        <div className="p-6 text-center text-secondary">
                                            <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
                                            Searching...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={`/products/${product.id}`}
                                                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 p-1">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-primary truncate">{product.name}</h4>
                                                        <p className="text-sm text-accent font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <div className="p-2 bg-white/5 rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link to={`/products?search=${searchQuery}`} className="block p-3 text-center text-sm font-bold text-accent hover:bg-accent/5 transition-colors border-t border-white/5">
                                                View all results for "{searchQuery}"
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-secondary">
                                            <p>No products found for "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Desktop Menu - RIGHT */}
                        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                            {/* Mega Menu Trigger */}
                            <div className="h-full flex items-center relative">
                                <button
                                    onClick={() => setShowMegaMenu(!showMegaMenu)}
                                    className={`font-medium transition-colors text-sm uppercase tracking-wide py-2 focus:outline-none ${showMegaMenu ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                                >
                                    Shop
                                </button>

                                {/* Mega Menu Content */}
                                {showMegaMenu && (
                                    <div className="absolute top-full right-0 w-[800px] bg-surface border border-white/5 shadow-2xl rounded-2xl animate-fade-in-up origin-top-right mt-4 p-6 overflow-hidden z-[60]">
                                        <div className="flex bg-background/50 rounded-xl overflow-hidden min-h-[300px]">
                                            {/* Sidebar */}
                                            <div className="w-1/3 border-r border-white/5 py-4 bg-background/50">
                                                {categories.slice(0, 6).map((cat) => (
                                                    <Link
                                                        key={cat.name}
                                                        to={`/products?category=${cat.name}`}
                                                        onClick={() => setShowMegaMenu(false)}
                                                        className="px-6 py-2.5 flex items-center gap-3 text-secondary hover:text-accent hover:bg-white/5 transition-colors"
                                                    >
                                                        {cat.icon}
                                                        <span className="font-medium text-sm">{cat.name}</span>
                                                    </Link>
                                                ))}
                                                <Link
                                                    to="/products"
                                                    onClick={() => setShowMegaMenu(false)}
                                                    className="px-6 py-2.5 flex items-center gap-3 text-accent font-bold hover:bg-white/5 transition-colors mt-2"
                                                >
                                                    View All Categories <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>

                                            {/* Featured Items in Mega Menu */}
                                            <div className="flex-1 p-6 bg-surface">
                                                <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">Featured Products</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {featuredItems.slice(0, 2).map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            to={`/products/${item.id}`}
                                                            onClick={() => setShowMegaMenu(false)}
                                                            className="group block bg-background rounded-xl p-3 border border-white/5 hover:border-accent/30 transition-all text-center"
                                                        >
                                                            <div className="aspect-square mb-2 overflow-hidden rounded-lg bg-white/5 p-2">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                            <p className="text-xs font-bold text-primary truncate">{item.name}</p>
                                                            <p className="text-xs text-accent mt-1">Rp {item.price?.toLocaleString('id-ID')}</p>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/cart" className={`relative p-2 hover:bg-white/5 rounded-full transition-all duration-300 group ${isAnimating ? 'scale-125 bg-accent/20' : ''}`}>
                                <ShoppingCart className={`w-6 h-6 text-secondary group-hover:text-primary transition-colors ${isAnimating ? 'text-accent' : ''}`} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-background text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/account" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <User className="w-4 h-4" />
                                        </div>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-6 py-2.5 rounded-full bg-white/5 text-primary font-medium hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all">
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button - RIGHT */}
                        <div className="flex md:hidden items-center gap-4">
                            <Link to="/cart" className="relative p-2">
                                <ShoppingCart className="w-6 h-6 text-secondary" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-background text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                            <button
                                className="p-2 text-secondary hover:text-primary transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu & Search */}
                {isOpen && (
                    <div className="md:hidden bg-background border-t border-white/5 h-screen overflow-y-auto pb-20">
                        {/* Mobile Search */}
                        <div className="p-4 border-b border-white/5">
                            <div className="flex items-center bg-surface border border-white/10 rounded-xl px-4 py-3">
                                <Search className="w-5 h-5 text-secondary mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="bg-transparent border-none focus:outline-none text-primary w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {/* Mobile Search Results */}
                            {searchResults.length > 0 && searchQuery && (
                                <div className="mt-4 bg-surface rounded-xl border border-white/5 overflow-hidden">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0"
                                        >
                                            <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-primary truncate">{product.name}</p>
                                                <p className="text-xs text-accent">Rp {product.price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-4 space-y-2">
                            <Link to="/" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">Home</Link>
                            <Link to="/products" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">Shop All Products</Link>
                            {/* Mobile Categories Accordion could go here */}

                            {user && (
                                <Link to="/orders" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">My Orders</Link>
                            )}

                            {user?.user_metadata?.role === 'admin' && (
                                <Link to="/admin" className="block px-4 py-3 text-lg text-accent hover:text-accent/80 hover:bg-accent/10 rounded-xl font-bold transition-colors">Admin Dashboard</Link>
                            )}

                            {user ? (
                                <button
                                    onClick={logout}
                                    className="w-full text-left block px-4 py-3 text-lg text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-colors mt-4"
                                >
                                    Logout ({user.email})
                                </button>
                            ) : (
                                <Link to="/login" className="block text-center px-4 py-3 text-lg bg-accent text-background rounded-xl font-bold mt-8 hover:bg-accent/90 transition-colors">Login / Register</Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
