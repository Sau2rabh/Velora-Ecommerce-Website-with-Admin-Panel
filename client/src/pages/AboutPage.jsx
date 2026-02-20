import { motion } from 'framer-motion';
import { ShoppingBag, Target, ShieldCheck, Heart, Sparkles, Globe, Zap } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const AboutPage = () => {
    return (
        <PageTransition>
            <div className="bg-white dark:bg-black min-h-screen transition-colors duration-500">
                {/* Hero Section */}
                <div className="bg-black pt-20 pb-16 md:pt-24 md:pb-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] -ml-44 -mt-44" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -mr-44 -mb-44" />
                    </div>
                    
                    <div className="container mx-auto px-4 lg:px-12 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <h4 className="text-pink-500 font-black uppercase tracking-[0.4em] text-xs mb-6">Our Story</h4>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 font-['Outfit'] tracking-tighter leading-[1.1]">
                                Redefining the <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">Modern Lifestyle.</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-2xl">
                                At Velora, we believe shopping is more than just buying products — it’s about discovering pieces that reflect who you are.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 lg:px-12 mt-8 pb-20 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        
                        {/* Main Text Content */}
                        <div className="lg:col-span-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-[2.5rem] p-10 md:p-20 shadow-2xl border border-gray-50 dark:border-white/5 space-y-10"
                            >
                                <div className="max-w-4xl space-y-8">
                                    <p className="text-xl md:text-3xl font-light text-gray-800 dark:text-gray-200 leading-snug">
                                        Founded with a vision to blend <span className="font-bold text-gray-900 dark:text-white">elegance, speed, and simplicity</span>, Velora was created to offer a seamless and premium online shopping experience.
                                    </p>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                        From curated fashion collections to modern lifestyle essentials, every product is carefully selected to bring comfort, confidence, and style into your everyday life. We focus on quality, transparency, and customer trust. Our platform is designed to be fast, secure, and effortless — so you can shop without limits.
                                    </p>

                                    <div className="py-8 border-y border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-12">
                                        <div className="flex-1 space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-black font-['Outfit'] dark:text-white">Style Meets Convenience</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Blending innovation with trust to create reaching a space where every interaction feels meaningful.</p>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-black font-['Outfit'] dark:text-white">Shop Smart. Live Better.</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Empowering you to make effortless choices that enhance your lifestyle every single day.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                       <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-white rounded-full text-white dark:text-black text-sm font-black tracking-widest uppercase">
                                           Velora isn’t just a store.
                                       </div>
                                       <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white font-['Outfit'] tracking-tight">
                                           It’s a space where style meets <span className="text-pink-600">convenience</span>, and innovation meets <span className="text-purple-600">trust.</span>
                                       </h2>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-gray-50 dark:bg-zinc-900/30 py-20 md:py-24 transition-colors duration-500">
                    <div className="container mx-auto px-4 lg:px-12 text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black font-['Outfit'] text-gray-900 dark:text-white tracking-tight">What Drives Us</h2>
                    </div>
                    
                    <div className="container mx-auto px-4 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: ShieldCheck, title: "Unmatched Trust", desc: "Security and transparency in every transaction." },
                                { icon: Zap, title: "Lightning Fast", desc: "Modern tech stack for an effortless shopping flow." },
                                { icon: Heart, title: "Curated with Love", desc: "Every piece is selected with an eye for perfection." },
                                { icon: Globe, title: "Global Vision", desc: "Bringing international trends to your doorstep." }
                            ].map((value, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -8 }}
                                    className="bg-white dark:bg-black p-8 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5 space-y-5"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white flex items-center justify-center shadow-inner">
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-black font-['Outfit'] dark:text-white">{value.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* CTA */}
                <div className="bg-white dark:bg-black py-20 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
                    <div className="container mx-auto px-4 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                            
                            {/* Left Card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="p-1 px-1 bg-pink-50 dark:bg-pink-500/10 rounded-[1.5rem] h-full"
                            >
                                <div className="p-10 bg-white dark:bg-zinc-900 border border-pink-100 dark:border-pink-500/20 rounded-[1.2rem] text-center shadow-lg shadow-pink-50/50 dark:shadow-pink-900/10 h-full flex flex-col justify-center">
                                    <ShoppingBag className="w-10 h-10 text-pink-500 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black font-['Outfit'] text-gray-900 dark:text-white mb-3">Curated Style</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">Handpicked collections that define your unique personality.</p>
                                </div>
                            </motion.div>

                            {/* Center Card (Main) */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-1 px-1 bg-pink-50 dark:bg-pink-500/10 rounded-[1.5rem] h-full"
                            >
                                <div className="p-10 bg-white dark:bg-zinc-900 border border-pink-100 dark:border-pink-500/20 rounded-[1.2rem] shadow-xl shadow-pink-100/50 dark:shadow-pink-950/20 text-center h-full flex flex-col justify-center">
                                    <Sparkles className="w-10 h-10 text-pink-500 mx-auto mb-6" />
                                    <h2 className="text-3xl font-black font-['Outfit'] text-gray-900 dark:text-white tracking-tighter mb-4 leading-tight">
                                       Shop smart. <br /> Live better.
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-[0.2em] uppercase text-xs">Welcome to the future</p>
                                </div>
                            </motion.div>

                            {/* Right Card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-1 px-1 bg-purple-50 dark:bg-purple-500/10 rounded-[1.5rem] h-full"
                            >
                                <div className="p-10 bg-white dark:bg-zinc-900 border border-purple-100 dark:border-purple-500/20 rounded-[1.2rem] text-center shadow-lg shadow-purple-50/50 dark:shadow-purple-900/10 h-full flex flex-col justify-center">
                                    <ShieldCheck className="w-10 h-10 text-purple-500 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black font-['Outfit'] text-gray-900 dark:text-white mb-3">Secure Luxe</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">Trusted payments and premium data protection for every order.</p>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AboutPage;
