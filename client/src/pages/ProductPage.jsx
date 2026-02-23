import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Star, ShoppingBag, Heart, Truck, Tag } from 'lucide-react';

const ProductPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showError, showSuccess } = useToast();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [pincode, setPincode] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        const needsSize = ['men', 'women', 'kids'].includes(product.category?.toLowerCase());
        if (needsSize && !selectedSize) {
            showError('Please select a size');
            return;
        }
        addToCart(product, 1, selectedSize); // Default quantity 1 with selected size
        showSuccess('Added to cart');
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div></div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    const sizes = ['XS', 'S', 'M', 'L', 'XL']; // Placeholder sizes if not in DB

    const productImages = product ? Array.from(new Set([
        product.image,
        ...(product.images && Array.isArray(product.images) ? product.images.filter(img => img.trim() !== '') : [])
    ])) : [];

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-8 pb-12 transition-colors duration-500">
            <div className="container mx-auto px-4 lg:px-12">
                 {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                    <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link> / <Link to="/products" className="hover:text-pink-600 transition-colors">Clothing</Link> / <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px]">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Visual Section - Flipkart Style Slider */}
                    <div className="w-full lg:w-1/2 md:max-w-xl mx-auto flex flex-col-reverse md:flex-row gap-4 h-full"> {/* h-full maintains relative sizing */}
                        {/* Thumbnails (Left on desktop, Bottom on mobile) */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 md:flex-shrink-0">
                            {productImages.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                                        currentImageIndex === idx 
                                        ? 'border-pink-500 shadow-md' 
                                        : 'border-transparent hover:border-gray-300 dark:hover:border-white/20'
                                    }`}
                                    onMouseEnter={() => setCurrentImageIndex(idx)}
                                >
                                    <img src={img} alt={`${product.name} view ${idx+1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* Main Image View */}
                        <div 
                            className="flex-1 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden relative group cursor-crosshair aspect-[3/4] md:aspect-auto md:min-h-[500px] z-10"
                            onMouseMove={(e) => {
                                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - left) / width) * 100;
                                const y = ((e.clientY - top) / height) * 100;
                                const imgElement = e.currentTarget.querySelector('img');
                                if (imgElement) {
                                    imgElement.style.transformOrigin = `${x}% ${y}%`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                const imgElement = e.currentTarget.querySelector('img');
                                if (imgElement) {
                                    imgElement.style.transformOrigin = `center center`;
                                }
                            }}
                        >
                            <img 
                                src={productImages[currentImageIndex]} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[2.5]" 
                            />
                        </div>
                    </div>

                    {/* Details Section - Sticky */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="sticky top-24">
                            <h1 className="text-2xl font-bold uppercase tracking-wider mb-1 text-gray-900 dark:text-white">{product.brand || "Brand Name"}</h1>
                            <h2 className="text-xl text-gray-500 dark:text-gray-400 font-light mb-4">{product.name}</h2>

                            <div className="flex items-center space-x-4 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price?.toLocaleString('en-IN')}</span>
                                <span className="text-lg text-gray-400 line-through">₹{Math.round(product.price * 1.4).toLocaleString('en-IN')}</span>
                                <span className="text-lg text-orange-500 font-bold dark:text-pink-400">(40% OFF)</span>
                            </div>
                            
                            <p className="text-green-600 dark:text-green-400 font-bold text-xs mb-6">inclusive of all taxes</p>

                            {/* Size Selector - Only for Men, Women, Kids */}
                            {['men', 'women', 'kids'].includes(product.category?.toLowerCase()) && (
                                <div className="mb-8">
                                     <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-sm uppercase text-gray-800 dark:text-white">Select Size</h4>
                                        <span className="text-pink-600 dark:text-pink-400 font-bold text-xs cursor-pointer">SIZE CHART</span>
                                     </div>
                                     <div className="flex space-x-4">
                                        {sizes.map(size => (
                                            <button 
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-sm transition-all ${
                                                    selectedSize === size 
                                                        ? 'border-pink-500 text-pink-500 ring-1 ring-pink-500 shadow-md' 
                                                        : 'border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-400 hover:border-pink-500 dark:bg-white/5'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                     </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-4 mb-8">
                                <button 
                                    onClick={addToCartHandler}
                                    className="flex-1 bg-pink-500 dark:bg-white text-white dark:text-black font-bold py-4 rounded uppercase tracking-wider hover:bg-pink-600 dark:hover:bg-gray-200 shadow-lg flex items-center justify-center transition-all"
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" /> Add to Bag
                                </button>
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className={`flex-1 font-bold py-4 rounded uppercase tracking-wider flex items-center justify-center transition-all border ${
                                        isInWishlist(product._id)
                                            ? 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-500/10 dark:border-pink-500/20 dark:text-pink-400'
                                            : 'bg-white dark:bg-transparent border-gray-300 dark:border-white/10 text-gray-700 dark:text-white hover:border-gray-900 dark:hover:border-white'
                                    }`}
                                >
                                    <Heart className={`h-5 w-5 mr-2 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                                    {isInWishlist(product._id) ? 'Wishlisted' : 'Wishlist'}
                                </button>
                            </div>

                            {/* Delivery Options */}
                            <div className="mb-8">
                                <h4 className="font-bold text-sm uppercase mb-3 flex items-center text-gray-800 dark:text-white">Available Offers <Tag className="h-4 w-4 ml-2" /></h4>
                                 <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                                    <li className="flex items-start">
                                        <span className="font-bold mr-1">Bank Offer:</span> 10% off on HDFC Bank Credit Cards.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-1">Special Price:</span> Get extra 5% off on 2 or more items.
                                    </li>
                                 </ul>

                                <h4 className="font-bold text-sm uppercase mb-2 flex items-center text-gray-800 dark:text-white">Delivery Options <Truck className="h-4 w-4 ml-2" /></h4>
                                <div className="flex items-center border border-gray-300 dark:border-white/5 rounded p-1 max-w-xs bg-white dark:bg-white/5">
                                    <input 
                                        type="text" 
                                        placeholder="Enter Pincode"
                                        className="flex-1 p-2 outline-none text-sm bg-transparent text-gray-800 dark:text-white"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                    />
                                    <button className="text-pink-600 dark:text-pink-400 font-bold text-xs uppercase px-4">Check</button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
                            </div>

                            {/* Product Details Text */}
                            <div className="border-t border-gray-100 dark:border-white/5 pt-6">
                                <h4 className="font-bold text-sm uppercase mb-4 text-gray-800 dark:text-white">Product Details</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{product.description}</p>
                                 <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
                                    {product.material && <p><span className="font-bold text-gray-800 dark:text-white">Material:</span> {product.material}</p>}
                                    {product.care && <p><span className="font-bold text-gray-800 dark:text-white">Care:</span> {product.care}</p>}
                                    {product.fit && <p><span className="font-bold text-gray-800 dark:text-white">Fit:</span> {product.fit}</p>}
                                    {/* Map arbitrary details if they exist as an object */}
                                    {product.details && Object.entries(product.details).map(([key, value]) => (
                                        <p key={key}><span className="font-bold text-gray-800 dark:text-white capitalize">{key}:</span> {value}</p>
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
