import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await API.get('/bookings');
                setBookings(response.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to load your bookings. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500 font-medium">Fetching your appointments...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
                    <p className="text-gray-500 text-sm">Manage your upcoming and past appointments</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="space-y-4">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Calendar className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{booking.salonId?.name || 'Salon'}</h3>
                                            <p className="text-sm text-gray-500 flex items-center mt-0.5">
                                                <MapPin className="w-3.5 h-3.5 mr-1" /> {booking.salonId?.location || 'Location'}
                                            </p>
                                            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> {booking.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-2 md:border-l border-gray-100 md:pl-8">
                                        <div className="flex items-center text-gray-700 font-bold">
                                            <Clock className="w-4 h-4 mr-2 text-primary" />
                                            {booking.slot?.time || 'Time'}
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium">
                                            {new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="text-primary font-black text-sm uppercase tracking-tighter mt-1">
                                            {booking.service}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800">No bookings yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">Book your first appointment today and get some amazing pampering!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            Explore Salons
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
