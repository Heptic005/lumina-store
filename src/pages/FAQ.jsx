import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "Bagaimana cara melakukan pemesanan?",
        answer: "Anda dapat memilih produk yang diinginkan, menambahkannya ke keranjang, dan mengikuti langkah-langkah di halaman checkout. Kami menerima berbagai metode pembayaran termasuk transfer bank dan kartu kredit."
    },
    {
        question: "Berapa lama pengiriman barang?",
        answer: "Waktu pengiriman tergantung pada lokasi Anda. Untuk Jabodetabek biasanya 1-2 hari kerja, sedangkan untuk luar Jabodetabek bisa memakan waktu 3-5 hari kerja."
    },
    {
        question: "Apakah ada garansi untuk produk Lumina?",
        answer: "Ya, semua smartphone Lumina dilengkapi dengan garansi resmi selama 1 tahun. Aksesoris memiliki masa garansi 6 bulan."
    },
    {
        question: "Bagaimana cara melacak pesanan saya?",
        answer: "Setelah pesanan dikirim, Anda akan menerima nomor resi melalui email. Anda juga dapat mengecek status pesanan di menu 'Riwayat Pesanan' jika Anda sudah login."
    },
    {
        question: "Apakah bisa melakukan pengembalian barang?",
        answer: "Kami menerima pengembalian barang jika terdapat cacat produksi atau kesalahan pengiriman dalam waktu 7 hari setelah barang diterima. Silakan hubungi layanan pelanggan kami untuk proses lebih lanjut."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-3xl font-bold text-primary mb-4">Pertanyaan yang Sering Diajukan</h1>
                <p className="text-secondary max-w-2xl mx-auto">
                    Temukan jawaban untuk pertanyaan umum seputar produk, pemesanan, dan layanan Lumina.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-surface border border-white/5 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-accent/5"
                    >
                        <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                            onClick={() => toggleFAQ(index)}
                        >
                            <span className="font-semibold text-primary">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-accent" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-secondary" />
                            )}
                        </button>

                        <div
                            className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <p className="text-secondary leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center bg-surface rounded-2xl p-8 border border-white/5">
                <h3 className="font-bold text-lg text-primary mb-2">Masih punya pertanyaan?</h3>
                <p className="text-secondary mb-6">Tim support kami siap membantu Anda 24/7.</p>
                <Link to="/contact" className="bg-accent text-background px-6 py-2.5 rounded-full font-medium hover:bg-accent/80 transition-colors inline-block">
                    Hubungi Kami
                </Link>
            </div>
        </div>
    );
};

export default FAQ;
