import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Eye, CheckCircle, Truck, Clock } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

const OrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const refreshOrders = async () => {
         try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/orders', config);
            setOrders(data);
             // Verify if selected order needs update in modal (optional, but good for UX if modal stays open)
             if (selectedOrder) {
                 const updatedSelected = data.find(o => o._id === selectedOrder._id);
                 if (updatedSelected) setSelectedOrder(updatedSelected);
             }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user.token]);

    const markAsDelivered = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${id}/deliver`, {}, config);
            // Refresh orders
            const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/orders', config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold font-['Outfit'] text-gray-900 dark:text-white">Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage customer orders and shipments</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/60 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-700/50">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{order._id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.user && order.user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${order.isPaid ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-fit ${order.isDelivered ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                                {order.isDelivered ? <CheckCircle className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!order.isDelivered && (
                                                    <button 
                                                        onClick={() => markAsDelivered(order._id)}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" 
                                                        title="Mark as Delivered"
                                                    >
                                                        <Truck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleViewOrder(order)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
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

            <OrderDetailsModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                order={selectedOrder}
                onOrderUpdated={refreshOrders}
            />
        </div>
    );
};

export default OrderList;
