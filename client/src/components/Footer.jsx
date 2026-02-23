import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Globe,
  Lock,
  Headset,
  Truck,
  HelpCircle,
  FileText
} from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=100005047757462" },
        { Icon: Instagram, url: "https://www.instagram.com/anandsaurabh1127/" },
        { Icon: Linkedin, url: "https://www.linkedin.com/in/saurabh-anand-113271249/" }
    ];

    return (
        <footer className="relative bg-black pt-12 pb-8 overflow-hidden border-t border-white/5 font-sans">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-90" />
            
            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-black tracking-tighter text-white font-['Outfit']">
                                Velora<span className="text-pink-500">.</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-light">
                            Velora represents the pinnacle of premium lifestyle. We curate elegance, trend, and comfort for the modern connoisseur of fine fashion.
                        </p>
                        
                        {/* Newsletter Integrated */}
                        <div className="space-y-3">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Join the circle</h4>
                             <div className="relative max-w-xs group">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.08] transition-all"
                                />
                                <button className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white hover:bg-pink-500 transition-all shadow-xl shadow-pink-600/20 active:scale-95">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                         <div className="flex items-center gap-6">
                            {socialLinks.map((item, idx) => (
                                <a 
                                    key={idx} 
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <item.Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
                        
                        {/* Collections */}
                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 text-white relative flex items-center gap-3 whitespace-nowrap">
                                <span className="w-4 h-0.5 bg-pink-500 rounded-full" />
                                Collections
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Men', path: '/products?category=men' },
                                    { name: 'Women', path: '/products?category=women' },
                                    { name: 'Kids', path: '/products?category=kids' },
                                    { name: 'Home & Living', path: '/products?category=home' },
                                    { name: 'Beauty', path: '/products?category=beauty' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link 
                                            to={item.path} 
                                            className="text-gray-500 hover:text-white transition-all text-xs tracking-wide font-medium flex items-center gap-0 hover:gap-3 group"
                                        >
                                            <ChevronRight className="w-3 h-3 text-pink-500 opacity-0 group-hover:opacity-100 transition-all -ml-3" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Care */}
                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 text-white relative flex items-center gap-3 whitespace-nowrap">
                                <span className="w-4 h-0.5 bg-purple-600 rounded-full" />
                                Customer Care
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Help Center', path: '/help', icon: HelpCircle },
                                    { name: 'Contact Us', path: '/contact', icon: Headset },
                                    { name: 'FAQ', path: '/faq', icon: FileText },
                                    { name: 'Track Order', path: '/track', icon: Truck },
                                    { name: 'Shipping Policy', path: '/shipping', icon: Truck },
                                    { name: 'Returns & Refund', path: '/returns', icon: RefreshCw },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link 
                                            to={item.path} 
                                            className="text-gray-500 hover:text-white transition-all text-xs tracking-wide font-medium flex items-center gap-3 group"
                                        >
                                            <item.icon className="w-3.5 h-3.5 text-gray-700 group-hover:text-pink-500 transition-colors" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company & Legal */}
                        <div className="col-span-1 md:col-span-1">
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 text-white relative flex items-center gap-3 whitespace-nowrap">
                                <span className="w-4 h-0.5 bg-blue-500 rounded-full" />
                                Legal hub
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Privacy Policy', path: '/privacy' },
                                    { name: 'Terms of Service', path: '/terms' },
                                    { name: 'Cookie Policy', path: '/cookies' },
                                    { name: 'About Velora', path: '/about' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link 
                                            to={item.path} 
                                            className="text-gray-500 hover:text-white transition-all text-xs tracking-wide font-medium flex items-center gap-0 hover:gap-3 group"
                                        >
                                             <ChevronRight className="w-3 h-3 text-pink-500 opacity-0 group-hover:opacity-100 transition-all -ml-3" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/[0.02] rounded-[2rem] mb-12 border border-white/5 backdrop-blur-3xl">
                    <div className="flex items-center gap-6 px-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-pink-500 shadow-xl">
                             <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm tracking-wide">100% Original</div>
                            <div className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest font-black">Authenticity Guaranteed</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-6 md:border-l md:border-r border-white/5 px-4 md:px-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-purple-500 shadow-xl">
                             <RefreshCw className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm tracking-wide">14 Day Returns</div>
                            <div className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest font-black">Free hassle-free returns</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 px-4">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shadow-xl">
                             <Lock className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm tracking-wide">Secure Checkout</div>
                            <div className="text-gray-600 text-[10px] mt-1 uppercase tracking-widest font-black">PCI-DSS encrypted payments</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span>© 2026 Velora Inc.</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-600"></span>
                        <span>Made with excellence</span>
                    </div>
                    
                    {/* Localization */}
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-3 text-gray-500 hover:text-white cursor-pointer transition-colors text-xs font-bold uppercase tracking-widest group">
                            <Globe className="w-4 h-4 text-gray-700 group-hover:text-pink-500 transition-colors" /> 
                            Region: <span className="text-white">India</span>
                        </span>
                        <span className="text-white/10">|</span>
                        <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                             <div className="h-6 w-9 bg-white/10 rounded-md flex items-center justify-center border border-white/5">
                                <span className="text-[8px] font-black text-white italic">VISA</span>
                             </div>
                             <div className="h-6 w-9 bg-white/10 rounded-md flex items-center justify-center border border-white/5 gap-px">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-600/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500/80"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Internal Helper
const ChevronRight = ({ className }) => (
    <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.1584 3.13597C5.96314 2.94071 5.64655 2.94071 5.45129 3.13597C5.25603 3.33123 5.25603 3.64781 5.45129 3.84307L6.1584 3.13597ZM10.5 7.5L10.8536 7.85355C11.0488 7.65829 11.0488 7.34171 10.8536 7.14645L10.5 7.5ZM5.45129 11.1569C5.25603 11.3522 5.25603 11.6688 5.45129 11.864C5.64655 12.0593 5.96314 12.0593 6.1584 11.864L5.45129 11.1569ZM5.45129 3.84307L9.79289 8.18466L10.5 7.47755L6.1584 3.13597L5.45129 3.84307ZM9.79289 6.81534L5.45129 11.1569L6.1584 11.864L10.5 7.52136L9.79289 6.81534Z" fill="currentColor"/>
    </svg>
);


export default Footer;
