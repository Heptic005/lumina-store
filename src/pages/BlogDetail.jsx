import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import { useEffect } from 'react';

const BlogDetail = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-bold text-primary mb-4">Artikel Tidak Ditemukan</h2>
                <Link to="/blog" className="text-accent hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Kembali ke Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-20 pt-24">
            {/* Hero Image */}
            <div className="w-full h-[400px] relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10"></div>
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 z-20 max-w-4xl mx-auto right-0">
                    <span className="bg-accent text-background px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                        {post.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-secondary text-sm md:text-base">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" /> {post.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> 5 min read
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-4 sm:px-6">
                <div
                    className="prose prose-invert prose-lg max-w-none text-secondary"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>

                {/* Share & Tags */}
                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                    <Link to="/blog" className="text-accent font-medium flex items-center gap-2 hover:gap-3 transition-all">
                        <ArrowLeft className="w-5 h-5" /> Kembali ke Blog
                    </Link>
                    <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                        <Share2 className="w-5 h-5" /> Bagikan
                    </button>
                </div>
            </article>
        </div>
    );
};

export default BlogDetail;
