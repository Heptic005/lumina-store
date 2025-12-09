import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">Lumina</h3>
                            <p className="text-sm">Inovasi teknologi dalam genggaman Anda. Rasakan pengalaman smartphone masa depan.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Produk</h4>
                            <ul className="space-y-2 text-sm">
                                <li>Flagship Series</li>
                                <li>Mid-Range</li>
                                <li>Accessories</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li>Help Center</li>
                                <li>Warranty</li>
                                <li>Contact Us</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email Anda" className="bg-slate-800 border-none rounded px-3 py-2 text-sm w-full" />
                                <button className="bg-lumina-600 hover:bg-lumina-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
                        &copy; 2025 Lumina Smartphone. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
