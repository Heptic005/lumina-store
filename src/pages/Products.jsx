import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ShoppingCart, ChevronDown, ChevronRight, Star, Smartphone, Laptop, Tablet, Headphones, Watch, Camera, Gamepad, Wifi, Sun, Grid, List } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

const Products = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 20000000]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortBy, setSortBy] = useState('featured');
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            let query = supabase.from('products').select('*');

            if (selectedCategory !== 'All') {
                if (selectedCategory === 'Mobile') {
                    query = query.in('category', ['Flagship', 'Mid-Range']);
                } else {
                    query = query.eq('category', selectedCategory);
                }
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [selectedCategory]);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Price Filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

        // Specs Filter
        if (Object.keys(selectedFilters).length === 0) return true;

        return Object.entries(selectedFilters).every(([key, values]) => {
            if (values.length === 0) return true;
            if (!product.specs) return false;

            const productSpecValue = product.specs[key];
            if (!productSpecValue) return false;

            // Check if any of the selected values for this filter key match the product's spec
            return values.some(value => productSpecValue.includes(value));
        });
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            default:
                return 0; // Featured / Default order
        }
    });

    const handleFilterChange = (filterTitle, value) => {
        setSelectedFilters(prev => {
            const currentValues = prev[filterTitle] || [];
            if (currentValues.includes(value)) {
                // Remove value
                const newValues = currentValues.filter(v => v !== value);
                if (newValues.length === 0) {
                    const { [filterTitle]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [filterTitle]: newValues };
            } else {
                // Add value
                return { ...prev, [filterTitle]: [...currentValues, value] };
            }
        });
    };

    const categories = [
        { name: 'Mobile', icon: <Smartphone className="w-6 h-6" /> },
        { name: 'Laptop', icon: <Laptop className="w-6 h-6" /> },
        { name: 'Tablet', icon: <Tablet className="w-6 h-6" /> },
        { name: 'Audio', icon: <Headphones className="w-6 h-6" /> },
        { name: 'Watches', icon: <Watch className="w-6 h-6" /> },
        { name: 'Camera', icon: <Camera className="w-6 h-6" /> },
        { name: 'Gaming', icon: <Gamepad className="w-6 h-6" /> },
        { name: 'Network', icon: <Wifi className="w-6 h-6" /> },
        { name: 'Accessories', icon: <Sun className="w-6 h-6" /> },
    ];

    // Dynamic Filter Configuration (Matched to DB keys where possible)
    const categoryFilters = {
        'Mobile': [
            { title: 'RAM', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
            { title: 'Storage', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
            { title: 'Display', options: ['6.1', '6.7', '6.8', '120Hz', '90Hz'] },
            { title: 'Battery', options: ['4500mAh', '5000mAh'] }
        ],
        'Laptop': [
            { title: 'Processor', options: ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
            { title: 'RAM', options: ['8GB', '16GB', '32GB', '64GB'] },
            { title: 'Storage', options: ['256GB SSD', '512GB SSD', '1TB SSD'] },
            { title: 'Graphics', options: ['Integrated', 'NVIDIA RTX 3050', 'NVIDIA RTX 4060', 'NVIDIA RTX 4090'] }
        ],
        'Tablet': [
            { title: 'Display', options: ['8"', '10"', '11"', '12.9"'] },
            { title: 'Storage', options: ['64GB', '128GB', '256GB', '512GB'] },
            { title: 'Battery', options: ['8000mAh'] }
        ],
        'Audio': [
            { title: 'Connectivity', options: ['Bluetooth', 'Wired'] },
            { title: 'Audio', options: ['Active Noise Cancellation'] }
        ],
        'Watches': [
            { title: 'Display', options: ['AMOLED'] },
            { title: 'Sensors', options: ['Heart Rate', 'GPS'] },
            { title: 'Water Resistance', options: ['5 ATM'] }
        ],
        'Camera': [
            { title: 'Type', options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action'] },
            { title: 'Resolution', options: ['12MP - 20MP', '20MP - 30MP', '30MP+'] },
            { title: 'Video Quality', options: ['1080p', '4K', '8K'] }
        ],
        'Gaming': [
            { title: 'Platform', options: ['PlayStation', 'Xbox', 'Nintendo', 'PC'] },
            { title: 'Type', options: ['Console', 'Controller', 'Headset', 'Accessory'] },
            { title: 'Connectivity', options: ['Wired', 'Wireless'] }
        ],
        'Network': [
            { title: 'Type', options: ['Router', 'Mesh System', 'Range Extender', 'Switch'] },
            { title: 'Speed', options: ['AC1200', 'AX1800', 'AX3000', 'AX6000+'] },
            { title: 'Ports', options: ['4 Ports', '8 Ports', '16 Ports+'] }
        ],
        'Accessories': [
            { title: 'Material', options: ['Polycarbonate', 'TPU', 'Leather'] },
            { title: 'Compatibility', options: ['Lumina X1 Pro'] }
        ],
        'All': [
            { title: 'Category', options: ['Mobile', 'Laptop', 'Tablet', 'Audio', 'Watches', 'Camera', 'Gaming', 'Network', 'Accessories'] }
        ]
    };

    const currentFilters = categoryFilters[selectedCategory] || categoryFilters['All'];

    const FilterSection = ({ title, children, defaultOpen = false }) => (
        <details className="group py-4 border-b border-white/5" open={defaultOpen}>
            <summary className="flex items-center justify-between cursor-pointer list-none text-primary font-medium">
                {title}
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-secondary" />
            </summary>
            <div className="pt-4 space-y-2">
                {children}
            </div>
        </details>
    );

    const sortOptions = [
        { label: 'Featured', value: 'featured' },
        { label: 'Price: Low to High', value: 'price-low' },
        { label: 'Price: High to Low', value: 'price-high' },
        { label: 'Name: A-Z', value: 'name-asc' },
        { label: 'Name: Z-A', value: 'name-desc' },
    ];

    return (
        <div className="bg-background min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-secondary mb-8">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-primary font-medium">Products</span>
                    {selectedCategory !== 'All' && (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-primary font-medium">{selectedCategory}</span>
                        </>
                    )}
                </div>

                {/* Category Icons */}
                <div className="flex items-center justify-between gap-4 overflow-x-auto pb-8 mb-8 border-b border-white/5 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => {
                                setSelectedCategory(cat.name);
                                setSelectedFilters({}); // Reset filters on category change
                            }}
                            className={`flex flex-col items-center gap-3 min-w-[80px] group ${selectedCategory === cat.name ? 'text-accent' : 'text-secondary hover:text-primary'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedCategory === cat.name ? 'bg-accent text-background shadow-lg shadow-accent/20' : 'bg-surface border border-white/5 group-hover:border-accent/50'}`}>
                                {cat.icon}
                            </div>
                            <span className="text-xs font-medium">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-primary">Filters</h3>
                            <button
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setSelectedFilters({});
                                }}
                                className="text-xs text-accent hover:underline"
                            >
                                Clear all
                            </button>
                        </div>

                        {/* Always show Price Range */}
                        <FilterSection title="Price" defaultOpen>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="30000000"
                                    step="500000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full accent-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-4 gap-4">
                                    <div className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-primary">
                                        Rp {priceRange[0].toLocaleString('id-ID')}
                                    </div>
                                    <div className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-primary">
                                        Rp {priceRange[1].toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </FilterSection>

                        {/* Dynamic Filters */}
                        {currentFilters.map((filter, index) => (
                            <FilterSection key={index} title={filter.title} defaultOpen={index < 2}>
                                {filter.options.map(option => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters[filter.title]?.includes(option) || false}
                                                onChange={() => handleFilterChange(filter.title, option)}
                                                className="peer appearance-none w-5 h-5 border border-white/10 rounded-md bg-surface checked:bg-accent checked:border-accent transition-colors"
                                            />
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-background opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span className="text-secondary group-hover:text-primary transition-colors text-sm">{option}</span>
                                    </label>
                                ))}
                            </FilterSection>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-2">
                                <button className="p-2 text-primary bg-surface border border-white/5 rounded-lg hover:border-accent/50 transition-colors">
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-secondary bg-transparent border border-transparent rounded-lg hover:text-primary transition-colors">
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-secondary">Showing {filteredProducts.length} products</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                                        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
                                    >
                                        Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label} <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Sort Dropdown */}
                                    {isSortOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 ${sortBy === option.value ? 'text-accent bg-accent/5' : 'text-secondary'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="text-center py-12 text-secondary">Loading products...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-secondary">No products found matching your filters.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product, idx) => (
                                    <>
                                        <Link key={product.id} to={`/products/${product.id}`} className="group bg-surface rounded-2xl border border-white/5 overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
                                            <div className="relative aspect-[4/3] bg-background p-6 flex items-center justify-center">
                                                <div className="absolute top-3 left-3 bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded-md">
                                                    -12%
                                                </div>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-primary mb-1 truncate">{product.name}</h3>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex text-yellow-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-current" />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-secondary">4.9</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs text-secondary line-through block">Rp {(product.price * 1.12).toLocaleString('id-ID')}</span>
                                                        <span className="text-lg font-bold text-accent">Rp {product.price.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addToCart(product);
                                                        }}
                                                        className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-background transition-colors"
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Insert Promo Banner after 6th item */}
                                        {idx === 5 && (
                                            <div className="col-span-1 sm:col-span-2 lg:col-span-3 my-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-8 relative overflow-hidden flex items-center">
                                                        <div className="relative z-10 max-w-[60%]">
                                                            <span className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2 block">Lumina GX Sale</span>
                                                            <h3 className="text-3xl font-bold text-white mb-4">Get 40% Off</h3>
                                                            <button className="bg-white text-blue-900 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors">Shop Now</button>
                                                        </div>
                                                        <img src="https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Promo" className="absolute right-0 bottom-0 w-1/2 h-full object-contain object-bottom transform translate-x-4 translate-y-4" />
                                                    </div>
                                                    <div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-3xl p-8 relative overflow-hidden flex items-center">
                                                        <div className="relative z-10 max-w-[60%]">
                                                            <span className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-2 block">Limited Time</span>
                                                            <h3 className="text-3xl font-bold text-white mb-4">New Arrivals</h3>
                                                            <button className="bg-white text-purple-900 px-6 py-2 rounded-xl font-bold hover:bg-purple-50 transition-colors">Explore</button>
                                                        </div>
                                                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Promo" className="absolute right-0 bottom-0 w-1/2 h-full object-contain object-bottom transform translate-x-4 translate-y-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center mt-12 gap-2">
                            {[1, 2, 3, 4].map((page) => (
                                <button key={page} className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-colors ${page === 1 ? 'bg-accent text-background' : 'bg-surface text-secondary hover:bg-white/5 hover:text-primary'}`}>
                                    {page}
                                </button>
                            ))}
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface text-secondary hover:bg-white/5 hover:text-primary transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
