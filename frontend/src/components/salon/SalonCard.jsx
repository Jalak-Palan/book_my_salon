import React from 'react';
import { Star, MapPin } from 'lucide-react';

const SalonCard = ({ salon, onClick }) => {
  return (
    <div 
      onClick={() => onClick(salon)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={salon.image} 
          alt={salon.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-slate-800 shadow-sm">
          <Star size={14} className="fill-orange-400 text-orange-400" />
          {salon.rating}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
          {salon.salonName || salon.name || 'Untitled Salon'}
        </h3>
        <p className="text-slate-500 text-sm mb-3 flex items-center justify-between gap-1 italic">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {salon.city || 'Location N/A'}
          </span>
          {salon.distance && (
            <span className="text-orange-600 font-bold not-italic">
              {(salon.distance / 1000).toFixed(1)} km
            </span>
          )}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {Array.isArray(salon.services) && salon.services.slice(0, 3).map((service, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-medium rounded-md uppercase tracking-wider border border-slate-100"
            >
              {typeof service === 'object' ? service.name : service}
            </span>
          ))}
          {Array.isArray(salon.services) && salon.services.length > 3 && (
            <span className="px-2 py-1 text-slate-400 text-[10px]">+{salon.services.length - 3} more</span>
          )}
          {(!salon.services || salon.services.length === 0) && (
             <span className="px-2 py-1 text-slate-400 text-[10px] italic">No services listed</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
