import React, { useState } from 'react';
import { Shield, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const Packages = () => {
  const [selectedTier, setSelectedTier] = useState('Premium');

  const packages = [
    {
      id: 1,
      title: 'Bridal Euphoria',
      price: '₹14,999',
      duration: '5 Hours',
      features: ['Pre-Bridal Consultation', 'HD Airbrush Makeup', 'Advanced Hair Styling', 'Luxury Spa Manicure & Pedicure', 'Saree/Lehenga Draping', 'Glowing Facial'],
      popular: true,
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Full Body Rejuvenation',
      price: '₹5,499',
      duration: '180 Mins',
      features: ['Deep Tissue Massage', 'Aromatherapy Bath', 'Dead Sea Mud Wrap', 'Scalp Treatment', 'Express Facial'],
      popular: false,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'The Gentleman Makeover',
      price: '₹3,299',
      duration: '90 Mins',
      features: ['Precision Haircut & Styling', 'Charcoal Detox Facial', 'Beard Spa & Shaping', 'Shoulder & Neck Massage'],
      popular: false,
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      title: 'Ultimate Glow Combo',
      price: '₹4,999',
      duration: '120 Mins',
      features: ['Gold Radiance Facial', 'L-Ascorbic Vitamin C Peel', 'Hydrating Hair Spa', 'Threading & Waxing Combo'],
      popular: false,
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="w-full bg-white bg-opacity-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-display mb-4">
            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Salon Packages</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Curated combinations of our most popular premium services. Bundled together to give you the ultimate relaxation and luxury at the best value.
          </p>
        </div>

        {/* Big Data Display - Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {packages.map((pkg) => (
            <div key={pkg.id} className="relative group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              {pkg.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles size={12} /> Best Seller
                  </span>
                </div>
              )}
              
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-0" />
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.title}</h3>
                    <div className="flex items-center text-slate-500 font-medium">
                      <Clock size={16} className="mr-1.5" /> {pkg.duration}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary">{pkg.price}</p>
                    <p className="text-sm text-slate-400 line-through mt-1">₹{Math.floor(parseInt(pkg.price.replace('₹', '').replace(',','')) * 1.3).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 mr-3" size={20} />
                      <span className="text-slate-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold tracking-wide hover:bg-primary transition-colors focus:ring-4 focus:ring-primary/20 flex justify-center items-center gap-2">
                  <Shield size={18} /> Review & Book Package
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Packages;
