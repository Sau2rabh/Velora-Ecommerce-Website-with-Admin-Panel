import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import ConfirmationModal from '../ConfirmationModal';

const ProductList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://127.0.0.1:5000/api/products');
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            showError('Failed to fetch products');
            setLoading(false);
        }
    };

    const deleteHandler = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` },
                    };
                    await axios.delete(`http://127.0.0.1:5000/api/products/${id}`, config);
                    showSuccess('Product deleted successfully');
                    fetchProducts();
                } catch (error) {
                    console.error(error);
                    showError('Failed to delete product');
                }
            }
        });
    };

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const categories = ['All', 'Electronics', 'Men', 'Women', 'Kids', 'Home', 'Beauty'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const createProductHandler = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post('http://127.0.0.1:5000/api/products', {}, config);
            navigate(`/admin/product/${data._id}/edit`);
            // showSuccess('Product created successfully'); // Removed as per user request to show success only after update
        } catch (error) {
            console.error(error);
            showError('Failed to create product');
        }
    };

    return (
        <div className="space-y-6">
            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-['Outfit'] text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
                </div>
                <button onClick={createProductHandler} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <Plus className="h-4 w-4 mr-2" /> Add New Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 rounded-t-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button 
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${selectedCategory !== 'All' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'}`}
                        >
                            <Filter className="h-4 w-4 mr-2" /> 
                            {selectedCategory === 'All' ? 'Filter' : selectedCategory}
                        </button>

                        {showFilterMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter by Category</span>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setShowFilterMenu(false);
                                                }}
                                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedCategory === category ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-gray-700'}`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading products...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">{product.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{product.price?.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${product.countInStock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => navigate(`/admin/product/${product._id}/edit`)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteHandler(product._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
