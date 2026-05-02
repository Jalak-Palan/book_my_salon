import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const BookingSuccess = ({ salon, selectedService, selectedDate, selectedSlotId, slots, navigate }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center animate-fade-in">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-8">Your appointment at <span className="font-bold text-gray-700">{salon?.name}</span> has been successfully scheduled.</p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="font-bold text-gray-800">{selectedService}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-bold text-gray-800">{new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time</span>
                    <span className="font-bold text-gray-800">{slots.find(s => s._id === selectedSlotId)?.time}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                    View My Bookings
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default BookingSuccess;
