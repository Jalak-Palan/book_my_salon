import React from 'react';
import { X, Star, MapPin, Clock, Phone } from 'lucide-react';

const SalonModal = ({ salon, onClose }) => {
  if (!salon) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
        >
          <X size={24} />
        </button>

        <div className="h-64 relative">
          <img
            src={salon.image}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{salon.name}</h2>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                <Star size={16} className="fill-orange-400 text-orange-400" />
                {salon.rating || 4.5}
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                <MapPin size={16} />
                {salon.city || 'Location N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">About</h3>
              <p className="text-slate-600 leading-relaxed">
                {salon.about || "Experience premium grooming and beauty services at " + (salon.name || "our salon") + ". Our expert stylists are dedicated to bringing out your best look."}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Services</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(salon.services) && salon.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100 uppercase"
                  >
                    {service}
                  </span>
                ))}
                {(!salon.services || salon.services.length === 0) && (
                   <span className="text-slate-400 text-xs italic">No services available</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button className="flex-1 mr-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 uppercase tracking-widest text-sm">
              Book Appointment Now
            </button>
            <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all">
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default SalonModal;
