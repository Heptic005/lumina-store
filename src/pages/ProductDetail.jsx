import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Truck, Shield, Star, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReviewSection from '../components/ReviewSection';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, toggleWishlist } = useAuth();
    const { success } = useToast(); // Moved to top level
    const [isAdded, setIsAdded] = useState(false);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'description');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // New State for Variants & Quantity
    const [selectedVariants, setSelectedVariants] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [currentPrice, setCurrentPrice] = useState(0);

    const [reviewStats, setReviewStats] = useState({ rating: 0, count: 0 });

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            setLoading(true);
            console.log('Fetching product with ID:', id);
            // 1. Fetch current product
            const { data: currentProduct, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            console.log('Product fetch result:', currentProduct, 'Error:', productError);

            if (productError) {
                console.error('Error fetching product:', productError);
                setLoading(false);
                return;
            }

            // Check if product exists
            if (!currentProduct) {
                console.log('Product not found');
                setProduct(null);
                setLoading(false);
                return;
            }

            setProduct(currentProduct);
            setCurrentPrice(currentProduct.price);

            // Initialize default variants if they exist
            if (currentProduct.specs?.variants) {
                const defaults = {};
                Object.entries(currentProduct.specs.variants).forEach(([key, options]) => {
                    if (options && options.length > 0) {
                        defaults[key] = options[0];
                    }
                });
                setSelectedVariants(defaults);
            }

            // 2. Fetch related products
            if (currentProduct) {
                const { data: related, error: relatedError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', currentProduct.category)
                    .neq('id', id)
                    .limit(4);

                if (!relatedError && related) {
                    // Fetch Ratings for Related
                    const { data: relatedReviews } = await supabase
                        .from('reviews')
                        .select('product_id, rating')
                        .in('product_id', related.map(r => r.id));

                    const relatedWithRatings = related.map(p => {
                        const pReviews = relatedReviews?.filter(r => r.product_id === p.id) || [];
                        const avg = pReviews.length > 0
                            ? pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length
                            : 0;
                        return { ...p, rating: avg, reviewCount: pReviews.length };
                    });

                    setRelatedProducts(relatedWithRatings);
                }
            }

            // 3. Fetch Review Stats
            const { data: reviews, error: reviewsError } = await supabase
                .from('reviews')
                .select('rating')
                .eq('product_id', id);

            if (!reviewsError && reviews.length > 0) {
                const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                const avg = totalRating / reviews.length;
                setReviewStats({
                    rating: avg.toFixed(1),
                    count: reviews.length
                });
            } else {
                setReviewStats({ rating: 0, count: 0 });
            }

            setLoading(false);
        };

        if (id) {
            fetchProductAndRelated();
        }
    }, [id]);

    const handleVariantChange = (type, option) => {
        setSelectedVariants(prev => ({
            ...prev,
            [type]: option
        }));

        // Update price if storage changes
        if (type === 'Storage' && option.price_modifier !== undefined) {
            setCurrentPrice(product.price + option.price_modifier);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                    {/* Background glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-accent/10 blur-3xl rounded-full -z-1 pointer-events-none"></div>

                    <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-white">
                            <ShoppingCart className="w-8 h-8 opacity-50" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Oops!</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
                        Produk yang Anda cari tidak ditemukan. <br />Mungkin telah dihapus atau ID tidak valid.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-accent text-background rounded-xl font-bold hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }



    const handleAddToCart = () => {
        addToCart({
            ...product,
            price: currentPrice,
            selectedVariants,
            quantity
        });
        success(`Successfully added ${product.name} to cart!`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
            <button onClick={() => navigate(-1)} className="flex items-center text-secondary hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-surface rounded-3xl overflow-hidden border border-white/5 p-8 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                    </div>
                    {/* Thumbnails - simplified for now as we only have one image per product in DB */}
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-surface rounded-xl border border-white/5 p-2 cursor-pointer hover:border-accent transition-colors opacity-50 hover:opacity-100">
                                <img src={product.image} alt="Thumbnail" className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <div className="mb-6">
                        <span className="text-accent font-bold text-sm uppercase tracking-wider">{product.category}</span>
                        <h1 className="text-4xl font-bold text-primary mt-2 mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-3xl font-bold text-primary">
                                Rp {currentPrice.toLocaleString('id-ID')}
                            </div>
                            <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 cursor-pointer" onClick={() => setActiveTab('reviews')}>
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold text-amber-500">{reviewStats.rating || '0.0'}</span>
                                <span className="text-xs text-amber-600/80">({reviewStats.count} Reviews)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-secondary text-lg mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Variants Selection */}
                    {product.specs?.variants && (
                        <div className="space-y-6 mb-8">
                            {/* Color Selection */}
                            {product.specs.variants.Color && (
                                <div>
                                    <h3 className="text-sm font-medium text-secondary mb-3">Color</h3>
                                    <div className="flex gap-3">
                                        {product.specs.variants.Color.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => handleVariantChange('Color', color)}
                                                className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedVariants.Color?.name === color.name ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : 'hover:ring-2 hover:ring-white/20'}`}
                                                title={color.name}
                                            >
                                                <span
                                                    className="w-full h-full rounded-full border border-white/10"
                                                    style={{ backgroundColor: color.hex }}
                                                ></span>
                                                {selectedVariants.Color?.name === color.name && (
                                                    <Check className={`w-5 h-5 absolute inset-0 m-auto ${['#ffffff', '#c0c0c0'].includes(color.hex) ? 'text-black' : 'text-white'}`} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-secondary mt-2">Selected: <span className="text-primary font-medium">{selectedVariants.Color?.name}</span></p>
                                </div>
                            )}

                            {/* Storage Selection */}
                            {product.specs.variants.Storage && (
                                <div>
                                    <h3 className="text-sm font-medium text-secondary mb-3">Storage</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.specs.variants.Storage.map((storage) => (
                                            <button
                                                key={storage.name}
                                                onClick={() => handleVariantChange('Storage', storage)}
                                                className={`px-6 py-3 rounded-xl border font-medium transition-all ${selectedVariants.Storage?.name === storage.name
                                                    ? 'border-accent bg-accent/10 text-accent'
                                                    : 'border-white/10 bg-surface text-secondary hover:border-white/30 hover:text-primary'}`}
                                            >
                                                {storage.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Quantity Selector */}
                        <div className="flex items-center bg-surface border border-white/10 rounded-xl">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-full flex items-center justify-center text-secondary hover:text-primary transition-colors"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-bold text-primary">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-12 h-full flex items-center justify-center text-secondary hover:text-primary transition-colors"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isAdded
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-accent text-background hover:bg-accent/90 shadow-lg shadow-accent/20'
                                }`}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="w-6 h-6" /> Ditambahkan
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-6 h-6" /> Tambah ke Keranjang
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-4 rounded-xl border transition-all ${user?.user_metadata?.wishlist?.some(item => item.id === product.id)
                                ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
                                : 'bg-surface border-white/10 text-secondary hover:border-accent hover:text-accent'
                                }`}
                        >
                            <Heart className={`w-6 h-6 ${user?.user_metadata?.wishlist?.some(item => item.id === product.id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-secondary border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-primary">Gratis Ongkir</div>
                                <div className="text-xs">Ke seluruh Indonesia</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-primary">Garansi Resmi</div>
                                <div className="text-xs">1 Tahun Ganti Baru</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="mb-20">
                <div className="flex gap-8 border-b border-white/10 mb-8">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'description' ? 'text-accent' : 'text-secondary hover:text-primary'}`}
                    >
                        Deskripsi
                        {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'specs' ? 'text-accent' : 'text-secondary hover:text-primary'}`}
                    >
                        Spesifikasi
                        {activeTab === 'specs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'reviews' ? 'text-accent' : 'text-secondary hover:text-primary'}`}
                    >
                        Reviews
                        {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full"></div>}
                    </button>
                </div>

                {activeTab === 'description' && (
                    <div className="prose prose-invert max-w-none">
                        <p className="text-secondary leading-relaxed text-lg">{product.description}</p>
                    </div>
                )}

                {activeTab === 'specs' && (
                    <div className="bg-surface rounded-2xl p-8 border border-white/5">
                        {product.specs ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                {Object.entries(product.specs)
                                    .filter(([key]) => key !== 'variants')
                                    .map(([key, value]) => (
                                        <div key={key} className="flex flex-col border-b border-white/5 pb-4 last:border-0">
                                            <span className="text-sm text-secondary uppercase font-semibold tracking-wider mb-1">{key}</span>
                                            <span className="text-primary font-medium text-lg">{value}</span>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center text-secondary py-8">
                                Belum ada spesifikasi detail untuk produk ini.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <ReviewSection productId={id} />
                )}
            </div>

            {/* Similar Products */}
            {relatedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-primary mb-8">Similar Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((related) => (
                            <Link key={related.id} to={`/products/${related.id}`} className="group bg-surface rounded-2xl border border-white/5 overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
                                <div className="relative aspect-[4/3] bg-background p-6 flex items-center justify-center">
                                    <div className="absolute top-3 left-3 bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded-md">
                                        -12%
                                    </div>
                                    <img
                                        src={related.image}
                                        alt={related.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-primary mb-1 truncate">{related.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex text-yellow-500">
                                            <Star className={`w-3 h-3 ${related.rating >= 1 ? 'fill-current' : 'text-gray-600'}`} />
                                            <span className="text-xs font-bold ml-1">{related.rating ? related.rating.toFixed(1) : 'New'}</span>
                                            <span className="text-xs text-secondary ml-1">({related.reviewCount})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-secondary line-through block">Rp {(related.price * 1.12).toLocaleString('id-ID')}</span>
                                            <span className="text-lg font-bold text-accent">Rp {related.price.toLocaleString('id-ID')}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(related);
                                            }}
                                            className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-background transition-colors"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {/* Sticky Add to Cart Bar for Mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-white/10 p-4 md:hidden z-40 flex items-center justify-between gap-4 pb-safe">
                <div className="flex flex-col">
                    <span className="text-xs text-secondary">Total Price</span>
                    <span className="text-lg font-bold text-accent">Rp {currentPrice.toLocaleString('id-ID')}</span>
                </div>
                <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-accent text-background shadow-lg shadow-accent/20'
                        }`}
                >
                    {isAdded ? (
                        <>
                            <Check className="w-5 h-5" /> Added
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
