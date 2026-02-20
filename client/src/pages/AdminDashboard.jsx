import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, Users, IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, X, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color.text}`}>
            <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl ${color.bg} ${color.text} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold font-['Outfit'] text-gray-900">{value}</h3>
            {trend && (
                <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'} font-bold`}>
                        {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-gray-400 ml-2">vs last month</span>
                </div>
            )}
        </div>
    </motion.div>
);

const AnalyticsModal = ({ isOpen, onClose, data }) => {
    const [chartType, setChartType] = useState('bar');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold font-['Outfit'] text-gray-900">Detailed Analytics</h2>
                        <p className="text-sm text-gray-500">Deep dive into your revenue and sales performance</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={() => setChartType('line')}
                            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${chartType === 'line' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <LineChartIcon className="w-4 h-4 mr-2" /> Line Chart
                        </button>
                        <button 
                            onClick={() => setChartType('pie')}
                            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${chartType === 'pie' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <PieChartIcon className="w-4 h-4 mr-2" /> Pie Chart
                        </button>
                    </div>

                    <div className="h-96 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={data.monthlyRevenue || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="_id" 
                                        axisLine={true} 
                                        tickLine={true} 
                                        tick={{fill: '#4b5563', fontSize: 12}}
                                        label={{ value: 'Month', position: 'insideBottom', offset: -10, fill: '#6b7280' }}
                                    />
                                    <YAxis 
                                        axisLine={true} 
                                        tickLine={true} 
                                        tick={{fill: '#4b5563', fontSize: 12}} 
                                        tickFormatter={(value) => `₹${value}`} 
                                        label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: 0, fill: '#6b7280' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line 
                                        type="linear" 
                                        dataKey="total" 
                                        name="Revenue" 
                                        stroke="#2563eb" 
                                        strokeWidth={2} 
                                        dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} 
                                        activeDot={{r: 6, fill: '#1e40af'}} 
                                    />
                                </LineChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={data.salesByCategory || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="_id"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {(data.salesByCategory || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#6366F1'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                            <h4 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h4>
                            <p className="text-2xl font-bold font-['Outfit'] text-gray-900">
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(data.totalRevenue || 0)}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                             <h4 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h4>
                             <p className="text-2xl font-bold font-['Outfit'] text-gray-900">{data.totalOrders}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};



const AdminDashboard = () => {
    const { user } = useAuth();
    const { showError, showSuccess } = useToast();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        monthlyRevenue: [],
        salesByCategory: []
    });
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                    params: { range: timeRange }
                };
                const { data } = await axios.get('http://127.0.0.1:5000/api/analytics', config);
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                showError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchStats();
    }, [user.token, showError, timeRange]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleExport = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(79, 70, 229); // Indigo 600
        doc.text('Velora Admin Report', 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 28);
        doc.text(`Generated by: ${user.name}`, 14, 33);

        // Summary Statistics
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Executive Summary', 14, 45);

        autoTable(doc, {
            startY: 50,
            head: [['Metric', 'Value']],
            body: [
                ['Total Revenue', formatCurrency(stats.totalRevenue)],
                ['Total Orders', stats.totalOrders],
                ['Total Products', stats.totalProducts],
                ['Total Users', stats.totalUsers],
            ],
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255 },
            styles: { fontSize: 12, cellPadding: 3 },
        });

        // Revenue Breakdown
        doc.text('Monthly Revenue Breakdown', 14, doc.lastAutoTable.finalY + 15);
        
        const revenueData = stats.monthlyRevenue.map(item => [item._id, formatCurrency(item.total)]);
        
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Month', 'Revenue']],
            body: revenueData,
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] },
        });

        // Category Sales
        doc.text('Sales by Category', 14, doc.lastAutoTable.finalY + 15);

        const categoryData = stats.salesByCategory.map(item => [item._id, item.count]);

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Category', 'Units Sold']],
            body: categoryData,
            theme: 'striped',
            headStyles: { fillColor: [236, 72, 153] }, // Pink 500
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
            doc.text('Confidential - Velora Internal Use Only', 14, doc.internal.pageSize.height - 10);
        }

        doc.save(`velora_admin_report_${new Date().toISOString().slice(0,10)}.pdf`);
        showSuccess('Report exported successfully');
    };



    const COLORS = ['#4F46E5', '#9333EA', '#EC4899', '#F59E0B', '#10B981'];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <AnalyticsModal 
                isOpen={showAnalytics} 
                onClose={() => setShowAnalytics(false)} 
                data={stats} 
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-['Outfit'] text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user.name} 👋</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                    <button 
                        onClick={() => setShowAnalytics(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        View Analytics
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={formatCurrency(stats.totalRevenue)} 
                    icon={IndianRupee}
                    color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                    trend={12.5}
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    icon={ShoppingBag}
                    color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                    trend={8.2}
                />
                <StatCard 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    icon={Package}
                    color={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
                    trend={-2.4}
                />
                <StatCard 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    icon={Users}
                    color={{ bg: 'bg-orange-100', text: 'text-orange-600' }}
                    trend={5.7}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold font-['Outfit'] text-gray-900">Revenue Overview</h3>
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-gray-50 border-none text-sm text-gray-500 rounded-lg p-2 outline-none cursor-pointer hover:bg-gray-100"
                        >
                            <option value="day">Day</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.monthlyRevenue || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="_id" 
                                    axisLine={true} 
                                    tickLine={true} 
                                    tick={{fill: '#9ca3af', fontSize: 12}}
                                    label={{ value: timeRange.charAt(0).toUpperCase() + timeRange.slice(1), position: 'insideBottom', offset: -10, fill: '#6b7280' }}
                                />
                                <YAxis 
                                    axisLine={true} 
                                    tickLine={true} 
                                    tick={{fill: '#9ca3af', fontSize: 12}} 
                                    tickFormatter={(value) => `₹${value}`} 
                                    label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: 0, fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                />
                                <Line 
                                    type="linear" 
                                    dataKey="total" 
                                    name="Revenue" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3} 
                                    dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} 
                                    activeDot={{r: 6, fill: '#4f46e5'}} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Side Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold font-['Outfit'] text-gray-900 mb-6">Sales by Category</h3>
                    <div className="flex-1 flex items-center justify-center min-h-[300px]">
                        {stats.salesByCategory && stats.salesByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ bottom: 20 }}>
                                    <Pie
                                        data={stats.salesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                    >
                                        {stats.salesByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-sm">No sales data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
