import React, { useState } from 'react';
import { TrendingUp, CheckCircle, Zap, Crown, Star } from 'lucide-react';
import API from '../../../services/api';

const UpgradePanel = ({ salonId, currentStatus, onUpgrade }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleUpgrade = async (field, value) => {
        setLoading(true);
        setSuccess('');
        try {
            await API.put(`/salons/${salonId}/upgrade`, { [field]: value });
            setSuccess(`Successfully ${value ? 'enabled' : 'disabled'} ${field === 'isRecommended' ? 'Recommended' : 'Top Rated'} status!`);
            if (onUpgrade) onUpgrade();
        } catch (err) {
            console.error('Upgrade error:', err);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="font-black text-gray-900 text-lg">Promote Your Salon</h2>
            </div>

            {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recommended */}
                <div className={`rounded-xl p-5 border-2 transition-all ${currentStatus?.isRecommended ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500" />
                            <span className="font-bold text-gray-900">Recommended</span>
                        </div>
                        {currentStatus?.isRecommended && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-2 py-1 rounded-full">Active</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Feature your salon in the "Recommended For You" section on the homepage and get 3x more visibility.</p>
                    <button
                        onClick={() => handleUpgrade('isRecommended', !currentStatus?.isRecommended)}
                        disabled={loading}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${currentStatus?.isRecommended ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-orange-200'}`}
                    >
                        {loading ? 'Updating...' : currentStatus?.isRecommended ? 'Deactivate' : 'Activate — ₹999/mo'}
                    </button>
                </div>

                {/* Top Rated */}
                <div className={`rounded-xl p-5 border-2 transition-all ${currentStatus?.isTopRated ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold text-gray-900">Top Rated</span>
                        </div>
                        {currentStatus?.isTopRated && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-500 text-white px-2 py-1 rounded-full">Active</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Get listed in the "Top Rated Salons" section, shown to customers looking for the best salons in their city.</p>
                    <button
                        onClick={() => handleUpgrade('isTopRated', !currentStatus?.isTopRated)}
                        disabled={loading}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${currentStatus?.isTopRated ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-yellow-200'}`}
                    >
                        {loading ? 'Updating...' : currentStatus?.isTopRated ? 'Deactivate' : 'Activate — ₹1499/mo'}
                    </button>
                </div>
            </div>

            {/* Rating display */}
            {(currentStatus?.rating > 0) && (
                <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Star className="w-4 h-4 text-orange-400 fill-current shrink-0" />
                    <div>
                        <span className="font-black text-gray-900">{Number(currentStatus.rating).toFixed(1)}</span>
                        <span className="text-sm text-gray-500 ml-1">/ 5</span>
                        <span className="text-xs text-gray-400 ml-2">({currentStatus.reviewsCount || 0} reviews)</span>
                    </div>
                    {currentStatus.rating >= 4.0 && currentStatus.reviewsCount >= 3 && !currentStatus.isTopRated && (
                        <span className="ml-auto text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-1 rounded-lg">Eligible for Top Rated!</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default UpgradePanel;
