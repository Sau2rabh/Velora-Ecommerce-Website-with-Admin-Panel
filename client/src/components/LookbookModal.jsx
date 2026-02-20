import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const LookbookModal = ({ isOpen, onClose, product }) => {
    const { addToCart } = useCart();
    const { showSuccess } = useToast();

    if (!isOpen || !product) return null;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ ...product, qty: 1 });
        showSuccess(`Added ${product.name} to bag`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white/80 backdrop-blur-xl border border-white/40 p-5 rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto relative overflow-hidden"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>

                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>

                        <div className="flex gap-4">
                            <div className="w-24 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1 font-['Outfit']">{product.name}</h3>
                                    <p className="text-gray-500 text-xs mb-2">{product.brand || 'Velora Collection'}</p>
                                    <p className="font-bold text-pink-600">₹{product.price.toLocaleString('en-IN')}</p>
                                </div>
                                
                                <div className="flex gap-2 mt-3">
                                    <button 
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-black text-white text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-3 h-3" /> Add
                                    </button>
                                    <Link 
                                        to={`/product/${product._id}`}
                                        className="px-3 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LookbookModal;
