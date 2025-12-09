import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login, signUp } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await login(email, password);
                navigate('/');
            } else {
                await signUp(email, password);
                // Supabase might require email confirmation, but for now let's assume auto-login or message
                // If auto-confirm is off, we might need to tell user to check email.
                // But usually for dev it's fine.
                // Let's try to login immediately after signup if supabase doesn't auto-session
                // Actually signUp usually returns session if email confirm is off.
                // If email confirm is on, we should show a message.
                alert('Registrasi berhasil! Silakan masuk.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-white/5 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
                    </h1>
                    <p className="text-secondary">
                        {isLogin ? 'Masuk untuk mengakses akun Lumina Anda' : 'Daftar untuk mulai berbelanja'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none transition-all text-primary placeholder-secondary/50"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-background border border-white/10 rounded-xl focus:ring-2 focus:ring-accent focus:outline-none transition-all text-primary placeholder-secondary/50"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-accent focus:ring-accent bg-background border-white/10" />
                                <span className="text-secondary">Ingat saya</span>
                            </label>
                            <a href="#" className="text-accent font-medium hover:text-accent/80">Lupa password?</a>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-background py-3 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Memproses...' : (
                            <>
                                {isLogin ? 'Masuk' : 'Daftar'} <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-secondary">
                    {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-accent font-bold hover:text-accent/80"
                    >
                        {isLogin ? 'Daftar Sekarang' : 'Masuk Disini'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
