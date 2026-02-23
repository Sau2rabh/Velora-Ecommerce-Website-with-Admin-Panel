import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import { Search, ShoppingBag, User, Heart, Menu, X, LogOut, Package, LayoutDashboard, ChevronDown, Moon, Sun, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { getCartCount, openCart } = useCart();
    const { wishlistItems } = useWishlist();

    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileOpen && !event.target.closest('.profile-dropdown-container')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);


    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const logoutHandler = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchFocused(false);
        }
    };

    const navLinks = [
        { name: 'Electronics', path: '/products?category=electronics' },
        { name: 'Men', path: '/products?category=men' },
        { name: 'Women', path: '/products?category=women' },
        { name: 'Kids', path: '/products?category=kids' },
        { name: 'Home', path: '/products?category=home' },
        { name: 'Beauty', path: '/products?category=beauty' },
    ];

    return (
        <>
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className={`sticky top-0 z-50 w-full transition-all duration-500 ${
                    scrolled 
                    ? isDarkMode ? 'bg-black/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/10' : 'bg-white/80 backdrop-blur-2xl shadow-sm border-b border-gray-100/50' 
                    : 'bg-transparent border-b border-transparent'
                }`}
            >
                <div className="container mx-auto px-4 xl:px-12 min-h-[6rem] py-4 xl:py-0 flex flex-wrap xl:flex-nowrap items-center justify-between gap-y-4">
                    
                    {/* Logo & Categories */}
                    <div className="flex items-center gap-6 xl:gap-12 flex-shrink-0 order-1">
                        <Link to="/" className="flex items-center shrink-0 group">
                            <motion.span 
                                whileHover={{ scale: 1.02 }}
                                className={`text-4xl font-black tracking-tighter font-['Outfit'] transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            >
                                Velora<span className="text-pink-600">.</span>
                            </motion.span>
                        </Link>
                        
                        <div className="hidden xl:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className="relative py-2 group"
                                >
                                    <span className={`text-xs font-bold tracking-[0.2em] transition-colors duration-300 uppercase font-sans ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'}`}>
                                        {link.name}
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-purple-600 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </Link>
                            ))}
                        </div>
                    </div>



                    {/* Right Actions */}
                    <div className="flex items-center gap-4 md:gap-6 order-2 xl:order-3">
                        {/* Profile */}
                        <div className="relative z-[60] profile-dropdown-container">
                            {!user ? (
                                <Link to="/login" className="flex flex-col items-center cursor-pointer group">
                                    <User className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-black'}`} strokeWidth={1.5} />
                                </Link>
                            ) : (
                                <>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsProfileOpen(!isProfileOpen);
                                        }}
                                        className="flex flex-col items-center cursor-pointer focus:outline-none group"
                                    >
                                        <User className={`h-5 w-5 transition-colors ${isProfileOpen ? (isDarkMode ? 'text-white' : 'text-pink-600') : (isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-black')}`} strokeWidth={1.5} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className={`absolute top-full right-0 mt-4 w-64 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-black border-white/10' : 'bg-white border-gray-100'}`}
                                            >
                                                <div className="p-2">
                                                    <div className={`px-4 py-3 border-b mb-1 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                        <p className={`text-sm font-bold truncate font-['Outfit'] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name || 'User'}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
                                                    </div>
                                                    
                                                    <Link 
                                                        to="/profile" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        My Profile
                                                    </Link>
                                                    
                                                    <Link 
                                                        to="/orders" 
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        <Package className="w-4 h-4" />
                                                        My Orders
                                                    </Link>

                                                    <button 
                                                        onClick={() => {
                                                            toggleTheme();
                                                        }}
                                                        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                                                            Switch Appearance
                                                        </div>
                                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-purple-600' : 'bg-gray-200'}`}>
                                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} />
                                                        </div>
                                                    </button>

                                                    <div className={`border-t my-1 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}></div>
                                                    <button 
                                                        onClick={() => {
                                                            logoutHandler();
                                                            setIsProfileOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link to="/wishlist" className="flex flex-col items-center cursor-pointer group relative">
                             <Heart className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-pink-500' : 'text-gray-700 group-hover:text-pink-600'}`} strokeWidth={1.5} />
                             <AnimatePresence>
                                {wishlistItems.length > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-lg shadow-pink-500/20"
                                    >
                                        {wishlistItems.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Bag */}
                        <button onClick={openCart} className="flex items-center gap-2 cursor-pointer group relative">
                            <div className="relative">
                                <ShoppingBag className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-black'}`} strokeWidth={1.5} />
                                <AnimatePresence>
                                    {getCartCount() > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-lg ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                                        >
                                            {getCartCount()}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                        
                        {/* Mobile Menu Button */}
                        <button className="xl:hidden" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className={`h-6 w-6 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`} /> : <Menu className={`h-6 w-6 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`xl:hidden border-t overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-black border-white/10' : 'bg-white border-gray-100'}`}
                        >
                            <div className="px-6 py-4 space-y-4">
                                {/* Mobile Search */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        className={`w-full border-none outline-none text-sm font-medium rounded-xl py-3 pl-10 pr-4 transition-all ${
                                            isDarkMode ? 'bg-white/5 text-white placeholder-gray-500 focus:bg-white/10' : 'bg-gray-100/50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-pink-100'
                                        }`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(e);
                                                setIsOpen(false);
                                            }
                                        }}
                                    />
                                </div>

                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name} 
                                        to={link.path}
                                        className={`block text-xl font-bold transition-colors tracking-tight font-['Outfit'] ${isDarkMode ? 'text-white hover:text-pink-500' : 'text-gray-900 hover:text-pink-600'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
}

export default Navbar;
