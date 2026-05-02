import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Logo from '../../components/common/Logo';

const PartnerRegistration = () => {
    return (
        <div className="max-w-lg mx-auto py-20 px-4 text-center">
            <Logo size="lg" className="mx-auto mb-8" />
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-8 h-8 text-orange-500" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-3">Become a Partner</h1>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    Partner accounts for salon owners are <strong className="text-gray-800">created and managed by our admin team</strong> to ensure quality and trust on our platform.
                </p>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 text-left space-y-2">
                    <p className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-3">How to get started</p>
                    <p className="text-sm text-gray-700 flex items-start gap-2"><span className="font-bold text-orange-500 mt-0.5">1.</span> Send your salon details to our team.</p>
                    <p className="text-sm text-gray-700 flex items-start gap-2"><span className="font-bold text-orange-500 mt-0.5">2.</span> Admin reviews and creates your account.</p>
                    <p className="text-sm text-gray-700 flex items-start gap-2"><span className="font-bold text-orange-500 mt-0.5">3.</span> You receive login credentials via email.</p>
                    <p className="text-sm text-gray-700 flex items-start gap-2"><span className="font-bold text-orange-500 mt-0.5">4.</span> Log in and manage your salon from Day 1.</p>
                </div>

                <a
                    href="mailto:admin@bookmysalon.in?subject=Partner%20Registration%20Request"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black text-base hover:bg-gray-800 transition-all shadow-xl"
                >
                    <Mail size={18} />
                    Contact Admin to Register
                    <ArrowRight size={18} />
                </a>

                <p className="mt-6 text-xs text-gray-400">
                    Already have an account? <Link to="/owner-login" className="text-orange-500 font-bold hover:underline">Sign In here</Link>
                </p>
            </div>
        </div>
    );
};

export default PartnerRegistration;
