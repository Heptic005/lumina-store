import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Smartphone, Laptop, Watch, Camera, Gamepad, Headphones, Monitor, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Particles from '../components/Particles';
import ScrollReveal from '../components/ScrollReveal';
import { blogPosts } from '../data/blogPosts';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch featured products (Best Sellers)
            const { data: featured } = await supabase.from('products').select('*').limit(4);
            if (featured) setFeaturedProducts(featured);

            // Fetch new products (mock for now, just take 4 different ones)
            const { data: newProds } = await supabase.from('products').select('*').range(0, 3);
            if (newProds) setNewProducts(newProds);

            if (newProds) setNewProducts(newProds);
        };
        fetchData();
    }, []);

    const categories = [
        { name: 'Accessories', icon: <Headphones className="w-6 h-6" />, path: '/products?category=Accessories' },
        { name: 'Camera', icon: <Camera className="w-6 h-6" />, path: '/products?category=Camera' },
        { name: 'Laptop', icon: <Laptop className="w-6 h-6" />, path: '/products?category=Laptop' },
        { name: 'Smart Phone', icon: <Smartphone className="w-6 h-6" />, path: '/products?category=Smartphone' },
        { name: 'Gaming', icon: <Gamepad className="w-6 h-6" />, path: '/products?category=Gaming' },
        { name: 'Smart Watch', icon: <Watch className="w-6 h-6" />, path: '/products?category=Watch' },
    ];

    const partners = [
        { name: 'Indosat', color: 'text-yellow-500' },
        { name: 'Tokopedia', color: 'text-green-500' },
        { name: 'Telkomsel', color: 'text-red-500' },
        { name: 'Shopee', color: 'text-orange-500' },
    ];

    const blogs = [
        { title: 'Meta Platforms plans to release free...', date: '12 Oct 2025', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { title: '8 Things You Probably Didn\'t Know About...', date: '15 Oct 2025', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { title: 'New policy for bright future of...', date: '20 Oct 2025', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ];

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-24">
                <div className="absolute inset-0 w-full h-full z-0">
                    <Particles
                        particleColors={['#ffffff', '#ffffff']}
                        particleCount={200}
                        particleSpread={10}
                        speed={0.1}
                        particleBaseSize={100}
                        moveParticlesOnHover={true}
                        alphaParticles={false}
                        disableRotation={false}
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 text-left z-10">
                            <h2 className="text-accent font-bold text-xl mb-4 tracking-wider uppercase">Lumina</h2>
                            <h1 className="text-5xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
                                "Choose Your Light<br />
                                <span className="text-accent">Choose Lumina"</span>
                            </h1>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-accent text-background px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                            >
                                Explore Now <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="flex-1 relative z-10 flex justify-center lg:justify-end">
                            {/* Image removed */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
                        {categories.map((cat, idx) => (
                            <Link key={idx} to={cat.path} className="flex flex-col items-center gap-4 group">
                                <div className="w-20 h-20 rounded-3xl bg-surface border border-white/5 flex items-center justify-center text-secondary group-hover:text-accent group-hover:border-accent/50 transition-all shadow-sm group-hover:shadow-accent/10">
                                    {cat.icon}
                                </div>
                                <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </ScrollReveal>
            </section>

            {/* Promo Section (Products On Sale) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal delay={0.2}>
                    <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        <div className="flex-1 z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Products On Sale</h2>
                            <p className="text-secondary mb-8 max-w-md">Shop Now and get amazing discounts on selected items. Limited time offer!</p>
                            <Link to="/products" className="text-accent font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                View all <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="flex-1 w-full z-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {featuredProducts.slice(0, 3).map((product) => (
                                    <Link key={product.id} to={`/products/${product.id}`} className="bg-surface border border-white/5 p-4 rounded-xl hover:scale-105 transition-transform hover:border-accent/30 group">
                                        <div className="aspect-square mb-2 overflow-hidden rounded-lg bg-background p-2">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="text-primary font-bold text-sm truncate">{product.name}</div>
                                        <div className="text-accent font-bold text-xs">Rp {product.price.toLocaleString('id-ID')}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* New Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal delay={0.3}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-primary">New Products</h2>
                        <Link to="/products" className="text-sm text-secondary hover:text-accent transition-colors">View all &gt;</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newProducts.map((product) => (
                            <Link key={product.id} to={`/products/${product.id}`} className="bg-surface p-4 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group">
                                <div className="aspect-square bg-background rounded-xl mb-4 overflow-hidden p-4">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl" />
                                </div>
                                <h3 className="font-bold text-primary mb-1 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-accent font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                                    <div className="flex items-center gap-1 text-xs text-secondary">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> 4.5
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </ScrollReveal>
            </section>

            {/* Feature Banners */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal delay={0.4}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 relative overflow-hidden h-80 flex flex-col justify-center border border-white/5 group">
                            <div className="relative z-10 max-w-xs">
                                <h3 className="text-2xl font-bold text-white mb-2">Lumina GX Series</h3>
                                <p className="text-blue-100 text-sm mb-6">A body good to be true. Designed for the future of mobile gaming.</p>
                                <Link to="/products" className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors inline-block border border-white/10">
                                    Explore Now
                                </Link>
                            </div>
                            <img src="/lumina-store/lumina-gx.jpg" alt="Phone" className="absolute right-6 top-1/2 -translate-y-1/2 h-64 w-auto object-cover rounded-2xl shadow-lg shadow-indigo-900/50 border border-white/10 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-3xl p-8 relative overflow-hidden h-80 flex flex-col justify-center border border-white/5 group">
                            <div className="relative z-10 max-w-xs">
                                <h3 className="text-2xl font-bold text-primary mb-2">Lumina Console</h3>
                                <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">Digital Edition + 2TB</h4>
                                <Link to="/products" className="bg-accent text-background px-6 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors inline-block">
                                    Buy Now
                                </Link>
                            </div>
                            <img src="/lumina-store/lumina-console.jpg" alt="Console" className="absolute right-6 top-1/2 -translate-y-1/2 h-64 w-auto object-cover rounded-2xl shadow-lg shadow-black/50 border border-white/10 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Best Sellers */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal delay={0.2}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-primary">Best Sellers</h2>
                        <Link to="/products" className="text-sm text-secondary hover:text-accent transition-colors">View all &gt;</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Link key={product.id} to={`/products/${product.id}`} className="bg-surface p-4 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group">
                                <div className="aspect-square bg-background rounded-xl mb-4 overflow-hidden p-4">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl" />
                                </div>
                                <h3 className="font-bold text-primary mb-1 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-accent font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                                    <div className="flex items-center gap-1 text-xs text-secondary">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> 4.8
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </ScrollReveal>
            </section>

            {/* Partners */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
                <ScrollReveal delay={0.1}>
                    <h2 className="text-xl font-bold text-primary mb-8">Mitra</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {partners.map((partner, idx) => (
                            <div key={idx} className={`text-2xl font-bold ${partner.color} flex items-center gap-2`}>
                                {partner.name}
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </section>

            {/* Big Banner (Watch) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center border border-white/5">
                        <div className="flex-1 z-10 text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Lumina Watch</h2>
                            <p className="text-secondary text-lg mb-8">Choose the Design That Defines You</p>
                            <Link to="/products/6c816ba4-3f82-4075-bdb2-e13b645dda40" className="bg-accent text-background px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors inline-block">
                                Buy Now
                            </Link>
                        </div>
                        <div className="flex-1 relative z-10 flex justify-center">
                            <div className="w-64 h-64 bg-accent/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <img src="/lumina-store/lumina-watch-gt.jpg" alt="Watch" className="relative w-64 h-64 object-cover rounded-[2rem] shadow-2xl shadow-black/50 hover:scale-105 hover:rotate-2 transition-all duration-500 border-4 border-white/10" />
                        </div>
                        {/* Background effect */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-20 z-0 hidden md:block"></div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Blogs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal delay={0.2}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-primary">Our Blogs</h2>
                        <Link to="/blog" className="text-sm text-secondary hover:text-accent transition-colors">View all &gt;</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogPosts.slice(0, 3).map((blog) => (
                            <Link key={blog.id} to={`/blog/${blog.id}`} className="bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all group cursor-pointer block h-full flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-accent uppercase tracking-wider border border-white/10">
                                        {blog.category}
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-xs text-secondary mb-2 flex items-center gap-2">
                                        <span>{blog.date}</span>
                                        <span>•</span>
                                        <span>{blog.author}</span>
                                    </div>
                                    <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">{blog.title}</h3>
                                    <p className="text-secondary text-sm line-clamp-2 mb-4 flex-grow">{blog.excerpt}</p>
                                    <div className="text-accent text-sm font-bold flex items-center gap-1 mt-auto">
                                        Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
};

export default Home;
