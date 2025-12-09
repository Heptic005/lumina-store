import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import OrderHistory from './pages/OrderHistory';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';



function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </Layout>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
