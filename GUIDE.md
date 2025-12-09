# Panduan Lengkap Membangun E-Commerce Lumina

Panduan ini akan menuntun Anda langkah demi langkah untuk membangun website e-commerce modern menggunakan React, Vite, dan Tailwind CSS.

## 1. Instalasi & Setup Project

### Persiapan
Pastikan Anda sudah menginstal:
- **Node.js** (versi 18 atau terbaru)
- **Code Editor** (VS Code direkomendasikan)

### Langkah 1: Membuat Project React dengan Vite
Buka terminal dan jalankan perintah berikut:

```bash
npm create vite@latest lumina-store -- --template react
cd lumina-store
npm install
```

### Langkah 2: Instalasi Tailwind CSS
Instal Tailwind CSS dan dependensi pendukungnya:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

> **Catatan:** Jika Anda menggunakan Vite terbaru, file konfigurasi mungkin perlu menggunakan ekstensi `.cjs` jika Anda mengalami error saat build.

Instal library tambahan untuk icon dan routing:
```bash
npm install lucide-react react-router-dom clsx tailwind-merge
```

### Langkah 3: Konfigurasi Tailwind
Edit file `tailwind.config.js` (atau `.cjs`) untuk menambahkan warna brand Lumina:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumina: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
          accent: '#00f0ff', // Neon Cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

Tambahkan direktif Tailwind di `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
```

## 2. Struktur Folder

Buat struktur folder berikut di dalam `src/` agar project rapi:

```
src/
├── assets/         # Gambar dan icon statis
├── components/     # Komponen UI (Navbar, Card, Button)
├── context/        # State management (CartContext)
├── data/           # Data dummy (products.js)
├── hooks/          # Custom hooks
├── pages/          # Halaman utama (Home, Product, Cart)
├── App.jsx         # Routing utama
└── main.jsx        # Entry point
```

## 3. Implementasi Fitur

### A. Data Dummy & Context
Buat file `src/data/products.js` berisi array object produk (id, name, price, image, specs).
Kemudian buat `src/context/CartContext.jsx` untuk mengelola keranjang belanja menggunakan React Context.

### B. Komponen Dasar
1. **Navbar (`src/components/Navbar.jsx`)**: Responsive navbar dengan link ke Home, Products, dan icon Cart yang menampilkan jumlah item.
2. **Layout (`src/components/Layout.jsx`)**: Wrapper yang memuat Navbar dan Footer agar konsisten di setiap halaman.

### C. Halaman Utama
1. **Home (`src/pages/Home.jsx`)**:
   - **Hero Section**: Banner besar dengan gambar produk flagship dan tombol CTA (Call to Action).
   - **Featured Products**: Grid menampilkan 3 produk unggulan.

2. **Products (`src/pages/Products.jsx`)**:
   - Menampilkan semua produk dalam grid.
   - **Fitur Filter**: Dropdown kategori dan input search.
   - **Sorting**: Urutkan berdasarkan harga.

3. **Product Detail (`src/pages/ProductDetail.jsx`)**:
   - Mengambil ID dari URL (`useParams`).
   - Menampilkan gambar besar, spesifikasi lengkap, dan tombol "Tambah ke Keranjang".

4. **Cart & Checkout**:
   - **Cart (`src/pages/Cart.jsx`)**: List item di keranjang, bisa ubah quantity atau hapus item. Menampilkan total harga.
   - **Checkout (`src/pages/Checkout.jsx`)**: Form simulasi pengiriman dan pembayaran.

## 4. Menjalankan Project

Untuk menjalankan server development:
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

Untuk build production:
```bash
npm run build
npm run preview
```

## Tips Desain UI/UX 2025
- **Glassmorphism**: Gunakan transparansi dan blur (`backdrop-blur-md`, `bg-white/80`) untuk elemen yang menumpuk.
- **Gradient Text**: Gunakan `bg-gradient-to-r` dan `bg-clip-text` untuk judul agar terlihat futuristik.
- **Whitespace**: Berikan ruang yang cukup (`p-8`, `gap-8`) agar desain terlihat bersih dan premium.
- **Micro-interactions**: Tambahkan efek hover (`hover:scale-105`, `transition-all`) agar website terasa responsif.

Selamat mencoba! Project ini adalah fondasi yang solid untuk dikembangkan lebih lanjut dengan backend nyata (Node.js/Express atau Firebase).
