import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistPage = () => {
    const { wishlistItems } = useWishlist();

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="container mx-auto px-4 lg:px-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-black mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 font-['Outfit'] tracking-tight flex items-center gap-3">
                            My Wishlist
                            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </div>
                </div>

                {/* Content */}
                {wishlistItems.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100"
                    >
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-pink-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Outfit']">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Transform your wardrobe with our latest collections. Heart your favorites to save them here.
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
                        >
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlistItems.map((product, index) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
