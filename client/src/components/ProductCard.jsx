import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showSuccess } = useToast();
    const { toggleWishlist, isInWishlist, removeFromWishlist } = useWishlist();

    // Generate mock data for design if missing
    const rating = product.rating || 4.5;
    const reviewCount = product.numReviews || Math.floor(Math.random() * 50) + 10;
    const discount = product.discount || 0;
    const isNew = product.createdAt ? new Date(product.createdAt) > new Date(Date.now() - 30*24*60*60*1000) : true;

    const handleAddToCart = () => {
        addToCart(product);
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        }
        showSuccess(`Added ${product.name} to bag`);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-black/50">
                <Link to={`/product/${product._id}`}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop"; }}
                    />
                </Link>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                    {isNew && (
                        <span className="px-3 py-1 bg-black/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                            New
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="px-3 py-1 bg-pink-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0 shadow-lg z-20 ${
                        isInWishlist(product._id) 
                        ? 'bg-pink-500 text-white shadow-pink-300/50' 
                        : 'bg-white text-pink-500 shadow-black/20 hover:bg-pink-500 hover:text-white hover:shadow-pink-300/50'
                    }`}
                >
                    <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} strokeWidth={2} />
                </button>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-0.5 ml-1">({reviewCount})</span>
                </div>

                <Link to={`/product/${product._id}`} className="block group/title">
                    <h3 className="text-gray-900 dark:text-white font-bold text-base mb-1 truncate group-hover/title:text-pink-600 dark:group-hover/title:text-pink-400 transition-colors font-['Outfit'] tracking-wide">
                        {product.name}
                    </h3>
                </Link>
                
                <p className="text-gray-400 dark:text-gray-500 text-xs mb-4 line-clamp-1 font-medium font-sans">{product.category}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-['Outfit']">
                            ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group/btn relative overflow-hidden ${
                            product.countInStock === 0 
                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-gray-900 to-black dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-pink-500/30'
                        }`}
                    >
                        <ShoppingCart className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                    </button>
                </div>
                
                {/* Stock Indicator (if low stock and not sold out) */}
                {product.countInStock > 0 && product.countInStock < 10 && (
                     <div className="mt-4">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                            <span>Only {product.countInStock} Left</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 rounded-full w-[30%]"></div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
