import React from 'react';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getPremiumImage } from '../../services/utils';
import { premiumImages } from '../../utils/bookingUtils';

const BookingHeader = ({ salonId, passedSalon, salon, navigate }) => {
    return (
        <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-none">
                    <img
                        src={passedSalon?.image || getPremiumImage(salonId, premiumImages)}
                        alt={passedSalon?.name || salon?.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Complete Your Booking</h1>
                    <p className="text-gray-500 flex items-center text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-primary" /> {salon?.name || passedSalon?.name} &bull; {salon?.location || 'Nearby'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingHeader;
