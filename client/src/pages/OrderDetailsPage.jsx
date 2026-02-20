import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
    Package, 
    Truck, 
    MapPin, 
    Calendar, 
    CreditCard, 
    Download, 
    ChevronLeft,
    ShoppingBag,
    CheckCircle
} from 'lucide-react';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`\${import.meta.env.VITE_API_URL}/api/orders/${id}`, config);
                setOrder(data);
            } catch (error) {
                console.error(error);
                showError("Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };

        if (user && id) {
            fetchOrder();
        }
    }, [id, user, showError]);

    const downloadInvoice = () => {
        if (!order) return;

        try {
            const doc = new jsPDF();

            // Brand Header
            doc.setFillColor(236, 72, 153); // Pink
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(26);
            doc.setFont("helvetica", "bold");
            doc.text("Velora.", 20, 25);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Premium Fashion Architecture", 20, 32);

            doc.setFontSize(14);
            doc.text("INVOICE", 170, 25, { align: 'right' });

            // Order Metadata
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Order ID: ${order._id}`, 140, 55);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 60);
            doc.text(`Payment: ${order.paymentMethod}`, 140, 65);

            // Billing Info
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Bill To:", 20, 55);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(String(order.shippingAddress.name || 'Guest'), 20, 62);
            doc.text(String(order.shippingAddress.address || ''), 20, 67);
            doc.text(`${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}, ${order.shippingAddress.country || ''}`, 20, 72);
            doc.text(`${order.shippingAddress.country || ''} - ${order.shippingAddress.postalCode || ''}`, 20, 77);
            doc.text(`Phone: ${order.shippingAddress.phoneNumber || ''}`, 20, 82);
            doc.text(`Email: ${order.shippingAddress.email || 'N/A'}`, 20, 87);

            // Table
            const tableColumn = ["Product", "Qty", "Price", "Total"];
            const tableRows = [];

            order.orderItems.forEach(item => {
                const itemData = [
                    item.name,
                    item.qty,
                    `Rs. ${item.price.toLocaleString('en-IN')}`,
                    `Rs. ${(item.price * item.qty).toLocaleString('en-IN')}`
                ];
                tableRows.push(itemData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 90,
                theme: 'grid',
                headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255] },
                styles: { fontSize: 10, cellPadding: 4 },
            });

            // Summary
            const finalY = (doc).lastAutoTable?.finalY || 90;
            const summaryX = 140;
            
            doc.setFontSize(10);
            doc.text(`Subtotal :`, summaryX, finalY + 10);
            doc.text(`Rs. ${order.itemsPrice.toLocaleString('en-IN')}`, 190, finalY + 10, { align: 'right' });
            
            doc.text(`Shipping :`, summaryX, finalY + 16);
            doc.text(order.shippingPrice === 0 ? "Free" : `Rs. ${order.shippingPrice.toLocaleString('en-IN')}`, 190, finalY + 16, { align: 'right' });
            
            doc.text(`Tax :`, summaryX, finalY + 22);
            doc.text(`Rs. ${order.taxPrice.toLocaleString('en-IN')}`, 190, finalY + 22, { align: 'right' });

            doc.setDrawColor(200, 200, 200);
            doc.line(summaryX, finalY + 26, 190, finalY + 26);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Total :`, summaryX, finalY + 34);
            doc.text(`Rs. ${order.totalPrice.toLocaleString('en-IN')}`, 190, finalY + 34, { align: 'right' });

            // Footer
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150);
            doc.text("Thank you for shopping with Velora!", 105, 280, null, null, "center");

            doc.save(`Invoice_Velora_${order._id}.pdf`);
        } catch (error) {
            console.error("Invoice generation error:", error);
            showError(`Invoice failed: ${error.message}`);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!order) return <div className="text-center pt-20">Order not found</div>;

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen py-12 font-sans transition-colors duration-300">
            <div className="container mx-auto px-4 lg:px-20">
                
                {/* Back Link */}
                <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" /> Back to Orders
                </Link>
 
                {/* Success Banner */}
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4 mb-8 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
                    <div>
                        <h2 className="text-green-800 dark:text-green-100 font-bold">Order Placed Successfully!</h2>
                        <p className="text-green-600 dark:text-green-400 text-sm">Thank you for your purchase. We've received your order.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Order Details */}
                    <div className="flex-1 space-y-6">
                        {/* Order Header */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <h1 className="text-2xl font-bold font-['Outfit'] mb-1 dark:text-white">Order #{order._id}</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button 
                                onClick={downloadInvoice}
                                className="flex items-center gap-2 bg-black dark:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 dark:hover:bg-pink-500 transition-colors shadow-lg"
                            >
                                <Download className="w-4 h-4" /> Download Invoice
                            </button>
                        </div>

                        {/* Items */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                <h3 className="font-bold flex items-center gap-2 dark:text-white">
                                    <ShoppingBag className="w-5 h-5 text-pink-600" /> Order Items ({order.orderItems.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="p-6 flex gap-4">
                                        <div className="w-20 h-24 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">{item.name}</h4>
                                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty: {item.qty}</div>
                                            <div className="mt-2 font-bold text-pink-600 dark:text-pink-400">₹{item.price.toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="text-right font-bold text-gray-900 dark:text-white">
                                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Cards */}
                    <div className="lg:w-96 space-y-6">
                        
                        {/* Shipping Info */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold border-b border-gray-100 dark:border-white/5 pb-3 mb-4 flex items-center gap-2 dark:text-white">
                                <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" /> Shipping Address
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p className="font-bold text-gray-900 dark:text-white text-base">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.country} - {order.shippingAddress.postalCode}</p>
                                <p className="pt-2"><span className="font-bold dark:text-white">Phone:</span> {order.shippingAddress.phoneNumber}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold border-b border-gray-100 dark:border-white/5 pb-3 mb-4 flex items-center gap-2 dark:text-white">
                                <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500" /> Payment Info
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Method</span>
                                    <span className="font-bold dark:text-white">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold border-b border-gray-100 dark:border-white/5 pb-3 mb-4 dark:text-white">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                                    <span className="dark:text-white">₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                                    <span className="dark:text-white">{order.shippingPrice === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : `₹${order.shippingPrice}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Tax</span>
                                    <span className="dark:text-white">₹{order.taxPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between font-bold text-lg">
                                    <span className="dark:text-white">Total</span>
                                    <span className="text-pink-600 dark:text-pink-400">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
