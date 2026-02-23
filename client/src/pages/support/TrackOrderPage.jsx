import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, IndianRupee, ArrowRight } from 'lucide-react';
import axios from 'axios';
import PageTransition from '../../components/PageTransition';

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId || !email) return;

        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/track?id=${orderId}&email=${email}`);
            setOrderData(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Order not found. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { label: 'Order Placed', date: orderData?.createdAt, icon: Clock, active: true },
        { label: 'Payment Confirmed', date: orderData?.paidAt, icon: IndianRupee, active: orderData?.isPaid },
        { label: 'Processing', date: null, icon: Package, active: orderData?.isPaid && !orderData?.isDelivered },
        { label: 'Out for Delivery', date: null, icon: Truck, active: orderData?.isDelivered },
        { label: 'Delivered', date: orderData?.deliveredAt, icon: CheckCircle, active: orderData?.isDelivered },
    ];

    return (
        <PageTransition>
            <div className="bg-white dark:bg-black min-h-screen transition-colors duration-500">
                {/* Header Section */}
                <div className="bg-gray-50/50 dark:bg-black pt-20 pb-16 md:pt-24 md:pb-20 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[120px] -ml-44 -mt-44" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] -mr-44 -mb-44" />
                    </div>
                    
                    <div className="container mx-auto px-4 lg:px-12 relative z-10 text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-['Outfit'] tracking-tighter leading-[1.1]"
                        >
                            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">Order</span>
                        </motion.h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                            Stay updated on your premium purchase. Enter your order details below to see the current status.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-12 mt-8 pb-24">
                    <div className="max-w-4xl mx-auto">
                        {/* Tracking Input Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-[2.5rem] shadow-2xl p-8 md:p-12 mb-12 border border-gray-100 dark:border-white/5 relative z-20"
                        >
                            <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-4">Order ID</label>
                                    <input 
                                        type="text" 
                                        placeholder="Order ID (e.g. 64f...)"
                                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-bold tracking-wide focus:ring-2 focus:ring-pink-500/20 dark:text-white dark:placeholder-gray-600 transition-all"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-4">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com"
                                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-bold tracking-wide focus:ring-2 focus:ring-pink-500/20 dark:text-white dark:placeholder-gray-600 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl py-5 font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xl shadow-gray-900/20 dark:shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? 'Searching...' : (
                                            <>Track Order <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-xs font-bold"
                                    >
                                        <AlertCircle className="w-4 h-4" /> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Order Status Display */}
                        <AnimatePresence>
                            {orderData && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 md:p-12"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-gray-200 dark:border-white/10">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-pink-600 mb-2">Review Status</p>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white font-['Outfit']">Order #{orderData._id.slice(-8).toUpperCase()}</h3>
                                        </div>
                                        <div className="px-6 py-3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                                            Status: {orderData.isDelivered ? 'Delivered' : orderData.isPaid ? 'Processing' : 'Awaiting Payment'}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative mt-20 mb-20 px-4 md:px-0">
                                        {/* Horizontal line */}
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -translate-y-1/2 rounded-full hidden md:block" />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                                            {steps.map((step, idx) => (
                                                <div key={idx} className="flex flex-col items-center group relative">
                                                    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center z-10 transition-all duration-500 ${
                                                        step.active 
                                                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 scale-110' 
                                                        : 'bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-white/10 text-gray-300 dark:text-gray-600'
                                                    }`}>
                                                        <step.icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="mt-6 text-center">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                                            {step.label}
                                                        </p>
                                                        {step.date && (
                                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">
                                                                {new Date(step.date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Items Summary (Mini) */}
                                    <div className="bg-white dark:bg-black/40 rounded-3xl p-6 border border-gray-100 dark:border-white/5 mt-12">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 ml-2">Shipment details</h4>
                                        <div className="space-y-4">
                                            {orderData.orderItems.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border dark:border-white/10" />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{item.name}</p>
                                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Qty: {item.qty}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white font-['Outfit']">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex justify-between items-center px-2">
                                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">Total Value</span>
                                            <span className="text-xl font-black text-pink-600 dark:text-pink-400 font-['Outfit']">₹{orderData.totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default TrackOrderPage;
