import React from 'react';
import { Building2, Users2, LineChart, Briefcase, ChevronRight, Check } from 'lucide-react';

const CorporateBookings = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl mt-4 mx-4 md:mx-0">
        <div className="absolute right-0 top-0 opacity-10">
          <Building2 size={400} className="transform translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="max-w-4xl relative z-10">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">B2B Enterprise Solutions</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Elevate Your Team's <br/>Corporate Wellness.</h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Partner with Book My Salon to offer exclusive grooming, spa, and wellness benefits to your employees. Boost morale and productivity with our zero-hassle corporate programs.
          </p>
          <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-all shadow-xl shadow-primary/30">
            Request Enterprise Demo <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Users2, title: 'Employee Perks', desc: 'Custom discounting on all network salons tailored for your workforce.' },
            { icon: LineChart, title: 'Dedicated Dashboard', desc: 'Track utilization, manage allowances, and distribute digital credits effortlessly.' },
            { icon: Briefcase, title: 'VIP Priority', desc: 'Priority booking and exclusive weekend B2B slots for executives.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-2 transition-transform">
              <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <h2 className="text-4xl font-black text-center mb-12 text-slate-900">Corporate Subscriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tag: 'Startup', emps: 'Up to 50 Employees', price: '₹14,999/mo', features: ['Flat 15% Off all services', 'Basic analytics dashboard', 'Email Support'] },
            { tag: 'Growth', emps: '50 - 250 Employees', price: '₹49,999/mo', focus: true, features: ['Flat 25% Off all services', 'Advanced HR API Integrations', 'Dedicated Account Manager', 'Quarterly On-site wellness camps'] },
            { tag: 'Enterprise', emps: '250+ Employees', price: 'Custom Quote', features: ['White-labeled booking portal', '100% Custom discounting logic', '24/7 VIP Concierge line', 'Monthly On-site massage stations'] }
          ].map((plan, i) => (
            <div key={i} className={`bg-white rounded-3xl border-2 ${plan.focus ? 'border-primary shadow-2xl relative transform md:-translate-y-4' : 'border-slate-100 shadow-xl'} overflow-hidden`}>
              {plan.focus && <div className="bg-primary text-white text-center py-2 font-bold uppercase tracking-widest text-sm">Most Popular</div>}
              <div className="p-8 border-b border-slate-100">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-2">{plan.tag}</p>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{plan.price}</h3>
                <p className="text-sm text-slate-400 font-medium">{plan.emps}</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start text-slate-600 font-medium">
                      <Check size={20} className="text-primary mr-3 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-colors ${plan.focus ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CorporateBookings;
