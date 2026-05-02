import React, { useState, useEffect } from 'react';
import { PercentCircle, Clock, Tag, ExternalLink } from 'lucide-react';

const SpecialOffers = () => {
  const [timeLeft, setTimeLeft] = useState(86400 * 2); // 2 days

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const offers = [
    { title: 'Summer Glow Up', desc: 'Flat 30% Off on all premium facials. Get ready for the beach season!', code: 'SUMMER30', tag: 'Facials', color: 'bg-rose-50 border-rose-200 text-rose-700' },
    { title: 'Weekday Retreat', desc: 'Book any spa service between Mon-Thu and get 20% cashback in your wallet.', code: 'WEEKDAYSPA', tag: 'Spa', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { title: 'First Time User', desc: 'Welcome! Enjoy ₹500 off on your first transaction above ₹1500.', code: 'WELCOME500', tag: 'All Services', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { title: 'Bridal Squad', desc: 'Book for a group of 4 or more and the bride gets her service absolutely free.', code: 'SQUADFREE', tag: 'Bridal', color: 'bg-orange-50 border-orange-200 text-orange-700' }
  ];

  return (
    <div className="w-full bg-white pb-20">
      
      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="bg-white/20 p-4 rounded-full">
              <PercentCircle size={48} className="text-white" />
            </div>
            <div>
              <span className="font-bold tracking-wider uppercase text-rose-100 text-sm">Flash Sale</span>
              <h2 className="text-4xl md:text-5xl font-black">Flat 50% Cashback</h2>
            </div>
          </div>
          <div className="text-center bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-rose-100 font-medium uppercase tracking-widest text-xs mb-2 flex items-center justify-center gap-1">
              <Clock size={14} /> Ends In
            </p>
            <p className="text-3xl tracking-widest font-mono font-bold">{formatTime(timeLeft)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Trending Deals & Offers</h1>
          <p className="text-lg text-slate-500">Apply these promo codes at checkout to unlock incredible savings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer, i) => (
            <div key={i} className={`p-8 rounded-3xl border-2 ${offer.color.split(' ')[1]} ${offer.color.split(' ')[0]} relative hover:-translate-y-1 transition-transform`}>
              <span className={`absolute top-6 right-6 ${offer.color.split(' ')[2]} bg-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${offer.color.split(' ')[1]}`}>
                {offer.tag}
              </span>
              <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm`}>
                <Tag className={offer.color.split(' ')[2]} size={24} />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${offer.color.split(' ')[2]}`}>{offer.title}</h3>
              <p className="text-slate-600 font-medium mb-8 leading-relaxed max-w-sm">{offer.desc}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-black/5 pt-6">
                <div className="flex-1 bg-white border-2 border-dashed border-slate-300 rounded-xl py-3 px-6 text-center w-full sm:w-auto">
                  <span className="font-mono font-black text-xl tracking-wider text-slate-800">{offer.code}</span>
                </div>
                <button className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-white shadow-lg transition-colors bg-slate-900 hover:bg-black`}>
                  Copy Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SpecialOffers;
