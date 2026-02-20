import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import PageTransition from '../../components/PageTransition';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Support Request',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://127.0.0.1:5000/api/support/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: 'Support Request', message: '' });
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        { icon: Mail, title: "Email Us", detail: "support@velora.com", sub: "24/7 dedicated support" },
        { icon: Phone, title: "Call Us", detail: "+91 800-VELORA", sub: "Mon-Sat, 9AM-6PM" },
        { icon: MapPin, title: "Visit Us", detail: "Velora Plaza, Mumbai", sub: "Flagship experience center" }
    ];

    return (
        <PageTransition>
            <div className="bg-white dark:bg-black min-h-screen transition-colors duration-500">
                {/* Visual Header */}
                <div className="bg-gray-50/50 dark:bg-black pt-20 pb-16 md:pt-24 md:pb-20 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[120px] -ml-44 -mt-44" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] -mr-44 -mb-44" />
                    </div>
                    
                    <div className="container mx-auto px-4 lg:px-12 relative z-10 text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-['Outfit'] tracking-tighter leading-[1.1]"
                        >
                            Get in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">Touch.</span>
                        </motion.h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                            Experience personalized support. Our team is here to assist you with everything from styling advice to order inquiries.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 lg:px-12 mt-8 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        
                        {/* Sidebar Info */}
                        <div className="lg:col-span-5 space-y-8 relative z-20">
                            <div className="bg-gray-900 dark:bg-zinc-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-12 border border-white/5">
                                <div>
                                    <h2 className="text-3xl font-black mb-6 font-['Outfit']">Contact Information</h2>
                                    <p className="text-gray-400 font-light leading-relaxed">We typically respond within 2-4 business hours.</p>
                                </div>

                                <div className="space-y-10">
                                    {contactMethods.map((item, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500 shadow-lg">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-200 mb-1">{item.title}</h4>
                                                <p className="text-lg font-bold text-white mb-0.5">{item.detail}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-pink-600/20 active:scale-95">
                                    <MessageCircle className="w-4 h-4" /> Start Live Chat
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 flex items-center gap-6">
                                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white">Priority Support</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">Velora Plus members get 1-hour response time.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-[2.5rem] shadow-xl p-8 md:p-16 border border-gray-50 dark:border-white/5"
                            >
                                {submitted ? (
                                    <div className="text-center py-20 space-y-8">
                                        <div className="w-24 h-24 bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                            <CheckCircle2 className="w-12 h-12 animate-pulse" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 font-['Outfit']">Message Sent!</h2>
                                            <p className="text-gray-500 dark:text-gray-400 text-lg font-light">Thank you for reaching out. A support executive will contact you shortly.</p>
                                        </div>
                                        <button 
                                            onClick={() => setSubmitted(false)}
                                            className="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-12">
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-['Outfit']">Send a Message</h3>
                                            <p className="text-gray-500 dark:text-gray-400 font-light text-lg tracking-wide">Tell us how we can assist you today.</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Full Name</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500/20 transition-all"
                                                        placeholder="Your name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Email Address</label>
                                                    <input 
                                                        required
                                                        type="email" 
                                                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500/20 transition-all"
                                                        placeholder="email@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Subject</label>
                                                <div className="relative">
                                                <select 
                                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-5 px-6 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500/20 appearance-none transition-all"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                >
                                                    <option value="Support Request" className="dark:bg-black">Support Request</option>
                                                    <option value="Delivery Inquiry" className="dark:bg-black">Delivery Inquiry</option>
                                                    <option value="Styling & Size Advice" className="dark:bg-black">Styling & Size Advice</option>
                                                    <option value="Partnership/B2B" className="dark:bg-black">Partnership/B2B</option>
                                                </select>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Your message</label>
                                                <textarea 
                                                    required
                                                    rows="6"
                                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.5rem] py-5 px-6 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
                                                    placeholder="How can we help?"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                ></textarea>
                                            </div>

                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl py-6 font-black uppercase tracking-[0.2em] text-xs hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xl shadow-gray-900/20 dark:shadow-white/5 flex items-center justify-center gap-4 disabled:opacity-50"
                                            >
                                                {loading ? 'Processing...' : (
                                                    <>Send Message <Send className="w-4 h-4" /></>
                                                )}
                                            </button>

                                            {error && <p className="text-red-500 text-center text-xs font-bold">{error}</p>}
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ContactPage;
