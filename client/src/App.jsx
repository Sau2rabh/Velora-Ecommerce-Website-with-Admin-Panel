import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage'; 
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import LookbookPage from './pages/LookbookPage';
import AboutPage from './pages/AboutPage';

// Support Pages
import FAQPage from './pages/support/FAQPage';
import TrackOrderPage from './pages/support/TrackOrderPage';
import ContactPage from './pages/support/ContactPage';
import HelpCenterPage from './pages/support/HelpCenterPage';
import PolicyPage from './pages/support/PolicyPage';
import LiveChatButton from './components/LiveChatButton';

import ProductList from './components/admin/ProductList';
import ProductEditPage from './components/admin/ProductEditPage';
import OrderList from './components/admin/OrderList';
import UserList from './components/admin/UserList';
import AdminLayout from './components/admin/AdminLayout';
import { ToastProvider } from './context/ToastContext';

import { AnimatePresence } from 'framer-motion';
import React from 'react';

// Policy Data
const shippingPolicy = {
    title: "Shipping Policy",
    subtitle: "Premium delivery for your luxury lifestyle.",
    lastUpdated: "Feb 2026",
    content: [
        { heading: "Standard Delivery", text: "We offer complimentary standard shipping on all orders over ₹5,000. For orders under this amount, a nominal flat fee of ₹150 applies.", list: ["Processing time: 1-2 business days", "Delivery time: 3-5 business days"] },
        { heading: "Express Shipping", text: "Need your fashion fast? Choose express shipping at checkout for flat ₹500.", list: ["Delivery within 24-48 hours", "Available in major Tier-1 cities"] },
        { heading: "International Shipping", text: "Currently we only ship within India. Stay tuned for our international launch coming soon." }
    ]
};

const returnsPolicy = {
    title: "Returns & Refund",
    subtitle: "Hassle-free experience for your peace of mind.",
    lastUpdated: "Feb 2026",
    content: [
        { heading: "14-Day Returns", text: "You can return your items within 14 days of delivery. Items must be in original packaging with tags intact.", list: ["Unworn and unwashed", "Original invoice included"] },
        { heading: "Refund Process", text: "Refunds are processed to the original payment method within 5-7 business days after the quality check." },
        { heading: "Non-Returnable Items", text: "For hygiene reasons, innerwear and beauty products cannot be returned once the seal is broken." }
    ]
};

const privacyPolicy = {
    title: "Privacy Policy",
    subtitle: "Your data is handled with ultimate integrity.",
    lastUpdated: "Feb 2026",
    content: [
        { heading: "Data Collection", text: "We collect only essential information to process your orders and personalize your shopping experience." },
        { heading: "Security Measures", text: "Velora uses enterprise-grade encryption to protect your sensitive data and transaction details." }
    ]
};

import { ThemeProvider, useTheme } from './context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const { isDarkMode } = useTheme();

    return (
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} font-sans`}>
            {!isAuthPage && <Navbar />}
            <CartDrawer />
            <LiveChatButton />
            <main className={`flex-grow ${!isAuthPage ? 'container mx-auto px-4 lg:px-12 py-8' : ''}`}>
               <AnimatePresence mode="wait">
                 {React.cloneElement(children, { key: location.pathname, location: location })}
               </AnimatePresence>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
            <ToastProvider>
              <WishlistProvider>
                <Router>
                    <Routes>
                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<ProductList />} />
                            <Route path="product/:id/edit" element={<ProductEditPage />} />
                            <Route path="orders" element={<OrderList />} />
                            <Route path="users" element={<UserList />} />
                        </Route>

                        {/* Public Routes */}
                        <Route path="*" element={
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/products" element={<ProductsPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/product/:id" element={<ProductPage />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/wishlist" element={<WishlistPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/orders" element={<MyOrdersPage />} />
                                    <Route path="/order/:id" element={<OrderDetailsPage />} />
                                    <Route path="/lookbook" element={<LookbookPage />} />

                                    {/* Support Routes */}
                                    <Route path="/help" element={<HelpCenterPage />} />
                                    <Route path="/faq" element={<FAQPage />} />
                                    <Route path="/track" element={<TrackOrderPage />} />
                                    <Route path="/contact" element={<ContactPage />} />
                                    <Route path="/shipping" element={<PolicyPage {...shippingPolicy} />} />
                                    <Route path="/returns" element={<PolicyPage {...returnsPolicy} />} />
                                    <Route path="/privacy" element={<PolicyPage {...privacyPolicy} />} />
                                    <Route path="/terms" element={<PolicyPage title="Terms of Service" subtitle="Standard agreement for using our platform." lastUpdated="Feb 2026" content={[{heading: "Usage Terms", text: "By using Velora, you agree to follow our guidelines..."}]} />} />
                                    <Route path="/cookies" element={<PolicyPage title="Cookie Policy" subtitle="How we use cookies to improve your experience." lastUpdated="Feb 2026" content={[{heading: "Cookie Use", text: "We use cookies for authentication and performance tracking..."}]} />} />
                                    <Route path="/about" element={<AboutPage />} />

                                    <Route path="/profile" element={<ProfilePage />} />
                                </Routes>
                            </Layout>
                        } />
                    </Routes>
                </Router>
              </WishlistProvider>
            </ToastProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
