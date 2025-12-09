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
    const { totalItems } = useCart();
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
    const featuredItems = [
        { name: 'Earpods', image: 'https://images.unsplash.com/photo-1572569028738-411a1971d629?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Holder', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Cables', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { name: 'Cases & Protection', image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ];

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
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-accent p-2 rounded-xl transform group-hover:rotate-12 transition-transform duration-300">
                                <Smartphone className="w-6 h-6 text-background fill-current" />
                            </div>
                            <span className="text-2xl font-bold text-primary tracking-tight">
                                Lumina
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8 h-full">
                            <Link to="/" className="text-secondary hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">Home</Link>

                            {/* Mega Menu Trigger */}
                            <div
                                className="h-full flex items-center group"
                                onMouseEnter={() => setShowMegaMenu(true)}
                                onMouseLeave={() => setShowMegaMenu(false)}
                            >
                                <Link to="/products" className="text-secondary group-hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide py-8">
                                    Products
                                </Link>

                                {/* Mega Menu Content */}
                                {showMegaMenu && (
                                    <div className="absolute top-full left-0 w-full bg-surface border-t border-white/5 shadow-2xl animate-fade-in-up origin-top">
                                        <div className="max-w-7xl mx-auto flex min-h-[400px]">
                                            {/* Sidebar */}
                                            <div className="w-64 border-r border-white/5 py-6 bg-background/50">
                                                {categories.map((cat) => (
                                                    <div
                                                        key={cat.name}
                                                        className={`px-6 py-3 flex items-center justify-between cursor-pointer transition-colors ${activeCategory === cat.name ? 'text-accent bg-accent/5 border-r-2 border-accent' : 'text-secondary hover:text-primary hover:bg-white/5'}`}
                                                        onMouseEnter={() => setActiveCategory(cat.name)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {cat.icon}
                                                            <span className="font-medium text-sm">{cat.name}</span>
                                                        </div>
                                                        {activeCategory === cat.name && <ChevronRight className="w-4 h-4" />}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex-1 p-8 bg-surface">
                                                <div className="grid grid-cols-4 gap-8">
                                                    {/* Sub Categories List */}
                                                    <div className="col-span-1">
                                                        <h3 className="font-bold text-primary mb-4 text-lg">{activeCategory}</h3>
                                                        <ul className="space-y-3">
                                                            {categories.find(c => c.name === activeCategory)?.items.map(item => (
                                                                <li key={item}>
                                                                    <Link to={`/products?category=${item}`} className="text-secondary hover:text-accent text-sm transition-colors block">
                                                                        {item}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                            <li className="pt-4">
                                                                <Link to="/products" className="text-accent text-sm font-bold hover:underline">
                                                                    View all
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* Featured Items Grid */}
                                                    <div className="col-span-3 grid grid-cols-4 gap-6">
                                                        {featuredItems.map((item, idx) => (
                                                            <Link key={idx} to="/products" className="group block bg-background rounded-xl p-4 border border-white/5 hover:border-accent/30 transition-all text-center">
                                                                <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-white/5 p-2">
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                                </div>
                                                                <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{item.name}</p>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/blog" className="text-secondary hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">Blog</Link>
                            {user && (
                                <Link to="/orders" className="text-secondary hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide">Orders</Link>
                            )}
                        </div>

                        {/* Icons */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Search Icon */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                            >
                                <Search className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                            </button>

                            <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors group">
                                <ShoppingCart className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-background text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-primary">
                                        Hi, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-secondary hover:text-red-500 transition-colors"
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

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-secondary hover:text-primary transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-background border-t border-white/5 h-screen">
                        <div className="px-4 pt-8 pb-4 space-y-4">
                            <Link to="/" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">Home</Link>
                            <Link to="/products" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">Products</Link>
                            <Link to="/blog" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">Blog</Link>
                            {user && (
                                <Link to="/orders" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium transition-colors">Orders</Link>
                            )}
                            <Link to="/cart" className="block px-4 py-3 text-lg text-secondary hover:text-primary hover:bg-white/5 rounded-xl font-medium flex justify-between items-center transition-colors">
                                Cart
                                {totalItems > 0 && <span className="bg-accent text-background text-xs font-bold px-2 py-1 rounded-full">{totalItems}</span>}
                            </Link>
                            {user ? (
                                <button
                                    onClick={logout}
                                    className="w-full text-left block px-4 py-3 text-lg text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-colors"
                                >
                                    Logout ({user.email})
                                </button>
                            ) : (
                                <Link to="/login" className="block px-4 py-3 text-lg text-center bg-accent text-background rounded-xl font-bold mt-8 hover:bg-accent/90 transition-colors">Login</Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl animate-fade-in">
                    <div className="max-w-4xl mx-auto px-4 pt-24">
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search for products..."
                                className="w-full bg-transparent border-b-2 border-white/10 text-3xl md:text-5xl font-bold text-primary py-4 focus:outline-none focus:border-accent placeholder:text-white/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8 text-secondary hover:text-primary" />
                            </button>
                        </div>

                        <div className="mt-12">
                            {isSearching ? (
                                <div className="text-secondary text-lg animate-pulse">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.id}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className="group bg-surface rounded-xl p-4 border border-white/5 hover:border-accent/50 transition-all hover:-translate-y-1"
                                        >
                                            <div className="aspect-square mb-4 bg-white/5 rounded-lg overflow-hidden p-4">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <h4 className="font-bold text-primary truncate">{product.name}</h4>
                                            <p className="text-accent text-sm mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchQuery ? (
                                <div className="text-secondary text-lg">No products found for "{searchQuery}"</div>
                            ) : (
                                <div className="text-secondary text-lg">Start typing to search...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
