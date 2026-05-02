import React from 'react';

const ServiceSelector = ({ services, selectedService, setSelectedService }) => {
    return (
        <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">1. Select Service</h2>
            <div className="flex flex-wrap gap-3">
                {services?.map((service, idx) => {
                    const isSelected = selectedService === service;
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedService(service)}
                            className={`px-5 py-3 rounded-xl text-sm font-bold border transition-all ${isSelected
                                ? 'bg-orange-50 border-primary text-primary shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            {service}
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default ServiceSelector;
