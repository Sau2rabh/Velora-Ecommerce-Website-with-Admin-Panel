import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Filter, Search, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';

import FilterSidebar from '../components/FilterSidebar';
import PageTransition from '../components/PageTransition';
import ProductSkeleton from '../components/ProductSkeleton';

const ProductsPage = () => {
    const location = useLocation();

    // Initialize state from URL params
    const getInitialParams = () => {
        const searchParams = new URLSearchParams(location.search);
        return {
            category: searchParams.get('category') ? (searchParams.get('category').charAt(0).toUpperCase() + searchParams.get('category').slice(1)) : 'All',
            search: searchParams.get('search') || ''
        };
    };

    const initialParams = getInitialParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialParams.search);
    const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
    const [sortBy, setSortBy] = useState('recommended');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // Filter Accordion State
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        colors: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Sync state with URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        const searchParam = params.get('search');

        if (categoryParam) {
            setSelectedCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1));
        } else {
            setSelectedCategory('All');
        }

        if (searchParam) {
            setSearchTerm(searchParam);
        } else {
            setSearchTerm('');
        }
    }, [location.search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/products');
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    // Price Filter Logic
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

    const checkPrice = (price, ranges) => {
        if (ranges.length === 0) return true;
        
        return ranges.some(range => {
            if (range === 'Under ₹500') return price < 500;
            if (range === '₹500 - ₹1000') return price >= 500 && price <= 1000;
            if (range === '₹1000 - ₹5000') return price >= 1000 && price <= 5000;
            if (range === '₹5000 - ₹10000') return price >= 5000 && price <= 10000;
            if (range === 'Above ₹10000') return price > 10000;
            return false;
        });
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesPrice = checkPrice(product.price, selectedPriceRanges);
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        return 0; // Default (Recommended)
    });

    // Fixed Categories matching the dropdown
    const categories = ['All', 'Electronics', 'Men', 'Women', 'Kids', 'Home', 'Beauty'];

    return (
        <PageTransition>
        <div className="bg-white dark:bg-black min-h-screen pb-32 transition-colors duration-500">
             {/* Hero Section for Products - Only show when not searching */}

            {/* ... (container content managed by component logic inside ProductPage, but for PageTransition it wraps the root div) ... */}
            
            <div className="container mx-auto px-4 lg:px-8 mt-4">
                 {/* ... Toolbar ... */}
                <div className="flex flex-wrap justify-between items-center mb-10 sticky top-20 bg-white/90 dark:bg-black/90 backdrop-blur-md z-30 py-4 border-b border-gray-100 dark:border-white/5 transition-colors duration-500">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                        <span className="text-gray-300 dark:text-gray-700">|</span>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{sortedProducts.length} Products</span>
                    </div>

                    <div className="flex items-center gap-6">
                         {/* Elements removed as per request */}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 relative">
                    {/* Filters Sidebar */}
                    <FilterSidebar 
                        showMobileFilters={showMobileFilters}
                        setShowMobileFilters={setShowMobileFilters}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories}
                        selectedPriceRanges={selectedPriceRanges}
                        setSelectedPriceRanges={setSelectedPriceRanges}
                    />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-10">
                                 {[...Array(6)].map((_, i) => (
                                     <ProductSkeleton key={i} />
                                 ))}
                             </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-10">
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                        
                        {!loading && sortedProducts.length === 0 && (
                            <div className="text-center py-40">
                                <h3 className="text-2xl font-bold uppercase tracking-tighter text-gray-200 dark:text-gray-700 mb-4 font-['Outfit']">No Products Found</h3>
                                <button 
                                    onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedPriceRanges([]);}}
                                    className="text-xs font-bold border-b border-black dark:border-white pb-1 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-600 dark:hover:border-pink-400 transition-colors uppercase tracking-widest"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </PageTransition>
    );
}

export default ProductsPage;
