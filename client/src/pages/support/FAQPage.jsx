import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, ShoppingBag, Truck, RefreshCw, CreditCard } from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const faqs = [
    {
        category: "Ordering",
        icon: ShoppingBag,
        questions: [
            {
                q: "How do I place an order?",
                a: "Simply browse our collection, select your items, and click 'Add to Bag'. Once you're ready, proceed to checkout where you can enter your shipping and payment details."
            },
            {
                q: "Can I change or cancel my order?",
                a: "Once an order is placed, it is processed quickly. If you need to make changes, please contact us within 1 hour of placing the order. After it's shipped, it cannot be canceled."
            }
        ]
    },
    {
        category: "Shipping",
        icon: Truck,
        questions: [
            {
                q: "How long does shipping take?",
                a: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery within major cities."
            },
            {
                q: "Do you ship internationally?",
                a: "Currently, Velora ships exclusively within India. We are working on expanding our reach to international fashion enthusiasts soon!"
            }
        ]
    },
    {
        category: "Returns",
        icon: RefreshCw,
        questions: [
            {
                q: "What is your return policy?",
                a: "We offer a 14-day hassle-free return policy for most items. Items must be in their original condition with tags intact. Some items like beauty products are non-returnable for hygiene reasons."
            }
        ]
    },
    {
        category: "Payments",
        icon: CreditCard,
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards, UPI, Wallets, and Net Banking. All transactions are processed through secure, encrypted gateways."
            }
        ]
    }
];

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeQuestion, setActiveQuestion] = useState(null);

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <PageTransition>
            <div className="bg-white dark:bg-black min-h-screen transition-colors duration-500">
                {/* Hero Header */}
                <div className="bg-gray-50/50 dark:bg-black pt-20 pb-16 md:pt-24 md:pb-20 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[120px] -ml-44 -mt-44" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] -mr-44 -mb-44" />
                    </div>
                    
                    <div className="container mx-auto px-4 lg:px-12 relative z-10 text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-['Outfit'] tracking-tighter leading-[1.1]"
                        >
                            How can we <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">help you?</span>
                        </motion.h1>
                        
                        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
                            Search our help center for quick answers to common questions about your Velora experience.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Search questions..."
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-16 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all shadow-sm focus:shadow-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="container mx-auto px-4 lg:px-12 mt-8 pb-20 relative z-20">
                    <div className="max-w-4xl mx-auto">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((category, catIdx) => (
                                <div key={catIdx} className="mb-16">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-pink-600 shadow-sm border dark:border-white/5">
                                            <category.icon className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Outfit'] tracking-wide uppercase text-sm">{category.category}</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {category.questions.map((faq, qIdx) => {
                                            const id = `${catIdx}-${qIdx}`;
                                            const isOpen = activeQuestion === id;

                                            return (
                                                <div 
                                                    key={qIdx}
                                                    className={`border rounded-3xl transition-all duration-300 ${
                                                        isOpen 
                                                        ? 'border-pink-200 dark:border-pink-500/30 bg-pink-50/10 dark:bg-pink-500/5 shadow-lg shadow-pink-500/5' 
                                                        : 'border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 bg-white dark:bg-zinc-900/50'
                                                    }`}
                                                >
                                                    <button 
                                                        onClick={() => setActiveQuestion(isOpen ? null : id)}
                                                        className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                                    >
                                                        <span className={`font-bold tracking-wide transition-colors ${isOpen ? 'text-pink-600 dark:text-pink-400' : 'text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}>{faq.q}</span>
                                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-500' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-8 pb-8 text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                                                                    {faq.a}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <HelpCircle className="w-16 h-16 text-gray-200 dark:text-white/5 mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
                                <p className="text-gray-500 dark:text-gray-400">We couldn't find any answers for "{searchTerm}". Please try a different search or contact us.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Still Need Help? */}
                <div className="bg-gray-50 dark:bg-zinc-900/30 py-20 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-['Outfit']">Still have questions?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">Can't find the answer you're looking for? Our support team is here to help you 24/7.</p>
                        <div className="flex justify-center gap-6">
                            <button className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xl shadow-gray-900/10 dark:shadow-white/5">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default FAQPage;
