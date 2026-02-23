import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

const LiveChatButton = () => {
    return (
        <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-8 left-8 z-[100]"
        >
            <motion.button
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className="group relative w-13 h-13 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-2xl overflow-hidden shadow-pink-500/20"
            >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Sparkle Decorations */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <Sparkles className="absolute top-2 right-2 w-3 h-3 text-white animate-pulse" />
                    <Sparkles className="absolute bottom-3 left-2 w-2 h-2 text-white animate-pulse animation-delay-1000" />
                </div>

                <MessageCircle className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-xl border border-white/10">
                    Live Support
                </div>
            </motion.button>
        </motion.div>
    );
};

export default LiveChatButton;
