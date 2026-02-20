import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Search, 
    HelpCircle, 
    Truck, 
    RefreshCw, 
    MessageSquare, 
    ShoppingBag, 
    CreditCard, 
    Mail, 
    ChevronRight,
    Star
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const HelpCenterPage = () => {
    const categories = [
        { title: "Ordering", icon: ShoppingBag, color: "bg-blue-500", items: ["Payment Methods", "Order Status", "Promotions"] },
        { title: "Delivery", icon: Truck, color: "bg-pink-500", items: ["Shipping Times", "Tracking Details", "International"] },
        { title: "Returns", icon: RefreshCw, color: "bg-purple-600", items: ["Return Policy", "Refund Process", "Exchanges"] },
        { title: "Your Account", icon: Star, color: "bg-amber-400", items: ["Login Security", "Profile Settings", "Wishlists"] },
    ];

    return (
        <PageTransition>
            <div className="bg-white dark:bg-black min-h-screen pb-32 transition-colors duration-500">
                {/* Visual Header */}
                <div className="bg-gray-50/50 dark:bg-black pt-20 pb-16 md:pt-24 md:pb-20 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[120px] -ml-44 -mt-44" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] -mr-44 -mb-44" />
                    </div>
                    
                    <div className="container mx-auto px-4 lg:px-12 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-pink-500 mb-8 shadow-sm"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Official Support Hub</span>
                        </motion.div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-['Outfit'] tracking-tighter leading-[1.1]">
                            Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">Center.</span>
                        </h1>
                        
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                            </div>
                            <input 
                                type="text"
                                placeholder="What can we help you find?"
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-16 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all shadow-sm focus:shadow-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-12 mt-8 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-[2.5rem] p-10 shadow-xl border border-gray-100 dark:border-white/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className={`w-14 h-14 rounded-3xl ${cat.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 font-['Outfit']">{cat.title}</h3>
                                <ul className="space-y-4">
                                    {cat.items.map((item, i) => (
                                        <li key={i}>
                                            <Link to="/faq" className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 flex items-center justify-between group/link">
                                                {item}
                                                <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Access Grid */}
                    <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link to="/track" className="group p-10 bg-gray-900 dark:bg-zinc-900 rounded-[2.5rem] text-white flex flex-col justify-between hover:bg-black dark:hover:bg-zinc-800 transition-all shadow-xl shadow-gray-900/10 border border-white/5">
                            <Truck className="w-8 h-8 text-pink-500 mb-8" />
                            <div>
                                <h4 className="text-2xl font-black font-['Outfit'] mb-2">Track Order</h4>
                                <p className="text-gray-400 text-sm font-light">Real-time status updates.</p>
                            </div>
                        </Link>
                        <Link to="/contact" className="group p-10 bg-pink-600 rounded-[2.5rem] text-white flex flex-col justify-between hover:bg-pink-700 transition-all shadow-xl shadow-pink-600/10">
                            <Mail className="w-8 h-8 text-white mb-8" />
                            <div>
                                <h4 className="text-2xl font-black font-['Outfit'] mb-2">Write to us</h4>
                                <p className="text-pink-100 text-sm font-light">Email our support team.</p>
                            </div>
                        </Link>
                        <div className="group p-10 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] text-gray-900 dark:text-white flex flex-col justify-between border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer">
                            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-8" />
                            <div>
                                <h4 className="text-2xl font-black font-['Outfit'] mb-2">Live Chat</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Instant executive support.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default HelpCenterPage;
