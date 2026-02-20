const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            {/* Content Placeholder */}
            <div className="p-6 space-y-4">
                {/* Rating */}
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                
                {/* Title */}
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                
                {/* Category */}
                <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                
                {/* Price & Button */}
                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-2">
                        <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
