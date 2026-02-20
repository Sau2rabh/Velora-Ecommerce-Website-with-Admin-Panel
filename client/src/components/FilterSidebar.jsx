import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

const FilterSidebar = ({ 
    showMobileFilters, 
    setShowMobileFilters, 
    selectedCategory, 
    setSelectedCategory,
    categories,
    selectedPriceRanges,
    setSelectedPriceRanges
}) => {
    
    // Filter Accordion State (Local to Sidebar unless needed parent control)
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        colors: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className={`fixed inset-0 z-50 lg:static lg:z-auto lg:w-64 flex-shrink-0 transition-opacity duration-300 ${showMobileFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
             {/* Mobile Backdrop */}
             <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)}></div>

            <div className={`absolute inset-y-0 left-0 w-80 bg-white dark:bg-black shadow-2xl lg:shadow-none lg:static lg:w-auto lg:bg-transparent transform transition-transform duration-300 ease-out z-50 p-8 lg:p-0 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-colors duration-500`}>
                <div className="flex justify-between items-center lg:hidden mb-8">
                    <span className="font-bold text-xl uppercase tracking-tighter font-['Outfit'] text-gray-900 dark:text-white">Filter</span>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Categories Section */}
                    <div className="border-b border-gray-100 dark:border-white/5 pb-8">
                        <button 
                            onClick={() => toggleSection('categories')}
                            className="flex justify-between items-center w-full mb-6 group"
                        >
                            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors font-['Outfit']">Category</h4>
                            {expandedSections.categories ? <Minus className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" /> : <Plus className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />}
                        </button>
                        
                        <div className={`space-y-4 overflow-hidden transition-all duration-300 ${expandedSections.categories ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {categories.map(cat => (
                                <label key={cat} className="flex items-center gap-4 cursor-pointer group w-fit">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            className="peer sr-only"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-900 peer-checked:bg-black dark:peer-checked:bg-white peer-checked:border-black dark:peer-checked:border-white transition-all duration-200 group-hover:border-pink-500"></div>
                                        <div className="absolute w-2 h-2 bg-white dark:bg-black rounded-md opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                    </div>
                                    <span className={`text-[13px] tracking-wide font-bold transition-colors duration-200 ${selectedCategory === cat ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400'}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="border-b border-gray-100 dark:border-white/5 pb-8">
                        <button 
                            onClick={() => toggleSection('price')}
                            className="flex justify-between items-center w-full mb-6 group"
                        >
                            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors font-['Outfit']">Price</h4>
                            {expandedSections.price ? <Minus className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" /> : <Plus className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />}
                        </button>
                        <div className={`space-y-4 overflow-hidden transition-all duration-300 ${expandedSections.price ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹5000', '₹5000 - ₹10000', 'Above ₹10000'].map((range, idx) => (
                                <label key={idx} className="flex items-center gap-4 cursor-pointer group w-fit">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            className="peer sr-only" 
                                            checked={selectedPriceRanges.includes(range)}
                                            onChange={() => {
                                                if (selectedPriceRanges.includes(range)) {
                                                    setSelectedPriceRanges(prev => prev.filter(r => r !== range));
                                                } else {
                                                    setSelectedPriceRanges(prev => [...prev, range]);
                                                }
                                            }}
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-zinc-900 peer-checked:bg-black dark:peer-checked:bg-white peer-checked:border-black dark:peer-checked:border-white transition-all duration-200 group-hover:border-pink-500"></div>
                                        <svg className="absolute w-3 h-3 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className={`text-[13px] tracking-wide uppercase font-bold transition-colors duration-200 ${selectedPriceRanges.includes(range) ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400'}`}>{range}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
