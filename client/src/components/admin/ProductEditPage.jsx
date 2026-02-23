import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Save, ArrowLeft, Loader, ChevronDown, Check } from 'lucide-react';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    // Custom category dropdown state
    const [showCatMenu, setShowCatMenu] = useState(false);
    const catBtnRef = useRef(null);
    const [catMenuPos, setCatMenuPos] = useState({ top: 0, left: 0, width: 0 });
    const CATEGORIES = ['Electronics', 'Men', 'Women', 'Kids', 'Home', 'Beauty'];

    const openCatMenu = () => {
        if (catBtnRef.current) {
            const r = catBtnRef.current.getBoundingClientRect();
            setCatMenuPos({
                top: r.bottom + 6,
                left: r.left,
                width: r.width,
            });
        }
        setShowCatMenu(true);
    };

    // Close dropdown on scroll or resize so fixed position stays in sync
    useEffect(() => {
        if (!showCatMenu) return;
        const close = () => setShowCatMenu(false);
        window.addEventListener('scroll', close, true);   // capture phase catches all scrollable parents
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [showCatMenu]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setImages(data.images || []);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setLoading(false);
            } catch (error) {
                console.error(error);
                showError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, showError]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/products/${id}`,
                {
                    name,
                    price,
                    image,
                    images,
                    brand,
                    category,
                    description,
                    countInStock,
                },
                config
            );

            showSuccess('Product updated successfully');
            setUpdateLoading(false);
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            showError('Failed to update product');
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </button>

            <div className="bg-white dark:bg-zinc-800/60 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700/50 p-8">
                <h1 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white mb-6">Edit Product</h1>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter brand name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            {/* Custom dropdown — uses fixed position so it's never clipped by overflow:hidden */}
                            <div className="relative">
                                <button
                                    type="button"
                                    ref={catBtnRef}
                                    onClick={openCatMenu}
                                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-left"
                                >
                                    <span className={category ? '' : 'text-gray-400 dark:text-gray-500'}>
                                        {category || 'Select Category'}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                                </button>

                                {showCatMenu && (
                                    <>
                                        {/* Backdrop */}
                                        <div className="fixed inset-0 z-40" onClick={() => setShowCatMenu(false)} />
                                        {/* Dropdown — fixed to viewport */}
                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: catMenuPos.top,
                                                left: catMenuPos.left,
                                                width: catMenuPos.width,
                                                zIndex: 9999,
                                            }}
                                            className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 py-1 overflow-hidden"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => { setCategory(cat); setShowCatMenu(false); }}
                                                    className={`flex items-center justify-between w-full px-4 py-2 text-sm transition-colors ${
                                                        category === cat
                                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                                    }`}
                                                >
                                                    {cat}
                                                    {category === cat && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* Hidden input so form validation works */}
                            <input type="hidden" value={category} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Count In Stock</label>
                            <input
                                type="number"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Image URL</label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter main image URL"
                                required
                            />
                        </div>
                    </div>

                    {/* Additional Images Section */}
                    <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-700">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Images (Optional)</label>
                            <button
                                type="button"
                                onClick={() => setImages([...images, ''])}
                                className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                                + Add Image URL
                            </button>
                        </div>
                        <div className="space-y-3">
                            {images.map((img, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => {
                                            const newImages = [...images];
                                            newImages[index] = e.target.value;
                                            setImages(newImages);
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        placeholder={`Extra Image URL ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {images.length === 0 && (
                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">No additional images added yet.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter product description"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={updateLoading}
                            className={`flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200/30 ${updateLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {updateLoading ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Update Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;
