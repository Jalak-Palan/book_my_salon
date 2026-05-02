import React from 'react';
import { Clock } from 'lucide-react';

const TimeSlotSelector = ({ slots, selectedSlotId, setSelectedSlotId }) => {
    return (
        <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">3. Select Time</h2>
            {slots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {slots.map((slot) => {
                        const isSelected = selectedSlotId === slot._id;
                        const seatsLeft = slot.capacity - (slot.bookedCount || 0);
                        const isAvailable = seatsLeft > 0;
                        return (
                            <button
                                key={slot._id}
                                disabled={!isAvailable}
                                onClick={() => setSelectedSlotId(slot._id)}
                                className={`px-4 py-4 rounded-2xl text-[14px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${!isAvailable
                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60'
                                    : isSelected
                                        ? 'bg-orange-50 border-primary text-primary shadow-sm ring-1 ring-primary/20'
                                        : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : (isAvailable ? 'text-gray-400' : 'text-gray-200')}`} />
                                    {slot.time}
                                </div>
                                {isAvailable && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-orange-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                        {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                    <p className="text-orange-700 font-medium">No slots available for this salon yet.</p>
                </div>
            )}
        </section>
    );
};

export default TimeSlotSelector;
