import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            // Fetch orders
            fetchMyOrders();
        }
    }, [user, navigate]);

    const fetchMyOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/orders/myorders', config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({ name, email, password });
            showSuccess("Profile updated successfully!");
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            showError(error);
            setMessage(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-8 transition-colors duration-500">
            <div className="container mx-auto px-4 lg:px-12 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">User Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">User Details</h2>
                            {message && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-4">{message}</div>}
                            <form onSubmit={submitHandler} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
                                    <input 
                                        required
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                        placeholder="Leave blank to keep same"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Orders</h2>
                        {orders.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                <p className="text-gray-500 dark:text-gray-400">You have no orders yet.</p>
                            </div>
                        ) : (
                             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                 <div className="overflow-x-auto">
                                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                         <thead className="bg-gray-50 dark:bg-gray-800/50">
                                             <tr>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivered</th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                                             </tr>
                                         </thead>
                                         <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                             {orders.map((order) => (
                                                 <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order._id}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.createdAt.substring(0, 10)}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {order.isPaid ? <span className="text-green-600 dark:text-green-500 font-bold">Paid</span> : <span className="text-red-600 dark:text-red-500 font-bold">Not Paid</span>}
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {order.isDelivered ? <span className="text-green-600 dark:text-green-500 font-bold">Delivered</span> : <span className="text-red-600 dark:text-red-500 font-bold">Not Delivered</span>}
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                         <Link to={`/order/${order._id}`} className="text-pink-600 dark:text-pink-500 hover:text-pink-900 dark:hover:text-pink-400">Details</Link>
                                                     </td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
