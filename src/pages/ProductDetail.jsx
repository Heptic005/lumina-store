import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Truck, Shield, Star, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            setLoading(true);
            // 1. Fetch current product
            const { data: currentProduct, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (productError) {
                console.error('Error fetching product:', productError);
                setLoading(false);
                return;
            }

            setProduct(currentProduct);

            // 2. Fetch related products (same category, exclude current)
            if (currentProduct) {
                const { data: related, error: relatedError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', currentProduct.category)
                    .neq('id', id)
                    .limit(4);

                if (!relatedError) {
                    setRelatedProducts(related);
                }
            }
            setLoading(false);
        };

        if (id) {
            fetchProductAndRelated();
        }
    }, [id]);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-20">Produk tidak ditemukan</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
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
                                Rp {product.price.toLocaleString('id-ID')}
                            </div>
                            <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold text-amber-500">4.8</span>
                                <span className="text-xs text-amber-600/80">(120 Reviews)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-secondary text-lg mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
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
                </div>

                {activeTab === 'description' ? (
                    <div className="prose prose-invert max-w-none">
                        <p className="text-secondary leading-relaxed text-lg">{product.description}</p>
                    </div>
                ) : (
                    <div className="bg-surface rounded-2xl p-8 border border-white/5">
                        {product.specs ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                {Object.entries(product.specs).map(([key, value]) => (
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
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-secondary">4.9</span>
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
        </div>
    );
};

export default ProductDetail;
