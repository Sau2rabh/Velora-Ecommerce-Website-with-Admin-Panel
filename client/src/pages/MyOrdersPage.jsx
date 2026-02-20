import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get('http://127.0.0.1:5000/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-black transition-colors duration-500">
                <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen py-12 transition-colors duration-500">
            <div className="container mx-auto px-4 lg:px-12">
                <h1 className="text-3xl font-black font-['Outfit'] mb-8 text-gray-900 dark:text-white">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
                        <Link to="/products" className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100 dark:border-gray-800 gap-4">
                                    <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 w-full md:w-auto">
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Order Placed</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total</span>
                                            <span className="font-medium text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Ship To</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-right">
                                        <span className="block font-mono text-gray-400 dark:text-gray-500">ORDER # {order._id}</span>
                                        <div className="flex items-center gap-3 mt-1 justify-end">
                                            <span className="text-pink-600 dark:text-pink-400 font-bold">{order.paymentMethod}</span>
                                            <Link to={`/order/${order._id}`} className="text-xs bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded hover:bg-pink-600 dark:hover:bg-gray-200 transition-colors font-bold">
                                                View Order
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white">Contact:</span> {order.shippingAddress.phoneNumber}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white">Email:</span> {user.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white">Gender:</span> {order.shippingAddress.gender}
                                    </div>
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="font-bold text-gray-900 dark:text-white">Address:</span> 
                                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.postalCode}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} className="flex gap-4 items-start">
                                                    <div className="w-16 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <Link to={`/product/${item.product}`} className="font-bold text-sm text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors line-clamp-1">
                                                            {item.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qty: {item.qty}</div>
                                                        <div className="font-bold text-sm mt-1 text-gray-900 dark:text-white">₹{item.price.toLocaleString('en-IN')}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="md:w-64 flex flex-col justify-center space-y-3 pl-0 md:pl-6 md:border-l border-gray-100 dark:border-gray-800">
                                             <div className="flex items-center gap-2">
                                                {order.isDelivered ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-orange-500" />
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                                                        {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Arriving Soon'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {order.isDelivered ? 'Your item has been delivered' : 'Your order is being processed'}
                                                    </p>
                                                </div>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
