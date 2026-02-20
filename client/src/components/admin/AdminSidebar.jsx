import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
    const location = useLocation();

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

    return (
        <div className="w-64 bg-zinc-950 text-white min-h-screen p-6 hidden lg:flex flex-col border-r border-zinc-800">
            <div className="mb-10 flex items-center gap-2">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-lg">V</span>
                 </div>
                 <span className="text-xl font-bold font-['Outfit']">Velora Admin</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link key={item.path} to={item.path}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                active 
                                ? 'bg-indigo-600/10 text-indigo-400 font-medium' 
                                : 'text-gray-400 hover:bg-zinc-900 hover:text-white'
                            }`}>
                                <item.icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
                                <span>{item.name}</span>
                                {active && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className="pt-6 border-t border-zinc-800">
                 <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                 </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
