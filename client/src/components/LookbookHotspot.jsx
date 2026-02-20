import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const LookbookHotspot = ({ x, y, onClick, active }) => {
    return (
        <motion.button
            className="absolute z-20 group"
            style={{ top: `${y}%`, left: `${x}%` }}
            onClick={onClick}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
        >
            <span className="relative flex h-8 w-8">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${active ? 'bg-pink-400' : 'bg-white'}`}></span>
                <span className={`relative inline-flex rounded-full h-8 w-8 items-center justify-center shadow-lg transition-colors duration-300 ${active ? 'bg-pink-600' : 'bg-white'}`}>
                    <Plus className={`w-4 h-4 transition-transform duration-300 ${active ? 'text-white rotate-45' : 'text-gray-900 group-hover:rotate-90'}`} />
                </span>
            </span>
        </motion.button>
    );
};

export default LookbookHotspot;
