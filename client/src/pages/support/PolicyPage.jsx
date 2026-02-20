import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';

const PolicyPage = ({ title, subtitle, lastUpdated, content }) => {
    return (
        <PageTransition>
            <div className="bg-white dark:bg-black min-h-screen transition-colors duration-500">
                {/* Clean Header */}
                <div className="bg-gray-50/50 dark:bg-black pt-20 pb-16 md:pt-24 md:pb-20 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[120px] -ml-44 -mt-44" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] -mr-44 -mb-44" />
                    </div>

                    <div className="container mx-auto px-4 lg:px-12 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block py-1 px-4 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-pink-500 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm"
                        >
                            Legal & Policies
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-['Outfit'] tracking-tighter leading-[1.1]">
                            {title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light mb-6 max-w-2xl mx-auto">{subtitle}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Last Updated: {lastUpdated}</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="container mx-auto px-4 lg:px-12 mt-8 pb-20 relative z-20">
                    <div className="max-w-3xl mx-auto prose prose-pink dark:prose-invert">
                        {content.map((section, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="mb-16"
                            >
                                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 font-['Outfit'] uppercase tracking-wider flex items-center gap-4">
                                     <span className="w-8 h-0.5 bg-pink-500 rounded-full" />
                                     {section.heading}
                                </h2>
                                <div className="text-gray-600 dark:text-gray-400 leading-relaxed font-light space-y-4">
                                    {section.text.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                    {section.list && (
                                        <ul className="space-y-3 mt-6">
                                            {section.list.map((item, i) => (
                                                <li key={i} className="flex gap-4 items-start">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                                                    <span className="text-sm">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer Engagement */}
                <div className="container mx-auto px-4 py-20 border-t border-gray-50 dark:border-white/5 text-center">
                    <p className="text-gray-400 text-sm font-medium mb-8">Have questions about these terms?</p>
                    <a href="/contact" className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs border-b-2 border-pink-500 pb-1 hover:text-pink-600 transition-colors">
                        Contact Support Team
                    </a>
                </div>
            </div>
        </PageTransition>
    );
};

export default PolicyPage;
