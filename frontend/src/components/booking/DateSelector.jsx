import React from 'react';
import { Sunrise } from 'lucide-react';

const DateSelector = ({ dates, selectedDate, setSelectedDate }) => {
    return (
        <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">2. Select Date</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 snap-x">
                {dates.map((d, index) => {
                    const isSelected = selectedDate === d.fullDate;
                    return (
                        <button
                            key={d.id}
                            onClick={() => setSelectedDate(d.fullDate)}
                            className={`flex-none flex flex-col items-center justify-center w-20 h-24 rounded-2xl transition-all snap-start border ${isSelected
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                }`}
                        >
                            <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                {d.dayName}
                            </span>
                            {index === 0 && !isSelected ? (
                                <Sunrise className="w-6 h-6 mt-2 text-primary" />
                            ) : (
                                <span className={`text-2xl font-black mt-1 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                    {d.dayNumber}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </section>
    );
};

export default DateSelector;
