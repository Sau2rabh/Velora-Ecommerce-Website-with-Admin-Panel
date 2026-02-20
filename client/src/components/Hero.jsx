import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = ({ 
    title = "Redefine Your Style", 
    subtitle = "Premium Collection 2026",
    ctaText = "Shop Collection",
    ctaLink = "/products",
    image = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
}) => {
    return (
        <div className="relative w-full min-h-[85vh] flex items-center bg-gray-900 overflow-hidden font-sans py-20">
            {/* Background Gradient & Shapes */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-20"></div>
            
            {/* Animated Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Text Content */}
                <div className="space-y-8 text-center lg:text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/90"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-bold tracking-widest uppercase">{subtitle}</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter font-['Outfit']"
                    >
                        {title.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed px-4 md:px-0"
                    >
                        Discover the epitome of luxury and comfort. Our latest arrival aims to elevate your everyday look with a touch of elegance.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                    >
                        <Link 
                            to={ctaLink}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider overflow-hidden hover:bg-pink-50 transition-colors"
                        >
                            <span className="relative z-10">{ctaText}</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </Link>
                        

                    </motion.div>
                </div>

                {/* Hero Image / 3D Layout */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="relative hidden lg:block"
                >
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10 rotate-[-3deg] hover:rotate-0 transition-transform duration-700 ease-out">
                         <img 
                            src={image} 
                            alt="Hero Fashion" 
                            className="w-full h-[600px] object-cover"
                        />
                        {/* Overlay Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Floating Cards/Elements */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-12 -left-12 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl w-64"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">50%</div>
                            <div>
                                <p className="text-white font-bold text-sm">Special Offer</p>
                                <p className="text-gray-400 text-xs">Valid until Friday</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-pink-500 rounded-full"></div>
                        </div>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -top-12 -right-8 z-0 w-48 h-48 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-2xl opacity-60"
                    ></motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
