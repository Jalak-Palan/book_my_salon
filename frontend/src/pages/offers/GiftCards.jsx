import React, { useState } from 'react';
import { Gift, CreditCard, Send, CheckCircle2 } from 'lucide-react';

const GiftCards = () => {
  const [amount, setAmount] = useState(2500);
  const [selectedDesign, setSelectedDesign] = useState(1);

  const predefinedAmounts = [1000, 2500, 5000, 10000];
  const designs = [
    { id: 1, name: 'Luxury Gold', src: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=600' },
    { id: 2, name: 'Abstract Art', src: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600' },
    { id: 3, name: 'Minimalist Dark', src: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=600' }
  ];

  return (
    <div className="w-full bg-white max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-4">
          <Gift className="text-primary" size={48} /> E-Gift Cards
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Give the gift of pampering and self-care. Instantly deliverable, completely customizable, and never expires.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Card Preview & Design Selection */}
        <div className="space-y-8 sticky top-24">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[1.6/1] bg-slate-900 group">
            <img 
              src={designs.find(d => d.id === selectedDesign).src} 
              alt="Gift Card Base" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/70 font-medium tracking-widest text-sm mb-1 uppercase">Gift Card Value</p>
                  <p className="text-white text-5xl font-black">₹{amount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl font-bold tracking-wider">
                    BOOK MY SALON
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider">1. Select A Design</h3>
            <div className="grid grid-cols-3 gap-4">
              {designs.map(design => (
                <button 
                  key={design.id}
                  onClick={() => setSelectedDesign(design.id)}
                  className={`relative rounded-xl overflow-hidden h-24 border-4 transition-all ${selectedDesign === design.id ? 'border-primary scale-105 shadow-xl shadow-primary/20' : 'border-transparent hover:border-slate-300'}`}
                >
                  <img src={design.src} className="w-full h-full object-cover" />
                  {selectedDesign === design.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="space-y-8">
            
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider">2. Choose Amount</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {predefinedAmounts.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${amount === preset ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider">3. Recipient Details</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Recipient's Name" className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary focus:outline-none" />
                <input type="email" placeholder="Recipient's Email Address" className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary focus:outline-none" />
                <textarea placeholder="Personal Message (Optional)" rows={3} className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary focus:outline-none resize-none"></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-bold tracking-wider">Total Payable</span>
                <span className="text-3xl font-black text-slate-900">₹{amount.toLocaleString()}</span>
              </div>
              <button className="w-full bg-slate-900 hover:bg-black text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-lg shadow-black/20 flex justify-center items-center gap-3">
                <CreditCard size={24} /> Proceed to Secure Checkout
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GiftCards;
