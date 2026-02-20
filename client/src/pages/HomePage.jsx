import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  Headphones,
} from 'lucide-react';
import Hero from '../components/Hero';
import PageTransition from '../components/PageTransition';

const heroSlides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    title: 'Summer Collection',
    subtitle: '50-80% OFF',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    title: 'Western Wear',
    subtitle: 'New Arrivals',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
    title: 'Ethnic Elegance',
    subtitle: 'Flat 40% OFF',
  },
];

const categories = [
  {
    name: 'Men',
    img: 'https://images.unsplash.com/photo-1488161628813-99c974c418ad?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Women',
    img: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Kids',
    img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Beauty',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Home',
    img: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Footwear',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
  },
];

const brands = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Puma_Logo.png/1200px-Puma_Logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Zara_Logo.svg/2560px-Zara_Logo.svg.png',
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Real-time Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer for demo purposes
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <PageTransition>
      <div className='bg-gray-50 dark:bg-black min-h-screen pb-20 transition-colors duration-500'>
        {/* Hero Section */}
        <Hero />

        {/* Curated Collections Section */}
        <div className='container mx-auto px-4 lg:px-12 py-16'>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-widest uppercase text-gray-900 dark:text-white mb-12 text-center font-['Outfit']"
          >
            Curated Collections
          </motion.h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                name: 'New Arrivals',
                img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
                desc: 'Fresh looks just in',
              },
              {
                name: 'Best Sellers',
                img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop',
                desc: 'loved by everyone',
              },
              {
                name: 'Sale',
                img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
                desc: 'Flat 50% Off',
              },
              {
                name: 'Limited Edition',
                img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
                desc: 'Exclusive drops',
              },
            ].map((item, idx) => (
              <Link
                to="/products"
                key={item.name}
                className='group relative h-96 rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-white/5'
              >
                {/* Background Image */}
                <img
                  src={item.img}
                  alt={item.name}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />

                {/* Gradient Overlay - Darker for better text visibility */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300' />

                {/* Content - Clean and Direct */}
                <div className='absolute inset-0 p-6 flex flex-col justify-end text-center items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
                  <h4 className="text-2xl font-bold text-white uppercase tracking-wider mb-2 font-['Outfit'] drop-shadow-md">
                    {item.name}
                  </h4>
                  <p className='text-gray-200 text-sm mb-6 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100'>
                    {item.desc}
                  </p>
                  <span className='inline-block px-6 py-2 bg-white dark:bg-pink-500 text-black dark:text-white text-xs font-bold uppercase tracking-widest rounded-full transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100'>
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Deal of the Day - Premium Redesign */}
        <div className='relative py-16 overflow-hidden'>
          {/* Background */}
          <div className='absolute inset-0 bg-gray-900'>
            <div className='absolute inset-0 bg-gradient-to-r from-violet-900/50 to-pink-900/50 mix-blend-overlay' />
            <img
              src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
              alt='Background'
              className='w-full h-full object-cover opacity-20'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900' />
          </div>

          <div className='container mx-auto px-4 lg:px-12 relative z-10'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.8 },
              }}
              className='relative max-w-5xl mx-auto'
            >
              {/* Animated Gradient Border */}
              <div className='absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-gradient-xy'></div>

              <div className='bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl overflow-hidden relative group'>
                {/* Decorative Elements */}
                <div className='absolute top-0 left-0 w-64 h-64 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob'></div>
                <div className='absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000'></div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className='flex flex-col items-center justify-center relative z-10'
                >
                  <span className='inline-block py-2 px-4 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-[0_0_20px_rgba(236,72,153,0.4)] animate-pulse'>
                    ✨ Limited Time Offer ✨
                  </span>

                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider text-white mb-8 font-['Outfit'] drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center w-full leading-[1.1]">
                    Deal of the{' '}
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-fuchsia-300 to-purple-300 inline-block drop-shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-pulse block md:inline mt-2 md:mt-0'>
                      Day
                    </span>
                  </h2>

                  <p className='text-gray-300 text-lg md:text-xl font-light tracking-wide mb-12 max-w-2xl mx-auto'>
                    Grab your favorites at an exclusive{' '}
                    <span className='text-white font-bold'>Flat 50% Off</span>.
                    Don't miss out on premium styles for less.
                  </p>

                  {/* Glassmorphic Timer - Real-time */}
                  <div className='flex flex-wrap justify-center gap-4 md:gap-8 mb-12'>
                    {[
                      { value: formatTime(timeLeft.hours), label: 'Hours' },
                      { value: formatTime(timeLeft.minutes), label: 'Mins' },
                      { value: formatTime(timeLeft.seconds), label: 'Secs' },
                    ].map((time, index) => (
                      <div key={index} className='flex flex-col items-center'>
                        <div className='w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[1.5rem] flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] group-hover:border-pink-300/50 group-hover:bg-white/20 transition-all duration-500 hover:scale-105 active:scale-95'>
                          <span className='text-4xl md:text-6xl font-bold text-white font-mono tabular-nums tracking-tighter drop-shadow-lg'>
                            {time.value}
                          </span>
                        </div>
                        <span className='text-gray-400 text-xs font-bold uppercase tracking-widest mt-3'>
                          {time.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <Link
                    to='/products'
                    className='group/cta inline-flex items-center gap-4 bg-white dark:bg-pink-600 text-gray-900 dark:text-white px-12 py-5 rounded-full font-bold text-xl tracking-wider transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)] dark:shadow-pink-600/20 hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:bg-pink-500 dark:hover:bg-pink-500 hover:text-white hover:-translate-y-1 relative overflow-hidden'
                  >
                    <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/cta:animate-shimmer' />
                    <span className='relative z-10'>Start Shopping</span>
                    <ChevronRight className='w-6 h-6 relative z-10 group-hover/cta:translate-x-1 transition-transform' />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Shop by Occasion - Interactive Accordion */}
        <div className='container mx-auto px-4 lg:px-12 py-12'>
          <h3 className="text-3xl font-bold tracking-widest uppercase text-gray-900 dark:text-white mb-12 text-center font-['Outfit']">
            Shop by Occasion
          </h3>

          <div className='flex flex-col md:flex-row gap-4 h-[1000px] md:h-[600px]'>
            {[
              {
                id: 1,
                title: 'Casual Chic',
                img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
                desc: 'Effortless everyday style',
              },
              {
                id: 2,
                title: 'Power Dressing',
                img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop',
                desc: 'Command the room',
              },
              {
                id: 3,
                title: 'Night Out',
                img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
                desc: 'Shine all night',
              },
              {
                id: 4,
                title: 'Active Life',
                img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
                desc: 'Move with confidence',
              },
            ].map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ flex: 1 }}
                whileHover={{ flex: 3 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='relative rounded-[2rem] overflow-hidden cursor-pointer group shadow-xl border border-gray-100 dark:border-white/5'
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500' />

                <div className='absolute inset-0 p-8 flex flex-col justify-end'>
                  <div className='bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-2xl opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0'>
                    <h4 className="text-2xl font-bold text-white uppercase tracking-wider mb-2 font-['Outfit'] whitespace-nowrap">
                      {item.title}
                    </h4>
                    <p className='text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:block'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Velora - Glassmorphic Features */}
        <div className='container mx-auto px-4 lg:px-12 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                desc: 'On all orders over $199',
              },
              {
                icon: Shield,
                title: 'Secure Payment',
                desc: '100% secure transactions',
              },
              {
                icon: RefreshCw,
                title: 'Easy Returns',
                desc: '30-day money back guarantee',
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                desc: 'Dedicated support team',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className='group p-8 rounded-[2rem] bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
              >
                <div className='w-14 h-14 bg-pink-50 dark:bg-pink-500/10 rounded-full flex items-center justify-center mb-6 text-pink-500 dark:text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300'>
                  <item.icon className='w-6 h-6' />
                </div>
                <h4 className='text-xl font-bold text-gray-900 dark:text-white mb-2 font-["Outfit"] uppercase tracking-wider'>
                  {item.title}
                </h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section - Premium Dark */}
        <div className='relative py-24 overflow-hidden'>
          <div className='absolute inset-0 bg-black dark:bg-black'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-950 opacity-90' />
            <img
              src='https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop'
              alt='Newsletter BG'
              className='w-full h-full object-cover opacity-30 mix-blend-overlay'
            />
          </div>

          <div className='container mx-auto px-4 lg:px-12 relative z-10 text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white mb-6 font-['Outfit']">
                Join the <span className='text-pink-500'>Velora</span> Club
              </h2>
              <p className='text-gray-400 max-w-xl mx-auto mb-10 text-lg'>
                Subscribe to receive updates, access to exclusive deals, and more.
              </p>

              <form className='max-w-md mx-auto relative flex items-center'>
                <input
                  type='email'
                  placeholder='Enter your email address'
                  className='w-full bg-white/10 backdrop-blur-md border border-white/20 text-white pl-6 pr-36 md:pr-40 py-4 rounded-full focus:outline-none focus:border-pink-500 focus:bg-white/20 transition-all placeholder-gray-400'
                />
                <button className='absolute right-2 bg-pink-500 text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider hover:bg-pink-400 transition-colors shadow-lg'>
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
