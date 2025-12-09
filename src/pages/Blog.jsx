import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: "Mengenal Teknologi Kamera AI pada Lumina X1",
        excerpt: "Pelajari bagaimana kecerdasan buatan meningkatkan kualitas fotografi Anda ke level profesional dengan fitur-fitur terbaru dari Lumina X1.",
        date: "24 Nov 2025",
        author: "Tekno Reviewer",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Teknologi"
    },
    {
        id: 2,
        title: "Tips Menghemat Baterai Smartphone Seharian",
        excerpt: "Simak tips dan trik ampuh untuk memaksimalkan daya tahan baterai smartphone Anda agar tetap aktif sepanjang hari tanpa perlu sering mengisi daya.",
        date: "20 Nov 2025",
        author: "Lumina Team",
        image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Tips & Trik"
    },
    {
        id: 3,
        title: "Evolusi Desain Smartphone: Dari Masa ke Masa",
        excerpt: "Menelusuri perjalanan desain smartphone dari bentuk yang tebal hingga menjadi perangkat tipis dan elegan seperti yang kita kenal sekarang.",
        date: "15 Nov 2025",
        author: "Design Lead",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Desain"
    }
];

const Blog = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-primary mb-4">Lumina Blog</h1>
                <p className="text-secondary max-w-2xl mx-auto text-lg">
                    Berita terbaru, tips teknologi, dan wawasan mendalam seputar dunia smartphone dan gaya hidup digital.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <article key={post.id} className="bg-surface rounded-2xl border border-white/5 overflow-hidden hover:shadow-lg hover:shadow-accent/5 transition-all flex flex-col h-full group">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-accent uppercase tracking-wider border border-white/10">
                                {post.category}
                            </span>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 text-xs text-secondary mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {post.author}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors cursor-pointer">
                                {post.title}
                            </h2>

                            <p className="text-secondary text-sm mb-6 line-clamp-3 flex-grow">
                                {post.excerpt}
                            </p>

                            <button className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                                Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-16 text-center">
                <button className="border border-white/10 text-secondary px-8 py-3 rounded-full font-medium hover:bg-white/5 hover:text-primary transition-colors">
                    Muat Lebih Banyak
                </button>
            </div>
        </div>
    );
};

export default Blog;
