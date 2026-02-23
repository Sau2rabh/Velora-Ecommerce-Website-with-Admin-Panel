import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', name: 'Products', icon: Package },
        { path: '/admin/orders', name: 'Orders', icon: ShoppingBag },
        { path: '/admin/users', name: 'Users', icon: Users },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const NavLinks = ({ onClose }) => (
        <>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} to={item.path} onClick={onClose}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                                active
                                ? 'bg-indigo-600/10 text-indigo-400 font-medium'
                                : 'text-gray-400 hover:bg-zinc-900 hover:text-white'
                            }`}>
                                <item.icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
                                <span>{item.name}</span>
                                {active && (
                                    <motion.div
                                        layoutId="activeIndicatorSidebar"
                                        className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-zinc-800 space-y-2">
                {/* Appearance Toggle */}
                <div className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Appearance</p>
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between"
                        aria-label="Toggle dark mode"
                    >
                        <div className="flex items-center gap-2">
                            {isDarkMode ? (
                                <Moon className="w-4 h-4 text-indigo-400" />
                            ) : (
                                <Sun className="w-4 h-4 text-amber-400" />
                            )}
                            <span className="text-sm font-medium text-gray-300">
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>
                        <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                            <motion.div
                                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md"
                                animate={{ left: isDarkMode ? '22px' : '2px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </button>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* ── Desktop sidebar ── */}
            <div className="w-64 bg-zinc-950 text-white min-h-screen p-6 hidden lg:flex flex-col border-r border-zinc-800 relative">
                <div className="mb-10 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-lg">V</span>
                    </div>
                    <span className="text-xl font-bold font-['Outfit']">Velora Admin</span>
                </div>
                <NavLinks onClose={() => {}} />
            </div>

            {/* ── Mobile top navbar ── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-950 border-b border-zinc-800 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm">V</span>
                    </div>
                    <span className="text-white text-lg font-bold font-['Outfit']">Velora Admin</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* ── Mobile drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-zinc-950 text-white p-6 flex flex-col border-r border-zinc-800 shadow-2xl"
                        >
                            {/* Drawer header */}
                            <div className="mb-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="font-bold text-lg">V</span>
                                    </div>
                                    <span className="text-xl font-bold font-['Outfit']">Velora Admin</span>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <NavLinks onClose={() => setMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
