import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LookbookHotspot from '../components/LookbookHotspot';
import LookbookModal from '../components/LookbookModal';
import { ArrowDown } from 'lucide-react';

const lookbookData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        title: "Urban Minimalism",
        description: "Clean lines and understated elegance for the modern city dweller.",
        layout: "large", // large, tall, wide
        products: [
            {
                _id: "67b72db5e513511b0e52701f", // Replace with real ID from your DB if you want
                name: "Oversized Beige Blazer",
                price: 5999,
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
                x: 45,
                y: 35
            },
            {
                _id: "67b72db5e513511b0e527021",
                name: "Pleated Trousers",
                price: 3499,
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
                x: 55,
                y: 75
            }
        ]
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "Evening Glamour",
        description: "Statement pieces designed to turn heads after dark.",
        layout: "tall",
        products: [
            {
                _id: "67b72db5e513511b0e527023",
                name: "Silk Slip Dress",
                price: 8999,
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
                x: 50,
                y: 50
            }
        ]
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1550614000-4b9519e09cd3?q=80&w=1000&auto=format&fit=crop",
        title: "Weekend Casual",
        description: "Comfort meets style for your off-duty days.",
        layout: "wide",
        products: [
            {
                _id: "67b72db5e513511b0e527025",
                name: "Denim Jacket",
                price: 4999,
                image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop",
                x: 40,
                y: 30
            },
            {
                _id: "67b72db5e513511b0e527027",
                name: "Canvas Sneakers",
                price: 2499,
                image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop",
                x: 60,
                y: 85
            }
        ]
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1509319117193-518da7277202?q=80&w=1000&auto=format&fit=crop",
        title: "Abstract Artistry",
        description: "Bold patterns and textures inspired by modern art.",
        layout: "tall",
        products: [
             {
                _id: "67b72db5e513511b0e527029",
                name: "Printed Midi Skirt",
                price: 3999,
                image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop",
                x: 50,
                y: 60
            }
        ]
    },
];

const LookbookPage = () => {
    const [activeProduct, setActiveProduct] = useState(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div ref={containerRef} className="bg-white min-h-screen font-sans">
            {/* Parallax Hero */}
            <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <img 
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
                        alt="Lookbook Hero" 
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="relative z-20 text-center text-white px-4">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="block text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-4 text-pink-300"
                    >
                        Spring / Summer 2026
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 font-['Outfit']"
                    >
                        The Editorial
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="max-w-xl mx-auto text-lg md:text-xl font-light text-gray-200"
                    >
                        A curated selection of the season's most defining styles.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 z-20"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                </motion.div>
            </div>

            {/* Lookbook Grid */}
            <div className="container mx-auto px-4 lg:px-12 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                    {lookbookData.map((look, index) => (
                        <motion.div
                            key={look.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`relative group ${
                                look.layout === 'wide' ? 'md:col-span-2 aspect-[2/1]' : 
                                look.layout === 'tall' ? 'aspect-[3/4] md:-mt-24' : 'aspect-[3/4]'
                            }`}
                        >
                            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-xl">
                                <img 
                                    src={look.image} 
                                    alt={look.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                                {/* Hotspots */}
                                {look.products.map((product) => (
                                    <LookbookHotspot
                                        key={product._id}
                                        x={product.x}
                                        y={product.y}
                                        active={activeProduct?._id === product._id}
                                        onClick={() => setActiveProduct(activeProduct?._id === product._id ? null : product)}
                                    />
                                ))}

                                {/* Active Modal Overlay */}
                                <LookbookModal 
                                    isOpen={!!activeProduct && look.products.some(p => p._id === activeProduct._id)}
                                    onClose={() => setActiveProduct(null)}
                                    product={activeProduct}
                                />
                            </div>

                            <div className="mt-6 md:mt-8">
                                <h3 className="text-2xl md:text-3xl font-bold font-['Outfit'] mb-2">{look.title}</h3>
                                <p className="text-gray-500 font-light">{look.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-900 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 font-['Outfit']">
                        Ready to make it yours?
                    </h2>
                    <button className="bg-pink-600 text-white px-12 py-4 rounded-full font-bold text-xl uppercase tracking-wider hover:bg-pink-500 transition-colors shadow-lg hover:shadow-pink-500/30">
                        Shop Full Collection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LookbookPage;
