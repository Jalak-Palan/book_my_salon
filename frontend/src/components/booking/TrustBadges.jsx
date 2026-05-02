import React from 'react';

const TrustBadges = () => {
    return (
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-4 grayscale opacity-50">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">100%</div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">⭐</div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">Top Rated Professionals</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">⚡</div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">Instant Confirmation</span>
            </div>
        </div>
    );
};

export default TrustBadges;
