import React from 'react';
import { User, Users, Home, Sparkles } from 'lucide-react';

const ServiceSelection = ({ setServiceType }) => {
  const options = [
    {
      id: 'men',
      title: 'Men Salon',
      icon: <User size={48} className="text-primary" />,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
      description: 'Expert grooming and styling for men'
    },
    {
      id: 'women',
      title: 'Women Salon',
      icon: <Sparkles size={48} className="text-primary" />,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600',
      description: 'Luxury hair and beauty care for women'
    },
    {
      id: 'home',
      title: 'Home Service',
      icon: <Home size={48} className="text-primary" />,
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600',
      description: 'Professional salon services at your doorstep'
    },
    {
      id: 'spa',
      title: 'Spa',
      icon: <Sparkles size={48} className="text-primary" />,
      image: '/images/spa-interior.png',
      description: 'Relaxation and wellness treatments'
    }
  ];

  const handleSelect = (id) => {
    localStorage.setItem('serviceType', id);
    setServiceType(id);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
      <div className="max-w-6xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
          Welcome to <span className="text-primary">BookMySalon</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please select a service type to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border-2 border-transparent hover:border-primary transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2 flex flex-col"
          >
            {/* Image Section */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={option.image}
                alt={option.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col items-center text-center flex-grow">
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {option.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-500 text-sm">{option.description}</p>
            </div>

            {/* Selection Overlay */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary/20 rounded-3xl pointer-events-none transition-all duration-500" />
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-gray-400">
        You can always change your selection later from the navigation bar.
      </p>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default ServiceSelection;
