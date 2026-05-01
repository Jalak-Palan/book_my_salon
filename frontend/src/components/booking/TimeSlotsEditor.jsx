import React from 'react';
import { Plus, CheckCircle, Clock, Users } from 'lucide-react';

const TimeSlotsEditor = ({ slots = [] }) => {
  // Only show slots for today for the dashboard overview
  const today = new Date().toISOString().split('T')[0];
  const todaySlots = slots.filter(s => {
    const slotDate = new Date(s.date).toISOString().split('T')[0];
    return slotDate === today;
  });

  return (
    <div className="slots-container">
      <div className="slots-header">
        <div className="flex flex-col">
          <h2>Today's Time Slots</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live Availability</p>
        </div>
        <button className="add-slot-btn opacity-50 cursor-not-allowed" title="Auto-generated based on Timings">
          <Clock size={14} />
          Auto
        </button>
      </div>
      <div className="slots-list custom-scrollbar px-1">
        {todaySlots.length > 0 ? (
          todaySlots.sort((a,b) => new Date(a.date) - new Date(b.date)).map((slot) => {
            const seatsLeft = slot.capacity - (slot.bookedCount || 0);
            const isFull = seatsLeft <= 0;
            
            return (
              <div key={slot._id} className={`slot-item ${isFull ? 'booked' : 'available'}`}>
                <div className="flex flex-col">
                  <span className="slot-time font-black">{slot.time}</span>
                  <span className="text-[9px] flex items-center gap-1 text-gray-400">
                    <Users size={10} /> {seatsLeft} / {slot.capacity} seats left
                  </span>
                </div>
                <span className="slot-status">
                  {isFull ? <CheckCircle size={14} className="text-red-500" /> : <Clock size={14} className="text-green-500" />}
                  {isFull ? 'Full' : 'Available'}
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-medium">No slots generated for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotsEditor;
