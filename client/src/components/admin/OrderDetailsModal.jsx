import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, CreditCard, CheckCircle, Truck, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import { useEffect } from 'react';

const OrderDetailsModal = ({ isOpen, onClose, order, onOrderUpdated }) => {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const markAsDelivered = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${order._id}/deliver`, {}, config);
            showSuccess('Order marked as Delivered');
            onOrderUpdated(); // Refresh parent list
        } catch (error) {
            console.error(error);
            showError(error.response?.data?.message || 'Failed to update status');
        }
    };

    // Note: Assuming there's a route for marking as paid, otherwise disable or remove if not needed for admin
    // Usually admin might manually mark as paid for COD or bank transfers
    const markAsPaid = async () => {
         try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${order._id}/pay`, {}, config);
            showSuccess('Order marked as Paid');
            onOrderUpdated();
        } catch (error) {
            console.error(error);
             showError(error.response?.data?.message || 'Failed to update payment status');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Header property to hide scrollbar for Webkit browsers */}
                        <style>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-bold font-['Outfit']">Order Details</h2>
                                <p className="text-gray-500 text-sm">ID: {order._id}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <section>
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-pink-500" /> Order Items
                                    </h3>
                                    <div className="space-y-4">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{item.name}</h4>
                                                    <p className="text-gray-500 text-xs mt-1">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                                                    <p className="font-bold text-gray-900 mt-1">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-600">Total Amount</span>
                                        <span className="text-xl font-bold text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Info & Actions */}
                            <div className="space-y-6">
                                {/* Customer Info */}
                                <section className="bg-gray-50 p-5 rounded-xl">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-pink-500" /> Shipping Info
                                    </h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <p><span className="font-semibold text-gray-900">Name:</span> {order.shippingAddress.name}</p>
                                        <p><span className="font-semibold text-gray-900">Email:</span> {order.shippingAddress.email || order.user?.email}</p>
                                        <p><span className="font-semibold text-gray-900">Phone:</span> {order.shippingAddress.phoneNumber}</p>
                                        <p className="border-t border-gray-200 pt-2 mt-2">
                                            {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                            {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                </section>

                                {/* Status Management */}
                                <section className="bg-gray-50 p-5 rounded-xl">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-pink-500" /> Status Management
                                    </h3>
                                    
                                    {/* Payment Status */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Payment</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {order.isPaid ? 'PAID' : 'NOT PAID'}
                                            </span>
                                        </div>
                                        {!order.isPaid && (
                                            <button 
                                                onClick={markAsPaid}
                                                className="w-full text-xs bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                        {order.isPaid && <p className="text-xs text-gray-500">Paid on {new Date(order.paidAt).toLocaleDateString()}</p>}
                                    </div>

                                    {/* Delivery Status */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Delivery</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
                                            </span>
                                        </div>
                                        {!order.isDelivered && (
                                            <button 
                                                onClick={markAsDelivered}
                                                className="w-full text-xs bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-500 transition-colors"
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                         {order.isDelivered && <p className="text-xs text-gray-500">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</p>}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetailsModal;
