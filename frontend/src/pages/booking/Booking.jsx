import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { generateDates } from '../../utils/bookingUtils';

import BookingHeader from '../../components/booking/BookingHeader';
import ServiceSelector from '../../components/booking/ServiceSelector';
import DateSelector from '../../components/booking/DateSelector';
import TimeSlotSelector from '../../components/booking/TimeSlotSelector';
import BookingSuccess from '../../components/booking/BookingSuccess';
import TrustBadges from '../../components/booking/TrustBadges';

const Booking = () => {
    const { id: salonId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const passedSalon = location.state?.salon;
    const { user } = useAuth();

    const dates = generateDates();
    const [salon, setSalon] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
    const [selectedSlotId, setSelectedSlotId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [salonRes, slotsRes] = await Promise.all([
                    API.get(`/salons/${salonId}`),
                    API.get(`/slots/${salonId}`)
                ]);

                setSalon(salonRes.data.data);
                setSlots(slotsRes.data.data);

                if (salonRes.data.data?.services?.length > 0) {
                    setSelectedService(salonRes.data.data.services[0]);
                }
            } catch (err) {
                setError('Failed to load booking details. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [salonId]);

    const handleBooking = async () => {
        if (!user) {
            setError('Please sign in to book an appointment.');
            return;
        }
        if (!selectedService || !selectedSlotId) {
            setError('Please select both a service and a time slot.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await API.post('/bookings', {
                salonId,
                service: selectedService,
                slotId: selectedSlotId,
                date: selectedDate
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500 font-medium">Setting up your appointment...</p>
            </div>
        );
    }

    if (success) {
        return (
            <BookingSuccess
                salon={salon}
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedSlotId={selectedSlotId}
                slots={slots}
                navigate={navigate}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in px-4 md:px-0">
            <BookingHeader 
                salonId={salonId} 
                passedSalon={passedSalon} 
                salon={salon} 
                navigate={navigate} 
            />

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 space-y-10">
                    <ServiceSelector 
                        services={salon?.services} 
                        selectedService={selectedService} 
                        setSelectedService={setSelectedService} 
                    />

                    <DateSelector 
                        dates={dates} 
                        selectedDate={selectedDate} 
                        setSelectedDate={setSelectedDate} 
                    />

                    <TimeSlotSelector 
                        slots={slots} 
                        selectedSlotId={selectedSlotId} 
                        setSelectedSlotId={setSelectedSlotId} 
                    />
                </div>

                {/* Footer Action */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-sm text-gray-500 font-medium italic">Final Step</p>
                            <h3 className="text-lg font-bold text-gray-800">
                                {selectedService || 'Select Service'} &bull; {slots.find(s => s._id === selectedSlotId)?.time || 'Select Time'}
                            </h3>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[240px]">
                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm font-semibold animate-shake">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handleBooking}
                                disabled={submitting || !selectedService || !selectedSlotId}
                                className={`w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-3 ${(submitting || !selectedService || !selectedSlotId) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02]'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Scheduling...
                                    </>
                                ) : (
                                    'Confirm and Book Appointment'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <TrustBadges />
        </div>
    );
};

export default Booking;
