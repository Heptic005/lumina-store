import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate sending message (or implement real logic if needed later)
        // For now just simulate delay
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);

        // Optional: Save to supabase functionality could be added here
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen pt-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-primary mb-4">Hubungi Kami</h1>
                <p className="text-secondary max-w-2xl mx-auto text-lg">
                    Kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika ada pertanyaan atau masukan.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-primary">
                {/* Contact Information */}
                <div>
                    <h2 className="text-2xl font-bold mb-8">Informasi Kontak</h2>
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Alamat Kantor</h3>
                                <p className="text-secondary">
                                    Lumina Tower, Lantai 12<br />
                                    Jalan Teknologi No. 1<br />
                                    Jakarta Selatan, 12345<br />
                                    Indonesia
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Email</h3>
                                <p className="text-secondary">support@lumina.id</p>
                                <p className="text-secondary">sales@lumina.id</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Telepon</h3>
                                <p className="text-secondary">+62 21 5555 8888</p>
                                <p className="text-secondary">Mon - Fri, 09:00 - 18:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-surface rounded-3xl p-8 border border-white/5">
                    <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Subjek</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                                placeholder="Pertanyaan tentang produk..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Pesan</label>
                            <textarea
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                                placeholder="Tulis pesan Anda di sini..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-accent text-background font-bold py-4 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? (
                                'Mengirim...'
                            ) : (
                                <>
                                    Kirim Pesan <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {status === 'success' && (
                            <div className="bg-green-500/10 text-green-500 p-4 rounded-xl text-center text-sm font-medium animate-fade-in">
                                Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
