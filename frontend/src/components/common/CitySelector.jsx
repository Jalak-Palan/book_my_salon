import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_CITIES = [
    'Agra', 'Ahmedabad', 'Ajmer', 'Aligarh', 'Allahabad', 'Amritsar', 'Aurangabad',
    'Bengaluru', 'Bhopal', 'Bhubaneswar', 'Chandigarh', 'Chennai', 'Coimbatore',
    'Dehradun', 'Delhi-NCR', 'Dhanbad', 'Faridabad', 'Ghaziabad', 'Guwahati',
    'Gwalior', 'Hyderabad', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar',
    'Jamshedpur', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolkata', 'Kota', 'Lucknow',
    'Ludhiana', 'Madurai', 'Meerut', 'Mumbai', 'Mysore', 'Nagpur', 'Nashik',
    'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi', 'Srinagar', 'Surat',
    'Thiruvananthapuram', 'Tiruchirappalli', 'Vadodara', 'Varanasi', 'Vijayawada',
    'Visakhapatnam', 'Warangal'
];

const CitySelector = ({ cities = [], currentCity = '', onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // The cities currently in the database (with salons)
    const activeCities = cities.length > 0 ? cities : ['Ahmedabad', 'Mumbai', 'Delhi', 'Bengaluru'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowAll(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (city) => {
        setIsOpen(false);
        setShowAll(false);
        if (onSelect) {
            onSelect(city);
        } else {
            navigate(`/city/${city}`);
        }
    };

    return (
        <div className="relative md:w-1/3" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-orange-50/50 border-2 ${isOpen ? 'border-orange-200 ring-4 ring-orange-50' : 'border-transparent'} py-4 pl-14 pr-6 rounded-3xl outline-none text-gray-700 font-bold transition-all duration-300 text-left relative group`}
            >
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform group-hover:scale-110 duration-300">
                    <MapPin className={`h-5 w-5 ${isOpen ? 'text-orange-600' : 'text-orange-500'}`} />
                </div>
                <span className="truncate">
                    {currentCity || 'Select your city...'}
                </span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 md:w-[520px] mt-3 bg-white rounded-[2.5rem] shadow-2xl border border-orange-50/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                        <div className="flex items-center justify-between px-2 mb-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Popular Cities
                            </div>
                            <div className="h-1 flex-1 mx-4 bg-gray-50 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {activeCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleSelect(city)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 text-left group ${currentCity === city ? 'bg-orange-500 text-white shadow-xl shadow-orange-200 scale-[0.98]' : 'hover:bg-orange-50 text-gray-700 hover:scale-[1.02]'}`}
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${currentCity === city ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white shadow-sm'}`}>
                                            <MapPin size={14} className={currentCity === city ? 'text-white' : 'text-orange-500'} />
                                        </div>
                                        <span className="font-extrabold tracking-tight text-sm truncate">{city}</span>
                                    </div>
                                    {currentCity === city && <Check size={16} className="text-white shrink-0 ml-1" />}
                                </button>
                            ))}
                        </div>

                        {!showAll ? (
                            <button
                                onClick={() => setShowAll(true)}
                                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-sm hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronDown size={18} />
                                View More Cities
                            </button>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between px-2 mb-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        All Cities
                                    </div>
                                    <div className="h-1 flex-1 mx-4 bg-gray-50 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {ALL_CITIES.filter(c => !activeCities.includes(c)).map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => handleSelect(city)}
                                            className={`flex items-center px-4 py-3 rounded-2xl hover:bg-orange-50 text-gray-700 transition-all duration-200 text-left group font-bold tracking-tight text-sm hover:scale-[1.02]`}
                                        >
                                            <div className="p-1.5 rounded-xl bg-gray-50 group-hover:bg-white mr-3 shrink-0 shadow-sm">
                                                <MapPin size={14} className="text-gray-400 group-hover:text-orange-500" />
                                            </div>
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-gray-50 text-center">
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Powered by BookMySalon Network</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitySelector;
