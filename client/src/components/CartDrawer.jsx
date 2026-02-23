import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems = [], removeFromCart, updateQuantity, getCartCount } = useCart();
    const navigate = useNavigate();

    const subtotal = (cartItems || []).reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);

    const handleCheckout = () => {
        closeCart();
        navigate('/cart');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-zinc-950 shadow-2xl z-[70] flex flex-col transition-colors duration-300"
                        >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-pink-600" />
                                <h2 className="text-xl font-bold font-['Outfit'] uppercase tracking-wider dark:text-white">Your Bag ({getCartCount()})</h2>
                            </div>
                            <button 
                                onClick={closeCart}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
                                        <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-neutral-700" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your bag is empty</h3>
                                    <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-[200px]">Looks like you haven't added anything to your bag yet.</p>
                                    <button 
                                        onClick={closeCart}
                                        className="mt-4 px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div 
                                        layout
                                        key={`${item._id}-${item.size}`} 
                                        className="flex gap-4 group"
                                    >
                                        {/* Image */}
                                        <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 font-['Outfit']">{item.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-xs text-gray-500 dark:text-neutral-400">{item.category}</p>
                                                        {item.size && (
                                                            <>
                                                                <span className="text-[10px] text-gray-300 dark:text-neutral-700">•</span>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-500">Size: {item.size}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item._id, item.size)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-full px-3 py-1">
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1), item.size)}
                                                        className="p-1 hover:text-pink-600 transition-colors dark:text-neutral-400 dark:hover:text-pink-400"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center dark:text-white">{item.qty}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.qty + 1, item.size)}
                                                        className="p-1 hover:text-pink-600 transition-colors dark:text-neutral-400 dark:hover:text-pink-400"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-950 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Subtotal</span>
                                    <span className="text-xl font-black text-gray-900 dark:text-white font-['Outfit']">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-neutral-500 text-center mb-4">Shipping & taxes calculated at checkout</p>
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
